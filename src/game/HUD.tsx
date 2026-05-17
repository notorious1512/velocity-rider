import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "./store";
import { Zap, Shield, Gauge, AlertCircle } from "lucide-react";

export const HUD = () => {
  const { speed, score, nitro, damage, commentary, isPlaying, reset, isGameOver } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 overflow-hidden z-40">
      {/* Top HUD: Header & Title */}
      <header className="relative flex justify-between items-start w-full">
        <div className="flex flex-col">
          <h1 className="text-6xl font-black italic tracking-tighter leading-none text-white">
            VELOCITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc00ff]">RIDERS</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-2 py-0.5 bg-[#bc00ff] text-[10px] font-bold tracking-widest uppercase text-white">Neon Cyber City</span>
            <span className="text-[#00f2ff] text-[10px] font-mono">SECTOR // 07-A</span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={commentary}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-pink-500 text-[10px] uppercase font-bold italic"
              >
                // {commentary}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-8 text-right">
          <div>
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest text-white">Distance</div>
            <div className="text-3xl font-mono text-white">{Math.floor(score).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest text-[#bc00ff]">Rank</div>
            <div className="text-3xl font-mono text-white">#01<span className="text-sm opacity-50">/12</span></div>
          </div>
        </div>
      </header>

      {/* Side Alerts */}
      <div className="absolute right-8 top-1/3 w-64 space-y-4">
        {damage > 50 && (
          <motion.div 
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="flex items-center gap-3 bg-[#ff0080]/10 border border-[#ff0080]/30 p-3 rounded"
          >
            <div className="w-2 h-2 bg-[#ff0080] rounded-full animate-ping" />
            <div className="text-[11px] font-bold text-[#ff0080] uppercase tracking-tighter">Warning: Critical Damage</div>
          </motion.div>
        )}
      </div>

      {/* Bottom HUD: Speed, Nitro & Damage */}
      <footer className="relative flex justify-between items-end w-full">
        {/* Speedometer */}
        <div className="flex items-baseline gap-3">
          <span className="text-9xl font-mono font-black text-[#00f2ff] tracking-tighter italic">
            {Math.round(speed)}
          </span>
          <div className="flex flex-col mb-4">
            <span className="text-2xl font-bold opacity-50 uppercase tracking-widest text-white">km/h</span>
            <span className="text-[#bc00ff] text-sm font-mono font-bold">GEAR 6</span>
          </div>
        </div>

        {/* Nitro Bar (Segmented Style) */}
        <div className="w-96 flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-white">
            <span>NITRO CAPACITY</span>
            <span className="text-[#00f2ff]">{Math.round(nitro)}%</span>
          </div>
          <div className="h-4 bg-white/5 border border-white/10 p-0.5 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`h-full flex-1 transition-all duration-300 ${
                  nitro > i * 20 
                    ? "bg-gradient-to-r from-[#00f2ff] to-[#bc00ff]" 
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Health / Hull Integrity (Blocks Style) */}
        <div className="flex flex-col items-end gap-2 mb-4">
          <div className="text-[10px] font-bold opacity-50 text-white uppercase tracking-widest">Hull Integrity</div>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-8 h-8 border border-[#00f2ff]/30 transition-all duration-300 ${
                  (100 - damage) > i * 20 ? "bg-[#00f2ff]" : "bg-transparent opacity-20"
                }`}
              />
            ))}
          </div>
        </div>
      </footer>

      {(isGameOver || !isPlaying) && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black border-2 border-cyan-500 p-12 text-center shadow-[0_0_100px_rgba(0,255,255,0.4)] max-w-lg w-full mx-4"
          >
            <h1 className="text-6xl font-black text-white italic tracking-tighter mb-4">
              VELOCITY<span className="text-cyan-400">RIDERS</span>
            </h1>
            
            {isGameOver && (
              <div className="mb-8">
                <div className="text-red-500 font-bold uppercase tracking-[0.5em] mb-2 animate-pulse">Critical Failure</div>
                <div className="text-gray-400 mb-6">Your bike was destroyed in the neon wastes.</div>
                <div className="bg-white/5 p-4 rounded border border-white/10 mb-6">
                   <div className="text-xs text-cyan-400 uppercase">Final Distance</div>
                   <div className="text-4xl font-mono text-white">{Math.floor(score)}m</div>
                </div>
              </div>
            )}

            <button 
              onClick={() => reset()}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black px-12 py-6 text-2xl font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            >
              {isGameOver ? "Reboot & Ride" : "Initiate Race"}
            </button>
            <div className="mt-6 text-gray-500 text-xs uppercase tracking-widest opacity-50">
              WASD TO STEER • SHIFT FOR NITRO • SPACE TO BRAKE
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
