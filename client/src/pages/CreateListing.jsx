import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { PiCurrencyGbpFill } from "react-icons/pi";
import {uploadImages} from "../utils/fileUploads"; 
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';

import Loader from "../components/Loader";

const CreateListing = () => {

    const [offer, setOffer] = useState(false);
    const [dealType, setDealType] = useState("Rent");
    const [files, setFiles] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");

    const formik = useFormik({
        initialValues: {
          name: '',
          description: '',
          address: '',
          bedrooms: 0,
          bathrooms: 0,
          dealType: "Rent",
          furnished: false,
          parking: false,
          offer: false,
          regularPrice: 0,
          discountPrice: 0,
          images: null  
        },
        validationSchema: Yup.object({
          name: Yup.string()
            .max(50, 'Name must be 50 characters or less')
            .required('Name is required'),
          description: Yup.string()
            .max(1000, 'Must be 1000 characters or less')
            .required('Description is required'),
          address: Yup.string().required('Required'),
          bedrooms: Yup.number().required("Number of bedrooms is required"),
          bathrooms: Yup.number().required("Number of bath is required"),
          dealType: Yup.string().required(),
          furnished: Yup.boolean().required(),
          parking: Yup.boolean().required(),
          offer: Yup.boolean().required(),
          regularPrice: Yup.number().required(),
          discountPrice: Yup.number().when("offer", (offer, schema) => {
            if(offer) {
                return schema.required("Discount value is required");
            } else {
                return schema;
            }
          }),
          images: Yup.mixed().required("File is required")
        }),
        onSubmit: async values => {
            try {
                console.log(values);
                if(!values.offer) {
                    console.log("Offer is not there");
                    delete values.discountPrice;
                }
                if(files.length > 0) {
                    values.images = files;
                }
                console.log(values);
                const createListResult = await fetch("/api/listing/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                })
                
                const result = await createListResult.json();
                if(result.success) {
                    navigate("/");
                } else {
                    setFormError(result.message);
                    return;
                }
            } catch(err) {
                setFormError("Failed to create listing")
            };
            
        },
      });

    const fileUploadChangeHandler = async () => {
        setUploading(true);
        const fileResult = await uploadImages(files);
        setFiles(fileResult);
        setUploading(false);
    }

    return (
        <main className="mx-auto max-w-4xl p-3 mt-7">
            <h1 className="text-center font-semibold text-3xl mb-10">Create Listing</h1>
            <form className="w-full flex flex-col sm:flex-row gap-4" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-wrap mb-2">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                            id="name" type="text" 
                            placeholder="Name"
                            name="name" 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name} />
                            {formik.touched.name && formik.errors.name ? (
                            <p className="text-red-500 text-xs">Please fill out this field.
                            </p>)
                            : ""}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label htmlFor="message" className="uppercase block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <textarea id="description" name="description" rows="6" 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            className="block p-2.5 w-full text-sm mb-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Enter property description here ..."></textarea>
                            {formik.touched.description && formik.errors.description ? (
                            <p className="text-red-500 text-xs">Please fill out this field.</p>)
                            : ""}
                        </div>
                    </div>   
                    <div className="flex flex-wrap mb-2">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                Address
                            </label>
                            <textarea id="address" rows="3" name="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address}
                            className="block p-2.5 w-full mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Enter address here ..."></textarea>
                            {formik.touched.address && formik.errors.address ? (
                            <p className="text-red-500 text-xs">Please enter an address</p>)
                            : ""}
                        </div>
                    </div>
                    <div className="flex flex-row mb-2">
                        <div className="flex flex-col w-1/2 gap-2">
                            <label>Beds</label>
                            <input type="number" min="0" id="bedrooms" name="bedrooms"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bedrooms} 
                            className="rounded-lg appearance-none p-3 w-1/2" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label>Baths</label>
                            <input type="number" min="0" id="bathrooms" name="bathrooms"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bathrooms} 
                            className="rounded-lg appearance-none p-3 w-1/2" />
                        </div>
                        {formik.touched.bedrooms && formik.errors.bedrooms ? (
                            <p className="text-red-500 text-xs">Please enter number of bedrooms</p>)
                            : ""}
                        {formik.touched.bathrooms && formik.errors.bathrooms ? (
                            <p className="text-red-500 text-xs">Please enter number of bathrooms</p>)
                            : ""}
                    </div>
                    <div className="flex flex-col mb-2">
                        <label className="mb-2">Deal Type</label>
                        <div className="flex flex-row gap-6">
                            <div className="flex mb-4 items-center">
                                <input type="radio"  name="dealType" 
                                defaultChecked={dealType === "Rent" ? true : false} 
                                onChange={() => {
                                    
                                    setDealType("Rent")}}
                                onBlur={formik.handleBlur}
                                value={dealType === "Rent" ? true : false } 
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="dealType-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Rent
                                </label>
                            </div>
                            <div className="flex mb-4 items-center">
                                <input type="radio" 
                                defaultChecked={dealType === "Sell" ? true : false} 
                                onBlur={formik.handleBlur}
                                value={dealType === "Sell" ? true : false }
                                onChange={() => {
                                    
                                    setDealType("Sell")}}
                                name="dealType" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="dealType-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Sell
                                </label>
                            </div>
                        </div>    
                    </div>

                    <div className="flex flex-row flex-wrap gap-9">
                        
                        <div className="flex items-center mb-4">
                            <input id="furnished" type="checkbox" name="furnished" 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.furnished}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="default-checkbox" 
                            className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300">Furnished</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input id="parking" type="checkbox" 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.parking}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="default-checkbox" 
                            className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300">Parking</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input id="offer" type="checkbox" 
                            defaultChecked={offer} 
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                                    formik.handleChange(e);
                                    setOffer((oldState) => {
                                        return !oldState;
                                    })
                            }}
                            value={offer}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="offer" 
                            className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300">Offer</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full px-3">
                            <label htmlFor="website-admin" 
                            className="uppercase block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Regular Price {dealType === "Rent" ? "(GBP/month)" : ""}
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                    <PiCurrencyGbpFill size={25} />
                                </span>
                                <input type="text" id="regularPrice"
                                name="regularPrice"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.regularPrice}
                                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Regular Price" />
                            </div>
                        </div> 
                        {formik.touched.regularPrice && formik.errors.regularPrice ? (
                            <p className="text-red-500 text-xs">Please enter regular price</p>)
                            : ""}   
                    </div>
                    {
                        offer ? 
                        <div className="flex flex-wrap -mx-3 mb-2">
                            <div className="w-full px-3">
                                <label htmlFor="website-admin" 
                                className="uppercase block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Discounted Price {dealType === "Rent" ? "(GBP/month)" : ""}
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                        <PiCurrencyGbpFill size={25} />
                                    </span>
                                    <input type="text" id="discountPrice"
                                    name="discountPrice"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.discountPrice}
                                    className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Discounted Price" />
                                </div>
                            </div>
                            {formik.touched.discountPrice && formik.errors.discountPrice ? (
                            <p className="text-red-500 text-xs">Please enter discounted amount</p>)
                            : ""} 
                        </div> : 
                        ""
                    }
                    

                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                        The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                        onChange={(e)=> {
                            formik.handleChange(e);    
                            setFiles(e.target.files)}}
                        onBlur={formik.handleBlur}
                        value={formik.values.images}
                        name="images"
                        className='p-3 border border-gray-300 rounded w-full'
                        type='file'
                        id='images'
                        accept='image/*'
                        multiple
                        />
                        {
                            uploading ? 
                            <Loader /> :
                            ""
                        }
                        
                        <button
                        type='button'
                        onClick={fileUploadChangeHandler}
                        className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                        Upload
                        </button>
                    </div>
                    {formik.touched.images && formik.errors.images ? (
                    <p className="text-red-500 text-xs">Please upload atleast one image</p>)
                    : ""}
                    
                    <button type="submit" disabled={!(formik.isValid && formik.dirty)} className="rounded-lg p-3 bg-green-700 text-white  disabled:opacity-80 hover:opacity-90">Create List</button>
                </div>    
            </form>
        </main>
    );
}

export default CreateListing;