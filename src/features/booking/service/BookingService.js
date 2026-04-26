import axios from '../../../api/axiosInstance'

const BookingService = {
  getMyBookings: async () => {
    const response = await axios.get('/bookings/my');
    return response.data;
  },

  lockSeats: async (payload) => {
    // payload: { tripId, seatIds, pickupPoint, dropPoint, offerCode }
    const res = await axios.post('/bookings/lock-seats', payload);
    return res.data;
  },

  releaseSeats: async (seatIds) => {
    const res = await axios.post(`/bookings/release`,seatIds);
    return res.data;
  },

  getBookingByRef: async (bookingRef) => {
    const res = await axios.get(`/bookings/${bookingRef}`);
    return res.data;
  },

  cancelBooking: async (bookingRef) => {
    const res = await axios.post(`/bookings/${bookingRef}/cancel`);
    return res.data;
  },
};

export default BookingService;