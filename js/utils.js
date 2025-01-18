// Storage utilities
const Storage = {
    get: () => {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {};
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return {};
        }
    },
    save: (data) => {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
};

// Theme utilities
const ThemeUtils = {
    applyTheme(theme) {
        const body = document.body;
        const root = document.documentElement;
        
        if (theme === 'dark') {
            body.classList.add('dark');
            body.classList.remove('light');
            root.style.colorScheme = 'dark';
        } else {
            body.classList.add('light');
            body.classList.remove('dark');
            root.style.colorScheme = 'light';
        }

        // Apply custom color theme if exists
        const customColor = localStorage.getItem('customColor') || 'default';
        this.applyCustomColor(customColor);

        // Update icons
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        if (theme === 'dark') {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }

        // Store theme
        localStorage.setItem('theme', theme);
    },

    applyCustomColor(color) {
        const root = document.documentElement;
        if (color === 'default') {
            root.style.removeProperty('--primary-color');
            root.style.removeProperty('--primary-color-dark');
        } else {
            root.style.setProperty('--primary-color', color);
            // Create a darker version for dark mode
            const darkerColor = this.adjustColorBrightness(color, -20);
            root.style.setProperty('--primary-color-dark', darkerColor);
        }
        localStorage.setItem('customColor', color);
    },

    adjustColorBrightness(hex, percent) {
        // Convert hex to RGB
        let r = parseInt(hex.substring(1,3), 16);
        let g = parseInt(hex.substring(3,5), 16);
        let b = parseInt(hex.substring(5,7), 16);

        // Adjust brightness
        r = Math.max(0, Math.min(255, r + (r * percent / 100)));
        g = Math.max(0, Math.min(255, g + (g * percent / 100)));
        b = Math.max(0, Math.min(255, b + (b * percent / 100)));

        // Convert back to hex
        return '#' + 
            Math.round(r).toString(16).padStart(2, '0') +
            Math.round(g).toString(16).padStart(2, '0') +
            Math.round(b).toString(16).padStart(2, '0');
    },

    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    },

    getCurrentTheme() {
        return document.body.classList.contains('dark') ? 'dark' : 'light';
    },

    initTheme() {
        // Check if theme is stored in localStorage
        let theme = localStorage.getItem('theme');
        
        // If no stored theme, check system preference
        if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        this.applyTheme(theme);
    }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeUtils.initTheme();
});

// Watch for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        ThemeUtils.applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Country detection utilities
const LocationUtils = {
    async detectCountry() {
        try {
            const response = await fetch(CONFIG.IP_API_URL);
            const data = await response.json();
            return {
                country: data.country_name,
                lifeExpectancy: this.getLifeExpectancy(data.country_code)
            };
        } catch (error) {
            console.error('Error detecting country:', error);
            return {
                country: null,
                lifeExpectancy: CONFIG.DEFAULT_LIFE_EXPECTANCY
            };
        }
    },

    getLifeExpectancy(countryCode) {
        // Simplified life expectancy data (you might want to use a more complete dataset)
        const lifeExpectancies = {
            // EU countries
            'AT': 81.5, // Austria
            'BE': 81.6, // Belgium
            'BG': 75.1, // Bulgaria
            'HR': 78.4, // Croatia
            'CY': 82.3, // Cyprus
            'CZ': 79.3, // Czech Republic
            'DK': 81.3, // Denmark
            'EE': 78.6, // Estonia
            'FI': 81.9, // Finland
            'FR': 82.5, // France
            'DE': 81.3, // Germany
            'GR': 82.2, // Greece
            'HU': 76.7, // Hungary
            'IE': 82.3, // Ireland
            'IT': 83.5, // Italy
            'LV': 75.7, // Latvia
            'LT': 76.0, // Lithuania
            'LU': 82.3, // Luxembourg
            'MT': 82.6, // Malta
            'NL': 82.1, // Netherlands
            'PL': 78.5, // Poland
            'PT': 81.9, // Portugal
            'RO': 75.6, // Romania
            'SK': 77.8, // Slovakia
            'SI': 81.6, // Slovenia
            'ES': 83.5, // Spain
            'SE': 82.8, // Sweden
            
            // Main Asian countries
            'CN': 76.9, // China
            'JP': 84.3, // Japan
            'KR': 83.0, // South Korea
            'IN': 69.7, // India
            'ID': 71.7, // Indonesia
            'SG': 83.6, // Singapore
            
            // Main American countries
            'US': 78.9, // United States
            'CA': 82.3, // Canada
            'MX': 75.1, // Mexico
            'BR': 75.9, // Brazil
            'AR': 76.7, // Argentina
            
            // Add more countries as needed
        };
        return lifeExpectancies[countryCode] || CONFIG.DEFAULT_LIFE_EXPECTANCY;
    }
};

// Date and calculation utilities
const DateUtils = {
    calculateAge: (birthYear) => {
        const today = new Date();
        const age = today.getFullYear() - birthYear;
        const monthDiff = today.getMonth();
        return {
            years: age,
            months: monthDiff,
            totalMonths: (age * 12) + monthDiff
        };
    },

    calculateLifeProgress: (birthYear, lifeExpectancy) => {
        const age = DateUtils.calculateAge(birthYear);
        const totalExpectedMonths = lifeExpectancy * 12;
        const progress = (age.totalMonths / totalExpectedMonths) * 100;
        return Math.min(Math.round(progress * 10) / 10, 100);
    },

    getTimeRemaining: (birthYear, lifeExpectancy) => {
        const age = DateUtils.calculateAge(birthYear);
        const remainingYears = Math.max(0, lifeExpectancy - age.years);
        const remainingMonths = Math.max(0, (remainingYears * 12) - age.months);
        return {
            years: Math.floor(remainingMonths / 12),
            months: remainingMonths % 12
        };
    }
};

// UI utilities
const UIUtils = {
    getMotivationalMessage: (progress) => {
        if (progress < 25) {
            return "Your journey is just beginning! Make every moment count.";
        } else if (progress < 50) {
            return "You're in your prime! Keep pushing forward.";
        } else if (progress < 75) {
            return "There's still so much to achieve! Stay focused.";
        } else {
            return "Cherish each day and share your wisdom with others.";
        }
    },

    formatTimeDisplay: (years, months) => {
        return `${years} years${months ? ` and ${months} months` : ''}`;
    }
};
