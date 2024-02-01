import ListingModel from "../models/listing.model.js";
import {errorHandler} from "../util/error.js";

export const createListing = async (req, res, next) => {
    try {
        const user = req.user.id;
        const {name, description, address, regularPrice, discountPrice
            , bathrooms, bedrooms, furnished, parking, type, offer, imageUrls} = req.body;

        if(!name || !description || !address || !regularPrice || !discountPrice
            || !bathrooms || !bedrooms || !furnished || !parking 
            || !type || !offer || imageUrls.length < 1 ) {
                console.log("Inside");
                next(errorHandler(400, "Bad Request"));
                return;
        }

        const listingObj = {name, description, address, regularPrice, discountPrice
                , bathrooms, bedrooms, furnished, parking, type, offer, imageUrls, userRef: user
        };

        const listingData = await ListingModel(listingObj).save();
        
        return res.status(201)
        .json({
            success: true,
            message: "Successfully created listing",
            data: listingData
        });
    } catch(err) {
        next(errorHandler(500, "An error occured while creating a listing"));
    }
    
}