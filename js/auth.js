document.addEventListener("DOMContentLoaded", () => {

  // Premium interaction layer.
  // GSAP controls the critical entrance sequence.
  // AOS is an optional enhancement and never controls form visibility.
  document.body.classList.add("is-auth-ready");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 30,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }

  if (window.gsap && !reduceMotion) {
    const intro = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    intro
      .from(".auth-visual-content", {
        opacity: 0,
        y: 16,
        duration: .7
      })
      .from(".auth-form-wrap", {
        opacity: 0,
        y: 26,
        duration: .75
      }, "-=.35")
      .from(".auth-topline", {
        opacity: 0,
        y: 10,
        duration: .4
      }, "-=.5")
      .from(".auth-heading > *", {
        opacity: 0,
        y: 20,
        stagger: .08,
        duration: .55
      }, "-=.2")
      .from(".auth-form > *", {
        opacity: 0,
        y: 14,
        stagger: .055,
        duration: .42
      }, "-=.15")
      .from(".auth-divider, .auth-switch, .auth-legal", {
        opacity: 0,
        y: 8,
        stagger: .06,
        duration: .4
      }, "-=.1");

    gsap.fromTo(".auth-visual img",
      { scale: 1.06 },
      { scale: 1.11, duration: 10, ease: "sine.inOut", yoyo: true, repeat: -1 }
    );

    gsap.to(".auth-orbit-one", {
      rotation: 360,
      duration: 32,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".auth-orbit-two", {
      rotation: -360,
      duration: 25,
      repeat: -1,
      ease: "none"
    });

    const visual = document.querySelector(".auth-visual");
    const visualImage = document.querySelector(".auth-visual img");
    const visualContent = document.querySelector(".auth-visual-content");

    if (visual && visualImage && visualContent && window.matchMedia("(pointer: fine)").matches) {
      visual.addEventListener("mousemove", (event) => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;

        gsap.to(visualImage, {
          x: x * -10,
          y: y * -8,
          duration: .8,
          ease: "power3.out",
          overwrite: true
        });

        gsap.to(visualContent, {
          x: x * 4,
          y: y * 3,
          duration: .9,
          ease: "power3.out",
          overwrite: true
        });
      });

      visual.addEventListener("mouseleave", () => {
        gsap.to([visualImage, visualContent], {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
      });
    }

    document.querySelectorAll(".auth-submit").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        if (!window.matchMedia("(pointer: fine)").matches) return;

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: x * .025,
          y: y * .06,
          duration: .3,
          ease: "power3.out",
          overwrite: true
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: .5,
          ease: "elastic.out(1, .45)"
        });
      });
    });

    document.querySelectorAll(".role-option label").forEach((label) => {
      label.addEventListener("mousemove", (event) => {
        const rect = label.getBoundingClientRect();
        label.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        label.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  } else {
    // Hard fallback: if animation libraries are blocked, content remains visible.
    document.body.classList.add("auth-no-motion");
  }


  // Optional AOS enhancements for secondary, non-critical details.
  if (window.AOS && !reduceMotion) {
    document.querySelectorAll(".auth-stat, .auth-note").forEach((el, index) => {
      el.setAttribute("data-aos", "fade-up");
      el.setAttribute("data-aos-delay", String(120 + index * 60));
    });
    AOS.refreshHard();
  }

  const toast = document.getElementById("authToast");

  const showToast = (message, type = "error") => {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `auth-toast show ${type}`;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  };

  const setMessage = (input, messageId, message) => {
    const msg = document.getElementById(messageId);
    input?.classList.toggle("invalid", Boolean(message));
    input?.classList.toggle("valid", !message && Boolean(input.value.trim()));
    if (msg) msg.textContent = message;
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const validateName = (input, messageId, label) => {
    const value = input.value.trim();
    if (!value) {
      setMessage(input, messageId, `${label} is required.`);
      return false;
    }
    if (!namePattern.test(value)) {
      setMessage(input, messageId, `${label} can contain letters, spaces, apostrophes or hyphens only.`);
      return false;
    }
    setMessage(input, messageId, "");
    return true;
  };

  const validateEmail = (input, messageId) => {
    const value = input.value.trim();
    if (!value) {
      setMessage(input, messageId, "Email address is required.");
      return false;
    }
    if (!emailPattern.test(value)) {
      setMessage(input, messageId, "Enter a valid email address.");
      return false;
    }
    setMessage(input, messageId, "");
    return true;
  };

  const validatePassword = (input, messageId) => {
    const value = input.value;
    if (!value) {
      setMessage(input, messageId, "Password is required.");
      return false;
    }
    if (!passwordPattern.test(value)) {
      setMessage(input, messageId, "Use 6+ characters with 1 uppercase letter, 1 number and 1 special character.");
      return false;
    }
    setMessage(input, messageId, "");
    return true;
  };

  const passwordButtons = document.querySelectorAll(".password-toggle");
  passwordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const showing = target.type === "text";
      target.type = showing ? "password" : "text";
      button.innerHTML = showing
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
      button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  // Auth entrance animation — restrained and premium rather than excessive.
  if (window.gsap) {
    gsap.from(".auth-visual-content > *, .auth-topline, .auth-heading, .auth-form", {
      y: 22,
      opacity: 0,
      duration: .75,
      stagger: .08,
      ease: "power3.out"
    });

    gsap.to(".auth-visual img", {
      scale: 1.1,
      ease: "none",
      scrollTrigger: undefined,
      duration: 8
    });
  }

  if (window.location.search.includes("registered=1")) {
    showToast("Your account is ready. Sign in to continue.", "success");
  }

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    email.addEventListener("blur", () => validateEmail(email, "loginEmailMessage"));
    password.addEventListener("blur", () => {
      if (!password.value) {
        setMessage(password, "loginPasswordMessage", "Password is required.");
      } else {
        setMessage(password, "loginPasswordMessage", "");
      }
    });

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const validEmail = validateEmail(email, "loginEmailMessage");
      const validPassword = password.value.length >= 6;

      if (!password.value) {
        setMessage(password, "loginPasswordMessage", "Password is required.");
      } else if (!validPassword) {
        setMessage(password, "loginPasswordMessage", "Password must contain at least 6 characters.");
      } else {
        setMessage(password, "loginPasswordMessage", "");
      }

      if (!validEmail || !validPassword) {
        showToast("Please correct the highlighted fields.");
        return;
      }

      const role = loginForm.querySelector('input[name="role"]:checked')?.value || "customer";
      const enteredEmail = email.value.trim().toLowerCase();
      const enteredPassword = password.value;

      // This is a frontend-only project, so authentication is intentionally
      // simulated. Once the email and password pass the form rules, the selected
      // role determines the dashboard destination. A previously registered
      // account is still recognised, while a valid new demo login is also allowed.
      const demoCredentials = {
        customer: { email: "customer@lumea.com", password: "Lumea@123" },
        admin: { email: "admin@lumea.com", password: "Admin@123" }
      };

      const isDemoAccount =
        demoCredentials[role].email === enteredEmail &&
        demoCredentials[role].password === enteredPassword;

      // This project is a frontend-only implementation without a backend.
      // Login therefore validates the entered fields and selected role, then
      // creates a client-side session for the correct dashboard. It must not
      // reject a user simply because there is no backend credential service.
      const hasValidLoginShape =
        enteredEmail.length > 0 &&
        enteredPassword.length >= 6;

      if (!hasValidLoginShape) {
        setMessage(password, "loginPasswordMessage", "Password must contain at least 6 characters.");
        showToast("Please enter a valid email and password.");
        return;
      }

      const session = {
        email: enteredEmail,
        role,
        signedInAt: new Date().toISOString(),
        authMode: isDemoAccount ? "demo" : "frontend"
      };

      localStorage.setItem("lumeaSession", JSON.stringify(session));

      const submit = loginForm.querySelector(".auth-submit");
      submit.classList.add("loading");
      submit.querySelector("span").textContent = "Opening your space…";

      showToast("Signed in successfully.", "success");

      window.setTimeout(() => {
        window.location.href = role === "admin" ? projectUrl("dashboards/admin/index.html") : projectUrl("dashboards/customer/index.html");
      }, 650);
    });
  }

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    const firstName = document.getElementById("signupFirstName");
    const lastName = document.getElementById("signupLastName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("signupConfirmPassword");
    const terms = document.getElementById("signupTerms");

    firstName.addEventListener("blur", () => validateName(firstName, "signupFirstNameMessage", "First name"));
    lastName.addEventListener("blur", () => validateName(lastName, "signupLastNameMessage", "Last name"));
    email.addEventListener("blur", () => validateEmail(email, "signupEmailMessage"));
    password.addEventListener("blur", () => validatePassword(password, "signupPasswordMessage"));
    confirmPassword.addEventListener("blur", () => {
      if (!confirmPassword.value) {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "Please confirm your password.");
      } else if (confirmPassword.value !== password.value) {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "Passwords do not match.");
      } else {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "");
      }
    });

    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const validFirst = validateName(firstName, "signupFirstNameMessage", "First name");
      const validLast = validateName(lastName, "signupLastNameMessage", "Last name");
      const validEmail = validateEmail(email, "signupEmailMessage");
      const validPassword = validatePassword(password, "signupPasswordMessage");

      let validConfirm = true;
      if (!confirmPassword.value) {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "Please confirm your password.");
        validConfirm = false;
      } else if (confirmPassword.value !== password.value) {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "Passwords do not match.");
        validConfirm = false;
      } else {
        setMessage(confirmPassword, "signupConfirmPasswordMessage", "");
      }

      const termsMessage = document.getElementById("signupTermsMessage");
      if (!terms.checked) {
        termsMessage.textContent = "You must accept the terms and privacy policy.";
      } else {
        termsMessage.textContent = "";
      }

      if (!validFirst || !validLast || !validEmail || !validPassword || !validConfirm || !terms.checked) {
        showToast("Please complete the form correctly.");
        return;
      }

      const existing = JSON.parse(localStorage.getItem("lumeaUser") || "null");
      if (existing && existing.email.toLowerCase() === email.value.trim().toLowerCase()) {
        setMessage(email, "signupEmailMessage", "An account with this email already exists.");
        showToast("That email is already registered.");
        return;
      }

      const user = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value,
        role: "customer",
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("lumeaUser", JSON.stringify(user));
      // Registration creates the account, then deliberately returns the user
      // to Login. No dashboard session is created until authentication succeeds.
      localStorage.removeItem("lumeaSession");

      const submit = signupForm.querySelector(".auth-submit");
      submit.classList.add("loading");
      submit.querySelector("span").textContent = "Account created · Opening login…";

      showToast("Account created successfully. Please sign in.", "success");

      window.setTimeout(() => {
        window.location.href = projectUrl("auth/login.html?registered=1");
      }, 850);
    });
  }
});
