// home.jsx — Main screen (greeting, stories, proactive AI cards, tiles) + Stories viewer

const { useState: useStateH, useEffect: useEffectH } = React;

const STORIES = [
{ id: 'meet', title: 'Знакомство\nс&nbsp;Кусь', emoji: '👋', bg: '#FDD4E1' },
{ id: 'food', title: 'Что мы\nварим', emoji: '🍗', bg: '#FFE7B5' },
{ id: 'beta', title: 'Бета\n25 000', emoji: '🎟️', bg: '#E0F5E5' },
{ id: 'vet', title: 'Скоро\nветеринар', emoji: '🩺', bg: '#E7F0FF' },
{ id: 'norms', title: 'Нормы\nметисов', emoji: '📐', bg: '#F0E6FF' },
{ id: 'water', title: '5 фактов\nо&nbsp;воде', emoji: '💧', bg: '#D8F2F5' }];


function HomeScreen({ pet, onOpenStory, onTab, onTile, onChat, onChatWith, onPet, onOpenStatus, proactiveSeen, dismissProactive, notifCount, onNotif, onHelp, openSheet, showToast, todayDone, setTodayDone, userName }) {
  const greetName = userName && userName.trim() || 'друг';
  return (
    <div className="kk-screen">
      <KKStatus />
      {/* Header */}
      <div style={{
        padding: '12px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <KKWordmark />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="kk-topbar-action" onClick={onNotif} style={{ position: 'relative' }}>
            <IconBell size={16} />
            {notifCount > 0 &&
            <span style={{
              position: 'absolute', top: 3, right: 3, width: 7, height: 7,
              borderRadius: 50, background: 'var(--kk-pink-deep)'
            }} />
            }
          </button>
          <button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={16} /></button>
        </div>
      </div>

      {/* Stories rail */}
      <div className="kk-stories">
        {STORIES.map((s) =>
        <button key={s.id} className="kk-story" onClick={() => onOpenStory(s.id)}>
            <div className={`kk-story-ring ${proactiveSeen?.[s.id] ? 'is-seen' : ''}`}>
              <div className="kk-story-inner">
                <div className="kk-story-inner-fill" style={{ background: s.bg }}>{s.emoji}</div>
              </div>
            </div>
            <div className="kk-story-label" dangerouslySetInnerHTML={{ __html: s.title.replace('\n', '<br/>') }} />
          </button>
        )}
      </div>

      <div className="kk-scroll" style={{ padding: '4px 16px 16px' }}>
        {/* Greeting */}
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '6px 4px 14px', letterSpacing: -0.3 }}>
          Привет, {greetName}.
        </h1>

        {/* Proactive AI card — pinned right below greeting */}
        {!proactiveSeen?.activityCard &&
        <div className="kk-prokard" style={{ marginBottom: 12 }}>
            <div className="kk-prokard-icon">
              <IconPaw size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="kk-prokard-meta">КУСЬ ЗАМЕТИЛ</div>
              <div className="kk-prokard-title">Луне нужно больше двигаться</div>
              <div className="kk-prokard-body">
                По данным паспорта — средняя активность. Для метиса 3 лет норма выше. Давайте подберём 15 минут игры в&nbsp;день?
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="kk-btn kk-btn-primary kk-btn-sm" onClick={onChat}>Составить план</button>
                <button className="kk-btn kk-btn-secondary kk-btn-sm" onClick={() => dismissProactive('activityCard')}>Позже</button>
              </div>
            </div>
            <button
            onClick={() => dismissProactive('activityCard')}
            style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 0, color: 'var(--kk-ink-4)', padding: 4 }}>
            <IconClose size={14} /></button>
          </div>
        }

        {/* GameFi: задания (статус-герой + квесты + сегодня) */}
        <HomeTasksSection
          todayDone={todayDone}
          setTodayDone={setTodayDone}
          showToast={showToast}
          onChatWith={onChatWith}
          onOpenStatus={onOpenStatus}
          onOpenStory={onOpenStory}
        />

        {/* Pet quick card */}
        <button
          onClick={onPet}
          style={{
            width: '100%', padding: 14, borderRadius: 18,
            background: 'var(--kk-bg-soft)',
            border: 0, display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 14, textAlign: 'left'
          }}>

          <div className="kk-avatar" style={{ width: 54, height: 54, fontSize: 22 }}>
            <IconCat size={28} color="#000" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 500, marginBottom: 4 }}>Питомец</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{pet.name}</div>
            <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 2 }}>
              {pet.breed} · 3&nbsp;года · {pet.weight}&nbsp;кг
            </div>
          </div>
          <IconChevron size={20} color="var(--kk-ink-4)" />
        </button>

        {/* Section: Что у нас сегодня */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 4px 10px' }}>
          <div className="kk-section-label">СЕРВИСЫ</div>
          <button
            className="kk-btn-ghost"
            style={{ background: 'none', border: 0, fontSize: 11, color: 'var(--kk-ink-3)' }}
            onClick={() => openSheet({
              icon: <IconSparkle size={22} color="#000" />,
              iconBg: 'var(--kk-pink)',
              title: 'Сервисы Kosh Kuse',
              body: 'Сейчас доступно: чат с&nbsp;Кусь, цифровой паспорт и&nbsp;база знаний. Корм и&nbsp;ветеринар — поэтапно в&nbsp;ближайших версиях.',
              items: [
              { icon: <IconChat size={16} />, title: 'Спросить у&nbsp;Кусь', sub: 'AI ассистент', onClick: () => onChat() },
              { icon: <IconCat size={16} />, title: 'Паспорт питомца', sub: '8 заполнено · 2 на&nbsp;уточнение', onClick: () => onPet() },
              { icon: <IconBook size={16} />, title: 'База знаний', sub: '76 статей · породы, нормы', onClick: () => onTile('faq') },
              { icon: <IconHeart size={16} />, title: 'Ветеринар · скоро', sub: 'Появится в&nbsp;июле', onClick: () => onTile('soon-vet') },
              { icon: <IconGift size={16} />, title: 'Подписка на&nbsp;корм · скоро', sub: 'Появится в&nbsp;июле', onClick: () => onTile('soon-shop') }],

              secondaryLabel: 'Закрыть'
            })}>

            Все →
          </button>
        </div>

        {/* Lavka-style tile grid */}
        <div className="kk-tiles">
          <button className="kk-tile tile-pink" onClick={onChat}>
            <div className="kk-tile-icon" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <IconChat size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">Спросить у&nbsp;Кусь</div>
              <div className="kk-tile-sub">AI отвечает мгновенно</div>
            </div>
          </button>

          <button className="kk-tile" onClick={onPet}>
            <div className="kk-tile-icon" style={{ background: '#FFF' }}>
              <IconCat size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">Паспорт питомца</div>
              <div className="kk-tile-sub">8 заполнено · 2 на&nbsp;уточнение</div>
            </div>
          </button>

          <button className="kk-tile" onClick={() => onTile('faq')}>
            <div className="kk-tile-icon" style={{ background: '#FFF' }}>
              <IconBook size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">База знаний</div>
              <div className="kk-tile-sub">Породы, нормы, риски · 76 статей</div>
            </div>
          </button>

          <button className="kk-tile tile-warm" onClick={() => onTile('soon-vet')}>
            <span className="kk-tile-soon">Скоро</span>
            <div className="kk-tile-icon" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <IconHeart size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">Ветеринар</div>
              <div className="kk-tile-sub">Чат, звонок, выезд</div>
            </div>
          </button>

          <button className="kk-tile" onClick={() => onTile('soon-shop')}>
            <span className="kk-tile-soon">Скоро</span>
            <div className="kk-tile-icon" style={{ background: '#FFF' }}>
              <IconGift size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">Подписка на&nbsp;корм</div>
              <div className="kk-tile-sub">Старт продаж — в&nbsp;июле</div>
            </div>
          </button>

          <button className="kk-tile tile-dark" onClick={() => onOpenStory('beta')}>
            <div className="kk-tile-icon" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <IconSparkle size={18} color="#fff" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div className="kk-tile-title">Бета — 2000</div>
              <div className="kk-tile-sub">Вы вошли в&nbsp;ранний доступ</div>
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--kk-ink-4)', margin: '24px 0 6px', lineHeight: 1.5 }}>
          KOSH KUSE · Бета · v1.0<br />Корм, ветеринар, маркетплейс — поэтапно в&nbsp;этом приложении
        </div>
      </div>

      <KKBottomNav active="home" onChange={onTab} />
    </div>);

}

