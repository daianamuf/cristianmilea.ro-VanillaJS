"use strict";

import PhotoSwipeLightbox from "node_modules/photoswipe/dist/photoswipe-lightbox.esm.js";

const isMobile = (userAgent) => {
  return !!(
    userAgent.toLowerCase().match(/android/i) ||
    userAgent.toLowerCase().match(/blackberry|bb/i) ||
    userAgent.toLowerCase().match(/iphone|ipad|ipod/i) ||
    userAgent
      .toLowerCase()
      .match(/windows phone|windows mobile|iemobile|wpdesktop/i)
  );
};

const onMobile = isMobile(window.navigator.userAgent);

// Stats timer //
const valueDisplays = document.querySelectorAll(".number");
const stats = document.querySelector(".stats-section__statistics");
let interval = 5000;

const statsTimer = function () {
  valueDisplays.forEach((valueDisplay) => {
    let startValue = 0;
    let endValue = parseInt(valueDisplay.getAttribute("data-val"));
    let duration = Math.floor(interval / endValue);
    let counter = setInterval(function () {
      startValue += 1;
      valueDisplay.textContent = startValue;
      if (startValue === endValue) {
        clearInterval(counter);
      }
    }, duration);
  });
};

const statsObserver = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  } else {
    statsTimer();
  }

  observer.unobserve(entry.target);
};

const obsStats = {
  root: null,
  threshold: 1,
};

const observerStats = new IntersectionObserver(statsObserver, obsStats);
observerStats.observe(stats);

// About Slider //
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
let currSlide = 0;
const maxSlide = slides.length;
const mediaQueryTablet = window.matchMedia("(max-width: 48em)");

const dotContainer = document.querySelector(".dots");

if (onMobile) {
  slider.classList.add("mobile");
}

const createDots = function () {
  slides.forEach(function (s, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;

    if (mediaQueryTablet.matches) {
      s.style.transform = `translateX(${120 * (i - slide)}%)`;
    }
  });
};

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

const init = function () {
  goToSlide(0);
  createDots();

  activateDot(0);
};
init();

sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", prevSlide);

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const sl = e.target.dataset.slide;
    goToSlide(sl);
    activateDot(sl);
  }
});

// Heading animation //
const headings = document.querySelectorAll(".heading");

const revealHeading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  } else {
    entry.target.classList.remove("heading__hidden");
    entry.target.classList.add("active");
  }

  observer.unobserve(entry.target);
};

const obsHeadingOptions = {
  root: null,
  threshold: 0.6,
};

const observerHeading = new IntersectionObserver(
  revealHeading,
  obsHeadingOptions
);

headings.forEach((heading) => observerHeading.observe(heading));

// // Sticky nav //
const hero = document.querySelector(".hero-section");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;
const sections = document.querySelectorAll(".section");

const stickyNav = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    nav.classList.remove("sticky");
  } else {
    nav.classList.add("sticky");
  }

  // observer.unobserve(entry.target);
};

const navObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.8,
});

// sections.forEach((section) => navObserver.observe(section));
navObserver.observe(hero);

// Nav btns //
const btnAbout = document.querySelector(".btn-about");
const btnGallery = document.querySelector(".btn-gallery");
const btnContact = document.querySelector(".btn-contact");
const sectionAbout = document.querySelector(".slider-container");
const sectionGallery = document.querySelector(".gallery");
const sectionContact = document.querySelector(".contact");

btnAbout.addEventListener("click", function (e) {
  sectionAbout.scrollIntoView({
    behavior: "smooth",
  });
});

btnGallery.addEventListener("click", function (e) {
  sectionGallery.scrollIntoView({
    behavior: "smooth",
  });
});

btnContact.addEventListener("click", function (e) {
  sectionContact.scrollIntoView({
    behavior: "smooth",
  });
});

// Sponsors Slider //
const sponsSlider = document.querySelector(".sponsors__slider");
const sponsSlides = document.querySelectorAll(".sponsors__slider--item");
let slidesArray = Array.from(sponsSlides);

const updateSlides = function () {
  slidesArray.forEach((el, i) => {
    const itemClasses = Array.from(el.classList).filter((cls) =>
      cls.includes("slider--item-")
    );
    el.classList.remove(...itemClasses);
    el.classList.add(`sponsors__slider--item-${i + 1}`);

    if (i >= 5) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  });
};

const setCurrentState = function () {
  slidesArray.push(slidesArray.shift());
  updateSlides();
};

setInterval(setCurrentState, 2500);

// Slide to home btn //
const upBtn = document.querySelector(".btn-up");
const footer = document.querySelector(".footer");

upBtn.addEventListener("click", function (e) {
  hero.scrollIntoView({
    behavior: "smooth",
  });
});

const scrollUp = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    upBtn.classList.add("hidden");
  } else {
    upBtn.classList.remove("hidden");
  }
};

const scrollUpObserver = new IntersectionObserver(scrollUp, {
  root: null,
  threshold: 0.1,
});

scrollUpObserver.observe(hero);

const scrollUpFooter = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    upBtn.style.bottom = "30%";
  } else {
    upBtn.style.bottom = "10%";
  }
};

const scrollUpFooterObserver = new IntersectionObserver(scrollUpFooter, {
  root: null,
  threshold: 0.2,
});

scrollUpFooterObserver.observe(footer);

/////////////////////////////
const mediaQueryPhone = window.matchMedia("(max-width: 34.9em)");
const statsHeading = document.querySelector(".stats-section__heading");
const headingQuery = function () {
  if (mediaQueryPhone.matches) {
    statsHeading.innerHTML =
      "Campion Mondial, European &#351;i Na&#539;ional &#238;n K1 la Categoria Lightweight";
  }
};
headingQuery();

////////////////////////////////

const lightbox = new PhotoSwipeLightbox({
  gallery: "#gallery__wrapper",
  children: "a",
  pswpModule: () => import("node_modules/photoswipe/dist/photoswipe.esm.js"),
});

lightbox.init();
