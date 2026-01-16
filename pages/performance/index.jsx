"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/**
 * GitHubActivity (JS)
 * - Nodes no longer disappear on click (declarative variants used)
 * - Path draw animation kept via useAnimation()
 * - Tooltip placement fixed (container-relative, not clipped)
 * - Grids, area, shadow, node interactions preserved
 *
 * Usage: set NEXT_PUBLIC_GITHUB_TOKEN in env for GraphQL access.
 */

const GITHUB_USERNAME = "sankha1545";

const FILTERS = {
  DAILY: "daily",
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

const DAILY_RANGES = [30, 60, 90];

export default function GitHubActivity() {
  // data + UI state
  const [rawDays, setRawDays] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [filter, setFilter] = useState(FILTERS.DAILY);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // hover/select
  // hovered will store chart-space coordinates relative to container (left/top)
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  // refs
  const svgRef = useRef(null);
  const containerRef = useRef(null); // parent that will be position:relative and hold tooltip

  // path animation control
  const pathControls = useAnimation();

  /* ------------------ Data fetch ------------------ */
  useEffect(() => {
    let mounted = true;
    const fetchContributions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (!token) {
          throw new Error(
            "Missing NEXT_PUBLIC_GITHUB_TOKEN: set it in .env for GraphQL access."
          );
        }

        const query = `
          query {
            user(login: "${GITHUB_USERNAME}") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `;

        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const json = await res.json();
        if (json?.message) throw new Error(json.message);

        const weeks =
          json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
        const days = weeks.flatMap((w) => w.contributionDays || []);

        if (mounted) {
          setRawDays(days);
          setTotalContributions(
            json?.data?.user?.contributionsCollection?.contributionCalendar
              ?.totalContributions || 0
          );
        }
      } catch (err) {
        console.error("Failed to fetch GitHub data", err);
        if (mounted) setError(err?.message || "Failed to fetch GitHub data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContributions();
    return () => {
      mounted = false;
    };
  }, []);

  /* ----------------- Date helpers ----------------- */
  const parseDate = useCallback((iso) => new Date(iso + "T00:00:00Z"), []);
  const formatMonthLabel = useCallback((iso) => {
    const d = parseDate(iso);
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  }, [parseDate]);
  const formatDayLabel = useCallback((iso) => {
    const d = parseDate(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, [parseDate]);

  /* ----------------- Groupings ----------------- */
  const groupedMonthly = useMemo(() => {
    const map = {};
    rawDays.forEach((d) => {
      const key = d.date.slice(0, 7);
      map[key] = (map[key] || 0) + d.contributionCount;
    });
    return Object.keys(map)
      .sort()
      .map((k) => ({ date: k + "-01", contributionCount: map[k] }));
  }, [rawDays]);

  const groupedYearly = useMemo(() => {
    const map = {};
    rawDays.forEach((d) => {
      const key = d.date.slice(0, 4);
      map[key] = (map[key] || 0) + d.contributionCount;
    });
    return Object.keys(map)
      .sort()
      .map((k) => ({ date: k + "-01-01", contributionCount: map[k] }));
  }, [rawDays]);

  const dailySorted = useMemo(() => {
    return [...rawDays]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d) => ({ date: d.date, contributionCount: d.contributionCount }));
  }, [rawDays]);

  const filteredData = useMemo(() => {
    if (filter === FILTERS.DAILY) return dailySorted.slice(-range);
    if (filter === FILTERS.MONTHLY) return groupedMonthly;
    if (filter === FILTERS.YEARLY) return groupedYearly;
    return [];
  }, [dailySorted, groupedMonthly, groupedYearly, filter, range]);

  const maxValue = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return 1;
    return Math.max(...filteredData.map((d) => d.contributionCount), 1);
  }, [filteredData]);

  /* ----------------- SVG layout ----------------- */
  const SVG_WIDTH = Math.max(480, filteredData.length * 26);
  const SVG_HEIGHT = 300;
  const PADDING = { left: 56, right: 28, top: 30, bottom: 68 };
  const innerW = SVG_WIDTH - PADDING.left - PADDING.right;
  const innerH = SVG_HEIGHT - PADDING.top - PADDING.bottom;

  const points = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    return filteredData.map((d, i) => {
      const x = PADDING.left + (i / Math.max(filteredData.length - 1, 1)) * innerW;
      const y = PADDING.top + (1 - d.contributionCount / maxValue) * innerH;
      return { x, y, ...d };
    });
  }, [filteredData, innerW, innerH, maxValue]);

  const pathD = useMemo(() => {
    if (!points || points.length === 0) return "";
    return points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
  }, [points]);

  /* ----------------- Grid math ----------------- */
  const horizontalTicks = 5;
  const verticalTicks = Math.min(12, Math.max(4, Math.floor(points.length / 6) + 4));

  const horizontalGrid = useMemo(() => {
    return new Array(horizontalTicks).fill(0).map((_, i) => {
      const y = PADDING.top + (i / (horizontalTicks - 1)) * innerH;
      const value = Math.round((1 - i / (horizontalTicks - 1)) * maxValue);
      return { y, value };
    });
  }, [horizontalTicks, innerH, PADDING.top, maxValue]);

  const verticalGrid = useMemo(() => {
    return new Array(verticalTicks).fill(0).map((_, i) => {
      const x = PADDING.left + (i / (verticalTicks - 1)) * innerW;
      const idx = Math.round((i / (verticalTicks - 1)) * (points.length - 1));
      const label = points[idx] ? points[idx].date : "";
      return { x, label, idx };
    });
  }, [verticalTicks, innerW, PADDING.left, points]);

  /* ----------------- Tooltip positioning (container-relative) ----------------- */
  const computeTooltipPosition = (p) => {
    // returns coords relative to containerRef (not screen)
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return { left: 0, top: 0, containerWidth: window.innerWidth, containerHeight: window.innerHeight };

    const svgRect = svg.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const scaleX = svgRect.width / SVG_WIDTH;
    const scaleY = svgRect.height / SVG_HEIGHT;

    // p.x, p.y are SVG coordinate values; convert to pixels then to container-relative coordinates
    const px = svgRect.left + p.x * scaleX;
    const py = svgRect.top + p.y * scaleY;

    const left = px - containerRect.left; // relative to container
    const top = py - containerRect.top; // relative to container

    return { left, top, containerWidth: containerRect.width, containerHeight: containerRect.height };
  };

  const handleHover = (e, p) => {
    const { left, top, containerWidth } = computeTooltipPosition(p);
    // clamp horizontally so tooltip stays inside container (we assume tooltip <= 220px)
    const tooltipWidth = 220;
    const clampedLeft = Math.max(8, Math.min(left - tooltipWidth / 2, containerWidth - tooltipWidth - 8));
    // show tooltip slightly above the node
    setHovered({ ...p, left: clampedLeft, top: Math.max(8, top - 56) });
  };
  const handleLeave = () => setHovered(null);

  const handleClick = (p) => {
    // clicking selects the point and keeps it visible (no hide)
    setSelected(p);
    const { left, top, containerWidth } = computeTooltipPosition(p);
    const tooltipWidth = 220;
    const clampedLeft = Math.max(8, Math.min(left - tooltipWidth / 2, containerWidth - tooltipWidth - 8));
    setHovered({ ...p, left: clampedLeft, top: Math.max(8, top - 56) });
  };

  /* ----------------- Path + load animation ----------------- */
  useEffect(() => {
    const run = async () => {
      await pathControls.start({ pathLength: 0, transition: { duration: 0 } });
      await pathControls.start({ pathLength: 1, transition: { duration: 1.05, ease: "easeInOut" } });
    };

    if (points.length > 0) run();
  }, [points.length, filter, range, pathControls]);

  /* ----------------- Node variants (declarative, stable) ----------------- */
  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.05 + i * 0.02, duration: 0.45, type: "spring", stiffness: 420, damping: 22 },
    }),
  };

  const safeTotal = typeof totalContributions === "number" ? totalContributions : 0;

  return (
    <section className="relative py-16 text-white">
      <div className="container px-6 mx-auto xl:px-0">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-3xl font-bold text-center">
          GitHub <span className="text-accent">Contribution Activity</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-sm text-center text-white/70">
          Total Contributions across the fetched range: <span className="font-semibold text-accent">{safeTotal}</span>
        </motion.p>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {Object.values(FILTERS).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setSelected(null);
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${
                  filter === f ? "bg-accent text-black" : "border-white/20 text-white/70 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {filter === FILTERS.DAILY && (
              <div className="flex items-center gap-2">
                {DAILY_RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRange(r);
                      setSelected(null);
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition-all border ${
                      range === r ? "bg-white text-black" : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    Last {r} days
                  </button>
                ))}
              </div>
            )}

            <div className="text-right">
              <div className="text-xs text-white/70">Total</div>
              <div className="font-mono text-lg font-semibold">{safeTotal}</div>
            </div>
          </div>
        </div>

        {/* Chart wrapper (containerRef) - NOTE: container is relative so tooltip won't be clipped */}
        <div ref={containerRef} className="relative" style={{ perspective: 1000 }}>
          {/* motion.div kept for other internal animations; container tilt removed */}
          <motion.div transition={{ type: "spring", stiffness: 70, damping: 16 }} className="relative p-6 border bg-white/5 rounded-2xl border-white/10 backdrop-blur">
            {loading ? (
              <div className="flex items-center justify-center py-24">Loading...</div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-center text-red-300">
                <div>Error: {error}</div>
                <div>If you want to run this locally, set <code>NEXT_PUBLIC_GITHUB_TOKEN</code> in your .env</div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex items-center justify-center py-24">No data available</div>
            ) : (
              <>
                {/* svg wrapper may scroll horizontally (kept), but tooltip is outside this wrapper so it's not clipped */}
                <div className="overflow-auto">
                  <svg ref={svgRef} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height={SVG_HEIGHT} className="block">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" x2="1">
                        <stop offset="0%" stopColor="#ff7b7b" />
                        <stop offset="100%" stopColor="#ffd08a" />
                      </linearGradient>

                      <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ff7b7b" stopOpacity="0.16" />
                        <stop offset="100%" stopColor="#ffd08a" stopOpacity="0.02" />
                      </linearGradient>

                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.28" />
                      </filter>

                      <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" />
                      </filter>
                    </defs>

                    {/* Parallax faint grid */}
                    <g transform="translate(0,0)" opacity={0.12}>
                      {verticalGrid.map((v, i) => (
                        <line key={`vg-f-${i}`} x1={v.x} x2={v.x} y1={PADDING.top} y2={SVG_HEIGHT - PADDING.bottom} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                      ))}
                      {horizontalGrid.map((g, i) => (
                        <line key={`hg-f-${i}`} x1={PADDING.left} x2={SVG_WIDTH - PADDING.right} y1={g.y} y2={g.y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                      ))}
                    </g>

                    {/* Main grid */}
                    {verticalGrid.map((v, i) => (
                      <g key={`v-${i}`}>
                        <line x1={v.x} x2={v.x} y1={PADDING.top} y2={SVG_HEIGHT - PADDING.bottom} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                        <line x1={v.x} x2={v.x} y1={SVG_HEIGHT - PADDING.bottom} y2={SVG_HEIGHT - PADDING.bottom + 8} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                      </g>
                    ))}

                    {horizontalGrid.map((g, i) => (
                      <g key={`h-${i}`}>
                        <line x1={PADDING.left} x2={SVG_WIDTH - PADDING.right} y1={g.y} y2={g.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                        <text x={12} y={g.y + 4} fontSize={11} fill="rgba(255,255,255,0.6)">{g.value}</text>
                      </g>
                    ))}

                    {/* X axis labels */}
                    {points.map((p, i) => {
                      const showLabel = i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 6) === 0;
                      return (
                        <g key={`label-${i}`}>
                          {showLabel && (
                            <text x={p.x} y={SVG_HEIGHT - 14} fontSize={11} textAnchor="middle" fill="rgba(255,255,255,0.72)">
                              {filter === FILTERS.MONTHLY ? formatMonthLabel(p.date) : filter === FILTERS.YEARLY ? new Date(p.date).getFullYear() : formatDayLabel(p.date)}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Soft shadow duplicate path */}
                    <path d={pathD} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" transform="translate(0,6)" style={{ filter: "url(#softBlur)" }} opacity={0.16} />

                    {/* Animated main line */}
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth={3.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={pathControls}
                      style={{ filter: "url(#shadow)" }}
                    />

                    {/* Area under the line */}
                    <path d={`${pathD} L ${SVG_WIDTH - PADDING.right} ${SVG_HEIGHT - PADDING.bottom} L ${PADDING.left} ${SVG_HEIGHT - PADDING.bottom} Z`} fill="url(#areaGrad)" opacity={0.95} />

                    {/* Nodes (declarative animation via variants so they remain visible on click) */}
                    {points.map((p, i) => (
                      <g key={`pt-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                        <motion.circle
                          custom={i}
                          variants={nodeVariants}
                          initial="hidden"
                          animate="visible"
                          r={selected && selected.date === p.date ? 6.5 : 5}
                          fill={selected && selected.date === p.date ? "#fff" : "url(#lineGrad)"}
                          stroke={selected && selected.date === p.date ? "#ff9f4d" : "transparent"}
                          strokeWidth={selected && selected.date === p.date ? 2 : 0}
                          whileHover={{ scale: 1.45 }}
                          onMouseEnter={(e) => handleHover(e, p)}
                          onMouseLeave={handleLeave}
                          onClick={() => handleClick(p)}
                          style={{ cursor: "pointer", transformOrigin: "center center" }}
                        />
                      </g>
                    ))}

                    {/* bottom axis line */}
                    <line x1={PADDING.left} x2={SVG_WIDTH - PADDING.right} y1={SVG_HEIGHT - PADDING.bottom + 6} y2={SVG_HEIGHT - PADDING.bottom + 6} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                  </svg>
                </div>

                {/* Tooltip placed here (inside same relative parent, outside overflow-auto so it isn't clipped) */}
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-20 px-3 py-2 text-xs bg-black border rounded shadow border-white/20 backdrop-blur-sm"
                      style={{
                        left: (hovered && hovered.left) || 8,
                        top: (hovered && hovered.top) || 8,
                        minWidth: 180,
                        maxWidth: 260,
                      }}
                    >
                      <div className="text-white/80">{hovered ? formatDayLabel(hovered.date) : ""}</div>
                      <div className="font-semibold text-accent">{hovered ? hovered.contributionCount : 0} contributions</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected details */}
                <div className="px-2 mt-4">
                  {selected ? (
                    <div className="p-3 border rounded-md bg-white/4 border-white/10">
                      <div className="text-sm text-white/70">Selected</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/60">Date</div>
                          <div className="font-semibold">{formatDayLabel(selected.date)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/60">Contributions</div>
                          <div className="font-mono text-lg font-semibold text-accent">{selected.contributionCount}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/70">Click a node to see contribution details.</div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
