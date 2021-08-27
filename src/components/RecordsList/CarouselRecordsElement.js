import React, { useState } from "react";
import { Carousel, CarouselItem, CarouselControl } from "reactstrap";

export default function CarouselRecordsElement({ pictures, vehicle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === pictures.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? pictures.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = pictures.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.value}
      >
        <img
          src={item.value}
          className="card-img-top"
          alt={vehicle.brandLabel + " " + vehicle.modelLabel}
        />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous} interval={false}>
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}
