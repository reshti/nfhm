import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  Save,
  Check,
  RotateCcw,
  Clock,
  Play,
  Flame,
} from 'lucide-react';
import {
  GamesSystemConfig,
  loadGamesConfig,
  saveGamesConfig,
  GAME_DETAILS,
  DEFAULT_GAMES_SYSTEM_CONFIG,
} from '../../data/gamesConfigData';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

export const AdminGamesControl: React.FC = () => {
  const [config, setConfig] = useState<GamesSystemConfig>(loadGamesConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testCelebrationOpen, setTestCelebrationOpen] = useState(false);

  // Toggle individual game
  const handleToggleGame = (gameId: string) => {
    const current = config.games[gameId] ?? true;
    const updated: GamesSystemConfig = {
      ...config,
      games: {
        ...config.games,
        [gameId]: !current,
      },
    };
    setConfig(updated);
    saveGamesConfig(updated);
  };

  // Toggle all games
  const handleToggleAll = (enable: boolean) => {
    const updatedGames: Record<string, boolean> = {};
    GAME_DETAILS.forEach((g) => {
      updatedGames[g.id] = enable;
    });
    const updated: GamesSystemConfig = {
      ...config,
      games: updatedGames,
    };
    setConfig(updated);
    saveGamesConfig(updated);
  };

  // Save changes
  const handleSave = () => {
    saveGamesConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to defaults
  const handleReset = () => {
    setConfig(DEFAULT_GAMES_SYSTEM_CONFIG);
    saveGamesConfig(DEFAULT_GAMES_SYSTEM_CONFIG);
  };

  return (
    <div className="space-y-8 text-right font-['Tajawal']">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Gamepad2 className="w-6 h-6 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0a4d7a]">
              إدارة ألعاب الموقع ونظام احتفال الفوز (بالونات وألعاب نارية)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            تفعيل أو إيقاف أي لعبة بشكل مستقل، والتحكم بنظام احتفال الفوز وظهور البالونات الصاعدة والألعاب النارية.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTestCelebrationOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-[#061e31] text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>تجربة احتفال الفوز بالبالونات 🎈</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] hover:from-[#0a4d7a] hover:to-[#25a0c3] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ إعدادات الألعاب'}</span>
          </button>
        </div>
      </div>

      {/* 2. Victory Celebration System Settings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>إعدادات نظام احتفال الفوز (إيقاف الوقت والبالونات والألعاب النارية)</span>
          </h3>
          <span className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-full">
            مؤتمت عند تحقيق الفوز في الألعاب
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Toggle Celebration Master */}
          <div className="p-4 rounded-2xl bg-[#f2f8fc] border border-[#0c6aa7]/20 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-black text-[#0a4d7a] block">
                تفعيل احتفال الفوز (البالونات الصاعدة)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                ظهور بالونات ملونة تصعد بالشاشة فور فوز اللاعب
              </span>
            </div>

            <button
              onClick={() => {
                const updated = { ...config, celebrationEnabled: !config.celebrationEnabled };
                setConfig(updated);
                saveGamesConfig(updated);
              }}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                config.celebrationEnabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {config.celebrationEnabled ? 'مفعل بالمنصة ✓' : 'معطل'}
            </button>
          </div>

          {/* Balloon Duration Slider */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900">
                  مدة صعود البالونات بالشاشة:
                </span>
                <span className="text-sm font-black text-amber-600 font-mono">
                  {config.balloonAnimationSeconds} ثوانٍ
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                المدة المحددة التي تصعد خلالها البالونات للأعلى
              </span>
            </div>

            <input
              type="range"
              min={2}
              max={6}
              step={1}
              value={config.balloonAnimationSeconds}
              onChange={(e) => {
                const updated = { ...config, balloonAnimationSeconds: parseInt(e.target.value, 10) };
                setConfig(updated);
                saveGamesConfig(updated);
              }}
              className="w-full h-2 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Fireworks Toggle */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-black text-rose-900 block">
                تفعيل شكل الألعاب النارية المتفجرة
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                تأثيرات ضوئية واحتفالية متزامنة مع بالونات الفوز
              </span>
            </div>

            <button
              onClick={() => {
                const updated = { ...config, fireworksEnabled: !config.fireworksEnabled };
                setConfig(updated);
                saveGamesConfig(updated);
              }}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                config.fireworksEnabled
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {config.fireworksEnabled ? 'ألعاب نارية نشطة ✓' : 'معطلة'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Individual Game Enable/Disable Toggles */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-[#0a4d7a]">
              التحكم في ألعاب المنصة المتاحة للزوار ({GAME_DETAILS.length} ألعاب)
            </h3>
            <span className="text-xs text-slate-500">
              الألعاب المعطلة ستظهر موسومة بأنها معطلة مؤقتاً ولن يتمكن الزائر من تشغيلها.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleToggleAll(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors cursor-pointer"
            >
              تفعيل كافة الألعاب
            </button>
            <button
              onClick={() => handleToggleAll(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
            >
              تعطيل الكل
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GAME_DETAILS.map((game) => {
            const isEnabled = config.games[game.id] ?? true;

            return (
              <div
                key={game.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isEnabled
                    ? 'bg-white border-slate-200 shadow-2xs hover:border-[#0c6aa7]'
                    : 'bg-slate-50/70 border-slate-200 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e1eff8] text-[#0c6aa7]">
                      {game.tag}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isEnabled ? 'مفعلة' : 'معطلة'}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0a4d7a]">{game.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    {game.description}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleGame(game.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isEnabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isEnabled ? 'إيقاف اللعبة' : 'تفعيل اللعبة'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Victory Celebration Modal Preview */}
      <VictoryCelebrationModal
        isOpen={testCelebrationOpen}
        gameTitle="معاينة تجريبية لاحتفال الفوز"
        score={100}
        moves={14}
        timeSeconds={35}
        lesson="الفهم بداية التقبل.. بالونات الفوز والألعاب النارية تعمل الآن بشكل متناغم ورائع!"
        onReplay={() => setTestCelebrationOpen(false)}
        onExit={() => setTestCelebrationOpen(false)}
      />
    </div>
  );
};
