// Initialize GSAP animations and application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1000);

    // Initialize animations
    initAnimations();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load existing bookings from localStorage
    loadBookings();
    
    // Generate initial hall layout
    generateHallLayout();
}

function initAnimations() {
    // GSAP animations
    gsap.registerPlugin();

    // Hero section animations
    const tl = gsap.timeline();
    
    tl.from('.nav-brand', { duration: 0.8, y: -50, opacity: 0, ease: 'power3.out' })
.from('.nav-links li', { duration: 0.6, y: -30, opacity: 0, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
.from('.btn-login', { duration: 0.6, y: -30, opacity: 0, ease: 'power3.out' }, '-=0.4')
.from('.hero-title .title-line', { duration: 0.8, y: 50, opacity: 0, stagger: 0.2, ease: 'power3.out' }, '-=0.2')
.from('.hero-subtitle', { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.4')
.from('#startBooking', { duration: 0.6, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.4')
.from('.floating-card', { duration: 1, y: 100, opacity: 0, stagger: 0.2, ease: 'power3.out' }, '-=0.6');

    // Floating cards animation
    gsap.to('.card-1', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    gsap.to('.card-2', {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.5
    });

    gsap.to('.card-3', {
        y: -25,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 1
    });
}

function initEventListeners() {
    // Start booking button
    document.getElementById('startBooking').addEventListener('click', () => {
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });

    // Guests counter
    document.querySelectorAll('.guest-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const guestsInput = document.getElementById('guests');
            let guests = parseInt(guestsInput.value);
            
            if (action === 'increase' && guests < 12) {
                guests++;
            } else if (action === 'decrease' && guests > 1) {
                guests--;
            }
            
            guestsInput.value = guests;
        });
    });

    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showAvailableTables();
    });

    // Confirm booking button
    document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
}

// Hall layout and table management
function generateHallLayout() {
    const hallLayout = document.getElementById('hallLayout');
    hallLayout.innerHTML = '';

    // Create different table types and capacities
    const tables = [
        { id: 1, capacity: 2, type: 'У окна', occupied: false },
        { id: 2, capacity: 4, type: 'Стандарт', occupied: false },
        { id: 3, capacity: 2, type: 'У окна', occupied: true },
        { id: 4, capacity: 6, type: 'VIP', occupied: false },
        { id: 5, capacity: 4, type: 'Стандарт', occupied: false },
        { id: 6, capacity: 2, type: 'Барная стойка', occupied: false },
        { id: 7, capacity: 4, type: 'Стандарт', occupied: true },
        { id: 8, capacity: 6, type: 'VIP', occupied: false },
        { id: 9, capacity: 2, type: 'У окна', occupied: false },
        { id: 10, capacity: 4, type: 'Стандарт', occupied: false },
        { id: 11, capacity: 2, type: 'Барная стойка', occupied: true },
        { id: 12, capacity: 4, type: 'Стандарт', occupied: false }
    ];

    tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = `table capacity-${table.capacity} ${table.occupied ? 'occupied' : 'available'}`;
        tableElement.innerHTML = `
            <span>${table.id}</span>
            <div class="table-info">${table.capacity} чел.</div>
        `;
        
        tableElement.setAttribute('data-table-id', table.id);
        tableElement.setAttribute('data-capacity', table.capacity);
        tableElement.setAttribute('data-type', table.type);
        tableElement.setAttribute('data-occupied', table.occupied);

        if (!table.occupied) {
            tableElement.addEventListener('click', selectTable);
        }

        hallLayout.appendChild(tableElement);
    });

    // Add some decorative elements
    const entrance = document.createElement('div');
    entrance.className = 'hall-entrance';
    entrance.innerHTML = '<i class="fas fa-door-open"></i><span>Вход</span>';
    hallLayout.appendChild(entrance);
}

