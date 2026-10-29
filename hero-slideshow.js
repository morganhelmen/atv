(() => {
  const gallery = document.querySelector(".hero-slideshow");
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll(".hero-slide")];
  if (slides.length < 2) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let timer;
  let ready = false;
  let hovering = false;
  const stop = () => { clearInterval(timer); timer = undefined; };
  const show = (next) => {
    index = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", String(i !== index));
    });
  };
  const sync = () => {
    stop();
    if (reducedMotion.matches) { show(0); return; }
    if (ready && !document.hidden && !hovering) {
      timer = setInterval(() => show((index + 1) % slides.length), 6500);
    }
  };
  gallery.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") { hovering = true; sync(); }
  });
  gallery.addEventListener("pointerleave", () => { hovering = false; sync(); });
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  // Keep the original image if the second image cannot load.
  const nextImage = slides[1].querySelector("img");
  const loaded = () => { ready = true; sync(); };
  if (nextImage.complete) {
    if (nextImage.naturalWidth > 0) loaded();
  } else nextImage.addEventListener("load", loaded, { once: true });
})();
