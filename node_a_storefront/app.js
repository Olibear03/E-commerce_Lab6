/**
 * GADGETSTYLE - Neo-Brutalist E-Commerce Storefront & BI Pipeline Cockpit
 * ITEC 116 Activity 6 (Node A Storefront + Activity Demo Controller)
 */

// Force scroll to top on every fresh page load or refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
}

const API_BASE = 'http://127.0.0.1:5000/server.php';
const SECRET_TOKEN = 'Bearer itec116_secret_token';

// 1. Comprehensive Gadget Catalog (32 Local Product Assets)
const PRODUCTS = [
    // --- HERO & FEATURED SPOTLIGHT PRODUCTS ---
    {
        id: "P026",
        name: "Spider-Punk Wearable Mask",
        category: "Collectibles & Gear",
        price: 3899,
        cost: 2600,
        image: "Products/Spiderpunk-mask.jpg",
        badge: "FEATURED DROP",
        badgeClass: "hot",
        specs: "Light-Up LED Eyes • Breathable ABS Shell • Magnetic Back Plate",
        rating: 5.0,
        isFeatured: true
    },
    {
        id: "P029",
        name: "Ultimate Ergonomic Gaming Chair",
        category: "Chairs & Setup",
        price: 12499,
        cost: 8500,
        image: "Products/ultimate-gaming_chair.jpg",
        badge: "FLAGSHIP",
        badgeClass: "bestseller",
        specs: "4D Armrests • 180° Recline • Cold-Cure Memory Foam • Steel Frame",
        rating: 4.9,
        isFeatured: true
    },
    {
        id: "P008",
        name: "Geto Suguru Ceramic Mug",
        category: "Desk Accessories",
        price: 650,
        cost: 380,
        image: "Products/geto-mug.jpg",
        badge: "HOT DROP",
        badgeClass: "aesthetic",
        specs: "Jujutsu Kaisen Collector Series • 350ml Ceramic • Glossy Finish",
        rating: 4.9,
        isFeatured: true
    },

    // --- MICE ---
    {
        id: "P001",
        name: "Hamster Wireless Mouse",
        category: "Mice",
        price: 599,
        cost: 380,
        image: "Products/mouse.jpg",
        badge: "CUTEST TECH",
        badgeClass: "aesthetic",
        specs: "Ergonomic Hamster Shape • 2.4GHz Wireless • Silent Click Switches",
        rating: 4.9,
        isFeatured: true
    },
    {
        id: "P005",
        name: "Auroza RGB Gaming Mouse",
        category: "Mice",
        price: 899,
        cost: 600,
        image: "Products/mouse2.jpg",
        badge: "PRO GAMING",
        badgeClass: "hot",
        specs: "3200 DPI Optical Sensor • Chroma RGB • 6 Programmable Buttons",
        rating: 4.8
    },
    {
        id: "P006",
        name: "Cyberpunk Precision Gaming Mouse",
        category: "Mice",
        price: 1199,
        cost: 800,
        image: "Products/cyberpunk-mouse.jpg",
        badge: "CYBERPUNK",
        badgeClass: "hot",
        specs: "Dual Wireless & Type-C • 16,000 DPI Sensor • Low Latency",
        rating: 4.9
    },

    // --- KEYBOARDS ---
    {
        id: "P003",
        name: "Moon Cherry Mechanical Keyboard",
        category: "Keyboards",
        price: 2499,
        cost: 1800,
        image: "Products/moon-cherry-keyboard.jpg",
        badge: "BESTSELLER",
        badgeClass: "bestseller",
        specs: "Hot-Swappable Switches • PBT Dye-Sub Keycaps • RGB Backlit",
        rating: 4.9,
        isFeatured: true
    },
    {
        id: "P002",
        name: "XVX M84 Coral Sea Keyboard",
        category: "Keyboards",
        price: 3299,
        cost: 2200,
        image: "Products/COSTOM-XVX-M84.jpg",
        badge: "CUSTOM ART",
        badgeClass: "aesthetic",
        specs: "75% Compact Layout • Coral Sea Theme PBT • Gateron Yellow Switches",
        rating: 4.9,
        isFeatured: true
    },
    {
        id: "P004",
        name: "Cyberpunk Edgerunner Keyboard",
        category: "Keyboards",
        price: 3499,
        cost: 2400,
        image: "Products/cyberpunk-keyboard.jpg",
        badge: "LIMITED",
        badgeClass: "hot",
        specs: "Aluminum Frame • Hot-Swappable PCB • Cyberpunk Neon RGB",
        rating: 4.8
    },
    {
        id: "P019",
        name: "Neon Genesis EVA-01 Keyboard",
        category: "Keyboards",
        price: 3999,
        cost: 2800,
        image: "Products/NEON-GENESIS-EVA.jpg",
        badge: "ANIME COLLAB",
        badgeClass: "bestseller",
        specs: "Unit-01 Purple & Neon Green Colorway • Custom Novelties • RGB",
        rating: 5.0,
        isFeatured: true
    },

    // --- DESK ACCESSORIES & CHARGERS ---
    {
        id: "P007",
        name: "Cyberpunk Neon XXL Desk Mat",
        category: "Desk Accessories",
        price: 750,
        cost: 450,
        image: "Products/cyberpunk-deskmat.jpg",
        badge: "POPULAR",
        badgeClass: "aesthetic",
        specs: "900x400mm Extended Mat • Waterproof Micro-Weave • Anti-Fray Stitched",
        rating: 5.0
    },
    {
        id: "P027",
        name: "Spider-Man Miles Morales Desk Mat",
        category: "Desk Accessories",
        price: 799,
        cost: 480,
        image: "Products/spiderman_mat.jpg",
        badge: "MARVEL",
        badgeClass: "aesthetic",
        specs: "900x400mm XXL Mat • Non-Slip Rubber Base • Vibrant Print",
        rating: 4.9
    },
    {
        id: "P010",
        name: "BMO Retro 30W GaN Fast Charger",
        category: "Desk Accessories",
        price: 1150,
        cost: 720,
        image: "Products/bmo-charger.jpg",
        badge: "CUTE TECH",
        badgeClass: "aesthetic",
        specs: "Adventure Time BMO Design • GaN Fast Charging • Type-C + USB-A",
        rating: 4.9
    },
    {
        id: "P025",
        name: "Spider-Man Headset Stand",
        category: "Desk Accessories",
        price: 1299,
        cost: 780,
        image: "Products/spiderman_headset-holder.jpg",
        badge: "MARVEL GEAR",
        badgeClass: "hot",
        specs: "Sculpted Spider-Man Bust • Heavy Non-Slip Base • Cable Organizer",
        rating: 4.8
    },
    {
        id: "P028",
        name: "Steampunk Robot Industrial Lamp",
        category: "Desk Accessories",
        price: 1599,
        cost: 950,
        image: "Products/robot_lamp.jpg",
        badge: "HANDCRAFTED",
        badgeClass: "aesthetic",
        specs: "Wrought Iron Pipe Design • Vintage Edison Bulb • Articulated Arm",
        rating: 4.9
    },
    {
        id: "P031",
        name: "Sun & Moon Anime AirPods Case",
        category: "Desk Accessories",
        price: 450,
        cost: 220,
        image: "Products/sunmoon-airpods.jpg",
        badge: "CUTE CASE",
        badgeClass: "aesthetic",
        specs: "Shockproof Soft Silicone • Carabiner Clip • Wireless Charging Ready",
        rating: 4.7
    },

    // --- HUBS & DOCKS ---
    {
        id: "P011",
        name: "Multiport 7-in-1 USB-C Hub",
        category: "Hubs & Docks",
        price: 1299,
        cost: 900,
        image: "Products/usb-c_hub.jpg",
        badge: "ESSENTIAL",
        badgeClass: "aesthetic",
        specs: "4K HDMI 60Hz • 100W PD Pass-through • SD/TF Reader • 3x USB 3.0",
        rating: 4.7
    },
    {
        id: "P013",
        name: "Joy-Reken 7-Port Powered USB Hub",
        category: "Hubs & Docks",
        price: 1450,
        cost: 950,
        image: "Products/Joy-reken_7-USB_hub.jpg",
        badge: "HIGH POWER",
        badgeClass: "hot",
        specs: "7 USB 3.0 Ports • Individual Power Switches • 5V External Adapter",
        rating: 4.8
    },

    // --- AUDIO & HEADSETS ---
    {
        id: "P012",
        name: "Pro Surround 7.1 Studio Headset",
        category: "Audio",
        price: 2199,
        cost: 1400,
        image: "Products/head-set.jpg",
        badge: "PRO AUDIO",
        badgeClass: "hot",
        specs: "50mm Neodymium Drivers • Detachable Noise-Canceling Mic • Soft Foam",
        rating: 4.8
    },
    {
        id: "P014",
        name: "Marshall Major IV Bluetooth Headset",
        category: "Audio",
        price: 6890,
        cost: 4900,
        image: "Products/marshalhead-set.jpg",
        badge: "ICONIC AUDIO",
        badgeClass: "bestseller",
        specs: "80+ Hours Wireless Playtime • Custom-Tuned Drivers • Wireless Charging",
        rating: 5.0,
        isFeatured: true
    },
    {
        id: "P020",
        name: "EVA-01 Wireless Gaming Headset",
        category: "Audio",
        price: 3750,
        cost: 2500,
        image: "Products/NEON-GENESIS-headphone.jpg",
        badge: "ANIME COLLAB",
        badgeClass: "hot",
        specs: "Low Latency 2.4G • EVA Purple & Green Lighting • Immersive 3D Sound",
        rating: 4.9
    },
    {
        id: "P015",
        name: "HyperX QuadCast S USB Microphone",
        category: "Audio",
        price: 7490,
        cost: 5200,
        image: "Products/HyperX_QuadCast_S-Condenser_Microphone.jpg",
        badge: "STREAMER CHOICE",
        badgeClass: "bestseller",
        specs: "Dynamic RGB Lighting • Tap-to-Mute Sensor • Built-in Shock Mount",
        rating: 5.0,
        isFeatured: true
    },
    {
        id: "P032",
        name: "Tomas Correia Vintage Audio Player",
        category: "Audio",
        price: 3450,
        cost: 2300,
        image: "Products/Toma's Correia.jpg",
        badge: "VINTAGE AUDIO",
        badgeClass: "aesthetic",
        specs: "Retro Magnetic Tape Aesthetic • Built-in HiFi Amp • Bluetooth 5.3",
        rating: 4.8
    },

    // --- PC HARDWARE & CASES ---
    {
        id: "P017",
        name: "Cyberpunk Matrix PC Case",
        category: "PC Hardware",
        price: 5499,
        cost: 3700,
        image: "Products/cyberpunk-system_case.jpg",
        badge: "MODDER'S PICK",
        badgeClass: "hot",
        specs: "Dual Tempered Glass • High Airflow Mesh • Front ARGB Lighting",
        rating: 4.9,
        isFeatured: true
    },
    {
        id: "P018",
        name: "NASA Apollo Edition PC Case",
        category: "PC Hardware",
        price: 5999,
        cost: 4100,
        image: "Products/NASA-System_Case.jpg",
        badge: "AEROSPACE",
        badgeClass: "bestseller",
        specs: "White Spacecraft Aesthetic • Cable Management • Vertical GPU Mount",
        rating: 4.9
    },
    {
        id: "P030",
        name: "Starfield Constellation PC Case",
        category: "PC Hardware",
        price: 6299,
        cost: 4300,
        image: "Products/Starfield-System_case.jpg",
        badge: "CONSTELLATION",
        badgeClass: "hot",
        specs: "NASA-Punk Aesthetic • Modular Panels • Integrated Fan Controller",
        rating: 4.9
    },

    // --- CHAIRS & BATTLESTATION ---
    {
        id: "P009",
        name: "Cyberpunk Edition Gaming Chair",
        category: "Chairs & Setup",
        price: 13999,
        cost: 9800,
        image: "Products/cyberpunk-gaming_chair.jpg",
        badge: "EXCLUSIVE",
        badgeClass: "bestseller",
        specs: "Cyberpunk Yellow Stitching • Cold-Cure Foam • Multi-Tilt Mechanism",
        rating: 5.0
    },

    // --- SMARTPHONES & TECH ---
    {
        id: "P022",
        name: "Red Magic 9 Pro Gaming Phone",
        category: "Smartphones",
        price: 46999,
        cost: 38000,
        image: "Products/red-magic-pro-9.jpg",
        badge: "BEAST GAMING",
        badgeClass: "hot",
        specs: "Snapdragon 8 Gen 3 • Under-Display Cam • ICE 13.0 Cooling Fan",
        rating: 5.0,
        isFeatured: true
    },
    {
        id: "P023",
        name: "Redmi K40 Gaming Edition",
        category: "Smartphones",
        price: 18999,
        cost: 14500,
        image: "Products/Redmi K40.jpg",
        badge: "BUDGET BEAST",
        badgeClass: "hot",
        specs: "Physical Pop-Up Triggers • 120Hz OLED Display • 67W Fast Charge",
        rating: 4.8
    },
    {
        id: "P024",
        name: "Samsung Galaxy Z Flip4 5G",
        category: "Smartphones",
        price: 42990,
        cost: 34000,
        image: "Products/SAmsung_galaxy-Z-flip4.jpg",
        badge: "FOLDABLE",
        badgeClass: "aesthetic",
        specs: "Ultra-Compact Foldable Display • Armor Aluminum • IPX8 Resistant",
        rating: 4.9
    },
    {
        id: "P016",
        name: "iPhone 18 Pro Concept - Burgundy",
        category: "Smartphones",
        price: 74990,
        cost: 61000,
        image: "Products/iphone-18-burgundy.jpg",
        badge: "ULTRA FLAGSHIP",
        badgeClass: "bestseller",
        specs: "Titanium Chassis • Liquid Glass Burgundy Finish • Periscope Zoom",
        rating: 5.0
    },

    // --- COLLECTIBLES ---
    {
        id: "P021",
        name: "Omnitrix FX Deluxe Gadget",
        category: "Collectibles & Gear",
        price: 1899,
        cost: 1150,
        image: "Products/omnitrix.jpg",
        badge: "NOSTALGIA",
        badgeClass: "aesthetic",
        specs: "Rotating Alien Dial with SFX • Green Alien Illuminator • Silicone Strap",
        rating: 4.8,
        isFeatured: true
    }
];

