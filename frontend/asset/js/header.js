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
});