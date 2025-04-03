const BASE_URL = 'http://localhost:3000';
function handleSignup(event) {
    event.preventDefault();
    const customerUserName = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const customerPassword = document.getElementById('signupPassword').value;

    fetch(`${BASE_URL}/customerSignUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerUserName, email, customerPassword }),
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
        return response.json();
    })
    .then(() => {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        document.getElementById('signupForm').reset();
        window.location.href = '../pages/login.html'; 
    })
    .catch(error => {
        console.error('Lỗi đăng ký:', error);
        alert(error.message); 
    });
}