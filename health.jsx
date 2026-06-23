// health.jsx — «Здоровье»: календарь регулярного ухода (прививки, глистогонка,
// обработки, осмотры, взвешивание). Time-based, отдельно от ежедневного «экшена».
// Loaded before app.jsx; reuses tokens/icons/chrome.

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

function HealthScreen({ careItems = [], onMark, onBack, onTab, onChat, onHelp, openSheet }) {
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
                    <div style={{ fontSize: 11.5, color: 'var(--kk-ink-3)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: it.note }}/>
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

Object.assign(window, { HealthScreen, CARE_SEED, careStatusOf });