/* ─── Stories viewer ─── */
function StoryViewer({ startId, onClose, markSeen, onChatWith, openTile }) {
  const startIdx = Math.max(0, STORIES.findIndex((s) => s.id === startId));
  const [idx, setIdx] = useStateH(startIdx);
  const [progress, setProgress] = useStateH(0);
  const s = STORIES[idx];

  useEffectH(() => {
    setProgress(0);
    markSeen(s.id);
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 1.4)), 60);
    return () => clearInterval(t);
  }, [idx]);

  useEffectH(() => {
    if (progress >= 100) {
      if (idx < STORIES.length - 1) setIdx(idx + 1);else
      onClose();
    }
  }, [progress]);

  // generic story content keyed by id
  const content = {
    meet: { eyebrow: 'Знакомство', title: 'Я — Кусь', body: 'AI-ассистент Kosh Kuse. Помогаю с&nbsp;питанием, поведением и&nbsp;здоровьем кошек. Спрашивайте что угодно.' },
    food: { eyebrow: 'Корм', title: 'Реальный холистик', body: 'Из ресторанных продуктов. Эксклюзивный премикс собирает полный профиль микроэлементов. Подача — раз в&nbsp;неделю.' },
    beta: { eyebrow: 'Бета', title: 'Только&nbsp;25 000', body: 'Ранний доступ ограничен. Вы внутри — спасибо. Используйте чат с&nbsp;Кусь, чтобы прокачать паспорт.' },
    vet: { eyebrow: 'Скоро', title: 'Свой ветеринар', body: 'Закреплённый специалист, доступный 24/7 — в&nbsp;следующем релизе. Сейчас можно позвать «кожаного» из&nbsp;чата.' },
    norms: { eyebrow: 'Нормы', title: 'Метис, 3 года', body: 'Идеальный диапазон веса — 3,8–4,8&nbsp;кг. 4,2&nbsp;кг у&nbsp;Луны — в&nbsp;центре нормы. Хорошие данные.' },
    water: { eyebrow: 'Гид', title: '5 фактов о&nbsp;воде', body: 'Кошки пьют мало по&nbsp;своей природе. Несколько мисок в&nbsp;разных местах увеличивают потребление в&nbsp;1,4 раза.' }
  }[s.id] || { eyebrow: '', title: s.title, body: '' };

  return (
    <div className="kk-story-view">
      <div className="kk-story-bars">
        {STORIES.map((_, i) =>
        <div key={i} className="kk-story-bar">
            <div className="kk-story-bar-fill" style={{ width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%' }} />
          </div>
        )}
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <KKWordmark />
        <div style={{ flex: 1 }} />
        <button onClick={onClose} style={{ background: 'none', border: 0, color: '#fff', padding: 8 }}>
          <IconClose size={20} color="#fff" />
        </button>
      </div>

      <div style={{ flex: 1, padding: '18px 28px', display: 'flex', flexDirection: 'column' }}
      onClick={(e) => {
        const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
        const w = e.currentTarget.getBoundingClientRect().width;
        if (x < w / 3) setIdx(Math.max(0, idx - 1));else
        setIdx(idx + 1 >= STORIES.length ? idx : idx + 1);
      }}>

        <div style={{
          alignSelf: 'flex-start',
          fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
          background: s.bg, color: '#000',
          padding: '6px 10px', borderRadius: 999,
          textTransform: 'uppercase'
        }}>{content.eyebrow}</div>

        <div style={{ marginTop: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            width: 132, height: 132, borderRadius: 32,
            background: s.bg, color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64, marginBottom: 26
          }}>{s.emoji}</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.1, letterSpacing: -0.3 }} dangerouslySetInnerHTML={{ __html: content.title }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={{ __html: content.body }} />
        </div>
      </div>

      <div style={{ padding: '14px 18px 28px' }}>
        <button
          className="kk-btn"
          style={{ background: '#fff', color: '#000' }}
          onClick={(e) => {
            e.stopPropagation();
            if (s.id === 'meet') {onChatWith && onChatWith(null);onClose();} else
            if (s.id === 'vet') {openTile && openTile('soon-vet');onClose();} else
            onClose();
          }}>

          {s.id === 'beta' ? 'Спасибо!' : s.id === 'meet' ? 'Хочу к Кусь' : s.id === 'vet' ? 'Когда уже?' : 'Понятно'}
        </button>
      </div>
    </div>);

}

Object.assign(window, { HomeScreen, StoryViewer, STORIES });
