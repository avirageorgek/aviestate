import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListItem = (props) =>{
    const deleteItem = async () => {
        await fetch(`/api/listing/${props.listItem._id}`, {
            method: "DELETE"
        })    
        props.deleteHandler(props.id);
    }

    return (
        <div className="rounded-lg border-solid border-2 border-black-900 p-4 my-2 flex flex-row bg-slate-200">
            <img class="min-w-12 min-h-12 max-w-16 max-h-16 rounded" src={props.listItem.imageUrls[0]} alt="List image"></img>
            <p className="w-5/6 text-black-500 mx-4 self-center">{props.listItem.name}</p>
            <div className="flex flex-row gap-2 w-1/6 self-center">
                <Link><FaRegEdit className="text-green-600"/></Link>
                <FaTrash className="text-red-700" onClick={deleteItem} />
            </div>
        </div>
    );
}

export default ListItem;