// chat.jsx — Чат с Кусь (with proactive scenarios + escalation to human)

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

const QUICK_QS = [
  'Какая норма веса для&nbsp;метиса?',
  'Кот плохо ест, что делать?',
  'Сколько спать — это норма?',
  'Когда делать прививки?',
  'Как мыть кошку?',
  'Чем кормить котёнка?',
];

const SEED_MESSAGES = [
  { id: 1, from: 'ai', day: 'yesterday', text: 'Привет! Я Кусь — помощник KOSH KUSE. Спросите что угодно: о&nbsp;питании, поведении, здоровье. Если ответ требует специалиста — позову человека.' },
  { id: 2, from: 'ai', day: 'yesterday', text: 'Я уже посмотрел паспорт Луны и&nbsp;увидел, что вес — 4,2&nbsp;кг — в&nbsp;норме для метиса 3 лет. Дам знать, если что-то изменится.' },
  { id: 3, from: 'ai', day: 'today', kind: 'proactive', title: 'Утреннее наблюдение', text: 'Заметил: за&nbsp;вчера Луна не отметилась ни в&nbsp;одной активности. Это не страшно, но&nbsp;давайте проверим — всё в&nbsp;порядке?',
    quick: ['Всё ок, забыл отметить', 'Стала вялой', 'Не вижу разницы'] },
];

/* ─── Guided "plan builder" flow (triggered from Home "Составить план") ─── */
const PLAN_SENTINEL = '__plan_activity__';
const PLAN_INTRO = 'Составь, пожалуйста, план активности для Луны';
const PLAN_STEPS = [
  {
    key: 'duration',
    q: 'Отлично, давайте соберём план активности для&nbsp;Луны 🐾<br/>Сколько времени в&nbsp;день готовы уделять играм?',
    options: [
      { label: '10 минут', value: '10 минут' },
      { label: '15 минут', value: '15 минут' },
      { label: '30 минут', value: '30 минут' },
    ],
  },
  {
    key: 'time',
    q: 'Когда удобнее играть с&nbsp;Луной?',
    options: [
      { label: 'Утром', value: 'утром' },
      { label: 'Вечером после&nbsp;19:00', value: 'вечером' },
      { label: 'В течение дня', value: 'в течение дня' },
    ],
  },
  {
    key: 'toy',
    q: 'Что Луне нравится больше всего? Можно выбрать или&nbsp;написать своё.',
    options: [
      { label: 'Удочка-дразнилка', value: 'удочка' },
      { label: 'Мячики и&nbsp;мышки', value: 'мячики' },
      { label: 'Лазерная указка', value: 'лазер' },
      { label: 'Пока не знаю', value: 'не знаю' },
    ],
  },
];

/* Build the final plan + the tasks to drop into «Сегодня» */
function buildActivityPlan(a) {
  const toyMap = { 'удочка': 'удочка-дразнилка', 'мячики': 'мячики и&nbsp;мышки', 'лазер': 'лазерная указка', 'не знаю': 'разные игрушки' };
  const timeMap = { 'утром': 'утром', 'вечером': 'вечером после&nbsp;19:00', 'в течение дня': 'в&nbsp;течение дня' };
  const toy = toyMap[a.toy] || a.toy || 'разные игрушки';
  const time = timeMap[a.time] || a.time || 'вечером';
  const dur = a.duration || '15 минут';
  return {
    summaryHtml: `Готово! Собрал план активности для&nbsp;Луны 🐾<br/><br/>• <b>${dur}</b> активной игры — ${time}<br/>• Игрушка: <b>${toy}</b><br/>• Лёгкая разминка 5&nbsp;минут утром<br/><br/>Добавил пункты в&nbsp;«Сегодня» на&nbsp;главном экране. Отмечайте выполненное — будут лапки.`,
    tasks: [
      { id: 'plan-play', title: `${dur} игры · ${toy}`, sub: `${time} · план Кусь`, reward: 15, kind: 'play' },
      { id: 'plan-warmup', title: 'Разминка 5&nbsp;минут', sub: 'утром · план Кусь', reward: 5, kind: 'warmup' },
    ],
  };
}

