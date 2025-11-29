import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightList from './components/FlightList';
import FilterPanel from './components/FilterPanel';
import { searchFlights } from './services/flightService';
import './index.css';
import './App.css';

function App() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async ({ from, to, date }) => {
    setLoading(true);
    setSearched(true);
    try {
      const results = await searchFlights(from, to, date);
      setFlights(results);
      setFilteredFlights(results);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
      setFilteredFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filtered) => {
    setFilteredFlights(filtered);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">✈️ AeroSearch</div>
        <nav>
          <a href="#">Flights</a>
          <a href="#">Hotels</a>
          <a href="#">Deals</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1>Find Your Next Adventure</h1>
          <p>Discover the best flight deals to your dream destinations.</p>

          <div className="search-container">
            <SearchForm onSearch={handleSearch} />
          </div>
        </section>

        <section className="results-section">
          {loading ? (
            <div className="loading-spinner">Searching for best flights...</div>
          ) : searched && flights.length > 0 ? (
            <div className="results-container">
              <aside className="filters-sidebar">
                <FilterPanel flights={flights} onFilterChange={handleFilterChange} />
              </aside>
              <div className="flights-main">
                <div className="results-header">
                  <h2>Available Flights</h2>
                  <p className="results-count">
                    Showing {filteredFlights.length} of {flights.length} flights
                  </p>
                </div>
                <FlightList flights={filteredFlights} />
              </div>
            </div>
          ) : searched && flights.length === 0 ? (
            <div className="no-results">No flights found. Try different search criteria.</div>
          ) : null}
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 AeroSearch. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
