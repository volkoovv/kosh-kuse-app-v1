// campaigns.jsx — Активация спецпроектов (deep-link, партнёрки, инфлюенсеры)
//
// Идея: при входе из спецссылки пользователь видит не дефолтный splash,
// а контекст того, откуда пришёл. Три режима активации:
//
//   • "splash"  — сплеш-скрин с партнёрским ко-брендингом и оффером
//   • "story"   — полноэкранная сторис открывается сразу
//   • "sheet"   — модал-шторка поверх сплеша
//
// CAMPAIGNS — конфиг кампаний. URL: ?c=<id>  → активация для этой кампании.
// В реальном продукте id ↔ UTM, но логика та же.

const CAMPAIGNS = {
  // ─── Партнёр-ресторан: «поужинал — кошке 1000 ₽ в кошелёк»
  'partner-cafe': {
    name: 'Кофейня «Огонёк»',
    type: 'partner',
    accent: '#FFE7B5',
    accentInk: '#8C5900',
    logo: '☕',
    eyebrow: 'Бонус от партнёра',
    headline: 'Ваш кофе превратился<br/>в&nbsp;1000 ₽ для&nbsp;кошки',
    teaser: 'Каждый чек у партнёров Kosh Kuse — это бонусы на заботу о вашем питомце. Активируйте подарок и заберите ранний доступ.',
    offer: '+1000 ₽ в кошельке кошки',
    cta: 'Активировать подарок',
    story: {
      bg: '#FFE7B5', emoji: '☕',
      eyebrow: 'Подарок',
      title: '1000 ₽ —<br/>в&nbsp;ваш кошачий кошелёк',
      body: 'Каждый ужин у «Огонька» = 1000 ₽ бонусов на заботу о кошке. Активируйте подарок и потратите его на корм или услуги партнёров.',
      ctaLabel: 'Активировать',
    },
  },

  // ─── Ветеринар-инфлюенсер привёл аудиторию
  'vet-influencer': {
    name: 'Доктор Анна',
    type: 'influencer',
    accent: '#FDD4E1',
    accentInk: '#6F1B36',
    logo: '🩺',
    eyebrow: 'Привет от Анны',
    headline: 'Доктор Анна рекомендует<br/>Kosh Kuse',
    teaser: 'Мы работаем с ветеринарами над рекомендациями Кусь. Анна привела вас — получите подписку с её гайдом по породам.',
    offer: '+ гайд «Метисы 0-12» в подарок',
    cta: 'Забрать гайд',
    story: {
      bg: '#FDD4E1', emoji: '🩺',
      eyebrow: 'От доктора',
      title: 'Анна вас представила —<br/>спасибо',
      body: 'Я — Анна, ветеринар. Я помогаю Kosh Kuse собрать базу знаний по породам. Получите мой гайд по метисам и сразу спросите у Кусь, что применить к вашему питомцу.',
      ctaLabel: 'Открыть гайд',
    },
  },

  // ─── ТГ-реклама / посевы
  'tg-ads': {
    name: 'Telegram',
    type: 'channel',
    accent: '#E0EBFF',
    accentInk: '#1F3C8A',
    logo: '✈️',
    eyebrow: 'Из Telegram',
    headline: 'Один тап — и вы внутри.',
    teaser: 'Привязка через Telegram. Кусь будет писать прямо в вашу переписку, без установки приложения.',
    offer: 'Mini App · без установки',
    cta: 'Открыть через Telegram',
    story: {
      bg: '#E0EBFF', emoji: '✈️',
      eyebrow: 'Mini App',
      title: 'Kosh Kuse внутри<br/>Telegram',
      body: 'Один и тот же продукт работает в браузере и внутри Telegram Mini App. Кусь будет жить в вашем мессенджере.',
      ctaLabel: 'Привязать TG',
    },
  },

  // ─── День кошек / спецпроект
  'cat-day': {
    name: 'День кошек',
    type: 'event',
    accent: '#E0F5E5',
    accentInk: '#1F7333',
    logo: '🎉',
    eyebrow: '8 августа · День кошек',
    headline: 'В праздник —<br/>двойные бонусы',
    teaser: 'Только в День кошек: ранний доступ + 2× бонусы в кошельке за каждого приглашённого друга.',
    offer: '2× бонусы за рефералов',
    cta: 'Поймать акцию',
    story: {
      bg: '#E0F5E5', emoji: '🎉',
      eyebrow: 'День кошек',
      title: '8 августа — наш праздник',
      body: 'В этот день мы удваиваем бонусы за каждого друга, которого вы приведёте в Kosh Kuse. Подарок другу — подарок вам.',
      ctaLabel: 'Активировать',
    },
  },

  // ─── Холодный лендинг 1 (дефолт без кампании, но запасной вариант)
  'landing-1': {
    name: 'Лендинг',
    type: 'landing',
    accent: '#F5F5F7',
    accentInk: '#000',
    logo: '🐾',
    eyebrow: 'С лендинга',
    headline: 'Если у твоей кошки<br/>был бы выбор',
    teaser: 'Спасибо, что заглянули. Внутри — ваш цифровой паспорт и ассистент Кусь.',
    offer: 'Ранний доступ открыт',
    cta: 'Запросить доступ',
    story: null,
  },
};

/* Парсер ?c=campaign-id из URL */
function parseCampaign() {
  try {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('c') || url.searchParams.get('campaign');
    if (id && CAMPAIGNS[id]) return id;
  } catch (_) {}
  return null;
}

