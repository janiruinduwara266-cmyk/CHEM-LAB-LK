import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Lock,
} from 'lucide-react';
import type { LabStep, Language } from '../types/lab';

interface StepGuidePanelProps {
  lang: Language;
  steps: LabStep[];
  currentStepIdx: number;
  isCurrentStepDone: boolean;
  quizSelected: number | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSelectQuizOption: (idx: number) => void;
  onCompleteStation: () => void;
}

export function StepGuidePanel({
  lang,
  steps,
  currentStepIdx,
  isCurrentStepDone,
  quizSelected,
  collapsed,
  onToggleCollapse,
  onPrevStep,
  onNextStep,
  onSelectQuizOption,
  onCompleteStation,
}: StepGuidePanelProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const step = steps[currentStepIdx];
  const isLastStep = currentStepIdx === steps.length - 1;
  const pct = ((currentStepIdx + (isCurrentStepDone ? 1 : 0)) / Math.max(1, steps.length)) * 100;

  return (
    <div className="relative z-20 flex items-start pointer-events-auto">
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Open Step Guide' : 'Collapse Step Guide'}
        className="mt-8 -mr-[1px] px-1.5 py-3 rounded-l-xl bg-[#0D2E36] border-2 border-r-0 border-[#287482] text-[#7DD3FC] hover:text-white cursor-pointer shadow-lg"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {!collapsed && (
        <aside
          aria-label={lang === 'si' ? 'පරීක්ෂණ පියවර මඟපෙන්වීම' : 'Experiment Step Guide'}
          className="w-[265px] sm:w-[295px] teal-guide-panel rounded-2xl p-4 text-[#F1F5F9] max-h-[70vh] flex flex-col"
        >
          {/* Step Header + Progress */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#FBBF24] font-mono-tabular">
              {lang === 'si'
                ? `පියවර ${currentStepIdx + 1} / ${steps.length}`
                : `Step ${currentStepIdx + 1} / ${steps.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrevStep}
                disabled={currentStepIdx === 0}
                aria-label="Previous Step"
                className="p-1.5 rounded-lg bg-[#16414C] hover:bg-[#1E5664] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNextStep}
                disabled={!isCurrentStepDone || isLastStep}
                aria-label="Next Step"
                className="p-1.5 rounded-lg bg-[#16414C] hover:bg-[#1E5664] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h2 className="font-display text-base font-bold text-white mt-1.5 leading-snug">
            {step.title[lang]}
          </h2>

          <div className="w-full h-1.5 bg-[#071C22] rounded-full overflow-hidden my-2.5">
            <div
              className="h-full bg-[#F59E0B] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto lab-scroll pr-1 space-y-3 flex-1">
            {/* Do Now Card */}
            <div
              className={`rounded-xl p-3 border ${
                isCurrentStepDone
                  ? 'bg-[#12382D] border-[#4ADE80]/60'
                  : 'bg-[#092229] border-[#F59E0B]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                <span className={isCurrentStepDone ? 'text-[#4ADE80]' : 'text-[#FBBF24]'}>
                  {isCurrentStepDone
                    ? lang === 'si'
                      ? 'සම්පූර්ණයි ✓'
                      : 'Completed ✓'
                    : lang === 'si'
                      ? 'දැන් කරන්න'
                      : 'Do Now'}
                </span>
                {isCurrentStepDone && <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />}
              </div>
              <p className="mt-1 text-xs font-semibold text-white leading-snug">
                {step.taskTitle[lang]}
              </p>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">{step.instruction[lang]}</p>

            {/* Optional Concept Verification Quiz */}
            {step.quizQuestion && (
              <div className="rounded-xl bg-[#071F26] border border-[#287482] p-3">
                <div className="text-[11px] font-bold text-[#7DD3FC] mb-1.5">
                  {lang === 'si' ? 'සංකල්ප පරීක්ෂාව:' : 'Concept Check:'}
                </div>
                <p className="text-xs text-white font-medium mb-2">
                  {step.quizQuestion.prompt[lang]}
                </p>
                <div className="space-y-1.5">
                  {step.quizQuestion.options.map((opt, idx) => {
                    const isPicked = quizSelected === idx;
                    const isRight = idx === step.quizQuestion!.correctIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectQuizOption(idx)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                          isPicked
                            ? isRight
                              ? 'bg-[#14532D] border-[#4ADE80] text-white'
                              : 'bg-[#7F1D1D] border-[#F87171] text-white'
                            : 'bg-[#0E313A] border-[#1F5360] text-[#E2E8F0] hover:border-[#38BDF8]'
                        }`}
                      >
                        {opt[lang]}
                      </button>
                    );
                  })}
                </div>
                {quizSelected === step.quizQuestion.correctIndex && (
                  <p className="mt-2 text-[11px] text-[#86EFAC] leading-snug">
                    {step.quizQuestion.explanation[lang]}
                  </p>
                )}
              </div>
            )}

            {/* Accordion: Why do this? */}
            <div className="rounded-xl bg-[#082229] border border-[#1E5664]">
              <button
                type="button"
                onClick={() => setWhyOpen(!whyOpen)}
                aria-expanded={whyOpen}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#93C5FD] cursor-pointer"
              >
                <span>{lang === 'si' ? 'මෙහෙම කරන්නේ ඇයි?' : 'Why do we do this?'}</span>
                {whyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {whyOpen && (
                <div className="px-3 pb-3 text-[11px] text-[#CBD5E1] leading-relaxed">
                  {step.whyText[lang]}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-3 pt-2.5 border-t border-[#1E5664]">
            {isLastStep ? (
              <button
                type="button"
                disabled={!isCurrentStepDone}
                onClick={onCompleteStation}
                className="w-full py-2 px-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#14353E] disabled:text-[#64748B] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {!isCurrentStepDone && <Lock className="w-3.5 h-3.5" />}
                <span className="whitespace-nowrap">
                  {lang === 'si' ? 'පරීක්ෂණය සම්පූර්ණ කරන්න' : 'Complete Practical'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!isCurrentStepDone}
                onClick={onNextStep}
                className="w-full py-2 px-3 rounded-xl bg-[#F38B21] hover:bg-[#FFA23A] disabled:bg-[#14353E] disabled:text-[#64748B] text-[#1E1005] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {!isCurrentStepDone && <Lock className="w-3.5 h-3.5" />}
                <span className="whitespace-nowrap">
                  {isCurrentStepDone
                    ? lang === 'si'
                      ? 'ඊළඟ පියවර →'
                      : 'Next Step →'
                    : lang === 'si'
                      ? 'ඉහත කාර්යය සම්පූර්ණ කරන්න'
                      : 'Complete task to unlock'}
                </span>
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
