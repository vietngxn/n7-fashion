document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customerId');
    const infoBtn = document.getElementById('info-btn');
    if (customerId) {
      infoBtn.href = './information.html';

    } else {
      infoBtn.href = './login.html';
    }
  });
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            overlay.style.display = mobileNav.classList.contains('active') ? 'block' : 'none';
        });
        
        overlay.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    fetchProducts(); 

    const searchButton = document.getElementById('search');
    if (searchButton) {
        searchButton.addEventListener('click', filterProducts);
    }
});

const BASE_URL = 'https://n7-fashion-1.onrender.com';
let allProducts = []; 
function fetchProducts() {
    fetch(`${BASE_URL}/showAllProduct`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            allProducts = data.products; 
            renderAllProducts(data.products);
        })
        .catch(error => {
            console.error('Lỗi khi lấy sản phẩm:', error);
            alert('Không thể tải danh sách sản phẩm: ' + error.message);
        });
}

// Hàm render tất cả sản phẩm
function renderAllProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; 

    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.setAttribute("data-id", product._id); 
        productItem.innerHTML = `
            <div class="product-card">
                <img src="${product.information.img}" alt="${product.productName}">
                <h3>${product.productName}</h3>
                <div class="price">Giá: ${product.price.toLocaleString()} VND</div>
                <div class="options">
                    <label>Size:</label>
                    <select id="size-${product._id}">
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <label>Màu:</label>
                    <select id="color-${product._id}">
                        <option value="Trắng">Trắng</option>
                        <option value="Xám">Xám</option>
                        <option value="Đen">Đen</option>
                    </select>
                </div>
                <br>
                <button onclick="handleAddToCart('${product._id}')">Thêm vào giỏ hàng</button>
                <button onclick="viewProductDetail('${product._id}')">Xem chi tiết</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
}

// Hàm lọc sản phẩm
function filterProducts() {
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;
    if (!type && !price) {
        updateProductVisibility(allProducts);
        return;
    }
    let maxPrice = price ? parseInt(price) : Infinity;
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    if (maxPrice !== Infinity) query.append('maxPrice', maxPrice);

    fetch(`${BASE_URL}/searchProduct?${query.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            updateProductVisibility(data.products); 
        })
        .catch(error => {
            console.error('Lỗi khi lọc sản phẩm:', error);
            alert('Không thể lọc sản phẩm: ' + error.message);
        });
}
function updateProductVisibility(filteredProducts) {
    const productList = document.getElementById("product-list");
    const productItems = productList.getElementsByClassName("product-item");
    for (let item of productItems) {
        item.style.display = "none";
    }
    if (!filteredProducts || filteredProducts.length === 0) {
        showNoProductsMessage();
        return;
    }
    filteredProducts.forEach(product => {
        const productItem = productList.querySelector(`[data-id="${product._id}"]`);
        if (productItem) {
            productItem.style.display = "block"; 
        }
    });
    const noProductsMessage = productList.querySelector(".no-products");
    if (noProductsMessage) {
        noProductsMessage.remove();
    }
}

//  hiển thị thông báo không có sản phẩm
function showNoProductsMessage() {
    const productList = document.getElementById("product-list");
    const existingMessage = productList.querySelector(".no-products");
    if (!existingMessage) {
        const noProductsMessage = document.createElement("div");
        noProductsMessage.classList.add("no-products");
        noProductsMessage.innerHTML = "<h3>Không có sản phẩm phù hợp</h3>";
        productList.appendChild(noProductsMessage);
    }
}

//chuyển hướng sang trang chi tiết
function viewProductDetail(productId) {
    window.location.href = `chitietsanpham.html?productId=${productId}`;
}

//trung gian để xử lý thêm vào giỏ hàng
function handleAddToCart(productId) {
    const product = findProductById(productId);
    if (product) {
        addToCart(product);
    } else {
        console.error("Không tìm thấy sản phẩm với ID:", productId);
    }
}

function findProductById(productId) {
    return allProducts.find(p => p._id === productId);
}

async function addToCart(product) {
    const idCustomer = localStorage.getItem("customerId");
    if (!idCustomer) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
    }

    const selectedSize = document.getElementById(`size-${product._id}`).value;
    const selectedColor = document.getElementById(`color-${product._id}`).value;

    const cartItem = {
        productId: product._id,
        productName: product.productName,
        quantity: 1,
        information: {
            size: selectedSize,
            color: selectedColor,
            img: product.information.img
        },
        price: product.price,
        rating: product.rating || 0
    };

    try {
        const response = await fetch(`${BASE_URL}/customerAddProduct/${idCustomer}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartItem)
        });

        if (response.ok) {
            alert("Đã thêm vào giỏ hàng!");
        } else {
            const errorData = await response.json();
            alert("Lỗi khi thêm sản phẩm: " + (errorData.message || "Không xác định"));
        }
    } catch (error) {
        alert("Lỗi kết nối đến server: " + error.message);
    }
}

