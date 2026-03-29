import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initTechnicalExpertise } from "@/lib/technical-expertise.js";

function createSectionHtml(itemCount = 3) {
  const items = Array.from({ length: itemCount })
    .map(
      (_, i) => `
      <div class="tech-exp__item" style="--tech-exp-delay: ${i * 90}ms">
        <div class="tech-exp__itemInner">
          <a class="tech-exp__skillLink" href="#skill-${i}">Skill ${i}</a>
        </div>
      </div>
    `
    )
    .join("");

  return `
    <div class="tech-exp">
      <div class="tech-exp__list">
        ${items}
      </div>
    </div>
  `;
}

describe("initTechnicalExpertise", () => {
  let storedObserverCallback: ((entries: any[]) => void) | null = null;

  beforeEach(() => {
    storedObserverCallback = null;
    document.documentElement.className = "";
    document.body.innerHTML = "";

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      };
    });

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn().mockImplementation((cb: (entries: any[]) => void) => {
        storedObserverCallback = cb;
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.className = "";
  });

  it("adds js class and reveals items via IntersectionObserver", () => {
    document.body.innerHTML = createSectionHtml(3);
    const root = document.querySelector(".tech-exp") as HTMLDivElement;
    const cleanup = initTechnicalExpertise(root);

    expect(document.documentElement.classList.contains("js")).toBe(true);

    const items = Array.from(root.querySelectorAll(".tech-exp__item"));
    expect(items.every((el) => !el.classList.contains("tech-exp__item--visible"))).toBe(true);

    storedObserverCallback?.([{ isIntersecting: true, target: items[0] }]);
    storedObserverCallback?.([{ isIntersecting: true, target: items[1] }]);
    storedObserverCallback?.([{ isIntersecting: true, target: items[2] }]);

    expect(items.every((el) => el.classList.contains("tech-exp__item--visible"))).toBe(true);

    cleanup();
  });

  it("activates hovered item and mutes siblings; clears instantly on mouseleave", () => {
    document.body.innerHTML = createSectionHtml(3);
    const root = document.querySelector(".tech-exp") as HTMLDivElement;
    const cleanup = initTechnicalExpertise(root);

    const items = Array.from(root.querySelectorAll(".tech-exp__item")) as HTMLDivElement[];
    items[1].dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

    expect(root.classList.contains("tech-exp--has-active")).toBe(true);
    expect(items[1].classList.contains("tech-exp__item--active")).toBe(true);
    expect(items[0].classList.contains("tech-exp__item--active")).toBe(false);
    expect(items[2].classList.contains("tech-exp__item--active")).toBe(false);

    items[1].dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(root.classList.contains("tech-exp--has-active")).toBe(false);
    expect(items.some((el) => el.classList.contains("tech-exp__item--active"))).toBe(false);
    expect(root.classList.contains("tech-exp--instant")).toBe(false);

    cleanup();
  });

  it("on touch-like devices, first tap prevents navigation and second tap navigates", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      return {
        matches: query.includes("(hover: none)"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      };
    });

    document.body.innerHTML = createSectionHtml(1);
    const root = document.querySelector(".tech-exp") as HTMLDivElement;
    const cleanup = initTechnicalExpertise(root);

    const link = root.querySelector(".tech-exp__skillLink") as HTMLAnchorElement;

    const first = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);

    const second = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(false);

    cleanup();
  });

  it("does nothing when prefers-reduced-motion is enabled", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      return {
        matches: query.includes("(prefers-reduced-motion: reduce)"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      };
    });

    document.body.innerHTML = createSectionHtml(2);
    const root = document.querySelector(".tech-exp") as HTMLDivElement;
    const cleanup = initTechnicalExpertise(root);

    expect(document.documentElement.classList.contains("js")).toBe(false);

    cleanup();
  });
});
