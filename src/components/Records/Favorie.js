import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { API } from "aws-amplify";

const Favorie = ({refId}) => {
    const [favorite, setFavorite] = useState()
    const [isFavorite, setIsFavorite] = useState(true)

    const putVehicleInFavorie = async () => {
        try {
            let myInit = {
                body: { favorite: true },
                response: true
            }
            const result = await API.post(
                "b2bPlateform",
                `/vehicle/${refId}`,
                myInit
            );
            setFavorite(result.data);
        } catch (e) {
            console.log('dossier ',refId,' n\'est pas ton favorie',e)
        }
    };
    
    const handleClick = () => {
        setIsFavorite(!isFavorite)
        //putVehicleInFavorie()
        console.log('refId', refId)
    }

    return (//className="favorie-icon"
        <>
            <FontAwesomeIcon 
                icon={faStar} 
                className={isFavorite && "star-fav red" || "star-fav gray"} 
                size="1x" 
                onClick={handleClick} 
            />  
        </>
    );
};

export default Favorie;
