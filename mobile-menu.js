const mobileMenu = document.querySelector(".mobile-menu");
const mobileSummary = mobileMenu.querySelector("summary");
const mobileLanguagePicker = document.querySelector(".language-switch");
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.open = false;
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({preventScroll:true});
    }
  });
});
document.addEventListener("click", event => {
  if (!mobileMenu.contains(event.target)) mobileMenu.open = false;
});
mobileMenu.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    mobileMenu.open = false;
    mobileSummary.focus();
  }
});
mobileMenu.addEventListener("toggle", () => {
  if (mobileMenu.open) mobileLanguagePicker.open = false;
});
mobileLanguagePicker.addEventListener("toggle", () => {
  if (mobileLanguagePicker.open) mobileMenu.open = false;
});
window.matchMedia("(max-width:900px)").addEventListener("change", event => {
  if (!event.matches) mobileMenu.open = false;
});

