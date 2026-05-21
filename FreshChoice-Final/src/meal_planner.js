import './style.css'
import { initPWA } from './pwa.js'
import './components/BottomNav.css';
import './components/MealPlanner.css';
import './components/Cart.css';
import { createBottomNav } from './components/BottomNav.js';
import { createMealPlanner } from './components/MealPlanner.js';
import { initCart } from './components/Cart.js';

// Start of A.I meal planner code
const app = document.querySelector('#app');

const groceriesPage = document.createElement('section');
groceriesPage.className = 'groceries-page active';
groceriesPage.innerHTML = `<h1 style="padding:20px;font-size:22px;font-weight:600;">Shop Groceries</h1>`;

const mealPlannerPage = createMealPlanner();

app.appendChild(groceriesPage);
app.appendChild(mealPlannerPage);
// End of A.I meal planner code

//Code for switching between the grocery page and meal planner page when clicking the bottom nav bar
const nav = createBottomNav((tabId) => {
 mealPlannerPage.classList.toggle('active', tabId === 'meal-planner');

  if (tabId === 'groceries') {
    window.location.href = 'index.html';
  } 
  else if (tabId === 'meal-planner') {
    window.location.href = 'meal_planner.html';
  }
});
//End of switching between the grocery page and meal planner page when clicking the bottom nav bar

document.body.appendChild(nav);

//Start of checking active tab for nav bar
const currentFile = window.location.pathname.split("/").pop();
const tabs = document.querySelectorAll('.bottom-nav__tab');

tabs.forEach(tab => {
  tab.classList.remove('active');

  const label = tab.querySelector('.bottom-nav__label').textContent.toLowerCase();

  if ((currentFile === 'index.html' || currentFile === '') && label.includes('groceries')) {
    tab.classList.add('active');
  } 
  else if (currentFile === 'meal_planner.html' && label.includes('planner')) {
    tab.classList.add('active');
  }
});
//End of checking active tab for nav bar

initPWA(document.querySelector('#app'));
//End of A.I meal planner code