function selectTable(e) {
    const tableElement = e.currentTarget;
    
    // Deselect previously selected table
    document.querySelectorAll('.table.selected').forEach(table => {
        table.classList.remove('selected');
    });
    
    // Select new table
    tableElement.classList.add('selected');
    
    // Update table info
    const tableId = tableElement.getAttribute('data-table-id');
    const capacity = tableElement.getAttribute('data-capacity');
    const type = tableElement.getAttribute('data-type');
    
    document.getElementById('selectedTableNumber').textContent = tableId;
    document.getElementById('tableCapacity').textContent = capacity;
    document.getElementById('tableType').textContent = type;
    
    // Enable confirm button
    document.getElementById('confirmBooking').disabled = false;
    
    // Animation
    gsap.fromTo(tableElement, 
        { scale: 1.2 },
        { scale: 1.1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
    );
}

function showAvailableTables() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const guests = parseInt(formData.get('guests'));
    
    // Show loading state
    const confirmBtn = document.getElementById('confirmBooking');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Поиск столиков...';
    
    // Simulate API call delay
    setTimeout(() => {
        // Filter tables by capacity
        document.querySelectorAll('.table.available').forEach(table => {
            const tableCapacity = parseInt(table.getAttribute('data-capacity'));
            
            if (tableCapacity >= guests) {
                table.style.opacity = '1';
                gsap.fromTo(table, 
                    { scale: 0.8 },
                    { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );
            } else {
                table.style.opacity = '0.3';
                table.style.cursor = 'not-allowed';
            }
        });
        
        // Reset confirm button
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-check"></i> Подтвердить бронирование';
        document.getElementById('selectedTableNumber').textContent = '-';
        document.getElementById('tableCapacity').textContent = '-';
        document.getElementById('tableType').textContent = '-';
        
        // Show success message
        showNotification('Доступные столики показаны! Выберите подходящий.', 'success');
        
    }, 1500);
}

function confirmBooking() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const selectedTable = document.querySelector('.table.selected');
    
    if (!selectedTable) {
        showNotification('Пожалуйста, выберите столик!', 'error');
        return;
    }
    
    const booking = {
        id: Date.now(),
        restaurant: formData.get('restaurant'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        phone: formData.get('phone'),
        tableId: selectedTable.getAttribute('data-table-id'),
        tableCapacity: selectedTable.getAttribute('data-capacity'),
        tableType: selectedTable.getAttribute('data-type'),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save booking
    saveBooking(booking);
    
    // Mark table as occupied
    selectedTable.classList.remove('selected', 'available');
    selectedTable.classList.add('occupied');
    selectedTable.removeEventListener('click', selectTable);
    
    // Reset form and selection
    document.getElementById('confirmBooking').disabled = true;
    document.getElementById('selectedTableNumber').textContent = '-';
    document.getElementById('tableCapacity').textContent = '-';
    document.getElementById('tableType').textContent = '-';
    
    // Show success message
    showNotification('Столик успешно забронирован!', 'success');
    
    // Animation
    gsap.fromTo('.bookings-section', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
}

// LocalStorage management
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('tableTimeBookings', JSON.stringify(bookings));
    loadBookings();
}

function getBookings() {
    return JSON.parse(localStorage.getItem('tableTimeBookings') || '[]');
}

function loadBookings() {
    const bookings = getBookings();
    const bookingsGrid = document.getElementById('bookingsGrid');
    
    if (bookings.length === 0) {
        bookingsGrid.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-plus"></i>
                <h3>У вас пока нет бронирований</h3>
                <p>Забронируйте свой первый столик!</p>
            </div>
        `;
        return;
    }
    
    bookingsGrid.innerHTML = bookings.map(booking => `
        <div class="booking-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div class="booking-restaurant">${booking.restaurant}</div>
                <div class="booking-status status-confirmed">Подтверждено</div>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(booking.date)}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-clock"></i>
                    <span>${booking.time}</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-users"></i>
                    <span>${booking.guests} гостей</span>
                </div>
                <div class="booking-detail">
                    <i class="fas fa-table"></i>
                    <span>Столик ${booking.tableId}</span>
                </div>
            </div>
            <div class="booking-actions">
                <button class="btn-secondary" onclick="editBooking(${booking.id})">
                    <i class="fas fa-edit"></i>
                    Изменить
                </button>
                <button class="btn-secondary btn-danger" onclick="cancelBooking(${booking.id})">
                    <i class="fas fa-times"></i>
                    Отменить
                </button>
            </div>
        </div>
    `).join('');
    
    // Animate booking cards
    gsap.from('.booking-card', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

function cancelBooking(bookingId) {
    if (confirm('Вы уверены, что хотите отменить бронирование?')) {
        const bookings = getBookings().filter(booking => booking.id !== bookingId);
        localStorage.setItem('tableTimeBookings', JSON.stringify(bookings));
        loadBookings();
        showNotification('Бронирование отменено', 'success');
    }
}

function editBooking(bookingId) {
    showNotification('Функция редактирования в разработке', 'info');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#06D6A0',
        error: '#EF476F',
        warning: '#FFD166',
        info: '#118AB2'
    };
    return colors[type] || '#118AB2';
}

// Add some CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);