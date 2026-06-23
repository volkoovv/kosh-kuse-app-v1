// faq.jsx — Полноценный экран «Частые вопросы»

const { useState: useStateF } = React;

const FAQ_CATS = [
  { id: 'all',     label: 'Все' },
  { id: 'product', label: 'Продукт' },
  { id: 'food',    label: 'Корм' },
  { id: 'beta',    label: 'Бета' },
  { id: 'kus',     label: 'Кусь' },
  { id: 'data',    label: 'Данные' },
  { id: 'pay',     label: 'Оплата' },
];

const FAQ_ITEMS = [
  // PRODUCT
  {
    cat: 'product',
    q: 'Что вообще такое Kosh Kuse?',
    a: 'Подписочная система заботы о&nbsp;кошке: премиум-корм + ассистент Кусь + сеть сервисов (ветеринар, грумминг, отели). На&nbsp;старте доступен Кусь и&nbsp;цифровой паспорт — корм и&nbsp;остальное подключаются поэтапно.',
  },
  {
    cat: 'product',
    q: 'Когда появится корм?',
    a: 'Старт продаж — <b>июль 2026</b>. Сейчас идёт закрытая бета на&nbsp;500 человек: тестируем систему ухода до&nbsp;момента, когда корм будет в&nbsp;продаже.',
  },
  {
    cat: 'product',
    q: 'А ветеринар?',
    a: 'Чат с&nbsp;ветеринаром и&nbsp;закреплённый «семейный ветеринар» (в&nbsp;премиум-тарифе) — следующая после&nbsp;корма функция. Пока можно из&nbsp;чата Кусь позвать «кожаного» оператора — он передаст специалисту.',
  },
  {
    cat: 'product',
    q: 'Где работает приложение?',
    a: 'Сейчас — WebApp и&nbsp;Telegram Mini App. С&nbsp;запуском подписки постараемся выпустить нативные приложения для&nbsp;iOS и&nbsp;Android. Все версии — одна и&nbsp;та&nbsp;же логика.',
  },

  // FOOD
  {
    cat: 'food',
    q: 'Что такое «холистик из&nbsp;ресторанных продуктов»?',
    a: 'Холистик-корм делается из&nbsp;ингредиентов человеческого пищевого класса — тех&nbsp;же, что идут в&nbsp;рестораны. Без&nbsp;субпродуктов «не&nbsp;для&nbsp;людей», без&nbsp;дешёвых наполнителей.',
  },
  {
    cat: 'food',
    q: 'Что такое эксклюзивный премикс?',
    a: 'Премикс — концентрат витаминов и&nbsp;микроэлементов, добавляемый в&nbsp;корм. Наш разработан с&nbsp;ветеринарами специально под&nbsp;Kosh Kuse: даёт полный профиль микронутриентов без&nbsp;добавок «на&nbsp;всякий случай».',
  },
  {
    cat: 'food',
    q: 'Как часто будете доставлять?',
    a: 'Раз в&nbsp;неделю — каждую партию упаковываем свежей. На&nbsp;старте — только Москва, дальше будем расширять зоны.',
  },
  {
    cat: 'food',
    q: 'Можно пробник?',
    a: 'Пробники — на&nbsp;этапе закрытого тестирования. Если вы в&nbsp;бете и&nbsp;живёте в&nbsp;Москве — вас могут пригласить отдельно (следите за&nbsp;историями в&nbsp;разделе «Сегодня»).',
  },
  {
    cat: 'food',
    q: 'Сколько будет стоить подписка?',
    a: 'Три тарифа:<br/>• <b>Базовый</b> — ~20&nbsp;000&nbsp;₽<br/>• <b>Средний</b> — ~25–30&nbsp;000&nbsp;₽ (+ ветеринар)<br/>• <b>Премиум</b> — ~40&nbsp;000&nbsp;₽ (+ семейный ветеринар, приоритет)<br/><br/>Цены ориентировочные, финал — к&nbsp;старту продаж в&nbsp;июле.',
  },

  // BETA
  {
    cat: 'beta',
    q: 'Что значит «ранний доступ на&nbsp;500»?',
    a: 'На&nbsp;старте мы открываем продукт ограниченной группе — чтобы протестировать модель, отработать инфраструктуру и&nbsp;собрать раннее сообщество. Вы уже внутри.',
  },
  {
    cat: 'beta',
    q: 'Это бесплатно?',
    a: 'Да, до&nbsp;старта продаж корма (июль 2026). Все функции Кусь, паспорт, база знаний — без&nbsp;ограничений.',
  },
  {
    cat: 'beta',
    q: 'Будут ли скидки участникам беты?',
    a: 'Да — для&nbsp;участников беты планируем спец-условия на&nbsp;первую подписку. Конкретику пришлём в&nbsp;уведомлениях ближе к&nbsp;запуску.',
  },
  {
    cat: 'beta',
    q: 'Что если я хочу пригласить друга?',
    a: 'Реферальная система готовится. Пока — просто поделитесь приложением: места в&nbsp;бете ещё есть, но&nbsp;кончатся.',
  },

  // KUS (assistant)
  {
    cat: 'kus',
    q: 'Что умеет Кусь?',
    a: '• Отвечает на&nbsp;вопросы о&nbsp;питании, поведении, здоровье<br/>• Хранит цифровой паспорт питомца<br/>• Сам замечает отклонения (вес, активность) и&nbsp;пишет первым<br/>• Зовёт живого специалиста, если задача за&nbsp;пределами его компетенции',
  },
  {
    cat: 'kus',
    q: 'Это настоящий AI или&nbsp;шаблоны?',
    a: 'Связка двух частей. Ветеринарная база знаний — отвечает на&nbsp;типовые вопросы. AI — переформулирует под&nbsp;вашу ситуацию и&nbsp;интерпретирует данные паспорта.',
  },
  {
    cat: 'kus',
    q: 'Может ли Кусь поставить диагноз?',
    a: 'Нет. Кусь даёт ориентиры и&nbsp;общие рекомендации, но&nbsp;никогда не&nbsp;заменяет очный приём ветеринара. При&nbsp;любых тревожных симптомах — переключаемся на&nbsp;живого специалиста.',
  },
  {
    cat: 'kus',
    q: 'Как позвать человека?',
    a: 'В&nbsp;чате — кнопка «Позвать человека» в&nbsp;шапке. Кусь передаст историю и&nbsp;паспорт оператору, среднее время ответа — 4 минуты.',
  },
  {
    cat: 'kus',
    q: 'Кусь часто пишет — можно его выключить?',
    a: 'Да: <b>Профиль → Уведомления → Проактивные сценарии</b>. Если выключите — Кусь будет отвечать только на&nbsp;ваши вопросы, без&nbsp;инициативы.',
  },

  // DATA
  {
    cat: 'data',
    q: 'Какие данные вы собираете?',
    a: 'Только то, что нужно для&nbsp;работы продукта: контакт (телефон), профиль питомца (порода, вес, возраст и&nbsp;т.п.), история чата с&nbsp;Кусь. <b>Медицинских данных мы не&nbsp;собираем</b> — это вне V1.',
  },
  {
    cat: 'data',
    q: 'Передаёте ли данные третьим лицам?',
    a: 'Нет. Данные хранятся у&nbsp;нас. Аналитика обезличена. Подробности — в&nbsp;политике конфиденциальности.',
  },
  {
    cat: 'data',
    q: 'Как удалить аккаунт?',
    a: 'В&nbsp;разделе «Питомец» — кнопка «Удалить питомца». Чтобы стереть аккаунт целиком — напишите в&nbsp;поддержку из&nbsp;чата.',
  },

  // PAY
  {
    cat: 'pay',
    q: 'Какие способы оплаты будут?',
    a: 'ЮKassa: карты, СБП, ApplePay/GooglePay. Появится вместе с&nbsp;подпиской — в&nbsp;июле.',
  },
  {
    cat: 'pay',
    q: 'Можно поставить подписку на&nbsp;паузу?',
    a: 'Да — пауза, изменение частоты, отмена и&nbsp;возобновление будут в&nbsp;разделе «Подписка» после&nbsp;запуска корма.',
  },
];

