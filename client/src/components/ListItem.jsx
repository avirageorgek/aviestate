import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListItem = (props) =>{
    const deleteItem = async () => {
        await fetch(`/api/listing/${props.listItem._id}`, {
            method: "DELETE"
        })    
        props.deleteHandler(props.listItem._id);
    }

    return (
        <div className="rounded-lg border-solid border-2 border-black-900 p-4 my-2 flex flex-row">
            <p className="w-5/6 text-black-500">{props.listItem.name}</p>
            <div className="flex flex-row gap-2 w-1/6">
                <Link><FaRegEdit className="text-green-700"/></Link>
                <FaTrash className="text-red-700" onClick={deleteItem} />
            </div>
        </div>
    );
}

export default ListItem;