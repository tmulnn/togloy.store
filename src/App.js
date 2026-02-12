import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const MESSAGES = [
  "Үнэхээр үү? 🥺",
  "Дахиад бод доо 🙈",
  "Надад боломж олгооч 😭",
  "Энэ No чинь буруу юм шиг байна аа 😆",
  "За за… сүүлчийн боломж! 💘",
  "Хмм… No-г заслаа 🤭",
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
  const [yes, setYes] = useState(false);
  const [noText, setNoText] = useState("No");
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 50, y: 70 }); // percent

  const arenaRef = useRef(null);
  const yesBtnRef = useRef(null);

  const title = useMemo(() => {
    if (yes) return "YAYYY!!! 💖💖💖";
    return "Will you be my Valentine? 💘";
  }, [yes]);

  useEffect(() => {
    // Initial NO random position
    setNoPos({ x: rand(15, 85), y: rand(55, 85) });
  }, []);

  function moveNo() {
    if (yes) return;

    // counter + label
    setNoCount((c) => c + 1);
    setNoText(MESSAGES[(noCount + 1) % MESSAGES.length]);

    // NO zugtana (arena dotor)
    const padX = 12;
    const x = rand(padX, 100 - padX);
    const y = rand(55, 90);
    setNoPos({ x, y });

    // YES fullscreen hurtel tomorno (viewport-r max scale tootsono)
    const yesBtn = yesBtnRef.current;

    setYesScale((s) => {
      const next = s + 0.45; // өсөх хурд (0.30~0.60 хооронд тааруулж болно)

      if (!yesBtn) return +next.toFixed(2);

      const rect = yesBtn.getBoundingClientRect();

      // base хэмжээ (одоогийн дэлгэцэн дээрх хэмжээг одоогийн scale-ээр хуваана)
      const baseW = rect.width / s;
      const baseH = rect.height / s;

      // viewport хэмжээ
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // дэлгэц "дүүрэх" хязгаар (өргөн 92%, өндөр 78% орчим)
      const maxScaleX = (vw * 0.92) / baseW;
      const maxScaleY = (vh * 0.78) / baseH;
      const maxScale = Math.max(1, Math.min(maxScaleX, maxScaleY));

      return Math.min(maxScale, +next.toFixed(2));
    });
  }

  function handleYes() {
    setYes(true);
  }

  return (
    <div className="page">
      <div className="bgHearts" aria-hidden="true" />

      <div className="card">
        <div className="badge">shuudtogloy.store</div>

        <h1 className="title">{title}</h1>

        {!yes ? (
          <>
            <p className="subtitle">
              Нэг л товч дарчих… тэгээд би хамгийн азтай хүн болно 🥰
            </p>

            {/* NO zugtah talbai */}
            <div className="arena" ref={arenaRef}>
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
            </div>

            {/* YES дэлгэцийн төвд fixed байрлаад томорно */}
            <button
              ref={yesBtnRef}
              className={`btn yes ${yesScale > 6 ? "big" : ""}`}
              onClick={handleYes}
              style={{ ["--yesScale"]: yesScale }}
            >
              Yes 💞
            </button>

            <div className="hint">(No дээр дарахад зугтаана 😆)</div>
          </>
        ) : (
          <Success />
        )}
      </div>

      <footer className="foot">Made with ❤️</footer>
    </div>
  );
}

function Success() {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBurst((b) => b + 1), 350);
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

      <p className="successText">
        За тэгвэл болзоо товлоё! 🥂
        <br />
        <span className="small">(Одоо “Valentine” горим идэвхжлээ 😌)</span>
      </p>

      <div className="chips">
        <span className="chip">🍫 шоколад</span>
        <span className="chip">🌹 сарнай</span>
        <span className="chip">🎬 кино</span>
        <span className="chip">🍜 хоол</span>
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
