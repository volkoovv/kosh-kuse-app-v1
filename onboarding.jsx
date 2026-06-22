// onboarding.jsx — Splash / waitlist / phone / SMS / welcome

const { useState: useStateOnb, useEffect: useEffectOnb, useRef: useRefOnb } = React;

/* ─── Splash with brand mark + paw-print walking animation ─── */
function SplashScreen({ onPrimary, onLogin }) {
  // generate paw walk positions
  const paws = [];
  for (let i = 0; i < 8; i++) {
    paws.push({
      key: i,
      left: 30 + (i % 2) * 22,
      top: 600 - i * 40,
      rot: i % 2 === 0 ? -18 : 18,
      delay: i * 0.6,
    });
  }
  return (
    <div className="kk-screen kk-splash">
      <KKStatus />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 28px 28px', position: 'relative' }}>
        {/* paw walk track */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {paws.map(p => (
            <div
              key={p.key}
              className="kk-paw"
              style={{
                left: p.left, top: p.top,
                '--r': `${p.rot}deg`,
                '--tx': '0px',
                '--ty': '-700px',
                animationDelay: `${p.delay}s`,
                animationDuration: '6s',
              }}
            >
              <IconPaw size={18} color="rgba(0,0,0,0.06)" />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <KKWordmark />
          <button className="kk-btn-ghost" style={{ fontSize: 12, background: 'none', border: 0 }} onClick={onLogin}>
            Войти
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div className="kk-badge kk-badge-pink" style={{ alignSelf: 'flex-start', marginBottom: 18 }}>
            Ранний доступ · 500 мест
          </div>
          <h1 style={{
            fontSize: 34, lineHeight: 1.08, fontWeight: 700, margin: 0,
            letterSpacing: -0.5, textWrap: 'pretty',
          }}>
            Если у твоей кошки<br/>был&nbsp;бы&nbsp;выбор.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--kk-ink-3)', lineHeight: 1.5, marginTop: 14, maxWidth: 280 }}>
            Холистик-корм из ресторанных продуктов, ИИ-ассистент 24/7 и сеть сервисов для кошек — в&nbsp;одной подписке.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            <span className="kk-chip kk-chip-outline">🍗 Реальный холистик</span>
            <span className="kk-chip kk-chip-outline">🧪 Премикс</span>
            <span className="kk-chip kk-chip-outline">🚚 Доставка раз в неделю</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
          <button className="kk-btn kk-btn-primary" onClick={onPrimary}>
            Запросить ранний доступ
          </button>
          <button className="kk-btn kk-btn-ghost" onClick={onLogin}>
            У меня уже есть аккаунт
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Phone entry (matches Figma "Регистрация → Номер телефона") ─── */
function PhoneScreen({ phone, setPhone, onContinue, onBack, onLogin, onSocial, onHelp, mode = 'signup' }) {
  const inputRef = useRefOnb(null);
  useEffectOnb(() => { inputRef.current && inputRef.current.focus(); }, []);

  function formatPhone(v) {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    let out = '';
    if (digits.length > 0) out = '(' + digits.slice(0, 3);
    if (digits.length >= 4) out += ') ' + digits.slice(3, 6);
    if (digits.length >= 7) out += '-' + digits.slice(6, 8);
    if (digits.length >= 9) out += '-' + digits.slice(8, 10);
    return out;
  }
  const valid = phone.replace(/\D/g, '').length === 10;

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar title={mode === 'signup' ? 'РЕГИСТРАЦИЯ' : 'ВХОД'} onBack={onBack} right={
        <button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>
      }/>
      <div className="kk-scroll" style={{ padding: '22px 24px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
          {mode === 'signup' ? 'Регистрация' : 'С возвращением'}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 24px', lineHeight: 1.5 }}>
          {mode === 'signup'
            ? 'Введите номер телефона — мы отправим код подтверждения.'
            : 'Введите номер, на который зарегистрирован аккаунт.'}
        </p>

        <div className="kk-field-label">Номер телефона</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="kk-input" style={{ width: 64, justifyContent: 'center', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            🇷🇺 +7
          </div>
          <input
            ref={inputRef}
            className="kk-input"
            placeholder="(999) 123-45-67"
            value={formatPhone(phone)}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>

        <button
          className="kk-btn kk-btn-primary"
          disabled={!valid}
          style={{ marginTop: 22 }}
          onClick={onContinue}
        >
          Получить код
        </button>

        <p style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 16, lineHeight: 1.5 }}>
          Нажимая «Получить код», вы соглашаетесь с условиями использования и политикой конфиденциальности.
        </p>

        {mode === 'signup' && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 18px',
              fontSize: 11, color: 'var(--kk-ink-4)',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--kk-line)' }}/>
              <span>или войдите через</span>
              <div style={{ flex: 1, height: 1, background: 'var(--kk-line)' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="kk-btn"
                onClick={() => (onSocial ? onSocial('google') : onContinue())}
                style={{
                  background: '#fff', color: '#000',
                  border: '1px solid var(--kk-line-2)',
                  fontWeight: 500, fontSize: 14,
                  justifyContent: 'flex-start', paddingLeft: 18, gap: 12,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.7 3.2-8.2z" fill="#4285F4"/>
                  <path d="M12 23c2.9 0 5.3-.9 7-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.5 1.1-2.7 0-5-1.8-5.8-4.3H2.5v2.8C4.3 20.7 7.9 23 12 23z" fill="#34A853"/>
                  <path d="M6.2 14.4c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.4H2.5C1.7 8.9 1.2 10.4 1.2 12s.5 3.1 1.3 4.6l3.7-2.2z" fill="#FBBC04"/>
                  <path d="M12 5.6c1.5 0 2.9.5 4 1.5l3-3C17.3 2.4 14.9 1.4 12 1.4 7.9 1.4 4.3 3.7 2.5 7.4l3.7 2.9c.8-2.5 3.1-4.7 5.8-4.7z" fill="#EA4335"/>
                </svg>
                Продолжить с&nbsp;Google
              </button>
              <button
                className="kk-btn"
                onClick={() => (onSocial ? onSocial('yandex') : onContinue())}
                style={{
                  background: '#fff', color: '#000',
                  border: '1px solid var(--kk-line-2)',
                  fontWeight: 500, fontSize: 14,
                  justifyContent: 'flex-start', paddingLeft: 18, gap: 12,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="16" fill="#FC3F1D"/>
                  <path d="M18.1 9.2h-1.4c-2.4 0-3.7 1.2-3.7 3 0 2 .9 2.9 2.6 4.1l1.4 1L13.2 23h-2.5l3.4-5c-2.1-1.5-3.3-2.9-3.3-5.4 0-3.1 2.1-5.2 6-5.2H19V23h-.9V9.2z" fill="#fff"/>
                </svg>
                Продолжить с&nbsp;Яндекс ID
              </button>
              <button
                className="kk-btn"
                onClick={() => (onSocial ? onSocial('telegram') : onContinue())}
                style={{
                  background: '#fff', color: '#000',
                  border: '1px solid var(--kk-line-2)',
                  fontWeight: 500, fontSize: 14,
                  justifyContent: 'flex-start', paddingLeft: 18, gap: 12,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 240 240" aria-hidden="true">
                  <defs>
                    <linearGradient id="tg-grad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#2AABEE"/>
                      <stop offset="1" stopColor="#229ED9"/>
                    </linearGradient>
                  </defs>
                  <circle cx="120" cy="120" r="120" fill="url(#tg-grad)"/>
                  <path d="M54 116c35-13.6 58.4-22.6 70-27 33.4-13.7 40.3-16 44.8-16.1.7 0 2.4.2 3.5.9.9.6 1.2 1.4 1.3 2 .1.6.3 2 .1 3.1-1.6 17-8.7 58.2-12.3 77.2-1.5 8-4.5 10.7-7.4 11-6.3.6-11-4.1-17.2-8.1-9.6-6.3-15.1-10.2-24.4-16.4-10.8-7.1-3.8-11 2.4-17.3 1.6-1.6 29.6-27.1 30.2-29.4.1-.3.1-1.4-.6-1.9s-1.6-.4-2.3-.2c-1 .2-16.4 10.4-46.5 30.7-4.4 3-8.4 4.5-12 4.4-3.9-.1-11.5-2.3-17.1-4.1-6.9-2.2-12.3-3.4-11.9-7.2.3-2 3-4.1 8.4-6.6z" fill="#fff"/>
                </svg>
                Продолжить с&nbsp;Telegram
              </button>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: 'var(--kk-ink-3)' }}>
            Уже есть аккаунт? <button className="kk-btn-ghost" style={{ background: 'none', border: 0, fontSize: 12, color: 'var(--kk-ink)', textDecoration: 'underline', padding: 0 }} onClick={onLogin}>Войти</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SMS code (matches Figma "Введите код") ─── */
function SmsScreen({ phone, code, setCode, onContinue, onBack, onHelp }) {
  const inputRef = useRefOnb(null);
  const [resend, setResend] = useStateOnb(42);
  useEffectOnb(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);
  useEffectOnb(() => { inputRef.current && inputRef.current.focus(); }, []);

  // auto-advance to next step when 4 digits entered
  useEffectOnb(() => {
    if (code.length === 4) { const t = setTimeout(onContinue, 320); return () => clearTimeout(t); }
  }, [code]);

  const masked = '+7 (' + phone.slice(0,3) + ') ***-**-' + phone.slice(-2);

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar title="РЕГИСТРАЦИЯ" onBack={onBack} right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}/>
      <div className="kk-scroll" style={{ padding: '22px 24px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Введите код</h1>
        <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: 0, lineHeight: 1.5 }}>
          Мы отправили SMS с кодом на номер<br/>{masked}
        </p>

        <div className="kk-otp-row">
          {[0,1,2,3].map(i => (
            <div key={i} className={`kk-otp-cell ${code.length === i ? 'is-active' : ''}`}>
              {code[i] || ''}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--kk-ink-3)' }}>
          {resend > 0
            ? <>Не пришёл код? Отправить повторно через <b>0:{String(resend).padStart(2, '0')}</b></>
            : <button className="kk-btn-ghost" style={{ background: 'none', border: 0, padding: 0, fontSize: 13, textDecoration: 'underline' }} onClick={() => setResend(42)}>Отправить код повторно</button>
          }
        </div>

        {/* Numeric keypad simulation */}
        <div style={{ marginTop: 38, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              className="kk-input"
              style={{ height: 56, fontSize: 22, fontWeight: 500, background: 'var(--kk-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setCode(c => (c + n).slice(0, 4))}
            >
              {n}
            </button>
          ))}
          <div/>
          <button
            className="kk-input"
            style={{ height: 56, fontSize: 22, fontWeight: 500, background: 'var(--kk-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setCode(c => (c + '0').slice(0, 4))}
          >0</button>
          <button
            className="kk-input"
            style={{ height: 56, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setCode(c => c.slice(0, -1))}
          >
            <IconBack size={20} color="var(--kk-ink-2)"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Welcome / hello-from-Kus (matches Figma "Привет!") ─── */
function WelcomeScreen({ onContinue, onSkip, onHelp, userName }) {
  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar title="ДОБРО ПОЖАЛОВАТЬ" right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}/>
      <div className="kk-scroll" style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 92, height: 92, borderRadius: '50%',
          background: 'var(--kk-pink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          alignSelf: 'center', marginBottom: 22,
          boxShadow: '0 8px 24px rgba(253, 212, 225, 0.5)',
        }}>
          <IconPaw size={42} color="#000" />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 10px', textAlign: 'center' }}>
          {userName && userName.trim() ? <>Привет, {userName.trim()}!<br/>Я&nbsp;— Кусь</> : <>Привет! Я&nbsp;— Кусь</>}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--kk-ink-2)', margin: '0 0 26px', textAlign: 'center', lineHeight: 1.5 }}>
          Я помогу вам заботиться о&nbsp;кошке: подскажу нормы, отвечу на&nbsp;вопросы, позову ветеринара, когда понадобится.
        </p>

        <div className="kk-card-soft" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCat size={18} color="var(--kk-ink)"/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Цифровой паспорт</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', paddingLeft: 44 }}>
            Расскажите о&nbsp;питомце — я буду давать точные рекомендации.
          </div>
        </div>

        <div className="kk-card-soft" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconChat size={18} color="var(--kk-ink)"/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Чат 24/7</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', paddingLeft: 44 }}>
            Спросите о&nbsp;породе, поведении, питании. Подключу человека, если нужен специалист.
          </div>
        </div>

        <div className="kk-card-soft" style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSparkle size={16} color="var(--kk-ink)"/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Заметит то, что упустили</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', paddingLeft: 44 }}>
            Сам напомню о&nbsp;воде, активности, прививках — без&nbsp;давления.
          </div>
        </div>

        <button className="kk-btn kk-btn-primary" onClick={onContinue}>
          Заполнить паспорт питомца
        </button>
        <button className="kk-btn kk-btn-ghost" style={{ marginTop: 6 }} onClick={onSkip || onContinue}>
          Пропустить — заполню позже
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { SplashScreen, PhoneScreen, SmsScreen, WelcomeScreen, UserNameScreen });

/* ─── User name (after SMS, before pet onboarding) ─── */
function UserNameScreen({ userName, setUserName, onContinue, onBack, onHelp }) {
  const inputRef = useRefOnb(null);
  useEffectOnb(() => { inputRef.current && inputRef.current.focus(); }, []);
  const valid = userName.trim().length >= 2;

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar
        title="РЕГИСТРАЦИЯ"
        onBack={onBack}
        right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}
      />
      <div className="kk-scroll" style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: 'var(--kk-pink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <IconUser size={30} color="#000"/>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Как к&nbsp;вам обращаться?</h1>
        <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
          Кусь будет писать вам по&nbsp;имени — так теплее. Можно изменить в&nbsp;любой момент.
        </p>

        <div className="kk-field-label">Ваше имя</div>
        <input
          ref={inputRef}
          className="kk-input"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Виктор, Аня…"
          maxLength={32}
          onKeyDown={e => e.key === 'Enter' && valid && onContinue()}
        />

        <div className="kk-banner kk-banner-soft" style={{ marginTop: 18 }}>
          <IconSparkle size={16} color="var(--kk-pink-deep)"/>
          <span>Только имя — без&nbsp;фамилии, никаких документов. Используем только&nbsp;в&nbsp;приложении.</span>
        </div>

        <div style={{ flex: 1 }}/>

        <button
          className="kk-btn kk-btn-primary"
          disabled={!valid}
          onClick={onContinue}
          style={{ marginTop: 22 }}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
