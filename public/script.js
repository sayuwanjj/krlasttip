const API_URL = 'http://localhost:3000/api';
let currentEditId = null;

document.addEventListener('DOMContentLoaded', loadNews);

async function loadNews() {
    const filterCategory = document.getElementById('filterCategory').value;
    const newsList = document.getElementById('newsList');
    
    try {
        newsList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Загрузка новостей...</p></div>';
        
        let url = `${API_URL}/news`;
        if (filterCategory) {
            url += `?category=${filterCategory}`;
        }

        const response = await fetch(url);
        const news = await response.json();

        if (!Array.isArray(news) || news.length === 0) {
            newsList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">📭 Нет новостей</p>';
            return;
        }

        newsList.innerHTML = news.map(item => `
            <div class="news-card">
                <div class="news-card-header">
                    <div style="flex: 1;">
                        <div class="news-card-title">${escapeHtml(item.title)}</div>
                        <span class="news-category">${escapeHtml(item.category)}</span>
                    </div>
                    <span class="news-card-emoji">${item.image || '📰'}</span>
                </div>
                
                <div class="news-card-content">${escapeHtml(item.content)}</div>
                
                <div class="news-card-meta">
                    <span>📅 ${new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                    <span>👁️ ${item.views || 0} просмотров</span>
                </div>

                <div class="news-card-actions">
                    <button class="btn-edit" onclick="openEditModal(${item.id})">✏️ Редактировать</button>
                    <button class="btn-delete" onclick="deleteNews(${item.id})">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        newsList.innerHTML = `<div class="error">❌ Ошибка загрузки: ${error.message}</div>`;
    }
}

async function createNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const category = document.getElementById('newsCategory').value;
    const image = document.getElementById('newsImage').value;
    const messageDiv = document.getElementById('createMessage');

    if (!title || !content || !category) {
        messageDiv.innerHTML = '<div class="error">❌ Заполните обязательные поля (Заголовок, Содержание, Категория)</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                category,
                image: image || '📰'
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.innerHTML = '<div class="success">✅ Новость опубликована успешно!</div>';
            
            document.getElementById('newsTitle').value = '';
            document.getElementById('newsContent').value = '';
            document.getElementById('newsCategory').value = '';
            document.getElementById('newsImage').value = '';

            setTimeout(() => {
                loadNews();
                messageDiv.innerHTML = '';
            }, 1500);
        } else {
            messageDiv.innerHTML = `<div class="error">❌ Ошибка: ${data.error || 'Не удалось опубликовать'}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="error">❌ Ошибка сети: ${error.message}</div>`;
    }
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/news/${id}`);
        const news = await response.json();

        document.getElementById('editTitle').value = news.title;
        document.getElementById('editContent').value = news.content;
        document.getElementById('editCategory').value = news.category;
        document.getElementById('editImage').value = news.image || '📰';

        currentEditId = id;
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        alert(`❌ Ошибка загрузки: ${error.message}`);
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

async function saveEdit() {
    if (!currentEditId) return;

    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;
    const category = document.getElementById('editCategory').value;
    const image = document.getElementById('editImage').value;

    if (!title || !content || !category) {
        alert('❌ Заполните все обязательные поля');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/news/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                category,
                image: image || '📰'
            })
        });

        if (response.ok) {
            closeEditModal();
            loadNews();
            alert('✅ Новость обновлена успешно!');
        } else {
            alert('❌ Ошибка при обновлении');
        }
    } catch (error) {
        alert(`❌ Ошибка: ${error.message}`);
    }
}

async function deleteNews(id) {
    if (!confirm('❓ Вы уверены, что хотите удалить эту новость?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadNews();
            alert('✅ Новость удалена успешно!');
        } else {
            alert('❌ Ошибка при удалении');
        }
    } catch (error) {
        alert(`❌ Ошибка: ${error.message}`);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
}