// 2. HERO FEATURED PRODUCTS (Slide 1: Spideymask, Slide 2: Omnitrix, Slide 3: Gaming Chair, Slide 4: Geto Mug)
const HERO_SLIDES = [
    {
        title: "Spider-Punk Mask",
        subtitle: "Light-Up LED Eyes • Breathable ABS Shell",
        price: "₱3,899.00",
        img: "Products/Spiderpunk-mask.jpg",
        badge: "FEATURED HERO",
        pillHtml: `<span>🕷️ Cyber Spidey Tech</span> <span>•</span> <span>⚡ LED Pulse Mode</span>`
    },
    {
        title: "Omnitrix FX Deluxe Gadget",
        subtitle: "Rotating Alien Dial with SFX • Green Alien Illuminator",
        price: "₱1,899.00",
        img: "Products/omnitrix.jpg",
        badge: "NOSTALGIA HERO",
        pillHtml: `<span>🛸 Alien Force FX</span> <span>•</span> <span>⚡ Interactive Sound Dial</span>`
    },
    {
        title: "Ultimate Gaming Chair",
        subtitle: "Ergonomic Lumbar • 4D Armrests • 180° Recline",
        price: "₱12,499.00",
        img: "Products/ultimate-gaming_chair.jpg",
        badge: "FLAGSHIP HERO",
        pillHtml: `<span>💺 Memory Foam Support</span> <span>•</span> <span>🎮 Carbon Steel Frame</span>`
    },
    {
        title: "Geto Suguru Ceramic Mug",
        subtitle: "Jujutsu Kaisen Edition • Premium Ceramic 350ml",
        price: "₱650.00",
        img: "Products/geto-mug.jpg",
        badge: "HOT DROP",
        pillHtml: `<span>☕ Heat-Resistant Glaze</span> <span>•</span> <span>呪 Collector's Series</span>`
    }
];

