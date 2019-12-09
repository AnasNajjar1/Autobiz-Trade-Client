import React, { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      currentSlide: 1,
      overlay: false
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }
  componentDidUpdate() {
    if (this.props.history.location.hash === "#overlay") {
      document.getElementById("mainSliderWrapper").classList.add("overlay");
    } else {
      document.getElementById("mainSliderWrapper").classList.remove("overlay");
    }
  }

  openOverlay = () => {
    this.setState({
      overlay: true
    });
  };

  closeOverlay = () => {
    this.props.history.goBack();
    this.setState({
      overlay: false
    });
  };

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
            infinite={false}
            className="slider-main"
            afterChange={currentSlide => {
              this.setState({ currentSlide: currentSlide + 1 });
            }}
          >
            {Object.values(this.props.items).map((i, index) => (
              <div key={index}>
                <a href="#overlay" onClick={this.openOverlay}>
                  <img src={i.value} alt="" />
                </a>
              </div>
            ))}
          </Slider>
          <div className="slider-pagination">
            {this.state.currentSlide} / {this.props.items.length}
          </div>
        </div>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          infinite={false}
          swipeToSlide={true}
          variableWidth={true}
          focusOnSelect={true}
          className="slider-thumbmails mt-2"
        >
          {Object.values(this.props.items).map((i, index) => (
            <div key={index}>
              <img src={i.value} alt="" />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default withRouter(Carousel);
