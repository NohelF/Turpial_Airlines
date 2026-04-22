// Datos Mockup Realistas de Vuelos
const flights = [
    { id: 1, origin: 'Caracas (CCS)', destination: 'Bogotá (BOG)', date: '15 Oct', time: '08:00 AM', status: 'On Time', price: 250, availability: 'Alta' },
    { id: 2, origin: 'Maracaibo (MAR)', destination: 'Panamá (PTY)', date: '15 Oct', time: '10:30 AM', status: 'Boarding', price: 320, availability: 'Baja' },
    { id: 3, origin: 'Valencia (VLN)', destination: 'Miami (MIA)', date: '16 Oct', time: '01:15 PM', status: 'Delayed', price: 450, availability: 'Media' },
    { id: 4, origin: 'Porlamar (PMV)', destination: 'Caracas (CCS)', date: '16 Oct', time: '04:00 PM', status: 'On Time', price: 90, availability: 'Alta' },
    { id: 5, origin: 'Caracas (CCS)', destination: 'Punta Cana (PUJ)', date: '17 Oct', time: '09:00 AM', status: 'On Time', price: 380, availability: 'Últimos Asientos' },
    { id: 6, origin: 'Barquisimeto (BRM)', destination: 'Caracas (CCS)', date: '17 Oct', time: '06:00 PM', status: 'On Time', price: 85, availability: 'Alta' }
];

// Estado
let cart = JSON.parse(localStorage.getItem('turpial_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('turpial_favorites')) || [];

// Elementos del DOM
const flightsContainer = document.getElementById('flights-container');
const cartSidebar = document.getElementById('cart-sidebar');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const overlay = document.getElementById('sidebar-overlay');

const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const emptyCartBtn = document.getElementById('empty-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

const openFavoritesBtn = document.getElementById('open-favorites-btn');
const closeFavoritesBtn = document.getElementById('close-favorites-btn');
const favoritesItemsContainer = document.getElementById('favorites-items');
const favCount = document.getElementById('fav-count');

// Init
document.addEventListener('DOMContentLoaded', () => {
    if(flightsContainer) {
        renderFlights();
        updateUI();
        setupEventListeners();
        createNotificationElement();
    }
});

function getStatusClass(status) {
    if(status === 'On Time') return 'status-ontime';
    if(status === 'Delayed') return 'status-delayed';
    if(status === 'Boarding') return 'status-boarding';
    return '';
}

function getStatusTranslation(status) {
    if(status === 'On Time') return 'A tiempo';
    if(status === 'Delayed') return 'Retrasado';
    if(status === 'Boarding') return 'Abordando';
    return status;
}

function renderFlights() {
    flightsContainer.innerHTML = '';
    flights.forEach(flight => {
        const isFav = favorites.some(f => f.id === flight.id);
        const availabilityColor = flight.availability === 'Últimos Asientos' || flight.availability === 'Baja' ? '#CF142B' : '#166534';
        
        const card = document.createElement('div');
        card.classList.add('flight-card');
        card.innerHTML = `
            <div class="flight-header">
                <span class="flight-status ${getStatusClass(flight.status)}">${getStatusTranslation(flight.status)}</span>
                <span style="font-size:0.85rem; color: #6B7280; font-weight: 600;"><i class="fa-solid fa-plane-departure" style="color:var(--turpial-yellow);"></i> Turpial</span>
            </div>
            <div class="flight-route">
                <span>${flight.origin}</span>
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
                <span>${flight.destination}</span>
            </div>
            <div class="flight-details">
                <span><i class="fa-regular fa-calendar" style="margin-right: 5px;"></i> ${flight.date}</span>
                <span><i class="fa-regular fa-clock" style="margin-right: 5px;"></i> ${flight.time}</span>
            </div>
            <div class="flight-meta">
                <div style="font-size:0.85rem; color: #6B7280; display:flex; flex-direction:column;">
                    <span>Disponibilidad</span>
                    <strong style="color: ${availabilityColor}; font-size: 1rem;">${flight.availability}</strong>
                </div>
                <div class="flight-price">$${flight.price}</div>
            </div>
            <div class="flight-actions">
                <button class="btn btn-primary add-to-cart-btn" data-id="${flight.id}">
                    <i class="fa-solid fa-cart-plus"></i> Agregar
                </button>
                <button class="btn btn-icon toggle-fav-btn ${isFav ? 'active' : ''}" data-id="${flight.id}">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
        `;
        flightsContainer.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id);
            showNotification('Vuelo agregado al carrito', 'success');
            
            // Animation pop
            const cartIcon = document.querySelector('#open-cart-btn i');
            cartIcon.classList.remove('pop-anim');
            void cartIcon.offsetWidth; 
            cartIcon.classList.add('pop-anim');
        });
    });

    document.querySelectorAll('.toggle-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            toggleFavorite(id, e.currentTarget);
        });
    });
}

