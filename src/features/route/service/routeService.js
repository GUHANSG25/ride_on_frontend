import axios from '../../../api/axiosInstance';

const RouteService = {

  getAll: async () => {
    const res = await axios.get("/routes");
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