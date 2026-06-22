// knowledge.jsx — База знаний (отдельный экран + просмотр статьи)

const { useState: useStateK } = React;

const KB_CATEGORIES = [
  { id: 'nutrition', label: 'Питание',     emoji: '🍗', count: 12 },
  { id: 'health',    label: 'Здоровье',    emoji: '🩺', count: 18 },
  { id: 'behavior',  label: 'Поведение',   emoji: '🐾', count: 9  },
  { id: 'care',      label: 'Уход',        emoji: '✨', count: 7  },
  { id: 'breeds',    label: 'Породы',      emoji: '📐', count: 24 },
  { id: 'kitten',    label: 'Котята',      emoji: '🍼', count: 6  },
];

const KB_ARTICLES = [
  {
    id: 'weight-norms',
    cat: 'health', catLabel: 'Здоровье',
    title: 'Норма веса по&nbsp;породам и&nbsp;возрасту',
    teaser: 'Метис, британец, мейн-кун — у&nbsp;каждой группы свой диапазон. Что считать нормой и&nbsp;когда тревожиться.',
    readTime: 5,
    featured: true,
    accent: '#FDD4E1',
    tags: ['#для-всех', '#замер'],
    body: [
      { kind: 'lede', text: 'Идеальный вес — не&nbsp;цифра, а&nbsp;диапазон. На&nbsp;него влияют порода, возраст, пол и&nbsp;стерилизация.' },
      { kind: 'h2', text: 'Базовые диапазоны' },
      { kind: 'p', text: 'Для большинства домашних кошек 3–5&nbsp;кг — норма. Метисы держатся в&nbsp;центре диапазона. Британцы и&nbsp;мейн-куны крупнее: 4–7&nbsp;кг и&nbsp;5–10&nbsp;кг соответственно.' },
      { kind: 'callout', tone: 'success', text: 'У&nbsp;Луны 4,2&nbsp;кг — центр нормы для&nbsp;метиса 3&nbsp;лет. Хорошие данные.' },
      { kind: 'h2', text: 'Как замерить дома' },
      { kind: 'list', items: [
        'Возьмите кошку на&nbsp;руки, встаньте на&nbsp;весы',
        'Запишите цифру, спустите кошку, встаньте сами',
        'Разница — это её вес. Точность ±100&nbsp;г.',
      ] },
      { kind: 'h2', text: 'Когда позвать ветеринара' },
      { kind: 'list', items: [
        'Потеря >5% веса за&nbsp;месяц без&nbsp;причины',
        'Резкое набор веса при&nbsp;том же&nbsp;рационе',
        'Вес выше нормы 6+ месяцев',
      ] },
      { kind: 'p', text: 'Кусь следит за&nbsp;вашими отметками веса и&nbsp;подсветит отклонения автоматически.' },
    ],
  },
  {
    id: 'water-habits',
    cat: 'care', catLabel: 'Уход',
    title: '5 фактов о&nbsp;воде',
    teaser: 'Кошки пьют мало по&nbsp;природе. Простые приёмы увеличивают потребление в&nbsp;1,4 раза.',
    readTime: 3,
    featured: true,
    accent: '#D8F2F5',
    tags: ['#профилактика', '#почки'],
    body: [
      { kind: 'lede', text: 'Дефицит воды у&nbsp;кошек — частая причина проблем с&nbsp;почками и&nbsp;мочевыводящей системой.' },
      { kind: 'h2', text: 'Норма в&nbsp;сутки' },
      { kind: 'p', text: '40–50&nbsp;мл на&nbsp;кг веса. Для Луны (4,2&nbsp;кг) это ~180&nbsp;мл с&nbsp;учётом воды из&nbsp;корма.' },
      { kind: 'h2', text: 'Что увеличивает потребление' },
      { kind: 'list', items: [
        'Несколько мисок в&nbsp;разных местах — +40%',
        'Фонтанчик вместо стоячей воды — +30%',
        'Влажный корм 1–2 раза в&nbsp;день',
        'Широкая миска (усы не&nbsp;касаются краёв)',
        'Свежая вода каждые 12&nbsp;часов',
      ] },
      { kind: 'callout', tone: 'warm', text: 'Молоко взрослым кошкам не&nbsp;нужно — лактозу они переваривают плохо.' },
    ],
  },
  {
    id: 'vaccinations',
    cat: 'health', catLabel: 'Здоровье',
    title: 'Календарь прививок',
    teaser: 'Базовый график для&nbsp;домашних и&nbsp;для&nbsp;выходящих на&nbsp;улицу — раздельно.',
    readTime: 4,
    accent: '#E0F5E5',
    tags: ['#обязательно'],
    body: [
      { kind: 'lede', text: 'Прививки — основа защиты. Даже для&nbsp;домашних кошек: вирус приносится на&nbsp;обуви и&nbsp;одежде.' },
      { kind: 'h2', text: 'Базовый график' },
      { kind: 'list', items: [
        '8–9 недель — первая комплексная (FVRCP)',
        '12 недель — ревакцинация + бешенство',
        '1 год — буст',
        'Дальше — каждый год',
      ] },
      { kind: 'callout', tone: 'warm', text: 'В&nbsp;паспорте Луны статус «частично». Уточните, чего не&nbsp;хватает — Кусь подскажет.' },
    ],
  },
  {
    id: 'hiding',
    cat: 'behavior', catLabel: 'Поведение',
    title: 'Кошка часто прячется — это нормально?',
    teaser: 'Когда укрытие — здоровое поведение, а&nbsp;когда сигнал тревоги.',
    readTime: 6,
    accent: '#F0E6FF',
    tags: ['#тревога', '#стресс'],
    body: [
      { kind: 'lede', text: 'Прятки — естественное поведение. Кошки — и&nbsp;хищники, и&nbsp;добыча; укрытие даёт безопасность.' },
      { kind: 'h2', text: 'Норма' },
      { kind: 'list', items: [
        'Прячется во&nbsp;время уборки, гостей, ремонта',
        'Возвращается через 1–3 часа',
        'Ест, играет, ходит в&nbsp;лоток как обычно',
      ] },
      { kind: 'h2', text: 'Тревожные сигналы' },
      { kind: 'list', items: [
        'Прячется >24 часов без&nbsp;причины',
        'Не&nbsp;ест и&nbsp;не&nbsp;пьёт в&nbsp;укрытии',
        'Агрессия при&nbsp;попытке достать',
        'Хромает или&nbsp;тяжело дышит',
      ] },
    ],
  },
  {
    id: 'feeding-norm',
    cat: 'nutrition', catLabel: 'Питание',
    title: 'Сколько еды в&nbsp;день',
    teaser: 'Формула расчёта на&nbsp;вес и&nbsp;активность. Без&nbsp;«примерно по&nbsp;пакету».',
    readTime: 4,
    accent: '#FFE7B5',
    tags: ['#калькулятор'],
    body: [
      { kind: 'lede', text: 'Норма зависит от&nbsp;веса, активности, стерилизации и&nbsp;возраста. Универсального ответа нет — есть формула.' },
      { kind: 'h2', text: 'Базовая формула' },
      { kind: 'p', text: 'Поддерживающая калорийность = 70&nbsp;×&nbsp;(вес в&nbsp;кг)^0.75. Дальше умножаем на&nbsp;коэффициент: 1.0 — низкая активность, 1.4 — высокая, 1.2 — стерилизованная.' },
      { kind: 'callout', tone: 'success', text: 'Луна: 4,2&nbsp;кг × коэф. 1.2 = ~230 ккал/день.' },
    ],
  },
  {
    id: 'breed-metis',
    cat: 'breeds', catLabel: 'Породы',
    title: 'Метис: что важно знать',
    teaser: 'Сильное здоровье, средние размеры, разнообразие характеров — на&nbsp;что обратить внимание.',
    readTime: 3,
    accent: '#FDD4E1',
    tags: ['#метис', '#характер'],
    body: [
      { kind: 'lede', text: 'Метисы — самая многочисленная и&nbsp;здоровая группа кошек. Гибридная сила работает: меньше породных болезней.' },
      { kind: 'h2', text: 'Базовые параметры' },
      { kind: 'list', items: [
        'Вес: 3–5&nbsp;кг',
        'Срок жизни: 12–18 лет',
        'Активность: средняя',
        'Уход за&nbsp;шерстью: 1 раз в&nbsp;неделю',
      ] },
    ],
  },
  {
    id: 'litter',
    cat: 'care', catLabel: 'Уход',
    title: 'Правильный лоток',
    teaser: 'Размер, наполнитель, место — мелочи, которые решают.',
    readTime: 5,
    accent: '#E0F5E5',
    tags: ['#уход'],
    body: [
      { kind: 'lede', text: '80% проблем с&nbsp;лотком решаются изменением размера, места или&nbsp;наполнителя.' },
      { kind: 'h2', text: 'Базовое правило' },
      { kind: 'p', text: 'Лотков должно быть N+1, где&nbsp;N — количество кошек. Размер: в&nbsp;1,5 раза длиннее кошки.' },
    ],
  },
  {
    id: 'kitten-start',
    cat: 'kitten', catLabel: 'Котята',
    title: 'Первая неделя дома',
    teaser: 'Адаптация, питание, безопасность — пошагово.',
    readTime: 7,
    accent: '#FFE7B5',
    tags: ['#котёнок'],
    body: [
      { kind: 'lede', text: 'Первая неделя задаёт привязанность. Меньше стресса — крепче доверие.' },
      { kind: 'h2', text: 'День 1' },
      { kind: 'list', items: [
        'Одна комната с&nbsp;лотком, едой, водой и&nbsp;укрытием',
        'Не&nbsp;тискать, дать осмотреться',
        'Не&nbsp;мыть, не&nbsp;стричь когти',
      ] },
    ],
  },
];

