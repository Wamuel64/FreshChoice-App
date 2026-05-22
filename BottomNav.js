const tabs = [
  { id: 'groceries',    label: 'Groceries',    icon: 'ti-basket' },
  { id: 'meal-planner', label: 'Meal Planner', icon: 'ti-tools-kitchen-2' },
];

export function createBottomNav(onTabChange) {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'bottom-nav__tab';
    btn.dataset.tab = tab.id;
    btn.setAttribute('aria-label', tab.label);
    btn.innerHTML = `
      <span class="bottom-nav__icon-wrap">
        <i class="ti ${tab.icon}" aria-hidden="true"></i>
      </span>
      <span class="bottom-nav__label">${tab.label}</span>
    `;
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.bottom-nav__tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onTabChange?.(tab.id);
    });
    nav.appendChild(btn);
  });

  nav.querySelector('.bottom-nav__tab').classList.add('active');
  return nav;
}