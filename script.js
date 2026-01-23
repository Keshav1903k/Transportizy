// Navigation functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Add scrolled class to navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Login Modal functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeButtons = document.querySelectorAll('.close');

loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Auth tabs switching
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        document.getElementById(`${targetTab}Form`).classList.add('active');
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login functionality would be implemented here!');
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Signup functionality would be implemented here!');
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Booking Modal functionality
const bookingModal = document.getElementById('bookingModal');
const bookingTitle = document.getElementById('bookingTitle');
const passengerRow = document.getElementById('passengerRow');
const cargoRow = document.getElementById('cargoRow');
const classSelect = document.getElementById('classSelect');

function openBookingForm(serviceType) {
    const titles = {
        'railway': 'Book Railway Ticket',
        'airways': 'Book Flight Ticket',
        'roadways': 'Book Bus Ticket',
        'cargo': 'Book Cargo Shipment'
    };
    
    bookingTitle.textContent = titles[serviceType] || 'Book Your Transport';
    
    // Show/hide appropriate form fields
    if (serviceType === 'cargo') {
        passengerRow.style.display = 'none';
        cargoRow.style.display = 'grid';
    } else {
        passengerRow.style.display = 'grid';
        cargoRow.style.display = 'none';
        
        // Update class options based on service
        const classOptions = {
            'railway': ['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First Class'],
            'airways': ['Economy', 'Premium Economy', 'Business', 'First Class'],
            'roadways': ['Seater', 'Semi-Sleeper', 'Sleeper', 'AC Sleeper']
        };
        
        if (classOptions[serviceType]) {
            classSelect.innerHTML = '<option value="">Select class</option>';
            classOptions[serviceType].forEach(option => {
                classSelect.innerHTML += `<option value="${option.toLowerCase().replace(/\s+/g, '-')}">${option}</option>`;
            });
        }
    }
    
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingForm() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Booking functionality would be implemented here! Your booking details have been received.');
    closeBookingForm();
});

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    e.target.reset();
});

// CTA button functionality
document.querySelector('.cta-button').addEventListener('click', () => {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe feature items
document.querySelectorAll('.feature-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate stats numbers on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const number = parseInt(text.replace(/\D/g, ''));
        let current = 0;
        const increment = number / 50;
        const suffix = hasPlus ? '+' : '';
        
        const updateCounter = () => {
            current += increment;
            if (current < number) {
                stat.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = number + suffix;
            }
        };
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statObserver.observe(stat);
    });
};

animateStats();

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect on hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Form validation enhancement
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

const validatePhone = (phone) => {
    return String(phone).match(/^[\d\s\-\+\(\)]+$/);
};

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#dc2626';
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.style.borderColor = '';
            this.setCustomValidity('');
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#dc2626';
            this.setCustomValidity('Please enter a valid phone number');
        } else {
            this.style.borderColor = '';
            this.setCustomValidity('');
        }
    });
});

// Add focus effects to form inputs
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

console.log('Transportizy website loaded successfully! 🚂✈️🚌📦');