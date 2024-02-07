import {app} from "../../firebase";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

export async function uploadImages(images) {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
    console.log(imagePromises);
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
}


export const uploadImage = async (image) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `/posts/${Date.now()}-${image.name}`);   
    const response =  await uploadBytes(storageRef, image);

    const url =  getDownloadURL(response.ref);
    return url;
}