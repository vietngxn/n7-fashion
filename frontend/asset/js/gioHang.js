const BASE_URL = 'http://localhost:3000';
let cartItems = [];

// Lấy và hiển thị giỏ hàng
async function fetchCart() {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
        alert("Vui lòng đăng nhập để xem giỏ hàng!");
        return;
    }

    try {
        console.log("Gọi API:", `${BASE_URL}/getCart/${customerId}`);
        const response = await fetch(`${BASE_URL}/getCart/${customerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Phản hồi không OK:", response.status, text);
            throw new Error(`Lỗi khi lấy dữ liệu giỏ hàng: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dữ liệu giỏ hàng:", data);
        cartItems = data.items || [];
        displayCart(cartItems);
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể tải giỏ hàng: " + error.message);
    }
}

//Hiển thị giỏ hàng lên giao diện
function displayCart(cartItems) {
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    cartList.innerHTML = "";

    let totalPrice = 0;

    if (cartItems.length === 0) {
        cartList.innerHTML = "<p>Giỏ hàng trống!</p>";
    } else {
        cartItems.forEach((item, index) => {
            const size = item.information.size || "Chưa chọn";
            const color = item.information?.color || "Chưa chọn";
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.information.img || '../asset/image/arrival-1.jpg'}" alt="${item.productName}">
                <div class="cart-info">
                    <p>${item.productName}</p>
                    <div class="info">Size: ${size} | Màu: ${color}</div>
                </div>
                <div class="cart-actions">
                    <button onclick="changeQuantity('${item.productId}', '${size}', '${color}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.productId}', '${size}', '${color}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-price">${itemTotal.toLocaleString()}đ</div>
                <button onclick="removeFromCart('${item.productId}', '${size}', '${color}')" class="btn btn-danger btn-sm">Xóa</button>
            `;
            cartList.appendChild(cartItem);
        });
    }

    cartTotal.textContent = `Tổng cộng: ${totalPrice.toLocaleString()}đ`;
}
function changeQuantity(productId, size, color, newQuantity) {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    if (newQuantity < 1) {
        removeFromCart(productId, size, color);
        return;
    }
    const item = cartItems.find(i => 
        i.productId === productId && 
        i.information.size === size && 
        i.information.color === color
    );
    if (item) {
        item.quantity = newQuantity;
        displayCart(cartItems);
    }
}
async function removeFromCart(productId, size, color) {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    try {
        const url = `${BASE_URL}/removeFromCart/${customerId}/${productId}/${encodeURIComponent(size)}/${encodeURIComponent(color)}`;
        console.log("Gọi API xóa:", url);
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Phản hồi không OK:", response.status, text);
            throw new Error(`Lỗi khi xóa sản phẩm: ${response.status} - ${text}`);
        }

        const data = await response.json();
        console.log("Phản hồi xóa:", data);
        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
        fetchCart(); 
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi khi xóa sản phẩm: " + error.message);
    }
}
document.addEventListener("DOMContentLoaded", fetchCart);