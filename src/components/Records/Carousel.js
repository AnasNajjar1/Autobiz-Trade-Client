import React, { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      currentSlide: 1
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  openOverlay(event) {
    document.getElementById("mainSliderWrapper").classList.add("overlay");
  }

  closeOverlay(event) {
    document.getElementById("mainSliderWrapper").classList.remove("overlay");
  }

  render() {
    if (Object.keys(this.props.items).length === 0) {
      return null;
    }
    return (
      <div>
        <div id="mainSliderWrapper">
          <p className="close-link" onClick={this.closeOverlay}>
            <FontAwesomeIcon icon={faTimes} /> Fermer
          </p>
          <Slider
            asNavFor={this.state.nav2}
            ref={slider => (this.slider1 = slider)}
            className="slider-main"
            afterChange={currentSlide => {
              this.setState({ currentSlide: currentSlide + 1 });
            }}
          >
            {Object.keys(this.props.items).map((value, index) => (
              <div key={index}>
                <img
                  src={this.props.items[value]}
                  alt=""
                  onClick={this.openOverlay}
                />
              </div>
            ))}
          </Slider>
          <div className="slider-pagination">
            {this.state.currentSlide} / {Object.keys(this.props.items).length}
          </div>
        </div>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={3}
          swipeToSlide={true}
          variableWidth={true}
          focusOnSelect={true}
          className="slider-thumbmails mt-2"
        >
          {Object.keys(this.props.items).map((value, index) => (
            <div key={index}>
              <img src={this.props.items[value]} alt="" />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default Carousel;
