// health.jsx — «Здоровье»: календарь регулярного ухода (прививки, глистогонка,
// обработки, осмотры, взвешивание). Time-based, отдельно от ежедневного «экшена».
// Loaded before app.jsx; reuses tokens/icons/chrome.

const { useState: useStateHealth } = React;

/* Seed care plan for the demo pet (Луна, метис, 3 года, прививки «частично», квартира).
   dueInDays — срок до следующего ухода относительно «сегодня» (минус = просрочено).
   everyDays — периодичность; на ней пересчитывается следующий срок после «Отметить». */
const CARE_SEED = [
  { id: 'fleas',   label: 'Обработка от блох и клещей', emoji: '🛡️', note: 'Раз в&nbsp;1–2 месяца', everyDays: 60,  dueInDays: -3 },
  { id: 'deworm',  label: 'Глистогонка',                emoji: '🪱', note: 'Каждые 3 месяца',       everyDays: 90,  dueInDays: 12 },
  { id: 'weigh',   label: 'Контрольное взвешивание',    emoji: '⚖️', note: 'Отслеживаем вес ежемесячно', everyDays: 30, dueInDays: 5 },
  { id: 'vacc',    label: 'Комплексная вакцинация',     emoji: '💉', note: 'Ревакцинация раз в&nbsp;год · статус «частично»', everyDays: 365, dueInDays: 172 },
  { id: 'checkup', label: 'Профилактический осмотр',    emoji: '🩺', note: 'Плановый вет-чекап раз в&nbsp;год', everyDays: 365, dueInDays: 250 },
];

function careStatusOf(dueInDays) {
  if (dueInDays < 0) return 'overdue';
  if (dueInDays <= 14) return 'soon';
  return 'ok';
}

/* Seed weight history (kg over the last ~5 months, trending to current). */
const WEIGHT_SEED = [
  { kg: 3.8,  daysAgo: 150 },
  { kg: 3.9,  daysAgo: 120 },
  { kg: 4.0,  daysAgo: 90 },
  { kg: 4.1,  daysAgo: 60 },
  { kg: 4.15, daysAgo: 30 },
  { kg: 4.2,  daysAgo: 0 },
];

/* Minimal inline weight sparkline. */
function WeightChart({ data }) {
  const pts = (data || []).slice(-8);
  if (pts.length < 2) return null;
  const W = 280, H = 70, pad = 10;
  const xs = pts.map(p => p.kg);
  const lo = Math.min(...xs) - 0.2, hi = Math.max(...xs) + 0.2;
  const x = (i) => pad + (i * (W - 2 * pad)) / (pts.length - 1);
  const y = (kg) => pad + (1 - (kg - lo) / (hi - lo || 1)) * (H - 2 * pad);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.kg).toFixed(1)}`).join(' ');
  const area = `${line} L${x(pts.length - 1).toFixed(1)} ${H - pad} L${x(0).toFixed(1)} ${H - pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <path d={area} fill="rgba(253,212,225,0.4)"/>
      <path d={line} fill="none" stroke="var(--kk-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.kg)} r={i === pts.length - 1 ? 3.5 : 2}
          fill={i === pts.length - 1 ? 'var(--kk-pink-deep)' : 'var(--kk-ink)'}/>
      ))}
    </svg>
  );
}

