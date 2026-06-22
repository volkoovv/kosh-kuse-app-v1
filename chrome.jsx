// chrome.jsx — Shared chrome: phone frame, top bar, bottom nav, status bar

const { useState, useEffect, useRef } = React;

// ─── Status bar (clone of Figma "Status bar - iPhone" component, simplified)
function KKStatus({ dark = false }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'flex-end',
      padding: '0 24px 6px', justifyContent: 'space-between',
      background: 'transparent', position: 'relative', zIndex: 30,
      flexShrink: 0,
    }}>
      <span style={{
        fontSize: 14, fontWeight: 600, color: c,
        fontFamily: '-apple-system, "SF Pro", system-ui',
      }}>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="6" width="3" height="5" rx="0.6" fill={c}/><rect x="4.5" y="4" width="3" height="7" rx="0.6" fill={c}/><rect x="9" y="2" width="3" height="9" rx="0.6" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 3a8 8 0 015.5 2L14 4a9.5 9.5 0 00-13 0l1 1a8 8 0 015.5-2zM7.5 6a5 5 0 013 1L11.5 6a6.5 6.5 0 00-8 0L4.5 7a5 5 0 013-1z" fill={c}/><circle cx="7.5" cy="9.5" r="1.3" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={c} strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/><path d="M22 4v3a1.3 1.3 0 000-3z" fill={c} opacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ─── Top bar (matches Figma Header pattern: back, title, action)
function KKTopBar({ left, title, right, onBack, sticky = false }) {
  return (
    <div className="kk-topbar" style={sticky ? { position: 'sticky', top: 0 } : {}}>
      <div style={{ width: 70, display: 'flex', alignItems: 'center' }}>
        {onBack ? (
          <button className="kk-topbar-back" onClick={onBack}>← {left || 'Назад'}</button>
        ) : (left || null)}
      </div>
      <div className="kk-topbar-title">{title}</div>
      <div style={{ width: 70, display: 'flex', justifyContent: 'flex-end' }}>
        {right || null}
      </div>
    </div>
  );
}

// ─── Bottom navigation (V1 tabs: Главная · Чат · Питомец · Настройки)
function KKBottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home',     label: 'Главная',  Icon: IconHome },
    { id: 'chat',     label: 'Кусь',     Icon: IconChat },
    { id: 'kb',       label: 'База',     Icon: IconBook },
    { id: 'pet',      label: 'Питомец',  Icon: IconCat },
    { id: 'settings', label: 'Профиль',  Icon: IconUser },
  ];
  return (
    <div className="kk-bottomnav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`kk-tab ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <div className="kk-tab-icon">
            <t.Icon size={20} color="currentColor" />
          </div>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── KK wordmark with paw mark
function KKWordmark({ size = 'sm' }) {
  const big = size === 'lg';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: big ? 10 : 6 }}>
      <span style={{
        width: big ? 30 : 18, height: big ? 30 : 18, borderRadius: '50%',
        background: 'var(--kk-pink)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconPaw size={big ? 18 : 11} color="#000" />
      </span>
      <span className="kk-wordmark" style={{ fontSize: big ? 22 : 13, letterSpacing: big ? 1 : 0.6, whiteSpace: 'nowrap' }}>
        KOSH KUSE
      </span>
    </div>
  );
}

// ─── App stage: scales the 390×844 viewport to fit the user's window.
// On a real phone (≤480px) the mockup frame would overflow ("phone in a
// phone"), so we render full-bleed there and keep the bezel only on desktop.
function KKDeviceStage({ children }) {
  const W = 390, H = 844;
  const isPhone = typeof window !== 'undefined'
    && window.matchMedia && window.matchMedia('(max-width: 480px)').matches;

  if (isPhone) {
    // Full-bleed: fill the locked viewport box (#root). Height is driven by
    // the fixed #root in styles.css, not 100dvh — avoids the dvh/address-bar
    // mismatch that let the whole frame drift on scroll.
    return (
      <div style={{
        width: '100%', height: '100%',
        background: '#FFF', position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--kk-font)',
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      width: W, height: H,
      borderRadius: 44, overflow: 'hidden',
      background: '#FFF',
      boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 10px #1a1a1c, 0 0 0 11px #2a2a2c',
      position: 'relative',
      fontFamily: 'var(--kk-font)',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 32, borderRadius: 22, background: '#000', zIndex: 50,
      }} />
      {children}
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 22, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 7, pointerEvents: 'none', zIndex: 80,
      }}>
        <div style={{ width: 134, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.32)' }} />
      </div>
    </div>
  );
}

Object.assign(window, {
  KKStatus, KKTopBar, KKBottomNav, KKWordmark, KKDeviceStage, KKSheet, KKToast,
});

/* ─── Generic info / coming-soon / confirm sheet ─── */
function KKSheet({ title, body, icon, iconBg, primaryLabel, onPrimary, secondaryLabel, onSecondary, onClose, items, danger }) {
  return (
    <div className="kk-modal-bg" onClick={onClose}>
      <div className="kk-sheet" onClick={e => e.stopPropagation()}>
        <div className="kk-sheet-handle"/>
        {icon && (
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            background: iconBg || 'var(--kk-pink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>{icon}</div>
        )}
        {title && (
          <h2 style={{
            fontSize: 19, fontWeight: 700, margin: '0 0 8px',
            textAlign: icon ? 'center' : 'left',
          }} dangerouslySetInnerHTML={{ __html: title }}/>
        )}
        {body && (
          <p style={{
            fontSize: 13, color: 'var(--kk-ink-3)',
            textAlign: icon ? 'center' : 'left',
            margin: '0 0 22px', lineHeight: 1.5,
          }} dangerouslySetInnerHTML={{ __html: body }}/>
        )}
        {items && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => { it.onClick && it.onClick(); onClose && onClose(); }}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--kk-bg-soft)', border: 0,
                  borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
                  textAlign: 'left',
                }}
              >
                {it.icon && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{it.icon}</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{ __html: it.title }}/>
                  {it.sub && <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: it.sub }}/>}
                </div>
                <IconChevron size={16} color="var(--kk-ink-4)"/>
              </button>
            ))}
          </div>
        )}
        {primaryLabel && (
          <button
            className="kk-btn"
            style={{
              background: danger ? 'var(--kk-error-ink)' : 'var(--kk-ink)',
              color: '#fff',
            }}
            onClick={() => { onPrimary && onPrimary(); onClose && onClose(); }}
          >{primaryLabel}</button>
        )}
        {secondaryLabel && (
          <button
            className="kk-btn kk-btn-ghost"
            style={{ marginTop: 4 }}
            onClick={() => { onSecondary && onSecondary(); onClose && onClose(); }}
          >{secondaryLabel}</button>
        )}
      </div>
    </div>
  );
}

/* ─── Inline toast ─── */
function KKToast({ message, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: 16, right: 16, zIndex: 90,
      background: 'rgba(0,0,0,0.92)', color: '#fff',
      padding: '12px 16px', borderRadius: 12,
      fontSize: 13, textAlign: 'center',
      animation: 'kk-fade-in .2s ease',
      backdropFilter: 'blur(8px)',
    }} dangerouslySetInnerHTML={{ __html: message }}/>
  );
}
