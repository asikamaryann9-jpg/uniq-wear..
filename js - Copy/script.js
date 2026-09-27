// Stores the clothing catalog used by the demo shop.
const products = [
  {id:1,name:"Essential Tee",category:"T-Shirts",price:18000,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",rating:"4.9"},
  {id:2,name:"Studio Hoodie",category:"Hoodies",price:32000,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",rating:"4.8"},
  {id:3,name:"Relaxed Shirt",category:"Shirts",price:27000,image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:4,name:"Classic Denim",category:"Jeans",price:35000,image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",rating:"4.9"},
  {id:5,name:"Wide Leg Trouser",category:"Trousers",price:29000,image:"https://images.unsplash.com/photo-1506629905607-d9f6b2f4d8c2?auto=format&fit=crop&w=700&q=80",rating:"4.6"},
  {id:6,name:"Everyday Jacket",category:"Jackets",price:42000,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",rating:"4.8"},
  {id:7,name:"Flow Midi Dress",category:"Dresses",price:36000,image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",rating:"4.8"},
  {id:8,name:"Relaxed Shorts",category:"Shorts",price:22000,image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",rating:"4.6"},
  {id:9,name:"Canvas Cap",category:"Accessories",price:12000,image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:10,name:"Graphic Tee",category:"T-Shirts",price:20000,image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:11,name:"Layered Overshirt",category:"Shirts",price:31000,image:"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",rating:"4.8"},
  {id:12,name:"Utility Jacket",category:"Jackets",price:45000,image:"https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=700&q=80",rating:"4.9"}
];

// Formats a number as Nigerian Naira.
const money = value => `₦${value.toLocaleString("en-NG")}`;

// Loads the cart from browser storage.
let cart = JSON.parse(localStorage.getItem("uniqWearCart") || "[]");

// Saves the current cart to browser storage.
function saveCart() {
  localStorage.setItem("uniqWearCart", JSON.stringify(cart));
}

// Updates the cart number shown in the navigation.
function updateCartCount() {
  const count = cart.reduce((total,item) => total + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(element => element.textContent = count);
}

// Creates a product card.
function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-tag">${product.category}</span>
      </div>
      <div class="product-info">
        <small>★ ${product.rating} rating</small>
        <h3>${product.name}</h3>
        <p class="price">${money(product.price)}</p>
        <div class="product-actions">
          <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
          <button class="btn btn-light view-product" data-id="${product.id}">Details</button>
        </div>
      </div>
    </article>`;
}

// Renders products into a chosen element.
function renderProducts(list, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = list.map(productCard).join("");
}

// Adds a product to the cart.
function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  const existing = cart.find(item => item.id === Number(id));
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  saveCart();
  updateCartCount();
  renderCart();
}

// Changes a cart item's quantity.
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === Number(id));
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== Number(id));
  saveCart();
  updateCartCount();
  renderCart();
}

// Removes a product from the cart.
function removeFromCart(id) {
  cart = cart.filter(product => product.id !== Number(id));
  saveCart();
  updateCartCount();
  renderCart();
}

// Renders the cart items and total.
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = `<div class="empty-state">Your cart is empty. <a class="text-link" href="#top">Continue shopping</a>.</div>`;
    if (totalElement) totalElement.textContent = money(0);
    return;
  }
  container.innerHTML = cart.map(item => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <small>${item.category}</small>
        <div class="quantity-controls">
          <button class="quantity-btn" data-id="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button>
          <strong>${item.quantity}</strong>
          <button class="quantity-btn" data-id="${item.id}" data-change="1" aria-label="Increase quantity">+</button>
          <button class="text-link remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <strong>${money(item.price * item.quantity)}</strong>
    </article>`).join("");
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  if (totalElement) totalElement.textContent = money(total);
}

// Filters and sorts the shop products.
function updateShop() {
  const search = (document.getElementById("productSearch")?.value || "").toLowerCase().trim();
  const category = document.getElementById("categoryFilter")?.value || "All";
  const sort = document.getElementById("sortProducts")?.value || "default";
  let list = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });
  if (sort === "low") list.sort((a,b) => a.price - b.price);
  if (sort === "high") list.sort((a,b) => b.price - a.price);
  renderProducts(list,"shopProducts");
  const empty = document.getElementById("emptyProducts");
  if (empty) empty.hidden = list.length !== 0;
}

// Handles product button clicks through event delegation.
document.addEventListener("click", event => {
  const addButton = event.target.closest(".add-to-cart");
  if (addButton) {
    addToCart(addButton.dataset.id);
    addButton.textContent = "Added ✓";
    setTimeout(() => addButton.textContent = "Add to cart", 900);
  }
  const quantityButton = event.target.closest(".quantity-btn");
  if (quantityButton) changeQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.change));
  const removeButton = event.target.closest(".remove-item");
  if (removeButton) removeFromCart(removeButton.dataset.id);
  const viewButton = event.target.closest(".view-product");
  if (viewButton) {
    const product = products.find(item => item.id === Number(viewButton.dataset.id));
    if (product) alert(`${product.name}\n${product.category}\n${money(product.price)}\nRating: ${product.rating}/5`);
  }
});

// Initializes the mobile navigation menu.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });
}

// Closes the mobile menu after a navigation click.
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks?.classList.remove("open"));
});

// Renders featured products on the home page.
renderProducts(products.slice(0,4),"featuredProducts");

// Renders all shop products.
renderProducts(products,"shopProducts");

// Initializes shop controls.
["productSearch","categoryFilter","sortProducts"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updateShop);
  document.getElementById(id)?.addEventListener("change", updateShop);
});

// Applies a category from a URL query parameter.
const categoryFromUrl = new URLSearchParams(location.search).get("category");
if (categoryFromUrl && document.getElementById("categoryFilter")) {
  document.getElementById("categoryFilter").value = categoryFromUrl;
  updateShop();
}

// Handles the demo checkout button.
document.getElementById("checkoutButton")?.addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }
  alert("Demo checkout: connect this button to your real payment system before launch.");
});

// Handles the contact form.
document.getElementById("contactForm")?.addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("contactMessage").textContent = "Thanks! Your message has been prepared successfully. Connect this form to a backend or form service to receive real submissions.";
  event.target.reset();
});

// Handles newsletter signup.
document.getElementById("newsletterForm")?.addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent = "Thanks for subscribing!";
  event.target.reset();
});

// Opens gallery images in the lightbox.
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImage");
    if (!lightbox || !image) return;
    image.src = item.dataset.image;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
  });
});

// Closes the gallery lightbox.
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
}

// Connects the lightbox close button.
document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);

// Closes the lightbox when its background is clicked.
document.getElementById("lightbox")?.addEventListener("click", event => {
  if (event.target.id === "lightbox") closeLightbox();
});

// Closes the lightbox with the Escape key.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

// Adds reveal animations when sections enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.08});

// Observes all reveal elements.
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

// Updates the cart counter when the page loads.
updateCartCount();

// Updates the cart display when the page loads.
renderCart();
