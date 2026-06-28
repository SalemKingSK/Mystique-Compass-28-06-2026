import React, { useState } from 'react';
import type { AstroInsightOutput, NumerologyData } from './types';
import { calculatePsychomatrix } from '@/lib/numerology/data/psychomatrixData';
import { createPersonalizedPsychomatrixReport } from '@/lib/numerology/psychomatrix-synthesis';
import { detectContradictions } from '@/lib/numerology/synthesis/contradiction-engine';
import { generateRecommendations } from '@/lib/numerology/synthesis/recommendation-engine';
import { detectDominanceHierarchy } from '@/lib/numerology/synthesis/dominance-hierarchy-engine';
import { getDomainNarrative, ALL_DOMAIN_BANKS } from '@/lib/numerology/synthesis/life-domain-narrative-banks';

interface PdfExportButtonProps {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}

// ─── jsPDF helpers ────────────────────────────────────────────────────────────

function addWrappedText(doc: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines: string[] = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string) => { doc.text(line, x, y); y += lineHeight; });
  return y;
}

function drawHRule(doc: any, y: number, margin: number, pageW: number, color: number[]): number {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  return y + 4;
}

function sectionHeader(doc: any, label: string, y: number, margin: number, pageW: number): number {
  doc.setFillColor(30, 14, 72);
  doc.roundedRect(margin, y - 5, pageW - margin * 2, 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text(label.toUpperCase(), margin + 5, y + 2.5);
  return y + 12;
}

function subHeader(doc: any, label: string, y: number, margin: number, pageW: number, color: number[]): number {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.2);
  doc.line(margin, y, margin + 12, y);
  doc.line(pageW - margin - 12, y, pageW - margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(label.toUpperCase(), pageW / 2, y + 0.5, { align: 'center' });
  return y + 7;
}

// ─── Main PDF generator ───────────────────────────────────────────────────────

async function generatePdf(insight: AstroInsightOutput, numerology: NumerologyData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = 0;

  const VOID        = [5, 1, 14]       as [number, number, number];
  const GOLD        = [212, 175, 55]   as [number, number, number];
  const GOLD_DIM    = [138, 111, 24]   as [number, number, number];
  const SILVER      = [168, 184, 208]  as [number, number, number];
  const SILVER_DIM  = [86, 104, 126]   as [number, number, number];
  const WHITE       = [230, 220, 255]  as [number, number, number];
  const GREEN       = [77, 170, 120]   as [number, number, number];
  const GREEN_DIM   = [20, 50, 35]     as [number, number, number];
  const RED_DIM     = [50, 15, 25]     as [number, number, number];
  const RED         = [192, 90, 120]   as [number, number, number];
  const VIOLET      = [139, 92, 246]   as [number, number, number];
  const EMERALD     = [52, 211, 153]   as [number, number, number];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function newPage() {
    doc.addPage();
    doc.setFillColor(VOID[0], VOID[1], VOID[2]);
    doc.rect(0, 0, pageW, pageH, 'F');
    y = 18;
  }

  function ensurePage(needed: number) {
    if (y + needed > pageH - 20) newPage();
  }

  function bodyText(text: string, color: number[] = SILVER, size = 7.5, maxChars = 99999) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const t = text.slice(0, maxChars);
    y = addWrappedText(doc, t, margin + 3, y, contentW - 6, size * 0.55);
    y += 2;
  }

  function chip(label: string, value: string, cx: number, cy: number, w: number, h: number) {
    doc.setFillColor(18, 8, 50);
    doc.roundedRect(cx, cy, w, h, 2, 2, 'F');
    doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
    doc.setLineWidth(0.25);
    doc.roundedRect(cx, cy, w, h, 2, 2, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(label.toUpperCase(), cx + w / 2, cy + 5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(String(value), cx + w / 2, cy + 14, { align: 'center' });
  }

  // ── Cover page ──────────────────────────────────────────────────────────────
  doc.setFillColor(VOID[0], VOID[1], VOID[2]);
  doc.rect(0, 0, pageW, pageH, 'F');

  // decorative glow blobs
  doc.setGState(doc.GState({ opacity: 0.10 }));
  doc.setFillColor(124, 58, 237);
  doc.ellipse(40, 30, 70, 50, 'F');
  doc.setFillColor(212, 175, 55);
  doc.ellipse(pageW - 30, pageH - 40, 60, 45, 'F');
  doc.setGState(doc.GState({ opacity: 1 }));

  y = 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text('MYSTIQUE COMPASS', pageW / 2, y, { align: 'center' });
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
  doc.text('C O S M I C   P R O F I L E   R E P O R T', pageW / 2, y, { align: 'center' });
  y += 5;
  drawHRule(doc, y, margin, pageW, GOLD_DIM);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text(insight.name, pageW / 2, y, { align: 'center' });
  y += 6;
  const bday = `${numerology.birthDay} ${monthNames[numerology.birthMonth - 1]} ${numerology.birthYear}`;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
  doc.text(`Born  ${bday}   ·   ${insight.gender.charAt(0).toUpperCase() + insight.gender.slice(1)}`, pageW / 2, y, { align: 'center' });
  y += 3;
  drawHRule(doc, y, margin, pageW, GOLD_DIM);
  y += 6;

  // ── Core Numbers ────────────────────────────────────────────────────────────
  y = sectionHeader(doc, '✦  Core Cosmic Numbers', y, margin, pageW);
  y += 2;
  const chipW = (contentW - 6) / 4;
  const coreNums = [
    { label: 'Psychic Number', value: String(numerology.psycheNum), sub: numerology.psychicMeaning?.title || '' },
    { label: 'Destiny Number', value: String(numerology.destinyNum), sub: numerology.destinyMeaning?.title || '' },
    { label: 'Karmic Fate',    value: String(numerology.karmicFateNum ?? '—'), sub: '' },
    { label: 'Kua Number',     value: String(numerology.kuaNum ?? '—'), sub: numerology.kuaAttributes?.element || '' },
  ];
  coreNums.forEach((n, i) => { chip(n.label, n.value, margin + i * (chipW + 2), y, chipW, 22); });
  y += 28;

  // ── Astrology ───────────────────────────────────────────────────────────────
  y = sectionHeader(doc, '✦  Astrology & Zodiac', y, margin, pageW);
  y += 2;
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
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text(label.toUpperCase(), ax + 4, ay + 4.5);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
    doc.text(value || '—', ax + halfW - 4, ay + 6.5, { align: 'right' });
  });
  y += 26;

  // ── Psychic Number ──────────────────────────────────────────────────────────
  if (numerology.psychicMeaning?.description) {
    ensurePage(40);
    y = sectionHeader(doc, '✦  Psychic Number Meaning', y, margin, pageW);
    y += 2;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(numerology.psychicMeaning.title, margin + 3, y); y += 5;
    bodyText(numerology.psychicMeaning.description.slice(0, 800));
  }

  // ── Destiny Number ──────────────────────────────────────────────────────────
  if (numerology.destinyMeaning?.description) {
    ensurePage(40);
    y = sectionHeader(doc, '✦  Destiny Number Meaning', y, margin, pageW);
    y += 2;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(numerology.destinyMeaning.title, margin + 3, y); y += 5;
    bodyText(numerology.destinyMeaning.description.slice(0, 800));
  }

  // ── Lo Shu Grid ─────────────────────────────────────────────────────────────
  ensurePage(55);
  y = sectionHeader(doc, '✦  Lo Shu Grid', y, margin, pageW);
  y += 3;
  const cellSize = 14;
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
      doc.setFont('helvetica', 'bold'); doc.setFontSize(isEmpty ? 7 : 10);
      doc.setTextColor(isEmpty ? 40 : GOLD[0], isEmpty ? 20 : GOLD[1], isEmpty ? 80 : GOLD[2]);
      doc.text(val || '·', cx + (cellSize - 1) / 2, cy + (cellSize - 1) / 2 + 1.5, { align: 'center' });
    }
  }
  y += gridW + 6;

  // ── Kua Attributes ──────────────────────────────────────────────────────────
  const kuaColors = numerology.kuaAttributes?.lucky_colours || [];
  if (kuaColors.length > 0) {
    ensurePage(28);
    y = sectionHeader(doc, '✦  Kua Attributes', y, margin, pageW);
    y += 2;
    if (numerology.kuaAttributes?.element) { bodyText(`Element: ${numerology.kuaAttributes.element}`, SILVER, 7.5); }
    if (numerology.kuaAttributes?.season)  { bodyText(`Season: ${numerology.kuaAttributes.season}`, SILVER, 7.5); }
    if (kuaColors.length > 0) { bodyText(`Lucky Colours: ${kuaColors.join(', ')}`, SILVER, 7.5); }
    const dirs = numerology.kuaAttributes?.directions || {};
    const dirKeys = Object.keys(dirs).slice(0, 4);
    if (dirKeys.length > 0) { bodyText(`Best Directions: ${dirKeys.map(k => `${k} (${dirs[k]})`).join(' · ')}`, SILVER, 7.5); }
  }

  // ── Arrows of Strength ──────────────────────────────────────────────────────
  const strengths = numerology.arrowsOfStrength || [];
  if (strengths.length > 0) {
    ensurePage(30);
    y = sectionHeader(doc, '✦  Arrows of Strength', y, margin, pageW);
    y += 2;
    strengths.forEach(arrow => {
      ensurePage(20);
      doc.setFillColor(GREEN_DIM[0], GREEN_DIM[1], GREEN_DIM[2]);
      doc.roundedRect(margin, y, contentW, 15, 1.5, 1.5, 'F');
      doc.setDrawColor(58, 120, 88); doc.setLineWidth(0.25);
      doc.roundedRect(margin, y, contentW, 15, 1.5, 1.5, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.text(`${arrow.name}  [${arrow.numbers.join('-')}]`, margin + 4, y + 5.5);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
      doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
      const desc = doc.splitTextToSize(arrow.description.slice(0, 220), contentW - 8);
      doc.text(desc[0] || '', margin + 4, y + 11);
      y += 18;
    });
  }

  // ── Arrows of Weakness ──────────────────────────────────────────────────────
  const weaknesses = numerology.arrowsOfWeakness || [];
  if (weaknesses.length > 0) {
    ensurePage(30);
    y = sectionHeader(doc, '✦  Arrows of Weakness', y, margin, pageW);
    y += 2;
    weaknesses.forEach(arrow => {
      ensurePage(20);
      doc.setFillColor(RED_DIM[0], RED_DIM[1], RED_DIM[2]);
      doc.roundedRect(margin, y, contentW, 15, 1.5, 1.5, 'F');
      doc.setDrawColor(192, 58, 90); doc.setLineWidth(0.25);
      doc.roundedRect(margin, y, contentW, 15, 1.5, 1.5, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.setTextColor(RED[0], RED[1], RED[2]);
      doc.text(`${arrow.name}  [${arrow.numbers.join('-')}]`, margin + 4, y + 5.5);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
      doc.setTextColor(SILVER[0], SILVER[1], SILVER[2]);
      const desc = doc.splitTextToSize(arrow.description.slice(0, 220), contentW - 8);
      doc.text(desc[0] || '', margin + 4, y + 11);
      y += 18;
    });
  }

  // ── Personal Year Forecast ───────────────────────────────────────────────────
  const pyears = (numerology.personalYears || []).slice(0, 10);
  if (pyears.length > 0) {
    ensurePage(50);
    y = sectionHeader(doc, '✦  Personal Year Forecast', y, margin, pageW);
    y += 2;
    const colW = (contentW - 2) / 5;
    pyears.forEach((py, i) => {
      ensurePage(24);
      const col = i % 5, row2 = Math.floor(i / 5);
      const px = margin + col * (colW + 0.5), py2 = y + row2 * 24;
      const isCurrent = new Date().getFullYear() === py.year;
      doc.setFillColor(isCurrent ? 28 : 14, isCurrent ? 18 : 8, isCurrent ? 68 : 40);
      doc.roundedRect(px, py2, colW, 22, 1.5, 1.5, 'F');
      doc.setDrawColor(isCurrent ? GOLD[0] : GOLD_DIM[0], isCurrent ? GOLD[1] : GOLD_DIM[1], isCurrent ? GOLD[2] : GOLD_DIM[2]);
      doc.setLineWidth(isCurrent ? 0.45 : 0.2);
      doc.roundedRect(px, py2, colW, 22, 1.5, 1.5, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
      doc.setTextColor(isCurrent ? GOLD[0] : SILVER_DIM[0], isCurrent ? GOLD[1] : SILVER_DIM[1], isCurrent ? GOLD[2] : SILVER_DIM[2]);
      doc.text(String(py.year), px + colW / 2, py2 + 5, { align: 'center' });
      doc.setFontSize(13); doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text(String(py.pyn), px + colW / 2, py2 + 13, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(5);
      doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
      const mLines = doc.splitTextToSize(py.meaning.slice(0, 30), colW - 2);
      doc.text(mLines[0] || '', px + colW / 2, py2 + 19, { align: 'center' });
    });
    y += Math.ceil(pyears.length / 5) * 24 + 4;
  }

  // ── Chinese Zodiac ───────────────────────────────────────────────────────────
  if (insight.signData?.description) {
    ensurePage(40);
    y = sectionHeader(doc, `✦  ${insight.sign} — Chinese Zodiac Profile`, y, margin, pageW);
    y += 2;
    bodyText(insight.signData.description.slice(0, 800));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PSYCHOMATRIX SYNTHESIS SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    const pmx = calculatePsychomatrix(numerology.birthDay, numerology.birthMonth, numerology.birthYear);
    const psychomatrixReport = createPersonalizedPsychomatrixReport(pmx);
    const contradictions = detectContradictions(psychomatrixReport.lines, psychomatrixReport.intersections);
    const recommendations = generateRecommendations(psychomatrixReport, numerology, contradictions);
    const dominance = detectDominanceHierarchy(psychomatrixReport.lines);

    // ── Priority Ranking ─────────────────────────────────────────────────────
    if (dominance.top3.length > 0) {
      newPage();
      y = sectionHeader(doc, '✦  Psychic Architecture — Priority Ranking', y, margin, pageW);
      y += 2;
      doc.setFont('helvetica', 'italic'); doc.setFontSize(7);
      doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
      doc.text('The forces ranked by actual influence on your life, from dominant engine to suppressed frontier.', margin + 3, y); y += 7;

      const rankColors = [
        { bg: [28, 18, 6] as [number,number,number], border: [138, 111, 24] as [number,number,number], label: GOLD },
        { bg: [14, 16, 22] as [number,number,number], border: [86, 104, 126] as [number,number,number], label: SILVER },
        { bg: [12, 12, 16] as [number,number,number], border: [60, 60, 70]   as [number,number,number], label: SILVER_DIM },
      ];

      dominance.top3.forEach((entry, i) => {
        ensurePage(28);
        const rc = rankColors[i];
        doc.setFillColor(rc.bg[0], rc.bg[1], rc.bg[2]);
        doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
        doc.setDrawColor(rc.border[0], rc.border[1], rc.border[2]); doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentW, 10, 2, 2, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
        doc.setTextColor(rc.label[0], rc.label[1], rc.label[2]);
        doc.text(`${i + 1}.  ${entry.element}`, margin + 5, y + 4);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
        doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
        doc.text(entry.description, margin + 5, y + 8.5);
        y += 13;
      });

      if (dominance.rankedElements.slice(-2).length > 0) {
        ensurePage(20);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
        doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
        doc.text('SUPPRESSED / FRONTIER — REQUIRE DELIBERATE CULTIVATION', margin + 3, y); y += 5;
        dominance.rankedElements.slice(-2).forEach(entry => {
          ensurePage(14);
          doc.setFillColor(10, 10, 16);
          doc.roundedRect(margin, y, contentW, 9, 1.5, 1.5, 'F');
          doc.setDrawColor(40, 40, 55); doc.setLineWidth(0.2);
          doc.roundedRect(margin, y, contentW, 9, 1.5, 1.5, 'S');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
          doc.setTextColor(80, 90, 110);
          doc.text(`○  ${entry.element}  —  ${entry.description}`, margin + 4, y + 5.5);
          y += 12;
        });
      }
    }

    // ── Life-Domain Grid Profile ─────────────────────────────────────────────
    const domains = ['career','money','relationships','health','spirituality','leadership','stress'];
    const domainLabels: Record<string, string> = {
      career: 'Career', money: 'Money', relationships: 'Relationships',
      health: 'Health', spirituality: 'Spirituality', leadership: 'Leadership', stress: 'Stress',
    };
    const domainColors: Record<string, [number,number,number]> = {
      career: [56, 189, 248], money: [52, 211, 153], relationships: [251, 113, 133],
      health: [251, 146, 60], spirituality: [167, 139, 250], leadership: [103, 232, 249], stress: [252, 165, 165],
    };

    newPage();
    y = sectionHeader(doc, '✦  Life-Domain Grid Profile', y, margin, pageW);
    y += 2;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(7);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text('How your exact digit configuration speaks into each life area — from the grid up.', margin + 3, y); y += 7;

    domains.forEach(domain => {
      const narratives: string[] = [];
      for (const line of psychomatrixReport.lines) {
        const n = getDomainNarrative(line.id, line.strengthCategory, domain, ALL_DOMAIN_BANKS);
        if (n) narratives.push(n);
      }
      if (narratives.length === 0) return;
      const combined = narratives.join(' ');
      const dc = domainColors[domain] || [168, 184, 208];
      ensurePage(30);
      // domain header bar
      doc.setFillColor(Math.round(dc[0]*0.12), Math.round(dc[1]*0.12), Math.round(dc[2]*0.12));
      doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F');
      doc.setDrawColor(Math.round(dc[0]*0.4), Math.round(dc[1]*0.4), Math.round(dc[2]*0.4));
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentW, 9, 2, 2, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
      doc.setTextColor(dc[0], dc[1], dc[2]);
      doc.text(`${domainLabels[domain].toUpperCase()} — GRID-DERIVED READING`, margin + 5, y + 5.5);
      y += 12;
      bodyText(combined.slice(0, 900), SILVER, 7);
      y += 2;
    });

    // ── Creative Tensions / Contradictions ───────────────────────────────────
    if (contradictions.length > 0) {
      newPage();
      y = sectionHeader(doc, `✦  Creative Tensions  (${contradictions.length} detected)`, y, margin, pageW);
      y += 2;
      doc.setFont('helvetica', 'italic'); doc.setFontSize(7);
      doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
      doc.text('Structural tensions unique to your grid — not flaws, but friction that produces growth when named.', margin + 3, y); y += 7;

      contradictions.forEach((c, idx) => {
        ensurePage(42);
        const dc = domainColors[c.domain] || [168, 184, 208];
        // title bar
        doc.setFillColor(Math.round(dc[0]*0.08), Math.round(dc[1]*0.08), Math.round(dc[2]*0.08));
        doc.roundedRect(margin, y, contentW, 11, 2, 2, 'F');
        doc.setDrawColor(Math.round(dc[0]*0.35), Math.round(dc[1]*0.35), Math.round(dc[2]*0.35));
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentW, 11, 2, 2, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
        doc.setTextColor(dc[0], dc[1], dc[2]);
        doc.text(`${idx + 1}.  ${c.name}`, margin + 5, y + 5);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
        doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
        doc.text(domainLabels[c.domain]?.toUpperCase() || c.domain.toUpperCase(), pageW - margin - 4, y + 5, { align: 'right' });
        doc.setFont('helvetica', 'italic'); doc.setFontSize(6.5);
        doc.text(c.description, margin + 5, y + 9.5);
        y += 14;

        // pattern
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6);
        doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.text('GRID PATTERN:', margin + 3, y); y += 4;
        bodyText(c.pattern, SILVER, 6.5);

        // deep reading
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6);
        doc.setTextColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]);
        doc.text('DEEP READING:', margin + 3, y); y += 4;
        bodyText(c.deepReading.slice(0, 700), SILVER, 7);

        // resolution
        ensurePage(22);
        doc.setFillColor(10, 28, 20);
        doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'F');
        doc.setDrawColor(EMERALD[0], EMERALD[1], EMERALD[2]); doc.setLineWidth(0.2);
        doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6);
        doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
        doc.text('RESOLUTION PATH:', margin + 4, y + 3.5);
        y += 10;
        bodyText(c.resolution.slice(0, 400), [180, 240, 210], 6.5);
        y += 4;
      });
    }

    // ── Consultant Recommendations ───────────────────────────────────────────
    if (recommendations.length > 0) {
      newPage();
      y = sectionHeader(doc, `✦  Consultant Recommendations  (${recommendations.length})`, y, margin, pageW);
      y += 2;
      doc.setFont('helvetica', 'italic'); doc.setFontSize(7);
      doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
      doc.text('Every recommendation traces to a specific digit count. Every practice is calibrated to your exact grid.', margin + 3, y); y += 7;

      recommendations.forEach((r, idx) => {
        ensurePage(40);
        const dc = domainColors[r.domain] || [168, 184, 208];
        doc.setFillColor(Math.round(dc[0]*0.07), Math.round(dc[1]*0.07), Math.round(dc[2]*0.07));
        doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
        doc.setDrawColor(Math.round(dc[0]*0.3), Math.round(dc[1]*0.3), Math.round(dc[2]*0.3));
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentW, 10, 2, 2, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
        doc.setTextColor(dc[0], dc[1], dc[2]);
        doc.text(`${idx + 1}.  ${r.title}`, margin + 5, y + 5);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
        doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
        doc.text(r.gridBasis, margin + 5, y + 9);
        y += 13;

        bodyText(r.text.slice(0, 600), SILVER, 7);

        // 30-day practice
        ensurePage(22);
        doc.setFillColor(22, 18, 8);
        doc.roundedRect(margin, y, contentW, 7, 1.5, 1.5, 'F');
        doc.setDrawColor(GOLD_DIM[0], GOLD_DIM[1], GOLD_DIM[2]); doc.setLineWidth(0.2);
        doc.roundedRect(margin, y, contentW, 7, 1.5, 1.5, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text('30-DAY PRACTICE:', margin + 4, y + 4.5);
        y += 9;
        bodyText(r.practice.slice(0, 400), [210, 185, 100], 6.5);
        y += 3;
      });
    }

  } catch (e) {
    console.warn('PDF: Psychomatrix synthesis section skipped due to error', e);
  }

  // ── Footer on every page ─────────────────────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
    doc.setTextColor(SILVER_DIM[0], SILVER_DIM[1], SILVER_DIM[2]);
    doc.text('Mystique Compass  ·  Cosmic Profile Report', pageW / 2, pageH - 8, { align: 'center' });
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' });
  }

  const safeName = insight.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`mystique-${safeName}.pdf`);
}

// ─── Button ───────────────────────────────────────────────────────────────────

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
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: loading ? 'rgba(138,111,24,0.15)' : 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(138,92,246,0.14))',
        border: '1px solid rgba(212,175,55,0.35)', borderRadius: '10px',
        padding: '8px 16px',
        color: loading ? 'rgba(212,175,55,0.5)' : '#d4af37',
        fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.2em',
        textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.25s', boxShadow: loading ? 'none' : '0 2px 16px rgba(212,175,55,0.12)',
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
          Save PDF
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
