import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const NO_LINES = [
  "ҮГҮЙ, БАЯРЛАЛАА",
  "АЙН, СОНГОЛТОО ЗӨВ ХИЙСЭН БИЗ ДЭЭ",
  "ДАХИАД САЙН БОД ДОО",
  "НЭГ Л ЮМ БУРУУ БОЛООД БАЙНА ШДЭЭ",
  "NO ТОВЧИЙГ ЧИНЬ АВЛАА ШҮҮ",
  "СҮҮЛЧИЙН БОЛОМЖ ШҮҮ",
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function App() {
  const [accepted, setAccepted] = useState(false);

  const [yesFill, setYesFill] = useState(0);
  const [yesGlow, setYesGlow] = useState(false);

  const [noCount, setNoCount] = useState(0);
  const [noText, setNoText] = useState(NO_LINES[0]);
  const [noPos, setNoPos] = useState({ x: 82, y: 55 });
  const [noScale, setNoScale] = useState(1);
  const [noGone, setNoGone] = useState(false);

  const rowRef = useRef(null);

  const greeting = "Шайн уу, Хулакаа.";
  const question = useMemo(() => {
    if (accepted) return "YAYYYY 💖";
    return "Чи миний Валентин болох уу?";
  }, [accepted]);

  useEffect(() => {
    setNoPos({ x: rand(72, 88), y: rand(36, 68) });
  }, []);

  function moveNo() {
    if (accepted || noGone) return;

    const nextCount = noCount + 1;
    setNoCount(nextCount);

    setNoText(NO_LINES[nextCount % NO_LINES.length]);

    // right lane
    setNoPos({ x: rand(70, 90), y: rand(36, 68) });

    setNoScale((s) => Math.max(0.34, +(s - 0.12).toFixed(2)));
    setYesFill((f) => Math.min(1, +(f + 0.25).toFixed(2)));

    if (nextCount >= 2) setYesGlow(true);
    if (nextCount >= 6) setNoGone(true);
  }

  function onYes() {
    setAccepted(true);
  }

  const yesStyle = useMemo(() => {
    const row = rowRef.current;

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 520;
    const baseW = isMobile ? 220 : 260;
    const baseH = isMobile ? 54 : 56;

    if (!row) return { width: `${baseW}px`, height: `${baseH}px` };

    const r = row.getBoundingClientRect();
    const padX = 22;
    const padY = 18;
    const maxW = Math.max(baseW, r.width - padX * 2);
    const maxH = Math.max(baseH, r.height - padY * 2);

    const f = clamp(yesFill, 0, 1);
    const w = Math.round(baseW + (maxW - baseW) * f);
    const h = Math.round(baseH + (maxH - baseH) * Math.min(1, f * 0.78));

    return { width: `${w}px`, height: `${h}px` };
  }, [yesFill]);

  return (
    <div className="page">
      <div className="heartRain" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2.2}s`,
              animationDuration: `${4.2 + Math.random() * 2.4}s`,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <div className="card">
        <div className="topDecor" aria-hidden="true">
          <div className="hangingHearts">
            <span />
            <span />
            <span />
          </div>

          <div className="stickerWrap">
            <img
              className="sticker"
              src="/sticker.png"
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="stickerFallback" aria-hidden="true">
              🐼💗🐻
            </div>
          </div>
        </div>

        {!accepted ? (
          <>
            <h1 className="title">
              <span className="greet">{greeting}</span>
              <span className="q">{question}</span>
            </h1>

            <div className="sub">Чамдаа би зөндөө хайртай шүү 💗</div>

            <div className="buttonRow" ref={rowRef}>
              <button
                className={`btn yes ${yesGlow ? "glow" : ""} ${
                  yesFill > 0.75 ? "big" : ""
                }`}
                onClick={onYes}
                style={yesStyle}
              >
                ТИЙМ ЭЭ, МЭДЭЭЖ
              </button>

              {!noGone && (
                <button
                  className="btn no"
                  onClick={moveNo}
                  style={{
                    left: `${noPos.x}%`,
                    top: `${noPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${noScale})`,
                  }}
                >
                  {noText}
                </button>
              )}

              <div className="pixelCorner" aria-hidden="true" />
            </div>

            <div className="hint">
              {noGone
                ? "Одоо ганцхан зөв сонголт үлдлээ 😌💗"
                : "(“Үгүй” дарах юм бол чиний baby маш их гомдоно)"}
            </div>
          </>
        ) : (
          <Success />
        )}
      </div>

      <footer className="foot">by tmuln, made with 💗</footer>
    </div>
  );
}

function Success() {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBurst((b) => b + 1), 320);
    const stop = setTimeout(() => clearInterval(t), 2200);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, []);

  return (
    <div className="success">
      <div className="bigHeart" aria-hidden="true">
        💖
      </div>

      <div className="successTitle">YAY! 🎉</div>
      <div className="successSub">
        Одоо болзоо товлоё 🥂
        <br />
        <span className="small">Хайртай шүү.</span>
      </div>

      <div className="confetti" aria-hidden="true" key={burst}>
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="confettiBit"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.35}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
