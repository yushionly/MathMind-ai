"use client";

import { useEffect, useMemo, useState } from "react";

interface WordProblemAnimatorProps {
  initialParams?: Record<string, unknown>;
}

interface AnimationFrame {
  t: number;
  posA: number;
  posB: number;
  met: boolean;
}

interface PythonAnimationResponse {
  mode: "meeting" | "chase";
  meetTime: number;
  simulationDuration: number;
  axisMax: number;
  frames: AnimationFrame[];
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function WordProblemAnimator({ initialParams }: WordProblemAnimatorProps) {
  const [mode, setMode] = useState<"meeting" | "chase">("meeting");
  const [distance, setDistance] = useState(120);
  const [speedA, setSpeedA] = useState(6);
  const [speedB, setSpeedB] = useState(4);
  const [time, setTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [pythonResult, setPythonResult] = useState<PythonAnimationResponse | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!initialParams) return;
    if (initialParams.mode === "meeting" || initialParams.mode === "chase") {
      setMode(initialParams.mode);
    }
    setDistance(Math.max(60, Math.min(300, toNumber(initialParams.distance, 120))));
    setSpeedA(Math.max(1, Math.min(12, toNumber(initialParams.speedA, 6))));
    setSpeedB(Math.max(1, Math.min(12, toNumber(initialParams.speedB, 4))));
  }, [initialParams]);

  const localPosA = Math.min(distance, speedA * time);
  const localPosB = Math.max(0, distance - speedB * time);
  const localMeetTime = distance / (speedA + speedB);
  const localHasMet = time >= localMeetTime;

  const currentFrame = pythonResult?.frames[frameIndex] ?? null;
  const effectivePosA = currentFrame ? currentFrame.posA : localPosA;
  const effectivePosB = currentFrame ? currentFrame.posB : localPosB;
  const effectiveMeetTime = pythonResult ? pythonResult.meetTime : localMeetTime;
  const effectiveHasMet = currentFrame ? currentFrame.met : localHasMet;
  const effectiveTime = currentFrame ? currentFrame.t : time;
  const axisMax = pythonResult?.axisMax || distance;

  const percentA = useMemo(() => (effectivePosA / axisMax) * 100, [effectivePosA, axisMax]);
  const percentB = useMemo(() => (effectivePosB / axisMax) * 100, [effectivePosB, axisMax]);

  const generateByPython = async () => {
    setIsGenerating(true);
    setEngineError(null);
    try {
      const response = await fetch('/api/math/word-problem-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, distance, speedA, speedB, frameCount: 90 }),
      });
      const json = (await response.json()) as {
        success?: boolean;
        result?: PythonAnimationResponse;
        error?: string;
      };

      if (!response.ok || !json.success || !json.result) {
        throw new Error(json.error || 'Python engine request failed');
      }

      setPythonResult(json.result);
      setFrameIndex(0);
    } catch (error) {
      setEngineError(error instanceof Error ? error.message : String(error));
      setPythonResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-800">应用题动画演示器</h3>
        <p className="text-xs text-slate-500">
          用“相遇问题”演示速度与时间关系。点击按钮可调用 Python 引擎生成轨迹帧。
        </p>
      </div>

      <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-4">
        <label className="rounded-lg bg-slate-50 p-2">
          模式
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "meeting" | "chase")}
            className="mt-1 h-8 w-full rounded border border-slate-300 bg-white px-2"
          >
            <option value="meeting">相遇</option>
            <option value="chase">追及</option>
          </select>
        </label>
        <label className="rounded-lg bg-slate-50 p-2">
          {mode === "meeting" ? "总路程" : "初始间距"}: {distance}
          <input
            type="range"
            min={60}
            max={300}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="rounded-lg bg-slate-50 p-2">
          甲速度: {speedA}
          <input
            type="range"
            min={1}
            max={12}
            value={speedA}
            onChange={(e) => setSpeedA(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="rounded-lg bg-slate-50 p-2">
          乙速度: {speedB}
          <input
            type="range"
            min={1}
            max={12}
            value={speedB}
            onChange={(e) => setSpeedB(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="rounded-lg bg-slate-50 p-2">
          时间: {time.toFixed(1)}
          <input
            type="range"
            min={0}
            max={Math.max(1, Number((effectiveMeetTime * 1.6).toFixed(1)))}
            step={0.1}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generateByPython}
          disabled={isGenerating}
          className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGenerating ? 'Python 生成中...' : '使用 Python 引擎生成轨迹'}
        </button>

        {pythonResult ? (
          <label className="text-xs text-slate-700">
            帧索引: {frameIndex + 1}/{pythonResult.frames.length}
            <input
              type="range"
              min={0}
              max={Math.max(0, pythonResult.frames.length - 1)}
              step={1}
              value={frameIndex}
              onChange={(e) => setFrameIndex(Number(e.target.value))}
              className="ml-2 align-middle"
            />
          </label>
        ) : null}

        {engineError ? <span className="text-xs text-rose-600">{engineError}</span> : null}
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="relative h-12 rounded bg-white">
          <div className="absolute left-0 top-0 h-full w-full border border-dashed border-slate-200" />

          <div
            className="absolute top-2 h-8 w-8 -translate-x-1/2 rounded-full bg-blue-500 text-center text-[10px] leading-8 text-white"
            style={{ left: `${percentA}%` }}
            title="甲"
          >
            甲
          </div>

          <div
            className="absolute top-2 h-8 w-8 -translate-x-1/2 rounded-full bg-rose-500 text-center text-[10px] leading-8 text-white"
            style={{ left: `${percentB}%` }}
            title="乙"
          >
            乙
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-700">
          {effectiveHasMet
            ? `已相遇: 约在 ${effectiveMeetTime.toFixed(2)} 时间单位处相遇。`
            : `未相遇: 还需约 ${(effectiveMeetTime - effectiveTime).toFixed(2)} 时间单位。`}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          当前模式: {mode === "meeting" ? "相遇" : "追及"}；轨道范围: 0 - {axisMax.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
