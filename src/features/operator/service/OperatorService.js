import axios from "../../../api/axiosInstance"

const OperatorService = {
    getAll : async( page=0 , size=5 ) => {
        const res = await axios.get(`/operators?page=${page}&size=${size}`);
        return res.data;
    },

    save : async (operatorData) => {
        const res = await axios.post("/operators",operatorData);
        return res.data;
    },

    pendingOp : async() => {
        const res = await axios.get("/operators/pending");
        return res.data;
    }
}

export default OperatorService;