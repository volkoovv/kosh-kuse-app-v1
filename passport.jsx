// passport.jsx — Multi-step pet-passport creation (digital pet passport)

const { useState: useStateP } = React;

const PASSPORT_STEPS = [
'name', // имя + тип
'breed', // порода
'birthday', // возраст / дата рождения
'physical', // вес + стерилизация
'diet', // рацион + сколько ест
'activity', // активность + где живёт
'health', // прививки + аллергии
'concerns', // переживания владельца
'analyzing' // загрузка с разбором
];

function PassportFlow({ onDone, onBack, onHelp, onSkip }) {
  const [step, setStep] = useStateP(0);
  const [data, setData] = useStateP({
    name: 'Луна', species: 'cat', sex: 'female',
    breed: 'Метис', breedKnown: true,
    birthday: '15 мар 2023',
    weight: '4.2', sterilized: 'yes',
    diet: 'wet+dry', mealsPerDay: 2, portion: '60',
    activity: 'medium', habitat: 'apartment',
    vaccinations: 'partial', allergies: '',
    concerns: ''
  });

  const stepKey = PASSPORT_STEPS[step];
  const isLastInput = step === PASSPORT_STEPS.length - 2;
  const isAnalyzing = stepKey === 'analyzing';

  function next() {
    if (step < PASSPORT_STEPS.length - 1) setStep((s) => s + 1);else
    onDone(data);
  }
  function back() {
    if (step === 0) onBack();else
    setStep((s) => s - 1);
  }

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar
        title="ЦИФРОВОЙ ПАСПОРТ"
        onBack={back}
        right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14} /></button>} />

      {!isAnalyzing &&
      <div style={{ padding: '12px 24px 0' }}>
          <div className="kk-progress">
            {PASSPORT_STEPS.slice(0, -1).map((_, i) =>
          <div key={i} className={`kk-progress-cell ${i <= step ? 'is-active' : ''}`} />
          )}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--kk-ink-4)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Шаг {step + 1} из {PASSPORT_STEPS.length - 1}
          </div>
        </div>
      }

      <div className="kk-scroll" style={{ padding: isAnalyzing ? 0 : '12px 24px 24px' }} key={step}>
        <div data-comment-anchor="9d954cd6be-div-65-9">
          {stepKey === 'name' && <NameStep data={data} setData={setData} />}
          {stepKey === 'breed' && <BreedStep data={data} setData={setData} />}
          {stepKey === 'birthday' && <BirthdayStep data={data} setData={setData} />}
          {stepKey === 'physical' && <PhysicalStep data={data} setData={setData} />}
          {stepKey === 'diet' && <DietStep data={data} setData={setData} />}
          {stepKey === 'activity' && <ActivityStep data={data} setData={setData} />}
          {stepKey === 'health' && <HealthStep data={data} setData={setData} />}
          {stepKey === 'concerns' && <ConcernsStep data={data} setData={setData} />}
          {stepKey === 'analyzing' && <AnalyzingStep data={data} onDone={() => onDone(data)} />}
        </div>
      </div>

      {!isAnalyzing &&
      <div style={{
        padding: '14px 24px 22px',
        borderTop: '1px solid var(--kk-line)',
        background: 'var(--kk-bg)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
          <button className="kk-btn kk-btn-primary" onClick={next}>
            {isLastInput ? 'Завершить' : 'Далее'}
          </button>
          {step >= 2 && !isLastInput && onSkip &&
          <button className="kk-btn kk-btn-ghost" onClick={onSkip}>
              Пропустить — заполню позже
            </button>
          }
        </div>
      }
    </div>);

}

/* ─── Step 1: Name + species ─── */
function NameStep({ data, setData }) {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Расскажите о&nbsp;питомце</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Чтобы я давал точные советы, начнём с&nbsp;имени и&nbsp;типа.
      </p>

      <div className="kk-field-label">Как зовут?</div>
      <input
        className="kk-input"
        value={data.name}
        placeholder="Луна, Барсик, Котлета…"
        onChange={(e) => setData({ ...data, name: e.target.value })} />


      <div className="kk-field-label" style={{ marginTop: 22 }}>Кошка или кот?</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
        { id: 'female', label: 'Кошка', emoji: '🐱' },
        { id: 'male', label: 'Кот', emoji: '😼' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.sex === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, sex: opt.id })}>

            <span className="kk-pick-emoji">{opt.emoji}</span>
            <span style={{ fontWeight: 500 }}>{opt.label}</span>
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--kk-ink-4)' }}>
        Скоро · собаки и&nbsp;другие питомцы
      </div>
    </>);

}

