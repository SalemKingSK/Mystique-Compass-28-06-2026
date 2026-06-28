import React, { useEffect, useRef } from 'react';

interface Props {
  text: string;
  activeSentenceIndex: number;
  sentences: string[];
}

// ─── Inline formatter: **bold** and ==highlight== ─────────────────────────────

function renderInline(raw: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|==([^=]+)==)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > last) {
      parts.push(<React.Fragment key={key++}>{raw.slice(last, match.index)}</React.Fragment>);
    }
    if (match[0].startsWith('**')) {
      parts.push(
        <strong key={key++} style={{ color: '#e2c97e', fontWeight: 700 }}>
          {match[2]}
        </strong>
      );
    } else {
      parts.push(
        <span key={key++} style={{ color: '#c4b5fd', fontStyle: 'italic', fontWeight: 600 }}>
          {match[3]}
        </span>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < raw.length) {
    parts.push(<React.Fragment key={key++}>{raw.slice(last)}</React.Fragment>);
  }
  return <>{parts}</>;
}

// ─── Sentence classifier ──────────────────────────────────────────────────────

type SentenceKind =
  | 'heading'       // ### ...
  | 'subheading'    // known label lines ending in :
  | 'compound-header' // "15/6 — The Enchantment"
  | 'divider'       // ---
  | 'bullet'        // * ...
  | 'empty'
  | 'body';

const SUBHEADING_RE =
  /^(Symbolism|Vibrational Essence|Karmic Dynamics|Manifestation Patterns|Single-Digit Interpretation[^:]*|The Core Reality|The Demands and The Traps|The Impact of Timing|The Silver Lining[^:]*|The Ultimate Harvest|The Ultimate Verdict|The Defect and The Traps|The Gift[^:]*):/i;

function classify(sentence: string): SentenceKind {
  const t = sentence.trim();
  if (!t || t === '') return 'empty';
  if (/^---+$/.test(t)) return 'divider';
  if (/^###\s/.test(t)) return 'heading';
  if (/^\*\s/.test(t)) return 'bullet';
  if (SUBHEADING_RE.test(t)) return 'subheading';
  if (/^[0-9]+\/[0-9]+\s*[—–-]/.test(t)) return 'compound-header';
  return 'body';
}

// ─── Main component ───────────────────────────────────────────────────────────

export const ScrollableTextDisplay: React.FC<Props> = ({
  text,
  activeSentenceIndex,
  sentences,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    sentenceRefs.current = sentenceRefs.current.slice(0, sentences.length);
  }, [sentences]);

  useEffect(() => {
    if (activeSentenceIndex >= 0 && sentenceRefs.current[activeSentenceIndex]) {
      sentenceRefs.current[activeSentenceIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSentenceIndex]);

  if (!text) return null;

  return (
    <div
      ref={containerRef}
      style={{ lineHeight: 1.75, paddingBottom: '0.5rem' }}
    >
      {sentences.map((sentence, idx) => {
        const trimmed = sentence.trim();
        const kind = classify(trimmed);
        const isActive = idx === activeSentenceIndex;

        const activeWrap: React.CSSProperties = isActive
          ? {
              background: 'rgba(212,175,55,0.1)',
              borderRadius: 4,
              outline: '1px solid rgba(212,175,55,0.18)',
            }
          : {};

        const setRef = (el: HTMLElement | null) => {
          sentenceRefs.current[idx] = el;
        };

        // ── Heading (### ...) ──────────────────────────────────────────────
        if (kind === 'heading') {
          const clean = trimmed
            .replace(/^###\s+/, '')
            .replace(/^\*\*/, '')
            .replace(/\*\*$/, '');
          return (
            <div
              key={idx}
              ref={setRef}
              style={{
                ...activeWrap,
                fontFamily: "'Cinzel', serif",
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#d4af37',
                fontWeight: 700,
                marginTop: '1.4rem',
                marginBottom: '0.45rem',
                paddingBottom: '0.3rem',
                borderBottom: '1px solid rgba(212,175,55,0.22)',
              }}
            >
              {renderInline(clean)}
            </div>
          );
        }

        // ── Subheading (label lines) ───────────────────────────────────────
        if (kind === 'subheading') {
          const colonIdx = trimmed.indexOf(':');
          const label = trimmed.slice(0, colonIdx);
          const rest = trimmed.slice(colonIdx + 1).trim();
          return (
            <div
              key={idx}
              ref={setRef}
              style={{
                ...activeWrap,
                marginTop: '1rem',
                marginBottom: '0.35rem',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.63rem',
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: '#a78bfa',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: rest ? '0.25rem' : 0,
                }}
              >
                {label}
              </span>
              {rest && (
                <span
                  style={{
                    fontSize: '0.81rem',
                    color: 'rgba(220,210,255,0.82)',
                    lineHeight: 1.75,
                  }}
                >
                  {renderInline(rest)}
                </span>
              )}
            </div>
          );
        }

        // ── Compound header (e.g. "15/6 — The Enchantment") ───────────────
        if (kind === 'compound-header') {
          return (
            <div
              key={idx}
              ref={setRef}
              style={{
                ...activeWrap,
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                color: '#d4af37',
                letterSpacing: '0.08em',
                marginBottom: '0.6rem',
                fontWeight: 600,
              }}
            >
              {renderInline(trimmed)}
            </div>
          );
        }

        // ── Divider (---) ──────────────────────────────────────────────────
        if (kind === 'divider') {
          return (
            <div
              key={idx}
              ref={setRef}
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)',
                margin: '1.2rem 0',
              }}
            />
          );
        }

        // ── Empty line ─────────────────────────────────────────────────────
        if (kind === 'empty') {
          return (
            <div key={idx} ref={setRef} style={{ height: '0.5rem' }} />
          );
        }

        // ── Bullet (* ...) ────────────────────────────────────────────────
        if (kind === 'bullet') {
          const bulletText = trimmed.replace(/^\*\s+/, '');
          return (
            <div
              key={idx}
              ref={setRef}
              style={{
                ...activeWrap,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.55rem',
                marginBottom: '0.55rem',
                paddingLeft: '0.25rem',
              }}
            >
              <span
                style={{
                  color: '#a78bfa',
                  fontSize: '0.5rem',
                  marginTop: '0.45rem',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                ◆
              </span>
              <span
                style={{
                  fontSize: '0.81rem',
                  color: 'rgba(220,210,255,0.85)',
                  lineHeight: 1.75,
                }}
              >
                {renderInline(bulletText)}
              </span>
            </div>
          );
        }

        // ── Body / regular sentence ────────────────────────────────────────
        return (
          <span
            key={idx}
            ref={setRef}
            style={{
              ...activeWrap,
              fontSize: '0.81rem',
              color: 'rgba(220,210,255,0.8)',
              lineHeight: 1.75,
              display: 'inline',
            }}
          >
            {renderInline(trimmed)}{' '}
          </span>
        );
      })}
    </div>
  );
};