// Lógica de Carrito
function addToCart(id) {
    const flight = flights.find(f => f.id === id);
    if(flight) {
        cart.push({...flight, cartId: Date.now()}); 
        saveData();
        updateUI();
    }
}

window.removeFromCart = function(cartId) {
    cart = cart.filter(f => f.cartId !== cartId);
    saveData();
    updateUI();
    showNotification('Vuelo eliminado del carrito', 'info');
}

function emptyCart() {
    cart = [];
    saveData();
    updateUI();
    showNotification('Carrito vaciado', 'info');
}

// Lógica de Favoritos
window.toggleFavorite = function(id, btnElement) {
    const flight = flights.find(f => f.id === id);
    if(!flight) return;

    const existsIndex = favorites.findIndex(f => f.id === id);
    if(existsIndex > -1) {
        favorites.splice(existsIndex, 1);
        if(btnElement) {
            btnElement.classList.remove('active');
            btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
        showNotification('Vuelo eliminado de guardados', 'info');
    } else {
        favorites.push(flight);
        if(btnElement) {
            btnElement.classList.add('active');
            btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
        showNotification('Vuelo guardado en favoritos', 'success');
        
        const favIcon = document.querySelector('#open-favorites-btn i');
        favIcon.classList.remove('pop-anim');
        void favIcon.offsetWidth; 
        favIcon.classList.add('pop-anim');
    }
    saveData();
    updateUI();
    
    if(!btnElement) renderFlights();
}

// Actualizar Interfaz y LocalStorage
function updateUI() {
    cartCount.textContent = cart.length;
    favCount.textContent = favorites.length;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-state"><i class="fa-solid fa-bag-shopping"></i><p>Tu carrito está vacío</p></div>';
    } else {
        cart.forEach(item => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="sidebar-item">
                    <div class="sidebar-item-info">
                        <strong>${item.origin} - ${item.destination}</strong>
                        <span>${item.date} | ${item.time}</span>
                        <div class="sidebar-item-price">$${item.price}</div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.cartId})" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
        });
    }
    cartTotalPrice.textContent = `$${total}`;

    favoritesItemsContainer.innerHTML = '';
    if(favorites.length === 0) {
        favoritesItemsContainer.innerHTML = '<div class="empty-state"><i class="fa-regular fa-heart"></i><p>No tienes vuelos guardados</p></div>';
    } else {
        favorites.forEach(item => {
            favoritesItemsContainer.innerHTML += `
                <div class="sidebar-item">
                    <div class="sidebar-item-info">
                        <strong>${item.origin} - ${item.destination}</strong>
                        <span>${item.date} | ${item.time}</span>
                        <div class="sidebar-item-price">$${item.price}</div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        <button class="btn btn-primary" onclick="addToCart(${item.id}); toggleFavorite(${item.id});" style="padding: 0.5rem; font-size: 0.9rem;">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="toggleFavorite(${item.id})" title="Eliminar Guardado" style="width:100%;"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        });
    }
}

function saveData() {
    localStorage.setItem('turpial_cart', JSON.stringify(cart));
    localStorage.setItem('turpial_favorites', JSON.stringify(favorites));
}

// Event Listeners y Handlers
function setupEventListeners() {
    openCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    closeCartBtn.addEventListener('click', closeSidebars);
    
    openFavoritesBtn.addEventListener('click', () => {
        favoritesSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    closeFavoritesBtn.addEventListener('click', closeSidebars);
    
    overlay.addEventListener('click', closeSidebars);

    emptyCartBtn.addEventListener('click', emptyCart);
    checkoutBtn.addEventListener('click', () => {
        if(cart.length > 0) {
            alert('¡Gracias por tu preferencia! Esta es una demostración. Serás redirigido a la pasarela de pago segura de Turpial Airlines.');
            emptyCart();
            closeSidebars();
        } else {
            alert('El carrito está vacío. Agrega algunos vuelos primero.');
        }
    });

    // Permitir addToCart global para los botones inline
    window.addToCart = addToCart;
}

function closeSidebars() {
    cartSidebar.classList.remove('active');
    favoritesSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Sistema de Notificaciones Elegantes
let notifElement;
function createNotificationElement() {
    notifElement = document.createElement('div');
    notifElement.className = 'notification';
    document.body.appendChild(notifElement);
}

function showNotification(message, type) {
    if(!notifElement) return;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color: #34D399; font-size: 1.2rem;"></i>' : '<i class="fa-solid fa-circle-info" style="color: var(--turpial-yellow); font-size: 1.2rem;"></i>';
    notifElement.innerHTML = `${icon} <span>${message}</span>`;
    
    notifElement.classList.remove('show'); // Reset animation
    void notifElement.offsetWidth;
    
    notifElement.classList.add('show');
    
    setTimeout(() => {
        notifElement.classList.remove('show');
    }, 3000);
}
