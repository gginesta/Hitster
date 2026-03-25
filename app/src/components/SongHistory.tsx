import { X, Check, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store';

interface SongHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SongHistory({ isOpen, onClose }: SongHistoryProps) {
  const songHistory = useGameStore((s) => s.songHistory);
  const players = useGameStore((s) => s.players);
  const finalPlayers = useGameStore((s) => s.finalPlayers);

  // Use finalPlayers on results screen, otherwise active players
  const allPlayers = Object.keys(finalPlayers).length > 0 ? finalPlayers : players;

  const getPlayerName = (id: string) => allPlayers[id]?.name ?? 'Unknown';

  // Reverse chronological order
  const reversedHistory = [...songHistory].reverse();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col bg-[#1a1a2e] rounded-t-3xl border-t border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">Song History</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Song list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {reversedHistory.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  No songs played yet
                </div>
              ) : (
                reversedHistory.map((entry, idx) => (
                  <motion.div
                    key={`${entry.roundNumber}-${entry.song.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                  >
                    {/* Round number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-400 tabular-nums">
                        {entry.roundNumber}
                      </span>
                    </div>

                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {entry.song.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {entry.song.artist} &middot; {entry.song.year}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {getPlayerName(entry.turnPlayerId)}
                        {entry.stolenBy && (
                          <span className="inline-flex items-center gap-1 ml-2 text-amber-400">
                            <ArrowRightLeft className="w-3 h-3" />
                            Stolen by {getPlayerName(entry.stolenBy)}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Correct / Incorrect badge */}
                    <div className="flex-shrink-0">
                      {entry.correct ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          <Check className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                          <X className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Wrong</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
