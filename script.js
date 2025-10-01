// Загрузка данных
let menuData = {};

async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('data/fillings.json'),
            fetch('data/sizes.json'),
            fetch('data/examples.json'),
            fetch('data/reviews.json')
        ]);
        
        const [fillings, sizes, examples, reviews] = await Promise.all(
            responses.map(r => r.json())
        );
        
        menuData = { fillings, sizes, examples, reviews };
        showSection('fillings'); // Показать первый раздел по умолчанию
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('content').innerHTML = '<div class="section active">Ошибка загрузки данных</div>';
    }
}

function showSection(sectionName) {
    // Скрыть все разделы
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показать выбранный раздел
    let content = '';
    
    switch(sectionName) {
        case 'fillings':
            content = renderFillings();
            break;
        case 'sizes':
            content = renderSizes();
            break;
        case 'prices':
            content = renderPrices();
            break;
        case 'examples':
            content = renderExamples();
            break;
        case 'reviews':
            content = renderReviews();
            break;
        case 'contact':
            content = renderContact();
            break;
    }
    
    document.getElementById('content').innerHTML = content;
}

function renderFillings() {
    if (!menuData.fillings) return '<div class="section active">Загрузка...</div>';
    
    let html = '<div class="section active"><h2>🎂 Начинки для тортов</h2>';
    
    menuData.fillings.forEach(filling => {
        html += `
            <div class="filling-item">
                <h3>${filling.name}</h3>
                <p><strong>Описание:</strong> ${filling.description}</p>
                <p><strong>Цена:</strong> ${filling.price} руб/кг</p>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderSizes() {
    if (!menuData.sizes) return '<div class="section active">Загрузка...</div>';
    
    let html = '<div class="section active"><h2>📏 Размеры тортов</h2>';
    
    menuData.sizes.forEach(size => {
        html += `
            <div class="size-item">
                <h3>${size.name}</h3>
                <p><strong>Диаметр:</strong> ${size.diameter}</p>
                <p><strong>Порции:</strong> ${size.portions}</p>
                <p><strong>Множитель цены:</strong> ${size.multiplier}x</p>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderPrices() {
    if (!menuData.fillings || !menuData.sizes) return '<div class="section active">Загрузка...</div>';
    
    let html = '<div class="section active"><h2>💰 Расценки на торты</h2>';
    
    menuData.sizes.forEach(size => {
        html += `<h3>${size.name} (${size.portions} порций)</h3>`;
        html += '<table class="price-table">';
        html += '<tr><th>Начинка</th><th>Стоимость</th></tr>';
        
        menuData.fillings.forEach(filling => {
            const price = parseInt(filling.price) * parseFloat(size.multiplier);
            html += `<tr><td>${filling.name}</td><td>${price} руб</td></tr>`;
        });
        
        html += '</table><br>';
    });
    
    html += '</div>';
    return html;
}

function renderExamples() {
    if (!menuData.examples) return '<div class="section active">Загрузка...</div>';
    
    let html = '<div class="section active"><h2>📸 Примеры наших работ</h2><div class="gallery">';
    
    menuData.examples.forEach(example => {
        html += `
            <div class="gallery-item">
                <img src="${example.photo}" alt="${example.description}" onerror="this.src='https://via.placeholder.com/200x150/ff6b6b/white?text=Торт'">
                <p>${example.description}</p>
            </div>
        `;
    });
    
    html += '</div></div>';
    return html;
}

function renderReviews() {
    if (!menuData.reviews) return '<div class="section active">Загрузка...</div>';
    
    let html = '<div class="section active"><h2>⭐ Отзывы наших клиентов</h2>';
    
    menuData.reviews.forEach(review => {
        const stars = '⭐'.repeat(review.rating);
        html += `
            <div class="review">
                <h3>${review.name} ${stars}</h3>
                <p>${review.text}</p>
                <small>${review.date}</small>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderContact() {
    return `
        <div class="section active">
            <h2>💬 Свяжитесь с нами</h2>
            <div class="contact-info">
                <p><strong>📞 Телефон:</strong> +7 XXX XXX-XX-XX</p>
                <p><strong>✉️ Telegram:</strong> <a href="https://t.me/valery_cake_lab" target="_blank">@valery_cake_lab</a></p>
                <p><strong>📧 Email:</strong> valery@cakelab.ru</p>
                <p><strong>🏠 Адрес:</strong> г. Москва, ул. Кондитерская, 15</p>
                
                <h3>⏰ Время работы:</h3>
                <p>Пн-Пт: 9:00-20:00<br>Сб-Вс: 10:00-18:00</p>
                
                <h3>🚚 Доставка:</h3>
                <p>Бесплатная доставка по городу при заказе от 2000 руб</p>
            </div>
        </div>
    `;
}

// Загружаем данные при старте
loadData();
