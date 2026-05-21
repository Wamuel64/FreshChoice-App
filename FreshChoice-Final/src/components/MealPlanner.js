import { addMealToCart } from './Cart.js';

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Dairy-free',
  'Gluten-free', 'Low carb', 'Kosher', 'Nut-free', 'Organic', 'Local'
];

const FILTER_KEY_MAP = {
  'Vegetarian': 'vegetarian',
  'Vegan': 'vegan',
  'Halal': 'halal',
  'Dairy-free': 'dairy_free',
  'Gluten-free': 'gluten_free',
  'Kosher': 'kosher',
  'Nut-free': 'nut_free',
  'Organic': 'organic',
  'Local': 'local',
  'Low carb': null,
};

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('freshchoice_cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const counter = document.querySelector('.counter');
  if (counter) counter.textContent = totalItems;
}

export function createMealPlanner() {
  const section = document.createElement('section');
  section.className = 'meal-planner';

  section.innerHTML = `
    <h1 class="meal-planner__title">Meal Planner</h1>
    <p class="meal-planner__subtitle">We'll build a recipe from products available in store</p>

    <p class="meal-planner__section-label">Dietary preferences</p>
    <div class="meal-planner__filters" id="mp-filters"></div>

    <p class="meal-planner__section-label">Max budget (€)</p>
    <div class="meal-planner__budget-row">
      <input
        class="meal-planner__budget-input"
        type="number"
        id="mp-budget"
        placeholder="e.g. 15"
        min="1"
        max="200"
      />
      <span style="font-size:13px; color:#888;">euro per meal</span>
    </div>

    <button class="meal-planner__generate-btn" id="mp-generate">
      Generate my meal ✨
    </button>

    <div id="mp-result"></div>
  `;

  const filtersContainer = section.querySelector('#mp-filters');
  const selectedFilters = new Set();

  DIETARY_OPTIONS.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'meal-planner__filter-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (selectedFilters.has(opt)) {
        selectedFilters.delete(opt);
        btn.classList.remove('selected');
      } else {
        selectedFilters.add(opt);
        btn.classList.add('selected');
      }
    });
    filtersContainer.appendChild(btn);
  });

  section.querySelector('#mp-generate').addEventListener('click', () => {
    const budget = section.querySelector('#mp-budget').value;
    generateMeal(section, selectedFilters, budget);
  });

  return section;
}

async function loadProducts() {
  const res = await fetch('/products_list.json');
  return await res.json();
}

function filterProducts(products, selectedFilters, budget) {
  return products.filter(p => {
    if (budget && p.price > parseFloat(budget)) return false;
    for (const filter of selectedFilters) {
      const key = FILTER_KEY_MAP[filter];
      if (key && p[key] !== true) return false;
    }
    return true;
  });
}

