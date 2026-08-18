document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("lumeaSession") || "null");
  const pageRole = document.body.dataset.role;

  if (!session || session.role !== pageRole) {
    window.location.replace(projectUrl("auth/login.html"));
    return;
  }

  if (window.AOS) {
    AOS.init({
      duration: 820,
      easing: "ease-out-cubic",
      once: true,
      offset: 55,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }

  document.querySelectorAll("[data-session-email]").forEach((node) => {
    node.textContent = session.email || "Account";
  });

  const letter = (session.email?.[0] || "L").toUpperCase();
  document.querySelectorAll("[data-session-avatar]").forEach((node) => {
    node.textContent = letter;
  });

  const sidebar = document.querySelector(".dash-sidebar");
  const overlay = document.querySelector(".dash-overlay");
  const menuButton = document.querySelector(".dash-menu");
  const closeButton = document.querySelector(".dash-close");

  const setSidebar = (open) => {
    sidebar?.classList.toggle("open", open);
    overlay?.classList.toggle("open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("dashboard-menu-open", open);
  };

  menuButton?.addEventListener("click", () => setSidebar(true));
  closeButton?.addEventListener("click", () => setSidebar(false));
  overlay?.addEventListener("click", () => setSidebar(false));

  sidebar?.querySelectorAll(".dash-nav-link, .dashboard-nav-link").forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    const href = (link.getAttribute("href") || "").split("#")[0];
    const current = window.location.pathname.split("/").pop() || "index.html";
    const target = href.split("/").pop() || "index.html";
    if (target === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    link.addEventListener("click", () => setSidebar(false));
  });

  document.querySelectorAll("[data-logout]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("lumeaSession");
      window.location.href = projectUrl("auth/login.html");
    });
  });

  // Keep all action buttons intentionally unimplemented -> custom 404.
  document.querySelectorAll(".dash-cta, .dash-panel button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const href = button.getAttribute("href");
      if (href === "404.html") return;
      if (button.tagName === "BUTTON") {
        event.preventDefault();
        window.location.href = projectUrl("404.html");
      }
    });
  });

  if (window.gsap) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".dash-header", { y: -16, opacity: 0, duration: .55 })
        .from(".dash-hero > *", { y: 24, opacity: 0, duration: .65, stagger: .08 }, "-=.25")
        .from(".dash-stat", { y: 22, opacity: 0, duration: .5, stagger: .07 }, "-=.35")
        .from(".dash-panel", { y: 20, opacity: 0, duration: .55, stagger: .07 }, "-=.28");

      gsap.utils.toArray(".dash-stat").forEach((card) => {
        card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: .35, ease: "power3.out" }));
        card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, duration: .5, ease: "power3.out" }));
      });
    }
  }

  // Escape closes the mobile navigation.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });
});