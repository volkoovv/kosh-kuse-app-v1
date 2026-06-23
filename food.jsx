// food.jsx — Мост к корму (V2 pre-sell): персональный расчёт порции по паспорту,
// интерактивный калькулятор и бронь цены (waitlist). Overlay, без оплаты.

const { useState: useStateFood } = React;

const _stepBtn = {
  width: 44, height: 44, borderRadius: 12, border: '1px solid var(--kk-line-2)',
  background: 'var(--kk-bg)', fontSize: 22, fontWeight: 600, color: 'var(--kk-ink)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

function FoodScreen({ pet, joined, onJoin, onClose }) {
  const startW = parseFloat(String((pet && pet.weight) || '4.2').replace(',', '.')) || 4.2;
  const [weight, setWeight] = useStateFood(Math.round(startW * 10) / 10);
  const [activity, setActivity] = useStateFood((pet && pet.activity) || 'medium');
  const name = (pet && pet.name) || 'Луны';

  // Maintenance energy ≈ 70·W^0.75 · activity-coef; dry food ≈ 3.8 ккал/г.
  const coef = ({ low: 1.0, medium: 1.2, high: 1.4 })[activity] || 1.2;
  const kcal = Math.round(70 * Math.pow(weight, 0.75) * coef);
  const gramsDay = Math.round(kcal / 3.8);
  const gramsWeek = Math.round(gramsDay * 7 / 10) * 10;

  const ACT = [
    { id: 'low', label: 'Спокойная' },
    { id: 'medium', label: 'Средняя' },
    { id: 'high', label: 'Активная' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'var(--kk-bg)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--kk-font)' }}>
      <KKStatus/>
      <div style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--kk-line)', flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'var(--kk-bg-soft)', border: 0, width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconClose size={15} color="var(--kk-ink-3)"/>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 15, letterSpacing: 0.4 }}>КОРМ · ПОДПИСКА</div>
        <div style={{ width: 30 }}/>
      </div>

      <div className="kk-scroll" style={{ padding: '18px 20px 24px' }}>
        {/* hero */}
        <div style={{ background: 'var(--kk-warm-bg)', borderRadius: 22, padding: 20, marginBottom: 18 }}>
          <span className="kk-badge" style={{ background: 'rgba(255,255,255,0.6)', color: 'var(--kk-warm-ink)', marginBottom: 12 }}>Старт продаж — июль</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '12px 0 0', lineHeight: 1.15, color: '#000' }}>Холистик-корм<br/>под {name}</h1>
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.5, marginTop: 10 }}>
            Из ресторанных продуктов + эксклюзивный премикс. Порцию считаем по&nbsp;паспорту — без&nbsp;«примерно по&nbsp;пакету».
          </p>
        </div>

        {/* personalized portion + calculator */}
        <div className="kk-card" style={{ marginBottom: 16 }}>
          <div className="kk-section-label" style={{ marginBottom: 12 }}>ПОРЦИЯ ДЛЯ {String(name).toUpperCase()}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{gramsDay} г</div>
              <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 4 }}>в день</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--kk-line)' }}/>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>~{kcal} ккал</div>
              <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 4 }}>энергия / сутки</div>
            </div>
          </div>

          <div className="kk-field-label">Вес</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <button onClick={() => setWeight(w => Math.max(1.5, +(w - 0.1).toFixed(1)))} style={_stepBtn}>−</button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{weight.toFixed(1)} кг</div>
            <button onClick={() => setWeight(w => Math.min(12, +(w + 0.1).toFixed(1)))} style={_stepBtn}>+</button>
          </div>

          <div className="kk-field-label">Активность</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {ACT.map(a => (
              <button key={a.id} onClick={() => setActivity(a.id)}
                className={`kk-chip ${activity === a.id ? 'is-active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}>{a.label}</button>
            ))}
          </div>

          <div className="kk-banner kk-banner-blue" style={{ marginTop: 16 }}>
            <IconSparkle size={16}/>
            <span>≈ {gramsWeek} г в&nbsp;неделю — доставка свежей партии раз в&nbsp;неделю.</span>
          </div>
        </div>

        {/* tariffs teaser */}
        <div className="kk-section-label" style={{ margin: '4px 2px 8px' }}>ТАРИФЫ (ОРИЕНТИР)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {[
            { t: 'Базовый', p: '~20 000 ₽', s: 'корм + Кусь' },
            { t: 'Средний', p: '~25–30 000 ₽', s: '+ ветеринар' },
            { t: 'Премиум', p: '~40 000 ₽', s: '+ семейный ветеринар' },
          ].map(x => (
            <div key={x.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--kk-bg-soft)', borderRadius: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{x.t}</div>
                <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2 }}>{x.s}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{x.p}</div>
            </div>
          ))}
        </div>

        {/* waitlist CTA */}
        {joined ? (
          <div className="kk-banner kk-banner-success" style={{ marginBottom: 8 }}>
            <IconCheck size={16}/>
            <span><b>Вы в&nbsp;списке беты · место&nbsp;#137.</b> Цену зафиксируем на&nbsp;старте — сообщим первым.</span>
          </div>
        ) : (
          <button className="kk-btn kk-btn-primary" onClick={onJoin}>Забронировать цену беты</button>
        )}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 12, lineHeight: 1.5 }}>
          Оплата подключится к&nbsp;старту продаж (ЮKassa). Сейчас — бронь без&nbsp;списаний.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FoodScreen });
