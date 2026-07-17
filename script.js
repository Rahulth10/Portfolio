document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Particle Canvas Animation (Constellation Network)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        
        // Mouse interactiveness
        const mouse = {
            x: null,
            y: null,
            radius: 120
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor(x, y, vx, vy, size) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.size = size;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(192, 132, 252, 0.7)';
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#c084fc';
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }

            update() {
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Move particle
                this.x += this.vx;
                this.y += this.vy;

                // Check mouse proximity
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Push away slightly from mouse
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        this.x -= forceDirectionX * force * 1.5;
                        this.y -= forceDirectionY * force * 1.5;
                    }
                }
                
                this.draw();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            let numberOfParticles = 80;
            
            // Adjust particles count for smaller screen widths (performance optimization)
            if (window.innerWidth < 768) {
                numberOfParticles = 40;
            }

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 1.5 + 1;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                // Subtle movements
                const vx = (Math.random() - 0.5) * 0.4;
                const vy = (Math.random() - 0.5) * 0.4;
                
                particles.push(new Particle(x, y, vx, vy, size));
            }
        }

        // Draw connections
        function connectParticles() {
            const maxDistance = 110;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Opacity increases as distance decreases
                        const alpha = (1 - (distance / maxDistance)) * 0.15;
                        ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw gradient background
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, '#040814');
            grad.addColorStop(1, '#020409');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationFrameId);
            resizeCanvas();
            animate();
        });

        // Kickoff canvas
        resizeCanvas();
        animate();
    }

    // ==========================================================================
    // Mobile Responsive Navigation Menu
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // Sticky Header Scroll Effect
    // ==========================================================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // Navigation Indicator & Active Section Tracker
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const indicator = document.getElementById('nav-indicator');

    function updateNavIndicator(activeLink) {
        if (!indicator || !activeLink) return;
        
        // Don't show indicator if mobile menu is open/active
        if (window.innerWidth <= 768) {
            indicator.classList.remove('visible');
            return;
        }

        const rect = activeLink.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const containerRect = activeLink.parentElement.parentElement.getBoundingClientRect();

        // Calculate position relative to container
        const leftPos = rect.left - containerRect.left;
        
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${leftPos}px`;
        indicator.classList.add('visible');
    }

    function scrollSpy() {
        let currentSectionId = '';
        
        // Find which section is currently on screen
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                    updateNavIndicator(link);
                }
            });
        }
    }

    // Initialize Spy and update on actions
    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    });

    // Run initially
    scrollSpy();

    // ==========================================================================
    // Contact Form & Toast Notifications
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Remove toast on click of close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove toast after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Simple validation
            if (!name || !email || !subject || !message) {
                showToast('Please fill out all fields.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            setTimeout(() => {
                showToast(`Thank you, ${name}! Your message has been sent successfully.`);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        });
    }

    // ==========================================================================
    // Scroll Reveal Observer
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
