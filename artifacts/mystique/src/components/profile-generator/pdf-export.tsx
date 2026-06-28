import React, { useState } from 'react';
import type { AstroInsightOutput, NumerologyData } from './types';
import { calculatePsychomatrix } from '@/lib/numerology/data/psychomatrixData';
import { createPersonalizedPsychomatrixReport } from '@/lib/numerology/psychomatrix-synthesis';
import { detectContradictions } from '@/lib/numerology/synthesis/contradiction-engine';
import { generateRecommendations } from '@/lib/numerology/synthesis/recommendation-engine';
import { detectDominanceHierarchy } from '@/lib/numerology/synthesis/dominance-hierarchy-engine';
import { getDomainNarrative, ALL_DOMAIN_BANKS } from '@/lib/numerology/synthesis/life-domain-narrative-banks';
import { computeSynthesis } from '@/lib/numerology/synthesis';

interface PdfExportButtonProps {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}

// ─── Main PDF generator ───────────────────────────────────────────────────────

async function generatePdf(insight: AstroInsightOutput, numerology: NumerologyData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Colors
  const VOID        = [5, 1, 14]       as [number, number, number];
  const GOLD        = [212, 175, 55]   as [number, number, number];
  const GOLD_DIM    = [138, 111, 24]   as [number, number, number];
  const SILVER      = [168, 184, 208]  as [number, number, number];
  const SILVER_DIM  = [86, 104, 126]   as [number, number, number];
  const WHITE       = [230, 220, 255]  as [number, number, number];
  const GREEN       = [77, 170, 120]   as [number, number, number];
  const RED         = [192, 90, 120]   as [number, number, number];
  const EMERALD     = [52, 211, 153]   as [number, number, number];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ─── Robust Helpers ─────────────────────────────────────────────────────────

  function newPage() {
    doc.addPage();
    doc.setFillColor(VOID[0], VOID[1], VOID[2]);
    doc.rect(0, 0, pageW, pageH, 'F');
    y = 20;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > pageH - 22) {
      newPage();
      return true;
    }
    return false;
  }

  function addWrappedText(text: string, x: number, maxWidth: number, fontSize: number, color: number[], fontStyle = 'normal'): number {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lineHeight = fontSize * 0.45;
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
    
    return y;
  }

  function sectionHeader(label: string) {
    checkPageBreak(18);
    y += 4;
    doc.setFillColor(30, 14, 72);
    doc.roundedRect(margin, y - 5, contentW, 11, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(label.toUpperCase(), margin + 5, y + 2.5);
    y += 12;
  }

  function drawHRule(color = GOLD_DIM) {
    checkPageBreak(5);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  }

  // ── Initial Page Setup ──────────────────────────────────────────────────────
  doc.setFillColor(VOID[0], VOID[1], VOID[2]);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Decorative blobs
  doc.setGState(doc.GState({ opacity: 0.08 }));
  doc.setFillColor(124, 58, 237);
  doc.ellipse(40, 30, 70, 50, 'F');
  doc.setFillColor(212, 175, 55);
  doc.ellipse(pageW - 30, pageH - 40, 60, 45, 'F');
  doc.setGState(doc.GState({ opacity: 1 }));

  // Header
  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text('MYSTIQUE COMPASS', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
  doc.text('C O S M I C   P R O F I L E   R E P O R T', pageW / 2, y, { align: 'center' });
  y += 6;
  drawHRule();
  
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text(insight.name, pageW / 2, y, { align: 'center' });
  y += 7;
  const bday = `${numerology.birthDay} ${monthNames[numerology.birthMonth - 1]} ${numerology.birthYear}`;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
  doc.text(`Born ${bday}   ·   ${insight.gender.charAt(0).toUpperCase() + insight.gender.slice(1)}`, pageW / 2, y, { align: 'center' });
  y += 4;
  drawHRule();
  y += 4;

  // ── Core Numbers ────────────────────────────────────────────────────────────
  sectionHeader('✦ Core Cosmic Numbers');
  const chipW = (contentW - 6) / 4;
  const coreNums = [
    { label: 'Psychic', value: String(numerology.psycheNum) },
    { label: 'Destiny', value: String(numerology.destinyNum) },
    { label: 'Karmic Fate', value: String(numerology.karmicFateNum ?? '—') },
    { label: 'Kua', value: String(numerology.kuaNum ?? '—') },
  ];
  
  coreNums.forEach((n, i) => {
    const cx = margin + i * (chipW + 2);
    doc.setFillColor(18, 8, 50);
    doc.roundedRect(cx, y, chipW, 20, 2, 2, 'F');
    doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.setLineWidth(0.25);
    doc.roundedRect(cx, y, chipW, 20, 2, 2, 'S');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(n.label.toUpperCase(), cx + chipW / 2, y + 6, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(n.value, cx + chipW / 2, y + 15, { align: 'center' });
  });
  y += 26;

  // ── Astrology Overview ──────────────────────────────────────────────────────
  sectionHeader('✦ Astrology & Zodiac');
  const astroData = [
    ['Western Sign', insight.western_sign],
    ['Chinese Zodiac', insight.sign],
    ['Element', insight.element],
    ['New Astrology Sign', insight.new_astrology_sign],
  ];
  const halfW = (contentW - 4) / 2;
  astroData.forEach(([label, value], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const ax = margin + col * (halfW + 4), ay = y + row * 12;
    doc.setFillColor(12, 5, 32);
    doc.roundedRect(ax, ay, halfW, 10, 1.5, 1.5, 'F');
    doc.setDrawColor(60, 32, 140); doc.setLineWidth(0.2);
    doc.roundedRect(ax, ay, halfW, 10, 1.5, 1.5, 'S');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(label.toUpperCase(), ax + 4, ay + 6.5);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
    doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
    doc.text(value || '—', ax + halfW - 4, ay + 6.5, { align: 'right' });
  });
  y += 26;

  // ── Narrative Sections ──────────────────────────────────────────────────────
  const narratives = [
    { title: 'Psychic Number Meaning', content: numerology.psychicMeaning?.description, sub: numerology.psychicMeaning?.title },
    { title: 'Destiny Number Meaning', content: numerology.destinyMeaning?.description, sub: numerology.destinyMeaning?.title },
    { title: `${insight.sign} — Chinese Zodiac Profile`, content: insight.signData?.description },
  ];

  narratives.forEach(n => {
    if (n.content) {
      sectionHeader(n.title);
      if (n.sub) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(n.sub, margin + 2, y);
        y += 6;
      }
      addWrappedText(n.content, margin + 2, contentW - 4, 8, SILVER);
      y += 6;
    }
  });

  // ── Lo Shu Grid ─────────────────────────────────────────────────────────────
  checkPageBreak(65);
  sectionHeader('✦ Lo Shu Grid');
  const cellSize = 16;
  const gridW = cellSize * 3;
  const gx = pageW / 2 - gridW / 2;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = gx + col * cellSize, cy = y + row * cellSize;
      const val = numerology.loShuGrid?.[row]?.[col];
      const isEmpty = !val;
      doc.setFillColor(isEmpty ? 8 : 22, isEmpty ? 4 : 10, isEmpty ? 22 : 58);
      doc.roundedRect(cx, cy, cellSize - 1, cellSize - 1, 1.5, 1.5, 'F');
      doc.setDrawColor(isEmpty ? 30 : GOLD_DIM[0], isEmpty ? 12 : GOLD_DIM[1], isEmpty ? 60 : GOLD_DIM[2]);
      doc.setLineWidth(isEmpty ? 0.2 : 0.4);
      doc.roundedRect(cx, cy, cellSize - 1, cellSize - 1, 1.5, 1.5, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(isEmpty ? 8 : 12);
      doc.setTextColor(isEmpty ? 40 : GOLD[0], isEmpty ? 20 : GOLD[1], isEmpty ? 80 : GOLD[2]);
      doc.text(val || '·', cx + (cellSize - 1) / 2, cy + (cellSize - 1) / 2 + 2, { align: 'center' });
    }
  }
  y += gridW + 8;

  // ── Arrows of Strength/Weakness ──────────────────────────────────────────────
  const arrows = [
    ...(numerology.arrowsOfStrength || []).map(a => ({ ...a, type: 'strength' })),
    ...(numerology.arrowsOfWeakness || []).map(a => ({ ...a, type: 'weakness' })),
  ];

  if (arrows.length > 0) {
    sectionHeader('✦ Arrows of Influence');
    arrows.forEach(arrow => {
      const isStr = arrow.type === 'strength';
      const color = isStr ? GREEN : RED;
      const bgColor = isStr ? [20, 45, 30] : [45, 20, 25];
      
      checkPageBreak(25);
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(`${arrow.name.toUpperCase()}  [${arrow.numbers.join('-')}]`, margin + 4, y + 5.5);
      y += 11;
      addWrappedText(arrow.description, margin + 4, contentW - 8, 7.5, SILVER);
      y += 6;
    });
  }

  // ── Personal Year Forecast ───────────────────────────────────────────────────
  const pyears = (numerology.personalYears || []);
  if (pyears.length > 0) {
    sectionHeader('✦ Personal Year Forecast');
    pyears.forEach((py) => {
      const isCurrent = new Date().getFullYear() === py.year;
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.setTextColor(isCurrent ? GOLD[0] : WHITE[0], isCurrent ? GOLD[1] : WHITE[1], isCurrent ? GOLD[2] : WHITE[2]);
      doc.text(`${py.year} — Personal Year ${py.pyn}${isCurrent ? ' (Current)' : ''}`, margin + 2, y);
      y += 5;
      addWrappedText(py.meaning, margin + 2, contentW - 4, 8, SILVER);
      y += 6;
    });
  }

  // ── Psychomatrix Analysis ───────────────────────────────────────────────────
  try {
    const pmx = calculatePsychomatrix(numerology.birthDay, numerology.birthMonth, numerology.birthYear);
    const psychomatrixReport = createPersonalizedPsychomatrixReport(pmx);
    const contradictions = detectContradictions(psychomatrixReport.lines, psychomatrixReport.intersections);
    const recommendations = generateRecommendations(psychomatrixReport, numerology, contradictions);
    const dominance = detectDominanceHierarchy(psychomatrixReport.lines);

    sectionHeader('✦ Psychic Architecture Ranking');
    dominance.rankedElements.forEach((entry, i) => {
      checkPageBreak(15);
      const isTop = i < 3;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
      doc.setTextColor(isTop ? GOLD[0] : SILVER_DIM[0], isTop ? GOLD[1] : SILVER_DIM[1], isTop ? GOLD[2] : SILVER_DIM[2]);
      doc.text(`${i + 1}. ${entry.element.toUpperCase()}`, margin + 2, y);
      y += 4.5;
      addWrappedText(entry.description, margin + 2, contentW - 4, 7.5, SILVER);
      y += 5;
    });

    sectionHeader('✦ Life-Domain Grid Insights');
    const domains = ['career','money','relationships','health','spirituality','leadership','stress'];
    domains.forEach(domain => {
      const narratives: string[] = [];
      for (const line of psychomatrixReport.lines) {
        const n = getDomainNarrative(line.id, line.strengthCategory, domain, ALL_DOMAIN_BANKS);
        if (n) narratives.push(n);
      }
      if (narratives.length === 0) return;
      
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text(domain.toUpperCase(), margin + 2, y);
      y += 5;
      addWrappedText(narratives.join(' '), margin + 2, contentW - 4, 8, SILVER);
      y += 7;
    });

    if (contradictions.length > 0) {
      sectionHeader('✦ Creative Tensions');
      contradictions.forEach((c, idx) => {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.setTextColor(RED[0], RED[1], RED[2]);
        doc.text(`${idx + 1}. ${c.name}`, margin + 2, y);
        y += 5;
        doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5);
        doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
        addWrappedText(c.description, margin + 2, contentW - 4, 7.5, SILVER_DIM, 'italic');
        y += 2;
        addWrappedText(`Pattern: ${c.pattern}`, margin + 2, contentW - 4, 7.5, SILVER);
        addWrappedText(`Reading: ${c.deepReading}`, margin + 2, contentW - 4, 8, SILVER);
        
        checkPageBreak(12);
        doc.setFillColor(10, 28, 20);
        doc.roundedRect(margin, y, contentW, 6, 1, 1, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
        doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
        doc.text('RESOLUTION:', margin + 3, y + 4.2);
        y += 9;
        addWrappedText(c.resolution, margin + 2, contentW - 4, 7.5, [180, 240, 210]);
        y += 6;
      });
    }

    if (recommendations.length > 0) {
      sectionHeader('✦ Consultant Recommendations');
      recommendations.forEach((r, idx) => {
        checkPageBreak(20);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(`${idx + 1}. ${r.title}`, margin + 2, y);
        y += 5;
        addWrappedText(r.text, margin + 2, contentW - 4, 8, SILVER);
        y += 4;
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
        doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.text('PRACTICE:', margin + 2, y);
        y += 4;
        addWrappedText(r.practice, margin + 2, contentW - 4, 7.5, [210, 185, 100], 'italic');
        y += 6;
      });
    }

    // ── Deep Synthesis ───────────────────────────────────────────────────────
    const synthesis = computeSynthesis(numerology, insight);
    if (synthesis) {
      sectionHeader('✦ Deep Synthesis Insights');
      const sections = [
        { title: 'Decan Interpretation', data: synthesis.decan?.interpretation },
        { title: 'Double Animal', data: synthesis.doubleAnimal?.isDouble ? synthesis.doubleAnimal.interpretation : null },
        { title: 'Sexagenary Analysis', data: synthesis.sexagenary?.interpretation },
        { title: 'Heavenly Stem', data: synthesis.heavenlyStem?.interpretation },
        { title: 'Earthly Branch', data: synthesis.earthlyBranch?.interpretation },
        { title: 'Zodiac Relationships', data: synthesis.zodiacRelationships?.interpretation },
        { title: 'Birth Day of Week', data: synthesis.birthDayOfWeek?.interpretation },
        { title: 'Karmic Fate Null Meaning', data: synthesis.karmicFateNullMeaning },
        { title: 'Compound Personalized Insight', data: synthesis.compoundPersonalizedInsight },
        { title: 'Personal Year Customized', data: synthesis.personalYearCustomized },
      ];

      sections.forEach(s => {
        if (s.data) {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
          doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
          doc.text(s.title.toUpperCase(), margin + 2, y);
          y += 5;
          addWrappedText(s.data, margin + 2, contentW - 4, 8, SILVER);
          y += 7;
        }
      });
    }

  } catch (e) {
    console.warn('PDF: Psychomatrix sections skipped', e);
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text('Mystique Compass  ·  Cosmic Profile Report', pageW / 2, pageH - 10, { align: 'center' });
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 10, { align: 'right' });
  }

  const safeName = insight.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`mystique-${safeName}.pdf`);
}

// ─── Button Component ─────────────────────────────────────────────────────────

export function PdfExportButton({ insight, numerology }: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try { await generatePdf(insight, numerology); }
    catch (err) { console.error('PDF export failed', err); }
    finally { setLoading(false); }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Download Full PDF Report"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: loading ? 'rgba(138,111,24,0.15)' : 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(138,92,246,0.15))',
        border: '1px solid rgba(212,175,55,0.4)', borderRadius: '12px',
        padding: '10px 20px',
        color: loading ? 'rgba(212,175,55,0.5)' : '#d4af37',
        fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.25em',
        textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: loading ? 'none' : '0 4px 20px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Generating Full Report…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
          Save Full PDF
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
