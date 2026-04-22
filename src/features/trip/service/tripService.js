import axios from '../../../api/axiosInstance';

const TripService = {

  getAll: async () => {
    const res = await axios.get("/trips");
    return res.data;
  },

  save: async (tripData) => {
    const res = await axios.post("/trips", tripData);
    return res.data;
  },

  search: async ( source, destination, date ) => {
    const res = await axios.get(`/trips/search?source=${ source }&destination=${ destination }&date=${ date }`);
    return res.data;
  },

};

export default TripService;