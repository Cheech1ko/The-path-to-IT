// script.js

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация GSAP и ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Анимация прелоадера
    const preloader = document.querySelector('.preloader');
    gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        delay: 2,
        onComplete: function() {
            preloader.style.display = 'none';
        }
    });
    
    // Параллакс эффект для фонов
    const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-image');
    
    parallaxElements.forEach(element => {
        const depth = element.getAttribute('data-depth') || 0.1;
        
        gsap.to(element, {
            yPercent: -20 * depth,
            ease: "none",
            scrollTrigger: {
                trigger: element.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        let animationProps = {
            opacity: 0
        };
        
        // Настройка начального состояния в зависимости от типа анимации
        switch(animationType) {
            case 'fade-up':
                animationProps.y = 50;
                break;
            case 'fade-down':
                animationProps.y = -50;
                break;
            case 'fade-right':
                animationProps.x = -50;
                break;
            case 'fade-left':
                animationProps.x = 50;
                break;
            case 'zoom-in':
                animationProps.scale = 0.8;
                break;
            case 'zoom-out':
                animationProps.scale = 1.2;
                break;
        }
        
        // Установка начального состояния
        gsap.set(element, animationProps);
        
        // Анимация при скролле
        gsap.to(element, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
            delay: parseFloat(delay),
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Дополнительные анимации для героя
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButton = document.querySelector('.hero-section .cta-button');
    
    if (heroTitle && heroSubtitle && heroButton) {
        const heroTimeline = gsap.timeline();
        
        heroTimeline
            .fromTo(heroTitle, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
            .fromTo(heroSubtitle, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
            .fromTo(heroButton, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    }
});
// Добавьте в script.js
function initYandexMap() {
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function() {
            const map = new ymaps.Map('yandex-map', {
                center: [53.193798, 45.016814], // Замените на координаты вашего барбершопа
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl']
            });
            
            // Добавляем метку
            const marker = new ymaps.Placemark([53.193798, 45.016814], {
                hintContent: 'Наш барбершоп',
                balloonContent: 'ул. Московская, 123<br>Пн-Вс: 10:00 - 22:00'
            });
            
            map.geoObjects.add(marker);
        });
    }
}

// Добавьте в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Подключаем Яндекс Карты API
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_ключ_API&lang=ru_RU';
    script.onload = initYandexMap;
    document.head.appendChild(script);
});