/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameWorld } from "./game/GameWorld";
import { HUD } from "./game/HUD";
import { useEffect } from "react";
import { useGameStore } from "./game/store";

export default function App() {
  const { speed, isPlaying, setCommentary, damage } = useGameStore();

  // Handle AI Commentary
  useEffect(() => {
    if (!isPlaying) return;
    
    // Call AI periodically or on specific events
    const fetchCommentary = async () => {
      try {
        const event = speed > 150 ? "high_speed" : speed < 20 ? "slow_start" : "cruising";
        const res = await fetch("/api/commentary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            speed: Math.round(speed),
            event,
            damage: Math.round(damage),
            bikeType: "Superbike"
          })
        });
        const data = await res.json();
        if (data.text) setCommentary(data.text);
      } catch (e) {
        console.error("Commentary failed", e);
      }
    };

    const interval = setInterval(fetchCommentary, 10000); // Every 10s
    return () => clearInterval(interval);
  }, [isPlaying, speed, setCommentary]);

  return (
    <div className="w-full h-screen bg-cyber-black overflow-hidden select-none relative">
      {/* Background Cyberpunk Grid */}
      <div className="absolute inset-0 cyber-grid z-0" />
      
      {/* Screen Glitch Overlay */}
      <div className="absolute inset-0 cyber-glitch z-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 mix-blend-overlay z-50" />

      <GameWorld />
      <HUD />
    </div>
  );
}
