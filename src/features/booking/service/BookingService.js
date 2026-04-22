import axios from '../../../api/axiosInstance'

const BookingService = {
  getMyBookings: async () => {
    const response = await axios.get('/bookings/my');
    return response.data;
  },
};

export default BookingService;