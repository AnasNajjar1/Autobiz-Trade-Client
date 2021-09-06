import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "../common/Translate";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";
const padLeft = (nr, n, str) => {
  return Array(n - String(nr).length + 1).join(str || "0") + nr;
};

const getTimeCountDown = (seconds) => {
  const dur = moment.duration(seconds, "seconds");
  let time = "";

  if (dur.days() === 1) time = `${dur.days()} ${t("day_and")} `;
  if (dur.days() > 1) time = `${dur.days()} ${t("days_and")} `;

  time += `${padLeft(dur.hours(), 2)}:${padLeft(
    dur.minutes(),
    2
  )}:${padLeft(dur.seconds(), 2)}`;

  return time;
}

const Countdown = ({ secondsBeforeStart, secondsBeforeEnd }) => {
  const [secondsBS, setSecondsBS] = useState(secondsBeforeStart);
  const [secondsBE, setSecondsBE] = useState(secondsBeforeEnd);
  const [seconds, setSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const isExpired = secondsBE <= 0;
  const isScheduled = secondsBS > 0;
  const timeLeft = getTimeCountDown(seconds)

  useEffect(() => { //refresh countdown based on api return (every 5 sec we call api)
    secondsBS > 0 ? setSeconds(secondsBS) : setSeconds(secondsBE);
  }, [secondsBS, secondsBE]);

  useEffect(() => {
    setLoading(false);
    const interval = setInterval(() => { //set countdown in between api calls
      if(!isExpired) {
        setSecondsBS(s=>s - 1);
        setSecondsBE(s=>s - 1);
      }
    }, 1000);
    return () => clearInterval(interval)
  }, [])

  const message = isScheduled ? t("startIn") : t("time_left")

  return (
    loading === false && (
      <div className={isScheduled && !isExpired ? 'countdown-gray' : 'countdown'}>
        {!isExpired && <span className="pr-1 d-lg-none d-xl-inline">{message}</span>}
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
