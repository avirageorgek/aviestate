import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        
    }
    
    const signUpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const result = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await result.json();
        console.log(data);
        if(data.success === false) {
            setErrorMessage(data.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        navigate("/sign-in");

    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semi-bold my-7">Sign Up</h1>
            <form onSubmit={signUpHandler} className="flex flex-col gap-4">
                <input className="shadow appearance-none p-3 rounded-lg border" type="text" 
                id="username" placeholder="Username..." onChange={changeHandler} />
                <input className="shadow appearance-none p-3 rounded-lg border" type="email" 
                id="email" placeholder="test@mail.com" onChange={changeHandler} />
                <input className="shadow appearance-none p-3 rounded-lg border" type="password" 
                id="password" placeholder="password" onChange={changeHandler} />
                <button disabled={loading} className="rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-90
                disabled:opacity-80">
                    {loading ? "Loading" : "Sign Up"}
                </button>
            </form>
            {errorMessage ? <p className="text-md text-red-500 my-2 text-center">{errorMessage}</p> : ""}
        </div>
    );
}

export default SignUp;