/* ─── Sheet-вариант: модал поверх обычного splash ─── */
function CampaignSheet({ campaignId, onPrimary, onDismiss }) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return null;
  return (
    <div className="kk-modal-bg" onClick={onDismiss}>
      <div className="kk-sheet" onClick={e => e.stopPropagation()}>
        <div className="kk-sheet-handle"/>
        <div style={{
          width: 64, height: 64, borderRadius: 32,
          background: c.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 16px',
        }}>{c.logo}</div>
        <div className="kk-prokard-meta" style={{ textAlign: 'center', marginBottom: 6 }}>{c.eyebrow.toUpperCase()}</div>
        <h2
          style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px', textAlign: 'center', lineHeight: 1.2 }}
          dangerouslySetInnerHTML={{__html: c.headline}}
        />
        <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', textAlign: 'center', margin: '0 0 18px', lineHeight: 1.5 }}>
          {c.teaser}
        </p>

        <div style={{
          padding: '10px 14px', borderRadius: 12,
          background: c.accent, color: c.accentInk,
          fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
        }}>
          <IconGift size={16}/>
          <span style={{ flex: 1 }}>{c.offer}</span>
        </div>

        <button className="kk-btn kk-btn-primary" onClick={onPrimary}>{c.cta}</button>
        <button className="kk-btn kk-btn-ghost" style={{ marginTop: 4 }} onClick={onDismiss}>
          Сначала осмотрюсь
        </button>
      </div>
    </div>
  );
}

/* ─── Story-вариант: фуллскрин сторис открывается сразу ─── */
function CampaignStory({ campaignId, onPrimary, onDismiss }) {
  const c = CAMPAIGNS[campaignId];
  const [progress, setProgress] = React.useState(0);
  if (!c || !c.story) return null;
  const s = c.story;

  React.useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(100, p + 0.55)), 50);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    if (progress >= 100) onPrimary && onPrimary();
  }, [progress]);

  return (
    <div className="kk-story-view">
      <div className="kk-story-bars">
        <div className="kk-story-bar">
          <div className="kk-story-bar-fill" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <KKWordmark />
        <div style={{ flex: 1 }}/>
        <button onClick={onDismiss} style={{ background: 'none', border: 0, color: '#fff', padding: 8 }}>
          <IconClose size={20} color="#fff"/>
        </button>
      </div>

      <div style={{ flex: 1, padding: '18px 28px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => {
          const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
          const w = e.currentTarget.getBoundingClientRect().width;
          if (x > w / 3) setProgress(100);
        }}
      >
        <div style={{
          alignSelf: 'flex-start',
          fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
          background: s.bg, color: '#000',
          padding: '6px 10px', borderRadius: 999,
          textTransform: 'uppercase',
        }}>{s.eyebrow}</div>

        <div style={{ marginTop: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            width: 132, height: 132, borderRadius: 32,
            background: s.bg, color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64, marginBottom: 26,
          }}>{s.emoji}</div>
          <h1
            style={{ fontSize: 28, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.1, letterSpacing: -0.3 }}
            dangerouslySetInnerHTML={{__html: s.title}}
          />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{s.body}</p>
        </div>
      </div>

      <div style={{ padding: '14px 18px 28px' }}>
        <button
          className="kk-btn"
          style={{ background: '#fff', color: '#000' }}
          onClick={(e) => { e.stopPropagation(); onPrimary && onPrimary(); }}
        >{s.ctaLabel || c.cta}</button>
        <button
          className="kk-btn"
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}
          onClick={(e) => { e.stopPropagation(); onDismiss && onDismiss(); }}
        >Пропустить</button>
      </div>
    </div>
  );
}

/* ─── Splash-вариант: партнёрский ко-брендированный сплеш ─── */
function CampaignSplash({ campaignId, onPrimary, onLogin, onDismiss }) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return null;
  return (
    <div className="kk-screen" style={{ background: c.accent }}>
      <KKStatus />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 24px 24px' }}>
        {/* Co-brand bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.6)', padding: '10px 14px',
          borderRadius: 14, marginBottom: 24, backdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KKWordmark />
            <span style={{ fontSize: 13, color: c.accentInk, opacity: 0.6 }}>×</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: c.accentInk }}>
              <span style={{ fontSize: 16 }}>{c.logo}</span>
              {c.name}
            </span>
          </div>
          <button onClick={onDismiss} style={{ background: 'none', border: 0, padding: 6, color: c.accentInk, opacity: 0.6 }}>
            <IconClose size={14}/>
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="kk-badge" style={{
            background: 'rgba(255,255,255,0.6)', color: c.accentInk,
            alignSelf: 'flex-start', marginBottom: 18, fontSize: 11,
          }}>
            {c.eyebrow}
          </div>
          <h1
            style={{
              fontSize: 32, lineHeight: 1.08, fontWeight: 700, margin: 0,
              letterSpacing: -0.5, color: '#000',
            }}
            dangerouslySetInnerHTML={{__html: c.headline}}
          />
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', lineHeight: 1.5, marginTop: 16, maxWidth: 280 }}>
            {c.teaser}
          </p>

          {/* Offer card */}
          <div style={{
            marginTop: 24, padding: 16, borderRadius: 18,
            background: '#fff', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: c.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconGift size={20} color={c.accentInk}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="kk-prokard-meta">ВАШ БОНУС</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kk-ink)', marginTop: 2 }}>
                {c.offer}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="kk-btn kk-btn-primary" onClick={onPrimary}>{c.cta}</button>
          <button className="kk-btn kk-btn-ghost" style={{ color: c.accentInk }} onClick={onLogin}>
            У меня уже есть аккаунт
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CAMPAIGNS, parseCampaign, CampaignSheet, CampaignStory, CampaignSplash });
