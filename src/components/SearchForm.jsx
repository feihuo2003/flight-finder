import React, { useState, useEffect } from 'react';
import { searchLocations } from '../services/amadeusService';

const SearchForm = ({ onSearch }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    // Debounce helper
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (from.length >= 2 && !from.includes('(')) {
                const results = await searchLocations(from);
                setFromSuggestions(results);
                setShowFromSuggestions(true);
            } else {
                setFromSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [from]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (to.length >= 2 && !to.includes('(')) {
                const results = await searchLocations(to);
                setToSuggestions(results);
                setShowToSuggestions(true);
            } else {
                setToSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [to]);

    const handleSelect = (location, type) => {
        const value = `${location.address.cityName} (${location.iataCode})`;
        if (type === 'from') {
            setFrom(value);
            setShowFromSuggestions(false);
        } else {
            setTo(value);
            setShowToSuggestions(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Extract IATA codes if present in format "City (CODE)"
        const fromCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
        const toCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;

        if (fromCode && toCode && date) {
            onSearch({ from: fromCode, to: toCode, date });
        }
    };

    const SuggestionList = ({ suggestions, onSelect, show }) => {
        if (!show || suggestions.length === 0) return null;
        return (
            <ul className="suggestions-list" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                zIndex: 1000,
                listStyle: 'none',
                padding: 0,
                margin: 0,
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                {suggestions.map((loc) => (
                    <li key={loc.id} onClick={() => onSelect(loc)} style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                    }}>
                        <strong>{loc.address.cityName}</strong> ({loc.iataCode})
                        <div style={{ fontSize: '0.8em', color: '#666' }}>{loc.name}</div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="from">From</label>
                <input
                    type="text"
                    id="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City or Airport"
                    required
                    autoComplete="off"
                />
                <SuggestionList
                    suggestions={fromSuggestions}
                    show={showFromSuggestions}
                    onSelect={(loc) => handleSelect(loc, 'from')}
                />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="to">To</label>
                <input
                    type="text"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City or Airport"
                    required
                    autoComplete="off"
                />
                <SuggestionList
                    suggestions={toSuggestions}
                    show={showToSuggestions}
                    onSelect={(loc) => handleSelect(loc, 'to')}
                />
            </div>
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="search-button">
                Find Flights
            </button>
        </form>
    );
};

export default SearchForm;
