import { useEffect, useState } from 'react';
import { AdventureMap } from './components/AdventureMap';
import { LabWorkbench } from './components/LabWorkbench';
import { TopicsModal } from './components/TopicsModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { soundFX } from './utils/soundEffects';
import type { ExperimentId, Language, ScreenState } from './types/lab';

const STORAGE_KEY_COMPLETED = 'chemlab_lk_completed_u1_v1';

export default function App() {
  const autostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [screen, setScreen] = useState<ScreenState>(autostart ? 'workbench' : 'welcome');
  const [lang, setLang] = useState<Language>('si');
  const [activeExperiment, setActiveExperiment] = useState<ExperimentId>('cathode-tube');
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  const [completedIds, setCompletedIds] = useState<Set<ExperimentId>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (raw) {
        return new Set(JSON.parse(raw) as ExperimentId[]);
      }
    } catch {
      // Ignore storage read failure
    }
    return new Set();
  });

  useEffect(() => {
    soundFX.muted = muted;
  }, [muted]);

  const handleMarkCompleted = (id: ExperimentId) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        window.localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(Array.from(next)));
      } catch {
        // Ignore storage write failure
      }
      return next;
    });
  };

  return (
    <main className="w-full min-h-screen">
      {screen === 'welcome' && (
        <WelcomeScreen
          lang={lang}
          onChangeLang={setLang}
          onEnterLab={() => setScreen('map')}
          onDirectSandbox={() => {
            setActiveExperiment('cathode-tube');
            setScreen('workbench');
          }}
        />
      )}

      {screen === 'map' && (
        <AdventureMap
          lang={lang}
          completedIds={completedIds}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          onChangeLang={setLang}
          onSelectExperiment={(id) => {
            setActiveExperiment(id);
            setScreen('workbench');
          }}
          onOpenTopics={() => setTopicsOpen(true)}
          onBackWelcome={() => setScreen('welcome')}
        />
      )}

      {screen === 'workbench' && (
        <LabWorkbench
          lang={lang}
          experimentId={activeExperiment}
          muted={muted}
          skipInitialTour={autostart}
          onChangeLang={setLang}
          onToggleMute={() => setMuted((m) => !m)}
          onSelectExperiment={(id) => setActiveExperiment(id)}
          onBackToMap={() => setScreen('map')}
          onMarkCompleted={handleMarkCompleted}
        />
      )}

      <TopicsModal
        open={topicsOpen}
        lang={lang}
        onClose={() => setTopicsOpen(false)}
        onEnterUnit1={() => setScreen('map')}
      />
    </main>
  );
}
