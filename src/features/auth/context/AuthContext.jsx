import { useContext, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }){
    const[auth,setauth] = useState({token: null,refreshToken: null, mobile: null});
    const[purpose,setpurpose] = useState("");
    const[mobile,setmobile] = useState("");
    const[signupdata,setsignupdata] = useState(null);
    const [otpReady, setOtpReady] = useState(false);

    const navigate = useNavigate();

    const sendOtp = async (mobile, pur, data) => {
        setmobile(mobile);
        setpurpose(pur);

        if (pur === "LOGIN") {
            await axios.post("/auth/login", { mobile });
        } else if (pur === "SIGNUP") {
            setsignupdata(data);
            await axios.post("/auth/signup", {
            userName: data.userName,
            mobile: mobile,
            userRole: data.userRole,
            });
        }

        setOtpReady(true); 
    };

    const verifyOtp = async (otp) => {
        try{
            const res = await axios.post("/otp/verify",{
                mobile,
                otp,
                purpose,
            });

            if(purpose === "LOGIN"){
                const token = res.data.token;
                const refreshToken = res.data.refreshToken;

                const decoded = jwtDecode(token);
                const role = decoded.role;
                
                localStorage.setItem("token",token);
                localStorage.setItem("refreshToken",refreshToken);
                localStorage.setItem("isLoggedIn", "true");
                
                setauth({token,refreshToken,mobile});

                if(role === "ROLE_CUSTOMER"){
                    navigate("/home");
                    setTimeout(() => window.location.reload(), 100);
                }else if(role === "ROLE_OPERATOR"){
                    navigate("/operator/dashboard");
                }else{
                    navigate("/admin/dashboard");
                }
            }
            else if(purpose === "SIGNUP"){
                setOtpReady(false);
                return { success: true };
            }
        }catch(error){
            console.log(error);
        }
    };

    const resetOtp = () => setOtpReady(false); 

    return (
        <AuthContext.Provider value={{auth, sendOtp, verifyOtp,otpReady, resetOtp, mobile}}>
            {children}
        </AuthContext.Provider>
    )
}