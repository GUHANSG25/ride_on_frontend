import axios from '../../../api/axiosInstance'

const BusService = {
  getAllBus: async () => {
    const res = await axios.get('/buses');
    return res.data;
  },
  saveBus: async (busData) => {
    const res = await axios.post("/buses",busData);
    return res.data;
  },
  deactivateBus: async (id) => {
    await axios.delete(`/buses/${id}`);
    return id;
  },
  updateBus: async (id,status) => {
    const res = await axios.put(`/buses/${id}?status=${status}`);
    return res.data;
  },
};

export default BusService;