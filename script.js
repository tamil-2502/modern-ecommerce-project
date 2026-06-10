const productsContainer = document.querySelector(".products-container");
const cartIcon = document.querySelector(".fa-shopping-cart");
const heartIcon = document.querySelector(".fa-heart");
const searchInput = document.getElementById("searchInput");
const shopNowBtn = document.getElementById("shopNowBtn");
const themeToggle = document.getElementById("themeToggle");

/* CART SIDEBAR */
const cartSidebar = document.createElement("div");
cartSidebar.classList.add("cart-sidebar");
document.body.appendChild(cartSidebar);

/* WISHLIST SIDEBAR */
const wishlistSidebar = document.createElement("div");
wishlistSidebar.classList.add("wishlist-sidebar");
document.body.appendChild(wishlistSidebar);

/* DATA */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/* DISPLAY PRODUCTS */
function displayProducts(productArray){
  productsContainer.innerHTML = "";
  productArray.forEach(product => {
    productsContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" onclick="openModal(${product.id})">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <div class="rating">⭐⭐⭐⭐⭐</div>

          <div class="product-buttons">
            <button onclick="addToCart(${product.id})">Add To Cart</button>
            <button class="wishlist-btn" onclick="addToWishlist('${product.name}')">❤️</button>
            <button class="share-btn" onclick="shareProduct('${product.name}')">📤</button>
          </div>

        </div>
      </div>
    `;
  });
}

/* ADD TO CART */
function addToCart(id){
  const selectedProduct = products.find(product => product.id === id);

  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.quantity++;
  } else {
    cart.push({...selectedProduct, quantity: 1});
  }

  updateCart();   // 🔥 MUST
  showToast("Added To Cart 🛒");
}
/* UPDATE CART */
function updateCart(){
  cartSidebar.innerHTML = `
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button onclick="closeCart()">Close</button>
    </div>
  `;

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartSidebar.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>
          <button onclick="removeFromCart(${item.id})"> 🗑 Remove </button>
          <div class="quantity-controls">
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${item.id})">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartSidebar.innerHTML += `
    <div class="cart-total">
      <h3>Total: $${total}</h3>
      <button class="checkout-btn" onclick="checkout()">Checkout</button>
    </div>
  `;

  localStorage.setItem("cart", JSON.stringify(cart));
}
function removeFromCart(id){
  cart = cart.filter(item => item.id !== id);
  updateCart();
}
/* QUANTITY */
function increaseQuantity(id){
  const item = cart.find(product => product.id === id);
  item.quantity++;
  updateCart();
}

function decreaseQuantity(id){
  const item = cart.find(product => product.id === id);
  item.quantity--;

  if(item.quantity <= 0){
    cart = cart.filter(product => product.id !== id);
  }

  updateCart();
}

/* CLOSE CART */
function closeCart(){
  cartSidebar.classList.remove("active");
}

/* CHECKOUT */
function checkout(){
  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }

  const name = prompt("Enter your name");
  const address = prompt("Enter your address");

  if(!name || !address){
    alert("Fill details");
    return;
  }

  showSuccessAnimation();

  cart = [];
  updateCart();
  closeCart();

  alert(`Order placed for ${name}`);
}

/* WISHLIST */
function addToWishlist(productName){
  if(wishlist.includes(productName)){
    wishlist = wishlist.filter(item => item !== productName);
    showToast("Removed from Wishlist 💔");
  } else {
    wishlist.push(productName);
    showToast("Added To Wishlist ❤️");
  }

  updateWishlist();
}
function updateWishlist(){
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  wishlistSidebar.innerHTML = `
    <div class="wishlist-header">
      <h2>Wishlist ❤️</h2>
      <button onclick="closeWishlist()">Close</button>
    </div>
  `;

  wishlist.forEach(item => {
    wishlistSidebar.innerHTML += `
      <div class="wishlist-item">${item}</div>
    `;
  });
}

function closeWishlist(){
  wishlistSidebar.classList.remove("active");
}

/* TOAST */
function showToast(message){
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 2000);
}

/* EVENTS */
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
});

heartIcon.addEventListener("click", () => {
  wishlistSidebar.classList.toggle("active");
});

/* SEARCH */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});

/* SHOP NOW */
shopNowBtn.addEventListener("click", () => {
  window.scrollTo({ top:700, behavior:"smooth" });
});

/* DARK MODE */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* FILTERS */
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if(category === "All"){
      displayProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.category === category
      );

      displayProducts(filtered);
    }
  });
});

/* PAGINATION */
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

let currentPage = 1;
const productsPerPage = 4;

function paginateProducts(){
  productsContainer.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
  `;

  setTimeout(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const paginatedItems = products.slice(start, end);

    displayProducts(paginatedItems);
    pageNumber.innerText = currentPage;
  }, 700);
}

/* NEXT */
nextBtn.addEventListener("click", () => {
  if(currentPage < Math.ceil(products.length / productsPerPage)){
    currentPage++;
    paginateProducts();
  }
});

/* PREVIOUS */
prevBtn.addEventListener("click", () => {
  if(currentPage > 1){
    currentPage--;
    paginateProducts();
  }
});

/* INITIAL */
paginateProducts();
updateCart();

/* MODAL */
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const closeModalBtn = document.querySelector(".close-modal");
const modalCartBtn = document.getElementById("modalCartBtn");

function openModal(id){
  const product = products.find(item => item.id === id);

  addRecentProduct(product);

  modal.style.display = "flex";
  modalImage.src = product.image;

  modalTitle.innerHTML = `
    ${product.name}
    <br><br>
    <small>
      ⭐ Premium quality product<br>
      🚚 Fast delivery available<br>
      🔥 Trending product
    </small>
  `;

  modalPrice.innerText = "$" + product.price;

  modalCartBtn.onclick = () => {
    addToCart(product.id);
  };
}

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if(e.target === modal){
    modal.style.display = "none";
  }
});

