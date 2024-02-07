import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {updateStart, updateFailure, updateSuccess, 
    signOutSuccess, signOutFailure, deleteSuccess, deleteFailure} from "../redux/user/userSlice";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {app} from "../../firebase";
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Link } from "react-router-dom";

const Profile = () => {

    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [updateStatus, setUpdateStatus] = useState(false);

    //const []
    
    useEffect(() => {
        fileUploadToFireBase(file);
        //console.log(file);
    }, [file]);

    const formik = useFormik({
        initialValues: {
            email: user.currentUser.email,
            username: user.currentUser.username,
            password: '',
            avatar: user.currentUser.avatar
        },
        validationSchema: Yup.object({
        username: Yup.string()
            .min(3, 'Username should be atleast 3 characters')
            .max(15, 'Must be 15 characters or less')
            .required('Username is required field'),
        password: Yup.string()
            .min(5, 'Password must be minimum 5 characters.'),
        email: Yup.string().email('Please ente a valid email').required('Email field is required'),
        }),
        onSubmit: async values => {
            values.avatar = uploadedFileUrl ? uploadedFileUrl : user.currentUser.avatar;
            
            dispatch(updateStart());
            try {
                
                const updateResult =  await fetch(`/api/user/update/${user.currentUser._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                })
    
                const updateResultData = await updateResult.json();
                if(updateResultData.success) {
                   
                    dispatch(updateSuccess(updateResultData.data));
                    setErrorMessage("");
                    setUpdateStatus(true)
                } else {
                    setErrorMessage("Failed to update user");
                    dispatch(updateFailure("Failed to update user"));
                }
            } catch(err) {
                setErrorMessage("Failed to update user");
                dispatch(updateFailure("Failed to update user"));
                return;
            }
            
        },
    });

    const fileUploadToFireBase = (file) => {
        if(file) {
            const storage = getStorage(app);
            const storageRef = ref(storage, 'profile/'+ Date.now() +file.name);
    
            // Upload the file and metadata
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setFileUploadProgress(progress);
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    setFileUploadError(error.message);
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFileUploadProgress(100);    
                        setUploadedFileUrl(downloadURL);
                        
                    });
                }
            );
        } else {
            return false;
        }
            
    }

    const deleteProfileHandler = async () => {
        try {
            await fetch(`/api/user/delete/${user.currentUser._id}`, {
                method: "DELETE"
            });

            dispatch(deleteSuccess());
            setErrorMessage("");

        } catch(err) {
            setFileUploadError("");
            dispatch(deleteFailure("An error occured while deleting your profile"));
            setErrorMessage("An error occured while deleteing your profile.");
        }
    }

    const signOutHandler = async () => {
        try {
            let result = await fetch(`/api/user/signOut/${user.currentUser._id}`);

            dispatch(signOutSuccess());
            setErrorMessage("");

        } catch(err) {
            setFileUploadError("");
            dispatch(signOutFailure("An error occured while signing you out"));
            setErrorMessage("An error occured while signing you out");
        }
    }

    return (
        <>
            <div className="mx-auto max-w-lg p-3">
                <h1 className="p-7 font-semibold text-3xl text-center">Profile</h1>
                <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}> 
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept="image/*" hidden/>
                    <img src={uploadedFileUrl ? uploadedFileUrl : user.currentUser.avatar} 
                    id="avatar"
                    name="avatar"
                    onChange={formik.handleChange} onClick={() => fileRef.current.click()} 
                    className="rounded-full self-center shadow-lg h-24 w-24" />
                    {(fileUploadError ? <p className="text-red-700 text-center">An error occured while uploading the image</p> : (
                        fileUploadProgress ? 
                        ((fileUploadProgress > 0 && fileUploadProgress<100) ? 
                            <p className="text-red-700 text-center">Uploading {fileUploadProgress}%</p> : 
                            <p className="text-green-700 text-center">Uploaded successfully</p>
                        ) : "")
                    )}   
                    <div className="flex flex-col">
                        <input className="rounded-lg p-3 border appearance-none mt-4" 
                        type="email" disabled={user.currentUser.loginType === "google" ? true: false} id="email" 
                        name="email" onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email} placeholder="email"/>
                        {formik.touched.email && formik.errors.email ? (
                            <p className="text-red-700">{formik.errors.email}</p>
                        ) : null}
                    </div>
                    <div className="flex flex-col">
                        <input className="rounded-lg p-3 border appearance-none "  disabled={user.currentUser.loginType === "google" ? true: false}
                        type="username" id="username" name="username" placeholder="username" onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username} />  
                        {formik.touched.username && formik.errors.username ? (
                            <p className="text-red-700">{formik.errors.username}</p>
                        ) : null}                    
                    </div>    
                    <div className="flex flex-col">
                        <input className="rounded-lg p-3 border appearance-none " disabled={user.currentUser.loginType === "google" ? true: false}
                        type="password" id="password" name="password" placeholder="Password"  onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password} />
                        {formik.touched.password && formik.errors.password ? (
                            <p className="text-red-700">{formik.errors.password}</p>
                        ) : null}    
                    </div>    
                    <button type="submit" disabled={user.currentUser.loginType === "google" ? true: (!(formik.isValid ))} className="rounded-lg border p-3 bg-slate-700 text-white disabled:opacity-70">Update Profile</button>
                    {errorMessage ? <p className="text-red-700">{errorMessage}</p> : ""}
                    {updateStatus ? <p className="text-green-700">Successfully updated </p> : ""}
                    
                    <button type="button" className="rounded-lg p-3 text-white bg-green-800 w-auto">
                        <Link to="/create-listing">
                            Create Listing
                        </Link>
                    </button>
                    
                </form>
                <div className="flow-root mt-3">
                    <p className="float-left text-red-700" onClick={deleteProfileHandler}> Delete profile</p>
                    <p className="float-right text-red-700" onClick={signOutHandler}> SignOut</p>  
                </div>
                

            </div>    
        </>    
    );
}

export default Profile;