import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";

const ViewList = () => {
    const {listId} = useParams();
    const [listData, setListData] = useState(null);

    useEffect(() => {
        (async () => {
            let res = await fetch(`/api/listing/${listId}`);
            
            let listRes = await res.json();

            setListData(listRes.data);
        }
        )();
    }, [listId]);
    console.log("List data: ", listData);
    let sliderList = listData && listData.imageUrls.map((item) => {
        return (<swiper-slide lazy="true">
                    <img src={item} loading="lazy" alt="" />
        </swiper-slide>);
    });
    console.log("Image slides: ", sliderList);

    return (
        <swiper-container style={
            {
            "--swiper-navigation-color": "#fff", 
            "--swiper-pagination-color": "#fff"
            }
        } 
        pagination-clickable="true" 
        navigation="true" 
        className="mySwiper">
                {sliderList}
            </swiper-container>
    );
}

export default ViewList;