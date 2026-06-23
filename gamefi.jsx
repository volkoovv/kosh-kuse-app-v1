// gamefi.jsx — V1 GameFi layer: задания (Home), статусы + брелок (Питомец)
// Reuses Kosh Kuse tokens, icons.jsx, chrome.jsx. Loaded before app.jsx.

const { useState: useStateG } = React;

/* ─── extra stroke icons (match icons.jsx geometry) ─── */
const _gi = ({ size = 20, color = 'currentColor', stroke = 1.7 }) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
});
function IconFlame({ fill, ...p }) {
  return <svg {..._gi(p)}><path d="M12 3c1 3-1.5 4-1.5 6.5A2.5 2.5 0 0012 12a2.5 2.5 0 002.2-3.7C15.5 9.5 17 11 17 14a5 5 0 01-10 0c0-3.5 3-5.5 5-11z" fill={fill || 'none'}/></svg>;
}
function IconLock(p) {
  return <svg {..._gi(p)}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
}
function IconTrophy(p) {
  return <svg {..._gi(p)}><path d="M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 19h6M10 15.5V19M14 15.5V19"/></svg>;
}
function IconTarget(p) {
  return <svg {..._gi(p)}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></svg>;
}
function IconStarO(p) {
  return <svg {..._gi(p)}><path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 .97 5.7L12 16.9 6.93 19.2l.97-5.7-4.1-4 5.7-.8z"/></svg>;
}
function IconNfc(p) {
  return <svg {..._gi(p)}><path d="M6 8a8 8 0 000 8M9.5 9.5a3.5 3.5 0 000 5M18 8a8 8 0 010 8M14.5 9.5a3.5 3.5 0 010 5"/></svg>;
}
function IconPhone(p) {
  return <svg {..._gi(p)}><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 5.7 2 2 0 016.5 3.5z"/></svg>;
}

/* ─── shared game state (single source for прототип) ─── */
const KK_RANKS = [
  { lv: 1, name: 'Котёнок',      at: 0,    perk: 'Старт пути заботы' },
  { lv: 2, name: 'Заботливый',   at: 150,  perk: 'Брелок на&nbsp;ошейник' },
  { lv: 3, name: 'Внимательный', at: 400,  perk: 'Эксклюзивные сторис о&nbsp;породе' },
  { lv: 4, name: 'Опытный',      at: 900,  perk: 'Скидка на&nbsp;первый корм' },
  { lv: 5, name: 'Хранитель',    at: 2000, perk: 'Ранний доступ к&nbsp;новинкам' },
];
const KK_GAME = { paws: 520, lv: 3, next: 900, streak: 4, daysWith: 47 };
const KK_LV = KK_RANKS.find(r => r.lv === KK_GAME.lv);
const KK_NEXT = KK_RANKS.find(r => r.lv === KK_GAME.lv + 1);
const KK_REMAIN = KK_NEXT ? KK_NEXT.at - KK_GAME.paws : 0;
const KK_PCT = KK_NEXT ? (KK_GAME.paws - KK_LV.at) / (KK_NEXT.at - KK_LV.at) : 1;

/* paws inline token */
function Paws({ n, size = 13, color = 'var(--kk-pink-deep)' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700, color: 'var(--kk-ink)' }}>
      <IconPaw size={size} color={color}/>{n}
    </span>
  );
}

