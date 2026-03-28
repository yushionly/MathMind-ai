"use client";

import { useMemo, useState } from "react";

interface GeoGebraGeometryExplorerProps {
  initialParams?: Record<string, unknown>;
}

function buildUrl(materialId: string | null): string {
  if (materialId) {
    return `https://www.geogebra.org/material/iframe/id/${encodeURIComponent(materialId)}/width/960/height/560/border/888888/rc/false/ai/false/sdz/false/ctl/false`;
  }
  return "https://www.geogebra.org/classic?lang=zh-CN";
}

const PRESETS = [
  { label: "默认几何画板", materialId: "" },
  { label: "二次函数与交点", materialId: "xw5n8z7p" },
  { label: "三角形中线", materialId: "j8f4v9hq" },
];

export function GeoGebraGeometryExplorer({ initialParams }: GeoGebraGeometryExplorerProps) {
  const initialId =
    typeof initialParams?.materialId === "string" && initialParams.materialId.trim()
      ? initialParams.materialId.trim()
      : "";

  const [materialId, setMaterialId] = useState(initialId);

  const src = useMemo(() => buildUrl(materialId || null), [materialId]);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-800">GeoGebra 几何探索器</h3>
        <p className="text-xs text-slate-500">
          适用于几何构造、动态变换和函数图像联动探索。可输入 GeoGebra material id。
        </p>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
            onClick={() => setMaterialId(preset.materialId)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <input
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
          placeholder="可选：输入 material id，例如 xw5n8z7p"
        />
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
        >
          新窗口打开
        </a>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <iframe title="GeoGebra Explorer" src={src} className="h-[420px] w-full" loading="lazy" />
      </div>
    </div>
  );
}
