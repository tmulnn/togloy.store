import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import SuccessScene from "./SuccessScene";
import BackgroundMusic from "./BackgroundMusic";

const NO_LINES = [
  "ҮГҮЙ ЭЭ, БАЯРЛАЛАА",
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
  return (
    <BackgroundMusic src="/backgroundmusic.mp3">
      <AppInner />
    </BackgroundMusic>
  );
}

function AppInner() {
  const [accepted, setAccepted] = useState(false);

  const [yesFill, setYesFill] = useState(0);
  const [yesGlow, setYesGlow] = useState(false);

  const [noCount, setNoCount] = useState(0);
  const [noText, setNoText] = useState(NO_LINES[0] ?? "");
  const [noPos, setNoPos] = useState({ x: 82, y: 60 });
  const [noScale, setNoScale] = useState(1);
  const [noGone, setNoGone] = useState(false);

  const rowRef = useRef(null);
  const yesBtnRef = useRef(null);

  const greeting = "Шайн уу, хөөрхөн Хулаакаа";
  const question = useMemo(() => {
    if (accepted) return "YAYYYY 💖";
    return "Чи миний Валентин болж болох уу?";
  }, [accepted]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 520;
    setNoPos(isMobile ? { x: rand(64, 88), y: rand(64, 80) } : { x: rand(72, 88), y: rand(40, 68) });
  }, []);

  function pickNoPosAvoidingYes() {
    const isMobile = window.innerWidth <= 520;

    const xMin = isMobile ? 62 : 70;
    const xMax = 90;
    const yMin = isMobile ? 62 : 36;
    const yMax = isMobile ? 82 : 68;

    const row = rowRef.current;
    const yesBtn = yesBtnRef.current;
    if (!row || !yesBtn) return { x: rand(xMin, xMax), y: rand(yMin, yMax) };

    const rr = row.getBoundingClientRect();
    const yr = yesBtn.getBoundingClientRect();

    const yesLeft = ((yr.left - rr.left) / rr.width) * 100;
    const yesRight = ((yr.right - rr.left) / rr.width) * 100;
    const yesTop = ((yr.top - rr.top) / rr.height) * 100;
    const yesBottom = ((yr.bottom - rr.top) / rr.height) * 100;

    for (let i = 0; i < 12; i++) {
      const x = rand(xMin, xMax);
      const y = rand(yMin, yMax);

      const inX = x > yesLeft - 6 && x < yesRight + 6;
      const inY = y > yesTop - 10 && y < yesBottom + 10;

      if (!(inX && inY)) return { x, y };
    }

    return { x: rand(xMin, xMax), y: rand(yMin, yMax) };
  }

  function moveNo() {
    if (accepted || noGone) return;

    const isMobile = window.innerWidth <= 520;
    const vanishAt = isMobile ? 3 : 6;

    const nextCount = noCount + 1;
    setNoCount(nextCount);

    // ✅ текст өөрчлөхгүй, зөвхөн crash хамгаална
    const nextLine =
      NO_LINES.length > 0 ? NO_LINES[nextCount % NO_LINES.length] : "";
    setNoText(nextLine);

    setNoPos(pickNoPosAvoidingYes());

    setNoScale((s) => Math.max(isMobile ? 0.45 : 0.34, +(s - 0.12).toFixed(2)));
    setYesFill((f) => Math.min(1, +(f + (isMobile ? 0.32 : 0.25)).toFixed(2)));

    if (nextCount >= 2) setYesGlow(true);
    if (nextCount >= vanishAt) setNoGone(true);
  }

  function onYes() {
    setAccepted(true);
  }

  const yesStyle = useMemo(() => {
    const row = rowRef.current;
    const isMobile = window.innerWidth <= 520;

    const baseW = isMobile ? 210 : 260;
    const baseH = isMobile ? 54 : 56;

    if (!row) return { width: `${baseW}px`, height: `${baseH}px` };

    const r = row.getBoundingClientRect();
    const padX = isMobile ? 18 : 22;
    const padY = isMobile ? 16 : 18;

    const maxW = Math.max(baseW, r.width - padX * 2);
    const maxH = Math.max(baseH, r.height - padY * 2);

    const f = clamp(yesFill, 0, 1);
    const w = Math.round(baseW + (maxW - baseW) * f);
    const h = Math.round(baseH + (maxH - baseH) * Math.min(1, f * (isMobile ? 0.55 : 0.78)));

    return { width: `${w}px`, height: `${h}px` };
  }, [yesFill]);

  if (accepted) {
    return (
      <div className="page">
        <SuccessScene
          startDateISO="2024-11-29T00:00:00+08:00"
          messageLines={[
          "Хайртай сайхан Хулан минь 💗🌸",
          "Халгих зүрхний ундарга минь ❤️‍🔥💞",
          "Өглөө бүр үнсэж сэрээх сэн чамайг 😌💋",
          "Өдөр бүр инээлгэж жаргаах сан чамайг 😌✨😊",
          ]}
        />
      </div>
    );
  }

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
              🐰💗🦊
            </div>
          </div>
        </div>

        <h1 className="title">
          <span className="greet">{greeting}</span>
          <span className="q">{question}</span>
        </h1>

        <div className="sub">Энэ өдрийг чамтай л хамт өнгөрөөх гээд ээ кк 💗</div>

        <div className="buttonRow" ref={rowRef}>
          <button
            ref={yesBtnRef}
            className={`btn yes ${yesGlow ? "glow" : ""} ${yesFill > 0.75 ? "big" : ""}`}
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
          {noGone ? "Хамгийн зөв сонголт нь ингээд үлдчихлээ 😌💗" : "(Үгүй дарах юм бол харин GG шдээ тэгээд!)"}
        </div>
      </div>
    </div>
  );
}
