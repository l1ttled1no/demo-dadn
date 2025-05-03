# Smart Home Dashboard

A modern React-based dashboard for monitoring and controlling smart home devices. Built with React, Vite, and integrated with Adafruit IO for IoT functionality.

## Features

- **Real-time Monitoring**
  - Temperature, Humidity, and Light Level sensors
  - Historical data visualization with charts
  - WebSocket-based live updates

- **Device Controls**
  - Smart Fan (4-speed control)
  - Door Control with Face Recognition integration
  - LED Control
  - Smart Pump System

- **User Interface**
  - Modern, responsive design
  - Interactive device cards
  - Real-time status indicators
  - Historical data charts

- **Settings & Configuration**
  - Customizable refresh intervals
  - Notification preferences
  - Adafruit IO integration settings

## Tech Stack

- React 18
- Vite
- Chart.js
- React Icons
- WebSocket
- Adafruit IO API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-home-dashboard.git
cd smart-home-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Adafruit IO credentials:
```env
VITE_ADAFRUIT_USERNAME=your_username
VITE_ADAFRUIT_KEY=your_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/         # React components
├── assets/            # Static assets
├── styles/            # CSS styles
└── App.jsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Nguyen Dang Duy
- Email: duynguyendang04@gmail.com
- GitHub: [@l1ttled1no](https://github.com/l1ttled1no)
