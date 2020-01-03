import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faVial } from "@fortawesome/free-solid-svg-icons";
import { API } from "aws-amplify";

const Bookmark = ({ refId, bookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked===1);
 
  useEffect(() => {
    setIsBookmarked(bookmarked===1)
  }, [bookmarked]);

  const handleClick = (e) => {
    e.preventDefault()
    setIsBookmarked(!isBookmarked);
    putVehicleInBookmark();
  };

  const putVehicleInBookmark = async () => {
    try {
      let myInit = {
        body: {
          favorite: !isBookmarked
        },
        response: true
      };
      await API.post(
        "b2bPlateform",
        `/vehicle/${refId}/bookmark`,
        myInit
      );
      return
    } catch (e) {
      console.log("dossier ", refId, " n'est pas ton Bookmark", e);
    }
  };

  return (
    //className="Bookmark-icon"
    <span className="star-icon-bookmark">
      <FontAwesomeIcon
        icon={faStar}
        className={(isBookmarked && "star-fav red") || "star-fav gray"}
        size="1x"
        onClick={e=>handleClick(e)}
      />
    </span>
  );
};

export default Bookmark;
