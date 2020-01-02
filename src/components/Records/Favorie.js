import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { API } from "aws-amplify";

const Favorie = ({refId}) => {
    const [favorite, setFavorite] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const getVehicles = async () => {
            try {
                const res =  await API.get(
                    "b2bPlateform",
                    `/vehicle/${refId}/bookmark`
                );
                console.log(res)
                if (res.favorite === true) {
                    setIsFavorite(res)
                }
            } catch (e) {
                console.log('dossier ',refId,' n\'est pas ton favorie',e)
            }
        }
        getVehicles()
    }, [refId])

    const putVehicleInFavorie = async () => {
        try {
            let myInit = {
                body: { 
                    favorite: favorite
                },
                response: true
            }
            const result = await API.post(
                "b2bPlateform",
                `/vehicle/${refId}/bookmark`,
                myInit
            );
        } catch (e) {
            console.log('dossier ',refId,' n\'est pas ton favorie',e)
        }
    };
    
    const handleClick = () => {
        setIsFavorite(!isFavorite)
        setFavorite(!favorite)
        putVehicleInFavorie()
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
