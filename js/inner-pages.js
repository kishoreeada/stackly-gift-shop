
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("[data-contact-form]");

  const setError = (field, message) => {
    const wrapper = field.closest(".form-field");
    const target = wrapper?.querySelector(`[data-error-for="${field.name}"]`);
    wrapper?.classList.toggle("invalid", Boolean(message));
    if (target) target.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  forms.forEach(form => {
    form.querySelectorAll("input, textarea").forEach(field => {
      field.addEventListener("input", () => {
        if (field.name === "name") {
          const value = field.value.trim();
          if (!value) setError(field, "Your name is required.");
          else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(value)) setError(field, "Please use letters and spaces only.");
          else setError(field, "");
        }
        if (field.name === "email") {
          const value = field.value.trim();
          if (!value) setError(field, "Email address is required.");
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) setError(field, "Enter a valid email address.");
          else setError(field, "");
        }
        if (field.name === "message") {
          const value = field.value.trim();
          if (!value) setError(field, "Tell us a little about the gift.");
          else if (value.length < 10) setError(field, "Please enter at least 10 characters.");
          else setError(field, "");
        }
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const name=form.elements.name, email=form.elements.email, message=form.elements.message;
      let valid=true;

      if (!name.value.trim()) { setError(name,"Your name is required."); valid=false; }
      else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(name.value.trim())) { setError(name,"Please use letters and spaces only."); valid=false; }
      else setError(name,"");

      if (!email.value.trim()) { setError(email,"Email address is required."); valid=false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setError(email,"Enter a valid email address."); valid=false; }
      else setError(email,"");

      if (!message.value.trim()) { setError(message,"Tell us a little about the gift."); valid=false; }
      else if (message.value.trim().length < 10) { setError(message,"Please enter at least 10 characters."); valid=false; }
      else setError(message,"");

      const success=form.querySelector("[data-form-success]");
      if (!valid) {
        if (success) success.textContent="";
        form.querySelector(".invalid input,.invalid textarea")?.focus();
        return;
      }

      if (success) success.textContent="Thank you — your note is ready. Taking you to the next page…";
      form.querySelectorAll("input,textarea,button").forEach(el=>el.disabled=true);

      if (window.gsap) {
        gsap.fromTo(success,{y:8,opacity:0},{y:0,opacity:1,duration:.4,ease:"power3.out"});
      }
      setTimeout(()=>{ window.location.href=projectUrl("404.html"); },850);
    });
  });

  if (!window.gsap) return;
  const {gsap}=window;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const heroImage=document.querySelector(".inner-hero-image img");
  if (heroImage) {
    gsap.fromTo(heroImage,{scale:1.12,opacity:.65},{scale:1.04,opacity:1,duration:1.5,ease:"power3.out"});
    gsap.to(heroImage,{yPercent:8,ease:"none",scrollTrigger:{trigger:".inner-hero",start:"top top",end:"bottom top",scrub:1}});
  }

  const subHeroImage=document.querySelector(".sub-hero-image img");
  if (subHeroImage) {
    gsap.fromTo(subHeroImage,{clipPath:"inset(0 0 100% 0)",scale:1.08},{clipPath:"inset(0 0 0% 0)",scale:1,duration:1.2,ease:"power4.inOut"});
  }

  gsap.utils.toArray(".subpage-card").forEach((card,index)=>{
    gsap.from(card,{
      y:38,
      duration:.72,
      delay:index*.05,
      ease:"power3.out",
      scrollTrigger:{trigger:card,start:"top 92%",once:true}
    });
  });

  gsap.utils.toArray(".parent-feature,.shop-occasion-rail,.guide-language,.about-principles,.contact-paths,.closing-shop,.closing-guide,.closing-about,.closing-contact").forEach(section=>{
    gsap.from(section.querySelectorAll("h2,.inner-eyebrow,.shop-feature-points span,.guide-steps article,.contact-feature-actions a,.occasion-track a,.language-list article,.principles-grid article,.paths-grid a"),
      {y:24,duration:.65,stagger:.07,ease:"power3.out",
       scrollTrigger:{trigger:section,start:"top 88%",once:true}}
    );
  });

  gsap.utils.toArray(".subpage-close").forEach(section=>{
    gsap.from(section.querySelectorAll("h2,.inner-eyebrow,.subpage-close-row"),
      {y:24,duration:.65,stagger:.08,ease:"power3.out",
       scrollTrigger:{trigger:section,start:"top 88%",once:true}}
    );
  });

  gsap.utils.toArray(".subpage-card-image img,.mosaic-images img,.collage-main img,.collage-side>img").forEach(img=>{
    img.addEventListener("pointerenter",()=>gsap.to(img,{scale:1.045,duration:.6,ease:"power3.out"}));
    img.addEventListener("pointerleave",()=>gsap.to(img,{scale:1,duration:.8,ease:"power3.out"}));
  });

  gsap.utils.toArray(".inner-contact,.sub-details>div").forEach(el=>{
    el.addEventListener("pointerenter",()=>gsap.to(el,{y:-5,duration:.35,ease:"power2.out"}));
    el.addEventListener("pointerleave",()=>gsap.to(el,{y:0,duration:.45,ease:"power3.out"}));
  });
});
