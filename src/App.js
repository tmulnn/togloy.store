import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const NO_LINES = [
  "ҮГҮЙ ЭЭ, БАЯРЛАЛАА",
  "ЗА БОЛИОЧ 🥺",
  "ДАХИАД БОД ДОО 🙈",
  "НАДАД БОЛОМЖ ОЛГООЧ 😭",
  "ЭНЭ NO ЧИНЬ БУРУУ ЮМ ШИГ БАЙНА 😆",
  "СҮҮЛЧИЙН БОЛОМЖ ШҮҮ 💘",
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  const [accepted, setAccepted] = useState(false);

  // ✅ YES grows by X mostly (fills row), Y slightly
  const [yesSX, setYesSX] = useState(1);
  const [yesSY, setYesSY] = useState(1);
  const [yesGlow, setYesGlow] = useState(false);

  const [noCount, setNoCount] = useState(0);
  const [noText, setNoText] = useState(NO_LINES[0]);
  const [noPos, setNoPos] = useState({ x: 78, y: 55 });

  const rowRef = useRef(null);
  const yesBtnRef = useRef(null);

  const greeting = "Шайн уу, Хулакаа.";
  const question = useMemo(() => {
    if (accepted) return "YAYYYY 💖";
    return "Чи миний Валентин болох уу?";
  }, [accepted]);

  useEffect(() => {
    setNoPos({ x: rand(70, 92), y: rand(35, 72) });
  }, []);

  function moveNo() {
    if (accepted) return;

    setNoCount((c) => c + 1);
    setNoText(NO_LINES[(noCount + 1) % NO_LINES.length]);

    // NO runs inside row
    setNoPos({ x: rand(62, 94), y: rand(28, 78) });

    const row = rowRef.current;
    const btn = yesBtnRef.current;

    // ✅ Increase scales, but compute max so it can fill row width
    setYesSX((sx) => {
      const stepX = 0.22; // өргөнөөр өсөх хурд
      const nextSX = sx + stepX;

      if (!row || !btn) return Math.min(6, +nextSX.toFixed(2));

      const r = row.getBoundingClientRect();
      const b = btn.getBoundingClientRect();

      // base sizes (remove current scales)
      const baseW = b.width / sx;
      const baseSY = yesSY; // current Y scale from state (closure ok enough)
      const baseH = b.height / baseSY;

      // padding so it doesn't hit border
      const padX = 26;
      const padY = 22;

      // max X based on row width (THIS is what we want)
      const maxSX = (r.width - padX * 2) / baseW;

      // keep Y small, just slightly bigger
      const maxSY = Math.min(1.25, (r.height - padY * 2) / baseH);

      // update Y at the same time (cap)
      setYesSY((sy) => Math.min(maxSY, +(sy + 0.05).toFixed(2)));

      return Math.min(maxSX, +nextSX.toFixed(2));
    });

    if (noCount >= 1) setYesGlow(true);
  }

  function onYes() {
    setAccepted(true);
  }

  return (
    <div className="page">
      <div className="heartRain" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2.2}s`,
              animationDuration: `${3.8 + Math.random() * 2.6}s`,
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
                ref={yesBtnRef}
                className={`btn yes ${yesGlow ? "glow" : ""} ${
                  yesSX > 2.2 ? "big" : ""
                }`}
                onClick={onYes}
                style={{
                  ["--sx"]: yesSX,
                  ["--sy"]: yesSY,
                }}
              >
                ТИЙМ ЭЭ, МЭДЭЭЖ
              </button>

              <button
                className="btn no"
                onClick={moveNo}
                style={{
                  left: `${noPos.x}%`,
                  top: `${noPos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {noText}
              </button>

              <div className="pixelCorner" aria-hidden="true" />
            </div>

            <div className="hint">(“Үгүй” дээр дарахад зугтана 😆)</div>
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
        Одоо болзоо товлоё 🥂<br />
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