async function generateMeal(section, selectedFilters, budget) {
  const resultDiv = section.querySelector('#mp-result');
  const btn = section.querySelector('#mp-generate');

  btn.disabled = true;
  resultDiv.innerHTML = `<div class="meal-planner__loading">Finding the perfect recipe for you...</div>`;

  try {
    const allProducts = await loadProducts();
    const available = filterProducts(allProducts, selectedFilters, budget);

    if (available.length === 0) {
      resultDiv.innerHTML = `<div class="meal-planner__error">No products match your filters and budget. Try adjusting them!</div>`;
      btn.disabled = false;
      return;
    }

    const productList = available
      .map(p => `- ${p.product_name} (€${p.price}, from ${p.origin})`)
      .join('\n');

    const filters = selectedFilters.size > 0
      ? [...selectedFilters].join(', ')
      : 'no specific dietary restrictions';

    const budgetText = budget ? `€${budget}` : 'no limit';

    const prompt = `You are a recipe assistant for a grocery store app called Fresh Choice.
A customer wants a meal with these preferences: ${filters}.
Their budget is: ${budgetText}.

Here are the products currently available in store:
${productList}

Create 1 recipe using ONLY products from the list above. Pick the ones that go well together.
Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "name": "Meal name",
  "description": "One sentence description",
  "totalCost": "€X.XX",
  "calories": "XXX kcal",
  "protein": "XXg",
  "carbs": "XXg",
  "fat": "XXg",
  "ingredients": ["product name - amount/how to use", "..."],
  "steps": ["Step description", "..."]
}`;

    const response = await fetch('/api/meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const raw = data.text.trim().replace(/```json|```/g, '').trim();
    const meal = JSON.parse(raw);

    //Matching ingredient list
    meal.validIngredientsList = [];

    //Run a loop for each ingredient in the meal
    meal.ingredients.forEach(ingredientStr => {
      const cleanIngredient = ingredientStr.toLowerCase();
      
      // Look for a product name match inside the JSON file catalog
      const matchedProduct = allProducts.find(p => 
        cleanIngredient.includes(p.product_name.toLowerCase())
      );

      // If found, push it to the list ingredient list. If NOT found, it gets completely ignored!
      if (matchedProduct) {
        meal.validIngredientsList.push({
          id: matchedProduct.id,
          name: matchedProduct.product_name,
          price: matchedProduct.price
        });
      }
    });

    renderMeal(resultDiv, meal);

  } catch (err) {
    resultDiv.innerHTML = `<div class="meal-planner__error">Something went wrong, please try again.</div>`;
    console.error(err);
  } finally {
    btn.disabled = false;
  }
}

 function renderMeal(container, meal) {
  container.innerHTML = `
    <div class="meal-planner__result">
      <div class="meal-planner__meal-name">${meal.name}</div>
      <div class="meal-planner__meal-desc">${meal.description}</div>

      <div class="meal-planner__nutrition">
        <div class="meal-planner__nutrition-pill">
          <span class="meal-planner__nutrition-value">${meal.calories}</span>
          <span class="meal-planner__nutrition-label">Calories</span>
        </div>
        <div class="meal-planner__nutrition-pill">
          <span class="meal-planner__nutrition-value">${meal.protein}</span>
          <span class="meal-planner__nutrition-label">Protein</span>
        </div>
        <div class="meal-planner__nutrition-pill">
          <span class="meal-planner__nutrition-value">${meal.carbs}</span>
          <span class="meal-planner__nutrition-label">Carbs</span>
        </div>
        <div class="meal-planner__nutrition-pill">
          <span class="meal-planner__nutrition-value">${meal.fat}</span>
          <span class="meal-planner__nutrition-label">Fat</span>
        </div>
        <div class="meal-planner__nutrition-pill">
          <span class="meal-planner__nutrition-value">${meal.totalCost}</span>
          <span class="meal-planner__nutrition-label">Cost</span>
        </div>
      </div>

      <div class="meal-planner__ingredients-title">Ingredients</div>
      <ul class="meal-planner__ingredients">
        ${meal.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>

      <div class="meal-planner__steps-title">How to make it</div>
      <ol class="meal-planner__steps">
        ${meal.steps.map((s, idx) => `
          <li>
            <span class="meal-planner__step-num">${idx + 1}</span>
            <span>${s}</span>
          </li>
        `).join('')}
      </ol>

      <button class="meal-planner__add-cart-btn" id="add-to-cart-btn">
        🛒 Add ingredients to cart
      </button>
    </div>
  `;

  container.querySelector('#add-to-cart-btn').addEventListener('click', () => {
    //Loop through ingredients list and add to cart using the same code as in the grocery page
    meal.validIngredientsList.forEach(item => {
      const id = item.id;
      const name = item.name;
      const price = item.price;
      //Going to local storage to check what is in the cart already
      const cart = JSON.parse(localStorage.getItem('freshchoice_cart')) || []; 
      const existing = cart.find(item => item.id === id);
      if (existing) { //If item already exists in cart, add 1
        existing.qty += 1;
      } else { //If new to cart, add the details
        cart.push({ id, name, price, qty: 1 });
      }
      localStorage.setItem('freshchoice_cart', JSON.stringify(cart)); //Update local storage cart details
    });
    alert(`Ingredients added to cart!`);
    updateCartCounter(); //Amelias cart counter function 
  });
}
updateCartCounter();