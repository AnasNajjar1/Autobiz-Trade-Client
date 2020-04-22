import React from "react";
import { staticImagesUrl } from "../../config";

const BrandsCarousel = ({ brands }) => {
  return (
    <>
      {brands && (
        <div className="brands">
          {brands.map((brand, index) => (
            <div className="brand">
              <img
                key={index}
                src={brandImageFile(brand.label)}
                alt={brand.label}
              />
              <div>{brand.nbVehicles}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const brandImageFile = (brand) => {
  return `${staticImagesUrl}/brandsLogos/${brand.replace(" ", "+")}.jpg`;
};

export default BrandsCarousel;
