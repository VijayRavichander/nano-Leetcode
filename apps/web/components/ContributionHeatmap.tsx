"use client";

import { useMemo, useState, useCallback } from "react";

interface Submission {
  createdAt: string;
}

interface ContributionHeatmapProps {
  submissions: Submission[];
}

const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getLevel(count: number, max: number): number {
  if (count === 0) return 0;
  if (max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContributionHeatmap({
  submissions,
}: ContributionHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const { grid, monthLabels, maxCount, totalCount } =
    useMemo(() => {
      const countMap: Record<string, number> = {};
      for (const s of submissions) {
        const key = toDateKey(new Date(s.createdAt));
        countMap[key] = (countMap[key] || 0) + 1;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDay = today.getDay();

      const endDate = new Date(today);
      const totalDays = WEEKS * DAYS_PER_WEEK + todayDay + 1;
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - totalDays + 1);

      const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
      let currentWeek: { date: string; count: number; dayOfWeek: number }[] =
        [];
      const labels: { label: string; col: number }[] = [];
      let lastMonth = -1;

      const cursor = new Date(startDate);
      for (let i = 0; i < totalDays; i++) {
        const key = toDateKey(cursor);
        const dayOfWeek = cursor.getDay();
        const month = cursor.getMonth();

        if (dayOfWeek === 0 && currentWeek.length > 0) {
          weeks.push(currentWeek);
          currentWeek = [];
        }

        if (month !== lastMonth) {
          labels.push({ label: MONTH_NAMES[month]!, col: weeks.length });
          lastMonth = month;
        }

        currentWeek.push({
          date: key,
          count: countMap[key] || 0,
          dayOfWeek,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      let mx = 0;
      let total = 0;
      for (const v of Object.values(countMap)) {
        if (v > mx) mx = v;
        total += v;
      }

      return {
        grid: weeks,
        monthLabels: labels,
        maxCount: mx,
        totalCount: total,
      };
    }, [submissions]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, dateStr: string, count: number) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const container = (
        e.target as HTMLElement
      ).closest<HTMLElement>("[data-heatmap]");
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      setTooltip({
        text: `${count} submission${count !== 1 ? "s" : ""} on ${formatDate(dateStr)}`,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const cellColor = (level: number) => {
    switch (level) {
      case 1:
        return "var(--heatmap-l1)";
      case 2:
        return "var(--heatmap-l2)";
      case 3:
        return "var(--heatmap-l3)";
      case 4:
        return "var(--heatmap-l4)";
      default:
        return "var(--heatmap-empty)";
    }
  };

  return (
    <div className="relative" data-heatmap>
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1" style={{ minWidth: 720 }}>
          {/* Month labels */}
          <div className="flex" style={{ paddingLeft: 36 }}>
            {monthLabels.map((m, i) => {
              const nextCol = monthLabels[i + 1]?.col ?? grid.length;
              const span = nextCol - m.col;
              return (
                <span
                  key={`${m.label}-${m.col}`}
                  className="text-[var(--app-muted)]"
                  style={{
                    width: span * 13,
                    fontSize: 11,
                    lineHeight: "16px",
                    flexShrink: 0,
                  }}
                >
                  {span >= 2 ? m.label : ""}
                </span>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0">
            {/* Day labels */}
            <div
              className="flex flex-col justify-between"
              style={{ width: 32, paddingTop: 0, paddingBottom: 0 }}
            >
              {DAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="text-[var(--app-muted)]"
                  style={{
                    fontSize: 10,
                    lineHeight: "11px",
                    height: 11,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px]">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {Array.from({ length: DAYS_PER_WEEK }).map((_, di) => {
                    const cell = week.find((c) => c.dayOfWeek === di);
                    if (!cell) {
                      return (
                        <div
                          key={di}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                          }}
                        />
                      );
                    }
                    const level = getLevel(cell.count, maxCount);
                    return (
                      <div
                        key={di}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          backgroundColor: cellColor(level),
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, cell.date, cell.count)
                        }
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            className="flex items-center justify-between"
            style={{ paddingLeft: 36, marginTop: 4 }}
          >
            <span
              className="text-[var(--app-muted)]"
              style={{ fontSize: 11 }}
            >
              {totalCount} submission{totalCount !== 1 ? "s" : ""} in the last
              year
            </span>
            <div className="flex items-center gap-1">
              <span
                className="text-[var(--app-muted)]"
                style={{ fontSize: 11, marginRight: 4 }}
              >
                Less
              </span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: cellColor(level),
                  }}
                />
              ))}
              <span
                className="text-[var(--app-muted)]"
                style={{ fontSize: 11, marginLeft: 4 }}
              >
                More
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            style={{
              background: "var(--app-text)",
              color: "var(--app-bg)",
              fontSize: 11,
              lineHeight: "16px",
              padding: "4px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {tooltip.text}
          </div>
        </div>
      )}
    </div>
  );
}
