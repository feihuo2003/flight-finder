
const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

let accessToken = null;
let tokenExpiration = 0;

const getAccessToken = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error("Missing Amadeus API credentials");
    }

    if (accessToken && Date.now() < tokenExpiration) {
        return accessToken;
    }

    const response = await fetch('/api/amadeus/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Expires in is in seconds, subtract a buffer
    tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
};

export const searchFlightsWithAmadeus = async (from, to, date) => {
    try {
        const token = await getAccessToken();

        // Amadeus expects date in YYYY-MM-DD format
        const response = await fetch(
            `/api/amadeus/v2/shopping/flight-offers?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${date}&adults=1&max=10`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Amadeus API Error:", errorData);
            throw new Error(`Amadeus API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        if (!data.data) return [];

        return data.data.map((offer, index) => {
            const itinerary = offer.itineraries[0];
            const firstSegment = itinerary.segments[0];
            const lastSegment = itinerary.segments[itinerary.segments.length - 1];
            const airlineCode = firstSegment.carrierCode;

            // Basic mapping - in a real app we'd map airline codes to names
            const airlineName = offer.validatingAirlineCodes[0] || airlineCode;

            return {
                id: offer.id,
                airline: airlineName,
                flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
                departureTime: new Date(firstSegment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arrivalTime: new Date(lastSegment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                price: offer.price.total,
                from: firstSegment.departure.iataCode,
                to: lastSegment.arrival.iataCode,
                date: date,
                duration: itinerary.duration.replace('PT', '').toLowerCase(),
                stops: itinerary.segments.length > 1 ? `${itinerary.segments.length - 1} stop(s)` : 'Nonstop'
            };
        });

    } catch (error) {
        console.error("Amadeus Service Error:", error);
        throw error;
    }
};

export const searchLocations = async (keyword) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `/api/amadeus/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}&page[limit]=5`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Amadeus API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Amadeus Location Search Error:", error);
        return [];
    }
};
