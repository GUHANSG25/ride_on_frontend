import axios from "../../../api/axiosInstance";

const profileService = {
    getProfile: async () => {
        const res = await axios.get("user/profile");
        return res.data;
    },
    updateProfile: async (data) => {
        const response = await axios.patch(`user/profile/update`, data);
        return response.data;
    },
}

export default profileService;