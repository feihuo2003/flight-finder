import React from 'react';
import FlightCard from './FlightCard';

const FlightList = ({ flights }) => {
    if (!flights || flights.length === 0) {
        return <div className="no-flights">No flights found. Try searching for a route!</div>;
    }

    return (
        <div className="flight-list">
            {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
            ))}
        </div>
    );
};

export default FlightList;
