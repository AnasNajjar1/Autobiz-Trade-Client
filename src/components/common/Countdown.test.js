import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Countdown from "./Countdown";

let container = null;

const minutesToSeconds = (minute) => minute * 60 ;
const hoursToSeconds = (hour) => hour * 60 * 60;
const daysToSeconds = (day) => day * 24 * 60 * 60;




beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const testSeconds = (secondsBeforeEnd,precision) => {
  act(() => {    
    render(<Countdown secondsBeforeEnd={secondsBeforeEnd} precision={precision} />, container);  
  });
  return container.textContent;
}

// + 2 days
it("2 days and 02:02:02 should be 2 days and 2 hours", () => {
  const twoDaysTwoHoursTwoMinutesTwoSeconds = daysToSeconds(2) + hoursToSeconds(2) + minutesToSeconds(2) + 2;
  expect(testSeconds(twoDaysTwoHoursTwoMinutesTwoSeconds,"seconds")).toBe("time_left 2 days_and 02:02:02");
  expect(testSeconds(twoDaysTwoHoursTwoMinutesTwoSeconds,"minutes")).toBe("time_left 2 days_and 2 hours ");
});

it("2 days and 02:02:00 should be 2 days and 2 hours", () => {
  const twoDaysTwoHoursTwoMinutes = daysToSeconds(2) + hoursToSeconds(2) + minutesToSeconds(2);
  expect(testSeconds(twoDaysTwoHoursTwoMinutes,"seconds")).toBe("time_left 2 days_and 02:02:00");
  expect(testSeconds(twoDaysTwoHoursTwoMinutes,"minutes")).toBe("time_left 2 days_and 2 hours ");
});

it("2 days and 02:01:00 should be 2 days and 2 hours", () => {
  const twoDaysTwoHoursOneMinute = daysToSeconds(2) + hoursToSeconds(2) + minutesToSeconds(1);
  expect(testSeconds(twoDaysTwoHoursOneMinute,"seconds")).toBe("time_left 2 days_and 02:01:00");
  expect(testSeconds(twoDaysTwoHoursOneMinute,"minutes")).toBe("time_left 2 days_and 2 hours ");
});

it("2 days and 01:01:00 should be 2 days and 1 hour", () => {
  const twoDaysOneHourTwoMinutes = daysToSeconds(2) + hoursToSeconds(1) + minutesToSeconds(2);
  expect(testSeconds(twoDaysOneHourTwoMinutes,"seconds")).toBe("time_left 2 days_and 01:02:00");
  expect(testSeconds(twoDaysOneHourTwoMinutes,"minutes")).toBe("time_left 2 days_and 1 hour ");
});

it("2 days and 00:02:00 should be 2 days", () => {
  const twoDaysTwoMinutes = daysToSeconds(2) + minutesToSeconds(2);
  expect(testSeconds(twoDaysTwoMinutes,"seconds")).toBe("time_left 2 days_and 00:02:00");
  expect(testSeconds(twoDaysTwoMinutes,"minutes")).toBe("time_left 2 days ");
});

// + 1 day
it("1 day and 02:02:02 should be 1 day and 2 hours", () => {
  const oneDayTwoHoursTwoMinutesTwoSeconds = daysToSeconds(1) + hoursToSeconds(2) + minutesToSeconds(2) + 2;
  expect(testSeconds(oneDayTwoHoursTwoMinutesTwoSeconds,"seconds")).toBe("time_left 1 day_and 02:02:02");
  expect(testSeconds(oneDayTwoHoursTwoMinutesTwoSeconds,"minutes")).toBe("time_left 1 day_and 2 hours ");
});

it("1 day and 02:02:00 should be 1 day and 2 hours", () => {
  const oneDaysTwoHoursTwoMinutes = daysToSeconds(1) + hoursToSeconds(2) + minutesToSeconds(2);
  expect(testSeconds(oneDaysTwoHoursTwoMinutes,"seconds")).toBe("time_left 1 day_and 02:02:00");
  expect(testSeconds(oneDaysTwoHoursTwoMinutes,"minutes")).toBe("time_left 1 day_and 2 hours ");
});

it("1 day and 02:01:00 should be 1 day and 2 hours", () => {
  const oneDayTwoHoursOneMinute = daysToSeconds(1) + hoursToSeconds(2) + minutesToSeconds(1);
  expect(testSeconds(oneDayTwoHoursOneMinute,"seconds")).toBe("time_left 1 day_and 02:01:00");
  expect(testSeconds(oneDayTwoHoursOneMinute,"minutes")).toBe("time_left 1 day_and 2 hours ");
});

