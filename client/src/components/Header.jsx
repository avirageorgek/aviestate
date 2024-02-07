import {Link} from "react-router-dom";

import {FaSearch} from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux";
import {signOutSuccess, signOutFailure} from "../redux/user/userSlice";

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state) => {
        return state.user;
    });

    const signOutHandler = async () => {
        try {
            let result = await fetch(`/api/user/signOut/${user.currentUser._id}`);
            dispatch(signOutSuccess());
        } catch(err) {
            dispatch(signOutFailure("An error occured while signing you out"));
        }
    }

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to={"/"}>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-violet-500">avi</span>
                        <span className="text-slate-700">estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input type="text" className="bg-transparent focus:outline-none w-24 sm:w-64" placeholder="Search..." />
                    <FaSearch className="text-slate-600"></FaSearch>
                </form>
                <ul className="flex gap-5 ">
                    <Link to="/">
                        <li className="hidden sm:inline text-slate-700 hover:text-violet-500">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-slate-700 hover:text-violet-500">
                            About
                        </li>
                    </Link>
                    {
                        user.currentUser ? 
                        <Link to="profile">
                            <li className="sm:inline text-slate-700">
                                Profile
                            </li>
                        </Link>    
                        : 
                        <Link to="sign-in">
                            <li className="sm:inline text-slate-700">
                                Signin
                            </li>
                        </Link>  
                    }
                </ul>
            </div>    
        </header>
    );
}