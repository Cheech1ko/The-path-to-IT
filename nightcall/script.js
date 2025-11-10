class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playPauseBtn = document.querySelector('.play-pause');
        this.progressBar = document.querySelector('.progress');
        this.progressContainer = document.querySelector('.progress-bar');
        this.currentTimeEl = document.querySelector('.time-current');
        this.totalTimeEl = document.querySelector('.time-total');
        this.lyricLines = document.querySelectorAll('.lyric-line');
        
        this.init();
    }
    
    init() {
        // Временные метки для текста песни (в секундах)
        this.lyricsData = [
            { time: 10, line: 0 },  // "There's something inside you"
            { time: 15, line: 1 },  // "It's hard to explain"
            { time: 20, line: 2 },  // "They're talking about you"
            { time: 25, line: 3 },  // "But you're still the same"
            { time: 30, line: 4 },  // "There's something inside you"
            { time: 35, line: 5 },  // "It's hard to explain"
            // Добавьте остальные временные метки
        ];
        
        this.setupEventListeners();
        this.updateTotalTime();
    }
    
    setupEventListeners() {
        // Кнопка play/pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // Прогресс-бар
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // Обновление прогресса
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Обновление текста песни
        this.audio.addEventListener('timeupdate', () => this.updateLyrics());
        
        // Когда трек загружен
        this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
    }
    
    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.textContent = '⏸';
        } else {
            this.audio.pause();
            this.playPauseBtn.textContent = '⏵';
        }
    }
    
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${percent}%`;
        
        // Обновление текущего времени
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateTotalTime() {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    updateLyrics() {
        const currentTime = this.audio.currentTime;
        
        // Сбрасываем все строки
        this.lyricLines.forEach(line => line.classList.remove('active'));
        
        // Находим активную строку
        let activeLineIndex = -1;
        for (let i = this.lyricsTiming.length - 1; i >= 0; i--) {
            if (currentTime >= this.lyricsTiming[i].time) {
                activeLineIndex = this.lyricsTiming[i].line;
                break;
            }
        }
        
        // Активируем строку
        if (activeLineIndex >= 0) {
            this.lyricLines[activeLineIndex].classList.add('active');
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Инициализация плеера когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});

// Проверка загрузки аудио
this.audio.addEventListener('canplaythrough', () => {
    console.log('Аудиофайл загружен и готов к воспроизведению');
    this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
});

this.audio.addEventListener('error', (e) => {
    console.error('Ошибка загрузки аудио:', e);
    alert('Ошибка загрузки аудиофайла. Проверьте путь к файлу.');
});

document.addEventListener('click', () => {
    this.audio.play().then(() => {
        console.log('Воспроизведение начато');
    }).catch(error => {
        console.log('Необходимо взаимодействие пользователя');
    });
}, { once: true }); // Сработает только один раз