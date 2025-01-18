# LifeDots

A visual representation of your life timeline using dots, showing both elapsed and remaining time based on average life expectancy.

https://lifedots.app

## Features

- Visual representation of life timeline using dots
- Birth year and country selection
- Local storage for saving preferences
- Responsive design using Tailwind CSS
- Real-time statistics:
  - Current age
  - Life progress percentage
  - Time remaining
  - Motivational messages

## Technical Stack

- HTML5
- JavaScript (Vanilla)
- Tailwind CSS
- Local Storage API

## Project Structure

```
lfd-app-front/
├── index.html          # Main HTML file
├── js/
│   ├── app.js         # Main application logic
│   ├── config.js      # Configuration and constants
│   └── utils.js       # Utility functions
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

## Performance Considerations

- Uses DOM fragments for efficient dot rendering
- Minimal dependencies
- Optimized localStorage usage
- Responsive design with Tailwind CSS

## Future Enhancements

- Export visualization as image
- Share functionality
- Different visualization modes
- Custom life expectancy input
- Progressive Web App conversion

## Contributing

Feel free to submit issues and enhancement requests!
