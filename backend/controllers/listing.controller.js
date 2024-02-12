import ListingModel from "../models/listing.model.js";
import {errorHandler} from "../util/error.js";

export const createListing = async (req, res, next) => {
    try {
        const user = req.user.id;
        const {name, description, address, regularPrice, discountPrice = 0
            , bathrooms, bedrooms, furnished, parking, dealType, offer, images =[]} = req.body;

        if(!name || !description || !address || !regularPrice
            || !bathrooms || !bedrooms
            || !dealType || images.length < 1 ) {
                console.log("Inside", images.length );
                next(errorHandler(400, "Bad Request"));
                return;
        }

        const listingObj = {name, description, address, regularPrice, discountPrice
                , bathrooms, bedrooms, furnished, parking, type: dealType, offer, imageUrls: images, userRef: user
        };

        const listingData = await ListingModel(listingObj).save();
        
        return res.status(201)
        .json({
            success: true,
            message: "Successfully created listing",
            data: listingData
        });
    } catch(err) {
        console.log(err)
        next(errorHandler(500, "An error occured while creating a listing"));
    }
    
}

export const getList = async (req, res, next) => {
    try {
        if(!req.params.id) return next(400, "Bad request");

        const list = await ListingModel.findById(req.params.id);

        if(list) {
            return res.status(200).json({
                success: true,
                message: "Success",
                data: list
            });
        } else {
            next(errorHandler(404, "List not found"));
        }
    } catch(err) {
        console.log(err);
        next(errorHandler(500, "An error occured while fetching list"));
    }
}

export const deleteList = async (req, res, next) => {
    try {
        const deleteStatus = await ListingModel.deleteOne({
            userRef: req.user.id,
            _id: req.params.id
        });

        return res.status(202).json({
            success: true,
            message:"Success"
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message:"Failed"
        });
    }
}