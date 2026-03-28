"use client";

import { useMemo, useState } from "react";

const EXAMPLES = [
  { label: "一次函数", expr: "y=x+1" },
  { label: "二次函数", expr: "y=x^2-4" },
  { label: "反比例", expr: "y=6/x" },
  { label: "三角函数", expr: "y=2sin(x)" },
];

function buildDesmosUrl(expr: string): string {
  const cleaned = expr.trim() || "y=x";
  return `https://www.desmos.com/calculator?lang=zh-CN#expression=${encodeURIComponent(cleaned)}`;
}

interface DesmosGraphExplorerProps {
  initialExpression?: string;
}

export function DesmosGraphExplorer({ initialExpression }: DesmosGraphExplorerProps) {
  const [expr, setExpr] = useState(initialExpression?.trim() || "y=x^2");

  const iframeUrl = useMemo(() => buildDesmosUrl(expr), [expr]);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-800">函数图像探索器</h3>
        <p className="text-xs text-slate-500">
          输入表达式并打开动态图。推荐后续接入 GeoGebra API 以支持更丰富几何交互。
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {EXAMPLES.map((item) => (
          <button
            key={item.expr}
            type="button"
            onClick={() => setExpr(item.expr)}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
          placeholder="例如：y=x^2-4x+3"
        />
        <a
          href={iframeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          新窗口打开
        </a>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <iframe
          title="Desmos Graph Explorer"
          src={iframeUrl}
          className="h-[360px] w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
