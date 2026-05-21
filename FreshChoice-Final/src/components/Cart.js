let cartItems = [];
let cartPanel = null;
let badgeEl = null;

export function initCart() {
  // Create header
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="app-header__logo">Fresh Ch<span>🟡</span>ice</div>
    <button class="app-header__cart-btn" id="cart-btn" aria-label="Open cart">
      <i class="ti ti-shopping-cart"></i>
      <span class="app-header__badge" id="cart-badge" style="display:none">0</span>
    </button>
  `;

  // Create cart panel
  cartPanel = document.createElement('div');
  cartPanel.className = 'cart-panel';
  cartPanel.id = 'cart-panel';
  cartPanel.innerHTML = `
    <div class="cart-panel__header">
      <span class="cart-panel__title">Your Cart</span>
      <button class="cart-panel__close" id="cart-close">✕</button>
    </div>
    <div class="cart-panel__items" id="cart-items">
      <p class="cart-panel__empty">Your cart is empty</p>
    </div>
    <div class="cart-panel__footer" id="cart-footer" style="display:none">
      <div class="cart-panel__total" id="cart-total"></div>
      <button class="cart-panel__checkout">Checkout</button>
    </div>
  `;

  badgeEl = header.querySelector('#cart-badge');

  header.querySelector('#cart-btn').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  cartPanel.querySelector('#cart-close').addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  document.body.prepend(cartPanel);
  document.body.prepend(header);
}

 // This function maps ingredient text to store properties right when the AI plan arrives
export async function addMealToCart(meal) {
  try {
    // 1. Fetch your official 28 products catalog
    const response = await fetch('/products_list.json');
    const storeProducts = await response.json();

    // 2. The AI matches and CREATES a list containing the exact object properties requested
    meal.matchedIngredientsList = meal.ingredients.map((ingredientName) => {
      const cleanIngredient = ingredientName.toLowerCase().trim();

      // Look for a close match in products_list.json
      const matchedProduct = storeProducts.find(product => {
        const cleanProductName = product.product_name.toLowerCase();
        return cleanProductName.includes(cleanIngredient) || cleanIngredient.includes(cleanProductName);
      });

      if (matchedProduct) {
        // Match found: list gets the official store values
        return {
          id: matchedProduct.id,
          name: matchedProduct.product_name,
          price: matchedProduct.price
        };
      } else {
        // No match found: fallback values so the cart function doesn't crash
        return {
          id: `gen-${cleanIngredient.replace(/[^a-z0-9]/g, '')}`,
          name: ingredientName,
          price: 0.00
        };
      }
    });

    // 3. NOW loop through the newly created list and execute your EXACT cart function logic
    meal.matchedIngredientsList.forEach(item => {
      // --- START OF YOUR EXACT CODE BLOCK ---
      const cart = JSON.parse(localStorage.getItem('freshchoice_cart')) || [];
      const existing = cart.find(itemInCart => itemInCart.id === item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
      }
      localStorage.setItem('freshchoice_cart', JSON.stringify(cart));
      // --- END OF YOUR EXACT CODE BLOCK ---
    });

    // Sync your Cart Panel layout items array state and show confirmation
    if (typeof cartItems !== 'undefined') {
      cartItems = JSON.parse(localStorage.getItem('freshchoice_cart')) || [];
    }
    
    updateCartUI(meal);
    cartPanel.classList.add('open');
    alert(`All ingredients for "${meal.name}" have been successfully added to your cart!`);

  } catch (error) {
    console.error("Error creating matching property list:", error);
  }
}