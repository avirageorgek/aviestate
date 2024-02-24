import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ListItem = (props) =>{
    const deleteItem = async () => {
        await fetch(`/api/listing/${props.listItem._id}`, {
            method: "DELETE"
        })    
        props.deleteHandler(props.id);
    }

    const navigate = useNavigate();

    return (
        <div className="rounded-lg border-solid border-2 border-black-900 p-4 my-2 flex flex-row bg-slate-200">
            <img className="min-w-12 min-h-12 max-w-16 max-h-16 rounded" src={props.listItem.imageUrls[0]} alt="List image"></img>
            <p className="w-5/6 text-black-500 mx-4 self-center cursor-pointer hover:scale-105"
            onClick={() => {
                navigate(`/view-list/${props.listItem._id}`);
            }}>{props.listItem.name}</p>
            <div className="flex flex-row gap-2 w-1/6 self-center">
                <Link to={"/update-listing/"+props.listItem._id}><FaRegEdit className="text-green-600 hover:scale-125"/></Link>
                <FaTrash className="text-red-700 cursor-pointer hover:scale-125" onClick={deleteItem} />
            </div>
        </div>
    );
}

export default ListItem;