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
    getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    },

    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        localStorage.setItem('theme', newTheme);
        
        this.applyTheme(newTheme);
        return newTheme;
    },

    applyTheme(theme) {
        const body = document.body;
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        // Remove existing theme classes
        body.classList.remove('dark', 'light');
        body.classList.add(theme);

        // Toggle icons and colors
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            body.classList.remove('bg-gray-50', 'text-gray-900');
            body.classList.add('bg-gray-900', 'text-gray-100');
            document.querySelector('footer').classList.remove('text-gray-600');
            document.querySelector('footer').classList.add('text-gray-400');
        } else {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            body.classList.remove('bg-gray-900', 'text-gray-100');
            body.classList.add('bg-gray-50', 'text-gray-900');
            document.querySelector('footer').classList.remove('text-gray-400');
            document.querySelector('footer').classList.add('text-gray-600');
        }

        // Apply theme classes to themed elements
        document.querySelectorAll('[data-theme]').forEach(element => {
            const themeType = element.dataset.theme;
            const classes = CONFIG.THEME_CLASSES[theme][themeType].split(' ');
            
            // Remove all possible theme classes first
            Object.values(CONFIG.THEME_CLASSES).forEach(themeClasses => {
                const classesToRemove = themeClasses[themeType].split(' ');
                element.classList.remove(...classesToRemove);
            });
            
            // Add new theme classes
            element.classList.add(...classes);
        });
    }
};

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
