(function () {
  "use strict";

  const galleryModalEl = document.getElementById("trainingPhotoGallery");
  if (!galleryModalEl) return;

  const galleryModal = new bootstrap.Modal(galleryModalEl, { backdrop: "static", keyboard: true });
  const carouselEl = document.getElementById("trainingCarousel");
  const carouselInner = document.getElementById("galleryCarouselInner");
  const indicatorsEl = document.getElementById("galleryIndicators");
  const titleEl = document.getElementById("trainingPhotoGalleryLabel");
  const counterEl = document.getElementById("gallerySlideCounter");
  const loadingEl = document.getElementById("galleryLoading");
  const emptyEl = document.getElementById("galleryEmpty");
  const prevBtn = document.getElementById("galleryPrevBtn");
  const nextBtn = document.getElementById("galleryNextBtn");

  let carouselInstance = null;

  const updateCounter = (activeIndex, total) => {
    if (counterEl) counterEl.textContent = `${activeIndex + 1} / ${total}`;
  };

  const setLoading = (isLoading) => {
    loadingEl?.classList.toggle("d-none", !isLoading);
    carouselEl?.classList.toggle("d-none", isLoading);
    emptyEl?.classList.add("d-none");
  };

  const showEmpty = () => {
    loadingEl?.classList.add("d-none");
    carouselEl?.classList.add("d-none");
    emptyEl?.classList.remove("d-none");
    prevBtn?.classList.add("d-none");
    nextBtn?.classList.add("d-none");
    if (counterEl) counterEl.textContent = "0 / 0";
  };

  const buildCarousel = (title, images) => {
    if (!images.length) {
      showEmpty();
      return;
    }

    loadingEl?.classList.add("d-none");
    emptyEl?.classList.add("d-none");
    carouselEl?.classList.remove("d-none");

    carouselInner.innerHTML = "";
    indicatorsEl.innerHTML = "";

    images.forEach((src, index) => {
      const item = document.createElement("div");
      item.className = `carousel-item${index === 0 ? " active" : ""}`;
      item.innerHTML = `<img src="${src}" class="d-block w-100 gallery-slide-img" alt="${title} — photo ${index + 1}" loading="lazy" />`;
      carouselInner.appendChild(item);

      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.setAttribute("data-bs-target", "#trainingCarousel");
      indicator.setAttribute("data-bs-slide-to", String(index));
      indicator.setAttribute("aria-label", `Slide ${index + 1}`);
      if (index === 0) {
        indicator.className = "active";
        indicator.setAttribute("aria-current", "true");
      }
      indicatorsEl.appendChild(indicator);
    });

    const showControls = images.length > 1;
    prevBtn?.classList.toggle("d-none", !showControls);
    nextBtn?.classList.toggle("d-none", !showControls);
    indicatorsEl.classList.toggle("d-none", !showControls);

    if (carouselInstance) carouselInstance.dispose();
    carouselInstance = new bootstrap.Carousel(carouselEl, { interval: false, wrap: true, touch: true });

    updateCounter(0, images.length);

    if (carouselEl._gallerySlidHandler) {
      carouselEl.removeEventListener("slid.bs.carousel", carouselEl._gallerySlidHandler);
    }
    carouselEl._gallerySlidHandler = (event) => updateCounter(event.to, images.length);
    carouselEl.addEventListener("slid.bs.carousel", carouselEl._gallerySlidHandler);
  };

  const openGallery = async (galleryId) => {
    setLoading(true);
    titleEl.textContent = "Training Photos";
    galleryModal.show();

    try {
      const response = await fetch(`assets/training/${galleryId}/manifest.json`);
      if (!response.ok) throw new Error("Manifest not found");
      const data = await response.json();
      titleEl.textContent = data.title || "Training Photos";
      buildCarousel(data.title, data.images || []);
    } catch {
      showEmpty();
    }
  };

  document.querySelectorAll(".training-gallery-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const galleryId = btn.getAttribute("data-gallery");
      if (galleryId) openGallery(galleryId);
    });
  });

  galleryModalEl.addEventListener("show.bs.modal", () => {
    const openModals = document.querySelectorAll(".modal.show");
    openModals.forEach((modal, index) => {
      modal.style.zIndex = String(1050 + index * 10);
    });
    galleryModalEl.style.zIndex = String(1050 + openModals.length * 10 + 10);
    const backdrop = document.querySelector(".modal-backdrop:last-of-type");
    if (backdrop) backdrop.style.zIndex = String(parseInt(galleryModalEl.style.zIndex, 10) - 1);
  });

  galleryModalEl.addEventListener("hidden.bs.modal", () => {
    if (carouselInstance) carouselInstance.dispose();
    carouselInstance = null;
    carouselInner.innerHTML = "";
    indicatorsEl.innerHTML = "";
  });
})();
