import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Globe,
  RotateCcw,
  Sliders,
  Trash2,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  ASSET_PATHS,
  EXPERIMENT_ORDER,
  EXPERIMENTS,
  evaluateStepCompletion,
} from '../data/curriculum';
import {
  computeBeamTrajectory,
  computeMillikanState,
} from '../physics/cathodePhysics';
import { soundFX } from '../utils/soundEffects';
import { ControlDock } from './ControlDock';
import { FooterBar } from './FooterBar';
import { LabCanvas3D } from './LabCanvas3D';
import {
  ApparatusConfigModal,
  LabNotebookModal,
  WelcomeTourModal,
} from './LabModals';
import { MagnifierLoupe } from './MagnifierLoupe';
import { StepGuidePanel } from './StepGuidePanel';
import { ToolboxPanel } from './ToolboxPanel';
import type {
  CameraPreset,
  ExperimentId,
  LabSimulationParams,
  Language,
} from '../types/lab';

interface LabWorkbenchProps {
  lang: Language;
  experimentId: ExperimentId;
  muted: boolean;
  skipInitialTour: boolean;
  onChangeLang: (lang: Language) => void;
  onToggleMute: () => void;
  onSelectExperiment: (id: ExperimentId) => void;
  onBackToMap: () => void;
  onMarkCompleted: (id: ExperimentId) => void;
}

function createInitialParams(experimentId: ExperimentId): LabSimulationParams {
  return {
    experimentId,
    hvEnabled: true,
    voltageKv: 12,
    pressureMmHg: experimentId === 'cathode-tube' ? 760 : 0.005,
    gas: 'air',
    cathodeMetal: 'copper',
    malteseCrossUp: false,
    paddleWheelEngaged: false,
    magnetActive: false,
    magnetPolarity: 1,
    thomsonMode: 'cathode-rays',
    electricVoltageV: 0,
    magneticFieldMt: 0,
    dropletChargeN: 2,
    dropletRadiusUm: 1.0,
    millikanVoltageV: 0,
    xrayActive: false,
    sprayPulse: 0,
    alphaBeamEnabled: false,
    detectorAngleDeg: 0,
    foilMaterial: 'gold',
    foilThicknessNm: 400,
    darkRoom: false,
  };
}

