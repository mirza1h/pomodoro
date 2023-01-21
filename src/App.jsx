import { useState, useEffect } from "react";
import "./App.css";
import nextIcon from "./assets/next-white3.png";
import alarmSound from "./assets/alarm-kitchen.mp3";

const POMODORO = {
  key: "pomodoro",
  time: 25 * 60,
  defaultColor: "#BA4949",
};
const SHORT_BREAK = {
  key: "short-break",
  time: 5 * 60,
  defaultColor: "#38858A",
};
const LONG_BREAK = {
  key: "long-break",
  time: 15 * 60,
  defaultColor: "#397097",
};

function App() {
  const [activeOption, setActiveOption] = useState(POMODORO);

  const onNextTab = () => {
    if (activeOption.key === "pomodoro") {
      setActiveOption(SHORT_BREAK);
    }
    if (
      activeOption.key === "short-break" ||
      activeOption.key === "long-break"
    ) {
      setActiveOption(POMODORO);
    }
  };

  return (
    <div
      className="App"
      style={{ backgroundColor: `${activeOption.defaultColor}` }}
    >
      <div className="wrapper">
        <div className="main-block">
          <div className="options">
            <button
              className={activeOption.key === "pomodoro" ? "active" : ""}
              onClick={() => setActiveOption(POMODORO)}
            >
              Pomodoro
            </button>
            <button
              className={activeOption.key === "short-break" ? "active" : ""}
              onClick={() => setActiveOption(SHORT_BREAK)}
            >
              Short Break
            </button>
            <button
              className={activeOption.key === "long-break" ? "active" : ""}
              onClick={() => setActiveOption(LONG_BREAK)}
            >
              Long Break
            </button>
          </div>
          <Timer defaultTime={activeOption.time} switchToNextTab={onNextTab} />
        </div>
      </div>
    </div>
  );
}

const Timer = ({ defaultTime, switchToNextTab }) => {
  const [timeRunning, setTimeRunning] = useState(false);
  const [intervalID, setIntervalID] = useState();
  const defaultProgressBarWidth = 300;
  const [progressBarWidth, setProgressBarWidth] = useState(
    defaultProgressBarWidth
  );
  const [time, setTime] = useState(defaultTime);

  const buildTimeString = (time) => {
    return (
      Math.floor(time / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      (time % 60).toString().padStart(2, "0")
    );
  };

  const playSound = () => {
    return new Audio(alarmSound).play();
  };

  const onTimeButtonClicked = () => {
    setTimeRunning(!timeRunning);
  };

  const resetTimer = () => {
    setProgressBarWidth(defaultProgressBarWidth);
    setTime(defaultTime);
    clearInterval(intervalID);
    setTimeRunning(false);
  };

  useEffect(() => {
    resetTimer();
  }, [defaultTime]);

  useEffect(() => {
    if (!timeRunning) {
      clearInterval(intervalID);
    } else {
      const myIntervalID = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      setIntervalID(myIntervalID);
    }
    return () => clearInterval(intervalID);
  }, [timeRunning]);

  useEffect(() => {
    document.title = "Time left: " + buildTimeString(time);
    setProgressBarWidth((prev) => prev - defaultProgressBarWidth / defaultTime);
    if (time === 0) {
      playSound();
      resetTimer();
      switchToNextTab();
    }
  }, [time]);

  return (
    <>
      <div className="time">{buildTimeString(time)}</div>
      <div>
        <div className="progress-bar" style={{ width: progressBarWidth }}></div>
      </div>
      <div className="controls">
        <button onClick={onTimeButtonClicked} className="start-pause">
          {timeRunning ? "PAUSE" : "START"}
        </button>
        {timeRunning && (
          <button className="next" onClick={switchToNextTab}>
            <img src={nextIcon}></img>
          </button>
        )}
      </div>
    </>
  );
};

export default App;
