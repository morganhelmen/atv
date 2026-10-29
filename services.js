(() => {
  const menus = [...document.querySelectorAll(".mobile-nav, .services-menu")];
  const closeMenus = () => menus.forEach(menu => { menu.open = false; });
  menus.forEach(menu => {
    menu.addEventListener("toggle", () => {
      if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenus));
  });
  document.addEventListener("click", event => {
    menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const opened = menus.find(menu => menu.open);
    if (opened) { closeMenus(); opened.querySelector("summary").focus(); }
  });
  document.querySelectorAll("nav a[href]").forEach(link => {
    if (link.getAttribute("href") === location.pathname) link.setAttribute("aria-current", "page");
  });
})();