export function LabWorkbench({
  lang,
  experimentId,
  muted,
  skipInitialTour,
  onChangeLang,
  onToggleMute,
  onSelectExperiment,
  onBackToMap,
  onMarkCompleted,
}: LabWorkbenchProps) {
  const experiment = EXPERIMENTS[experimentId];

  const [params, setParams] = useState<LabSimulationParams>(() =>
    createInitialParams(experimentId)
  );
  const [placedIds, setPlacedIds] = useState<Set<string>>(() => new Set());
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [visitedGasChange, setVisitedGasChange] = useState(false);
  const [visitedMetalChange, setVisitedMetalChange] = useState(false);

  const [toolboxCollapsed, setToolboxCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [guideCollapsed, setGuideCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [presetVersion, setPresetVersion] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  const [tourOpen, setTourOpen] = useState(!skipInitialTour);
  const [tourPage, setTourPage] = useState(0);
  const [configOpen, setConfigOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [completionBanner, setCompletionBanner] = useState(false);

  // Sync experiment switches cleanly
  useEffect(() => {
    setParams(createInitialParams(experimentId));
    setPlacedIds(new Set());
    setCurrentStepIdx(0);
    setQuizSelected(null);
    setVisitedGasChange(false);
    setVisitedMetalChange(false);
    setCompletionBanner(false);
    setCameraPreset('overview');
    setPresetVersion((v) => v + 1);
  }, [experimentId]);

  const requiredIds = useMemo(
    () => experiment.equipment.map((e) => e.id),
    [experiment]
  );
  const isAssembled = useMemo(
    () => requiredIds.every((id) => placedIds.has(id)),
    [requiredIds, placedIds]
  );

  const thomsonTraj = useMemo(() => computeBeamTrajectory(params), [params]);
  const millikanState = useMemo(() => computeMillikanState(params), [params]);

  const currentStep = experiment.steps[currentStepIdx];
  const quizCorrect = currentStep.quizQuestion
    ? quizSelected === currentStep.quizQuestion.correctIndex
    : true;

  const isCurrentStepDone = evaluateStepCompletion(
    currentStep,
    placedIds,
    requiredIds,
    params,
    thomsonTraj.isBalanced,
    millikanState.isSuspended,
    quizCorrect,
    visitedGasChange,
    visitedMetalChange
  );

  const handleUpdateParams = (patch: Partial<LabSimulationParams>) => {
    if (patch.gas && patch.gas !== 'air') setVisitedGasChange(true);
    if (patch.cathodeMetal && patch.cathodeMetal !== 'copper') setVisitedMetalChange(true);
    if (patch.hvEnabled !== undefined) soundFX.playSpark();
    if (patch.sprayPulse !== undefined) soundFX.playSpray();
    setParams((prev) => ({ ...prev, ...patch }));
  };

  const handlePlaceItem = (id: string) => {
    setPlacedIds((prev) => {
      if (prev.has(id)) return prev;
      soundFX.playPlace();
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handlePlaceAll = () => {
    soundFX.playSuccess();
    setPlacedIds(new Set(requiredIds));
  };

  const handleClearBench = () => {
    setPlacedIds(new Set());
    setCurrentStepIdx(0);
    setQuizSelected(null);
    setCompletionBanner(false);
  };

  const handleResetAll = () => {
    setParams(createInitialParams(experimentId));
    setPlacedIds(new Set());
    setCurrentStepIdx(0);
    setQuizSelected(null);
    setVisitedGasChange(false);
    setVisitedMetalChange(false);
    setCompletionBanner(false);
    setCameraPreset('overview');
    setPresetVersion((v) => v + 1);
    setZoomScale(1);
  };

  const handleCompleteStation = () => {
    soundFX.playSuccess();
    onMarkCompleted(experimentId);
    setCompletionBanner(true);
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden bg-[#120D09]"
      data-experiment={experimentId}
      data-assembled={isAssembled ? 'true' : 'false'}
    >
      {/* Main Workbench Viewport Stage */}
      <div
        className="relative flex-1 overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedId = e.dataTransfer.getData('text/plain');
          if (droppedId) handlePlaceItem(droppedId);
        }}
      >
        {/* Background Chemistry Laboratory Room Photo (dims smoothly in Darkroom mode) */}
        <img
          src={ASSET_PATHS.labRoomBackdrop}
          alt="Sunlit Chemistry Laboratory Room"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
            params.darkRoom ? 'brightness-[0.14] contrast-125' : 'brightness-95'
          }`}
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${
            params.darkRoom
              ? 'bg-[#040914]/75'
              : 'bg-gradient-to-b from-black/15 via-transparent to-black/35'
          }`}
        />

        {/* Three.js 3D Apparatus & Wooden Workbench Canvas */}
        <div className="absolute inset-0 z-10">
          <LabCanvas3D
            params={params}
            placedIds={placedIds}
            cameraPreset={cameraPreset}
            presetVersion={presetVersion}
            zoomScale={zoomScale}
            onToggleMalteseCross={() =>
              handleUpdateParams({
                malteseCrossUp: !params.malteseCrossUp,
                paddleWheelEngaged: false,
              })
            }
            onPlaceEquipment={handlePlaceItem}
          />
        </div>

        {/* TOP BAR OVERLAY */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-3 sm:px-5 pt-3 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={onBackToMap}
              className="px-3.5 py-2 rounded-xl bg-[#2B1B10]/95 border border-[#B58246] text-[#FBF5EA] text-xs font-bold hover:bg-[#3E2717] flex items-center gap-1.5 cursor-pointer shadow-lg whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F5C56B]" />
              <span>{lang === 'si' ? 'ප්‍රධාන පිටුව' : 'Lab Map'}</span>
            </button>

            {/* Quick Experiment Switcher */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#22150D]/95 border border-[#8E6234]">
              {EXPERIMENT_ORDER.map((id) => {
                const exp = EXPERIMENTS[id];
                const active = id === experimentId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectExperiment(id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#F38B21] text-[#1A0E06]'
                        : 'text-[#EADAC2] hover:text-white'
                    }`}
                  >
                    {exp.number} · {exp.shortTitle[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pointer-events-auto bg-[#1B120B]/92 border border-[#B58246]/70 rounded-xl px-3.5 py-1.5 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-[#FFE5AD] whitespace-nowrap">
              {experiment.number} · {experiment.shortTitle[lang]}
            </div>
          </div>
        </div>

        {/* TOP-CENTER MAGNIFIER OBSERVATION LOUPE */}
        <div className="relative z-20 flex justify-center mt-2 px-3 pointer-events-none">
          <MagnifierLoupe params={params} lang={lang} isAssembled={isAssembled} />
        </div>

        {/* LEFT & RIGHT COLLAPSIBLE LAB PANELS */}
        <div className="absolute inset-x-0 top-16 sm:top-20 bottom-24 z-20 flex items-start justify-between px-2 sm:px-4 pointer-events-none">
          <ToolboxPanel
            lang={lang}
            equipment={experiment.equipment}
            placedIds={placedIds}
            collapsed={toolboxCollapsed}
            highlightPulse={tourOpen && tourPage === 1}
            onToggleCollapse={() => {
              const next = !toolboxCollapsed;
              setToolboxCollapsed(next);
              if (!next && typeof window !== 'undefined' && window.innerWidth < 768) {
                setGuideCollapsed(true);
              }
            }}
            onPlaceItem={handlePlaceItem}
            onPlaceAll={handlePlaceAll}
          />

          <StepGuidePanel
            lang={lang}
            steps={experiment.steps}
            currentStepIdx={currentStepIdx}
            isCurrentStepDone={isCurrentStepDone}
            quizSelected={quizSelected}
            collapsed={guideCollapsed}
            onToggleCollapse={() => {
              const next = !guideCollapsed;
              setGuideCollapsed(next);
              if (!next && typeof window !== 'undefined' && window.innerWidth < 768) {
                setToolboxCollapsed(true);
              }
            }}
            onPrevStep={() => {
              setQuizSelected(null);
              setCurrentStepIdx((i) => Math.max(0, i - 1));
            }}
            onNextStep={() => {
              setQuizSelected(null);
              setCurrentStepIdx((i) => Math.min(experiment.steps.length - 1, i + 1));
            }}
            onSelectQuizOption={(idx) => {
              setQuizSelected(idx);
              if (currentStep.quizQuestion && idx === currentStep.quizQuestion.correctIndex) {
                soundFX.playSuccess();
              }
            }}
            onCompleteStation={handleCompleteStation}
          />
        </div>

        {/* COMPLETION CONGRATULATIONS TOAST BANNER */}
        {completionBanner && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 wood-panel rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl">
            <span className="text-xs sm:text-sm font-bold text-[#86EFAC]">
              {lang === 'si'
                ? 'විශිෂ්ටයි! මෙම පරීක්ෂණය සාර්ථකව සම්පූර්ණ කළා!'
                : 'Well done! You completed this practical station!'}
            </span>
            <button
              type="button"
              onClick={onBackToMap}
              className="amber-cta px-3 py-1.5 rounded-lg text-xs font-bold text-[#1E1005] cursor-pointer whitespace-nowrap"
            >
              {lang === 'si' ? 'ඊළඟ පරීක්ෂණයට →' : 'Lab Map →'}
            </button>
          </div>
        )}

        {/* BOTTOM CONTROL DOCK */}
        <div className="absolute bottom-2 inset-x-2 sm:inset-x-4 z-20 flex flex-col items-center pointer-events-none">
          <ControlDock
            lang={lang}
            params={params}
            isAssembled={isAssembled}
            cameraPreset={cameraPreset}
            dockCollapsed={dockCollapsed}
            onToggleDock={() => setDockCollapsed((v) => !v)}
            onUpdateParams={handleUpdateParams}
            onSelectCameraPreset={(preset) => {
              setCameraPreset(preset);
              setPresetVersion((v) => v + 1);
            }}
          />
        </div>

        {/* BOTTOM-LEFT AP LAB CIRCULAR TOOLBAR (Hidden when mobile small to preserve space or compact row) */}
        <div className="hidden xl:flex absolute bottom-3 left-4 z-30 items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleResetAll}
            title={lang === 'si' ? 'යළි අරඹන්න' : 'Reset Practical'}
            aria-label="Reset Practical"
            className="w-9 h-9 rounded-full bg-[#2A1C12] border border-[#A8733B] text-[#F5C56B] hover:text-white flex items-center justify-center cursor-pointer shadow"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearBench}
            title={lang === 'si' ? 'මේසය හිස් කරන්න' : 'Clear Bench'}
            aria-label="Clear Bench"
            className="w-9 h-9 rounded-full bg-[#2A1C12] border border-[#A8733B] text-[#FCA5A5] hover:text-white flex items-center justify-center cursor-pointer shadow"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setConfigOpen(true)}
            title={lang === 'si' ? 'වායු / ලෝහ සැකසුම්' : 'Configure Gas & Metal'}
            aria-label="Configure Apparatus"
            className="w-9 h-9 rounded-full bg-[#16A34A] border border-[#BBF7D0] text-white flex items-center justify-center cursor-pointer shadow"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setNotebookOpen(true)}
            title={lang === 'si' ? 'විද්‍යාගාර සටහන් පොත' : 'Lab Theory Notebook'}
            aria-label="Open Lab Notebook"
            className="w-9 h-9 rounded-full bg-[#2563EB] border border-[#DBEAFE] text-white flex items-center justify-center cursor-pointer shadow"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={muted ? 'Unmute' : 'Mute'}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-[#D97706] border border-[#FEF3C7] text-white flex items-center justify-center cursor-pointer shadow"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onChangeLang(lang === 'si' ? 'en' : 'si')}
            title="Switch Language"
            aria-label="Switch Language"
            className="h-9 px-2.5 rounded-full bg-[#EA580C] border border-[#FFEDD5] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'සිං' : 'EN'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#1D130B] border border-[#8E6234] rounded-full px-2 py-1 text-[11px] font-mono-tabular text-[#EADAC2]">
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
              aria-label="Zoom Out"
              className="hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1">{Math.round(zoomScale * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
              aria-label="Zoom In"
              className="hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BOTTOM-RIGHT ASSISTANT HINT MINI BUBBLE (Desktop) */}
        {!guideCollapsed && (
          <div className="hidden 2xl:flex absolute bottom-3 right-4 z-30 items-end gap-2 pointer-events-none">
            <div className="mb-3 max-w-[215px] bg-[#0D2E36]/95 border border-[#38BDF8]/50 rounded-xl px-3 py-2 text-[11px] text-[#E2E8F0] shadow-xl">
              {currentStep.assistantHint[lang]}
            </div>
            <img
              src={ASSET_PATHS.assistantAvatar}
              alt="Lab Instructor"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover object-top border-2 border-[#C89242] shadow-xl"
            />
          </div>
        )}
      </div>

      {/* MODALS */}
      <WelcomeTourModal
        open={tourOpen}
        tourPage={tourPage}
        lang={lang}
        onChangePage={setTourPage}
        onClose={() => setTourOpen(false)}
      />

      <ApparatusConfigModal
        open={configOpen}
        lang={lang}
        params={params}
        onUpdateParams={handleUpdateParams}
        onClose={() => setConfigOpen(false)}
      />

      <LabNotebookModal
        open={notebookOpen}
        lang={lang}
        onClose={() => setNotebookOpen(false)}
      />

      <FooterBar lang={lang} />
    </div>
  );
}
