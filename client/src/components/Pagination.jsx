const Pagination =(props) => {

    const pageControlList = [];
    for(let i=0; i < props.numOfPages; i++) {
        pageControlList.push(
            <li key={i}>
                <a 
                onClick={() => {props.pageHandler(i)}}
                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                {i+1}</a>
            </li>
        );
    }

    return (
    <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10">
            <li>
            <a  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
            </li>
            {
            pageControlList 
            }
            <li>
            <a className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
            </li>
        </ul>
    </nav>)
}

export default Pagination;