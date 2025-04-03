function showFireworks(top1Name) {
    const fireworksContainer = document.getElementById('fireworks');
    const top1NameElement = document.getElementById('top1-name');
    top1NameElement.textContent = `Chúc mừng ${top1Name}!`;
    fireworksContainer.style.display = 'block';
    const colors = ['#f1c40f', '#e74c3c', '#28a745', '#e67e22', '#2ecc71']; 
    for (let i = 0; i < 50; i++) { 
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const angle = Math.random() * 360;
        const distance = Math.random() * 300; 
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        particle.style.left = '50%';
        particle.style.top = '80%'; 
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particle.style.transform = `translate(${x}px, ${y}px)`;
        fireworksContainer.appendChild(particle);
    }
    setTimeout(() => {
        fireworksContainer.style.display = 'none';
        while (fireworksContainer.children.length > 1) {
            fireworksContainer.removeChild(fireworksContainer.lastChild);
        }
    }, 2000);
}