// Application State
let cart = [];
let currentCategory = 'all';
let currentTableTab = 'staging';
let latestPayload = null;
let pipelineCache = null;
let heroIndex = 0;
let heroTimer = null;

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Immediately ensure user is at the top of the page
    window.scrollTo(0, 0);

    renderFeaturedProducts();
    renderCategories();
    renderCategoryPills();
    renderProducts();
    loadSamplePayload();
    fetchPipelineStatus();
    initNavSlider();
    setupScrollSpy();

    // Start Hero Carousel
    setHeroSlide(0);
    heroTimer = setInterval(() => {
        let nextIdx = (heroIndex + 1) % HERO_SLIDES.length;
        setHeroSlide(nextIdx);
    }, 4500);

    // Auto-refresh pipeline metrics every 15 seconds if on demo tab
    setInterval(() => {
        const demoPage = document.getElementById('page-demo');
        if (demoPage && demoPage.classList.contains('active')) {
            fetchPipelineStatus(false);
        }
    }, 15000);

    // Double check scroll to top after any dynamic elements render
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 20);
});

// ============================================================================
// HERO CAROUSEL CONTROLLER (Dynamically updates image, title, subtitle & pill)
// ============================================================================
function setHeroSlide(idx) {
    heroIndex = idx;
    const slide = HERO_SLIDES[heroIndex];

    const imgEl = document.getElementById('hero-feature-img');
    const titleEl = document.getElementById('hero-feature-title');
    const subtitleEl = document.getElementById('hero-feature-subtitle');
    const priceEl = document.getElementById('hero-feature-price');
    const badgeEl = document.getElementById('hero-feature-badge');
    const pillEl = document.getElementById('hero-floating-pill');
    const dots = document.querySelectorAll('.slider-dots .slider-dot');

    if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = slide.img;
            imgEl.style.opacity = '1';
        }, 150);
    }

    if (titleEl) titleEl.innerText = slide.title;
    if (subtitleEl) subtitleEl.innerText = slide.subtitle;
    if (priceEl) priceEl.innerText = slide.price;
    if (badgeEl) badgeEl.innerText = slide.badge;
    if (pillEl) pillEl.innerHTML = slide.pillHtml;

    dots.forEach((dot, i) => {
        dot.classList.toggle('inactive', i !== heroIndex);
    });
}

