/* ==========================================================================
   VENKADESHWARAN P - MOTION PORTFOLIO WEBSITE
   Interactive Motion & Animation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 1. DYNAMIC INTERACTIVE PARTICLES & CIRCUIT CANVAS BACKGROUND
  initBgCanvas();

  // 2. INTERACTION & SCROLL ANIMATIONS (IntersectionObserver)
  initScrollAnimations();

  // 3. FEATURED PROJECTS CAROUSEL SLIDER
  initProjectsCarousel();

  // 4. MINI SKILL CARD CANVAS ANIMATIONS
  initSkillCanvases();

  // 5. NAVBAR SCROLL EFFECT & MOBILE TOGGLE
  initNavbarControls();
});

/* ==========================================================================
   1. BACKGROUND CANVAS ANIMATION (Particles + Circuit Web)
   ========================================================================== */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  const particleCount = Math.min(80, Math.floor(width / 18));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(107, 63, 184, ' : 'rgba(0, 136, 255, '
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting circuit lines
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      // Update movement
      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0 || p1.x > width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > height) p1.vy *= -1;

      // Mouse magnetic reaction
      const dx = mouse.x - p1.x;
      const dy = mouse.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist) / mouse.radius;
        p1.x -= Math.cos(angle) * force * 1.5;
        p1.y -= Math.sin(angle) * force * 1.5;
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = p1.color + '0.8)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (distance < 130) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - distance / 130) * 0.25;
          ctx.strokeStyle = p1.color + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. SCROLL ANIMATIONS & INTERSECTION OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  // Staggered Skill Cards Observer
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 100;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  skillCards.forEach(card => skillObserver.observe(card));

  // Timeline Items Observer
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 100;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // Education Progress Bars Observer
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-progress');
        entry.target.style.width = targetWidth;
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  progressFills.forEach(fill => progressObserver.observe(fill));
}

/* ==========================================================================
   3. FEATURED PROJECTS CAROUSEL
   ========================================================================== */
function initProjectsCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!track) return;
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  const slideCount = dots.length || 3;
  let currentSlide = 0;
  let autoplayTimer;

  function updateCarousel(slideIndex) {
    currentSlide = (slideIndex + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlide + 1);
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlide - 1);
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Touch Swipe Support
  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateCarousel(currentSlide + 1);
      else updateCarousel(currentSlide - 1);
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();
}

/* ==========================================================================
   4. MINI SKILL CARD CANVAS ANIMATIONS
   ========================================================================== */
