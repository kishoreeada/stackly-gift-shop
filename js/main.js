document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const close = document.querySelector(".mobile-close");
  const body = document.body;

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    toggle.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("menu-open", open);

    if (open) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.classList.add("menu-is-open");
    } else {
      document.documentElement.classList.remove("menu-is-open");
    }

    if (open && window.gsap) {
      gsap.fromTo(".mobile-menu .mobile-nav-link",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: .42, stagger: .055, ease: "power3.out", clearProps: "transform" }
      );
      gsap.fromTo(".mobile-menu-actions .header-cta",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: .35, stagger: .06, delay: .12, ease: "power3.out", clearProps: "transform" }
      );
    }
  };

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  toggle?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  close?.addEventListener("click", () => setMenu(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("open")) {
      setMenu(false);
    }
  });

  // Keep the active page synchronized between header and footer.
  const currentPath = location.pathname.toLowerCase();
  const currentFile = (currentPath.split("/").pop() || "index.html").toLowerCase();
  let currentNav = "";
  if (currentPath.includes("/pages/shop/")) currentNav = "shop";
  else if (currentPath.includes("/pages/gift-guide/")) currentNav = "gift-guide";
  else if (currentPath.includes("/pages/about/")) currentNav = "about";
  else if (currentPath.includes("/pages/contact/")) currentNav = "contact";
  else if (currentFile === "index.html") currentNav = "home";
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = link.dataset.nav === currentNav;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  menu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  // All demo CTAs/unbuilt destinations intentionally land on the custom 404.
  document.querySelectorAll("[data-route404]").forEach(el => {
    el.addEventListener("click", (event) => {
      const href = (el.getAttribute("href") || "").toLowerCase();

      // Implemented pages must navigate normally.
      if (href === "signup.html" || href === "login.html") {
        setMenu(false);
        return;
      }

      event.preventDefault();
      setMenu(false);
      window.location.href = projectUrl("404.html");
    });
  });

  // Footer newsletter: empty/invalid input never navigates.
  const form = document.querySelector("#newsletterForm");
  const input = document.querySelector("#footerEmail");
  const status = document.querySelector("#newsletterStatus");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input?.value.trim() || "";
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    if (!valid) {
      if (status) {
        status.textContent = value ? "Please enter a valid email address." : "Please enter your email address.";
        status.style.color = "#f0b7aa";
      }
      input?.setAttribute("aria-invalid", "true");
      input?.focus();
      return;
    }

    if (status) {
      status.textContent = "Email verified. Taking you to the next page…";
      status.style.color = "#e7c9a1";
    }
    input?.setAttribute("aria-invalid", "false");

    setTimeout(() => {
      window.location.href = projectUrl("404.html");
    }, 650);
  });

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 70
    });
  }

  if (!window.gsap) return;
  const { gsap } = window;

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero-kicker span", { yPercent: 110, opacity: 0, duration: .65 })
    .from(".hero-title-line", { yPercent: 115, opacity: 0, duration: 1, stagger: .12 }, "-=.3")
    .from(".hero-description", { y: 20, opacity: 0, duration: .6 }, "-=.55")
    .from(".hero-actions>*", { y: 18, opacity: 0, duration: .5, stagger: .08 }, "-=.3")
    .from(".hero-meta", { y: 15, opacity: 0, duration: .45 }, "-=.25")
    .from(".hero-side-copy,.hero-scroll", { x: 18, opacity: 0, duration: .45, stagger: .1 }, "-=.4");

  gsap.to(".hero-media img", {
    scale: 1.12,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
  });

  gsap.to(".hero-orbit-one", {
    rotation: 18, x: 35, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
  });

  document.querySelectorAll(".product-photo img").forEach(image => {
    gsap.fromTo(image, { yPercent: -4 }, {
      yPercent: 4, ease: "none",
      scrollTrigger: { trigger: image.closest(".product-photo"), start: "top bottom", end: "bottom top", scrub: 1 }
    });
  });

  if (document.querySelector(".story-image-wrap")) {
    gsap.from(".story-image-wrap", {
      clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "power4.inOut",
      scrollTrigger: { trigger: ".story-image-wrap", start: "top 78%" }
    });
  }

  document.querySelectorAll(".magnetic").forEach(button => {
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(button, { x: x / 10, y: y / 10, duration: .22, ease: "power2.out" });
    });
    button.addEventListener("pointerleave", () => {
      gsap.to(button, { x: 0, y: 0, duration: .42, ease: "elastic.out(1,.45)" });
    });
  });
});
