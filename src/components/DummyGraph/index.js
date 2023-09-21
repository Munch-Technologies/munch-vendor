import React from "react";
import { Area, AreaChart } from "recharts";

export default function DummyGraph({ percentage, variant, ...props }) {
  if (!variant) variant = Math.round(Math.random() * 2);

  if (percentage < 0) {
    // red (negative dummy graph)

    return (
      <AreaChart
        width={100}
        height={100}
        {...props}
        data={[
          {
            amt: 21,
          },
          {
            amt: 23,
          },
          {
            amt: 20,
          },
          {
            amt: 17,
          },
          {
            amt: 19,
          },
          {
            amt: 15,
          },
          {
            amt: 10,
          },
        ]}
        margin={{
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#12B76A" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F04438" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F04438" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="amt"
          stroke={"#F04438"}
          fillOpacity={1}
          fill="url(#red)"
        />
      </AreaChart>
    );
  }

  if (variant === "2") {
    // Green (second variant)

    return (
      <AreaChart
        width={100}
        height={100}
        data={[
          {
            amt: 11,
          },
          {
            amt: 8,
          },
          {
            amt: 12,
          },
          {
            amt: 10,
          },
          {
            amt: 8,
          },
          {
            amt: 24,
          },
          {
            amt: 19,
          },
        ]}
        margin={{
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#12B76A" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F04438" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F04438" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="amt"
          stroke="#12B76A"
          fillOpacity={1}
          fill="url(#green)"
        />
      </AreaChart>
    );
  }
  return (
    <AreaChart
      width={100}
      height={100}
      data={[
        {
          amt: 11,
        },
        {
          amt: 8,
        },
        {
          amt: 18,
        },
        {
          amt: 10,
        },
        {
          amt: 14,
        },
        {
          amt: 12,
        },
        {
          amt: 24,
        },
      ]}
      margin={{
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <defs>
        <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="20%" stopColor="#12B76A" stopOpacity={0.1} />
          <stop offset="80%" stopColor="#12B76A" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F04438" stopOpacity={0.1} />
          <stop offset="95%" stopColor="#F04438" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="amt"
        stroke="#12B76A"
        fillOpacity={1}
        fill="url(#green)"
      />
    </AreaChart>
  );
}
