import React, { useState, useEffect } from "react";
const brandsPath = require.context("../../assets/img/brands", true);
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
  return brandsPath(`./brand-${brand.toLowerCase().replace(" ", "-")}.jpg`);
};

export default BrandsCarousel;
