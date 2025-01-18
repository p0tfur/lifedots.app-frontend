# LifeDots

A visual representation of your life timeline using dots, showing both elapsed and remaining time based on average life expectancy.

https://lifedots.app

## Features

- Visual representation of life timeline using dots
- Birth year and country selection
- Local storage for saving preferences
- Responsive design using Tailwind CSS
- Dark/Light theme support
- Real-time statistics:
  - Current age
  - Life progress percentage
  - Time remaining
  - Motivational messages
- Privacy-focused: all data stored locally

## Technical Stack

- HTML5
- JavaScript (Vanilla)
- Tailwind CSS
- Local Storage API
- PWA Support

## Project Structure

```
lfd-app-front/
├── index.html          # Main application page
├── about.html          # About page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of use
├── css/
│   └── styles.css      # Tailwind and custom styles
├── js/
│   ├── app.js         # Main application logic
│   ├── config.js      # Configuration and constants
│   └── utils.js       # Utility functions
├── assets/            # Images and icons
└── README.md          # Project documentation
```

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Enter your birth year and optionally select your country
4. Click "Update Visualization" to see your life timeline

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Privacy

LifeDots.app respects user privacy:
- No data collection
- All calculations performed locally
- Preferences stored in browser's Local Storage
- No external API calls

## License

All rights reserved. For personal use only.
