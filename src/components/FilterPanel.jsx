import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ flights, onFilterChange }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [selectedStops, setSelectedStops] = useState('any');
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);

    // Extract unique airlines from flights
    useEffect(() => {
        if (flights && flights.length > 0) {
            const airlines = [...new Set(flights.map(f => f.airline))].sort();
            setAvailableAirlines(airlines);

            // Set initial price range based on actual flight prices
            const prices = flights.map(f => parseFloat(f.price));
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange({ min: minPrice, max: maxPrice });
        }
    }, [flights]);

    // Apply filters whenever any filter changes
    useEffect(() => {
        if (!flights) return;

        const filtered = flights.filter(flight => {
            const price = parseFloat(flight.price);

            // Price filter
            if (price < priceRange.min || price > priceRange.max) return false;

            // Stops filter
            if (selectedStops !== 'any') {
                const stops = flight.stops || flight.duration || '';
                const isNonstop = stops.toLowerCase().includes('nonstop');
                const hasOneStop = stops.includes('1 stop');
                const hasTwoPlus = stops.includes('2') || stops.includes('3');

                if (selectedStops === 'nonstop' && !isNonstop) return false;
                if (selectedStops === '1' && !hasOneStop) return false;
                if (selectedStops === '2+' && !hasTwoPlus) return false;
            }

            // Airline filter
            if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
                return false;
            }

            return true;
        });

        onFilterChange(filtered);
    }, [priceRange, selectedStops, selectedAirlines, flights, onFilterChange]);

    const handleAirlineToggle = (airline) => {
        setSelectedAirlines(prev =>
            prev.includes(airline)
                ? prev.filter(a => a !== airline)
                : [...prev, airline]
        );
    };

    const resetFilters = () => {
        if (flights && flights.length > 0) {
            const prices = flights.map(f => parseFloat(f.price));
            setPriceRange({ min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) });
        }
        setSelectedStops('any');
        setSelectedAirlines([]);
    };

    if (!flights || flights.length === 0) return null;

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={resetFilters} className="reset-button">Reset</button>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
                <label className="filter-label">Price Range</label>
                <div className="price-inputs">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        className="price-input"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 2000 })}
                        className="price-input"
                    />
                </div>
                <div className="price-display">${priceRange.min} - ${priceRange.max}</div>
            </div>

            {/* Stops Filter */}
            <div className="filter-section">
                <label className="filter-label">Stops</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="any"
                            checked={selectedStops === 'any'}
                            onChange={(e) => setSelectedStops(e.target.value)}
                        />
                        Any
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="nonstop"
                            checked={selectedStops === 'nonstop'}
                            onChange={(e) => setSelectedStops(e.target.value)}
                        />
                        Nonstop
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="1"
                            checked={selectedStops === '1'}
                            onChange={(e) => setSelectedStops(e.target.value)}
                        />
                        1 Stop
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="2+"
                            checked={selectedStops === '2+'}
                            onChange={(e) => setSelectedStops(e.target.value)}
                        />
                        2+ Stops
                    </label>
                </div>
            </div>

            {/* Airlines Filter */}
            <div className="filter-section">
                <label className="filter-label">Airlines</label>
                <div className="checkbox-group">
                    {availableAirlines.map(airline => (
                        <label key={airline} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedAirlines.includes(airline)}
                                onChange={() => handleAirlineToggle(airline)}
                            />
                            {airline}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