it("1 day and 01:02:00 should be 1 day and 1 hour", () => {
  const oneDayOneHourTwoMinutes = daysToSeconds(1) + hoursToSeconds(1) + minutesToSeconds(2);
  expect(testSeconds(oneDayOneHourTwoMinutes,"seconds")).toBe("time_left 1 day_and 01:02:00");
  expect(testSeconds(oneDayOneHourTwoMinutes,"minutes")).toBe("time_left 1 day_and 1 hour ");
});

it("1 day and 00:02:00 should be 1 day", () => {
  const oneDayTwoMinutes = daysToSeconds(1) + minutesToSeconds(2);
  expect(testSeconds(oneDayTwoMinutes,"seconds")).toBe("time_left 1 day_and 00:02:00");
  expect(testSeconds(oneDayTwoMinutes,"minutes")).toBe("time_left 1 day ");
});

// - 1 day
it("02:02:02 should be 2 hours and 2 minutes", () => {
  const twoHoursTwoMinutesTwoSeconds = hoursToSeconds(2) + minutesToSeconds(2) + 2;
  expect(testSeconds(twoHoursTwoMinutesTwoSeconds,"seconds")).toBe("time_left 02:02:02");
  expect(testSeconds(twoHoursTwoMinutesTwoSeconds,"minutes")).toBe("time_left 2 hours_and 2 minutes"); 
});

it("02:01:02 should be 2 hours and 1 minute", () => {
  const twoHoursOneMinuteTwoSeconds = hoursToSeconds(2) + minutesToSeconds(1) + 2;
  expect(testSeconds(twoHoursOneMinuteTwoSeconds,"seconds")).toBe("time_left 02:01:02");
  expect(testSeconds(twoHoursOneMinuteTwoSeconds,"minutes")).toBe("time_left 2 hours_and 1 minute"); 
})


it("02:00:02 should be 2 hours", () => {
  const twoHoursTwoSeconds = hoursToSeconds(2)  + 2;
  expect(testSeconds(twoHoursTwoSeconds,"seconds")).toBe("time_left 02:00:02");
  expect(testSeconds(twoHoursTwoSeconds,"minutes")).toBe("time_left 2 hours "); 
})

it("01:02:02 should be 1 hour and 2 minutes", () => {
  const oneHourTwoMinutesTwoSeconds = hoursToSeconds(1) + minutesToSeconds(2) +  2;
  expect(testSeconds(oneHourTwoMinutesTwoSeconds,"seconds")).toBe("time_left 01:02:02");
  expect(testSeconds(oneHourTwoMinutesTwoSeconds,"minutes")).toBe("time_left 1 hour_and 2 minutes"); 
})

it("01:01:02 should be 1 hour and 1 minute", () => {
  const oneHourOneMinuteTwoSeconds = hoursToSeconds(1) + minutesToSeconds(1) +  2;
  expect(testSeconds(oneHourOneMinuteTwoSeconds,"seconds")).toBe("time_left 01:01:02");
  expect(testSeconds(oneHourOneMinuteTwoSeconds,"minutes")).toBe("time_left 1 hour_and 1 minute"); 
})

it("01:00:02 should be 1 hour", () => {
  const oneHourTwoSeconds = hoursToSeconds(1) +  2;
  expect(testSeconds(oneHourTwoSeconds,"seconds")).toBe("time_left 01:00:02");
  expect(testSeconds(oneHourTwoSeconds,"minutes")).toBe("time_left 1 hour "); 
})

it("00:02:02 should be 2 minutes", () => {
  const oneHourTwoSeconds = minutesToSeconds(2) +  2;
  expect(testSeconds(oneHourTwoSeconds,"seconds")).toBe("time_left 00:02:02");
  expect(testSeconds(oneHourTwoSeconds,"minutes")).toBe("time_left 2 minutes"); 
})

it("00:01:02 should be 1 minute", () => {
  const oneHourTwoSeconds = minutesToSeconds(1) +  2;
  expect(testSeconds(oneHourTwoSeconds,"seconds")).toBe("time_left 00:01:02");
  expect(testSeconds(oneHourTwoSeconds,"minutes")).toBe("time_left 1 minute"); 
})

it("00:00:59 should be imminent", () => {
  const oneHourTwoSeconds = 59;
  expect(testSeconds(oneHourTwoSeconds,"seconds")).toBe("time_left 00:00:59");
  expect(testSeconds(oneHourTwoSeconds,"minutes")).toBe("time_leftimminent"); 
})


// Over
it("countdown is over when sale finish", () => {
  expect(testSeconds(0,"seconds")).toBe("countdown_over");
  expect(testSeconds(0,"minutes")).toBe("countdown_over");
});




