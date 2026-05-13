import './style.css';
import './components/BottomNav.css';
import './components/MealPlanner.css';
import './components/Cart.css';
import { createBottomNav } from './components/BottomNav.js';
import { createMealPlanner } from './components/MealPlanner.js';
import { initCart } from './components/Cart.js';
import { initPWA } from './pwa.js';

const app = document.querySelector('#app');

// Add padding so content sits below header
app.style.paddingTop = '56px';

const groceriesPage = document.createElement('section');
groceriesPage.className = 'groceries-page active';
groceriesPage.innerHTML = `<h1 style="padding:20px;font-size:22px;font-weight:600;">Shop Groceries</h1>`;

const mealPlannerPage = createMealPlanner();

app.appendChild(groceriesPage);
app.appendChild(mealPlannerPage);

initCart();

const nav = createBottomNav((tabId) => {
  groceriesPage.classList.toggle('active', tabId === 'groceries');
  mealPlannerPage.classList.toggle('active', tabId === 'meal-planner');
});

document.body.appendChild(nav);
initPWA(document.querySelector('#app'));