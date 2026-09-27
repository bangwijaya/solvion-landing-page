/* ==========================================================================
   SOLVION DIGITAL AGENCY - CORE INTERACTION SCRIPT
   - Ultra-smooth Showcase Slider with Touch/Drag & Autoplay
   - Dynamic Mouse Spotlight Glow on Glassmorphism Cards
   - Interactive 3D Tilt for Hero Dashboard
   - Navbar Scroll Glass Transition & Mobile Drawer
   - Interactive Consultation Form with Toast Feedback
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. NAVBAR SCROLL EFFECT & ACTIVE STATE
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Back to top button visibility
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. MOBILE NAVIGATION DRAWER
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      });
    });
  }

  // 3. MOUSE SPOTLIGHT GLOW ON VALUE CARDS & SERVICE CARDS
  const spotlightCards = document.querySelectorAll('.value-card, .service-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. HERO 3D TILT EFFECT
  const heroCard = document.querySelector('.hero-card-3d');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroCard && heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 12;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 5. ULTRA-SMOOTH SHOWCASE SLIDER
  const track = document.querySelector('.slides-track');
  const slides = document.querySelectorAll('.slide-item');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const indicatorsContainer = document.querySelector('.slider-indicators');
  const counterCurrent = document.querySelector('.counter-current');
  const counterTotal = document.querySelector('.counter-total');
  const sliderViewport = document.querySelector('.slider-viewport');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Set total counter
    if (counterTotal) {
      counterTotal.textContent = String(totalSlides).padStart(2, '0');
    }

    // Build indicator dots dynamically
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Lihat Proyek ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplay();
        });
        indicatorsContainer.appendChild(dot);
      });
    }

    const updateSliderUI = () => {
      // Shift track
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      const dots = document.querySelectorAll('.indicator-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });

      // Update counter
      if (counterCurrent) {
        counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    };

    const goToSlide = (index) => {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateSliderUI();
    };

    // Button controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    // Autoplay function
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    startAutoplay();

    // Pause on hover
    if (sliderViewport) {
      sliderViewport.addEventListener('mouseenter', stopAutoplay);
      sliderViewport.addEventListener('mouseleave', startAutoplay);

      // Touch / Pointer Drag Gesture support
      const getPositionX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

      sliderViewport.addEventListener('touchstart', (e) => {
        stopAutoplay();
        startPos = getPositionX(e);
        isDragging = true;
      }, { passive: true });

      sliderViewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diffX = currentX - startPos;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            goToSlide(currentIndex - 1);
          } else {
            goToSlide(currentIndex + 1);
          }
          isDragging = false;
        }
      }, { passive: true });

      sliderViewport.addEventListener('touchend', () => {
        isDragging = false;
        startAutoplay();
      });
    }
  }

  // 5.1 MOBILE APP SHOWCASE SMARTPHONE SLIDER
  const mobileTrack = document.getElementById('mobileSlidesTrack');
  const mobileSlides = document.querySelectorAll('.mobile-slide-item');
  const mobilePrevBtn = document.getElementById('mobileSliderPrev');
  const mobileNextBtn = document.getElementById('mobileSliderNext');
  const mobileIndicators = document.getElementById('mobileSliderIndicators');
  const mobileCounterCurrent = document.getElementById('mobileCounterCurrent');
  const mobileCounterTotal = document.getElementById('mobileCounterTotal');
  const mobileViewport = document.getElementById('mobileSliderViewport');

  if (mobileTrack && mobileSlides.length > 0) {
    let currentMobileIndex = 0;
    const totalMobileSlides = mobileSlides.length;
    let mobileAutoplayTimer = null;
    let isMobileDragging = false;
    let mobileStartX = 0;

    // Set counter total
    if (mobileCounterTotal) {
      mobileCounterTotal.textContent = String(totalMobileSlides).padStart(2, '0');
    }

    // Build indicator dots dynamically
    if (mobileIndicators) {
      mobileIndicators.innerHTML = '';
      mobileSlides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `mobile-indicator-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Lihat Aplikasi ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToMobileSlide(idx);
          resetMobileAutoplay();
        });
        mobileIndicators.appendChild(dot);
      });
    }

    const updateMobileSliderUI = () => {
      mobileTrack.style.transform = `translateX(-${currentMobileIndex * 100}%)`;

      // Update dots
      const dots = mobileIndicators ? mobileIndicators.querySelectorAll('.mobile-indicator-dot') : [];
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentMobileIndex);
      });

      // Update counter
      if (mobileCounterCurrent) {
        mobileCounterCurrent.textContent = String(currentMobileIndex + 1).padStart(2, '0');
      }
    };

    const goToMobileSlide = (index) => {
      if (index < 0) {
        currentMobileIndex = totalMobileSlides - 1;
      } else if (index >= totalMobileSlides) {
        currentMobileIndex = 0;
      } else {
        currentMobileIndex = index;
      }
      updateMobileSliderUI();
    };

    // Button controls
    if (mobilePrevBtn) {
      mobilePrevBtn.addEventListener('click', () => {
        goToMobileSlide(currentMobileIndex - 1);
        resetMobileAutoplay();
      });
    }

    if (mobileNextBtn) {
      mobileNextBtn.addEventListener('click', () => {
        goToMobileSlide(currentMobileIndex + 1);
        resetMobileAutoplay();
      });
    }

    // Autoplay function: 5 seconds (5000ms)
    const startMobileAutoplay = () => {
      if (mobileAutoplayTimer) clearInterval(mobileAutoplayTimer);
      mobileAutoplayTimer = setInterval(() => {
        goToMobileSlide(currentMobileIndex + 1);
      }, 5000);
    };

    const stopMobileAutoplay = () => {
      if (mobileAutoplayTimer) {
        clearInterval(mobileAutoplayTimer);
        mobileAutoplayTimer = null;
      }
    };

    const resetMobileAutoplay = () => {
      stopMobileAutoplay();
      startMobileAutoplay();
    };

    startMobileAutoplay();

    // Pause on hover
    if (mobileViewport) {
      mobileViewport.addEventListener('mouseenter', stopMobileAutoplay);
      mobileViewport.addEventListener('mouseleave', startMobileAutoplay);

      // Touch / swipe gesture support
      mobileViewport.addEventListener('touchstart', (e) => {
        stopMobileAutoplay();
        mobileStartX = e.touches[0].clientX;
        isMobileDragging = true;
      }, { passive: true });

      mobileViewport.addEventListener('touchmove', (e) => {
        if (!isMobileDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - mobileStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            goToMobileSlide(currentMobileIndex - 1);
          } else {
            goToMobileSlide(currentMobileIndex + 1);
          }
          isMobileDragging = false;
        }
      }, { passive: true });

      mobileViewport.addEventListener('touchend', () => {
        isMobileDragging = false;
        startMobileAutoplay();
      });
    }
  }

  // 6. CONTACT FORM SUBMISSION & TOAST NOTIFICATION
  const contactForm = document.getElementById('consultationForm');
  const toast = document.getElementById('toast');

  const showToast = (message) => {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-message');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      // Show sending animation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"/>
        </svg> Mengirim Blueprint...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Terima kasih! Permintaan konsultasi Anda telah diterima. Lead Consultant Solvion akan menghubungi dalam 15 menit.');
        contactForm.reset();
      }, 1200);
    });
  }

  // 7. BACK TO TOP CLICK HANDLER
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
