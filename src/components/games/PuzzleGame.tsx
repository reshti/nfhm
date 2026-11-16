import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Clock, Award, HelpCircle, Eye, CheckCircle2, Puzzle } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface PuzzleGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

const PUZZLE_IMAGES = [
  {
    id: 'art1',
    title: 'أطفال وطلاب منصة نفهم',
    src: '/assets/aistudio/nafham_children_students.jpg',
    lesson: 'الاستكشاف والتعلم بالمرح.. احترام الاختلاف يبدأ من الطفولة المبكرة.',
  },
  {
    id: 'art2',
    title: 'شعار ورعاية جامعة الإمام عبدالرحمن بن فيصل',
    src: '/assets/aistudio/image_931e672d.png',
    lesson: 'إشراف علمي وأكاديمي رصين من كلية الآداب لدعم الدمج الإنساني والمجتمعي.',
  },
  {
    id: 'art3',
    title: 'استراتيجيات المعلمين والمختصين',
    src: '/assets/aistudio/nafham_teachers_specialists.jpg',
    lesson: 'تهيئة البيئة المدرسية واستخدام وسائل التواصل المعززة تصنع فارقاً حقيقياً.',
  },
  {
    id: 'art4',
    title: 'الدعم الأسري والشراكة المجتمعية',
    src: '/assets/aistudio/nafham_parents_families.jpg',
    lesson: 'الأسرة هي السند الأول والداعم المستمر لنقاط القوة والاهتمامات المتفردة.',
  },
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onBackToGames, reduceMotion }) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(2); // 2x2, 3x3, 4x4
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTileIdx, setSelectedTileIdx] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const activeImage = PUZZLE_IMAGES[selectedImageIdx];
  const totalTiles = gridSize * gridSize;

  // Initialize or shuffle puzzle
  const initPuzzle = (size = gridSize) => {
    const solved = Array.from({ length: size * size }, (_, i) => i);
    let shuffled = [...solved];
    // Fisher-Yates shuffle ensuring it's not identical to solved
    let isSame = true;
    while (isSame && size * size > 1) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      isSame = shuffled.every((val, idx) => val === solved[idx]);
    }
    setTiles(shuffled);
    setMoves(0);
    setTimerSeconds(0);
    setIsComplete(false);
    setSelectedTileIdx(null);
  };

  useEffect(() => {
    initPuzzle(gridSize);
  }, [gridSize, selectedImageIdx]);

  // Timer effect - stops immediately when isComplete is true
  useEffect(() => {
    if (!isTimerEnabled || isComplete) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerEnabled, isComplete]);

  // Check completion
  useEffect(() => {
    if (tiles.length === 0) return;
    const isSolved = tiles.every((tile, idx) => tile === idx);
    if (isSolved && moves > 0 && !isComplete) {
      setIsComplete(true);
      const earnedStars = gridSize === 4 ? 3 : gridSize === 3 ? 3 : 2;
      updateGameStars('puzzle', earnedStars);
    }
  }, [tiles, moves, isComplete, gridSize]);

  // Handle tile click (Click-to-swap accessibility fallback)
  const handleTileClick = (index: number) => {
    if (isComplete) return;
    if (selectedTileIdx === null) {
      setSelectedTileIdx(index);
    } else {
      if (selectedTileIdx !== index) {
        // Swap tiles
        const newTiles = [...tiles];
        const temp = newTiles[selectedTileIdx];
        newTiles[selectedTileIdx] = newTiles[index];
        newTiles[index] = temp;
        setTiles(newTiles);
        setMoves((prev) => prev + 1);
      }
      setSelectedTileIdx(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 text-right">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Sparkles className="w-5 h-5 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 1: ركّب الصورة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رتّب قطع رسومات مبادرة نفهم بالنقر أو التبديل واكتشف الرسالة التربوية!
          </p>
        </div>

        <button
          onClick={onBackToGames}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a4d7a] transition-colors cursor-pointer"
        >
          العودة لمدينة الألعاب
        </button>
      </div>

      {/* Difficulty & Options Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs font-semibold">
        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">مستوى الصعوبة:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setGridSize(2)}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                gridSize === 2 ? 'bg-[#0c6aa7] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              سهل (2x2)
            </button>
            <button
              onClick={() => setGridSize(3)}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                gridSize === 3 ? 'bg-[#0c6aa7] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              متوسط (3x3)
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                gridSize === 4 ? 'bg-[#0c6aa7] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              متقدم (4x4)
            </button>
          </div>
        </div>

        {/* Image Selection */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">الصورة:</span>
          <div className="flex gap-1">
            {PUZZLE_IMAGES.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIdx(idx)}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  selectedImageIdx === idx ? 'bg-[#0a4d7a] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1 text-[#0c6aa7] hover:underline cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOriginal ? 'إخفاء الأصلية' : 'معاينة الأصلية'}</span>
          </button>

          <button
            onClick={() => initPuzzle(gridSize)}
            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة خلط</span>
          </button>
        </div>
      </div>

      {/* Main Puzzle Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        {/* Left/Right preview on desktop */}
        <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4">
          <div className="w-48 h-48 rounded-2xl bg-[#f0f7fb] border border-[#cbe3f3] p-3 flex items-center justify-center overflow-hidden">
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#0a4d7a]">{activeImage.title}</span>
            <div className="text-xs text-slate-500">
              الحركات: <span className="font-bold text-[#0c6aa7]">{moves}</span>
            </div>
            {isTimerEnabled && (
              <div className="text-xs text-slate-500">
                الوقت: {Math.floor(timerSeconds / 60)}:{('0' + (timerSeconds % 60)).slice(-2)}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsTimerEnabled(!isTimerEnabled)}
            className="text-[11px] text-slate-500 flex items-center gap-1 hover:text-slate-800"
          >
            <Clock className="w-3 h-3" />
            <span>{isTimerEnabled ? 'تعطيل المؤقت' : 'تفعيل المؤقت (اختياري)'}</span>
          </button>
        </div>

        {/* Puzzle Board */}
        <div className="md:col-span-8 flex justify-center">
          <div
            className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl p-2 bg-[#e4f1f9] border-2 border-[#0c6aa7]/30 shadow-inner grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((tileIndex, positionIndex) => {
              const isSelected = selectedTileIdx === positionIndex;
              const isCorrectPosition = tileIndex === positionIndex;

              // Calculate background position
              const col = tileIndex % gridSize;
              const row = Math.floor(tileIndex / gridSize);
              const xPercent = (col / (gridSize - 1 || 1)) * 100;
              const yPercent = (row / (gridSize - 1 || 1)) * 100;

              return (
                <button
                  key={positionIndex}
                  onClick={() => handleTileClick(positionIndex)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-[#0c6aa7] ring-4 ring-[#2eb9df]/50 scale-95 z-20 shadow-lg'
                      : isCorrectPosition
                      ? 'border-emerald-300'
                      : 'border-white hover:border-[#2eb9df]'
                  }`}
                  style={{
                    backgroundImage: `url(${activeImage.src})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${xPercent}% ${yPercent}%`,
                    backgroundColor: '#fff',
                  }}
                  title={`قطعة ${tileIndex + 1}`}
                >
                  {/* Subtle piece number watermark for accessibility */}
                  <span className="absolute bottom-1 right-1 text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded-md font-mono">
                    {tileIndex + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grand Victory Celebration Modal with 3-second Rising Balloons & Fireworks */}
      <VictoryCelebrationModal
        isOpen={isComplete}
        gameTitle="لعبة ركّب الصورة (بازل التوحد التفاعلي)"
        score={gridSize === 4 ? 30 : gridSize === 3 ? 20 : 10}
        timeSeconds={timerSeconds}
        moves={moves}
        lesson={activeImage.lesson}
        onReplay={() => initPuzzle(gridSize)}
        onExit={onBackToGames}
      />

      {/* Accessibility instructions card */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-[#0c6aa7] shrink-0 mt-0.5" />
        <p>
          <strong>طريقة اللعب الميسرة:</strong> اضغط على أي قطعة لاختيارها، ثم اضغط على القطعة الأخرى
          لتبديل مكانيهما. الأرقام الصغيرة على الزوايا توضح الترتيب الأصلي للقطع لتسهيل الحل.
        </p>
      </div>
    </div>
  );
};
