import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import {useDispatch} from "react-redux";
import {signInSuccess, signInFailure} from "../redux/user/userSlice";
import {app} from "../../firebase";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const googleSignInHandler = async () => {
        try {
           
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const {displayName: username, email, photoURL: avatar} = result.user;
            
            const registerData = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username, email, avatar
                })
            })
            const registerResult = await registerData.json();
            if(registerResult.success) {
                registerResult.data.loginType = "google";
                dispatch(signInSuccess(registerResult.data));
                navigate("/profile");
            } else {
                dispatch(signInFailure("Failed to create a user"));
                return;
            }
            
        } catch(err) {
            dispatch(signInFailure("Failed to create a user"));
            return;
        }
        
    }
    return (
        <button type="button" onClick={googleSignInHandler} className="bg-red-700 text-white p-3 rounded-lg hover:opacity-90">Continue with Google</button>
    );
}

export default OAuth;