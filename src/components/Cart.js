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

export function addMealToCart(meal) {
  // Clear old cart and add new meal ingredients
  cartItems = meal.ingredients.map((ingredient, i) => ({
    id: i,
    name: ingredient,
    price: null
  }));

  updateCartUI(meal);
  cartPanel.classList.add('open');
}

function updateCartUI(meal) {
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total');

  badgeEl.textContent = cartItems.length;
  badgeEl.style.display = cartItems.length > 0 ? 'flex' : 'none';

  if (cartItems.length === 0) {
    itemsEl.innerHTML = `<p class="cart-panel__empty">Your cart is empty</p>`;
    footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = `
    <div class="cart-panel__meal-name">${meal?.name || 'Meal ingredients'}</div>
  ${cartItems.map(item => `
  <div class="cart-panel__item">
    <span class="cart-panel__item-name">${item.name}</span>
    <button class="cart-panel__remove-btn" data-id="${item.id}">✕</button>
  </div>
`).join('')}
  `;
itemsEl.querySelectorAll('.cart-panel__remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = parseInt(btn.dataset.id);
    cartItems = cartItems.filter(item => item.id !== id);
    updateCartUI(meal);
  });
});
  footerEl.style.display = 'block';
  totalEl.textContent = `Total: ${meal?.totalCost || ''}`;
}