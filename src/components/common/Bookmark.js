import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarFull } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { Api } from "../../providers/Api";

const Bookmark = ({ scope, refId, bookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const handleClick = (e) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
    putVehicleInBookmark();
  };

  const putVehicleInBookmark = async () => {
    try {
      const data = {
        favorite: !isBookmarked,
      };
      await Api.request("POST", `/bookmark/${scope}/${refId}/`, {}, data);
    } catch (err) {
      console.log(err);
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
