"use client";

import React, { useState, useEffect } from "react";

export function WaterPoolExplorer() {
  const [divisions, setDivisions] = useState<number>(1);
  const [timePassed, setTimePassed] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Constants for the problem: 3 hours to fill, 4 hours to drain
  const fillTime = 3;
  const drainTime = 4;

  const fillPerHour = divisions / fillTime;
  const drainPerHour = divisions / drainTime;
  const netPerHour = fillPerHour - drainPerHour;

  const currentWaterLevel = Math.max(0, Math.min(divisions, timePassed * netPerHour));
  
  // Check if current division makes it perfectly divisible (integers for both)
  const isPerfectFit = divisions % fillTime === 0 && divisions % drainTime === 0;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimePassed((prev) => {
          if (prev * netPerHour >= divisions) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1 real second = 1 simulation hour
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, divisions, netPerHour]);

  const handleReset = () => {
    setTimePassed(0);
    setIsPlaying(false);
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDivisions(Number(e.target.value));
    handleReset();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg border border-slate-200 font-sans mt-4 mb-4 text-slate-800">
      <h2 className="text-2xl font-bold mb-2 text-blue-600">水池进排水探索器</h2>
      <p className="text-sm text-slate-500 mb-6 text-center">
        挑战：进水管单开3小时注满，出水管单开4小时排空。同时打开，几小时注满？<br/>
        提示：试着把水池切分成不同的小份，看看哪种分法能让每小时进水和出水都是整数份！
      </p>

      {/* Control Panel */}
      <div className="w-full bg-slate-50 p-4 rounded-lg mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700">
            把整个水池切分成： <span className="text-blue-600 text-xl">{divisions}</span> 份
          </label>
        </div>
        <input
          type="range"
          min="1"
          max="24"
          value={divisions}
          onChange={handleDivisionChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-100">
            <strong>每小时进水：</strong> 
            {fillPerHour % 1 !== 0 ? (
              <span className="text-red-500 font-bold ml-1">{fillPerHour.toFixed(2)} 份 (非整数，不好算不好画)</span>
            ) : (
              <span className="font-bold ml-1">{fillPerHour} 份 完美！</span>
            )}
          </div>
          <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
            <strong>每小时排水：</strong> 
            {drainPerHour % 1 !== 0 ? (
              <span className="text-red-500 font-bold ml-1">{drainPerHour.toFixed(2)} 份 (非整数，不好算不好画)</span>
            ) : (
              <span className="font-bold ml-1">{drainPerHour} 份 完美！</span>
            )}
          </div>
        </div>

        {isPerfectFit && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-center font-bold animate-pulse">
            🎉 太棒了！你发现了 {divisions} 可以同时被 {fillTime} 和 {drainTime} 整除！净进水为每小时 {netPerHour} 份！
          </div>
        )}
      </div>

      {/* Simulation Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={timePassed * netPerHour >= divisions}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition disabled:opacity-50"
        >
          {isPlaying ? "暂停" : timePassed === 0 ? "开始注水模拟" : "继续模拟"}
        </button>
        <button 
          onClick={handleReset}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full font-medium transition"
        >
          重置并清空水池
        </button>
        <div className="text-lg font-bold text-slate-700 ml-4">
          已耗时：<span className="text-blue-600">{timePassed}</span> 小时
        </div>
      </div>

      {/* Visualization */}
      <div className="relative w-full h-64 border-4 border-slate-300 rounded-b-xl overflow-hidden flex flex-col-reverse bg-sky-50">
        {/* Water fill */}
        <div 
          className="w-full bg-blue-400 absolute bottom-0 transition-all duration-300 ease-in-out"
          style={{ height: `${(currentWaterLevel / divisions) * 100}%` }}
        >
          {/* Water effect decoration */}
          <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        {/* Grid lines to represent divisions */}
        <div className="absolute inset-0 z-10 flex flex-col">
          {Array.from({ length: divisions }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 w-full border-t border-slate-400/30 border-dashed first:border-t-0 flex items-center justify-end pr-2"
            >
              <span className="text-xs text-slate-500/70 font-mono">
                 {divisions - i} 份
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-4 text-center text-slate-500">
        净水量 = {currentWaterLevel.toFixed(1)} / {divisions} 份
      </div>
    </div>
  );
}