/* SORTING */
const sortProducts = document.getElementById("sortProducts");

sortProducts.addEventListener("change", () => {
  let sortedProducts = [...products];

  if(sortProducts.value === "low-high"){
    sortedProducts.sort((a,b) => a.price - b.price);
  }
  else if(sortProducts.value === "high-low"){
    sortedProducts.sort((a,b) => b.price - a.price);
  }

  displayProducts(sortedProducts);
});

/* SUCCESS */
function showSuccessAnimation(){
  const successDiv = document.createElement("div");
  successDiv.classList.add("success-animation");

  successDiv.innerHTML = `
    <div class="success-box">
      <h1>🎉</h1>
      <h2>Order Placed Successfully</h2>
    </div>
  `;

  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 2500);
}

/* RECENT */
const recentContainer = document.getElementById("recentContainer");
let recentProducts = [];

function addRecentProduct(product){
  const exists = recentProducts.find(item => item.id === product.id);

  if(!exists){
    recentProducts.unshift(product);
  }

  if(recentProducts.length > 4){
    recentProducts.pop();
  }

  updateRecentProducts();
}

function updateRecentProducts(){
  recentContainer.innerHTML = "";

  recentProducts.forEach(product => {
    recentContainer.innerHTML += `
      <div class="recent-card">
        <img src="${product.image}" width="100%" height="150" style="object-fit:cover;border-radius:10px;">
        <h4 style="margin-top:10px;">${product.name}</h4>
      </div>
    `;
  });
}

/* SHARE */
function shareProduct(productName){
  navigator.clipboard.writeText("Check out this product: " + productName);
  showToast("Product link copied 📤");
}

function login(){
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === "admin" && pass === "1234"){
    alert("Login Success");
    document.getElementById("loginBox").style.display = "none";
  } else {
    alert("Invalid login");
  }
}
updateCart();
paginateProducts();