import React from "react";
import Slider from "react-slick";
import Arrow from "../../assets/img/arrow_orange.svg";
import Clio from "../../assets/img/cars/renault-clio.jpg";
import AlfaRomeo from "../../assets/img/cars/alfa-romeo.jpg";
import DS3_1 from "../../assets/img/cars/ds3.jpg";
import DS3_2 from "../../assets/img/cars/ds3-n2.jpg";
import Fiat from "../../assets/img/cars/fiat-500.jpg";
import Kia from "../../assets/img/cars/kia-ceed.jpg";
import Peugeot from "../../assets/img/cars/peugeot-5008.jpg";
import Peugeot_308 from "../../assets/img/cars/peugeot-308.jpg";
import { t } from "../common/Translate";

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <div className={className} onClick={onClick} style={style}>
      <img className="customArrow" src={Arrow} alt="Previous slider arrow" />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <div className={className} onClick={onClick} style={style}>
      <img className="customArrow" src={Arrow} alt="Next slider arrow" />
    </div>
  );
};

const CustomSlide = (props) => {
  const { photo, title, subtitle, price, km, mec, power, alt } = props;

  return (
    <div className="carCard" {...props}>
      <div>
        <img src={photo} alt={alt} />
        <div className="titleData">
          <div className="title">{title}</div>
          <div className="subTitle">{subtitle}</div>
          <div className="priceContainer">
            {t("hpSellingPrice")}
            <div className="price">{price} €</div>
          </div>
        </div>
        <ul className="complementaryData">
          <li>
            {t("hpMileage")}
            <div className="dataValue">{km}</div>
          </li>
          <li>
            {t("hpMec")}
            <div className="dataValue">{mec}</div>
          </li>
          <li>
            {t("hpPower")}
            <div className="dataValue">{power}</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const CarsSection = ({ appLanguage }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const cars = [
    {
      photo: Clio,
      title: "Renault Clio",
      subtitle: "1.5 DCI 85 DYNAMIQUE QUICKSHIFT BVA",
      price: "3 000",
      km: "133 281 KM",
      mec: "01/05/2009",
      power: "63 kW",
      alt: "voiture Renault Clio",
    },
    {
      photo: Peugeot,
      title: "Peugeot 3008",
      subtitle: "GENERATION-II 1.6 THP 165 ALLURE EAT BVA START-STOP",
      price: "18 200",
      km: "55 267 KM",
      mec: "13/09/2017",
      power: "121 kW",
      alt: "voiture Peugeot 3008",
    },
    {
      photo: Kia,
      title: "Kia Ceed",
      subtitle: "1.6 CRDI 135 ACTIVE DCT BVA ISG",
      price: "11 000",
      km: "56 664 KM",
      mec: "27/06/2017",
      power: "100 kW",
      alt: "voiture Kia Ceed",
    },
    {
      photo: AlfaRomeo,
      title: "Alfa Romeo Mito",
      subtitle: "1.3 JTDM 95 SUPER START-STOP",
      price: "9 900",
      km: "15 021 KM",
      mec: "23/02/2018",
      power: "70 kW",
      alt: "voiture Alfa Romeo Mito",
    },
    {
      photo: DS3_1,
      title: "DS Automobiles DS3",
      subtitle: "1.6 VTI 120 SOCHIC",
      price: "7 300",
      km: "81 550 KM",
      mec: "01/01/2013",
      power: "88 kW",
      alt: "voiture DS3 SOCHIC 2013",
    },
    {
      photo: Fiat,
      title: "Fiat 500",
      subtitle: "1.3 MJT 75 SPORT",
      price: "3 000",
      km: "145 561 KM",
      mec: "01/11/2007",
      power: "55 kW",
      alt: "voiture Fiat 500",
    },
    {
      photo: DS3_2,
      title: "DS Automobiles DS3",
      subtitle: "1.6 VTI 120 SOCHIC",
      price: "6 000",
      km: "89 712 KM",
      mec: "01/06/2011",
      power: "88 kW",
      alt: "voiture DS3 SOCHIC 2011",
    },
    {
      photo: Peugeot_308,
      title: "Peugeot 308",
      subtitle: "1.6 HDI 110 PREMIUM PACK",
      price: "1 500",
      km: "184 480 KM",
      mec: "01/01/2008",
      power: "81 kW",
      alt: "voiture Peugeot 308",
    },
  ];

  return (
    <div className="hp-section cars">
      <h1>{t("hpTitle5")}</h1>
      <div className="sliderContainer">
        <Slider {...sliderSettings}>
          {cars.map((car) => {
            return <CustomSlide key={car} {...car}></CustomSlide>;
          })}
        </Slider>
      </div>
      <a className="cta" href={`/register/${appLanguage}`}>
        {t("accessAtStockCta")}
      </a>
    </div>
  );
};

export default CarsSection;
