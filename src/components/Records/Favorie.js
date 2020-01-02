import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faVial } from "@fortawesome/free-solid-svg-icons";
import { API } from "aws-amplify";

const Favorie = ({refId}) => {
    const [isFavorite, setIsFavorite] = useState()

    useEffect(() => {
        const getVehicles = async () => {
            try {
                const res =  await API.get(
                    "b2bPlateform",
                    `/vehicle/${refId}/bookmark`
                );
                setIsFavorite(res.favorite)
            } catch (e) {
                console.log('dossier ',refId,' n\'est pas ton favorie',e)
            }
        }
        getVehicles()
    }, [refId])

    const handleClick = () => {
        setIsFavorite(!isFavorite)
        putVehicleInFavorie()
    }

    const putVehicleInFavorie = async () => {
        try {
            let myInit = {
                body: { 
                    favorite: !isFavorite
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
