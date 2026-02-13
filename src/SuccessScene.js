// src/SuccessScene.js
import { useEffect, useMemo, useRef, useState } from "react";

/* helpers */
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function pad2(n) {
  return String(n).padStart(2, "0");
}

const DEFAULT_MESSAGE = [
  "Хулакаа минь 💗",
  "Чамтайгаа хамт байхад бүх юм илүү гоё.",
  "Одоо бүр албан ёсоор миний Валентин боллоо 😌",
];

function diffSince(startMs) {
  const now = Date.now();
  let d = Math.max(0, now - startMs);

  const days = Math.floor(d / (24 * 3600 * 1000));
  d -= days * 24 * 3600 * 1000;

  const hours = Math.floor(d / (3600 * 1000));
  d -= hours * 3600 * 1000;

  const mins = Math.floor(d / (60 * 1000));
  d -= mins * 60 * 1000;

  const secs = Math.floor(d / 1000);

  return { days, hours, mins, secs };
}

export default function SuccessScene({ startDateISO, messageLines = DEFAULT_MESSAGE }) {
  const START_DATE = useMemo(() => {
    const ms = Date.parse(startDateISO);
    return Number.isFinite(ms) ? ms : Date.now();
  }, [startDateISO]);

  const [t, setT] = useState(() => diffSince(START_DATE));

  useEffect(() => {
    const id = setInterval(() => setT(diffSince(START_DATE)), 250);
    return () => clearInterval(id);
  }, [START_DATE]);

  return (
    <div className="successWrap">
      <div className="successCard">
        <div className="successHeader">
          <div className="successTitle">YAYYYY 💖</div>
          <div className="successSub">Одоо бол бүр нэг л сонголттой 😌</div>
        </div>

        <div className="successBody">
          <div className="canvasBox">
            <HeartTreeCanvas />
          </div>

          <div className="rightCol">
            {/* ✅ text speed + pause */}
            <Typewriter lines={messageLines} speed={70} linePause={1000} />

            <div className="timerBox">
              {/* ✅ romantic sentence */}
              <div className="timerLabel">
  Чамтайгаа хамт{" "}
  <span className="timerBig">
    {t.days} өдөр {pad2(t.hours)} цаг {pad2(t.mins)} мин {pad2(t.secs)} сек
  </span>{" "}
  хугацааг өнгөрөөжээ 💗
</div>




            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Typewriter -------------------- */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function Typewriter({ lines, speed = 70, linePause = 1000 }) {
  const [text, setText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let alive = true;

    async function run() {
      while (alive) {
        const current = lines[lineIdx] ?? "";
        if (charIdx < current.length) {
          await sleep(speed);
          if (!alive) return;
          setText(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          await sleep(linePause);
          if (!alive) return;
          setLineIdx((i) => (i + 1) % lines.length);
          setCharIdx(0);
          setText("");
        }
      }
    }

    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIdx, charIdx]);

  return (
    <div className="typeBox">
      <div className="typeLine">
        {text}
        <span className="caret" />
      </div>
    </div>
  );
}

/* -------------------- Canvas Heart Tree -------------------- */

function HeartTreeCanvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    let raf = 0;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const W = () => wrap.getBoundingClientRect().width;
    const H = () => wrap.getBoundingClientRect().height;

    let startTime = performance.now();
    let last = performance.now();
    let phase = 0; // 0 seed, 1 grow, 2 bloom

    let seedY = -20;
    let seedX = 0;

    const floatHearts = [];
    const blossoms = [];

    function reset() {
      phase = 0;
      startTime = performance.now();
      last = performance.now();
      seedY = -20;
      seedX = W() * 0.5;
      floatHearts.length = 0;
      blossoms.length = 0;
    }
    reset();

    function addFloatHeart(x, y, s, vx, vy, life) {
      floatHearts.push({
        x,
        y,
        s,
        vx,
        vy,
        a: 1,
        life,
        born: performance.now(),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.02,
      });
    }

    function drawHeart(x, y, size, fill, alpha = 1, rot = 0) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const s = size;
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(s * 0.9, -s * 0.2, s * 0.9, s * 0.95, 0, s * 1.2);
      ctx.bezierCurveTo(-s * 0.9, s * 0.95, -s * 0.9, -s * 0.2, 0, s * 0.35);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    }

    function randomPointInHeart() {
      for (let i = 0; i < 100; i++) {
        let x = (Math.random() * 2 - 1) * 1.15;
        let y = (Math.random() * 2 - 1) * 1.25;

        const a = x * x + y * y - 1;
        const inside = a * a * a - x * x * y * y * y <= 0;

        if (inside) {
          y = y * 0.90 - 0.12;
          x = x * (1 + Math.max(0, -y) * 0.20);
          return { x, y };
        }
      }
      return { x: 0, y: 0 };
    }

    function spawnBlossoms(baseX, baseY, trunkH, count) {
      const cx = baseX;
      const cy = baseY - trunkH * 0.80;
      const sx = trunkH * 0.74;
      const sy = trunkH * 0.66;

      const bottomCut = 0.90;

      for (let i = 0; i < count; i++) {
        let p = randomPointInHeart();

        if (p.y > bottomCut) {
          i--;
          continue;
        }

        const bias = 0.55 + Math.random() * 0.45;
        p = { x: p.x * bias, y: p.y * bias };

        blossoms.push({
          x: cx + p.x * sx,
          y: cy + p.y * sy,
          pop: performance.now() + Math.random() * 240,
          s: 0,
          jitter: 1 + Math.random() * 1.6,
        });
      }
    }

    function drawTaperTrunk(baseX, baseY, topY) {
      const h = baseY - topY;
      const w0 = 18;
      const w1 = 7;
      const midY = baseY - h * 0.55;

      ctx.save();
      ctx.globalAlpha = 0.92;

      ctx.beginPath();
      ctx.moveTo(baseX - w0, baseY);
      ctx.quadraticCurveTo(baseX - w0 * 0.9, midY, baseX - w1, topY);
      ctx.lineTo(baseX + w1, topY);
      ctx.quadraticCurveTo(baseX + w0 * 0.9, midY, baseX + w0, baseY);
      ctx.closePath();
      ctx.fillStyle = "rgba(70,25,35,0.92)";
      ctx.fill();

      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.moveTo(baseX - w0 * 0.25, baseY);
      ctx.quadraticCurveTo(baseX - 1, midY, baseX - w1 * 0.2, topY);
      ctx.lineTo(baseX + w1 * 0.15, topY);
      ctx.quadraticCurveTo(baseX + 2, midY, baseX + w0 * 0.05, baseY);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fill();

      ctx.restore();
    }

    function drawBranches(baseX, baseY, topY, prog) {
      const trunkH = baseY - topY;
      const bP = clamp((prog - 0.25) / 0.75, 0, 1);
      if (bP <= 0) return;

      const y1 = baseY - trunkH * 0.55;
      const y2 = baseY - trunkH * 0.42;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(70,25,35,0.92)";

      ctx.lineWidth = 8 - 3 * bP;
      ctx.beginPath();
      ctx.moveTo(baseX + 2, y1);
      ctx.quadraticCurveTo(baseX + 50 * bP, y1 - 30 * bP, baseX + 95 * bP, y1 - 58 * bP);
      ctx.stroke();

      ctx.lineWidth = 8 - 3 * bP;
      ctx.beginPath();
      ctx.moveTo(baseX - 2, y2);
      ctx.quadraticCurveTo(baseX - 55 * bP, y2 - 18 * bP, baseX - 100 * bP, y2 - 55 * bP);
      ctx.stroke();

      ctx.restore();
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min(34, now - last);
      last = now;

      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "rgba(123,22,56,0.35)";
      ctx.fillRect(14, h - 34, w - 28, 2);
      ctx.globalAlpha = 1;

      const elapsed = now - startTime;
      if (elapsed > 1600 && phase === 0) phase = 1;
      if (elapsed > 3600 && phase === 1) phase = 2;

      const groundY = h - 36;
      const baseX = w * 0.5;
      const baseY = groundY;

      if (phase === 0) {
        seedY += dt * 0.24;
        if (seedY > groundY) seedY = groundY;

        drawHeart(seedX, seedY, 8, "rgba(255,74,156,0.95)", 1);

        if (Math.random() < 0.14) {
          addFloatHeart(
            seedX + (Math.random() - 0.5) * 18,
            seedY - 6,
            4,
            (Math.random() - 0.5) * 0.18,
            -0.45 - Math.random() * 0.35,
            820
          );
        }
      }

      const trunkP =
        phase === 0 ? 0 : phase === 1 ? clamp((elapsed - 1600) / 2000, 0, 1) : 1;

      const trunkH = h * 0.62;
      const topY = baseY - trunkH * trunkP;

      if (trunkP > 0) {
        drawTaperTrunk(baseX, baseY, topY);
        drawBranches(baseX, baseY, topY, trunkP);
      }

      if (phase === 2 && blossoms.length === 0) {
        spawnBlossoms(baseX, baseY, trunkH, 340);
      }

      if (phase === 2) {
        for (const b of blossoms) {
          const age = now - b.pop;
          if (age < 0) continue;

          b.s = Math.min(1, age / 520);
          const size = 5 + b.s * 7;

          const jitterX = (Math.random() - 0.5) * b.jitter;
          const jitterY = (Math.random() - 0.5) * b.jitter;

          const palette = ["#ff4a9c", "#ff79b6", "#ff2e86", "#ff9acb"];
          drawHeart(b.x + jitterX, b.y + jitterY, size, palette[(Math.random() * palette.length) | 0], 0.95);

          // ✅ falling hearts: slower + fewer
          if (Math.random() < 0.012) {
            addFloatHeart(
              b.x,
              b.y,
              3 + Math.random() * 4,
              (Math.random() - 0.5) * 0.14,
              0.03 + Math.random() * 0.14,
              2300 + Math.random() * 1600
            );
          }
        }
      }

      for (let i = floatHearts.length - 1; i >= 0; i--) {
        const p = floatHearts[i];
        const age = now - p.born;
        const k = age / p.life;
        if (k >= 1) {
          floatHearts.splice(i, 1);
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // ✅ gravity slower
        p.vy += 0.00020 * dt;

        p.rot += p.vr * dt;
        p.a = 1 - k;

        drawHeart(
          p.x,
          p.y,
          p.s * (1 + 0.15 * Math.sin(age / 120)),
          "rgba(255,74,156,0.92)",
          p.a,
          p.rot
        );
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    function onClick() {
      reset();
    }
    wrap.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="heartTreeWrap" ref={wrapRef}>
      <canvas ref={canvasRef} />
      <div className="canvasHint">tap ❤️</div>
    </div>
  );
}
