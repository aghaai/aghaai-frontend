import { cn } from "@/lib/utils";
import React from "react";

const PercentageChart = (props: {
  score: number;
  radius?: number;
  stroke?: number;
  className?: string;
  isScoreShow?: boolean;
  scoreLabelClassName?: string;
}) => {
  const radius = props.radius || 80;
  const stroke = props.stroke || 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (props.score / 100) * circumference;
  return (
    <div
      className={cn(
        props.isScoreShow && "relative w-full flex justify-center items-center",
        props.className
      )}
    >
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="stroke-secondary"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="stroke-primary"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {props.isScoreShow && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-xl font-semibold",
            props.scoreLabelClassName
          )}
        >
          {props.score}%
        </div>
      )}
    </div>
  );
};

export default PercentageChart;
