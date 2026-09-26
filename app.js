(() => {
  "use strict";

  const config = window.BRAVA_CONFIG || {};
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const yearNodes = document.querySelectorAll("[data-year]");
  const page = document.body.dataset.page || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const phoneDigits = String(config.whatsappNumber || "").replace(/\D/g, "");
  const whatsappUrl = (message) =>
    `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message || config.defaultMessage || "Olá!")}`;

  window.Brava = {
    config,
    whatsappUrl,
    toast(message) {
      let toast = document.querySelector("[data-toast]");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.dataset.toast = "";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add("is-visible");
      clearTimeout(window.__bravaToastTimer);
      window.__bravaToastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
    }
  };

  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-business-name]").forEach((node) => {
    node.textContent = config.businessName || node.textContent;
  });

  document.querySelectorAll("[data-phone-display]").forEach((node) => {
    node.textContent = config.phoneDisplay || node.textContent;
  });

  document.querySelectorAll("[data-address]").forEach((node) => {
    node.textContent = config.address || node.textContent;
  });

  document.querySelectorAll("[data-phone-link]").forEach((node) => {
    node.href = `tel:+${phoneDigits}`;
  });

  document.querySelectorAll("[data-whatsapp]").forEach((node) => {
    const custom = node.dataset.message;
    node.href = whatsappUrl(custom || config.defaultMessage);
  });

  document.querySelectorAll("[data-maps]").forEach((node) => {
    node.href = config.mapsUrl || "#";
  });

  document.querySelectorAll("[data-google-review]").forEach((node) => {
    node.href = config.googleReviewUrl || "#";
  });

  document.querySelectorAll("[data-instagram]").forEach((node) => {
    node.href = config.instagramUrl || "#";
  });

  document.querySelectorAll(`[data-nav="${page}"]`).forEach((link) => {
    link.setAttribute("aria-current", "page");
    link.classList.add("is-active");
  });

  const updateScrollUI = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle("is-scrolled", y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = `${percent}%`;
    }
  };

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -5% 0px" });

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (node) => {
    const target = Number(node.dataset.count || 0);
    const suffix = node.dataset.suffix || "";
    const decimals = Number(node.dataset.decimals || 0);
    const duration = 1300;
    const start = performance.now();

    const frame = (time) => {
      const progressValue = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      const value = target * eased;
      node.textContent = `${value.toFixed(decimals)}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((node) => countObserver.observe(node));
  } else {
    counters.forEach((node) => {
      node.textContent = `${Number(node.dataset.count || 0).toFixed(Number(node.dataset.decimals || 0))}${node.dataset.suffix || ""}`;
    });
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector("[data-carousel-viewport]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!viewport) return;

    const step = () => {
      const card = viewport.querySelector(".review-card");
      if (!card) return viewport.clientWidth * 0.85;
      const gap = parseFloat(getComputedStyle(viewport.querySelector(".review-track")).columnGap || "18");
      return card.getBoundingClientRect().width + gap;
    };

    const scroll = (direction) => {
      viewport.scrollBy({ left: step() * direction, behavior: reduceMotion ? "auto" : "smooth" });
    };

    prev?.addEventListener("click", () => scroll(-1));
    next?.addEventListener("click", () => scroll(1));

    if (!reduceMotion && next) {
      let timer = setInterval(() => {
        const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 10;
        viewport.scrollTo({ left: atEnd ? 0 : viewport.scrollLeft + step(), behavior: "smooth" });
      }, 5500);

      carousel.addEventListener("mouseenter", () => clearInterval(timer));
      carousel.addEventListener("focusin", () => clearInterval(timer));
    }
  });

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.opacity = ".25";
      img.closest("figure, .hero-image-wrap, .split-image, .team-card__image, .service-detail__image")?.classList.add("image-missing");
    }, { once: true });
  });
})();
