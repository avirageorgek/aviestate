import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {

    const navigate = useNavigate();
    //const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    /**const changeHandler = (e) => {
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

    }**/

    const formik = useFormik({
        initialValues: {
          username: '',
          email: '',
          password: '',
        },
        validationSchema: Yup.object({
          username: Yup.string()
            .min(3, "Must be minimum 3 characters long")
            .max(15, 'Must be 15 characters or less')
            .required('Username is required'),
          password: Yup.string()
            .min(5, 'Must be minimum 5 characters long.')
            .required('Password is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async values => {
            setLoading(true);
            const result = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            const data = await result.json();

            if(data.success === false) {
                setErrorMessage(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            navigate("/sign-in");
        },
      });

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semi-bold my-7">Sign Up</h1>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <input className="shadow appearance-none p-3 rounded-lg border" type="text" 
                    id="username" placeholder="Username" {...formik.getFieldProps('username')} />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-red-500">{formik.errors.username}</p>
                    ) : null}
                </div>  
                <div className="flex flex-col gap-1"> 
                    <input className="shadow appearance-none p-3 rounded-lg border" type="email" 
                    id="email" placeholder="test@mail.com" {...formik.getFieldProps('email')}  />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-red-500">{formik.errors.email}</p>
                    ) : null}
                </div> 
                <div className="flex flex-col gap-1">
                    <input className="shadow appearance-none p-3 rounded-lg border" type="password" 
                    id="password" placeholder="password" {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500">{formik.errors.password}</p>
                    ) : null}
                </div>    
                <button type="submit" disabled={loading} className="rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-90
                disabled:opacity-80">
                    {loading ? "Loading" : "Sign Up"}
                </button>
            </form>
            
        </div>
    );
}

export default SignUp;