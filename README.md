# Flight Finder - AeroSearch ✈️

A modern flight search application built with React and Vite, featuring real-time flight data from the Amadeus API.

## Features

- **Live Flight Search**: Search for flights between any two cities using the Amadeus Flight Offers API
- **Autocomplete**: Smart city/airport search with autocomplete suggestions
- **Advanced Filters**: Price range, stops, and airline filters
- **Booking System**: Complete booking flow with traveler information and confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Amadeus API credentials (free tier available at [developers.amadeus.com](https://developers.amadeus.com))

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Amadeus API credentials
4. Start dev server: `npm run dev`
5. Open [http://localhost:5174](http://localhost:5174)

## Environment Variables

Create a `.env` file with:
```
VITE_AMADEUS_CLIENT_ID=your_client_id_here
VITE_AMADEUS_CLIENT_SECRET=your_client_secret_here
```

**Important**: Never commit your `.env` file to version control.

## Tech Stack

- React 18 with Vite
- Vanilla CSS
- Amadeus Flight Offers Search API
- Vite proxy for API requests

## License

MIT
