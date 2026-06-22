(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    root.dataset.theme = storedTheme;
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const updateIcon = () => {
      const icon = themeToggle.querySelector(".theme-icon");
      if (icon) icon.textContent = root.dataset.theme === "dark" ? "☀" : "☾";
    };
    updateIcon();
    themeToggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", root.dataset.theme);
      updateIcon();
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navPanel.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt-card]"), {
      max: 10,
      speed: 600,
      glare: true,
      "max-glare": 0.16,
      perspective: 900
    });
  }

  const typing = document.querySelector(".typing-text");
  if (typing) {
    const words = (typing.dataset.words || "").split(",").map((w) => w.trim()).filter(Boolean);
    let wordIndex = 0;
    let letterIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex] || "";
      typing.textContent = deleting ? word.slice(0, letterIndex--) : word.slice(0, letterIndex++);

      if (!deleting && letterIndex > word.length + 8) deleting = true;
      if (deleting && letterIndex < 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        letterIndex = 0;
      }

      const delay = deleting ? 48 : 82;
      window.setTimeout(tick, delay);
    };

    tick();
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("[data-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      projectCards.forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const status = contactForm.querySelector(".form-status");

      if (!name || !email || !message) {
        if (status) status.textContent = "لطفاً همه فیلدها را کامل کنید.";
        return;
      }

      const subject = encodeURIComponent("پیام از سایت شخصی محمد علی پرسه");
      const body = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\n\nپیام:\n${message}`);
      window.location.href = `mailto:mohamadaliperse12@gmail.com?subject=${subject}&body=${body}`;

      if (status) status.textContent = "برنامه ایمیل شما باز می‌شود تا پیام ارسال شود.";
      contactForm.reset();
    });
  }
})();
