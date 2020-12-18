import React from "react";
import { staticImagesUrl } from "../../config";
import Slider from "react-slick";

const BrandsCarousel = ({ brands }) => {
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  return (
    <div className="carrousel-brands">
      <Slider {...settings}>
        {brands.map((brand, index) => (
          <div>
            <div className="carrousel-brand">
              <img
                key={index}
                src={brandImageFile(brand.brandLabel)}
                alt={brand.brandLabel}
              />
              <div>{brand.countVehicle}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const brandImageFile = (brand) => {
  return `${staticImagesUrl}/brandsLogos/${brand.replace(" ", "_")}.jpg`;
};

export default BrandsCarousel;
