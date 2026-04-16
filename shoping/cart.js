


function getCart() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId, productName, productPrice) {
    let cart = getCart();
    
    // Check if item already exists
    let existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1
        });
    }
    
    saveCart(cart);
    alert(productName + " added to cart!");
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
}


function updateQuantity(productId, quantity) {
    let cart = getCart();
    let item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
            displayCart();
        }
    }
}

// Display cart on cart page
function displayCart() {
    let cart = getCart();
    let cartItemsDiv = document.getElementById("cartItems");
    let emptyCartDiv = document.getElementById("emptyCart");
    let cartSummary = document.querySelector(".cart-summary");

    if (cart.length === 0) {
        if (cartItemsDiv) cartItemsDiv.style.display = "none";
        if (cartSummary) cartSummary.style.display = "none";
        if (emptyCartDiv) emptyCartDiv.style.display = "block";
        return;
    }

    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = "";
        cart.forEach(item => {
            let cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button onclick="decreaseQuantity('${item.id}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button onclick="increaseQuantity('${item.id}')">+</button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            `;
            cartItemsDiv.appendChild(cartItem);
        });
    }

    updateCartSummary();
}


function updateCartSummary() {
    let cart = getCart();
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = subtotal > 0 ? 10 : 0;
    let total = subtotal + shipping;

    if (document.getElementById("subtotal")) {
        document.getElementById("subtotal").innerText = "$" + subtotal.toFixed(2);
    }
    if (document.getElementById("shipping")) {
        document.getElementById("shipping").innerText = "$" + shipping.toFixed(2);
    }
    if (document.getElementById("total")) {
        document.getElementById("total").innerText = "$" + total.toFixed(2);
    }
}

function increaseQuantity(productId) {
    let cart = getCart();
    let item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        displayCart();
    }
}

function decreaseQuantity(productId) {
    let cart = getCart();
    let item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(cart);
            displayCart();
        } else {
            removeFromCart(productId);
        }
    }
}

function updateCartCount() {
    let cart = getCart();
    let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    let cartLink = document.querySelector("a[href='cart.html']");
    if (cartLink && cartCount > 0) {
        cartLink.innerHTML = `Cart (${cartCount})`;
    }
}

// Handle checkout
function handleCheckout() {
    let cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10;
    alert("Order placed successfully!\n\nTotal: $" + total.toFixed(2) + "\n\nThank you for your purchase!");
    
    // Clear cart
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}

// Initialize checkout button
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("checkoutBtn")) {
        document.getElementById("checkoutBtn").addEventListener("click", handleCheckout);
    }
    
    // Display cart if on cart page
    if (document.getElementById("cartItems")) {
        displayCart();
    }
    
    updateCartCount();
});