/* progress ring */
function GRing({ pct, size = 80, stroke = 7, track = 'rgba(255,255,255,0.22)', bar = '#fff', children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bar} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/* status medallion */
function Medallion({ size = 86, lv = 3, locked, current }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: locked ? 'var(--kk-bg-soft)' : 'linear-gradient(140deg, var(--kk-pink) 0%, var(--kk-warm-bg) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
      boxShadow: current ? '0 0 0 3px var(--kk-ink)' : 'none',
    }}>
      {locked ? <IconLock size={size * 0.3} color="var(--kk-ink-4)"/> : <IconTrophy size={size * 0.38} color="var(--kk-ink)"/>}
      {!locked && (
        <span style={{ position: 'absolute', bottom: -2, right: -2, width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: 'var(--kk-ink)', color: '#fff', fontSize: size * 0.16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--kk-bg)' }}>{lv}</span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ЗАДАНИЯ — embedded in Home (variant B: game dashboard)
   ════════════════════════════════════════════════════════ */
function QuestCard({ title, progress, reward, pct, bg, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 152, flexShrink: 0, background: bg || 'var(--kk-bg-soft)', borderRadius: 16, padding: 13, border: 0, textAlign: 'left', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconTarget size={17} color="var(--kk-ink)"/>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: 'var(--kk-ink)' }}><IconPaw size={11} color="var(--kk-pink-deep)"/>+{reward}</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, margin: '10px 0 8px', minHeight: 32, color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{ __html: title }}/>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ width: pct, height: '100%', background: 'var(--kk-ink)', borderRadius: 3 }}/>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--kk-ink-3)', marginTop: 5 }} dangerouslySetInnerHTML={{ __html: progress }}/>
    </button>
  );
}

function DailyTask({ icon, iconBg, title, sub, reward, done, onToggle, ctaLabel, onCta, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 14px', borderRadius: 14,
      background: done ? 'var(--kk-success-bg)' : 'var(--kk-bg-soft)',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: done ? 'rgba(255,255,255,0.7)' : (iconBg || '#fff'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {done ? <IconCheck size={17} color="var(--kk-success-ink)"/> : icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--kk-ink)', textDecoration: done ? 'line-through' : 'none' }} dangerouslySetInnerHTML={{ __html: title }}/>
        <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: done ? 'Готово · Кусь записал' : sub }}/>
      </div>
      {done ? (
        <button onClick={onToggle} style={{ background: 'none', border: 0, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: 'var(--kk-success-ink)', cursor: 'pointer' }}>
          <IconPaw size={12} color="var(--kk-success-ink)"/>+{reward}
        </button>
      ) : onCta ? (
        <button className="kk-chip kk-chip-outline" style={{ height: 30, fontSize: 11.5, padding: '0 11px' }} onClick={onCta}>{ctaLabel}</button>
      ) : (
        <button className="kk-chip kk-chip-outline" style={{ height: 30, fontSize: 11.5, padding: '0 11px', gap: 4, borderColor: accent ? 'var(--kk-pink-deep)' : 'var(--kk-line-2)' }} onClick={onToggle}>
          +{reward}<IconPaw size={11} color="var(--kk-pink-deep)"/>
        </button>
      )}
    </div>
  );
}

