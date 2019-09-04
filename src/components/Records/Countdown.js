import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

class CountdownText extends Component {
  constructor(props) {
    super();

    this.state = {
      endDate: props.endDate || moment(),
      countdown: "00:00:00",
      isExpired: false
    };
  }

  componentWillMount() {
    this.tick();

    this.interval = setInterval(() => {
      this.tick();
    }, 1e3);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  componentWillReceiveProps(props) {
    this.setState({
      endDate: props.endDate
    });
  }

  render() {
    const { countdown, isExpired } = this.state;

    return (
      <span className={`ReactCountdownMoment ${isExpired ? "expired" : ""}`}>
        {countdown}
      </span>
    );
  }

  tick() {
    const { endDate } = this.state;

    if (!endDate) {
      this.setState({
        countdown: "00:00:00"
      });
      return false;
    }

    const now = moment();
    const diff = endDate.diff(now, "seconds");

    if (diff <= 0) {
      this.setState({
        countdown: "00:00:00",
        isExpired: true
      });
      return false;
    }

    const dur = moment.duration(diff, "seconds");
    let countdown = "";
    if (dur.days() > 0) countdown = `${dur.days()}j `;

    countdown += `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;

    this.setState({
      countdown,
      isExpired: false
    });
  }
}

CountdownText.propTypes = {
  endDate: PropTypes.object
};

export default CountdownText;
