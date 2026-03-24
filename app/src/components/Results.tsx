import { Trophy, Home, RotateCcw, Medal, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { getSocket } from '../services/socket';
import { useGameStore } from '../store';

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const MEDAL_STYLES: Record<number, { bg: string; border: string; badge: string; text: string }> = {
  0: {
    bg: 'bg-gradient-to-r from-[#FFD700]/20 to-transparent',
    border: 'border-[#FFD700]/50',
    badge: 'bg-[#FFD700] text-black',
    text: 'text-[#FFD700]',
  },
  1: {
    bg: 'bg-gradient-to-r from-[#C0C0C0]/15 to-transparent',
    border: 'border-[#C0C0C0]/40',
    badge: 'bg-[#C0C0C0] text-black',
    text: 'text-[#C0C0C0]',
  },
  2: {
    bg: 'bg-gradient-to-r from-[#CD7F32]/15 to-transparent',
    border: 'border-[#CD7F32]/40',
    badge: 'bg-[#CD7F32] text-black',
    text: 'text-[#CD7F32]',
  },
};

const DEFAULT_STYLE = {
  bg: 'bg-white/5',
  border: 'border-white/10',
  badge: 'bg-black/50 text-gray-400',
  text: 'text-gray-400',
};

export function Results() {
  const winnerId = useGameStore((s) => s.winnerId);
  const finalPlayers = useGameStore((s) => s.finalPlayers);
  const settings = useGameStore((s) => s.settings);
  const sharedTimeline = useGameStore((s) => s.sharedTimeline);
  const myId = useGameStore((s) => s.myId);
  const hostId = useGameStore((s) => s.hostId);
  const reset = useGameStore((s) => s.reset);

  const isCoop = settings.mode === 'coop';
  const isHost = myId === hostId;
  const playerList = Object.values(finalPlayers);
  const sortedPlayers = [...playerList].sort(
    (a, b) => b.timeline.length - a.timeline.length
  );
  const winner = winnerId ? finalPlayers[winnerId] : sortedPlayers[0];

  const handlePlayAgain = () => {
    const socket = getSocket();
    socket.emit('restart-game');
  };

  const handleHome = () => {
    const socket = getSocket();
    socket.emit('leave-room');
    reset();
  };

  if (!winner) return null;

  return (
    <div className="flex flex-col min-h-screen p-6 text-white bg-[#1a1a2e] overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center mt-8 mb-12"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#FFD700] blur-3xl opacity-30 rounded-full" />
          <Trophy className="w-32 h-32 text-[#FFD700] relative z-10" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-center mb-2">
          {isCoop ? 'TEAM WINS!' : `${winner.name} WINS!`}
        </h1>
        <p className="text-[#1DB954] font-bold text-xl">
          {isCoop
            ? `${sharedTimeline.length} Cards Collected Together`
            : `${winner.timeline.length} Cards Collected`}
        </p>
      </motion.div>

      <div className="flex-1 w-full max-w-md mx-auto space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          {isCoop ? 'Team Result' : 'Final Rankings'}
        </h3>

        {isCoop ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border bg-gradient-to-r from-[#1DB954]/20 to-transparent border-[#1DB954]/40"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-[#1DB954]">Team Score</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl">{sharedTimeline.length}</span>
                <span className="text-xs text-gray-400 uppercase">Cards</span>
              </div>
            </div>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
                >
                  <span className="font-medium">{player.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{player.tokens}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          sortedPlayers.map((player, index) => {
            const style = MEDAL_STYLES[index] || DEFAULT_STYLE;
            const ordinal = ORDINALS[index] || `${index + 1}th`;

            return (
              <motion.div
                key={player.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.12, type: 'spring', stiffness: 200 }}
                className={`flex items-center justify-between p-4 rounded-2xl border ${style.bg} ${style.border}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${style.badge}`}
                    >
                      {index < 3 ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${style.text}`}>
                      {ordinal}
                    </span>
                  </div>
                  <span className="font-bold text-lg">{player.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xl">{player.timeline.length}</span>
                      <span className="text-xs text-gray-400 uppercase">Cards</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{player.tokens} tokens</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-12 w-full max-w-md mx-auto space-y-4">
        {isHost ? (
          <button
            onClick={handlePlayAgain}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(29,185,84,0.3)]"
          >
            <RotateCcw className="w-6 h-6" />
            Play Again
          </button>
        ) : (
          <div className="w-full bg-white/5 text-gray-400 font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-3">
            <RotateCcw className="w-6 h-6" />
            Waiting for host to restart...
          </div>
        )}
        <button
          onClick={handleHome}
          className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95"
        >
          <Home className="w-6 h-6" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
