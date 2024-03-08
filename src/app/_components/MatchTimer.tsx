import { useEffect, useState } from "react";

interface MatchTimerTypes {
  d2: Date;
  d1: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MatchTimer({ d2, d1 }: MatchTimerTypes) {
  const [days, setDays] = useState<string | number>(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const t1 = new Date(d1).valueOf(); // end
  const t2 = new Date().valueOf();

  function formatTime(time: number) {
    return time < 10 ? `0${time}` : time;
  }

  useEffect(() => {
    const totalSeconds = (t1 - t2) / 1000;
    const i = setInterval(() => {
      setDays(formatTime(Math.floor(totalSeconds / 3600 / 24)));
      setHours(Math.floor(totalSeconds / 3600) % 24);
      setMinutes(Math.floor(totalSeconds / 60) % 60);
      setSeconds(Math.floor(totalSeconds % 60));
    }, 1000);

    return () => clearInterval(i);
  }, [t1, t2]);
  return (
    <>
      {d2.valueOf() <= d1.valueOf() ? (
        <span className="text-xl sm:text-2xl">
          {(days as number) > 0 && days + "D"} {hours > 0 && hours + "H"}{" "}
          {minutes > 0 && minutes + "M"} {seconds > 0 && seconds + "S"}
        </span>
      ) : (
        <span className="text-xl sm:text-2xl">Match Started</span>
      )}
    </>
  );
}
