(() => {
  const header = document.querySelector('.site-header');
  const menu = header?.querySelector('.site-menu');
  const closeMenu = () => { if (menu) menu.open = false; };
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (menu && !menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      closeMenu();
      menu.querySelector('summary').focus();
    }
  });
  // Account for both rows when scrolling to an anchor on any screen size.
  if (header) {
    const updateHeight = () => document.documentElement.style.setProperty('--site-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    updateHeight();
    if ('ResizeObserver' in window) new ResizeObserver(updateHeight).observe(header);
    else window.addEventListener('resize', updateHeight);
  }
})();

