(() => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window)) return;
  const items = Array.from(document.querySelectorAll(
    ".section-title, .cards, .pricing-box, .process-copy, .process-list, .about-card, .faq-inner, .contact-copy, .contact-form, .weather-heading, #forecast"
  ));
  let observer;
  const show = element => {
    element.classList.add("is-visible");
    if (observer) observer.unobserve(element);
  };
  const showAll = () => {
    items.forEach(show);
    if (observer) observer.disconnect();
  };
  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) show(entry.target);
      });
    }, {threshold: 0, rootMargin: "0px 0px -24px 0px"});
    items.forEach(element => {
      // Do not hide content already on screen, or above the viewport after an anchor jump.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add("scroll-reveal");
      observer.observe(element);
    });
    document.addEventListener("focusin", event => {
      const target = event.target.closest(".scroll-reveal");
      if (target) show(target);
    });
    const revealAnchor = () => {
      if (!location.hash) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
      if (target) target.querySelectorAll(".scroll-reveal").forEach(show);
    };
    window.addEventListener("hashchange", revealAnchor);
    preference.addEventListener("change", event => { if (event.matches) showAll(); });
    revealAnchor();
  } catch {
    showAll();
  }
})();