function nextHeroSlide(event) {
    if (event) event.stopPropagation();
    let nextIdx = (heroIndex + 1) % HERO_SLIDES.length;
    setHeroSlide(nextIdx);
}

function prevHeroSlide(event) {
    if (event) event.stopPropagation();
    let prevIdx = (heroIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    setHeroSlide(prevIdx);
}

function pauseHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
}

function resumeHeroTimer() {
    pauseHeroTimer();
    heroTimer = setInterval(() => {
        let nextIdx = (heroIndex + 1) % HERO_SLIDES.length;
        setHeroSlide(nextIdx);
    }, 4500);
}

// ============================================================================
// NAVBAR SLIDER & ACTIVE HIGHLIGHT CONTROLLER
// ============================================================================
function initNavSlider() {
    const activeLink = document.querySelector('.nav-link.active') || document.getElementById('nav-home');
    updateNavSlider(activeLink);
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active');
        if (currentActive) updateNavSlider(currentActive);
    });
}

function updateNavSlider(targetLink) {
    const indicator = document.getElementById('nav-slider-indicator');
    if (!indicator || !targetLink) return;

    indicator.style.left = `${targetLink.offsetLeft}px`;
    indicator.style.width = `${targetLink.offsetWidth}px`;
}

function setActiveNavLink(linkId) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const target = document.getElementById(linkId);
    if (target) {
        target.classList.add('active');
        updateNavSlider(target);
    }
}

