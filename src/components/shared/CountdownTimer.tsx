"use client";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire: () => void;
}

const CountdownTimer = ({ initialSeconds, onExpire }: CountdownTimerProps) => {
  // 10mins = 600 seconds
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    setTimeLeft(initialSeconds); // state update as backend time
  }, [initialSeconds]); // if initialSeconds is changed thentimer will updated

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  // time format (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div
        className={`text-3xl font-mono font-bold py-2 px-4 rounded-lg shadow-inner ${
          timeLeft < 60
            ? "bg-red-100 text-red-600 animate-pulse"
            : "bg-teal-50 text-teal-600"
        }`}
      >
        {formatTime(timeLeft)}
      </div>
      <p className="text-xs mt-2 text-gray-500 uppercase tracking-widest">
        Link Expires Soon
      </p>

      {timeLeft === 0 && (
        <p className="text-red-500 font-bold mt-2 text-sm">
          Token expired! Please request a new link.
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
