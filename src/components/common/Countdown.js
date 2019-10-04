import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Translate, { t } from "../common/Translate";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
const padLeft = (nr, n, str) => {
  return Array(n - String(nr).length + 1).join(str || "0") + nr;
};
const Countdown = ({ secondsLeft }) => {
  const [seconds, setSeconds] = useState(secondsLeft);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const intervalCountdown = setInterval(() => {
      setLoading(false);
      if (seconds <= 0) {
        setIsExpired(true);
      } else {
        setSeconds(seconds - 1);

        const dur = moment.duration(seconds, "seconds");
        let time = "";

        if (dur.days() === 1) time = `${dur.days()} ${t("day_and")} `;
        if (dur.days() > 1) time = `${dur.days()} ${t("days_and")} `;

        time += `${padLeft(dur.hours(), 2)}:${padLeft(
          dur.minutes(),
          2
        )}:${padLeft(dur.seconds(), 2)}`;

        setTimeLeft(time);
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(intervalCountdown);
  }, [seconds]);

  return (
    loading === false && (
      <div className="countdown">
        <span className="pr-1">
          <Translate code="time_left" /> :
        </span>
        <FontAwesomeIcon
          icon={faClock}
          className={isExpired ? "text-danger" : "text-success"}
        />
        <span className="pl-1">
          {!isExpired && timeLeft}
          {isExpired && <span className="text-danger">Terminé</span>}
        </span>
      </div>
    )
  );
};

export default Countdown;