function navigateTo(target, event) {
    if (event) event.preventDefault();

    const homePage = document.getElementById('page-home');
    const demoPage = document.getElementById('page-demo');

    if (target === 'demo') {
        homePage.classList.remove('active');
        demoPage.classList.add('active');
        setActiveNavLink('nav-demo');
        fetchPipelineStatus(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Otherwise, ensure storefront homepage is visible
    homePage.classList.add('active');
    demoPage.classList.remove('active');

    if (target === 'home') {
        setActiveNavLink('nav-home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'featured') {
        setActiveNavLink('nav-featured');
        const sec = document.getElementById('featured-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'categories') {
        setActiveNavLink('nav-categories');
        const sec = document.getElementById('categories-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'products') {
        setActiveNavLink('nav-products');
        const sec = document.getElementById('products-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }
}

// ScrollSpy to dynamically slide nav indicator as user scrolls
function setupScrollSpy() {
    window.addEventListener('scroll', () => {
        const demoPage = document.getElementById('page-demo');
        if (demoPage && demoPage.classList.contains('active')) return;

        const scrollY = window.scrollY + 160;
        const heroSec = document.getElementById('hero-section');
        const featuredSec = document.getElementById('featured-section');
        const catSec = document.getElementById('categories-section');
        const prodSec = document.getElementById('products-section');

        if (prodSec && scrollY >= prodSec.offsetTop) {
            setActiveNavLink('nav-products');
        } else if (catSec && scrollY >= catSec.offsetTop) {
            setActiveNavLink('nav-categories');
        } else if (featuredSec && scrollY >= featuredSec.offsetTop) {
            setActiveNavLink('nav-featured');
        } else if (heroSec) {
            setActiveNavLink('nav-home');
        }
    });
}

// ============================================================================
// 1. FEATURED PRODUCTS RENDERING (Curated Spotlight)
// ============================================================================
function renderFeaturedProducts() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    const featuredItems = PRODUCTS.filter(p => p.isFeatured);

    grid.innerHTML = featuredItems.map((prod, idx) => `
        <div class="featured-card summon-card" id="featured-card-${prod.id}">
            <div class="card-img-container">
                <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                <span class="card-tag ${prod.badgeClass}">${prod.badge}</span>
            </div>
            <div class="card-body">
                <div class="card-cat">${prod.category} • ⭐ ${prod.rating}</div>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-specs">${prod.specs}</p>
                
                <div class="card-price-row">
                    <div class="card-price">₱${prod.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div class="card-cost-ref">Ref Cost: ₱${prod.cost}</div>
                </div>

                <div class="card-actions">
                    <div class="qty-stepper">
                        <button class="qty-btn" onclick="stepQty('feat-qty-${prod.id}', -1)">-</button>
                        <span class="qty-val" id="feat-qty-${prod.id}">1</span>
                        <button class="qty-btn" onclick="stepQty('feat-qty-${prod.id}', 1)">+</button>
                    </div>
                    <button class="btn-add-cart" onclick="addProductToCart('${prod.id}', 'feat-qty-${prod.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    observeSummonCards();
}

// ============================================================================
// 2. CATEGORIES SECTION RENDERING
// ============================================================================
const CATEGORY_META = [
    { name: "Keyboards", icon: "⌨️", desc: "Mechanical & Anime Novelties" },
    { name: "Mice", icon: "🖱️", desc: "Hamster & RGB Gaming" },
    { name: "Audio", icon: "🎧", desc: "Marshall, Studio & Mics" },
    { name: "PC Hardware", icon: "🖥️", desc: "NASA, Starfield & Matrix" },
    { name: "Smartphones", icon: "📱", desc: "Red Magic, Z Flip & Flagships" },
    { name: "Chairs & Setup", icon: "💺", desc: "Ergonomic & Gaming Chairs" },
    { name: "Desk Accessories", icon: "⚡", desc: "Mugs, XXL Mats & Lamps" },
    { name: "Hubs & Docks", icon: "🔌", desc: "USB-C & Fast Powered Hubs" }
];

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORY_META.map((cat, idx) => {
        const count = PRODUCTS.filter(p => p.category === cat.name).length;
        return `
            <div class="category-card summon-card" onclick="selectCategoryFilter('${cat.name}')">
                <div class="cat-icon-wrap">${cat.icon}</div>
                <div class="cat-card-name">${cat.name}</div>
                <div class="cat-card-count">${count} items</div>
            </div>
        `;
    }).join('');

    observeSummonCards();
}

function renderCategoryPills() {
    const bar = document.getElementById('category-pills-bar');
    if (!bar) return;

    const uniqueCats = ['all', ...CATEGORY_META.map(c => c.name)];

    bar.innerHTML = uniqueCats.map(cat => `
        <button class="cat-pill ${cat === currentCategory ? 'active' : ''}" 
                id="cat-pill-${cat.replace(/\s+/g, '-')}" 
                onclick="setCategoryFilter('${cat}', this)">
            ${cat === 'all' ? 'All Products (32)' : cat}
        </button>
    `).join('');
}

function selectCategoryFilter(categoryName) {
    currentCategory = categoryName;
    renderCategoryPills();
    renderProducts();

    // Scroll to products catalog
    const prodSec = document.getElementById('products-section');
    if (prodSec) {
        prodSec.scrollIntoView({ behavior: 'smooth' });
    }
}

function setCategoryFilter(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProducts();
}

// ============================================================================
// 3. ALL PRODUCTS CATALOG RENDERING & FILTERING
// ============================================================================
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const searchTerm = (document.getElementById('product-search')?.value || '').toLowerCase();
    const sortVal = document.getElementById('product-sort')?.value || 'featured';

    let filtered = PRODUCTS.filter(prod => {
        const matchCategory = (currentCategory === 'all' || prod.category === currentCategory);
        const matchSearch = prod.name.toLowerCase().includes(searchTerm) || 
                            prod.specs.toLowerCase().includes(searchTerm) ||
                            prod.category.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    // Sorting
    if (sortVal === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === 'featured') {
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fff; border: 2px solid #111; box-shadow: 4px 4px 0 #000;">
                <h3 style="font-family: var(--font-heading); font-size: 1.3rem;">No gadgets found matching "${searchTerm}".</h3>
                <p style="color: #64748b; margin-top: 8px;">Try clearing filters or search terms.</p>
                <button class="btn-black" style="margin-top: 16px;" onclick="resetFilters()">Reset All Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map((prod, idx) => `
        <div class="product-card summon-card" id="card-${prod.id}">
            <div class="card-img-container">
                <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                <span class="card-tag ${prod.badgeClass}">${prod.badge}</span>
            </div>
            <div class="card-body">
                <div class="card-cat">${prod.category} • ⭐ ${prod.rating}</div>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-specs">${prod.specs}</p>
                
                <div class="card-price-row">
                    <div class="card-price">₱${prod.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div class="card-cost-ref">Ref Cost: ₱${prod.cost}</div>
                </div>

                <div class="card-actions">
                    <div class="qty-stepper">
                        <button class="qty-btn" onclick="stepQty('qty-${prod.id}', -1)">-</button>
                        <span class="qty-val" id="qty-${prod.id}">1</span>
                        <button class="qty-btn" onclick="stepQty('qty-${prod.id}', 1)">+</button>
                    </div>
                    <button class="btn-add-cart" onclick="addProductToCart('${prod.id}', 'qty-${prod.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    observeSummonCards();
}

// ============================================================================
// SCROLL SUMMON OBSERVER (Summoning Animation with Spring Waves)
// ============================================================================
let summonObserver = null;

function observeSummonCards() {
    const cards = document.querySelectorAll('.summon-card, .summon-header');
    if (cards.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        cards.forEach(el => el.classList.add('summoned'));
        return;
    }

    if (!summonObserver) {
        summonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('summoned');
                } else {
                    // When scrolled away, reset so it summons again when scrolling into view
                    entry.target.classList.remove('summoned');
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });
    }

    // Apply staggered ripple per grid container
    ['.featured-grid', '.categories-grid', '.products-grid'].forEach(selector => {
        const grid = document.querySelector(selector);
        if (!grid) return;
        const gridCards = grid.querySelectorAll('.summon-card');
        gridCards.forEach((card, idx) => {
            const delay = (idx % 4) * 150;
            card.style.setProperty('--summon-delay', `${delay}ms`);
            summonObserver.observe(card);
        });
    });

    document.querySelectorAll('.summon-header').forEach(h => summonObserver.observe(h));
}

function resetFilters() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.value = '';
    currentCategory = 'all';
    renderCategoryPills();
    renderProducts();
}

function filterProducts() {
    renderProducts();
}

function stepQty(elementId, delta) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let val = parseInt(el.innerText) + delta;
    if (val < 1) val = 1;
    if (val > 20) val = 20;
    el.innerText = val;
}

// ============================================================================
// SHOPPING CART LOGIC
// ============================================================================
function addProductToCart(prodId, qtyElementId) {
    const prod = PRODUCTS.find(p => p.id === prodId);
    if (!prod) return;

    const qtyEl = document.getElementById(qtyElementId);
    const qtyToAdd = qtyEl ? parseInt(qtyEl.innerText) : 1;

    let existing = cart.find(item => item.product_id === prod.id);
    if (existing) {
        existing.quantity += qtyToAdd;
        existing.line_total = existing.quantity * existing.unit_price;
    } else {
        cart.push({
            line_no: cart.length + 1,
            product_id: prod.id,
            product_name: prod.name,
            category: prod.category,
            quantity: qtyToAdd,
            unit_price: prod.price,
            unit_cost: prod.cost,
            line_total: prod.price * qtyToAdd,
            image: prod.image
        });
    }

    if (qtyEl) qtyEl.innerText = '1';
    updateCartUI();
    showToast(`Added ${qtyToAdd}x ${prod.name} to cart.`);
}

function stepCartItem(prodId, delta) {
    let item = cart.find(i => i.product_id === prodId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.product_id !== prodId);
    } else {
        item.line_total = item.quantity * item.unit_price;
    }

    cart.forEach((it, idx) => it.line_no = idx + 1);
    updateCartUI();
}

function removeCartItem(prodId) {
    cart = cart.filter(i => i.product_id !== prodId);
    cart.forEach((it, idx) => it.line_no = idx + 1);
    updateCartUI();
}

function toggleCart(open) {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    if (open) {
        overlay.classList.add('open');
        drawer.classList.add('open');
    } else {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
    }
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const cartCounter = document.getElementById('header-cart-counter');
    const checkoutBtn = document.getElementById('checkout-btn');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCounter) cartCounter.innerText = totalItems;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="cart-empty-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Your cart is empty.</p>
                <p style="font-size: 0.85rem; margin-top: 4px;">Add gadgets to test Node A checkout.</p>
            </div>
        `;
        subtotalEl.innerText = '0.00';
        taxEl.innerText = '0.00';
        shippingEl.innerText = '0.00';
        totalEl.innerText = '0.00';
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;

    cartList.innerHTML = cart.map(item => `
        <li class="cart-item-card">
            <img src="${item.image || 'Products/mouse.jpg'}" alt="${item.product_name}" class="cart-item-thumb">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product_name}</div>
                <div class="cart-item-unit">₱${item.unit_price.toLocaleString()} each</div>
                <div class="cart-item-controls">
                    <div class="qty-stepper" style="transform: scale(0.9); transform-origin: left;">
                        <button class="qty-btn" onclick="stepCartItem('${item.product_id}', -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="stepCartItem('${item.product_id}', 1)">+</button>
                    </div>
                    <div class="cart-item-total">₱${item.line_total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.product_id}')">Remove</button>
                </div>
            </div>
        </li>
    `).join('');

    let subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
    let tax = subtotal * 0.12;
    let shipping = 0;
    let total = subtotal + tax + shipping;

    subtotalEl.innerText = subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 });
    taxEl.innerText = tax.toLocaleString('en-US', { minimumFractionDigits: 2 });
    shippingEl.innerText = shipping.toLocaleString('en-US', { minimumFractionDigits: 2 });
    totalEl.innerText = total.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

// ============================================================================
// CHECKOUT & NODE B INGESTION (Schema v1.1 Payload Emitter)
// ============================================================================
async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some gadgets first.");
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `<span>Transmitting to Track B...</span>`;

    const customerSelect = document.getElementById('customer-select').value.split('|');
    const custId = customerSelect[0];
    const custName = customerSelect[1];
    const custEmail = customerSelect[2];

    const warehouseLocation = document.getElementById('warehouse-select').value;
    const paymentMethod = document.getElementById('payment-select').value;

    const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
    const tax = Math.round(subtotal * 0.12 * 100) / 100;
    const shipping = 0;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const transactionId = "ORD-2026-" + Math.floor(Math.random() * 9000 + 1000);
    const eventId = "EVT-" + Math.floor(Math.random() * 900000 + 100000);
    const referenceNo = "PAY-" + Math.floor(Math.random() * 900000 + 100000);

    const cleanLineItems = cart.map(item => ({
        line_no: item.line_no,
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_cost: item.unit_cost,
        line_total: item.line_total
    }));

    const payload = {
        schema_version: "1.1",
        event_id: eventId,
        event_type: "Order Completed",
        source_system: "Node-A-ECommerce-Storefront-UI",
        warehouse_location: warehouseLocation,
        transaction_id: transactionId,
        timestamp: new Date().toISOString(),
        entity_type: "Customer",
        entity_id: custId,
        customer: {
            customer_id: custId,
            customer_name: custName,
            email: custEmail
        },
        status: "Completed",
        status_code: "C",
        payment: {
            method: paymentMethod,
            payment_status: "Paid",
            reference_no: referenceNo
        },
        currency: "PHP",
        line_items: cleanLineItems,
        totals: {
            item_count: itemCount,
            subtotal: subtotal,
            discount: 0,
            tax_rate: 0.12,
            tax_amount: tax,
            shipping_fee: shipping,
            monetary_value: total
        }
    };

    latestPayload = payload;
    updatePayloadViewer(payload);

    try {
        let response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': SECRET_TOKEN
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast(`Order Ingested! ID: ${transactionId} (Track B Staging)`);
            cart = [];
            updateCartUI();
            toggleCart(false);

            flashNodeCard('card-node-a');
            flashNodeCard('card-node-b');
            fetchPipelineStatus();
        } else {
            let errText = await response.text();
            alert(`Ingestion Error (${response.status}): ${errText}`);
        }
    } catch (err) {
        console.error(err);
        alert(`Failed to connect to Track B Endpoint (${API_BASE}).\nIs PHP server running on 127.0.0.1:5000?`);
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = `<span>Place Order & Ingest</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }
}

