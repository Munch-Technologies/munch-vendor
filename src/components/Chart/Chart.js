import React from "react";
import { ResponsiveContainer } from "recharts";
import { Card } from "../index";

const Chart = ({ children, width, height, title, className }) => {
  return (
    <Card className={`chart ${className}`}>
      <div className="chart__title">{title}</div>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
