import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "../common/Translate";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
const padLeft = (nr, n, str) => {
  return Array(n - String(nr).length + 1).join(str || "0") + nr;
};
const Countdown = ({ secondsBeforeStart, secondsBeforeEnd }) => {
  const [seconds, setSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Function t ne fonctionne pas dans le useEffect ??
  const translation_day_and = t("day_and");
  const translation_days_and = t("days_and");
  // ---

  useEffect(() => {
    secondsBeforeStart > 0 ? setSeconds(secondsBeforeStart) : setSeconds(secondsBeforeEnd);
    setIsExpired(secondsBeforeEnd <= 0);
    setIsScheduled(secondsBeforeStart > 0);
  }, [secondsBeforeStart, secondsBeforeEnd]);

  useEffect(() => {
    const intervalCountdown = setInterval(() => {
      setLoading(false);
      if(!isExpired){
        setSeconds(seconds - 1);
        setTimeLeft(getTimeCountDown(seconds));
      }
    }, 1000);
    return () => clearInterval(intervalCountdown);
  }, [seconds]);

  const getTimeCountDown = (seconds) => {
    const dur = moment.duration(seconds, "seconds");
    let time = "";

    if (dur.days() === 1) time = `${dur.days()} ${translation_day_and} `;
    if (dur.days() > 1) time = `${dur.days()} ${translation_days_and} `;

    time += `${padLeft(dur.hours(), 2)}:${padLeft(
      dur.minutes(),
      2
    )}:${padLeft(dur.seconds(), 2)}`;

    return time;
  }

  return (
    loading === false && (
      <div className={isScheduled ? 'countdown-gray' : 'countdown'}>
        <span className="pr-1 d-lg-none d-xl-inline">{isScheduled ? t("startIn") : t("time_left")}</span>
        <FontAwesomeIcon
          icon={faClock}
          className={isExpired ? "text-danger" : "text-success"}
        />
        <span className="pl-1">
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