function HomeTasksSection({ todayDone = {}, setTodayDone, showToast, onChatWith, onOpenStatus, onOpenStory, planTasks = [] }) {
  const set = (k) => {
    const was = todayDone[k];
    setTodayDone({ ...todayDone, [k]: !was });
    showToast && showToast(was ? 'Возвращено в&nbsp;список' : 'Отлично, Кусь записал! 🐾');
  };
  const planIcon = (kind) => kind === 'warmup'
    ? <IconActivity size={15} color="#000"/>
    : <IconPlay size={14} color="#000"/>;
  const allKeys = ['water', 'food', 'play', ...planTasks.map(t => t.id)];
  const doneCount = allKeys.filter(k => todayDone[k]).length;
  const totalCount = allKeys.length;
  const totalReward = 35 + planTasks.reduce((s, t) => s + (Number(t.reward) || 0), 0);
  return (
    <div style={{ marginBottom: 6 }}>
      {/* hero status band */}
      <button onClick={onOpenStatus} style={{ width: '100%', textAlign: 'left', border: 0, cursor: 'pointer', background: 'var(--kk-ink)', borderRadius: 22, padding: 16, color: '#fff', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
        <GRing pct={KK_PCT} size={78}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{KK_GAME.paws}</div>
          <div style={{ fontSize: 8.5, opacity: 0.7, marginTop: 1, letterSpacing: 0.3 }}>ЛАПОК</div>
        </GRing>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10.5, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.6 }}>Статус {KK_GAME.lv} · {KK_LV.name}</div>
          <div style={{ fontSize: 17, fontWeight: 700, margin: '3px 0 8px', letterSpacing: -0.2 }}>До «{KK_NEXT.name}» — {KK_REMAIN}&nbsp;🐾</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: '5px 11px', fontSize: 12, fontWeight: 600 }}>
            <IconFlame size={14} color="#FFB46B" fill="#FFB46B"/> {KK_GAME.streak} дня подряд
          </span>
        </div>
      </button>

      {/* quests */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
        <div className="kk-section-label">КВЕСТЫ КУСЬ</div>
        <button onClick={() => onChatWith && onChatWith('Какие квесты от Кусь сейчас активны?')} style={{ background: 'none', border: 0, fontSize: 11, color: 'var(--kk-pink-deep)', fontWeight: 600 }}>Все →</button>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, margin: '0 -16px', paddingLeft: 16, paddingRight: 16, scrollbarWidth: 'none' }}>
        <QuestCard title="Паспорт Луны на&nbsp;100%" progress="82% заполнено" reward="100" pct="82%" bg="var(--kk-pink)" onClick={onOpenStatus}/>
        <QuestCard title="7&nbsp;дней активности" progress="4 из 7 дней" reward="80" pct="57%" onClick={() => onChatWith && onChatWith('Расскажи про квест «7 дней активности»')}/>
        <QuestCard title="3&nbsp;статьи о&nbsp;метисах" progress="1 из 3" reward="50" pct="33%" bg="var(--kk-warm-bg)" onClick={() => onOpenStory && onOpenStory('norms')}/>
      </div>

      {/* today */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 4px 10px' }}>
        <div className="kk-section-label" dangerouslySetInnerHTML={{ __html: `СЕГОДНЯ · +${totalReward}&nbsp;🐾` }}/>
        <span style={{ fontSize: 11, color: 'var(--kk-ink-3)' }}>{doneCount} / {totalCount}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DailyTask reward="10" done={!!todayDone.water} onToggle={() => set('water')} title="Поменять воду" sub="До&nbsp;15:00 · Кусь напомнит" icon={<IconDrop size={16} color="var(--kk-blue-ink)"/>} iconBg="var(--kk-blue-bg)"/>
        <DailyTask reward="10" done={!!todayDone.food} onToggle={() => set('food')} title="Отметить приём корма" sub="2&nbsp;раза в&nbsp;день" icon={<IconGift size={15} color="#000"/>}/>
        <DailyTask reward="15" done={!!todayDone.play} onToggle={() => set('play')} accent title="15&nbsp;минут активной игры" sub="Лучше после&nbsp;19:00" icon={<IconPlay size={14} color="#000"/>} iconBg="var(--kk-pink)" ctaLabel="Идеи" onCta={() => onChatWith && onChatWith('Подскажи идеи для 15 минут активной игры с кошкой дома')}/>
        {planTasks.map(t => (
          <DailyTask
            key={t.id}
            reward={String(t.reward)}
            done={!!todayDone[t.id]}
            onToggle={() => set(t.id)}
            accent
            title={t.title}
            sub={t.sub}
            icon={planIcon(t.kind)}
            iconBg="var(--kk-pink)"
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   СТАТУСЫ — sub-screen in Питомец (variant A: ladder)
   ════════════════════════════════════════════════════════ */
function StatusScreen({ onBack, onTab, onHelp, openSheet }) {
  return (
    <div className="kk-screen">
      <KKStatus/>
      <KKTopBar title="СТАТУС" onBack={onBack} left="Питомец" right={
        <button className="kk-topbar-action" onClick={() => openSheet && openSheet({
          icon: <IconTrophy size={22} color="#000"/>, iconBg: 'var(--kk-pink)',
          title: 'Как работают статусы',
          body: 'Выполняйте задания и&nbsp;квесты — получаете лапки&nbsp;🐾. Лапки повышают статус хозяина: от&nbsp;«Котёнка» до&nbsp;«Хранителя». Каждый статус открывает новые возможности.',
          primaryLabel: 'Понятно',
        })}><IconQuestion size={14}/></button>
      }/>
      <div className="kk-scroll" style={{ padding: '18px 20px 24px' }}>
        {/* hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <Medallion size={78} lv={KK_GAME.lv} current/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Статус {KK_GAME.lv} из 5</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.2, margin: '2px 0 6px' }}>{KK_LV.name} хозяин</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13 }}><Paws n={KK_GAME.paws} size={14}/> <span style={{ color: 'var(--kk-ink-3)', fontWeight: 500 }}>лапок заботы</span></div>
          </div>
        </div>

        {/* progress to next */}
        <div style={{ background: 'var(--kk-bg-soft)', borderRadius: 16, padding: 15, marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 8 }}>
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>До «{KK_NEXT.name}»</span>
            <span style={{ color: 'var(--kk-ink-3)' }}>{KK_GAME.paws} / {KK_NEXT.at}</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--kk-line)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(KK_PCT * 100)}%`, height: '100%', background: 'var(--kk-ink)', borderRadius: 4 }}/>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--kk-ink-3)', marginTop: 8 }}>Ещё <b style={{ color: 'var(--kk-ink)' }}>{KK_REMAIN}&nbsp;🐾</b> — выполняйте задания, чтобы открыть скидку на&nbsp;корм.</div>
        </div>

        {/* ladder */}
        <div className="kk-section-label" style={{ marginBottom: 12 }}>Лестница статусов</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {KK_RANKS.map((r, i) => {
            const passed = r.lv < KK_GAME.lv, current = r.lv === KK_GAME.lv, locked = r.lv > KK_GAME.lv;
            return (
              <div key={r.lv} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: passed ? 'var(--kk-ink)' : current ? 'var(--kk-pink-deep)' : 'var(--kk-bg-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: (current || passed) ? '0' : '1px solid var(--kk-line-2)' }}>
                    {passed ? <IconCheck size={13} color="#fff"/> : locked ? <IconLock size={12} color="var(--kk-ink-4)"/> : <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{r.lv}</span>}
                  </div>
                  {i < KK_RANKS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 26, background: passed ? 'var(--kk-ink)' : 'var(--kk-line)' }}/>}
                </div>
                <div style={{ flex: 1, paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: current ? 700 : 600, color: locked ? 'var(--kk-ink-3)' : 'var(--kk-ink)', whiteSpace: 'nowrap' }}>{r.name}</span>
                    {current && <span className="kk-badge kk-badge-pink">сейчас</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--kk-ink-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconPaw size={11} color="var(--kk-ink-4)"/>{r.at} · <span dangerouslySetInnerHTML={{ __html: r.perk }}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <KKBottomNav active="pet" onChange={onTab}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   БРЕЛОК — sub-screen in Питомец (NFC + «первым 500»)
   ════════════════════════════════════════════════════════ */
function BrelokScreen({ pet, onBack, onTab, onHelp, openSheet, showToast, onPreview }) {
  const [ordered, setOrdered] = useStateG(false);
  const name = (pet && pet.name) || 'Луны';
  return (
    <div className="kk-screen">
      <KKStatus/>
      <KKTopBar title="БРЕЛОК" onBack={onBack} left="Питомец" right={
        <button className="kk-topbar-action" onClick={() => openSheet && openSheet({
          icon: <IconNfc size={22} color="#000"/>, iconBg: 'var(--kk-bg-soft)',
          title: 'Что такое NFC-брелок',
          body: 'Физический брелок на&nbsp;ошейник с&nbsp;NFC-меткой, привязанной к&nbsp;цифровому паспорту. Любой, кто найдёт питомца, приложит телефон — и&nbsp;откроется паспорт с&nbsp;вашими контактами. Приложение для&nbsp;этого не&nbsp;нужно.',
          primaryLabel: 'Понятно',
        })}><IconQuestion size={14}/></button>
      }/>
      <div className="kk-scroll" style={{ padding: '16px 20px 24px' }}>
        {/* «первым 500» offer banner */}
        <div style={{ background: 'var(--kk-ink)', borderRadius: 18, padding: '15px 16px', color: '#fff', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--kk-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconGift size={20} color="#000"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Первым 500 — бесплатно</div>
            <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>Дарим NFC-брелок ранним пользователям беты. Осталось 213.</div>
          </div>
        </div>

        {/* hero product */}
        <div style={{ background: 'var(--kk-bg-soft)', borderRadius: 22, padding: '24px 20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '4px solid var(--kk-ink-4)', margin: '0 auto -8px', position: 'relative', zIndex: 1 }}/>
            <div style={{ width: 112, height: 112, borderRadius: 28, background: 'var(--kk-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, boxShadow: 'var(--kk-shadow-lift)' }}>🐾</div>
            <div style={{ position: 'absolute', bottom: 8, right: -6, width: 32, height: 32, borderRadius: '50%', background: 'var(--kk-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--kk-shadow-card)' }}>
              <IconNfc size={18} color="var(--kk-ink)"/>
            </div>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Брелок Kosh&nbsp;Kuse · NFC</div>
          {ordered ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--kk-success-ink)', fontWeight: 600, marginTop: 6 }}>
              <IconCheck size={14} color="var(--kk-success-ink)"/> Заявка принята · привезём на&nbsp;неделе
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 5, textAlign: 'center' }}>Привяжем к&nbsp;паспорту {name} при&nbsp;получении</div>
          )}
        </div>

        {/* how it works */}
        <div className="kk-section-label" style={{ marginBottom: 10 }}>Как работает</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 24 }}>
          {[
            { n: 1, t: 'Приложите телефон к&nbsp;брелку', s: 'NFC-метка на&nbsp;ошейнике' },
            { n: 2, t: `Откроется паспорт ${name}`, s: 'Кличка, фото, контакт хозяина' },
            { n: 3, t: 'Нашедший свяжется с&nbsp;вами', s: 'Даже без&nbsp;приложения — через&nbsp;ссылку' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--kk-ink)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: s.t }}/>
                <div style={{ fontSize: 11, color: 'var(--kk-ink-3)' }} dangerouslySetInnerHTML={{ __html: s.s }}/>
              </div>
            </div>
          ))}
        </div>

        {/* preview what a finder sees */}
        <button onClick={onPreview} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--kk-bg-soft)', border: 0, borderRadius: 14, padding: '13px 14px', marginBottom: 18, cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--kk-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconNfc size={17} color="var(--kk-ink)"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Предпросмотр страницы</div>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 1 }}>Что увидит нашедший при сканировании</div>
          </div>
          <IconChevron size={18} color="var(--kk-ink-4)"/>
        </button>

        {ordered ? (
          <button className="kk-btn kk-btn-secondary" style={{ height: 50 }} onClick={onBack}>Готово</button>
        ) : (
          <button className="kk-btn kk-btn-primary" style={{ height: 50 }} onClick={() => openSheet && openSheet({
            icon: <IconGift size={22} color="#000"/>, iconBg: 'var(--kk-pink)',
            title: 'Получить брелок бесплатно?',
            body: `Привезём NFC-брелок и&nbsp;сразу привяжем к&nbsp;паспорту ${name}. Доставка по&nbsp;Москве — бесплатно для&nbsp;первых&nbsp;500.`,
            primaryLabel: 'Оформить заявку',
            onPrimary: () => { setOrdered(true); showToast && showToast('Заявка на&nbsp;брелок принята! 🐾'); },
            secondaryLabel: 'Не сейчас',
          })}>Получить брелок бесплатно</button>
        )}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 12, lineHeight: 1.5 }}>
          Платный заказ и&nbsp;дизайны брелков — позже, вместе с&nbsp;магазином
        </div>
      </div>
      <KKBottomNav active="pet" onChange={onTab}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   СТРАНИЦА НАШЕДШЕГО — публичный паспорт при сканировании NFC.
   Открывается в браузере у постороннего, без приложения и входа.
   ════════════════════════════════════════════════════════ */
function FoundPetScreen({ pet, ownerName = 'Виктор', ownerPhone = '+7 999 123-45-67', onClose, showToast }) {
  const p = pet || {};
  const female = p.sex !== 'male';
  const emoji = female ? '🐱' : '😼';
  const sexLabel = female ? 'Кошка' : 'Кот';
  const year = (p.birthday && (p.birthday.match(/\d{4}/) || [])[0]) || null;
  const age = year ? (2026 - parseInt(year, 10)) : null;
  const ageLabel = age != null ? `${age} ${age === 1 ? 'год' : age >= 2 && age <= 4 ? 'года' : 'лет'}` : null;
  const health = [p.allergies, p.concerns].filter(Boolean).join(' · ');

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'var(--kk-font)' }}>
      <KKStatus/>
      {/* fake browser bar — signals this is a public web link, not the app */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 10px', background: '#fff', borderBottom: '1px solid var(--kk-line)' }}>
        <button onClick={onClose} title="Закрыть предпросмотр" style={{ border: 0, background: 'var(--kk-bg-soft)', width: 26, height: 26, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
          <IconClose size={13} color="var(--kk-ink-3)"/>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--kk-bg-soft)', borderRadius: 9, padding: '6px 11px', fontSize: 12, color: 'var(--kk-ink-3)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--kk-ink-4)" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>
          koshkuse.app/p/luna
        </div>
      </div>

      <div className="kk-scroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--kk-bg)' }}>
        {/* hero — found banner */}
        <div style={{ background: 'var(--kk-pink)', padding: '26px 24px 28px', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 999, padding: '5px 13px', fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: '#C8324F' }}/>Я потерялся — помогите вернуться домой
          </div>
          <div style={{ width: 104, height: 104, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, margin: '0 auto 14px', boxShadow: 'var(--kk-shadow-lift)' }}>{emoji}</div>
          <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.4 }}>{p.name || 'Луна'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 12 }}>
            {[sexLabel, p.breed, ageLabel].filter(Boolean).map((t, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.65)', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: 'var(--kk-ink)' }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 24px 28px' }}>
          {/* primary contact */}
          <div style={{ fontSize: 13, color: 'var(--kk-ink-3)', textAlign: 'center', lineHeight: 1.5, marginBottom: 16 }}>
            Если вы нашли {female ? 'эту кошку' : 'этого кота'} — свяжитесь с&nbsp;хозяином <b style={{ color: 'var(--kk-ink)' }}>{ownerName}</b>. Спасибо, что помогаете! 🐾
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <button className="kk-btn kk-btn-primary" style={{ height: 52, fontSize: 15 }} onClick={() => showToast && showToast(`Звоним хозяину · ${ownerPhone}`)}>
              <IconPhone size={18} color="#000"/> Позвонить хозяину
            </button>
            <button className="kk-btn kk-btn-secondary" style={{ height: 50 }} onClick={() => showToast && showToast('Открываем чат с&nbsp;хозяином…')}>
              <IconChat size={17}/> Написать сообщение
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--kk-ink-3)', marginTop: 2 }}>{ownerPhone}</div>
          </div>

          {/* health alert */}
          {health && (
            <div style={{ background: 'var(--kk-warm-bg)', borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 11, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconHeart size={15} color="var(--kk-warm-ink)"/>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--kk-warm-ink)' }}>Важно о&nbsp;здоровье</div>
                <div style={{ fontSize: 12.5, color: 'var(--kk-ink)', marginTop: 3, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: health }}/>
              </div>
            </div>
          )}

          {/* what to do */}
          <div style={{ background: 'var(--kk-bg-soft)', borderRadius: 16, padding: '16px 18px', marginBottom: 22 }}>
            <div className="kk-section-label" style={{ marginBottom: 10 }}>Что делать</div>
            {[
              'Не пугайте — говорите тихо, предложите воду',
              'Позвоните или напишите хозяину по&nbsp;кнопкам выше',
              'Если не&nbsp;дозвонились — оставьте сообщение, хозяину придёт уведомление',
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: i ? 10 : 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--kk-ink)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: 'var(--kk-ink)', lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: t }}/>
              </div>
            ))}
          </div>

          {/* footer brand */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--kk-ink-3)' }}>
              <IconPaw size={14} color="var(--kk-pink-deep)"/> Цифровой паспорт <b style={{ color: 'var(--kk-ink)' }}>Kosh&nbsp;Kuse</b>
            </div>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 4 }}>Открыто по&nbsp;NFC-брелку · приложение не&nbsp;требуется</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── compact entry cards for the Питомец profile ─── */
function PetGameCards({ onStatus, onBrelok, onHealth, careItems = [] }) {
  const overdue = careItems.filter(i => careStatusOf(i.dueInDays) === 'overdue').length;
  const soon = careItems.filter(i => careStatusOf(i.dueInDays) === 'soon').length;
  const healthLine = overdue ? `${overdue} просрочено` : soon ? `${soon} скоро` : 'Всё по графику';
  const healthDot = overdue ? 'var(--kk-error-ink)' : soon ? 'var(--kk-warm-edge)' : 'var(--kk-success-ink)';
  return (
    <div style={{ marginBottom: 22 }}>
      {/* Здоровье — полноширинная карточка (календарь ухода) */}
      <button onClick={onHealth} style={{ width: '100%', textAlign: 'left', border: 0, cursor: 'pointer', background: 'var(--kk-bg-soft)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--kk-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconShield size={19} color="var(--kk-success-ink)"/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>Здоровье · уход</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2 }}>График ухода</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 3 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: healthDot }}/>{healthLine}
          </div>
        </div>
        <IconChevron size={16} color="var(--kk-ink-4)"/>
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={onStatus} style={{ textAlign: 'left', border: 0, cursor: 'pointer', background: 'var(--kk-bg-soft)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--kk-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrophy size={17} color="#000"/></div>
          <IconChevron size={16} color="var(--kk-ink-4)"/>
        </div>
        <div style={{ fontSize: 10, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>Статус · Lv.{KK_GAME.lv}</div>
        <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2 }}>{KK_LV.name}</div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--kk-line)', overflow: 'hidden', marginTop: 8 }}>
          <div style={{ width: `${Math.round(KK_PCT * 100)}%`, height: '100%', background: 'var(--kk-pink-deep)' }}/>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--kk-ink-3)', marginTop: 5 }}>ещё {KK_REMAIN}&nbsp;🐾</div>
      </button>

      <button onClick={onBrelok} style={{ textAlign: 'left', border: 0, cursor: 'pointer', background: 'var(--kk-bg-soft)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--kk-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🐾</div>
          <IconChevron size={16} color="var(--kk-ink-4)"/>
        </div>
        <div style={{ fontSize: 10, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>Брелок · NFC</div>
        <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 2 }}>На&nbsp;ошейник</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, color: 'var(--kk-pink-deep)', marginTop: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--kk-pink-deep)' }}/>Первым 500 — бесплатно
        </div>
      </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeTasksSection, StatusScreen, BrelokScreen, FoundPetScreen, PetGameCards,
  KK_GAME, KK_RANKS, Paws, Medallion, GRing,
});
