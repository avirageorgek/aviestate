import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";

const SignIn = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    //const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    //const [errorMessage, setErrorMessage] = useState("");
    const {loading, error} = useSelector((state) => { return state.user });
    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const signInHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const result = await fetch("/api/auth/signin", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
    
            const data = await result.json();
            if(data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
    
            dispatch(signInSuccess(data.data));
            //setLoading(false);
            navigate("/profile");
        } catch(err) {
            dispatch(signInFailure(data.message));
            return;
        }

    }

    return (
        <div className="mx-auto max-w-lg p-3">
            <h1 className="p-7 text-3xl font-semi-bold text-center">Sign In</h1>
            <form className="flex flex-col gap-4" onSubmit={signInHandler}>
                <div className="flex flex-col">
                    <input className="rounded-lg p-3 appearance-none border" type="text" 
                    id="username" name="username" placeholder="Username" onChange={onChangeHandler} />
                </div>
                <div className="flex flex-col">
                    <input className="rounded-lg p-3 appearance-none border" type="password" 
                    id="password" name="password" placeholder="Password" onChange={onChangeHandler} />
                </div>
                <button className="text-white p-3 rounded-lg bg-slate-700 hover:opacity-90">Sign In</button>
            </form>
            {error ? <p className="text-red-500 my-2">{error}</p> : ""}

            <p className="my-3">Don't have an account? <span className="text-blue-600 font-bold"><Link to="/sign-up">Sign Up</Link></span></p>
        </div>
    );
}

export default SignIn;