import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarFull } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { API } from "aws-amplify";

const Bookmark = ({ scope, refId, bookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked === 1);

  useEffect(() => {
    setIsBookmarked(bookmarked === 1);
  }, [bookmarked]);

  const handleClick = (e) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
    putVehicleInBookmark();
  };

  const putVehicleInBookmark = async () => {
    try {
      let myInit = {
        body: {
          favorite: !isBookmarked,
        },
        response: true,
      };
      await API.post("b2bPlateform", `/bookmark/${scope}/${refId}/`, myInit);
      return;
    } catch (e) {
      //console.log("dossier ", refId, " n'est pas ton Bookmark", e);
    }
  };

  return (
    <span className="star-icon" onClick={(e) => handleClick(e)}>
      <span className="star-icon-bookmark">
        <FontAwesomeIcon
          icon={(isBookmarked && faStarFull) || faStarEmpty}
          className={
            (isBookmarked && "star-fav text-primary") || "star-fav text-primary"
          }
          size="1x"
        />
      </span>
    </span>
  );
};

export default Bookmark;
