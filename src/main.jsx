import React, { useMemo, useRef, useState } from "react";

export default function App() {
  // base (b) and height (h)
  const [b, setB] = useState(7);
  const [h, setH] = useState(4);

  // Refs to SVG parts for animation
  const t1Ref = useRef(null);
  const t2gRef = useRef(null);
  const abRef = useRef(null); // base arrow
  const ahRef = useRef(null); // height arrow
  const lbRef = useRef(null); // label b
  const lhRef = useRef(null); // label h
  const rectRef = useRef(null);

  const PAD = 36;
  const SCALE = 44; // unit -> px

  // Derived geometry
  const geo = useMemo(() => {
    const W = b * SCALE + PAD * 2;
    const H = h * SCALE + PAD * 2;

    const p1 = [PAD, H - PAD]; // (0,0)
    const p2 = [PAD + b * SCALE, H - PAD]; // (b,0)
    const p3 = [PAD, H - PAD - h * SCALE]; // (0,h)

    // second triangle (the top-right one in the final rectangle)
    const q1 = [PAD + b * SCALE, H - PAD]; // (b,0)
    const q2 = [PAD + b * SCALE, H - PAD - h * SCALE]; // (b,h)
    const q3 = [PAD, H - PAD - h * SCALE]; // (0,h)

    return {
      viewBox: `0 0 ${Math.max(520, W)} ${Math.max(300, H)}`,
      t1: `${p1} ${p2} ${p3}`,
      t2: `${q1} ${q2} ${q3}`,
      baseGuide: { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] },
      heightGuide: { x1: p1[0], y1: p1[1], x2: p3[0], y2: p3[1] },
      baseArrow: { x1: p1[0] + 4, y1: p1[1] + 16, x2: p2[0] - 4, y2: p2[1] + 16 },
      heightArrow: { x1: p1[0] - 16, y1: p1[1] - 4, x2: p3[0] - 16, y2: p3[1] + 4 },
      labelB: { x: (p1[0] + p2[0]) / 2, y: p1[1] + 34 },
      labelH: { x: p1[0] - 24, y: (p1[1] + p3[1]) / 2 },
      rect: { x: PAD, y: H - PAD - h * SCALE, w: b * SCALE, h: h * SCALE },
      area: (b * h) / 2
    };
  }, [b, h]);

  function show(el, val = 1) {
    if (!el) return;
    el.style.opacity = val;
  }
  function hide(el) {
    if (!el) return;
    el.style.opacity = 0;
  }

  const play = () => {
    // reset visibilities
    hide(t1Ref.current);
    hide(t2gRef.current);
    hide(abRef.current);
    hide(ahRef.current);
    hide(lbRef.current);
    hide(lhRef.current);
    if (rectRef.current) rectRef.current.setAttribute("opacity", "0");

    // ① show first triangle
    if (t1Ref.current) {
      t1Ref.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        fill: "forwards"
      });
    }

    // ② show measurement arrows + labels
    setTimeout(() => {
      [abRef.current, ahRef.current, lbRef.current, lhRef.current].forEach((el) => {
        if (!el) return;
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 250,
          fill: "forwards"
        });
      });
    }, 350);

    // ③ flip the second triangle around its right edge (scaleX: -1 -> 1)
    setTimeout(() => {
      if (!t2gRef.current) return;
      t2gRef.current.animate(
        [
          { transform: "scale(-1,1)", opacity: 0 },
          { transform: "scale(1,1)", opacity: 1 }
        ],
        { duration: 600, easing: "ease-in-out", fill: "forwards" }
      );
    }, 900);

    // ④ outline rectangle
    setTimeout(() => {
      if (!rectRef.current) return;
      rectRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        fill: "forwards"
      });
    }, 1550);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>
          三角形の面積は <span style={{ whiteSpace: "nowrap" }}>b × h ÷ 2</span>
        </h3>

        <div style={styles.controls}>
          <label style={styles.label}>底辺 b&nbsp;
            <input
              type="range"
              min={2}
              max={10}
              step={0.2}
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
            />
          </label>
          <span style={styles.nums}>{b.toFixed(1)}</span>
          <span style={{ opacity: 0.6 }}>/</span>
          <label style={styles.label}>高さ h&nbsp;
            <input
              type="range"
              min={2}
              max={8}
              step={0.2}
              value={h}
              onChange={(e) => setH(parseFloat(e.target.value))}
            />
          </label>
          <span style={styles.nums}>{h.toFixed(1)}</span>
          <button style={styles.btn} onClick={() => { /* re-layout happens via state; just replay */ play(); }}>
            ▶ 再生
          </button>
          <span style={styles.nums}>A = <b>{geo.area.toFixed(2)}</b> u²</span>
        </div>

        <svg
          viewBox={geo.viewBox}
          role="img"
          aria-label="三角形の面積デモ"
          style={styles.svg}
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity=".95" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity=".95" />
            </linearGradient>
            <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity=".9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity=".9" />
            </linearGradient>
            <marker id="a1" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 10,5 0,10Z" fill="#60a5fa" />
            </marker>
            <marker id="a2" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 10,5 0,10Z" fill="#22d3ee" />
            </marker>
          </defs>

          {/* rectangle outline */}
          <rect
            ref={rectRef}
            x={geo.rect.x}
            y={geo.rect.y}
            width={geo.rect.w}
            height={geo.rect.h}
            rx={6}
            ry={6}
            opacity={0}
            fill="none"
            stroke="#ffffff55"
            strokeWidth={2}
            strokeDasharray="8 6"
          />

          {/* guides */}
          <line {...geo.baseGuide} stroke="#93a3b544" strokeWidth={2} strokeDasharray="6 6" />
          <line {...geo.heightGuide} stroke="#93a3b544" strokeWidth={2} strokeDasharray="6 6" />

          {/* measure arrows */}
          <line ref={abRef} {...geo.baseArrow} stroke="#60a5fa" strokeWidth={2.5} markerEnd="url(#a1)" opacity={0} />
          <line ref={ahRef} {...geo.heightArrow} stroke="#22d3ee" strokeWidth={2.5} markerEnd="url(#a2)" opacity={0} />

          {/* labels with halo (readable over shapes) */}
          <text
            ref={lbRef}
            x={geo.labelB.x}
            y={geo.labelB.y}
            textAnchor="middle"
            style={styles.haloText}
            opacity={0}
          >
            b
          </text>
          <text
            ref={lhRef}
            x={geo.labelH.x}
            y={geo.labelH.y}
            textAnchor="end"
            style={styles.haloText}
            opacity={0}
            dominantBaseline="middle"
          >
            h
          </text>

          {/* first triangle */}
          <polygon
            ref={t1Ref}
            points={geo.t1}
            fill="url(#g1)"
            stroke="#ffffffcc"
            strokeWidth={1.2}
            opacity={0}
          />

          {/* second triangle inside a group so we can flip around right edge */}
          <g
            ref={t2gRef}
            opacity={0}
            style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}
          >
            <polygon
              points={geo.t2}
              fill="url(#g2)"
              stroke="#ffffffaa"
              strokeWidth={1.2}
            />
          </g>
        </svg>
      </div>

      <div style={{ opacity: 0.75, fontSize: 14, marginTop: 8 }}>
        ※ 再生すると、同じ三角形を反転して長方形を作る→面積は b×h の半分になります。
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    background: "linear-gradient(120deg,#0b1020 0%, #0e1530 100%)",
    color: "#eef2ff",
    padding: 16,
    boxSizing: "border-box",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  card: {
    maxWidth: 760,
    margin: "0 auto",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
  },
  controls: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    margin: "8px 0 12px"
  },
  label: { display: "flex", alignItems: "center", gap: 6 },
  btn: {
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700
  },
  svg: {
    width: "100%",
    height: "auto",
    display: "block",
    background:
      "radial-gradient(800px 260px at 50% -120px, rgba(255,255,255,0.12), transparent 60%)",
    borderRadius: 12
  },
  nums: { opacity: 0.9, fontVariantNumeric: "tabular-nums" },
  haloText: {
    fill: "#fff",
    paintOrder: "stroke",
    stroke: "#0b1020",
    strokeWidth: 4
  }
};
