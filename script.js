// Transportizy Main Javascript Engine

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Shared Layout: Navigation Scroll & Mobile Hamburger Menu
    // -------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Add sticky behavior on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Navigation Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Shared Notification Alert Banner
    // -------------------------------------------------------------------------
    const alertBanner = document.getElementById('alertBanner');
    const alertIcon = document.getElementById('alertIcon');
    const alertMessage = document.getElementById('alertMessage');
    let alertTimeout;

    function showAlert(message, type = 'success') {
        if (!alertBanner) return;
        
        clearTimeout(alertTimeout);
        alertMessage.textContent = message;
        
        if (type === 'success') {
            alertIcon.textContent = '✓';
            alertBanner.classList.remove('danger');
        } else {
            alertIcon.textContent = '✗';
            alertBanner.classList.add('danger');
        }
        
        alertBanner.classList.add('active');
        
        alertTimeout = setTimeout(() => {
            alertBanner.classList.remove('active');
        }, 4000);
    }

    // -------------------------------------------------------------------------
    // 3. Mock Authentication System (localStorage)
    // -------------------------------------------------------------------------
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Load initial users if not present
    if (!localStorage.getItem('transportizy_users')) {
        localStorage.setItem('transportizy_users', JSON.stringify([
            { name: 'Keshav K.', email: 'admin@transportizy.com', phone: '1234567890', password: 'password' }
        ]));
    }

    // Modal display control
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Close profile dropdown clicking outside
        if (userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });

    // Auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            const formId = tab.getAttribute('data-tab') + 'Form';
            document.getElementById(formId).classList.add('active');
        });
    });

    // Handle user registration
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('signupName').value;
            const emailInput = document.getElementById('signupEmail').value;
            const phoneInput = document.getElementById('signupPhone').value;
            const passInput = document.getElementById('signupPassword').value;
            const confirmPass = document.getElementById('signupConfirmPassword').value;

            if (passInput.length < 6) {
                showAlert('Password must be at least 6 characters long.', 'danger');
                return;
            }

            if (passInput !== confirmPass) {
                showAlert('Passwords do not match. Please verify.', 'danger');
                return;
            }

            const users = JSON.parse(localStorage.getItem('transportizy_users'));
            if (users.find(u => u.email === emailInput)) {
                showAlert('An account with this email already exists.', 'danger');
                return;
            }

            // Save new user
            const newUser = { name: nameInput, email: emailInput, phone: phoneInput, password: passInput };
            users.push(newUser);
            localStorage.setItem('transportizy_users', JSON.stringify(users));

            // Log user in automatically
            localStorage.setItem('transportizy_current_user', JSON.stringify(newUser));
            updateAuthUI();
            
            signupForm.reset();
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            showAlert(`Welcome to Transportizy, ${newUser.name}!`);
        });
    }

    // Handle user login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('loginEmail').value;
            const passInput = document.getElementById('loginPassword').value;

            const users = JSON.parse(localStorage.getItem('transportizy_users'));
            const matchedUser = users.find(u => u.email === emailInput && u.password === passInput);

            if (matchedUser) {
                localStorage.setItem('transportizy_current_user', JSON.stringify(matchedUser));
                updateAuthUI();
                
                loginForm.reset();
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                showAlert(`Welcome back, ${matchedUser.name}!`);
            } else {
                showAlert('Invalid email address or password.', 'danger');
            }
        });
    }

    // Handle logout action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('transportizy_current_user');
            updateAuthUI();
            showAlert('You have logged out successfully.');
        });
    }

    // Toggle user profile menu dropdown
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            // Only toggle when clicking top level profile, not elements inside dropdown
            if (!e.target.closest('#userDropdown')) {
                userProfile.classList.toggle('active');
            }
        });
    }

    // Sync UI with current auth state
    function updateAuthUI() {
        const currentUser = JSON.parse(localStorage.getItem('transportizy_current_user'));
        if (currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.title = currentUser.name; // Show full name on hover
                if (userName) userName.textContent = currentUser.name.split(' ')[0]; // Show first name
            }
            // Prefill email/phone on booking form if present
            const bookEmail = document.getElementById('bookEmail');
            const bookPhone = document.getElementById('bookPhone');
            if (bookEmail && !bookEmail.value) bookEmail.value = currentUser.email;
            if (bookPhone && !bookPhone.value) bookPhone.value = currentUser.phone;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userProfile) {
                userProfile.style.display = 'none';
                userProfile.classList.remove('active');
                userProfile.title = 'User Profile';
            }
        }
    }
    
    // Run auth check immediately
    updateAuthUI();

    // -------------------------------------------------------------------------
    // 4. Homepage Quick Search Form Redirector
    // -------------------------------------------------------------------------
    const quickSearchForm = document.getElementById('quickSearchForm');
    const searchTabs = document.querySelectorAll('.search-tab');
    let currentSearchType = 'railway';

    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            searchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSearchType = tab.getAttribute('data-search-type');
        });
    });

    if (quickSearchForm) {
        // Set minimum date constraint to today
        const searchDate = document.getElementById('searchDate');
        const todayStr = new Date().toISOString().split('T')[0];
        searchDate.min = todayStr;
        searchDate.value = todayStr;

        quickSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fromVal = encodeURIComponent(document.getElementById('searchFrom').value);
            const toVal = encodeURIComponent(document.getElementById('searchTo').value);
            const dateVal = encodeURIComponent(document.getElementById('searchDate').value);

            // Forward to booking page with parameters
            window.location.href = `booking.html?type=${currentSearchType}&from=${fromVal}&to=${toVal}&date=${dateVal}`;
        });
    }

    // -------------------------------------------------------------------------
    // 5. Booking Page Engine (Dynamic Forms, Photo Updates, Price Calculator)
    // -------------------------------------------------------------------------
    const bookingPageForm = document.getElementById('bookingPageForm');
    
    if (bookingPageForm) {
        const selectorBtns = document.querySelectorAll('.transport-selector-btn');
        const bookingTypeInput = document.getElementById('bookingTransportType');
        const passengerInputs = document.getElementById('passengerInputs');
        const cargoInputs = document.getElementById('cargoInputs');
        const classSelect = document.getElementById('bookClass');
        const cargoTypeSelect = document.getElementById('cargoType');
        const cargoWeightInput = document.getElementById('cargoWeight');
        
        // Custom Wizard Elements
        const searchRoutesBtn = document.getElementById('searchRoutesBtn');
        const searchResultsSection = document.getElementById('searchResultsSection');
        const resultsList = document.getElementById('resultsList');
        const searchResultsCount = document.getElementById('searchResultsCount');
        const contactDetailsSection = document.getElementById('contactDetailsSection');
        const bookSubmitBtn = document.getElementById('bookSubmitBtn');
        
        // E-Ticket Modal Elements
        const ticketModal = document.getElementById('ticketModal');
        const ticketCloseBtn = document.getElementById('ticketCloseBtn');
        const ticketPrintBtn = document.getElementById('ticketPrintBtn');
        
        // Output Summary Elements
        const visualImage = document.getElementById('bookingVisualImage');
        const summaryMode = document.getElementById('summaryMode');
        const summaryRoute = document.getElementById('summaryRoute');
        const summaryDate = document.getElementById('summaryDate');
        const summaryPaxRow = document.getElementById('summaryPaxRow');
        const summaryPax = document.getElementById('summaryPax');
        const summaryCargoRow = document.getElementById('summaryCargoRow');
        const summaryCargo = document.getElementById('summaryCargo');
        const summaryPrice = document.getElementById('summaryPrice');

        // Wizard State
        let selectedOption = null;
        let selectedOptionId = null;

        // Mock Database of Routes/Services
        const mockOptions = {
            railway: [
                { id: 'rail-1', name: 'Tejas Express (22680)', depTime: '06:15 AM', arrTime: '02:30 PM', duration: '8h 15m', badge: 'Recommended', scale: 1.0 },
                { id: 'rail-2', name: 'Rajdhani Express (12951)', depTime: '04:30 PM', arrTime: '11:45 PM', duration: '7h 15m', badge: 'Fastest', scale: 1.3 },
                { id: 'rail-3', name: 'Duronto Express (12267)', depTime: '10:10 PM', arrTime: '07:40 AM', duration: '9h 30m', badge: 'Cheapest', scale: 0.85 }
            ],
            airways: [
                { id: 'air-1', name: 'IndiGo Flight 6E-502', depTime: '07:15 AM', arrTime: '09:30 AM', duration: '2h 15m', badge: 'Cheapest', scale: 0.9 },
                { id: 'air-2', name: 'Air India Flight AI-806', depTime: '11:30 AM', arrTime: '01:55 PM', duration: '2h 25m', badge: 'Recommended', scale: 1.15 },
                { id: 'air-3', name: 'Vistara Flight UK-981', depTime: '06:45 PM', arrTime: '09:00 PM', duration: '2h 15m', badge: 'Fastest', scale: 1.4 }
            ],
            roadways: [
                { id: 'road-1', name: 'InterCity SmartBus Premium', depTime: '08:00 AM', arrTime: '04:00 PM', duration: '8h 00m', badge: 'Recommended', scale: 1.0 },
                { id: 'road-2', name: 'Zingbus VIP AC Seater', depTime: '09:30 PM', arrTime: '05:00 AM', duration: '7h 30m', badge: 'Fastest', scale: 1.2 },
                { id: 'road-3', name: 'National Travels Sleeper', depTime: '11:00 PM', arrTime: '07:30 AM', duration: '8h 30m', badge: 'Cheapest', scale: 0.8 }
            ],
            cargo: [
                { id: 'cargo-1', name: 'Priority Logistics Air Service', depTime: '09:00 AM', arrTime: '09:00 AM', duration: 'Next Day', badge: 'Fastest', scale: 1.5 },
                { id: 'cargo-2', name: 'Express Freight Ground', depTime: '02:00 PM', arrTime: '02:00 PM', duration: '3 Days', badge: 'Recommended', scale: 1.0 },
                { id: 'cargo-3', name: 'EcoSaver Budget Cargo', depTime: '05:00 PM', arrTime: '05:00 PM', duration: '7 Days', badge: 'Cheapest', scale: 0.75 }
            ]
        };

        // Set min date to today
        const depDate = document.getElementById('bookDepartureDate');
        const retDate = document.getElementById('bookReturnDate');
        const todayStr = new Date().toISOString().split('T')[0];
        depDate.min = todayStr;
        depDate.value = todayStr;
        retDate.min = todayStr;

        // Class list tokens
        const travelClasses = {
            railway: [
                { value: 'sleeper', label: 'Sleeper Coach (₹450)', fare: 450 },
                { value: 'ac-3tier', label: 'AC 3-Tier (₹1200)', fare: 1200 },
                { value: 'ac-2tier', label: 'AC 2-Tier (₹1800)', fare: 1800 },
                { value: 'ac-first', label: 'AC First Class (₹2800)', fare: 2800 }
            ],
            airways: [
                { value: 'economy', label: 'Economy Flight (₹4500)', fare: 4500 },
                { value: 'prem-economy', label: 'Premium Economy (₹6500)', fare: 6500 },
                { value: 'business', label: 'Business Class (₹15000)', fare: 15000 },
                { value: 'first-class', label: 'First Class Premium (₹35000)', fare: 35000 }
            ],
            roadways: [
                { value: 'seater', label: 'Regular Seater (₹300)', fare: 300 },
                { value: 'semi-sleeper', label: 'Semi-Sleeper Coach (₹500)', fare: 500 },
                { value: 'luxury-sleeper', label: 'Luxury Sleeper (₹850)', fare: 850 },
                { value: 'ac-luxury', label: 'VIP Premium AC (₹1200)', fare: 1200 }
            ]
        };

        // Custom validation helpers
        function showFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            field.classList.add('invalid-field');
            
            let errorEl = document.getElementById(`${fieldId}-error`);
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.id = `${fieldId}-error`;
                errorEl.className = 'validation-error-message';
                errorEl.innerHTML = `⚠️ ${message}`;
                
                const wrapper = field.closest('.input-wrapper');
                if (wrapper) {
                    wrapper.parentNode.insertBefore(errorEl, wrapper.nextSibling);
                } else {
                    field.parentNode.insertBefore(errorEl, field.nextSibling);
                }
            } else {
                errorEl.innerHTML = `⚠️ ${message}`;
            }
        }

        function clearFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            field.classList.remove('invalid-field');
            
            const errorEl = document.getElementById(`${fieldId}-error`);
            if (errorEl) {
                errorEl.remove();
            }
        }

        function clearAllErrors() {
            document.querySelectorAll('.invalid-field').forEach(f => f.classList.remove('invalid-field'));
            document.querySelectorAll('.validation-error-message').forEach(m => m.remove());
        }

        function getCityCode(cityName) {
            const clean = cityName.trim().toUpperCase().replace(/[^A-Z]/g, '');
            if (clean.length >= 3) {
                return clean.substring(0, 3);
            }
            return (clean + 'XXX').substring(0, 3);
        }

        function getModeIconSvg(mode, w = 24, h = 24) {
            if (mode === 'railway') {
                return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="m8 19-2 3"></path><path d="m16 19 2 3"></path></svg>`;
            } else if (mode === 'airways') {
                return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M12 22V12"></path><path d="m12 12 8.7-5"></path><path d="M12 12 3.3 7"></path></svg>`;
            } else if (mode === 'roadways') {
                return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="12" rx="2"></rect><path d="M7 16v2"></path><path d="M17 16v2"></path><circle cx="8" cy="12" r="2"></circle><circle cx="16" cy="12" r="2"></circle></svg>`;
            } else {
                return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
            }
        }

        // Switch transport mode logic
        function switchTransportMode(mode) {
            selectorBtns.forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-type="${mode}"]`);
            if (targetBtn) targetBtn.classList.add('active');

            bookingTypeInput.value = mode;
            
            // Reset Wizard states
            selectedOption = null;
            selectedOptionId = null;
            searchResultsSection.style.display = 'none';
            contactDetailsSection.style.display = 'none';
            clearAllErrors();
            
            // Toggle form inputs
            if (mode === 'cargo') {
                passengerInputs.style.display = 'none';
                cargoInputs.style.display = 'grid';
                
                // Summary details toggle
                summaryPaxRow.style.display = 'none';
                summaryCargoRow.style.display = 'flex';
                summaryMode.textContent = 'Cargo Shipping';
                
                // Reset required validation attributes
                document.getElementById('bookPassengers').required = false;
                classSelect.required = false;
                cargoWeightInput.required = true;
            } else {
                passengerInputs.style.display = 'grid';
                cargoInputs.style.display = 'none';
                
                summaryPaxRow.style.display = 'flex';
                summaryCargoRow.style.display = 'none';
                
                const modeLabels = { railway: 'Railway', airways: 'Airways', roadways: 'Roadways' };
                summaryMode.textContent = modeLabels[mode];

                // Setup Class Select Dropdown options
                classSelect.innerHTML = '';
                travelClasses[mode].forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt.value;
                    el.textContent = opt.label;
                    el.setAttribute('data-fare', opt.fare);
                    classSelect.appendChild(el);
                });

                document.getElementById('bookPassengers').required = true;
                classSelect.required = true;
                cargoWeightInput.required = false;
            }

            // Update photo
            visualImage.src = `assets/images/${mode}.png`;
            visualImage.alt = `${mode} booking preview`;

            // Calculate price
            recalculateBookingSummary();
        }

        // Live calculation logic
        function calculateOptionPrice(scale) {
            const mode = bookingTypeInput.value;
            let basePrice = 0;

            if (mode === 'cargo') {
                const weight = parseFloat(cargoWeightInput.value) || 0;
                const cargoType = cargoTypeSelect.value;
                
                let weightRate = 15; // ₹ per kg
                let typeBase = 150;

                if (cargoType === 'document') {
                    typeBase = 80;
                    weightRate = 8;
                } else if (cargoType === 'freight') {
                    typeBase = 600;
                    weightRate = 25;
                }

                basePrice = typeBase + (weight * weightRate);
            } else {
                const passengers = parseInt(document.getElementById('bookPassengers').value) || 1;
                const selectedOpt = classSelect.options[classSelect.selectedIndex];
                const fare = selectedOpt ? parseFloat(selectedOpt.getAttribute('data-fare')) : 0;
                
                basePrice = fare * passengers;

                if (retDate.value) {
                    basePrice = basePrice * 1.8; // 20% discount on roundtrip
                }
            }

            return basePrice * scale;
        }

        function recalculateBookingSummary() {
            const mode = bookingTypeInput.value;
            const from = document.getElementById('bookFrom').value.trim();
            const to = document.getElementById('bookTo').value.trim();
            const date = depDate.value;
            const ret = retDate.value;

            // Route summary
            if (from && to) {
                summaryRoute.textContent = `${from} ➔ ${to}${ret ? ' (Roundtrip)' : ''}`;
            } else {
                summaryRoute.textContent = '—';
            }

            // Date summary
            if (date) {
                const depFormatted = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                if (ret) {
                    const retFormatted = new Date(ret).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    summaryDate.textContent = `${depFormatted} - ${retFormatted}`;
                } else {
                    summaryDate.textContent = depFormatted;
                }
            } else {
                summaryDate.textContent = '—';
            }

            let price = 0;
            
            if (selectedOption) {
                price = calculateOptionPrice(selectedOption.scale);
                
                if (mode === 'cargo') {
                    const weight = parseFloat(cargoWeightInput.value) || 0;
                    const cargoType = cargoTypeSelect.value;
                    const typeLabels = { document: 'Documents', parcel: 'Parcels', freight: 'Heavy Freight' };
                    summaryCargo.textContent = weight > 0 ? `${weight} kg (${typeLabels[cargoType]}) - ${selectedOption.name.split(' ')[0]}` : '—';
                } else {
                    const passengers = parseInt(document.getElementById('bookPassengers').value) || 1;
                    const selectedOpt = classSelect.options[classSelect.selectedIndex];
                    const classLabel = selectedOpt ? selectedOpt.textContent.split(' (')[0] : '';
                    summaryPax.textContent = `${passengers} Pax (${classLabel}) - ${selectedOption.name.split(' ')[0]}`;
                }
            } else {
                price = calculateOptionPrice(1.0);
                
                if (mode === 'cargo') {
                    const weight = parseFloat(cargoWeightInput.value) || 0;
                    const cargoType = cargoTypeSelect.value;
                    const typeLabels = { document: 'Documents', parcel: 'Parcels', freight: 'Heavy Freight' };
                    summaryCargo.textContent = weight > 0 ? `${weight} kg (${typeLabels[cargoType]})` : '—';
                } else {
                    const passengers = parseInt(document.getElementById('bookPassengers').value) || 1;
                    const selectedOpt = classSelect.options[classSelect.selectedIndex];
                    const classLabel = selectedOpt ? selectedOpt.textContent.split(' (')[0] : '';
                    summaryPax.textContent = `${passengers} Pax (${classLabel})`;
                }
            }

            summaryPrice.textContent = `₹${price.toFixed(2)}`;
        }

        // Live calculation price updates for result list
        function refreshResultsListPrices() {
            if (searchResultsSection.style.display === 'block' && selectedOptionId) {
                const mode = bookingTypeInput.value;
                const options = mockOptions[mode];
                options.forEach(opt => {
                    const cardEl = document.querySelector(`.result-card[data-id="${opt.id}"]`);
                    if (cardEl) {
                        const newPrice = calculateOptionPrice(opt.scale);
                        cardEl.querySelector('.result-price').textContent = `₹${newPrice.toFixed(2)}`;
                    }
                });
            }
            recalculateBookingSummary();
        }

        // Validate first step search inputs
        function validateSearch() {
            clearAllErrors();
            let isValid = true;
            
            const fromField = document.getElementById('bookFrom');
            const toField = document.getElementById('bookTo');
            const depField = document.getElementById('bookDepartureDate');
            const retField = document.getElementById('bookReturnDate');
            
            if (!fromField.value.trim()) {
                showFieldError('bookFrom', 'Departure station/city is required.');
                isValid = false;
            }
            
            if (!toField.value.trim()) {
                showFieldError('bookTo', 'Destination station/city is required.');
                isValid = false;
            }
            
            if (fromField.value.trim() && toField.value.trim() && 
                fromField.value.toLowerCase().trim() === toField.value.toLowerCase().trim()) {
                showFieldError('bookFrom', 'Origin and Destination cannot be the same.');
                showFieldError('bookTo', 'Origin and Destination cannot be the same.');
                isValid = false;
            }
            
            if (!depField.value) {
                showFieldError('bookDepartureDate', 'Departure date is required.');
                isValid = false;
            } else {
                const today = new Date();
                today.setHours(0,0,0,0);
                const depDateVal = new Date(depField.value);
                depDateVal.setHours(0,0,0,0);
                
                if (depDateVal < today) {
                    showFieldError('bookDepartureDate', 'Departure date cannot be in the past.');
                    isValid = false;
                }
            }
            
            if (retField.value) {
                const today = new Date();
                today.setHours(0,0,0,0);
                const retDateVal = new Date(retField.value);
                retDateVal.setHours(0,0,0,0);
                
                if (retDateVal < today) {
                    showFieldError('bookReturnDate', 'Return date cannot be in the past.');
                    isValid = false;
                }
                
                if (depField.value) {
                    const depDateVal = new Date(depField.value);
                    depDateVal.setHours(0,0,0,0);
                    if (retDateVal < depDateVal) {
                        showFieldError('bookReturnDate', 'Return date cannot be before departure date.');
                        isValid = false;
                    }
                }
            }

            if (bookingTypeInput.value === 'cargo') {
                const weight = parseFloat(cargoWeightInput.value);
                if (isNaN(weight) || weight <= 0) {
                    showFieldError('cargoWeight', 'Please enter a valid weight greater than 0.');
                    isValid = false;
                }
            }
            
            return isValid;
        }

        // Search trigger wizard flow
        function triggerSearchFlow() {
            if (!validateSearch()) {
                showAlert('Please correct the highlighted form errors.', 'danger');
                return;
            }

            // Hide following steps
            selectedOption = null;
            selectedOptionId = null;
            searchResultsSection.style.display = 'block';
            contactDetailsSection.style.display = 'none';
            recalculateBookingSummary();

            // Render shimmer skeletons
            resultsList.innerHTML = `
                <div class="shimmer-container">
                    <div class="shimmer-card">
                        <div class="shimmer-header">
                            <div class="shimmer-element shimmer-badge"></div>
                            <div class="shimmer-element shimmer-price"></div>
                        </div>
                        <div class="shimmer-body">
                            <div class="shimmer-element shimmer-circle"></div>
                            <div style="flex-grow: 1;">
                                <div class="shimmer-element shimmer-line"></div>
                                <div class="shimmer-element shimmer-line-short"></div>
                            </div>
                        </div>
                    </div>
                    <div class="shimmer-card">
                        <div class="shimmer-header">
                            <div class="shimmer-element shimmer-badge"></div>
                            <div class="shimmer-element shimmer-price"></div>
                        </div>
                        <div class="shimmer-body">
                            <div class="shimmer-element shimmer-circle"></div>
                            <div style="flex-grow: 1;">
                                <div class="shimmer-element shimmer-line"></div>
                                <div class="shimmer-element shimmer-line-short"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            searchResultsSection.scrollIntoView({ behavior: 'smooth' });

            // Simulate server response delay
            setTimeout(() => {
                const mode = bookingTypeInput.value;
                const fromVal = document.getElementById('bookFrom').value.toLowerCase().trim();
                const toVal = document.getElementById('bookTo').value.toLowerCase().trim();
                
                const emptyTriggers = ['atlantis', 'moon', 'mars', 'nowhere', 'empty'];
                const isTriggerEmpty = emptyTriggers.includes(fromVal) || emptyTriggers.includes(toVal);

                if (isTriggerEmpty) {
                    // Render Empty State
                    searchResultsCount.textContent = '0 services found';
                    resultsList.innerHTML = `
                        <div class="empty-state-box">
                            <div class="empty-state-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                            </div>
                            <h3>No Services Found</h3>
                            <p>We could not find any active transport routes connecting <strong>"${document.getElementById('bookFrom').value}"</strong> and <strong>"${document.getElementById('bookTo').value}"</strong>. Try searching for common hubs like Delhi, Mumbai, New York, or Boston. </p>
                            <button type="button" class="btn-reset" id="resetSearchBtn">Search Another Route</button>
                        </div>
                    `;
                    document.getElementById('resetSearchBtn').addEventListener('click', () => {
                        document.getElementById('bookFrom').value = '';
                        document.getElementById('bookTo').value = '';
                        searchResultsSection.style.display = 'none';
                        document.getElementById('bookFrom').focus();
                        recalculateBookingSummary();
                    });
                } else {
                    // Render mock options
                    const options = mockOptions[mode];
                    searchResultsCount.textContent = `${options.length} options found`;
                    resultsList.innerHTML = '';

                    options.forEach(opt => {
                        const optPrice = calculateOptionPrice(opt.scale);
                        const card = document.createElement('div');
                        card.className = 'result-card';
                        card.setAttribute('data-id', opt.id);
                        
                        card.innerHTML = `
                            <div class="result-logo-box">
                                ${getModeIconSvg(mode, 22, 22)}
                            </div>
                            <div class="result-details">
                                <div class="result-meta">
                                    <span class="result-title">${opt.name}</span>
                                    <span class="result-badge ${opt.badge.toLowerCase()}">${opt.badge}</span>
                                </div>
                                <div class="result-route-info">
                                    <div class="result-time-block">
                                        <span>${opt.depTime}</span>
                                        <span>${document.getElementById('bookFrom').value}</span>
                                    </div>
                                    <div class="result-duration-line">
                                        <span>${opt.duration}</span>
                                        <div class="duration-bar"></div>
                                    </div>
                                    <div class="result-time-block">
                                        <span>${opt.arrTime}</span>
                                        <span>${document.getElementById('bookTo').value}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="result-right-action">
                                <div class="result-price">₹${optPrice.toFixed(2)}</div>
                                <div class="result-select-indicator"></div>
                            </div>
                        `;

                        card.addEventListener('click', () => {
                            document.querySelectorAll('.result-card').forEach(c => {
                                c.classList.remove('selected');
                                c.querySelector('.result-select-indicator').innerHTML = '';
                            });
                            
                            card.classList.add('selected');
                            card.querySelector('.result-select-indicator').innerHTML = '✓';
                            
                            selectedOption = opt;
                            selectedOptionId = opt.id;
                            
                            recalculateBookingSummary();
                            
                            // Pre-fill email/phone if user is logged in
                            const currentUser = JSON.parse(localStorage.getItem('transportizy_current_user'));
                            if (currentUser) {
                                if (!document.getElementById('bookEmail').value) {
                                    document.getElementById('bookEmail').value = currentUser.email;
                                }
                                if (!document.getElementById('bookPhone').value) {
                                    document.getElementById('bookPhone').value = currentUser.phone;
                                }
                            }
                            
                            contactDetailsSection.style.display = 'block';
                            setTimeout(() => {
                                contactDetailsSection.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        });

                        resultsList.appendChild(card);
                    });
                }
            }, 1200);
        }

        // Validate Checkout Fields
        function validateCheckout() {
            clearFieldError('bookEmail');
            clearFieldError('bookPhone');
            
            let isValid = true;
            const emailField = document.getElementById('bookEmail');
            const phoneField = document.getElementById('bookPhone');
            
            const emailVal = emailField.value.trim();
            const phoneVal = phoneField.value.trim();
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal) {
                showFieldError('bookEmail', 'Contact email is required.');
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                showFieldError('bookEmail', 'Please enter a valid email address.');
                isValid = false;
            }
            
            const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
            if (!phoneVal) {
                showFieldError('bookPhone', 'Contact phone number is required.');
                isValid = false;
            } else if (cleanPhone.length < 10) {
                showFieldError('bookPhone', 'Phone number must contain at least 10 digits.');
                isValid = false;
            }
            
            return isValid;
        }

        // Attach event listeners for switching modes
        selectorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const type = btn.getAttribute('data-type');
                switchTransportMode(type);
            });
        });

        // Search Button Event
        if (searchRoutesBtn) {
            searchRoutesBtn.addEventListener('click', triggerSearchFlow);
        }

        // Attach listeners for live summary updates
        const liveFields = [
            'bookFrom', 'bookTo', 'bookDepartureDate', 'bookReturnDate',
            'bookPassengers', 'bookClass', 'cargoWeight', 'cargoType'
        ];
        
        liveFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', () => {
                    clearFieldError(id);
                    refreshResultsListPrices();
                });
                field.addEventListener('change', () => {
                    clearFieldError(id);
                    refreshResultsListPrices();
                });
            }
        });

        // Contact info live error clears
        ['bookEmail', 'bookPhone'].forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', () => clearFieldError(id));
            }
        });

        // Handle URL parameters mapping on load
        const params = new URLSearchParams(window.location.search);
        const urlType = params.get('type');
        const urlFrom = params.get('from');
        const urlTo = params.get('to');
        const urlDate = params.get('date');

        if (urlFrom) document.getElementById('bookFrom').value = decodeURIComponent(urlFrom);
        if (urlTo) document.getElementById('bookTo').value = decodeURIComponent(urlTo);
        if (urlDate) depDate.value = decodeURIComponent(urlDate);

        // Run switch mode on parameters or default
        if (urlType && ['railway', 'airways', 'roadways', 'cargo'].includes(urlType)) {
            switchTransportMode(urlType);
        } else {
            switchTransportMode('railway'); // Default Mode
        }

        // Trigger search automatically if redirected from homepage search panel
        if (urlFrom && urlTo) {
            setTimeout(() => {
                triggerSearchFlow();
            }, 300);
        }

        // Close ticket modal click handlers
        if (ticketCloseBtn) {
            ticketCloseBtn.addEventListener('click', () => {
                ticketModal.classList.remove('active');
                
                // Full reset booking form
                bookingPageForm.reset();
                searchResultsSection.style.display = 'none';
                contactDetailsSection.style.display = 'none';
                selectedOption = null;
                selectedOptionId = null;
                
                updateAuthUI();
                depDate.value = todayStr;
                retDate.value = '';
                switchTransportMode(bookingTypeInput.value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (ticketPrintBtn) {
            ticketPrintBtn.addEventListener('click', () => {
                showAlert('Drafting print layout... sending document to printer queue!', 'success');
                window.print();
            });
        }

        // Form submission handling (Checkout E-Ticket Modal Activation)
        bookingPageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!selectedOption) {
                showAlert('Please select a travel service card before booking.', 'danger');
                return;
            }
            
            if (!validateCheckout()) {
                showAlert('Please correct your contact credentials fields.', 'danger');
                return;
            }

            const from = document.getElementById('bookFrom').value;
            const to = document.getElementById('bookTo').value;
            const type = bookingTypeInput.value;
            const cost = summaryPrice.textContent;
            
            const user = JSON.parse(localStorage.getItem('transportizy_current_user'));
            const userNameVal = user ? user.name : 'Valued Passenger';

            // Show payment loading state
            bookSubmitBtn.classList.add('processing');
            bookSubmitBtn.disabled = true;

            setTimeout(() => {
                // Remove loader state
                bookSubmitBtn.classList.remove('processing');
                bookSubmitBtn.disabled = false;

                // Show success banner
                showAlert(`Secure Booking Successful! Received ${cost} from ${userNameVal}. Confirmation tickets sent.`);
                
                // Populate E-Ticket details
                document.getElementById('ticketFromCity').textContent = from;
                document.getElementById('ticketFromCode').textContent = getCityCode(from);
                document.getElementById('ticketToCity').textContent = to;
                document.getElementById('ticketToCode').textContent = getCityCode(to);
                document.getElementById('ticketPassengerName').textContent = userNameVal;
                document.getElementById('ticketOperatorName').textContent = selectedOption.name;
                
                const formattedDate = new Date(depDate.value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                document.getElementById('ticketDepDateTime').textContent = `${formattedDate} at ${selectedOption.depTime}`;
                
                const classLabel = type === 'cargo' ? 
                    `${cargoWeightInput.value} kg (${cargoTypeSelect.options[cargoTypeSelect.selectedIndex].text})` : 
                    `${classSelect.options[classSelect.selectedIndex].text.split(' (')[0]}`;
                document.getElementById('ticketClassDetails').textContent = classLabel;
                
                document.getElementById('ticketContactInfo').textContent = document.getElementById('bookEmail').value;
                document.getElementById('ticketPricePaid').textContent = cost;
                
                const randomBookingId = 'TRZ-' + Math.floor(1000000 + Math.random() * 9000000);
                document.getElementById('ticketBookingId').textContent = randomBookingId;
                
                document.getElementById('ticketRouteDuration').textContent = selectedOption.duration;
                document.getElementById('ticketRouteIconContainer').innerHTML = getModeIconSvg(type, 18, 18);

                // Show ticket Modal
                ticketModal.classList.add('active');
            }, 1500);
        });
    }

    // -------------------------------------------------------------------------
    // 6. Contact Form Verification
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const subject = document.getElementById('contactSubject').value;
            
            showAlert(`Thank you, ${name}! Your inquiry about "${subject}" has been received. We will respond soon.`);
            contactForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 7. FAQs Accordion & Category Filter Controls
    // -------------------------------------------------------------------------
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question-btn');

    // Toggle accordions on clicking question headers
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentItem = btn.parentElement;
            const isActive = parentItem.classList.contains('active');
            
            // Close other items
            faqItems.forEach(item => item.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                parentItem.classList.add('active');
            }
        });
    });

    // Category sorting filter
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            faqItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Fade effect or immediate display toggle
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active'); // Close open accordion if hidden
                }
            });
        });
    });
});

console.log('Transportizy Enterprise Logic Loaded Successfully! 🌟');