function HealthScreen({ pet, careItems = [], onMark, onBack, onTab, onChat, onHelp, openSheet, weightLog = [], onLogWeight, careLog = [] }) {
  const [weighDraft, setWeighDraft] = useStateHealth('');
  const lastKg = weightLog.length ? weightLog[weightLog.length - 1].kg : ((pet && pet.weight) || '—');
  const prevKg = weightLog.length > 1 ? weightLog[weightLog.length - 2].kg : null;
  const delta = prevKg != null ? +(lastKg - prevKg).toFixed(2) : null;
  const deltaLabel = delta == null ? '' : delta === 0 ? '· без изменений' : `· ${delta > 0 ? '+' : ''}${delta} кг`;
  const deltaColor = (delta == null || delta === 0) ? 'var(--kk-ink-3)' : 'var(--kk-success-ink)';
  // Vaccination card reflects the passport status (kept in sync with PetScreen).
  const noteFor = (it) => {
    if (it.id === 'vacc' && pet) {
      const s = ({ full: 'график соблюдён', partial: 'статус «частично» — уточните', none: 'прививок нет', unknown: 'статус неизвестен' })[pet.vaccinations];
      return s ? `Ревакцинация раз в&nbsp;год · ${s}` : it.note;
    }
    return it.note;
  };
  const today = new Date();
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const fmtDate = (d) => {
    const x = new Date(today.getTime() + d * 86400000);
    return `${x.getDate()} ${months[x.getMonth()]}`;
  };
  const rel = (d) => d === 0 ? 'сегодня' : d < 0 ? `просрочено на ${-d} дн.` : `через ${d} дн.`;

  const rank = { overdue: 0, soon: 1, ok: 2 };
  const sorted = [...careItems].sort((a, b) => {
    const sa = careStatusOf(a.dueInDays), sb = careStatusOf(b.dueInDays);
    return (rank[sa] - rank[sb]) || (a.dueInDays - b.dueInDays);
  });
  const overdue = careItems.filter(i => careStatusOf(i.dueInDays) === 'overdue').length;
  const soon = careItems.filter(i => careStatusOf(i.dueInDays) === 'soon').length;
  const summary = overdue
    ? `${overdue} просрочено${soon ? ` · ${soon} скоро` : ''}`
    : soon ? `${soon} скоро` : 'Всё по графику';

  const badge = (st) => st === 'overdue'
    ? <span className="kk-badge kk-badge-error">Просрочено</span>
    : st === 'soon'
    ? <span className="kk-badge kk-badge-warm">Скоро</span>
    : <span className="kk-badge kk-badge-success">В норме</span>;

  return (
    <div className="kk-screen">
      <KKStatus/>
      <KKTopBar title="ЗДОРОВЬЕ" onBack={onBack} left="Питомец" right={
        <button className="kk-topbar-action" onClick={() => openSheet && openSheet({
          icon: <IconShield size={22} color="#000"/>, iconBg: 'var(--kk-success-bg)',
          title: 'Как работает «Здоровье»',
          body: 'Здесь — график регулярного ухода: прививки, глистогонка, обработка от&nbsp;блох, осмотры и&nbsp;взвешивание. Кусь следит за&nbsp;сроками и&nbsp;напоминает заранее. Отмечайте выполненное — следующая дата пересчитается сама.',
          primaryLabel: 'Понятно',
        })}><IconQuestion size={14}/></button>
      }/>

      <div className="kk-scroll" style={{ padding: '16px 20px 24px' }}>
        {/* Kus summary banner */}
        <div className="kk-prokard" style={{ marginBottom: 18 }}>
          <div className="kk-prokard-icon" style={{ background: 'var(--kk-success-bg)' }}>
            <IconShield size={16} color="var(--kk-success-ink)"/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="kk-prokard-meta">ГРАФИК УХОДА ЛУНЫ</div>
            <div className="kk-prokard-title">{summary}</div>
            <div className="kk-prokard-body">Я напомню заранее о&nbsp;каждом сроке — без&nbsp;спешки и&nbsp;давления.</div>
          </div>
        </div>

        {/* Вес — динамика */}
        <div className="kk-card" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="kk-section-label">ВЕС · ДИНАМИКА</div>
            <div style={{ fontSize: 13, color: 'var(--kk-ink-3)' }}>
              <b style={{ fontSize: 16, color: 'var(--kk-ink)' }}>{lastKg}</b> кг <span style={{ color: deltaColor }}>{deltaLabel}</span>
            </div>
          </div>
          <WeightChart data={weightLog}/>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              className="kk-input"
              inputMode="decimal"
              placeholder="новый замер, напр. 4.3"
              value={weighDraft}
              onChange={e => setWeighDraft(e.target.value)}
              style={{ flex: 1, height: 44 }}
            />
            <button
              className="kk-btn kk-btn-primary"
              style={{ width: 'auto', padding: '0 18px', height: 44 }}
              onClick={() => { onLogWeight && onLogWeight(weighDraft); setWeighDraft(''); }}
            >Записать</button>
          </div>
        </div>

        {/* Care items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(it => {
            const st = careStatusOf(it.dueInDays);
            const tone = st === 'overdue' ? 'var(--kk-error-bg)' : st === 'soon' ? 'var(--kk-warm-bg)' : 'var(--kk-bg-soft)';
            return (
              <div key={it.id} style={{ background: 'var(--kk-bg)', border: '1px solid var(--kk-line)', borderRadius: 16, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{it.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--kk-ink)' }}>{it.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--kk-ink-3)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: noteFor(it) }}/>
                  </div>
                  {badge(st)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: st === 'overdue' ? 'var(--kk-error-ink)' : 'var(--kk-ink-2)' }}>
                    <span style={{ fontWeight: 600 }}>{fmtDate(it.dueInDays)}</span> · {rel(it.dueInDays)}
                  </div>
                  <button className="kk-btn kk-btn-sm kk-btn-secondary" onClick={() => onMark && onMark(it.id)}>Отметить</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* История ухода */}
        <div style={{ marginTop: 22 }}>
          <div className="kk-section-label" style={{ marginBottom: 10 }}>ИСТОРИЯ</div>
          {(!careLog || careLog.length === 0) ? (
            <div style={{ fontSize: 12, color: 'var(--kk-ink-4)', lineHeight: 1.5, padding: '2px 2px 4px' }}>
              Пока пусто — отмечайте уход и&nbsp;взвешивания, события появятся здесь лентой.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {careLog.slice(0, 12).map(ev => (
                <div key={ev.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--kk-line)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--kk-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconCheck size={14} color="var(--kk-success-ink)"/>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{ __html: ev.label }}/>
                  <div style={{ fontSize: 11, color: 'var(--kk-ink-4)' }}>{ev.daysAgo === 0 ? 'сегодня' : `${ev.daysAgo} дн. назад`}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ask Кусь */}
        <button
          onClick={() => onChat && onChat('Помоги составить график прививок и обработок для Луны (метис, 3 года)')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--kk-bg-soft)', border: 0, borderRadius: 14, padding: '13px 14px', marginTop: 18, textAlign: 'left' }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 19, background: 'var(--kk-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconPaw size={18} color="#000"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Спросить Кусь про график</div>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }}>Подберём прививки и&nbsp;обработки под&nbsp;Луну</div>
          </div>
          <IconChevron size={16} color="var(--kk-ink-4)"/>
        </button>

        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--kk-ink-4)', marginTop: 18, lineHeight: 1.5 }}>
          Сроки ориентировочные. Точный график — с&nbsp;вашим ветеринаром.
        </div>
      </div>

      <KKBottomNav active="pet" onChange={onTab}/>
    </div>
  );
}

Object.assign(window, { HealthScreen, CARE_SEED, careStatusOf, WEIGHT_SEED, WeightChart });
