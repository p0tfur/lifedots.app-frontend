const CONFIG = {
    DEFAULT_LIFE_EXPECTANCY: 85,
    DOTS_PER_YEAR: 12, // One dot per month
    STORAGE_KEY: 'lifedots-prefs',
    LIFESTYLE_MODIFIERS: {
        healthy: {
            years: 5,
            description: 'Healthy diet adds 5 years',
            icon: '🥗'
        },
        exercise: {
            years: 3,
            description: 'Regular exercise adds 3 years',
            icon: '🏃'
        },
        drink: {
            years: -2,
            description: 'Regular drinking reduces life by 2 years',
            icon: '🍺'
        },
        smoke: {
            years: -10,
            description: 'Smoking reduces life by 10 years',
            icon: '🚬'
        }
    },
    DOT_SIZES: {
        mobile: {
            width: 4,
            margin: 3,
            get total() { return this.width + (this.margin * 2); }
        },
        tablet: {
            width: 6,
            margin: 4,
            get total() { return this.width + (this.margin * 2); }
        },
        desktop: {
            width: 10,
            margin: 6,
            get total() { return this.width + (this.margin * 2); }
        }
    },
    DOT_COLORS: {
        light: {
            elapsed: 'bg-primary-600',
            remaining: 'border-2 border-primary-200'
        },
        dark: {
            elapsed: 'bg-blue-400',
            remaining: 'border-2 border-gray-600'
        }
    },
    BREAKPOINTS: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
    },
    IP_API_URL: 'https://lifedots-geolocation.p-wesolowski.workers.dev/',  // Worker URL
    THEME_CLASSES: {
        light: {
            bg: 'bg-white',
            text: 'text-gray-900',
            card: 'bg-white',
            cardText: 'text-gray-800',
            button: 'bg-primary-600 hover:bg-primary-700',
            input: 'bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500',
            visualization: 'bg-white'
        },
        dark: {
            bg: 'bg-gray-900',
            text: 'text-gray-100',
            card: 'bg-gray-900',
            cardText: 'text-gray-200',
            button: 'bg-blue-500 hover:bg-blue-600',
            input: 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500',
            visualization: 'bg-gray-900'
        }
    }
};
