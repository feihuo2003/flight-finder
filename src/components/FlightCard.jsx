import React, { useState } from 'react';
import BookingModal from './BookingModal';

const FlightCard = ({ flight }) => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showConnections, setShowConnections] = useState(false);

    const handleBookNow = () => {
        setShowBookingModal(true);
    };

    const handleBookingConfirm = (confirmation) => {
        console.log('Booking confirmed:', confirmation);
    };

    const hasConnections = flight.segments && flight.segments.length > 1;

    return (
        <>
            <div className="flight-card">
                <div className="flight-header">
                    <div className="airline-info">
                        <h3>{flight.airline}</h3>
                        <p className="flight-number">{flight.flightNumber}</p>
                    </div>
                    <div className="flight-price">
                        <span className="price">${flight.price}</span>
                    </div>
                </div>
                <div className="flight-details">
                    <div className="flight-time">
                        <div className="time-block">
                            <span className="time">{flight.departureTime}</span>
                            <span className="location">{flight.from}</span>
                        </div>
                        <div className="flight-duration">
                            <div className="duration-line"></div>
                            <span className="plane-icon">✈</span>
                        </div>
                        <div className="time-block">
                            <span className="time">{flight.arrivalTime}</span>
                            <span className="location">{flight.to}</span>
                        </div>
                    </div>
                    {flight.duration && (
                        <div className="flight-meta">
                            <span>{flight.duration}</span>
                            {flight.stops && <span className="stops">{flight.stops}</span>}
                            {hasConnections && (
                                <button
                                    className="connection-toggle"
                                    onClick={() => setShowConnections(!showConnections)}
                                >
                                    {showConnections ? '▼ Hide' : '▶ Show'} connections
                                </button>
                            )}
                        </div>
                    )}

                    {/* Connection Details */}
                    {showConnections && hasConnections && (
                        <div className="connections-detail">
                            {flight.segments.map((segment, idx) => (
                                <div key={idx} className="segment">
                                    <div className="segment-header">
                                        <span className="segment-number">Flight {idx + 1}</span>
                                        <span className="segment-flight">{segment.flightNumber}</span>
                                    </div>
                                    <div className="segment-route">
                                        <div className="segment-point">
                                            <strong>{segment.departure.airport}</strong>
                                            <span>{segment.departure.time}</span>
                                        </div>
                                        <div className="segment-arrow">→</div>
                                        <div className="segment-point">
                                            <strong>{segment.arrival.airport}</strong>
                                            <span>{segment.arrival.time}</span>
                                        </div>
                                    </div>
                                    {idx < flight.segments.length - 1 && (
                                        <div className="layover-info">
                                            ⏱ Layover in {segment.arrival.airport}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flight-actions">
                    <button className="select-button" onClick={handleBookNow}>
                        Book Now
                    </button>
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    flight={flight}
                    onClose={() => setShowBookingModal(false)}
                    onConfirm={handleBookingConfirm}
                />
            )}
        </>
    );
};

export default FlightCard;
