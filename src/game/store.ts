import { create } from "zustand";

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  speed: number;
  distance: number;
  damage: number;
  nitro: number;
  commentary: string;
  setPlaying: (playing: boolean) => void;
  setGameOver: (over: boolean) => void;
  addScore: (points: number) => void;
  setSpeed: (speed: number) => void;
  updateDistance: (delta: number) => void;
  setDamage: (damage: number) => void;
  setNitro: (nitro: number) => void;
  setCommentary: (text: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  isGameOver: false,
  score: 0,
  speed: 0,
  distance: 0,
  damage: 0,
  nitro: 100,
  commentary: "Ready to ride?",
  setPlaying: (playing) => set({ isPlaying: playing }),
  setGameOver: (over) => set({ isGameOver: over }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setSpeed: (speed) => set({ speed }),
  updateDistance: (delta) => set((state) => ({ distance: state.distance + delta })),
  setDamage: (damage) => set({ damage }),
  setNitro: (nitro) => set({ nitro }),
  setCommentary: (text) => set({ commentary: text }),
  reset: () => set({ 
    isPlaying: true, 
    isGameOver: false, 
    score: 0, 
    speed: 0, 
    distance: 0, 
    damage: 0, 
    nitro: 100,
    commentary: "Let's go!"
  }),
}));