/* ─── Step 2: Breed ─── */
function BreedStep({ data, setData }) {
  const popular = ['Метис', 'Британская', 'Шотландская', 'Мейн-кун', 'Сфинкс', 'Сиамская', 'Не знаю породу'];
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Порода</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Это влияет на&nbsp;нормы веса, рацион и&nbsp;типичные риски.
      </p>

      <div className="kk-field-label">Поиск или выбор</div>
      <input
        className="kk-input"
        value={data.breed}
        onChange={(e) => setData({ ...data, breed: e.target.value })}
        placeholder="Начните вводить породу" />


      <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 22, marginBottom: 10, fontWeight: 500 }}>
        Популярные
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {popular.map((b) =>
        <button
          key={b}
          className={`kk-chip ${data.breed === b ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, breed: b, breedKnown: b !== 'Не знаю породу' })}>

            {b}
          </button>
        )}
      </div>
    </>);

}

/* ─── Step 3: Birthday ─── */
function BirthdayStep({ data, setData }) {
  const [picker, setPicker] = useStateP(false);

  function quickPick(yearAgo, monthLabel) {
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const y = 2026 - yearAgo;
    setData({ ...data, birthday: `15 ${monthLabel} ${y}` });
    setPicker(false);
  }
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Когда родился?</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Возраст помогает понять, какой рацион и&nbsp;нагрузка подходят.
      </p>

      <div className="kk-field-label">Дата рождения</div>
      <button
        className="kk-input"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
        onClick={() => setPicker(true)}>

        <span>{data.birthday}</span>
        <IconCalendar size={18} color="var(--kk-ink-3)" />
      </button>

      <div className="kk-field-label" style={{ marginTop: 22 }}>Или укажите примерно</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
        { id: '0-1', label: 'до 1 года' },
        { id: '1-3', label: '1–3 года' },
        { id: '3-7', label: '3–7 лет' },
        { id: '7+', label: 'старше 7' }].
        map((b) =>
        <button
          key={b.id}
          className={`kk-pick ${data.ageBand === b.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, ageBand: b.id })}
          style={{ justifyContent: 'center' }}>

            <span style={{ fontWeight: 500 }}>{b.label}</span>
          </button>
        )}
      </div>

      <div className="kk-banner kk-banner-soft" style={{ marginTop: 22 }}>
        <IconSparkle size={16} color="var(--kk-pink-deep)" />
        <span>Не помните точно? Это нормально — я уточню по&nbsp;поведению позже.</span>
      </div>

      {picker &&
      <div className="kk-modal-bg" onClick={() => setPicker(false)}>
          <div className="kk-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="kk-sheet-handle" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>Выберите дату</h3>
            <p style={{ fontSize: 12, color: 'var(--kk-ink-3)', margin: '0 0 14px' }}>
              Быстрый выбор по&nbsp;году рождения. Точное число можно поставить позже.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
            { y: 0, label: '2026 · в&nbsp;этом году' },
            { y: 1, label: '2025 · 1 год' },
            { y: 2, label: '2024 · 2 года' },
            { y: 3, label: '2023 · 3 года' },
            { y: 5, label: '2021 · ~5 лет' },
            { y: 8, label: '2018 · ~8 лет' }].
            map((o) =>
            <button
              key={o.y}
              onClick={() => quickPick(o.y, 'мар')}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--kk-bg-soft)', border: 0,
                borderRadius: 12, fontSize: 14, color: 'var(--kk-ink)',
                textAlign: 'left'
              }}
              dangerouslySetInnerHTML={{ __html: o.label }} />

            )}
            </div>
            <button className="kk-btn kk-btn-ghost" style={{ marginTop: 14 }} onClick={() => setPicker(false)}>Закрыть</button>
          </div>
        </div>
      }
    </>);

}

