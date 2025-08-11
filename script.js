// Product gallery images
const productImages = [
    "assets/images/classic.png",
    "assets/images/lily.jpg", 
    "assets/images/Rose.jpg"
];

let currentProductIndex = 0;
const mainProductImage = document.getElementById('mainProductImage');
const productDots = document.querySelectorAll('.gallery-dots .dot');
const productThumbnails = document.querySelectorAll('.thumbnails .thumbnail');
const prevProductBtn = document.getElementById('prevProductBtn');
const nextProductBtn = document.getElementById('nextProductBtn');

// Product gallery functionality
function updateProductGallery(index) {
    currentProductIndex = index;
    mainProductImage.src = productImages[index];
    
    // Update dots
    productDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update thumbnails
    productThumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Arrow navigation for product gallery
prevProductBtn.addEventListener('click', () => {
    currentProductIndex = currentProductIndex === 0 ? productImages.length - 1 : currentProductIndex - 1;
    updateProductGallery(currentProductIndex);
});

nextProductBtn.addEventListener('click', () => {
    currentProductIndex = currentProductIndex === productImages.length - 1 ? 0 : currentProductIndex + 1;
    updateProductGallery(currentProductIndex);
});

// Dot navigation for product gallery
productDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateProductGallery(index);
    });
});

// Thumbnail navigation for product gallery
productThumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        updateProductGallery(index);
    });
});

// Product configuration
const fragrancePrices = {
    'mystic-rose': 89.99,
    'ocean-breeze': 95.99,
    'golden-amber': 105.99
};

const purchaseDiscounts = {
    'one-time': 0,
    'single-subscription': 0.1,
    'double-subscription': 0.2
};

// Generate all 9 cart link variations
const generateCartLinks = () => {
    const baseUrl = 'https://shop.gtgperfumes.com/cart/';
    const links = {};
    
    Object.keys(fragrancePrices).forEach(fragrance => {
        links[fragrance] = {};
        Object.keys(purchaseDiscounts).forEach(purchaseType => {
            links[fragrance][purchaseType] = `${baseUrl}${fragrance}-${purchaseType}`;
        });
    });
    
    return links;
};

const cartLinks = generateCartLinks();

// Update product price and cart button
function updateProductPrice() {
    const selectedFragrance = document.querySelector('input[name="fragrance"]:checked').value;
    const selectedPurchaseType = document.querySelector('input[name="purchase-type"]:checked').value;
    
    const basePrice = fragrancePrices[selectedFragrance];
    const discount = purchaseDiscounts[selectedPurchaseType];
    const finalPrice = (basePrice * (1 - discount)).toFixed(2);
    
    // Update price display
    document.getElementById('priceDisplay').textContent = `$${finalPrice}`;
    
    // Update cart button
    const cartButton = document.getElementById('addToCartButton');
    cartButton.href = cartLinks[selectedFragrance][selectedPurchaseType];
    cartButton.textContent = `Add to Cart `;
    
    // Handle expandable content for subscriptions
    const singleSub = document.getElementById('singleSubscriptionDetails');
    const doubleSub = document.getElementById('doubleSubscriptionDetails');
    
    singleSub.classList.toggle('expanded', selectedPurchaseType === 'single-subscription');
    doubleSub.classList.toggle('expanded', selectedPurchaseType === 'double-subscription');
}

// Handle purchase option selection with visual feedback
function handlePurchaseSelection() {
    const purchaseOptions = document.querySelectorAll('.purchase-option');
    const purchaseRadios = document.querySelectorAll('input[name="purchase-type"]');
    
    purchaseOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            purchaseOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Check the corresponding radio button
            purchaseRadios[index].checked = true;
            
            // Update price
            updateProductPrice();
        });
    });
}

// Handle color selection
function handleColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Handle subscription item selection
function handleSubscriptionSelection() {
    // Single subscription - select one
    const singleSubscriptionItems = document.querySelectorAll('#singleSubscriptionDetails .subscription-item');
    const singleSummary = document.getElementById('singleSelectionSummary');
    
    singleSubscriptionItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove selected class from all single subscription items
            singleSubscriptionItems.forEach(singleItem => {
                singleItem.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            item.classList.add('selected');
            
            // Update summary
            const fragrance = item.querySelector('.perfume-label').textContent;
            const price = item.dataset.price;
            singleSummary.innerHTML = `<p>Selected: <strong>${fragrance}</strong> - ${price}/month</p>`;
        });
    });

    // Double subscription - select two different
    const doubleSubscriptionItems = document.querySelectorAll('#doubleSubscriptionDetails .subscription-item');
    const doubleSummary = document.getElementById('doubleSelectionSummary');
    let selectedDoubleItems = [];
    
    doubleSubscriptionItems.forEach(item => {
        item.addEventListener('click', () => {
            const fragrance = item.dataset.fragrance;
            
            if (item.classList.contains('selected')) {
                // Deselect item
                item.classList.remove('selected');
                item.querySelector('.selection-count')?.remove();
                selectedDoubleItems = selectedDoubleItems.filter(selected => selected.fragrance !== fragrance);
            } else if (selectedDoubleItems.length < 2) {
                // Select item if less than 2 selected
                item.classList.add('selected');
                
                // Add selection count indicator
                const countIndicator = document.createElement('span');
                countIndicator.className = 'selection-count';
                countIndicator.textContent = selectedDoubleItems.length + 1;
                item.appendChild(countIndicator);
                
                selectedDoubleItems.push({
                    fragrance: fragrance,
                    name: item.querySelector('.perfume-label').textContent,
                    price: item.dataset.price
                });
            }
            
            // Update all items' disabled state
            doubleSubscriptionItems.forEach(doubleItem => {
                const itemFragrance = doubleItem.dataset.fragrance;
                const isSelected = selectedDoubleItems.some(selected => selected.fragrance === itemFragrance);
                
                if (selectedDoubleItems.length >= 2 && !isSelected) {
                    doubleItem.classList.add('disabled');
                } else {
                    doubleItem.classList.remove('disabled');
                }
            });
            
            // Update summary
            updateDoubleSummary();
        });
    });
    
    function updateDoubleSummary() {
        if (selectedDoubleItems.length === 0) {
            doubleSummary.innerHTML = '<p>Please select 2 different fragrances</p>';
        } else if (selectedDoubleItems.length === 1) {
            doubleSummary.innerHTML = `<p>Selected: <strong>${selectedDoubleItems[0].name}</strong><br>Please select 1 more fragrance</p>`;
        } else {
            const totalPrice = selectedDoubleItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
            doubleSummary.innerHTML = `
                <p>Selected fragrances:</p>
                <p>1. <strong>${selectedDoubleItems[0].name}</strong> - ${selectedDoubleItems[0].price}</p>
                <p>2. <strong>${selectedDoubleItems[1].name}</strong> - ${selectedDoubleItems[1].price}</p>
                <p><strong>Total: ${totalPrice.toFixed(2)}/month</strong></p>
            `;
        }
    }
}

// Add event listeners to all product option controls
document.querySelectorAll('input[name="fragrance"]').forEach(radio => {
    radio.addEventListener('change', updateProductPrice);
});

// Mobile navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Statistics counter animation
function animateStatCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 40);
}

// Intersection Observer for statistics animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stats-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                stat.classList.add('animate-count');
                animateStatCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the stats section
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Lazy loading for images
const lazyImages = document.querySelectorAll('.lazy-image');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    updateProductPrice();
    handlePurchaseSelection();
    handleColorSelection();
    handleSubscriptionSelection();
});

// Console log for debugging cart links
console.log('Cart Links Configuration:', cartLinks);