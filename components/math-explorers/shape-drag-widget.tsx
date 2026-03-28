"use client";

import { useMemo, useState } from "react";

type Shape = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
};

const WIDTH = 360;
const HEIGHT = 220;

export function ShapeDragWidget() {
  const [shapeA, setShapeA] = useState<Shape>({
    id: "A",
    x: 40,
    y: 70,
    w: 120,
    h: 70,
    color: "#2563eb",
    label: "图形A",
  });
  const [shapeB, setShapeB] = useState<Shape>({
    id: "B",
    x: 180,
    y: 90,
    w: 110,
    h: 80,
    color: "#16a34a",
    label: "图形B",
  });

  const overlap = useMemo(() => {
    const left = Math.max(shapeA.x, shapeB.x);
    const right = Math.min(shapeA.x + shapeA.w, shapeB.x + shapeB.w);
    const top = Math.max(shapeA.y, shapeB.y);
    const bottom = Math.min(shapeA.y + shapeA.h, shapeB.y + shapeB.h);
    const w = Math.max(0, right - left);
    const h = Math.max(0, bottom - top);
    return { area: w * h, w, h };
  }, [shapeA, shapeB]);

  const feedback = useMemo(() => {
    if (overlap.area === 0) return "AI反馈：两个图形未重叠，试试拖近一点观察交集变化。";
    if (overlap.area < 1200) return "AI反馈：有小面积重叠。请说出重叠区域的宽和高。";
    return "AI反馈：重叠明显。你能用“长×宽”算出交集面积并解释吗？";
  }, [overlap]);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-800">数形结合拖拽实验台</h3>
        <p className="text-xs text-slate-500">拖拽两块图形，观察交集面积变化并获得实时反馈。</p>
      </div>

      <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-2">
        <label className="rounded-lg bg-slate-50 p-2">
          图形A 横向位置: {shapeA.x}
          <input
            type="range"
            min={0}
            max={WIDTH - shapeA.w}
            value={shapeA.x}
            onChange={(e) => setShapeA((s) => ({ ...s, x: Number(e.target.value) }))}
            className="mt-1 w-full"
          />
          图形A 纵向位置: {shapeA.y}
          <input
            type="range"
            min={0}
            max={HEIGHT - shapeA.h}
            value={shapeA.y}
            onChange={(e) => setShapeA((s) => ({ ...s, y: Number(e.target.value) }))}
            className="mt-1 w-full"
          />
        </label>

        <label className="rounded-lg bg-slate-50 p-2">
          图形B 横向位置: {shapeB.x}
          <input
            type="range"
            min={0}
            max={WIDTH - shapeB.w}
            value={shapeB.x}
            onChange={(e) => setShapeB((s) => ({ ...s, x: Number(e.target.value) }))}
            className="mt-1 w-full"
          />
          图形B 纵向位置: {shapeB.y}
          <input
            type="range"
            min={0}
            max={HEIGHT - shapeB.h}
            value={shapeB.y}
            onChange={(e) => setShapeB((s) => ({ ...s, y: Number(e.target.value) }))}
            className="mt-1 w-full"
          />
        </label>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[240px] w-full rounded bg-white">
          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#ffffff" stroke="#e2e8f0" />

          <rect x={shapeA.x} y={shapeA.y} width={shapeA.w} height={shapeA.h} fill={shapeA.color} fillOpacity="0.4" stroke={shapeA.color} />
          <rect x={shapeB.x} y={shapeB.y} width={shapeB.w} height={shapeB.h} fill={shapeB.color} fillOpacity="0.4" stroke={shapeB.color} />

          {overlap.area > 0 && (
            <rect
              x={Math.max(shapeA.x, shapeB.x)}
              y={Math.max(shapeA.y, shapeB.y)}
              width={overlap.w}
              height={overlap.h}
              fill="#ef4444"
              fillOpacity="0.45"
              stroke="#ef4444"
            />
          )}

          <text x={shapeA.x + 6} y={shapeA.y + 16} fontSize="12" fill="#1e40af">
            {shapeA.label}
          </text>
          <text x={shapeB.x + 6} y={shapeB.y + 16} fontSize="12" fill="#166534">
            {shapeB.label}
          </text>
        </svg>
      </div>

      <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
        {feedback}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
        <div className="rounded bg-slate-50 p-2">交集宽: {overlap.w.toFixed(0)}</div>
        <div className="rounded bg-slate-50 p-2">交集高: {overlap.h.toFixed(0)}</div>
        <div className="rounded bg-slate-50 p-2">交集面积: {overlap.area.toFixed(0)}</div>
        <button
          type="button"
          className="rounded bg-slate-200 p-2 text-left hover:bg-slate-300"
          onClick={() => {
            setShapeA((s) => ({ ...s, x: clamp(40, 0, WIDTH - s.w), y: clamp(70, 0, HEIGHT - s.h) }));
            setShapeB((s) => ({ ...s, x: clamp(180, 0, WIDTH - s.w), y: clamp(90, 0, HEIGHT - s.h) }));
          }}
        >
          重置位置
        </button>
      </div>
    </div>
  );
}
