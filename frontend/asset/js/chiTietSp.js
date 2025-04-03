document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customerId');
    const infoBtn = document.getElementById('info-btn');
    if (customerId) {
      infoBtn.href = './information.html';

    } else {
      infoBtn.href = './login.html';
    }
  });

const BASE_URL = 'http://localhost:3000';
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
let currentProduct = null;

async function fetchProductDetails() {
    if (!productId) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    try {
        console.log("Gọi API:", `${BASE_URL}/showAllProduct`);
        const response = await fetch(`${BASE_URL}/showAllProduct`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Phản hồi không OK:", response.status, text);
            throw new Error(`Lỗi khi lấy dữ liệu sản phẩm: ${response.status}`);
        }

        const data = await response.json();
        const product = data.products.find(p => p._id === productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại trong danh sách!");
        }
        console.log("Dữ liệu sản phẩm:", product);
        currentProduct = product;
        displayProductDetails(product);
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể tải thông tin sản phẩm: " + error.message);
    }
}

// Hàm hiển thị thông tin sản phẩm
function displayProductDetails(product) {
    document.getElementById("mainImg").src = product.information?.img || '../asset/image/product-2.png';
    document.getElementById("productName").textContent = product.productName;
    document.getElementById("productPrice").textContent = `${product.price.toLocaleString()} đ`;

    const colorOptions = document.getElementById("colorOptions");
    colorOptions.innerHTML = "";
    const defaultColors = ["Trắng", "Xám", "Đen"];
    const colors = product.information?.colors || defaultColors;
    colors.forEach(color => {
        const input = document.createElement("input");
        input.type = "radio";
        input.id = `color-${color.toLowerCase()}`;
        input.name = "color";
        input.className = "color-input";
        input.value = color;

        const label = document.createElement("label");
        label.htmlFor = `color-${color.toLowerCase()}`;
        label.className = "color-label";
        label.textContent = color;

        colorOptions.appendChild(input);
        colorOptions.appendChild(label);
    });

    // Cập nhật size
    const sizeOptions = document.getElementById("sizeOptions");
    sizeOptions.innerHTML = "";
    const defaultSizes = ["S", "M", "L", "XL"];
    const sizes = product.information?.sizes || defaultSizes;
    sizes.forEach(size => {
        const input = document.createElement("input");
        input.type = "radio";
        input.id = `size-${size.toLowerCase()}`;
        input.name = "size";
        input.className = "size-input";
        input.value = size;

        const label = document.createElement("label");
        label.htmlFor = `size-${size.toLowerCase()}`;
        label.className = "size-label";
        label.textContent = size;

        sizeOptions.appendChild(input);
        sizeOptions.appendChild(label);
    });

    // Cập nhật mô tả
    const description = document.getElementById("description");
    description.innerHTML = `
        <li>Chất liệu: ${product.information?.material || "PIQUE"}</li>
        <li>Độ co giãn: ${product.information?.stretch || "70% COTTON, 27% POLY, 3% SPANDEX"}</li>
        <li>Form: ${product.information?.form || "REGULAR"}</li>
        <li>Màu: ${colors.join(", ")}</li>
        <li>Size: ${sizes.join(" - ")}</li>
        <li>Sản phẩm đã có mặt tại toàn bộ các cửa hàng trên hệ thống</li>
    `;

    const sizeGuide = document.getElementById("sizeGuide");
}
const quantityInput = document.getElementById('quantity');
function increaseQuantity() {
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
}
function decreaseQuantity() {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}

// Thêm vào giỏ hàng
async function addToCart() {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
    }

    if (!currentProduct) {
        alert("Không thể thêm sản phẩm do lỗi tải dữ liệu!");
        return;
    }

    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    if (!selectedSize) {
        alert("Vui lòng chọn size!");
        return;
    }

    const selectedColor = document.querySelector('input[name="color"]:checked')?.value;
    if (!selectedColor) {
        alert("Vui lòng chọn màu!");
        return;
    }

    const quantity = parseInt(quantityInput.value);

    const cartItem = {
        productId: productId,
        productName: currentProduct.productName,
        quantity: quantity,
        information: {
            size: selectedSize,
            color: selectedColor,
            img: currentProduct.information?.img || '../asset/image/product-2.png'
        },
        price: currentProduct.price,
        rating: currentProduct.rating || 0
    };

    try {
        console.log("Gửi dữ liệu giỏ hàng:", cartItem);
        const response = await fetch(`${BASE_URL}/customerAddProduct/${customerId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartItem)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Phản hồi không OK:", response.status, text);
            throw new Error(`Lỗi khi thêm sản phẩm: ${response.status}`);
        }

        const data = await response.json();
        console.log("Phản hồi thêm giỏ hàng:", data);
        alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi khi thêm sản phẩm: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", fetchProductDetails);