function ChatScreen({ onTab, onBack, seed, clearSeed, onPlanReady }) {
  const [messages, setMessages] = useStateC(SEED_MESSAGES);
  const [draft, setDraft] = useStateC('');
  const [typing, setTyping] = useStateC(false);
  const [mode, setMode] = useStateC('ai'); // ai | human
  const [showHumanModal, setShowHumanModal] = useStateC(false);
  const [wizard, setWizard] = useStateC(null); // null | { step, answers } — guided plan flow
  const wizardRef = useRefC(null);             // authoritative current step (avoids stale-closure answers)
  const setWiz = (next) => { wizardRef.current = next; setWizard(next); };
  const scrollRef = useRefC(null);

  useEffectC(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  // when a seed prefill arrives: a sentinel starts the guided plan flow,
  // anything else is dropped into the composer (e.g. from "Идеи", "Уточнить").
  useEffectC(() => {
    if (!seed) return;
    if (seed === PLAN_SENTINEL) {
      startPlan();
    } else {
      setDraft(seed);
    }
    clearSeed && clearSeed();
  }, [seed]);

  function send(textOverride) {
    const text = (textOverride !== undefined ? textOverride : draft).trim();
    if (!text) return;
    // While the plan wizard is active, a typed message is an answer to the
    // current step (free-text), not a normal question to the assistant.
    if (wizardRef.current) {
      setDraft('');
      answerPlan(wizardRef.current.step, text, text);
      return;
    }
    const id = Date.now();
    setMessages(m => [...m, { id, from: 'user', text, day: 'today' }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, generateReply(text, id + 1)]);
    }, 1200 + Math.random() * 600);
  }

  /* ─── guided plan flow ─── */
  function startPlan() {
    setMessages(m => [...m, { id: Date.now(), from: 'user', day: 'today', text: PLAN_INTRO }]);
    setWiz({ step: 0, answers: {} });
    askPlanStep(0);
  }
  function askPlanStep(stepIndex) {
    const step = PLAN_STEPS[stepIndex];
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        id: Date.now(), from: 'ai', day: 'today',
        kind: 'wizard', text: step.q, options: step.options, stepIndex,
      }]);
    }, 650);
  }
  function answerPlan(stepIndex, value, label) {
    const w = wizardRef.current;
    if (!w || w.step !== stepIndex) return; // ignore taps on already-answered questions
    setMessages(m => [...m, { id: Date.now(), from: 'user', day: 'today', text: label || value }]);
    const answers = { ...w.answers, [PLAN_STEPS[stepIndex].key]: value };
    const next = stepIndex + 1;
    if (next < PLAN_STEPS.length) {
      setWiz({ step: next, answers });
      askPlanStep(next);
    } else {
      setWiz(null);
      finishPlan(answers);
    }
  }
  function finishPlan(answers) {
    const plan = buildActivityPlan(answers);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now(), from: 'ai', day: 'today', kind: 'planDone', text: plan.summaryHtml }]);
      onPlanReady && onPlanReady(plan.tasks);
    }, 900);
  }

  function generateReply(input, id) {
    const t = input.toLowerCase();
    if (/анализ|кров|узи|клиник/.test(t)) {
      return {
        id, from: 'ai', day: 'today',
        text: 'Я использую адрес из&nbsp;вашего профиля — ул. Тверская, 12. Ближайшая клиника: «Зоовет», ул. Большая Дмитровка, 18.<br/><br/>Можно сдать: общий и&nbsp;биохимия крови, моча, при необходимости — УЗИ. Лучше записаться заранее. Хотите, подскажу, что именно сдать в&nbsp;вашем случае?',
      };
    }
    if (/норм|вес|сколько/.test(t)) {
      return {
        id, from: 'ai', day: 'today',
        text: 'Для метиса 3 лет норма веса — 3,8–4,8&nbsp;кг. У&nbsp;Луны 4,2&nbsp;кг — это&nbsp;центр нормы. Можно расслабиться 🙂',
        quick: ['А по&nbsp;активности?', 'Какая суточная норма еды?'],
      };
    }
    if (/прив/.test(t)) {
      return {
        id, from: 'ai', day: 'today',
        text: 'Базовый график: первая прививка в&nbsp;2 месяца, ревакцинация через 3–4 недели, далее ежегодно. По&nbsp;вашему паспорту: статус «частично» — стоит уточнить с&nbsp;ветеринаром. Позвать специалиста?',
        quick: ['Да, позови', 'Позже'],
      };
    }
    if (/не ест|плохо ест|отказ/.test(t)) {
      return {
        id, from: 'ai', day: 'today',
        text: 'Кот может отказаться от&nbsp;еды по&nbsp;разным причинам — от&nbsp;стресса до&nbsp;проблем со&nbsp;здоровьем. Скажите, как давно он не ест и&nbsp;есть ли другие симптомы (вялость, рвота, изменение поведения)?',
      };
    }
    return {
      id, from: 'ai', day: 'today',
      text: 'Поняла. Дайте секунду — соберу ответ из&nbsp;ветеринарной базы. Если поймём, что нужен специалист, позову человека.',
    };
  }

  function escalateToHuman() {
    setShowHumanModal(false);
    setMode('human');
    setMessages(m => [
      ...m,
      { id: Date.now(), from: 'sys', day: 'today', text: 'Оператор Игорь подключается к&nbsp;чату…' },
    ]);
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { id: Date.now() + 1, from: 'human', name: 'Игорь', day: 'today',
          text: 'Добрый день! Это Игорь, специалист поддержки. Дайте пару минут — ознакомлюсь с&nbsp;историей чата и&nbsp;паспортом Луны.' },
      ]);
    }, 1600);
  }

  return (
    <div className="kk-screen">
      <KKStatus />
      {/* Header */}
      <div style={{
        height: 64, padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--kk-line)',
        background: 'var(--kk-bg)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 0, padding: 6 }}>
          <IconBack size={20} color="var(--kk-ink-3)"/>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: 19, background: 'var(--kk-pink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {mode === 'ai' ? <IconPaw size={18} color="#000"/> : <IconHeadset size={18} color="#000"/>}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: 5,
            background: mode === 'ai' ? '#26994D' : '#FF9500',
            border: '2px solid #fff',
          }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {mode === 'ai' ? 'Кусь' : 'Игорь'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--kk-ink-3)' }}>
            {mode === 'ai' ? 'AI · отвечает мгновенно' : 'Оператор · в&nbsp;чате'}
          </div>
        </div>
        {mode === 'ai' && (
          <button
            onClick={() => setShowHumanModal(true)}
            style={{
              height: 30, padding: '0 12px', borderRadius: 15,
              background: 'var(--kk-bg-soft)', border: 0,
              fontSize: 11, fontWeight: 500, color: 'var(--kk-ink)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
          >
            <IconHeadset size={13}/> Позвать человека
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="kk-scroll" ref={scrollRef} style={{
        padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 10,
        background: 'var(--kk-bg)',
      }}>
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showDay = !prev || prev.day !== m.day;
          return (
            <React.Fragment key={m.id}>
              {showDay && (
                <div style={{
                  alignSelf: 'center', fontSize: 10,
                  color: 'var(--kk-ink-4)', textTransform: 'uppercase',
                  letterSpacing: 0.6, fontWeight: 500, margin: '6px 0',
                }}>
                  {m.day === 'yesterday' ? 'Вчера' : 'Сегодня'}
                </div>
              )}
              {m.kind === 'proactive' ? (
                <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                  <div style={{
                    background: '#FFF', border: '1px solid var(--kk-line)',
                    borderRadius: 18, borderBottomLeftRadius: 6,
                    padding: 14,
                  }}>
                    <div className="kk-prokard-meta" style={{ marginBottom: 4 }}>🔔 ПРОАКТИВНО</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }} dangerouslySetInnerHTML={{__html: m.title}}/>
                    <div style={{ fontSize: 13, color: 'var(--kk-ink-2)', lineHeight: 1.45 }} dangerouslySetInnerHTML={{__html: m.text}}/>
                  </div>
                  {m.quick && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {m.quick.map(q => (
                        <button key={q} className="kk-chip kk-chip-outline" onClick={() => send(q.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''))} dangerouslySetInnerHTML={{__html: q}}/>
                      ))}
                    </div>
                  )}
                </div>
              ) : m.from === 'sys' ? (
                <div style={{
                  alignSelf: 'center', fontSize: 11,
                  color: 'var(--kk-ink-3)', padding: '6px 12px',
                  background: 'var(--kk-bg-soft)', borderRadius: 999,
                }} dangerouslySetInnerHTML={{__html: m.text}}/>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div
                    className={`kk-bubble ${m.from === 'user' ? 'kk-bubble-user' : 'kk-bubble-ai'}`}
                    dangerouslySetInnerHTML={{__html: m.text}}
                  />
                  {m.quick && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {m.quick.map(q => (
                        <button key={q} className="kk-chip kk-chip-outline" onClick={() => send(q.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''))} dangerouslySetInnerHTML={{__html: q}}/>
                      ))}
                    </div>
                  )}
                  {m.kind === 'wizard' && m.options && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {m.options.map(opt => (
                        <button
                          key={opt.value}
                          className="kk-chip kk-chip-outline"
                          onClick={() => answerPlan(m.stepIndex, opt.value, opt.label)}
                          dangerouslySetInnerHTML={{__html: opt.label}}
                        />
                      ))}
                    </div>
                  )}
                  {m.kind === 'planDone' && (
                    <button
                      className="kk-btn kk-btn-primary kk-btn-sm"
                      style={{ marginTop: 8 }}
                      onClick={() => onTab('home')}
                    >Открыть «Сегодня»</button>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
        {typing && (
          <div className="kk-bubble kk-bubble-ai" style={{ width: 56 }}>
            <div className="kk-typing"><span/><span/><span/></div>
          </div>
        )}
        {messages.length <= 3 && !typing && (
          <div style={{ marginTop: 14 }}>
            <div className="kk-prokard-meta" style={{ marginLeft: 4, marginBottom: 6 }}>БЫСТРЫЕ ВОПРОСЫ</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_QS.map(q => (
                <button key={q} className="kk-chip kk-chip-outline" onClick={() => send(q.replace(/&nbsp;/g, ' '))} dangerouslySetInnerHTML={{__html: q}}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{
        padding: '10px 14px 14px',
        borderTop: '1px solid var(--kk-line)',
        background: 'var(--kk-bg)',
        display: 'flex', gap: 10, alignItems: 'center',
        flexShrink: 0,
      }}>
        <input
          className="kk-input"
          style={{ background: 'var(--kk-bg-soft)' }}
          placeholder={wizard ? 'Выберите вариант или напишите свой…' : mode === 'ai' ? 'Напишите вопрос…' : 'Сообщение Игорю…'}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={() => send()}
          disabled={!draft.trim()}
          style={{
            width: 46, height: 46, borderRadius: 23,
            background: draft.trim() ? 'var(--kk-ink)' : 'var(--kk-line)',
            border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background .12s',
          }}
        >
          <IconSend size={18} color="#fff"/>
        </button>
      </div>

      <KKBottomNav active="chat" onChange={onTab}/>

      {showHumanModal && (
        <div className="kk-modal-bg" onClick={() => setShowHumanModal(false)}>
          <div className="kk-sheet" onClick={e => e.stopPropagation()}>
            <div className="kk-sheet-handle"/>
            <div style={{
              width: 56, height: 56, borderRadius: 28, background: 'var(--kk-pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <IconHeadset size={26} color="#000"/>
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>
              Подключить специалиста?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', textAlign: 'center', margin: '0 0 22px', lineHeight: 1.5 }}>
              Передам историю чата и&nbsp;паспорт Луны. Среднее время ответа — 4&nbsp;минуты.
            </p>
            <div style={{
              background: 'var(--kk-bg-soft)', borderRadius: 14, padding: 14,
              display: 'flex', gap: 10, marginBottom: 18,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--kk-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconHeadset size={15} color="#000"/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Игорь · оператор</div>
                <div style={{ fontSize: 11, color: 'var(--kk-ink-3)' }}>Передам ветеринару, если потребуется</div>
              </div>
            </div>
            <button className="kk-btn kk-btn-primary" onClick={escalateToHuman}>Подключить</button>
            <button className="kk-btn kk-btn-ghost" style={{ marginTop: 4 }} onClick={() => setShowHumanModal(false)}>Не сейчас</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ChatScreen });
