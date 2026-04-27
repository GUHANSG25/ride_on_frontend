import axios from '../../../api/axiosInstance';

const RouteService = {

  getAll: async (page = 0, size = 5) => {
    const res = await axios.get(`/routes?page=${page}&size=${size}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`/routes/${id}`);
    return res.data;
  },

  save: async (routeData) => {
    const res = await axios.post("/routes", routeData);
    return res.data;
  },

  deactivate: async (id) => {
    await axios.delete(`/routes/${id}`);
    return id;
  },

  activate: async (id) => {
    await axios.put(`/routes/${id}`, { status: "Active" });
    return id;
  },

};

export default RouteService;