function initSkillCanvases() {
  // Neural Network Canvas
  const neuralCanvas = document.getElementById('neural-canvas');
  if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d');
    neuralCanvas.width = 250;
    neuralCanvas.height = 65;
    
    const layers = [3, 4, 3];
    const nodes = [];
    const layerSpacing = neuralCanvas.width / (layers.length + 1);
    
    layers.forEach((count, lIdx) => {
      const ySpacing = neuralCanvas.height / (count + 1);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: layerSpacing * (lIdx + 1),
          y: ySpacing * (i + 1),
          layer: lIdx
        });
      }
    });

    let step = 0;
    function drawNeural() {
      ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
      step += 0.05;

      // Draw connections
      nodes.forEach(n1 => {
        nodes.forEach(n2 => {
          if (n2.layer === n1.layer + 1) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            const pulse = (Math.sin(step + n1.x + n2.y) + 1) / 2;
            ctx.strokeStyle = `rgba(107, 63, 184, ${0.15 + pulse * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = n.layer === 1 ? '#0088ff' : '#6b3fb8';
        ctx.fill();
      });

      requestAnimationFrame(drawNeural);
    }
    drawNeural();
  }

  // Graph Canvas
  const graphCanvas = document.getElementById('graph-canvas');
  if (graphCanvas) {
    const ctx = graphCanvas.getContext('2d');
    graphCanvas.width = 250;
    graphCanvas.height = 65;
    let offset = 0;

    function drawGraph() {
      ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      offset += 0.04;

      ctx.beginPath();
      ctx.moveTo(0, graphCanvas.height / 2);

      for (let x = 0; x < graphCanvas.width; x += 5) {
        const y = graphCanvas.height / 2 + Math.sin(x * 0.04 + offset) * 15 + Math.cos(x * 0.02 + offset) * 8;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#00ffaa';
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(drawGraph);
    }
    drawGraph();
  }
}

/* ==========================================================================
   5. NAVBAR SCROLL EFFECT & MODAL LOGIC
   ========================================================================== */
function initNavbarControls() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Active Navbar Section
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Glass navbar scroll tint
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 17, 40, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 17, 40, 0.75)';
    }
  });

  if (mobileToggle && mobileDrawer) {
    const toggleIcon = mobileToggle.querySelector('i');
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileDrawer.classList.toggle('active');
      if (toggleIcon) {
        if (isActive) {
          toggleIcon.classList.remove('fa-bars');
          toggleIcon.classList.add('fa-xmark');
        } else {
          toggleIcon.classList.remove('fa-xmark');
          toggleIcon.classList.add('fa-bars');
        }
      }
    });
    
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        if (toggleIcon) {
          toggleIcon.classList.remove('fa-xmark');
          toggleIcon.classList.add('fa-bars');
        }
      });
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   PROJECT MODAL POPUP DATA & HANDLERS
   ========================================================================== */
const projectData = {
  1: {
    title: "AI-Enabled Aircraft Fault Prediction System",
    badge: "AI Predictive Maintenance",
    image: "assets/project_aircraft.png",
    description: "An end-to-end predictive diagnostic pipeline designed to continuously process multi-channel sensor telemetry from aircraft engines, hydraulic pumps, and avionics systems. The machine learning model forecasts micro-anomalies and component fatigue before physical breakdowns occur.",
    highlights: [
      "Significant increase in early fault detection accuracy compared to standard threshold alarms.",
      "Multi-variable feature engineering pipeline filtering noise from high-frequency vibration & thermal sensors.",
      "Custom classification framework predicting Remaining Useful Life (RUL) with probabilistic scoring."
    ],
    tech: ["Python", "Machine Learning", "Scikit-Learn", "Data Preprocessing", "Classification", "Sensors Telemetry"]
  },
  2: {
    title: "AgriFusion - Deep Learning & IoT for Sustainable Farming",
    badge: "Precision Agriculture",
    image: "assets/project_agrifusion.png",
    description: "Integrated smart agriculture ecosystem that combines computer vision Convolutional Neural Networks (CNNs) for instant crop disease classification with a mesh network of field IoT sensors measuring soil moisture, NPK levels, temperature, and humidity.",
    highlights: [
      "Achieved 94% crop disease classification accuracy across multi-leaf image datasets.",
      "Real-time sensor telemetry integration delivering instant notifications and irrigation triggers.",
      "Energy-optimized IoT sensor nodes engineered for extended outdoor field deployment."
    ],
    tech: ["Deep Learning", "CNN", "IoT Sensors", "Python", "Computer Vision", "OpenCV", "Embedded Systems"]
  },
  3: {
    title: "Zoho Cliqtrix Hackathon - Commercial Automation Bot",
    badge: "SalesIQ Bot Integration",
    image: "assets/project_zoho.png",
    description: "Developed during the nationwide Zoho Cliqtrix Hackathon, this commercial bot automates customer qualification, product catalog recommendations, and CRM sales lead routing natively inside Zoho Cliq and SalesIQ platforms.",
    highlights: [
      "Selected as a top Finalist solution in competitive hackathon evaluations.",
      "Reduced average initial response times to customer sales inquiries to under 2 seconds.",
      "Seamless REST API webhooks connecting chat flows directly with backend data pipelines."
    ],
    tech: ["Zoho Cliq", "Zoho SalesIQ", "Bot Scripting", "Automation", "REST APIs", "Workflow Matrix"]
  }
};

function openProjectModal(id) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('project-modal-content');
  const data = projectData[id];

  if (!data || !modal || !content) return;

  content.innerHTML = `
    <div style="display: inline-block; padding: 0.3rem 0.8rem; background: rgba(0, 136, 255, 0.15); border: 1px solid #0088ff; border-radius: 20px; font-size: 0.8rem; color: #80c4ff; font-weight: 700; margin-bottom: 0.75rem;">
      ${data.badge}
    </div>
    <h2 style="font-size: 1.8rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">${data.title}</h2>
    <div style="width: 100%; height: 220px; border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem;">
      <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <p style="color: #c0c0c0; line-height: 1.7; margin-bottom: 1.5rem; font-size: 0.98rem;">${data.description}</p>
    <h3 style="font-size: 1.1rem; color: #ff9d00; margin-bottom: 0.75rem;">Key Innovations & Impact:</h3>
    <ul style="color: #e0e0e0; font-size: 0.92rem; line-height: 1.7; margin-left: 1.2rem; margin-bottom: 1.5rem;">
      ${data.highlights.map(h => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
    </ul>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
      ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>
    <button class="btn btn-primary" onclick="closeProjectModal()" style="width: 100%;">Close Details</button>
  `;

  modal.classList.add('active');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   CONTACT MODAL POPUP & FORM SUBMISSION HANDLER
   ========================================================================== */
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) modal.classList.add('active');
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) modal.classList.remove('active');
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;

  alert(`Thank you ${name}! Your message has been sent successfully. Venkadeshwaran will reach out to you at ${email} shortly.`);
  closeContactModal();
  document.getElementById('modal-contact-form').reset();
}

// Close modals when clicking outside card
window.addEventListener('click', (e) => {
  const projectModal = document.getElementById('project-modal');
  const contactModal = document.getElementById('contact-modal');
  if (e.target === projectModal) closeProjectModal();
  if (e.target === contactModal) closeContactModal();
});
