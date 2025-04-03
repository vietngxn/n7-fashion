document.addEventListener('DOMContentLoaded', function() {
    const customerId = localStorage.getItem('customerId');
    const infoBtn = document.getElementById('info-btn');
    if (customerId) {
      infoBtn.href = './information.html';

    } else {
      infoBtn.href = './login.html';
    }
  });

const BASE_URL = 'https://n7-fashion-1.onrender.com';

        document.addEventListener('DOMContentLoaded', function() {
            fetchLeaderboard();
        });

        function fetchLeaderboard() {
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const leaderboardBody = document.getElementById('leaderboard-body');

            loading.style.display = 'block';
            error.style.display = 'none';
            leaderboardBody.innerHTML = ''; 

            fetch(`${BASE_URL}/leaderBoard`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Không thể lấy dữ liệu bảng xếp hạng');
                    }
                    return response.json();
                })
                .then(data => {
                    loading.style.display = 'none';
                    const leaderboard = data.leaderBoard.slice(0, 5);
                    displayLeaderboard(leaderboard);
                    if (leaderboard.length > 0) {
                        showFireworks(leaderboard[0].customerUserName || 'Top 1');
                    }
                })
                .catch(err => {
                    loading.style.display = 'none';
                    error.style.display = 'block';
                    error.textContent = `Lỗi: ${err.message}`;
                });
        }

        function displayLeaderboard(leaderboard) {
            const leaderboardBody = document.getElementById('leaderboard-body');

            leaderboard.forEach((entry, index) => {
                const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
                const rankIcon = index === 0 ? '<i class="fas fa-medal"></i>' : 
                                index === 1 ? '<i class="fas fa-medal"></i>' : 
                                index === 2 ? '<i class="fas fa-medal"></i>' : '';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="rank ${rankClass}">${rankIcon} ${index + 1}</td>
                    <td>${entry.customerUserName || 'Không có tên'}</td>
                    <td>${entry.email || 'Không có email'}</td>
                    <td class="total-spent">${entry.totalSpent.toLocaleString()} VND</td>
                `;
                leaderboardBody.appendChild(row);
            });
        }

