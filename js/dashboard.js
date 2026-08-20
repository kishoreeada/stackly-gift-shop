document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("lumeaSession") || "null");
  const pageRole = document.body.dataset.role;

  if (!session || session.role !== pageRole) {
    window.location.replace(projectUrl("auth/login.html"));
    return;
  }

  if (window.AOS) {
    AOS.init({ duration: 820, easing: "ease-out-cubic", once: true, offset: 55, disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches });
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

  // Demo actions still go to the custom 404, but real dashboard forms are functional.
  document.querySelectorAll(".dash-cta, .dash-panel button").forEach((button) => {
    if (button.closest("form[data-dashboard-form]")) return;
    button.addEventListener("click", (event) => {
      const href = button.getAttribute("href");
      if (href === "404.html") return;
      if (button.tagName === "BUTTON") {
        event.preventDefault();
        window.location.href = projectUrl("404.html");
      }
    });
  });

  // Dashboard forms: explicit validation for Support and Settings.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const formError = (field, message) => {
    const wrapper = field.closest(".dash-form-field");
    const target = wrapper?.querySelector(`[data-error-for="${field.name}"]`);
    wrapper?.classList.toggle("invalid", Boolean(message));
    if (target) target.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  document.querySelectorAll("form[data-dashboard-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const value = field.value.trim();
        let message = "";
        if (!value) message = `${field.closest(".dash-form-field")?.querySelector("label")?.textContent.replace("*","").trim() || "This field"} is required.`;
        if (!message && field.type === "email" && !emailPattern.test(value)) message = "Enter a valid email address.";
        if (!message && field.name === "message" && value.length < 10) message = "Please enter at least 10 characters.";
        formError(field, message);
        if (message) valid = false;
      });
      const success = form.querySelector("[data-form-success]");
      if (!valid) {
        if (success) success.textContent = "";
        form.querySelector(".dash-form-field.invalid input,.dash-form-field.invalid textarea")?.focus();
        return;
      }
      if (form.dataset.dashboardForm === "settings") {
        const data = Object.fromEntries(new FormData(form).entries());
        localStorage.setItem("stacklySettings", JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
        if (success) success.textContent = "Changes saved successfully.";
      } else {
        if (success) success.textContent = "Support request submitted successfully. Our team will review it shortly.";
        form.reset();
      }
      if (window.gsap && success) gsap.fromTo(success, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "power3.out" });
    });
    form.querySelectorAll("input,textarea").forEach(field => field.addEventListener("input", () => { if (field.value.trim()) formError(field, ""); }));
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