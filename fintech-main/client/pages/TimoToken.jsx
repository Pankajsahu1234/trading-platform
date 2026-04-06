import React, { useEffect, useState, useRef } from 'react'

/* ── SVG Icons ── */
const IconBolt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
)
const IconTrend = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const FEATURES = [
  { Icon: IconBolt,   title: 'Lightning Fast', desc: 'Ultra-low latency on next-gen blockchain'    },
  { Icon: IconShield, title: 'Secure Vault',   desc: 'Military-grade encryption for every token'   },
  { Icon: IconTrend,  title: 'High Yield',     desc: 'Earn passive income through staking rewards' },
  { Icon: IconGlobe,  title: 'Global Access',  desc: 'Cross-chain interoperability worldwide'      },
]

export default function TimoTokenComingSoon() {
  const [hovCard, setHovCard] = useState(null)
  const [glowOn,  setGlowOn]  = useState(false)

  useEffect(() => {
    const id = setInterval(() => setGlowOn(p => !p), 2200)
    return () => clearInterval(id)
  }, [])

  const glowShadow = glowOn
    ? '0 0 36px rgba(212,175,55,0.50), 0 0 72px rgba(212,175,55,0.18)'
    : '0 0 16px rgba(212,175,55,0.20)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes ttFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ttPulse {
          0%,100% { transform: scale(1);    }
          50%     { transform: scale(1.07); }
        }
        .tt-card {
          transition: all 0.25s ease;
        }
        .tt-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
        }
        @media (max-width: 560px) {
          .tt-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Glassy section wrapper ── */
        .tt-glass-section {
          width: 100%;
          border-radius: 20px;
          padding: 24px 20px;
          /* multi-layer glass effect */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(212, 175, 55, 0.04) 50%,
            rgba(255, 255, 255, 0.03) 100%
          );
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(212, 175, 55, 0.18);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.30),
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 -1px 0 rgba(212,175,55,0.08) inset;
          position: relative;
          overflow: hidden;
        }

        /* subtle top-edge shimmer line */
        .tt-glass-section::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent);
        }

        /* subtle bottom glow */
        .tt-glass-section::after {
          content: '';
          position: absolute;
          bottom: -30px; left: 20%; right: 20%;
          height: 60px;
          background: radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <main
        className="p-6 lg:p-10 lg:ml-64 min-h-screen"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
          animation: 'ttFadeUp 0.75s ease both',
        }}>

          {/* Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(212,175,55,0.35)',
            borderRadius: 999,
            padding: '6px 16px',
            color: '#D4AF37',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '2.5px', textTransform: 'uppercase',
            background: 'rgba(212,175,55,0.06)',
          }}>
            <IconClock /> Launching Soon
          </span>

          {/* Coin icon */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'rgba(212,175,55,0.08)',
            border: '1.5px solid rgba(212,175,55,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: glowShadow,
            transition: 'box-shadow 1.6s ease',
            animation: 'ttPulse 3s ease-in-out infinite',
          }}>
            <svg width="38" height="38" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="23" stroke="#D4AF37" strokeWidth="2" opacity="0.35"/>
              <circle cx="26" cy="26" r="16" stroke="#D4AF37" strokeWidth="1.5" opacity="0.55"/>
              <text x="26" y="33" textAnchor="middle" fontSize="20"
                fill="#D4AF37" fontFamily="serif" fontWeight="bold">T</text>
            </svg>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 5.5vw, 66px)',
            fontWeight: 800, lineHeight: 1.05,
            margin: 0, letterSpacing: '-1.5px',
          }}>
            <span style={{ color: 'var(--foreground, #fff)' }}>Timo</span>{' '}
            <span style={{ color: '#D4AF37' }}>Token</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--muted-foreground, rgba(255,255,255,0.50))',
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            lineHeight: 1.75, maxWidth: 400, margin: 0,
          }}>
            The future of decentralized investment powered by intelligence,
            secured by blockchain.
          </p>

          {/* Coming soon dots */}
          <p style={{
            color: '#D4AF37', fontSize: 20, fontWeight: 700,
            letterSpacing: '4px', textTransform: 'uppercase',
            margin: 0, opacity: 0.80,
          }}>
            · · · Coming Soon · · ·
          </p>

          {/* Divider */}
          <div style={{
            width: '50%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.40),transparent)',
          }}/>

          {/* ── Feature cards ── */}
          <div className="tt-grid">
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="tt-card"
                  onMouseEnter={() => setHovCard(i)}
                  onMouseLeave={() => setHovCard(null)}
                  style={{
                    borderRadius: 13,
                    padding: '18px 12px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', textAlign: 'center',
                    backdropFilter: 'blur(8px)',
                    background: hovCard === i
                      ? 'rgba(212,175,55,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${hovCard === i
                      ? 'rgba(212,175,55,0.45)'
                      : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: hovCard === i
                      ? '0 8px 28px rgba(0,0,0,0.30), 0 0 0 1px rgba(212,175,55,0.10) inset'
                      : 'none',
                    transform: hovCard === i ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                >
                  <div style={{
                    color: '#D4AF37', marginBottom: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon />
                  </div>
                  <div style={{
                    color: 'var(--card-foreground, #fff)',
                    fontSize: 12, fontWeight: 700, marginBottom: 5,
                  }}>
                    {title}
                  </div>
                  <div style={{
                    color: 'var(--muted-foreground, rgba(255,255,255,0.42))',
                    fontSize: 11, lineHeight: 1.6,
                  }}>
                    {desc}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <p style={{
            color: 'var(--muted-foreground, rgba(255,255,255,0.22))',
            fontSize: 11, letterSpacing: '0.3px', margin: 0,
          }}>
            Timofx · Professional Investment Platform ·{' '}
            <span style={{ color: '#D4AF37' }}>Token launch coming</span>
          </p>

        </div>
      </main>
    </>
  )
}