/* ─── Step 4: Weight + sterilization ─── */
function PhysicalStep({ data, setData }) {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Физические данные</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Помогает сравнить с&nbsp;нормой для&nbsp;породы.
      </p>

      <div className="kk-field-label">Вес</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          className="kk-input"
          value={data.weight}
          onChange={(e) => setData({ ...data, weight: e.target.value })}
          inputMode="decimal"
          style={{ flex: 1 }} />

        <span style={{ fontSize: 13, color: 'var(--kk-ink-3)', minWidth: 24 }}>кг</span>
      </div>

      <div className="kk-field-label" style={{ marginTop: 22 }}>Стерилизация / кастрация</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
        { id: 'yes', label: 'Да' },
        { id: 'no', label: 'Нет' },
        { id: 'unknown', label: 'Не знаю' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.sterilized === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, sterilized: opt.id })}
          style={{ justifyContent: 'center', padding: '12px 8px' }}>

            {opt.label}
          </button>
        )}
      </div>

      <div className="kk-banner kk-banner-warm" style={{ marginTop: 22 }}>
        <IconSparkle size={16} color="var(--kk-warm-ink)" />
        <span>4,2&nbsp;кг для метиса 3 лет — это норма. Хорошие данные.</span>
      </div>
    </>);

}

/* ─── Step 5: Diet ─── */
function DietStep({ data, setData }) {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Что ест?</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Текущий рацион — отправная точка для&nbsp;рекомендаций.
      </p>

      <div className="kk-field-label">Тип питания</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
        { id: 'dry', label: 'Сухой корм', emoji: '🥣' },
        { id: 'wet', label: 'Влажный корм', emoji: '🥫' },
        { id: 'wet+dry', label: 'Смешанный', emoji: '🥄' },
        { id: 'home', label: 'Домашняя еда', emoji: '🍳' },
        { id: 'mix', label: 'Всё подряд', emoji: '🌀' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.diet === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, diet: opt.id })}>

            <span className="kk-pick-emoji">{opt.emoji}</span>
            <span style={{ fontWeight: 500 }}>{opt.label}</span>
          </button>
        )}
      </div>

      <div className="kk-field-label" style={{ marginTop: 22 }}>Сколько раз в&nbsp;день?</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, '5+'].map((n) =>
        <button
          key={n}
          className={`kk-pick ${String(data.mealsPerDay) === String(n) ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, mealsPerDay: n })}
          style={{ flex: 1, justifyContent: 'center', padding: '14px 8px' }}>

            {n}
          </button>
        )}
      </div>
    </>);

}

/* ─── Step 6: Activity + habitat ─── */
function ActivityStep({ data, setData }) {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Жизнь и&nbsp;активность</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Где живёт и&nbsp;как много двигается.
      </p>

      <div className="kk-field-label">Активность</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
        { id: 'low', title: 'Спокойная', sub: 'Любит спать, мало играет', emoji: '😴' },
        { id: 'medium', title: 'Средняя', sub: 'Играет регулярно', emoji: '🎾' },
        { id: 'high', title: 'Активная', sub: 'Постоянно носится', emoji: '⚡' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.activity === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, activity: opt.id })}
          style={{ alignItems: 'flex-start' }}>

            <span className="kk-pick-emoji">{opt.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.title}</div>
              <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 2 }}>{opt.sub}</div>
            </div>
          </button>
        )}
      </div>

      <div className="kk-field-label" style={{ marginTop: 22 }}>Где проводит больше всего времени</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
        { id: 'apartment', label: 'Квартира', emoji: '🏠' },
        { id: 'house', label: 'Дом', emoji: '🏡' },
        { id: 'outdoor', label: 'Двор', emoji: '🌳' },
        { id: 'mixed', label: 'Смешанно', emoji: '🌗' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.habitat === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, habitat: opt.id })}>

            <span className="kk-pick-emoji">{opt.emoji}</span>
            <span style={{ fontWeight: 500 }}>{opt.label}</span>
          </button>
        )}
      </div>
    </>);

}

/* ─── Step 7: Health ─── */
function HealthStep({ data, setData }) {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Здоровье</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Прививки и&nbsp;известные особенности.
      </p>

      <div className="kk-field-label">Статус прививок</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
        { id: 'full', label: 'Полный график', sub: 'Вакцины в&nbsp;срок' },
        { id: 'partial', label: 'Частично', sub: 'Что-то делали' },
        { id: 'none', label: 'Без прививок', sub: 'Никогда' },
        { id: 'unknown', label: 'Не&nbsp;знаю', sub: '' }].
        map((opt) =>
        <button
          key={opt.id}
          className={`kk-pick ${data.vaccinations === opt.id ? 'is-active' : ''}`}
          onClick={() => setData({ ...data, vaccinations: opt.id })}
          style={{ alignItems: 'flex-start' }}>

            <div style={{
            width: 22, height: 22, borderRadius: 11,
            border: '2px solid var(--kk-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2, flexShrink: 0
          }}>
              {data.vaccinations === opt.id &&
            <div style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--kk-ink)' }} />
            }
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: opt.label }} />
              {opt.sub && <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: opt.sub }} />}
            </div>
          </button>
        )}
      </div>

      <div className="kk-field-label" style={{ marginTop: 22 }}>Аллергии или особенности</div>
      <textarea
        className="kk-textarea"
        value={data.allergies}
        onChange={(e) => setData({ ...data, allergies: e.target.value })}
        placeholder="Например: чувствительный ЖКТ, не ест курицу…" />

      <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 6 }}>
        Можно пропустить — добавите позже.
      </div>
    </>);

}

/* ─── Step 8: Concerns ─── */
function ConcernsStep({ data, setData }) {
  const presets = [
  'Не набирает вес', 'Часто прячется', 'Странно ходит в&nbsp;туалет',
  'Плохо ест', 'Слишком много спит', 'Агрессивный'];

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0 6px' }}>Что вас тревожит?</h1>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', margin: '0 0 22px', lineHeight: 1.5 }}>
        Можно списком или своими словами. Я начну с&nbsp;этого.
      </p>

      <div className="kk-field-label">Частые поводы</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {presets.map((p) =>
        <button
          key={p}
          className={`kk-chip ${(data.concerns || '').includes(p) ? 'is-active' : ''}`}
          onClick={() => {
            const cur = data.concerns || '';
            setData({ ...data, concerns: cur.includes(p) ? cur.replace(p, '').trim() : cur ? cur + ', ' + p : p });
          }}
          dangerouslySetInnerHTML={{ __html: p }} />

        )}
      </div>

      <div className="kk-field-label">Свой текст</div>
      <textarea
        className="kk-textarea"
        value={data.concerns}
        onChange={(e) => setData({ ...data, concerns: e.target.value })}
        placeholder="Опишите что вас беспокоит — Кусь возьмёт в&nbsp;работу"
        style={{ minHeight: 120 }} />

      <div className="kk-banner kk-banner-blue" style={{ marginTop: 14 }}>
        <IconHeart size={16} />
        <span>Эти данные нужны для&nbsp;ассистента. Их можно изменить в&nbsp;любой момент.</span>
      </div>
    </>);

}

/* ─── Final: analyzing screen ─── */
function AnalyzingStep({ data, onDone }) {
  const [progress, setProgress] = useStateP(0);
  const [phase, setPhase] = useStateP(0);
  const phases = [
  'Собираю профиль…',
  'Сравниваю с&nbsp;нормами для&nbsp;породы…',
  'Готовлю первые рекомендации…'];

  React.useEffect(() => {
    const t = setInterval(() => setProgress((p) => {
      const np = Math.min(100, p + 1.6);
      if (np >= 100) clearInterval(t);
      return np;
    }), 50);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    setPhase(progress < 35 ? 0 : progress < 70 ? 1 : 2);
  }, [progress]);

  const done = progress >= 100;

  return (
    <div style={{ padding: '40px 28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 600 }}>
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: 'var(--kk-pink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 32, position: 'relative'
      }}>
        <IconPaw size={56} color="#000" />
        {!done &&
        <>
            <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '2px solid var(--kk-pink-deep)', opacity: 0.4,
            animation: 'kk-pulse 1.6s ease-in-out infinite'
          }} />
            <div style={{
            position: 'absolute', inset: -16, borderRadius: '50%',
            border: '2px solid var(--kk-pink)', opacity: 0.4,
            animation: 'kk-pulse 1.6s ease-in-out infinite', animationDelay: '.4s'
          }} />
          </>
        }
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, textAlign: 'center' }}>
        {done ? 'Готово! Знакомьтесь, ' + data.name : 'Минутку…'}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--kk-ink-3)', textAlign: 'center', margin: '8px 0 28px', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: done ?
        'Я подготовил первичные наблюдения. Загляните на&nbsp;главный экран — там уже есть пара мыслей.' :
        phases[phase] }} />

      <div style={{ width: '100%', maxWidth: 260, height: 4, borderRadius: 2, background: 'var(--kk-line)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--kk-ink)', transition: 'width .2s' }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {Math.round(progress)}%
      </div>

      {done &&
      <button className="kk-btn kk-btn-primary" style={{ marginTop: 36 }} onClick={onDone}>
          Перейти к&nbsp;Кусь
        </button>
      }
    </div>);

}

Object.assign(window, { PassportFlow });
