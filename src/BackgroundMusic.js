// src/BackgroundMusic.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicCtx = createContext({ ready: false });
export function useMusic() {
  return useContext(MusicCtx);
}

export default function BackgroundMusic({ src = "/backgroundmusic.mp3", children }) {
  const audioRef = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [ready, setReady] = useState(false);

  async function tryPlay() {
    const a = audioRef.current;
    if (!a) return;

    a.loop = true;
    a.preload = "auto";
    a.volume = 0.55;

    try {
      await a.play();
      setNeedsTap(false);
      setReady(true);
    } catch {
      // autoplay blocked -> user gesture required
      setNeedsTap(true);
      setReady(false);
    }
  }

  useEffect(() => {
    tryPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enableByTap() {
    tryPlay();
  }

  return (
    <MusicCtx.Provider value={{ ready }}>
      <audio ref={audioRef} src={src} playsInline />
      {children}

      {needsTap && (
        <button className="musicGate" onClick={enableByTap}>
          Tap to enable sound 💗
        </button>
      )}
    </MusicCtx.Provider>
  );
}