function FAQScreen({ onBack, onTab, onChat, onHelp, showToast }) {
  const [query, setQuery] = useStateF('');
  const [cat, setCat] = useStateF('all');
  const [open, setOpen] = useStateF({});

  const filtered = FAQ_ITEMS.filter(it => {
    if (cat !== 'all' && it.cat !== cat) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (it.q + ' ' + it.a).toLowerCase().replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').includes(q);
  });

  // Group by category when "all" + no query
  const grouped = (cat === 'all' && !query)
    ? FAQ_CATS.slice(1).map(c => ({ ...c, items: filtered.filter(it => it.cat === c.id) }))
    : null;

  function toggle(idx) {
    setOpen(o => ({ ...o, [idx]: !o[idx] }));
  }

  function openAll() {
    const next = {};
    filtered.forEach((_, i) => next[`${cat}-${query}-${i}`] = true);
    setOpen(next);
  }

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar
        title="ЧАСТЫЕ ВОПРОСЫ"
        onBack={onBack}
        left="Профиль"
        right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}
      />

      <div className="kk-scroll" style={{ padding: '14px 18px 22px' }}>
        {/* Header lede */}
        <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', lineHeight: 1.5, margin: '4px 0 14px' }}>
          Если ответа нет — нажмите «Спросить у&nbsp;Кусь» в&nbsp;конце страницы.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <input
            className="kk-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по вопросам"
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

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -18px 14px', padding: '0 18px 4px' }}>
          {FAQ_CATS.map(c => (
            <button
              key={c.id}
              className={`kk-chip ${cat === c.id ? 'is-active' : ''}`}
              onClick={() => setCat(c.id)}
            >{c.label}</button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            padding: '38px 20px', textAlign: 'center',
            color: 'var(--kk-ink-3)', fontSize: 13,
          }}>
            Не нашли ответ.
            <button
              className="kk-btn kk-btn-primary"
              style={{ marginTop: 14 }}
              onClick={() => onChat(query || null)}
            >Спросить у&nbsp;Кусь</button>
          </div>
        )}

        {/* Grouped by category (when no filter) */}
        {grouped && grouped.map(g => g.items.length > 0 && (
          <div key={g.id} style={{ marginBottom: 22 }}>
            <div className="kk-section-label" style={{ marginBottom: 8, paddingLeft: 2 }}>{g.label.toUpperCase()}</div>
            <div className="kk-card" style={{ padding: 0 }}>
              {g.items.map((it, i) => {
                const key = `${g.id}-${i}`;
                return (
                  <FAQRow
                    key={key}
                    item={it}
                    open={open[key]}
                    onToggle={() => toggle(key)}
                    onChat={onChat}
                    showToast={showToast}
                    isLast={i === g.items.length - 1}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Flat list (filter / search active) */}
        {!grouped && filtered.length > 0 && (
          <div className="kk-card" style={{ padding: 0 }}>
            {filtered.map((it, i) => {
              const key = `${cat}-${query}-${i}`;
              return (
                <FAQRow
                  key={key}
                  item={it}
                  open={open[key]}
                  onToggle={() => toggle(key)}
                  onChat={onChat}
                  showToast={showToast}
                  isLast={i === filtered.length - 1}
                  showCat
                />
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
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
            <div style={{ fontSize: 13, fontWeight: 600 }}>Не помогло?</div>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }}>Спросите у&nbsp;Кусь — отвечает мгновенно</div>
          </div>
          <button className="kk-btn kk-btn-primary kk-btn-sm" onClick={() => onChat(null)}>
            Открыть
          </button>
        </div>

        <button
          className="kk-btn kk-btn-ghost"
          style={{ marginTop: 10 }}
          onClick={() => onChat('Позови, пожалуйста, человека из поддержки')}
        >Написать живому человеку</button>

        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--kk-ink-4)', marginTop: 22, lineHeight: 1.5 }}>
          Обновляем по&nbsp;мере появления вопросов от&nbsp;комьюнити
        </div>
      </div>

      <KKBottomNav active="settings" onChange={onTab}/>
    </div>
  );
}

function FAQRow({ item, open, onToggle, onChat, isLast, showCat, showToast }) {
  const catLabel = (FAQ_CATS.find(c => c.id === item.cat) || {}).label;
  return (
    <div style={{ borderBottom: isLast ? 0 : '1px solid var(--kk-line)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left',
          background: 'none', border: 0,
          padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {showCat && (
            <div className="kk-prokard-meta" style={{ marginBottom: 4 }}>{catLabel}</div>
          )}
          <div
            style={{ fontSize: 14, fontWeight: open ? 700 : 600, color: 'var(--kk-ink)', lineHeight: 1.35 }}
            dangerouslySetInnerHTML={{__html: item.q}}
          />
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: 12,
          background: open ? 'var(--kk-ink)' : 'var(--kk-bg-soft)',
          color: open ? '#fff' : 'var(--kk-ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all .15s',
          marginTop: 2,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px 16px', animation: 'kk-fade-in .2s ease' }}>
          <div
            style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--kk-ink-2)' }}
            dangerouslySetInnerHTML={{__html: item.a}}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              className="kk-chip kk-chip-outline"
              onClick={() => onChat('Уточни: ' + item.q.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''))}
              style={{ height: 28, fontSize: 11 }}
            >Уточнить у&nbsp;Кусь</button>
            <button
              className="kk-chip kk-chip-outline"
              onClick={() => showToast && showToast('Спасибо за фидбек! 🐾')}
              style={{ height: 28, fontSize: 11 }}
            >👍 Полезно</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { FAQScreen, FAQ_ITEMS, FAQ_CATS });
