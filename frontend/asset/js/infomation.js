document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      infoBtn.href = './information.html';

    } else {
        alert('Vui lòng đăng nhập để truy cập trang này.');
     window.location.href = './login.html'; 
    }
  });

const BASE_URL = 'http://localhost:3000';
        async function loadCustomerData() {
            try {
                const customerId = localStorage.getItem("customerId"); 
                const response = await fetch(`${BASE_URL}/customerUpdate/${customerId}`, {
                    method: 'GET' 
                });
                
                if (!response.ok) throw new Error('Không thể tải dữ liệu');
                
                const customer = await response.json();
                document.getElementById('username').placeholder = customer.customerUserName || 'Username';
                document.getElementById('email').placeholder = customer.email || 'Email';
                document.getElementById('firstName').placeholder = customer.customerFirstName || 'Ho';
                document.getElementById('lastName').placeholder = customer.customerLastName || 'Ten';
                document.getElementById('dob').placeholder = customer.customerDateOfBirth || 'DD/MM/YY';
                document.getElementById('address').placeholder = customer.address || 'Dia chi';
                document.getElementById('email').disabled = true;
                
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        }
        async function updateCustomer() {
            try {
                const customerId = localStorage.getItem("customerId");
                const customerData = {
                    customerUserName: document.getElementById('username').value || undefined,
                    customerFirstName: document.getElementById('firstName').value || undefined,
                    customerLastName: document.getElementById('lastName').value || undefined,
                    customerDateOfBirth: document.getElementById('dob').value || undefined,
                    address: document.getElementById('address').value || undefined
                };
    
                const response = await fetch(`${BASE_URL}/customerUpdate/${customerId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customerData)
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
    
                const updatedCustomer = await response.json();
                alert('Cập nhật thông tin thành công!');
                loadCustomerData();
    
            } catch (error) {
                alert('Lỗi khi cập nhật: ' + error.message);
                console.error('Lỗi:', error);
            }
        }
    
        // Gọi hàm load khi trang được tải
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const mobileNav = document.querySelector('.mobile-nav');
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
            
            menuToggle.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                overlay.style.display = mobileNav.classList.contains('active') ? 'block' : 'none';
            });
            
            overlay.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                overlay.style.display = 'none';
            });
    
            // Tải dữ liệu khách hàng
            loadCustomerData();
        });

        function logout() {
            localStorage.removeItem("customerId"); 
            localStorage.removeItem("customerUserName");
            window.location.href = "login.html"; 
        }