import axios from '../../../api/axiosInstance'

const BookingService = {
  getMyBookings: async () => {
    const response = await axios.get('/bookings/my');
    return response.data;
  },

  lockSeats: async (payload) => {
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

  getBookingsByOp: async (operatorId) => {
    const res = await axios.get(`/bookings/operator/${operatorId}`);
    return res.data;
  },

  cancelList: async () => {
    const res = await axios.get('bookings/cancel-list');
    return res.data;
  }
};

export default BookingService;