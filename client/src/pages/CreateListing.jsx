
import { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { PiCurrencyGbpFill } from "react-icons/pi";
import { Formik, Field, Form, ErrorMessage } from 'formik';

import {uploadImages} from "../utils/fileUploads"; 
import * as Yup from 'yup';
import Loader from "../components/Loader";
import ImageDisplayer from "../components/ImageDisplayer";

export default function CreateListing() {
    const [dealType, setDealType] = useState("Rent");
    const [offer, setOffer] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState({
        imageUrls: [],
        uploadFiles: null
    });
    const navigate = useNavigate();
    const {listId} = useParams();
    const [currentListing, setCurrentListing] = useState(null);
    useEffect(() => {
        try {
            (async () => {
                if(listId) {
                    let res = await fetch(`/api/listing/${listId}`, {
                        method: "GET"
                    });
                    let result = await res.json();
                    
                    if(result.success) {
                        
                        //setCurrentListing(result.data);
                        setFiles({...files, ["imageUrls"]: result.data.imageUrls});
                        setCurrentListing({
                            name: result.data.name,
                            description: result.data.description,
                            address: result.data.address,
                            bedrooms: result.data.bedrooms,
                            bathrooms: result.data.bathrooms,
                            dealType: result.data.type,
                            furnished: result.data.furnished,
                            parking: result.data.parking,
                            offer: result.data.offer,
                            regularPrice: result.data.regularPrice,
                            discountPrice:0,
                            images: null,  
                        });

                    } else {
                        setCurrentListing(null);
                        setFiles({...files});
                        return;
                    }
                }    
    
            })()
        } catch(err) {
            return;
        }
        
        
    }, [listId]);

    const fileUploadChangeHandler = async () => {
        setUploading(true);
        const fileResult = await uploadImages(files.uploadFiles);
        setFiles({...files, ["imageUrls"]: [...files.imageUrls, fileResult]});
        setUploading(false);
    }

    const deleteImageHandler = (index) => {

        setFiles((currentFiles) => {
            currentFiles.imageUrls.splice(index, 1);
            console.log("Print current files", currentFiles);
            return {...currentFiles};
        });
    }

    return (
        <Formik enableReinitialize={true}
        validateOnBlur={true} 
        validateOnChange={true} 
        initialValues={currentListing || {
            name: "",
            description: "",
            address: "",
            bedrooms: 0,
            bathrooms: 0,
            dealType: "Rent",
            furnished: false,
            parking: false,
            offer: false,
            regularPrice: 0,
            discountPrice:0,
            images: null,  
        }}
        validationSchema={Yup.object({
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
            
        })}
        onSubmit={ async (values, {}) => {

            try {

                if(!values.offer) {
                    delete values.discountPrice;
                }
                if(files.imageUrls.length > 0) {
                    values.images = files.imageUrls;
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
                console.log("Re", result);
                if(result.success) {
                    navigate("/");
                } else {
                    setFormError(result.message);
                    return;
                }
            } catch(err) {
                setFormError("Failed to create listing")
            };
        }}
        >
            <main className="mx-auto max-w-4xl p-3 mt-7">
                <h1 className="text-center font-semibold text-3xl mb-10">Create Listing</h1>
                <Form className="w-full flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex flex-wrap mb-2">
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <Field className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                id="name" type="text" 
                                placeholder="Name"
                                name="name" />
                                <ErrorMessage name="name" className="text-red-500 text-xs" />
                            </div>
                        </div>
                        <div className="flex flex-wrap mb-2">
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <label htmlFor="message" className="uppercase block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Description
                                </label>
                                <Field id="description" component="textarea" rows="4" name="description" 
                                className="block p-2.5 w-full text-sm mb-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Enter property description here ..." />
                                <ErrorMessage name="description" className="text-red-500 text-xs" />
                            </div>
                        </div>   
                        <div className="flex flex-wrap mb-2">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                    Address
                                </label>
                                <Field id="address" component="textarea" rows="4" type="textarea"  name="address"
                                className="block p-2.5 w-full mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Enter address here ..." />
                                <ErrorMessage name="address" className="text-red-500 text-xs" />
                            </div>
                        </div>
                        <div className="flex flex-row mb-2">
                            <div className="flex flex-col w-1/2 gap-2">
                                <label>Beds</label>
                                <Field type="number" min="0" id="bedrooms" name="bedrooms"
                                className="rounded-lg appearance-none p-3 w-1/2" />
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <label>Baths</label>
                                <Field type="number" min="0" id="bathrooms" name="bathrooms"
                                className="rounded-lg appearance-none p-3 w-1/2" />
                            </div>
                            <ErrorMessage name="bedrooms" className="text-red-500 text-xs" />
                            <ErrorMessage name="bathrooms" className="text-red-500 text-xs" />
                        </div>
                        <div className="flex flex-col mb-2">
                            <label className="mb-2">Deal Type</label>
                            <div className="flex flex-row gap-6">
                                <div className="flex mb-4 items-center">
                                    <Field type="radio"  name="dealType"  value="Rent"
                                    onClick={() => {
                                    
                                        setDealType("Rent")}}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="dealType-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Rent
                                    </label>
                                </div>
                                <div className="flex mb-4 items-center">
                                    <Field type="radio"  value="Sell"
                                    onClick={() => {
                                    
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
                                <Field id="furnished" type="checkbox" name="furnished" 
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="default-checkbox" 
                                className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300">Furnished</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <Field id="parking" type="checkbox" name="parking"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="default-checkbox" 
                                className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300">Parking</label>
                            </div>
                            
                            <div className="flex items-center mb-4">
                                <Field id="offer" type="checkbox" name="offer"
                                onClick={(e) => {
                                        setOffer((oldState) => {
                                            return !oldState;
                                        })
                                }}
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
                                    <Field type="text" id="regularPrice"
                                    name="regularPrice"
                                    className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Regular Price" />
                                </div>
                            </div> 
                            <ErrorMessage name="regularPrice" className="text-red-500 text-xs" />   
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
                                        <Field type="text" id="discountPrice"
                                        name="discountPrice"
                                        className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="Discounted Price" />
                                    </div>
                                </div>
                                <ErrorMessage name="discountPrice" className="text-red-500 text-xs" />   
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
                                setFiles({...files, ["uploadFiles"  ]: e.target.files});
                            }}
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
                        <div>
                            {  files.imageUrls ? 
                                files.imageUrls.map((item, index) => {
                                    return <ImageDisplayer key={index} imageUrl={item} deleteHandler={() => { return deleteImageHandler(index) }}></ImageDisplayer>
                                }) :
                                ""
                            }
                            
                        </div>
                       
                        {
                            listId ? 
                            <button type="submit" disabled={files.imageUrls.length < 1 ? true: false} className="rounded-lg p-3 bg-green-700 text-white  disabled:opacity-80 disabled:cursor-not-allowed hover:opacity-50 cursor-pointer">Update List</button>
                            :  <button type="submit" disabled={files.imageUrls.length < 1 ? true: false} className="rounded-lg p-3 bg-green-700 text-white  disabled:opacity-80 disabled:cursor-not-allowed hover:opacity-50 cursor-pointer" >Create List</button>
                        }
                    
                    </div>    
                </Form>
            </main>
        </Formik>  
    );
    
}
