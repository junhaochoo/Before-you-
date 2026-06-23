"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { sgd } from "@/lib/format";

/**
 * The signature visual (06-analytical-component.md): two compounding curves —
 * fee-free gross vs net-of-fee — diverging over time. The gap IS the fee drag.
 */
export function GrossNetChart({
  grossCurve,
  netCurve,
}: {
  grossCurve: number[];
  netCurve: number[];
}) {
  // Recharts' ResponsiveContainer needs real layout dimensions; render only after
  // mount so it never runs during static prerender (avoids the SSR sizing warning).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = grossCurve.map((g, i) => ({
    year: i + 1,
    Gross: Math.round(g),
    Net: Math.round(netCurve[i]),
  }));

  if (!mounted) {
    return <div style={{ width: "100%", height: 280 }} aria-hidden />;
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -2,
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            width={64}
            tickFormatter={(v) => "S$" + (v / 1000).toFixed(0) + "k"}
          />
          <Tooltip
            formatter={(value) => sgd(Number(value))}
            labelFormatter={(l) => `Year ${l}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Gross"
            stroke="#0f8a5f"
            strokeWidth={2}
            dot={false}
            name="Fee-free (gross)"
          />
          <Line
            type="monotone"
            dataKey="Net"
            stroke="#b7791f"
            strokeWidth={2}
            dot={false}
            name="What you keep (net of fees)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
