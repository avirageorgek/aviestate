import { FaTrash } from "react-icons/fa";

const ImageDisplayer = (props) => {
    return (
        <div className="flex flex-row border-solid border-1 border-slate-500 rounded-lg p-2">
            <div className="w-5/6">
                <img className="min-w-12 min-h-12 max-w-16 max-h-16 rounded" src={props.imageUrl} alt="List image"></img>
            </div>
            <FaTrash className="self-center w-1/6" onClick={props.deleteHandler}/>
        </div>
    );
}

export default ImageDisplayer;