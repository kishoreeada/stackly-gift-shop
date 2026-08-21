/* Stackly final navigation contract for nested project architecture. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((link) => {
    const href = (link.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:") ||
        href.startsWith("mailto:") || href.startsWith("tel:") ||
        href.startsWith("http://") || href.startsWith("https://")) return;

    const isLogo = link.matches(".brand, .auth-brand, .dash-brand");
    const isDashboardNav = link.matches(".dash-nav-link, .dashboard-nav-link");
    const isHeaderControl = !!link.closest(".site-header") &&
      (link.matches(".nav-link, .mobile-nav-link, .header-cta") || isLogo);
    const isAuthControl = link.matches(".auth-switch a, .auth-back, .auth-brand");

    if (isLogo) {
      link.setAttribute("href", projectUrl("index.html"));
      link.dataset.stacklyHome = "true";
      return;
    }

    if (isHeaderControl || isDashboardNav || isAuthControl || link.matches("[data-logout]")) return;

    link.dataset.route404 = "true";
    link.setAttribute("href", projectUrl("404.html"));
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-route404]");
    if (!link) return;
    event.preventDefault();

    const menu = document.querySelector(".mobile-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (menu) {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
    }
    toggle?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    document.documentElement.classList.remove("menu-is-open");

    window.location.href = projectUrl("404.html");
  });
});
