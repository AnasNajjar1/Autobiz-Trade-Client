import React, { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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
      popedUp: false
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  togglePopup = (index) => {
    console.log(index)
    let i = _.get(this.props.items, this.state.currentSlide, null)
    if(i === null) i = index+1
    this.setState({ currentSlide : i })
    this.setState({ popedUp : !this.state.popedUp })
  };

  render() {
    console.log(this.props.items, this.state.currentSlide)
    if (Object.keys(this.props.items).length === 0) {
      return null;
    }
    Object.entries(this.props.items).map(([i, v]) => {
      if(v.value === null) delete this.props.items[i]
    })
    return (
      <div>
          <Slider
            asNavFor={this.state.nav1}
            ref={slider => (this.slider1 = slider)}
            infinite={false}
            className="slider-main"
            afterChange={currentSlide => {
              this.setState({ currentSlide: currentSlide + 1 });
            }}
          >        
            {Object.values(this.props.items).map((i, index) => (
              <div key={index}>
                <img src={i.value} alt="" onClick={() => this.togglePopup(index)} />
              </div>
            ))}
          </Slider>
          {this.state.popedUp && <Lightbox
            mainSrc={this.props.items[this.state.currentSlide].value}
            nextSrc={this.props.items[(this.state.currentSlide + 1) % this.props.items.length].value}
            prevSrc={
              this.props.items[
                (this.state.currentSlide + this.props.items.length - 1) % this.props.items.length
              ].value
            }
            onCloseRequest={this.togglePopup}
            onMovePrevRequest={() => 
              this.setState({ currentSlide : (this.state.currentSlide + this.props.items.length - 1) % this.props.items.length })
            }
            onMoveNextRequest={() =>
              this.setState({ currentSlide: (this.state.currentSlide + 1) % this.props.items.length })
            }
          />}
          <div className="slider-pagination">
            {this.state.currentSlide} / {this.props.items.length}
          </div>
        <Slider
          asNavFor={this.state.nav2}
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
