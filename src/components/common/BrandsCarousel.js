import React, { useState, useEffect } from "react";
const brandsPath = require.context("../../assets/img/brands", true);
const BrandsCarousel = ({ brands }) => {
  return (
    <>
      {brands && (
        <div className="brands">
          {brands.map((brand, index) => (
            <img
              key={index}
              className="brand"
              src={brandsPath(`./brand-${brand.toLowerCase()}.jpg`)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BrandsCarousel;