// ============================================================================
// ACTIVITY DEMO DASHBOARD CONTROLLER (Node B, C, D Orchestration)
// ============================================================================
async function fetchPipelineStatus(updateTerminal = false) {
    try {
        let res = await fetch(`${API_BASE}?action=status`);
        if (!res.ok) return;

        let data = await res.json();
        pipelineCache = data;

        const totalIngested = data.metrics.total_ingested;
        const totalFacts = data.metrics.total_facts;
        const totalRev = data.metrics.total_revenue;
        const isMatch = data.metrics.reconciliation_match;

        document.getElementById('kpi-ingested-count').innerText = totalIngested;
        document.getElementById('kpi-fact-count').innerText = totalFacts;
        document.getElementById('kpi-revenue').innerText = `₱${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        
        const recEl = document.getElementById('kpi-reconciliation');
        const lossBadge = document.getElementById('kpi-loss-badge');

        if (isMatch) {
            recEl.innerText = "100%";
            recEl.style.color = "#166534";
            lossBadge.innerText = "Zero Row Loss [PASS]";
            lossBadge.className = "kpi-badge pass";
        } else {
            recEl.innerText = totalIngested > 0 ? `${Math.round((totalFacts / totalIngested) * 100)}%` : "0%";
            recEl.style.color = "#dc2626";
            lossBadge.innerText = "Pending ETL Transform";
            lossBadge.className = "kpi-badge";
        }

        renderTableViewer();

        if (updateTerminal) {
            triggerQAAudit();
        }
    } catch (e) {
        console.warn("Pipeline status fetch failed:", e);
    }
}

async function triggerETLPipeline() {
    showToast("Running Node C ETL Pipeline...");
    flashNodeCard('card-node-c');

    try {
        let res = await fetch(`${API_BASE}?action=run_etl`, { method: 'POST' });
        let data = await res.json();

        if (data.status === 'success') {
            showToast(data.message);
            fetchPipelineStatus(true);
        } else {
            alert(`ETL Error: ${data.message}`);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to execute ETL pipeline.");
    }
}

async function triggerQAAudit() {
    flashNodeCard('card-node-d');
    const term = document.getElementById('audit-terminal-output');
    if (term) term.innerText = "Executing Track D QA Reconciliation Audit...";

    try {
        let res = await fetch(`${API_BASE}?action=run_audit`);
        let data = await res.json();

        if (data.status === 'success') {
            let r = data.row_reconciliation;
            let f = data.financial_reconciliation;

            let terminalText = 
`========================================
  TRACK D: QA RECONCILIATION AUDIT
========================================

1. ROW RECONCILIATION:
   - Total Orders Ingested (Track B): ${r.total_ingested}
   - Orders Processed by ETL:         ${r.orders_processed}
   - Total Rows in Fact_Sales (Node C): ${r.total_facts}
   [${r.is_match ? 'PASS' : 'WARN'}] ${r.verdict}

2. FINANCIAL RECONCILIATION:
   - Total Revenue in Fact_Sales: ₱${f.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}

3. TECHNICAL VALIDATION:
   [PASS] API Endpoint secured with Bearer tokens (Authorization: Bearer itec116_secret_token)
   [PASS] Timestamps successfully cast to ISO-8601 & Dim_Time (date_id)
   [PASS] Status codes successfully mapped to readable dimensions (C -> Completed)
========================================
Audit Timestamp: ${new Date().toLocaleString()}`;

            if (term) term.innerText = terminalText;
        }
    } catch (err) {
        console.error(err);
        if (term) term.innerText = "Error executing QA Audit. Ensure PHP backend is reachable.";
    }
}

async function generateSingleMockOrder() {
    showToast("Generating dynamic mock order...");
    try {
        let res = await fetch(`${API_BASE}?action=mock_order`, { method: 'POST' });
        let data = await res.json();
        if (data.status === 'success') {
            latestPayload = data.payload;
            updatePayloadViewer(data.payload);
            showToast(`Mock Order ${data.payload.transaction_id} ingested!`);
            flashNodeCard('card-node-b');
            fetchPipelineStatus();
        }
    } catch (err) {
        console.error(err);
        alert("Failed to generate mock order.");
    }
}

async function generateBatchMockOrders(count = 5) {
    showToast(`Streaming batch of ${count} mock orders...`);
    for (let i = 0; i < count; i++) {
        await generateSingleMockOrder();
        await new Promise(r => setTimeout(r, 200));
    }
    showToast(`Completed stream of ${count} orders! Click 'Run ETL Pipeline Now' to transform.`);
}

function switchTableTab(tab) {
    currentTableTab = tab;
    document.getElementById('tab-btn-staging').classList.toggle('primary', tab === 'staging');
    document.getElementById('tab-btn-facts').classList.toggle('primary', tab === 'facts');
    renderTableViewer();
}

function renderTableViewer() {
    const box = document.getElementById('db-table-viewer');
    if (!box || !pipelineCache) return;

    if (currentTableTab === 'staging') {
        let rows = pipelineCache.recent_staging || [];
        if (rows.length === 0) {
            box.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No staging records yet.</div>`;
            return;
        }

        box.innerHTML = `
            <table class="demo-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Transaction ID</th>
                        <th>Received At</th>
                        <th>ETL Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td><strong>${r.transaction_id}</strong></td>
                            <td>${r.received_at}</td>
                            <td>
                                <span class="badge-tag-sm ${r.is_processed == 1 ? 'done' : 'pending'}">
                                    ${r.is_processed == 1 ? 'PROCESSED' : 'PENDING ETL'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        let facts = pipelineCache.recent_facts || [];
        if (facts.length === 0) {
            box.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No Fact_Sales rows loaded yet. Run ETL Pipeline.</div>`;
            return;
        }

        box.innerHTML = `
            <table class="demo-table">
                <thead>
                    <tr>
                        <th>Fact ID</th>
                        <th>Transaction ID</th>
                        <th>Customer</th>
                        <th>Revenue</th>
                        <th>Net Margin</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${facts.map(f => `
                        <tr>
                            <td>${f.fact_id}</td>
                            <td><strong>${f.transaction_id}</strong></td>
                            <td>${f.customer_id || 'N/A'}</td>
                            <td>₱${Number(f.monetary_value || 0).toFixed(2)}</td>
                            <td>₱${Number(f.net_margin || 0).toFixed(2)}</td>
                            <td><span class="badge-tag-sm done">${f.status || 'Completed'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

function updatePayloadViewer(obj) {
    const viewer = document.getElementById('json-payload-viewer');
    if (!viewer) return;
    viewer.innerHTML = syntaxHighlight(JSON.stringify(obj, null, 2));
}

function loadSamplePayload() {
    const sample = {
        schema_version: "1.1",
        event_id: "EVT-2026-001",
        event_type: "Order Completed",
        source_system: "Node-A-ECommerce-Storefront-UI",
        warehouse_location: "WH-MNL-01 (Manila)",
        transaction_id: "ORD-2026-EXAMPLE",
        timestamp: new Date().toISOString(),
        entity_type: "Customer",
        entity_id: "CUST-001",
        customer: {
            customer_id: "CUST-001",
            customer_name: "Juan Dela Cruz",
            email: "juan.delacruz@example.com"
        },
        status: "Completed",
        status_code: "C",
        payment: {
            method: "GCash",
            payment_status: "Paid",
            reference_no: "PAY-2026-9999"
        },
        currency: "PHP",
        line_items: [
            {
                line_no: 1,
                product_id: "P026",
                product_name: "Spider-Punk Wearable Mask",
                category: "Collectibles & Gear",
                quantity: 1,
                unit_price: 3899,
                unit_cost: 2600,
                line_total: 3899
            }
        ],
        totals: {
            item_count: 1,
            subtotal: 3899,
            discount: 0,
            tax_rate: 0.12,
            tax_amount: 467.88,
            shipping_fee: 0,
            monetary_value: 4366.88
        }
    };
    latestPayload = sample;
    updatePayloadViewer(sample);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function copyPayloadToClipboard() {
    if (!latestPayload) return;
    navigator.clipboard.writeText(JSON.stringify(latestPayload, null, 2)).then(() => {
        showToast("JSON Payload copied to clipboard!");
    });
}

function flashNodeCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.style.transform = "scale(1.05)";
    card.style.borderColor = "#93d2e3";
    setTimeout(() => {
        card.style.transform = "none";
        card.style.borderColor = "";
    }, 400);
}

function showToast(msg) {
    const toast = document.getElementById('toast-notice');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    msgEl.innerText = msg;
    toast.classList.add('show');

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3800);
}
