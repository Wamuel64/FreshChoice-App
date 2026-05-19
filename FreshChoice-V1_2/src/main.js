import './style.css'
import javascriptLogo from './javascript.svg'
import appLogo from '/favicon.svg'
import { setupCounter } from './counter.js'
import { initPWA } from './pwa.js'
import './components/BottomNav.css';
import { createBottomNav } from './components/BottomNav.js';

// Start of bottom nav bar
const nav = createBottomNav((tabId) => {
  if (tabId === 'groceries') {
    window.location.href = 'index.html';
  } 
  else if (tabId === 'meal-planner') {
    window.location.href = 'meal_planner.html';
  }
});

document.body.appendChild(nav);

// Add to cart function
window.addToCart = function(id, name, price) {
  const cart = JSON.parse(localStorage.getItem('freshchoice_cart')) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  localStorage.setItem('freshchoice_cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

/*This fetches the groceries from the JSON file*/
async function displayProducts() {
  const grid = document.getElementById('product_grid');
  
  try {
    const response = await fetch('/products_list.json');
    const products = await response.json();
    grid.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product_card';

      let tags = '';
      if (product.food_type) tags += `<span class="tag">${product.food_type}</span>`;
      if (product.origin == "Local") tags += `<span class="local_tag">Local</span>`;

      const searchKey = `${product.product_name} ${product.origin} ${product.food_type} ${product.vegetarian ? 'vegetarian' : ''} ${product.vegan ? 'vegan' : ''} ${product.organic ? 'organic' : ''} ${product.halal ? 'halal' : ''} ${product.dairy_free ? 'dairy_free' : ''} ${product.kosher ? 'kosher' : ''} ${product.nut_free ? 'nut_free' : ''} ${product.gluten_free ? 'gluten_free' : ''}`.toLowerCase();
      
      card.setAttribute('data-search', searchKey);

      card.innerHTML = `
        <img class="product_images" src="images/${product.id}.webp" alt="${product.product_name}">
        <h5 class="product_name">${product.product_name}</h5>
        <div class="tags_container">${tags}</div>
        <p class="product_price">€${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.product_name}', ${product.price})" class="add_cart_btn">
          +
        </button>
      `;
      
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Could not load products:", error);
    grid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

displayProducts();

const searchInput = document.getElementById('product_search');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product_card');

  productCards.forEach(card => {
    const searchData = card.getAttribute('data-search');
    if (searchData.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});