/* ─── Список / index экрана базы знаний ─── */
function KnowledgeScreen({ onBack, onTab, onChat, onOpenArticle, onHelp }) {
  const [query, setQuery] = useStateK('');
  const [cat, setCat] = useStateK('all');

  const filtered = KB_ARTICLES.filter(a => {
    if (cat !== 'all' && a.cat !== cat) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (a.title + ' ' + a.teaser + ' ' + (a.tags || []).join(' '))
      .toLowerCase().replace(/&nbsp;/g, ' ').includes(q);
  });

  const featured = KB_ARTICLES.filter(a => a.featured);

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar
        title="БАЗА ЗНАНИЙ"
        onBack={onBack}
        left="Назад"
        right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}
      />

      <div className="kk-scroll" style={{ padding: '14px 18px 18px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            className="kk-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск: вес, прививки, лоток…"
            style={{ paddingLeft: 42 }}
          />
          <div style={{ position: 'absolute', left: 14, top: 0, height: '100%', display: 'flex', alignItems: 'center', color: 'var(--kk-ink-4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" strokeLinecap="round"/></svg>
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, padding: 6, color: 'var(--kk-ink-3)' }}
            ><IconClose size={14}/></button>
          )}
        </div>

        {/* Featured carousel — only when no query and "all" */}
        {!query && cat === 'all' && (
          <div style={{ marginBottom: 18 }}>
            <div className="kk-section-label" style={{ marginBottom: 8, paddingLeft: 2 }}>РЕКОМЕНДОВАНО ДЛЯ ЛУНЫ</div>
            <div style={{
              display: 'flex', gap: 10, overflowX: 'auto',
              scrollbarWidth: 'none', margin: '0 -18px', padding: '0 18px 4px',
            }}>
              {featured.map(a => (
                <button
                  key={a.id}
                  onClick={() => onOpenArticle(a.id)}
                  style={{
                    flex: '0 0 240px',
                    background: a.accent, border: 0,
                    borderRadius: 18, padding: '18px 16px 16px',
                    textAlign: 'left',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: 156,
                  }}
                >
                  <div className="kk-prokard-meta" style={{ color: 'rgba(0,0,0,0.6)' }}>{a.catLabel.toUpperCase()}</div>
                  <div>
                    <div
                      style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, marginBottom: 6, color: '#000' }}
                      dangerouslySetInnerHTML={{__html: a.title}}
                    />
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <IconBook size={12}/> {a.readTime} мин чтения
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -18px', padding: '0 18px 14px' }}>
          <button
            className={`kk-chip ${cat === 'all' ? 'is-active' : ''}`}
            onClick={() => setCat('all')}
          >Все</button>
          {KB_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`kk-chip ${cat === c.id ? 'is-active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              <span style={{ marginRight: 2 }}>{c.emoji}</span> {c.label}
              <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 11 }}>{c.count}</span>
            </button>
          ))}
        </div>

        {/* Article list */}
        {filtered.length === 0 && (
          <div style={{
            padding: '38px 20px', textAlign: 'center',
            color: 'var(--kk-ink-3)', fontSize: 13,
          }}>
            Ничего не&nbsp;нашлось. Попробуйте спросить у&nbsp;Кусь:
            <button
              className="kk-btn kk-btn-secondary"
              style={{ marginTop: 14 }}
              onClick={() => onChat(query)}
            >Открыть чат с&nbsp;вопросом</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map(a => (
            <button
              key={a.id}
              onClick={() => onOpenArticle(a.id)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'none', border: 0,
                padding: '14px 0',
                borderBottom: '1px solid var(--kk-line)',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: a.accent, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>{(KB_CATEGORIES.find(c => c.id === a.cat) || {}).emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="kk-prokard-meta" style={{ marginBottom: 2 }}>{a.catLabel}</div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: 'var(--kk-ink)', lineHeight: 1.3, marginBottom: 4 }}
                  dangerouslySetInnerHTML={{__html: a.title}}
                />
                <div
                  style={{ fontSize: 12, color: 'var(--kk-ink-3)', lineHeight: 1.4 }}
                  dangerouslySetInnerHTML={{__html: a.teaser}}
                />
                <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 6 }}>
                  {a.readTime} мин · {a.tags?.[0] || ''}
                </div>
              </div>
              <IconChevron size={16} color="var(--kk-ink-4)"/>
            </button>
          ))}
        </div>

        {/* Ask Кусь banner at bottom */}
        <div className="kk-card" style={{
          background: 'var(--kk-bg-soft)', borderColor: 'transparent',
          marginTop: 22, display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, background: 'var(--kk-pink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <IconPaw size={20} color="#000"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Не&nbsp;нашли ответ?</div>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }}>Спросите у&nbsp;Кусь — ответит мгновенно</div>
          </div>
          <button className="kk-btn kk-btn-primary kk-btn-sm" onClick={() => onChat(null)}>
            Открыть
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--kk-ink-4)', marginTop: 22, lineHeight: 1.5 }}>
          Материалы готовят ветеринары<br/>и&nbsp;команда Kosh Kuse
        </div>
      </div>

      <KKBottomNav active="kb" onChange={onTab}/>
    </div>
  );
}

/* ─── Просмотр статьи ─── */
function KnowledgeArticle({ articleId, onBack, onTab, onChat, onOpenArticle }) {
  const a = KB_ARTICLES.find(x => x.id === articleId) || KB_ARTICLES[0];
  const related = KB_ARTICLES
    .filter(x => x.cat === a.cat && x.id !== a.id)
    .slice(0, 3);

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar
        title={a.catLabel.toUpperCase()}
        onBack={onBack}
        left="База"
        right={(
          <button
            className="kk-topbar-action"
            onClick={() => onChat('Объясни подробнее: ' + a.title.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''))}
            style={{ background: 'var(--kk-pink)' }}
          >
            <IconPaw size={14} color="#000"/>
          </button>
        )}
      />

      <div className="kk-scroll">
        {/* Hero */}
        <div style={{
          background: a.accent,
          padding: '24px 22px 28px',
        }}>
          <div className="kk-prokard-meta" style={{ marginBottom: 12, color: 'rgba(0,0,0,0.6)' }}>
            {a.catLabel.toUpperCase()} · {a.readTime} МИН ЧТЕНИЯ
          </div>
          <h1
            style={{
              fontSize: 26, fontWeight: 700, margin: 0,
              lineHeight: 1.15, letterSpacing: -0.3,
              color: '#000',
            }}
            dangerouslySetInnerHTML={{__html: a.title}}
          />
          {a.tags && (
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              {a.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, padding: '4px 10px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.55)',
                  color: 'rgba(0,0,0,0.7)',
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 12px' }}>
          {a.body.map((block, i) => {
            if (block.kind === 'lede') {
              return (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--kk-ink)', margin: '0 0 18px', fontWeight: 500 }}
                   dangerouslySetInnerHTML={{__html: block.text}}/>
              );
            }
            if (block.kind === 'h2') {
              return (
                <h2 key={i} style={{ fontSize: 17, fontWeight: 700, margin: '24px 0 10px', letterSpacing: -0.1 }}
                    dangerouslySetInnerHTML={{__html: block.text}}/>
              );
            }
            if (block.kind === 'p') {
              return (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--kk-ink-2)', margin: '0 0 14px' }}
                   dangerouslySetInnerHTML={{__html: block.text}}/>
              );
            }
            if (block.kind === 'list') {
              return (
                <ul key={i} style={{ margin: '0 0 14px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {block.items.map((it, j) => (
                    <li key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 3, background: 'var(--kk-ink)',
                        marginTop: 9, flexShrink: 0,
                      }}/>
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--kk-ink-2)' }}
                            dangerouslySetInnerHTML={{__html: it}}/>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.kind === 'callout') {
              const cls = block.tone === 'success' ? 'kk-banner-success' : block.tone === 'warm' ? 'kk-banner-warm' : 'kk-banner-blue';
              const Icon = block.tone === 'success' ? IconCheck : block.tone === 'warm' ? IconActivity : IconSparkle;
              return (
                <div key={i} className={`kk-banner ${cls}`} style={{ margin: '14px 0 18px' }}>
                  <Icon size={16}/>
                  <span dangerouslySetInnerHTML={{__html: block.text}}/>
                </div>
              );
            }
            return null;
          })}

          {/* Ask Кусь inline */}
          <div className="kk-prokard" style={{ marginTop: 26 }}>
            <div className="kk-prokard-icon"><IconPaw size={16}/></div>
            <div style={{ flex: 1 }}>
              <div className="kk-prokard-meta">КУСЬ ОТВЕТИТ</div>
              <div className="kk-prokard-title">Уточнить под Луну</div>
              <div className="kk-prokard-body">
                Применю эту статью к&nbsp;паспорту вашего питомца и&nbsp;дам конкретику.
              </div>
              <button
                className="kk-btn kk-btn-primary kk-btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => onChat('Применительно к Луне (метис, 3 года, 4.2 кг): ' + a.title.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''))}
              >Спросить у&nbsp;Кусь</button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ padding: '14px 22px 22px' }}>
            <div className="kk-section-label" style={{ marginBottom: 10 }}>ЕЩЁ ПО ТЕМЕ «{a.catLabel.toUpperCase()}»</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {related.map(r => (
                <button
                  key={r.id}
                  onClick={() => onOpenArticle(r.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'none', border: 0,
                    padding: '12px 0', display: 'flex',
                    gap: 12, alignItems: 'center',
                    borderBottom: '1px solid var(--kk-line)',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: r.accent, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>{(KB_CATEGORIES.find(c => c.id === r.cat) || {}).emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{__html: r.title}}/>
                    <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }}>{r.readTime} мин</div>
                  </div>
                  <IconChevron size={14} color="var(--kk-ink-4)"/>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '6px 22px 24px', textAlign: 'center' }}>
          <button
            className="kk-btn kk-btn-secondary"
            onClick={onBack}
            style={{ width: 'auto', padding: '0 22px', height: 44 }}
          >← Все материалы</button>
        </div>
      </div>

      <KKBottomNav active="kb" onChange={onTab}/>
    </div>
  );
}

Object.assign(window, { KnowledgeScreen, KnowledgeArticle, KB_ARTICLES, KB_CATEGORIES });
