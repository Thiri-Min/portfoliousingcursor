(function () {
  "use strict";

  // Preloader
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader?.classList.add("hidden"), 400);
  });

  // Current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar scroll effect
  const navbar = document.getElementById("mainNav");
  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll("#mainNav .nav-link:not(.nav-cta)");

  const setActiveNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      if (!id) return;
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };
  window.addEventListener("scroll", setActiveNav, { passive: true });

  // Close mobile menu on link click
  const navCollapse = document.getElementById("navMenu");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse?.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        toggler?.click();
      }
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Counter animation for hero stats
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  // Back to top
  const backToTop = document.getElementById("backToTop");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        backToTop?.classList.add("visible");
      } else {
        backToTop?.classList.remove("visible");
      }
    },
    { passive: true }
  );
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Skill chip tilt (subtle)
  document.querySelectorAll(".skill-chip").forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      chip.style.transform = "scale(1.05) translateY(-2px)";
    });
    chip.addEventListener("mouseleave", () => {
      chip.style.transform = "";
    });
  });
})();
