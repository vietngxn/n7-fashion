// Hàm đăng nhập
const BASE_URL = 'http://localhost:3000';
function handleSignin(event) {
    event.preventDefault();
    const emailSignIn = document.getElementById('signinEmail').value;
    const customerPassword = document.getElementById('signinPassword').value;

    fetch(`${BASE_URL}/customerSignIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailSignIn, customerPassword }),
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
        return response.json();
    })
    .then(data => {
        const customer = data.customer;
        localStorage.setItem('customerId', customer._id);
        localStorage.setItem('username', customer.customerUserName);
        alert('Đăng nhập thành công!');
        window.location.href = './main.html'; 

    })
    .catch(error => {
        console.error('Lỗi đăng nhập:', error);
        alert(error.message);
    });
}