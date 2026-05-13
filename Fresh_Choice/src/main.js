import './style.css'
import javascriptLogo from './javascript.svg'
import appLogo from '/favicon.svg'
import { setupCounter } from './counter.js'
import { initPWA } from './pwa.js'
import './components/BottomNav.css';
import { createBottomNav } from './components/BottomNav.js';

// Start of bottom nav bar
const nav = createBottomNav((tabId) => {
  // Use a 'switch' or 'if' to check which button was clicked
  if (tabId === 'groceries') {
    window.location.href = 'index.html'; // Points to your grocery page
  } 
  else if (tabId === 'meal-planner') {
    window.location.href = 'meal_planner.html'; // Points to your planner page
  }
});

document.body.appendChild(nav);
// End of bottom nav bar
//End of bottom nav bar


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

      const searchKey = `${product.product_name} ${product.origin} ${product.food_type} ${product.vegetarian ? 'vegetarian' : ''} ${product.vegan ? 'vegan' : ''} ${product.organic ? 'organic' : ''} ${product.halal ? 'halal' : ''} ${product.dairy_free ? 'dairy_free' : ''} ${product.kosher ? 'kosher' : ''} ${product.nut_free ? 'nut_free' : ''} ${product.gluten_free ? 'gluten_free' : ''}`.toLowerCase();
      
      card.setAttribute('data-search', searchKey); // Store it on the card


      // Fill the card with data
      card.innerHTML = `
        <img class="product_images" src="images/${product.id}.webp" alt="${product.product_name}">
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

/*
// Add this at the bottom of your main.js file
const searchInput = document.getElementById('product_search');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product_card');

  productCards.forEach(card => {
    // Get the product name from the h5 inside each card
    const productName = card.querySelector('.product_name').textContent.toLowerCase();
    
    // If the name matches the search, show it; otherwise, hide it
    if (productName.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
*/

/*
const searchInput = document.getElementById('product_search');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product_card');

  productCards.forEach(card => {
    // 1. Get the text from the name and price elements
    const productName = card.querySelector('.product_name').textContent.toLowerCase();
    
    // 2. Get all tags (Food Type, Local, etc.) inside this card
    const tags = Array.from(card.querySelectorAll('.tag, .local_tag'))
                      .map(t => t.textContent.toLowerCase());

    // 3. Check if the search term matches the name OR any of the tags
    const matchesName = productName.includes(searchTerm);
    const matchesTags = tags.some(tag => tag.includes(searchTerm));

    // 4. Show the card if any property matches
    if (matchesName || matchesTags) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
*/

const searchInput = document.getElementById('product_search');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product_card');

  productCards.forEach(card => {
    // Just get that one hidden "cheat sheet" string
    const searchData = card.getAttribute('data-search');

    if (searchData.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});



