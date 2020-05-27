import React, { Component } from "react";
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
            <div class="carrousel-brand">
              <img
                key={index}
                src={brandImageFile(brand.label)}
                alt={brand.label}
              />
              <div>{brand.nbVehicles}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    >
      >
    </div>
  );
}

const BrandsCarouselOld = ({ brands }) => {
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
  return `${staticImagesUrl}/brandsLogos/${brand.replace(" ", "_")}.jpg`;
};

export default BrandsCarousel;
