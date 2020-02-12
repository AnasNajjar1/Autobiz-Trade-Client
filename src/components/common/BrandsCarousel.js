import React from "react";
import { staticImagesUrl } from "../../config";

const BrandsCarousel = ({ brands }) => {
  return (
    <>
      {brands && (
        <div className="brands">
          {brands.map((brand, index) => (
            <img key={index} className="brand" src={brandImageFile(brand)} />
          ))}
        </div>
      )}
    </>
  );
};

const brandImageFile = brand => {
  return `${staticImagesUrl}/brandsLogos/${brand.replace(" ", "+")}.jpg`;
};

export default BrandsCarousel;
