const body = document.body;
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const mobileMenu = document.querySelector<HTMLElement>(".mobile-menu");
const themeButton = document.querySelector<HTMLButtonElement>(".theme-toggle");
const yearElement = document.querySelector<HTMLElement>("[data-current-year]");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (menuButton && mobileMenu) {
  const closeMenu = (): void => {
    mobileMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });
}

if (themeButton) {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setTheme = (isDark: boolean): void => {
    body.classList.toggle("dark-theme", isDark);
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute(
      "aria-label",
      isDark ? "Switch to light colour theme" : "Switch to dark colour theme",
    );
  };

  setTheme(savedTheme ? savedTheme === "dark" : prefersDark);
  themeButton.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark-theme");
    setTheme(isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  });
}

const sectionLinks = document.querySelectorAll<HTMLAnchorElement>(
  ".desktop-nav a[href^='#'], .mobile-menu a[href^='#']",
);
const sections = document.querySelectorAll<HTMLElement>("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        sectionLinks.forEach((link) => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );
  sections.forEach((section) => sectionObserver.observe(section));
}
