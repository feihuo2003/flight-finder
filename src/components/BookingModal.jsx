import React, { useState } from 'react';
import './BookingModal.css';

const BookingModal = ({ flight, onClose, onConfirm }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Traveler Info, 3: Confirmation
    const [travelerInfo, setTravelerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        passportNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTravelerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            handleBooking();
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            // Simulate booking API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const confirmation = {
                bookingReference: `AER${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'Confirmed',
                flight: flight,
                traveler: travelerInfo
            };

            setBookingConfirmation(confirmation);
            setStep(3);

            if (onConfirm) {
                onConfirm(confirmation);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return travelerInfo.firstName &&
            travelerInfo.lastName &&
            travelerInfo.email &&
            travelerInfo.phone &&
            travelerInfo.dateOfBirth;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                {step === 1 && (
                    <div className="booking-step">
                        <h2>Flight Details</h2>
                        <div className="flight-summary">
                            <div className="summary-row">
                                <span className="label">Airline:</span>
                                <span className="value">{flight.airline}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Flight Number:</span>
                                <span className="value">{flight.flightNumber}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Route:</span>
                                <span className="value">{flight.from} → {flight.to}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Departure:</span>
                                <span className="value">{flight.departureTime}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Arrival:</span>
                                <span className="value">{flight.arrivalTime}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Date:</span>
                                <span className="value">{flight.date}</span>
                            </div>
                            <div className="summary-row price-row">
                                <span className="label">Total Price:</span>
                                <span className="value price">${flight.price}</span>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleNext}>
                            Continue to Traveler Information
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="booking-step">
                        <h2>Traveler Information</h2>
                        <form className="traveler-form">
                            <div className="form-row">
                                <div className="form-field">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={travelerInfo.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={travelerInfo.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={travelerInfo.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={travelerInfo.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={travelerInfo.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Passport Number</label>
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        value={travelerInfo.passportNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleNext}
                                disabled={!isFormValid() || loading}
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && bookingConfirmation && (
                    <div className="booking-step confirmation">
                        <div className="success-icon">✓</div>
                        <h2>Booking Confirmed!</h2>
                        <p className="confirmation-message">
                            Your flight has been successfully booked.
                        </p>
                        <div className="confirmation-details">
                            <div className="detail-item">
                                <span className="detail-label">Booking Reference:</span>
                                <span className="detail-value reference">{bookingConfirmation.bookingReference}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Passenger:</span>
                                <span className="detail-value">
                                    {bookingConfirmation.traveler.firstName} {bookingConfirmation.traveler.lastName}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{bookingConfirmation.traveler.email}</span>
                            </div>
                        </div>
                        <p className="confirmation-note">
                            A confirmation email has been sent to {bookingConfirmation.traveler.email}
                        </p>
                        <button className="btn-primary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
