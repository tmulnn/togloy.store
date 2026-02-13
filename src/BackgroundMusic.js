import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicCtx = createContext({
  enabled: false,
  toggle: () => {},
});

export function useMusic() {
  return useContext(MusicCtx);
}

export default function BackgroundMusic({ src = "/backgroundmusic.mp3", children }) {
  const audioRef = useRef(null);

  const [enabled, setEnabled] = useState(() => {
    const v = localStorage.getItem("bgmusic_enabled");
    return v ? v === "1" : true;
  });

  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    localStorage.setItem("bgmusic_enabled", enabled ? "1" : "0");
  }, [enabled]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.loop = true;
    a.preload = "auto";
    a.volume = 0.55;

    if (!enabled) {
      a.pause();
      setNeedsTap(false);
      return;
    }

    (async () => {
      try {
        await a.play();
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    })();
  }, [enabled]);

  async function enableByTap() {
    const a = audioRef.current;
    if (!a) return;

    try {
      await a.play();
      setNeedsTap(false);
      setEnabled(true);
    } catch {
      setNeedsTap(true);
    }
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;

    if (enabled) {
      a.pause();
      setEnabled(false);
      setNeedsTap(false);
    } else {
      setEnabled(true);
    }
  }

  return (
    <MusicCtx.Provider value={{ enabled, toggle }}>
      <audio ref={audioRef} src={src} playsInline />
      {children}

      {!needsTap && (
        <div className="musicPill">
          <button className="musicIconBtn" onClick={toggle}>
            {enabled ? "🔇 Дууг хаах" : "🔊 Дууг тоглуулах"}
          </button>
        </div>
      )}

      {enabled && needsTap && (
        <div className="musicGateWrap">
          <button className="musicGateBtn" onClick={enableByTap}>
            Tap to start sound 💗
          </button>
        </div>
      )}
    </MusicCtx.Provider>
  );
}
