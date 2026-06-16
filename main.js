import './style.css'
import javascriptLogo from './javascript.svg'
import appLogo from '/favicon.svg'
import { setupCounter } from './counter.js'
import { initPWA } from './pwa.js'


/*This fetches the groceries from the JSON file*/

async function displayProducts() { //wait to fetch the products before displaying them
  const grid = document.getElementById('product_grid');
  
  try {
    const response = await fetch('/products_list.json');
    const products = await response.json();

    // Clear the grid first
    grid.innerHTML = '';

    products.forEach(product => {
      // Create the product card element
      const card = document.createElement('div');
      card.className = 'product_card';

      // Generate tags
      let tags = '';
      if (product.food_type) tags += `<span class="tag">${product.food_type}</span>`;
      if (product.origin == "Local") tags += `<span class="local_tag">Local</span>`;

      // Fill the card with data
      card.innerHTML = `
        <img class="product_images" src="images/${product.id}.jpg" alt="${product.product_name}">
        <h5 class="product_name">${product.product_name}</h5>
        <div class="tags_container">${tags}</div>
        <p class="product_price"> €${product.price.toFixed(2)}</p>
        <button onclick="alert('Added ${product.product_name} to cart!')" class="add_cart_btn">
          +
        </button>
      `;

      grid.appendChild(card); // Add the grid
    });
  } catch (error) { //Error message if needed
    console.error("Could not load products:", error);
    grid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

// Initialises the creation of the cards with the products
displayProducts();









