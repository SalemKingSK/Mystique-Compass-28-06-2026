"use client";

import React, { useState } from "react";
import { cheiroPsychicNumbers } from "@/lib/numerology/cheiro-psychic-numbers";
import { resolveMonthData } from "@/lib/numerology/monthly-profiles";
import { AccordionContentWithPlayer } from "./profile-generator/accordion-content-with-player";
import { BookText, Sparkles, Gem, Calendar, Moon, Sun, ScrollText, Magnet, Zap } from "lucide-react";

interface PsychicNumberDetailPanelProps {
  number: number;
  johariMeaning: string;
  birthMonth: number;
}

export default function PsychicNumberDetailPanel({
  number,
  johariMeaning,
  birthMonth
}: PsychicNumberDetailPanelProps) {
  const [openLayer, setOpenLayer] = useState<number | null>(1);

  const cheiroData = cheiroPsychicNumbers[number];
  const monthlyData = resolveMonthData(birthMonth, number);

  const toggleLayer = (layer: number) => {
    setOpenLayer(openLayer === layer ? null : layer);
  };

  return (
    <div className="flex flex-col gap-0">
      {/* --- Layer 1: Johari (Vedic) --- */}
      <div className="border-b border-white/5 pb-2">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(1)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-cinzel">
              Layer 1
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-purple-200 group-hover:text-purple-400 transition-colors">
              The Psychic Essence (Johari)
            </span>
          </div>
          <span className={`text-purple-500/40 transition-transform ${openLayer === 1 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 1 && (
          <div className="pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="text-sm leading-relaxed text-white/70">
                <AccordionContentWithPlayer text={johariMeaning} />
             </div>
          </div>
        )}
      </div>

      {/* --- Layer 2: Cheiro Character --- */}
      <div className="border-b border-white/5">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(2)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-cinzel">
              Layer 2
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-amber-200 group-hover:text-amber-400 transition-colors">
              The Chronicler's View (Cheiro)
            </span>
          </div>
          <span className={`text-amber-500/40 transition-transform ${openLayer === 2 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 2 && cheiroData && (
          <div className="pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 rounded-xl bg-amber-950/10 border-l-2 border-amber-500/40 text-sm leading-relaxed text-stone-300">
               <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase text-amber-400/80 tracking-tighter">Verbatim Character Analysis</span>
               </div>
               <AccordionContentWithPlayer text={cheiroData.description} />
             </div>
          </div>
        )}
      </div>

      {/* --- Layer 3: The Monthly Chronicle --- */}
      <div className="border-b border-white/5">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(3)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-cinzel">
              Layer 3
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-teal-200 group-hover:text-teal-400 transition-colors">
              The Monthly Soul Chronicle
            </span>
          </div>
          <span className={`text-teal-500/40 transition-transform ${openLayer === 3 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 3 && (
          <div className="pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              {/* Month Badge */}
              <div className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest w-fit ${monthlyData.ready ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                {monthlyData.monthName} — Number {number}
                {!monthlyData.ready && " (Transcript in Progress)"}
              </div>

              {/* Segments */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-[10px] font-bold uppercase text-teal-400/80">General Influence</span>
                  </div>
                  <div className="text-[13px] leading-relaxed text-stone-300">
                    <AccordionContentWithPlayer text={monthlyData.generalInfluence} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ScrollText className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-[10px] font-bold uppercase text-teal-400/80">Monthly Character</span>
                  </div>
                  <div className="text-[13px] leading-relaxed text-stone-300">
                    <AccordionContentWithPlayer text={monthlyData.monthlyCharacter} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Gem className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-[10px] font-bold uppercase text-teal-400/80">Financial Outlook</span>
                  </div>
                  <div className="text-[13px] leading-relaxed text-stone-300">
                    <AccordionContentWithPlayer text={monthlyData.financialOutlook} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-[10px] font-bold uppercase text-rose-400/80">Specific Health Cautions</span>
                  </div>
                  <div className="text-[13px] leading-relaxed text-stone-300 italic">
                    <AccordionContentWithPlayer text={monthlyData.healthCautions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Layer 4: Celestial Alignments --- */}
      <div className="border-t border-white/10">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(4)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-cinzel">
              Layer 4
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-emerald-200 group-hover:text-emerald-400 transition-colors">
              Celestial Alignments
            </span>
          </div>
          <span className={`text-emerald-500/40 transition-transform ${openLayer === 4 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 4 && (
          <div className="pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 rounded-xl bg-emerald-950/10 border-l-2 border-emerald-500/40">
               <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase text-emerald-400/80 tracking-widest">Important Numbers & Dates</span>
               </div>
               <div className="text-sm leading-relaxed text-stone-300">
                 <AccordionContentWithPlayer text={monthlyData.luckyNumbers} />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-[10px] font-bold uppercase text-purple-400 tracking-widest">Colors</span>
                   </div>
                   <div className="text-[11px] text-stone-400 italic">
                      <AccordionContentWithPlayer text={monthlyData.colors} />
                   </div>
                </div>
                <div className="p-4 rounded-xl bg-yellow-950/10 border border-yellow-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <Gem className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-[10px] font-bold uppercase text-yellow-400 tracking-widest">Jewels</span>
                   </div>
                   <div className="text-[11px] text-stone-400 italic">
                      <AccordionContentWithPlayer text={monthlyData.jewels} />
                   </div>
                </div>
             </div>

             <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                   <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                   <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest">Climacteric Years</span>
                </div>
                <div className="text-[11px] text-stone-300">
                    <AccordionContentWithPlayer text={monthlyData.climactericYears} />
                </div>
             </div>

             <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20">
                <div className="flex items-center gap-2 mb-2">
                   <Magnet className="h-3.5 w-3.5 text-rose-400" />
                   <span className="text-[10px] font-bold uppercase text-rose-400 tracking-widest">Magnetic Attraction</span>
                </div>
                <div className="text-[11px] text-stone-300">
                    <AccordionContentWithPlayer text={monthlyData.magneticAttraction} />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
