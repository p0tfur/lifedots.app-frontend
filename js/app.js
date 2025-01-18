class LifeDotsApp {
    constructor() {
        this.state = {
            birthYear: null,
            lifeExpectancy: CONFIG.DEFAULT_LIFE_EXPECTANCY,
            theme: ThemeUtils.getCurrentTheme(),
            customColor: localStorage.getItem('customColor') || 'default',
            lifestyle: {
                healthy: false,
                exercise: false,
                drink: false,
                smoke: false
            }
        };
        
        this.elements = {
            birthYear: document.getElementById('birthYear'),
            currentAge: document.getElementById('currentAge'),
            lifeProgress: document.getElementById('lifeProgress'),
            timeRemaining: document.getElementById('timeRemaining'),
            motivationalMessage: document.getElementById('motivationalMessage'),
            dotsContainer: document.getElementById('dotsContainer'),
            themeToggle: document.getElementById('themeToggle'),
            colorTheme: document.getElementById('colorTheme'),
            toggleHealthy: document.getElementById('toggleHealthy'),
            toggleExercise: document.getElementById('toggleExercise'),
            toggleDrink: document.getElementById('toggleDrink'),
            toggleSmoke: document.getElementById('toggleSmoke'),
        };

        this.updateTimeout = null;
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    async init() {
        await this.detectLocation();
        this.loadSavedPreferences();
        ThemeUtils.applyTheme(this.state.theme);
        
        // Set initial color theme
        if (this.elements.colorTheme) {
            this.elements.colorTheme.value = this.state.customColor;
        }
        
        // Generate initial dots visualization
        this.generateDots(0);
        
        if (this.state.birthYear) {
            this.updateVisualization();
        }
        
        this.attachEventListeners();
    }

    handleResize() {
        if (this.state.birthYear) {
            this.updateVisualization();
        }
    }

    async detectLocation() {
        const { country, lifeExpectancy } = await LocationUtils.detectCountry();
        if (lifeExpectancy) {
            this.state.baseLifeExpectancy = lifeExpectancy;
            this.calculateLifeExpectancy();
        }
    }

    loadSavedPreferences() {
        const savedPrefs = Storage.get();
        if (savedPrefs) {
            this.state = { ...this.state, ...savedPrefs };
        }
    }

    calculateLifeExpectancy() {
        let expectancy = this.state.baseLifeExpectancy || CONFIG.DEFAULT_LIFE_EXPECTANCY;

        // Apply lifestyle modifiers
        if (this.state.lifestyle.healthy) expectancy += CONFIG.LIFESTYLE_MODIFIERS.healthy.years;
        if (this.state.lifestyle.exercise) expectancy += CONFIG.LIFESTYLE_MODIFIERS.exercise.years;
        if (this.state.lifestyle.drink) expectancy += CONFIG.LIFESTYLE_MODIFIERS.drink.years;
        if (this.state.lifestyle.smoke) expectancy += CONFIG.LIFESTYLE_MODIFIERS.smoke.years;

        this.state.lifeExpectancy = Math.max(expectancy, 1); // Ensure minimum of 1 year
        
        // Update visualization if birthYear is set
        if (this.state.birthYear) {
            this.updateVisualization();
        }
    }

    attachEventListeners() {
        // Birth year input
        this.elements.birthYear.addEventListener('input', () => this.handleUpdate());

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            const newTheme = ThemeUtils.toggleTheme();
            this.state.theme = newTheme;
            this.savePreferences();
        });

        // Color theme change listener
        if (this.elements.colorTheme) {
            this.elements.colorTheme.addEventListener('change', (e) => {
                ThemeUtils.applyCustomColor(e.target.value);
                this.state.customColor = e.target.value;
                this.savePreferences();
            });
        }

        // Lifestyle toggles
        Object.entries(CONFIG.LIFESTYLE_MODIFIERS).forEach(([key, config]) => {
            const toggle = this.elements[`toggle${key.charAt(0).toUpperCase() + key.slice(1)}`];
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const isChecked = toggle.getAttribute('aria-checked') === 'true';
                    toggle.setAttribute('aria-checked', (!isChecked).toString());
                    this.state.lifestyle[key] = !isChecked;
                    
                    // Update state and save preferences
                    this.calculateLifeExpectancy();
                    this.savePreferences();
                });
            }
        });

        // Share button
        document.getElementById('shareButton')?.addEventListener('click', () => this.handleShare());
        
        // Export button
        document.getElementById('exportButton')?.addEventListener('click', () => this.handleExport());
    }

    handleUpdate() {
        const birthYear = parseInt(this.elements.birthYear.value);
        if (!birthYear || isNaN(birthYear)) {
            return;
        }

        this.state.birthYear = birthYear;
        this.savePreferences();
        this.updateVisualization();
    }

    savePreferences() {
        Storage.save({
            birthYear: this.state.birthYear,
            theme: this.state.theme,
            lifestyle: this.state.lifestyle,
            customColor: this.state.customColor
        });
    }

    updateVisualization() {
        const age = DateUtils.calculateAge(this.state.birthYear);
        const progress = DateUtils.calculateLifeProgress(this.state.birthYear, this.state.lifeExpectancy);
        const remaining = DateUtils.getTimeRemaining(this.state.birthYear, this.state.lifeExpectancy);

        // Update statistics
        this.elements.currentAge.textContent = UIUtils.formatTimeDisplay(age.years, age.months);
        this.elements.lifeProgress.textContent = `${progress}%`;
        this.elements.timeRemaining.textContent = UIUtils.formatTimeDisplay(remaining.years, remaining.months);

        // Update motivational message
        const motivationalMessage = document.getElementById('motivationalMessage');
        if (age) {
          const message = UIUtils.getMotivationalMessage(progress);
          motivationalMessage.textContent = message;
          motivationalMessage.classList.remove('hidden');
        } else {
          motivationalMessage.classList.add('hidden');
        }

        // Generate dots
        this.generateDots(age.totalMonths);
    }

    getDotSize() {
        const width = window.innerWidth;
        if (width >= CONFIG.BREAKPOINTS.lg) {
            return CONFIG.DOT_SIZES.desktop;
        } else if (width >= CONFIG.BREAKPOINTS.md) {
            return CONFIG.DOT_SIZES.tablet;
        }
        return CONFIG.DOT_SIZES.mobile;
    }

    generateDots(elapsedMonths) {
        const totalMonths = this.state.lifeExpectancy * CONFIG.DOTS_PER_YEAR;
        this.elements.dotsContainer.innerHTML = '';

        // Calculate dots per row based on container width and dot size
        const dotSize = this.getDotSize();
        const containerWidth = this.elements.dotsContainer.offsetWidth;
        const dotsPerRow = Math.floor(containerWidth / dotSize.total);
        
        let html = '';
        for (let i = 0; i < totalMonths; i++) {
            const isFilled = i < elapsedMonths;
            html += `<span class="dot ${isFilled ? 'dot-filled' : 'dot-empty'}"></span>`;
            
            // Add a line break after each row
            if ((i + 1) % dotsPerRow === 0) {
                html += '\n';
            }
        }
        
        this.elements.dotsContainer.innerHTML = html;
    }

    async handleShare() {
        const shareData = {
            title: 'My Life Timeline - LifeDots.app',
            text: `Check out my life timeline! I'm ${this.state.currentAge} years old with ${this.state.timeRemaining} years ahead.`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                // You might want to show a tooltip or notification here
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    }

    async handleExport() {
        try {
            const visualizationArea = document.querySelector('[data-theme="visualization"]');
            const canvas = await html2canvas(visualizationArea, {
                backgroundColor: this.state.theme === 'dark' ? '#111827' : '#ffffff',
                scale: 2, // Higher quality
            });

            // Create download link
            const link = document.createElement('a');
            link.download = 'lifedots-timeline.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Error exporting image:', err);
            alert('Failed to export image. Please try again.');
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    ThemeUtils.applyTheme(ThemeUtils.getCurrentTheme());
    
    // Load saved preferences
    const savedPrefs = Storage.get();
    if (savedPrefs) {
        document.getElementById('birthYear').value = savedPrefs.birthYear || '';
        if (savedPrefs.lifestyle) {
            document.getElementById('toggleHealthy').checked = savedPrefs.lifestyle.healthy || false;
            document.getElementById('toggleExercise').checked = savedPrefs.lifestyle.exercise || false;
            document.getElementById('toggleDrink').checked = savedPrefs.lifestyle.drink || false;
            document.getElementById('toggleSmoke').checked = savedPrefs.lifestyle.smoke || false;
        }
        if (savedPrefs.customColor) {
            document.getElementById('colorTheme').value = savedPrefs.customColor;
        }
        
        // Update visualization immediately if birth year exists
        if (savedPrefs.birthYear) {
            const app = new LifeDotsApp();
            app.init();
            app.updateVisualization();
        } else {
            new LifeDotsApp().init();
        }
    } else {
        new LifeDotsApp().init();
    }
});
