import React, { useState, useEffect,  } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "../common/Translate";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
import * as workerTimers from "worker-timers";

const padLeft = (nr, n, str) => {
  return Array(n - String(nr).length + 1).join(str || "0") + nr;
};

const getTimeCountDown = (seconds, precision) => {
  const dur = moment.duration(seconds, "seconds");

  let time = " ";

  if(precision === "seconds"){
    if (dur.days() === 1) time += `${dur.days()} ${t("day_and")} `;
    if (dur.days() > 1) time += `${dur.days()} ${t("days_and")} `;
    time += `${padLeft(dur.hours(), 2)}:${padLeft(dur.minutes(), 2)}:${padLeft(
      dur.seconds(),
      2
    )}`;
    }
  else{
    const minutes = dur.minutes();
    const hours = dur.hours();
    const days = dur.days();

    const minutesLabel = minutes > 1 ? t("minutes") : t("minute");
    
    if(days > 0){
      let daysKey = "day";
      
      if(days > 1 ) daysKey += "s";
      if(hours > 0) daysKey += "_and";
      
      time += `${days} ${t(daysKey)} `;
    }
    
    if(hours > 0){
      let hourskey = "hour";
      
      if(hours > 1) hourskey += "s";
      if(minutes > 0 && days < 1) hourskey += "_and";

      time += `${hours} ${t(hourskey)} `;

      if(days < 1 && minutes > 0)
        time += `${minutes} ${minutesLabel}`;
    }
    
    if(minutes > 0 && hours === 0 && days === 0) time += `${minutes} ${minutesLabel}`;

    if(minutes === 0 && hours === 0 && days === 0) time = <span className="blink">{t("imminent")}</span>;
  }

  return time;
};
const tStartIn = t("startIn");
const tTimeLeft = t("time_left");


const Countdown = ({ secondsBeforeStart, secondsBeforeEnd, precision, refresh }) => {
  const [seconds, setSeconds] = useState({bs : secondsBeforeStart, be: secondsBeforeEnd})
  const [loading, setLoading] = useState(true);
  const isExpired = seconds.be <= 0;
  const isScheduled = seconds.bs > 0;
  const timeLeft = getTimeCountDown(seconds.bs > 0 ? seconds.bs : seconds.be, precision);
  const coeff = precision === "seconds" ? 1 : 60
  const milliseconds = precision === "seconds" ? 1000 * coeff : 1000 * coeff;

  /*eslint-disable */
  useEffect(() => {
    setSeconds({bs : secondsBeforeStart, be : secondsBeforeEnd})
  }, [secondsBeforeStart, secondsBeforeEnd]);

  useEffect(() => {
    setLoading(false);
    if(refresh){
      const interval = workerTimers.setInterval(() => {
        if (!isExpired) {
          setSeconds({bs : seconds.bs - coeff, be : seconds.be - coeff})
        }

      }, milliseconds);
      return () => workerTimers.clearInterval(interval);
    }
  }, [seconds]);
  /*eslint-enable */

  return (
    loading === false && (
      <div
        className={isScheduled && !isExpired ? "countdown-gray" : "countdown"}
      >
        {!isExpired && (
          <span className="pr-1 d-lg-none d-xl-inline">{isScheduled ? tStartIn : tTimeLeft}</span>
        )}
        <FontAwesomeIcon
          icon={faClock}
          className={isExpired ? "text-danger" : "text-success"}
        />
        <span className="pl-1" id="countdown">
          {!isExpired && timeLeft}
          {isExpired && (
            <span className="text-danger">{t("countdown_over")}</span>
          )}
        </span>
      </div>
    )
  );
};


export default Countdown;
