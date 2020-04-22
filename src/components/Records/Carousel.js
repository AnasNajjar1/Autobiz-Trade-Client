import React, { Component } from "react";
import Slider from "react-slick";
import { withRouter } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import _ from "lodash";
class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      currentSlide: 0,
      popedUp: false,
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider2,
      nav2: this.slider2,
    });
  }

  togglePopup = () => {
    this.setState({ popedUp: !this.state.popedUp });
  };

  render() {
    if (this.props.items.length === 0) {
      return null;
    }
    let items = _.filter(this.props.items, function (o) {
      return o.value;
    });
    return (
      <div>
        <Slider
          asNavFor={this.state.nav1}
          ref={(slider) => (this.slider2 = slider)}
          infinite={false}
          className="slider-main"
          afterChange={(currentSlide) => {
            this.setState({ currentSlide: currentSlide });
          }}
        >
          {items.map(({ key, value }) => (
            <div key={key}>
              <img src={value} alt="" onClick={() => this.togglePopup()} />
            </div>
          ))}
        </Slider>
        {this.state.popedUp && (
          <Lightbox
            mainSrc={items[this.state.currentSlide].value}
            nextSrc={items[(this.state.currentSlide + 1) % items.length].value}
            prevSrc={
              items[(this.state.currentSlide + items.length - 1) % items.length]
                .value
            }
            onCloseRequest={this.togglePopup}
            onMovePrevRequest={() =>
              this.setState({
                currentSlide:
                  (this.state.currentSlide + items.length - 1) % items.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                currentSlide: (this.state.currentSlide + 1) % items.length,
              })
            }
          />
        )}
        <div className="slider-pagination">
          {this.state.currentSlide + 1} / {items.length}
        </div>
        <Slider
          asNavFor={this.state.nav1}
          ref={(slider) => (this.slider1 = slider)}
          infinite={false}
          swipeToSlide={true}
          variableWidth={true}
          focusOnSelect={true}
          className="slider-thumbmails mt-2"
        >
          {items.map(({ key, value }) => (
            <div key={key}>
              <img src={value} alt="" />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
export default withRouter(Carousel);
