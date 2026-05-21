import './style.css'
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

/** ADDED BY AMELIA */

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('freshchoice_cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const counter = document.querySelector('.counter');
  if (counter) counter.textContent = totalItems;
}

/* The following line has been added by Amelia. */
updateCartCounter();

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
  //alert(`${name} added to cart!`);
  updateCartCounter();
}

/*This fetches the groceries from the JSON file and displays it*/
async function displayProducts() {
  const grid = document.getElementById('product_grid');
  
  try {
    const response = await fetch('/products_list.json'); //Wait for JSON file to load
    const products = await response.json();
    grid.innerHTML = ''; //Clear the grid HTML

    products.forEach(product => { //For each object in the JSON file, create a card displaying the item
      const card = document.createElement('div'); //Creating element
      card.className = 'product_card'; //Giving styles to element

      let tags = ''; //Clear tags
      if (product.food_type) tags += `<span class="tag">${product.food_type}</span>`; //If product has a food_type tag, apply it
      if (product.origin == "Local") tags += `<span class="local_tag">Local</span>`; //If product local, apply tag

      //This adds properties to the card so the search bar can find the item
      const searchKey = `${product.product_name} ${product.origin} ${product.food_type} ${product.vegetarian ? 'vegetarian' : ''} ${product.vegan ? 'vegan' : ''} ${product.organic ? 'organic' : ''} ${product.halal ? 'halal' : ''} ${product.dairy_free ? 'dairy_free' : ''} ${product.kosher ? 'kosher' : ''} ${product.nut_free ? 'nut_free' : ''} ${product.gluten_free ? 'gluten_free' : ''}`.toLowerCase();
      
      card.setAttribute('data-search', searchKey); //Setting attributes to the card

      //Creating the HTML for the card
      card.innerHTML = `
        <img class="product_images" src="images/${product.id}.webp" alt="${product.product_name}">
        <h5 class="product_name">${product.product_name}</h5>
        <div class="tags_container">${tags}</div>
        <p class="product_price">€${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.product_name}', ${product.price})" class="add_cart_btn">
          +
        </button>
      `;
      
      grid.appendChild(card); //Add the card to the Grid and rerun loop if more objects in JSON file
    });
  } catch (error) {
    console.error("Could not load products:", error);
    grid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

displayProducts(); //Run the card creator function

//The following is code for the search bar
const searchInput = document.getElementById('product_search');

//Listen for input in the search bar and run the following code
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase(); //Apply lowercase to the search term
  const productCards = document.querySelectorAll('.product_card'); //Select ALL cards

  //Check each card if the search term is included or partially included in a card's property
  productCards.forEach(card => { 
    const searchData = card.getAttribute('data-search');
    if (searchData.includes(searchTerm)) {
      card.style.display = 'block'; //Show the card if the search term is included
    } else {
      card.style.display = 'none'; //Hide the card if not
    }
  });
});

