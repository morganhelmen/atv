(() => {
  const menu = document.querySelector(".mobile-nav");
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.open) { menu.open = false; menu.querySelector("summary").focus(); }
  });
  const openTarget = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.tagName === "DETAILS") target.open = true;
  };
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
