export function initTechnicalExpertise(rootEl) {
  if (!rootEl || typeof window === "undefined") return () => {};

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  if (prefersReducedMotion) return () => {};

  document.documentElement.classList.add("js");

  const container = rootEl;
  const items = Array.from(container.querySelectorAll(".tech-exp__item"));

  const makeInstant = () => {
    container.classList.add("tech-exp--instant");
    requestAnimationFrame(() => {
      container.classList.remove("tech-exp--instant");
    });
  };

  const activate = (item) => {
    if (!item) return;
    container.classList.add("tech-exp--has-active");
    items.forEach((el) => {
      el.classList.toggle("tech-exp__item--active", el === item);
    });
  };

  const deactivateAll = () => {
    makeInstant();
    container.classList.remove("tech-exp--has-active");
    items.forEach((el) => el.classList.remove("tech-exp__item--active"));
  };

  const reveal = (item) => {
    item.classList.add("tech-exp__item--visible");
  };

  let observer;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach(reveal);
  }

  const onMouseEnter = (e) => {
    activate(e.currentTarget);
  };

  const onMouseLeave = () => {
    deactivateAll();
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", onMouseEnter);
    item.addEventListener("mouseleave", onMouseLeave);
  });

  const onFocusIn = (e) => {
    const focusedItem = e.target.closest?.(".tech-exp__item");
    activate(focusedItem);
  };

  const onFocusOut = (e) => {
    const next = e.relatedTarget;
    if (!next || !container.contains(next)) {
      deactivateAll();
    }
  };

  container.addEventListener("focusin", onFocusIn);
  container.addEventListener("focusout", onFocusOut);

  const isTouchLike = window.matchMedia?.("(hover: none)")?.matches === true;
  let lastTouchedLink = null;

  const onClick = (e) => {
    if (!isTouchLike) return;
    const link = e.target.closest?.(".tech-exp__skillLink");
    if (!link) return;

    if (lastTouchedLink !== link) {
      e.preventDefault();
      e.stopPropagation();
      lastTouchedLink = link;
      activate(link.closest(".tech-exp__item"));
      return;
    }

    lastTouchedLink = null;
  };

  const onDocumentClick = (e) => {
    if (!container.contains(e.target)) {
      lastTouchedLink = null;
      deactivateAll();
    }
  };

  container.addEventListener("click", onClick);
  document.addEventListener("click", onDocumentClick);

  return () => {
    observer?.disconnect?.();
    items.forEach((item) => {
      item.removeEventListener("mouseenter", onMouseEnter);
      item.removeEventListener("mouseleave", onMouseLeave);
    });
    container.removeEventListener("focusin", onFocusIn);
    container.removeEventListener("focusout", onFocusOut);
    container.removeEventListener("click", onClick);
    document.removeEventListener("click", onDocumentClick);
  };
}
