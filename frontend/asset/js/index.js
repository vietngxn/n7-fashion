document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customerId');
    const registerBtn = document.getElementById('register-btn');
    const buyBtn = document.getElementById('buy-btn');
    const infoBtn = document.getElementById('info-btn');
    if (customerId) {
      registerBtn.href = './main.html';
      buyBtn.href = './main.html';

    } else {
      registerBtn.href = './register.html';
      buyBtn.href = './register.html';
    }
  });