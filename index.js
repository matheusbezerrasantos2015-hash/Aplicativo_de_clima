const container = document.querySelector('.container');
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIKey = 'cb96365c2601bae209a7968e47a5079b';

function displayWeather(json) {
    if (json.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        setTimeout(() => error404.classList.add('fadeIn'), 50);
        return;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const image = document.querySelector('.weather-box img');
    const temperatura = document.querySelector('.weather-box .temperatura');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    const iconCode = json.weather[0].icon;
    image.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    temperatura.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = json.weather[0].description;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

    weatherBox.style.display = 'block';
    weatherDetails.style.display = 'flex';
    setTimeout(() => {
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
    }, 50);

    container.style.height = '600px';
}

function addRipple(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = e.currentTarget.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    e.currentTarget.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// Busca por cidade
searchBtn.addEventListener('click', function(e) {
    addRipple(e);
    const city = document.querySelector('.search-box input').value.trim();
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}&lang=pt`)
        .then(res => res.json())
        .then(json => displayWeather(json))
        .catch(err => console.error('Erro ao buscar dados:', err));
});

// Busca por localização
locationBtn.addEventListener('click', function(e) {
    addRipple(e);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}&lang=pt`)
                .then(res => res.json())
                .then(json => displayWeather(json))
                .catch(err => console.error('Erro ao buscar dados:', err));
        }, error => alert('Não foi possível obter sua localização.'));
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }
});
