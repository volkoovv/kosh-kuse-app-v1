// pet-settings.jsx — Pet profile (passport view), Settings, Notifications

const { useState: useStateS } = React;

/* ─── Pet profile (read view + edit drawer) ─── */
function PetScreen({ pet, setPet, onBack, onTab, onChat, onChatWith, openSheet, showToast, onLogout, onHelp, onRefresh, onStatus, onBrelok, onHealth, careItems }) {
  const [editKey, setEditKey] = useStateS(null);
  const [draft, setDraft] = useStateS('');

  function startEdit(key, current) {
    setEditKey(key);
    setDraft(current);
  }
  function saveEdit() {
    setPet({ ...pet, [editKey]: draft });
    setEditKey(null);
  }

  const dietLabel = ({ dry: 'Сухой корм', wet: 'Влажный корм', 'wet+dry': 'Смешанный', home: 'Домашняя еда', mix: 'Всё подряд' })[pet.diet] || pet.diet;
  const actLabel = ({ low: 'Спокойная', medium: 'Средняя', high: 'Активная' })[pet.activity] || pet.activity;
  const habLabel = ({ apartment: 'Квартира', house: 'Дом', outdoor: 'Двор', mixed: 'Смешанно' })[pet.habitat] || pet.habitat;
  const sterLabel = ({ yes: 'Да', no: 'Нет', unknown: 'Не знаю' })[pet.sterilized] || '—';
  const vacLabel = ({ full: 'Полный график', partial: 'Частично', none: 'Без прививок', unknown: 'Не знаю' })[pet.vaccinations] || '—';
  // Live summary of the care calendar (Здоровье) — keeps the passport in sync with it.
  const careOverdue = (careItems || []).filter(i => careStatusOf(i.dueInDays) === 'overdue').length;
  const careSoon = (careItems || []).filter(i => careStatusOf(i.dueInDays) === 'soon').length;
  const careSummary = careOverdue ? `${careOverdue} просрочено` : careSoon ? `${careSoon} скоро` : 'Всё по графику';
  const careTone = careOverdue ? 'var(--kk-error-ink)' : careSoon ? 'var(--kk-warm-ink)' : 'var(--kk-ink-3)';
  // Vaccination row — live from the care calendar (next due + status), tappable to Здоровье.
  const vaccItem = (careItems || []).find(i => i.id === 'vacc');
  const vaccSt = vaccItem ? careStatusOf(vaccItem.dueInDays) : null;
  const vaccDue = vaccItem ? (vaccItem.dueInDays === 0 ? 'сегодня' : vaccItem.dueInDays < 0 ? `просрочено на ${-vaccItem.dueInDays} дн.` : `через ${vaccItem.dueInDays} дн.`) : null;
  const vaccDueTone = vaccSt === 'overdue' ? 'var(--kk-error-ink)' : 'var(--kk-ink-3)';

  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar title="ПИТОМЕЦ" onBack={onBack} left="Главная" right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}/>
      <div className="kk-scroll" style={{ padding: '20px 20px 24px' }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
          <div className="kk-avatar" style={{ width: 100, height: 100, marginBottom: 12 }}>
            <IconCat size={50} color="#000"/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{pet.name}</h1>
            <button onClick={() => startEdit('name', pet.name)} style={{ background: 'none', border: 0, padding: 4 }}>
              <IconEdit size={16} color="var(--kk-ink-3)"/>
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 4 }}>
            {pet.sex === 'male' ? 'Кот' : 'Кошка'} · {kkAgeLabel(pet)} · {pet.weight}&nbsp;кг
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="kk-btn kk-btn-secondary kk-btn-sm" onClick={onChat}>
              <IconChat size={14}/> Спросить у&nbsp;Кусь
            </button>
          </div>
        </div>

        {/* Quality of passport */}
        <div className="kk-banner kk-banner-soft" style={{ marginBottom: 22 }}>
          <IconSparkle size={16} color="var(--kk-pink-deep)"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kk-ink)', marginBottom: 2 }}>
              Паспорт заполнен на&nbsp;82%
            </div>
            <div>
              Уточнить: график прививок, любимая еда. Это улучшит рекомендации.
            </div>
            <button
              className="kk-btn-ghost"
              style={{ background: 'none', border: 0, padding: 0, fontSize: 11, color: 'var(--kk-ink)', textDecoration: 'underline', marginTop: 4 }}
              onClick={() => onChatWith && onChatWith('Помоги уточнить данные паспорта: график прививок и любимая еда')}
            >
              Уточнить →
            </button>
          </div>
        </div>

        {/* GameFi: здоровье + статус + брелок */}
        <PetGameCards onStatus={onStatus} onBrelok={onBrelok} onHealth={onHealth} careItems={careItems}/>

        {/* Sections */}
        <PetSection title="Данные">
          <PetRow label="Порода" value={pet.breed} onEdit={() => startEdit('breed', pet.breed)}/>
          <PetRow label="Дата рождения" value={pet.birthday} onEdit={() => startEdit('birthday', pet.birthday)}/>
          <PetRow label="Вес" value={pet.weight + ' кг'} onEdit={() => startEdit('weight', pet.weight)}/>
          <PetRow label="Стерилизация" value={sterLabel}/>
          <PetRow label="Аллергии" value={pet.allergies || 'Не выявлены'} onEdit={() => startEdit('allergies', pet.allergies)}/>
        </PetSection>

        <PetSection title="Питание и&nbsp;уход">
          <PetRow label="Рацион" value={dietLabel}/>
          <PetRow label="Приёмов в&nbsp;день" value={String(pet.mealsPerDay)}/>
          <PetRow label="Порция" value={pet.portion + ' г'}/>
          <PetRow label="Активность" value={actLabel}/>
          <PetRow label="Где живёт" value={habLabel}/>
        </PetSection>

        <PetSection title="Здоровье">
          <button
            onClick={onHealth}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--kk-line)', borderTop: 0, borderLeft: 0, borderRight: 0, background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span style={{ flex: 1, color: 'var(--kk-ink-3)', fontSize: 13 }}>График ухода</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: careTone }}>{careSummary}</span>
            <IconChevron size={16} color="var(--kk-ink-4)"/>
          </button>
          <button
            onClick={onHealth}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--kk-line)', borderTop: 0, borderLeft: 0, borderRight: 0, background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span style={{ flex: 1, color: 'var(--kk-ink-3)', fontSize: 13 }}>Прививки</span>
            {vaccSt === 'overdue'
              ? <span className="kk-badge kk-badge-error">Просрочено</span>
              : vaccSt === 'soon'
              ? <span className="kk-badge kk-badge-warm">Скоро</span>
              : pet.vaccinations === 'partial'
              ? <span className="kk-badge kk-badge-warm">Уточнить</span>
              : null}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--kk-ink)' }}>{vacLabel}</div>
              {vaccDue && <div style={{ fontSize: 11, color: vaccDueTone, marginTop: 1 }}>{vaccDue}</div>}
            </div>
            <IconChevron size={16} color="var(--kk-ink-4)"/>
          </button>
          <PetRow label="Переживания" value={pet.concerns || '—'} multi onEdit={() => startEdit('concerns', pet.concerns)}/>
        </PetSection>

        <PetSection title="Наблюдения Кусь">
          <button
            onClick={onChat}
            style={{
              width: '100%', textAlign: 'left',
              padding: '12px 14px', margin: '8px 0 8px',
              background: 'var(--kk-bg-soft)', border: 0,
              borderRadius: 14,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--kk-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconCheck size={14} color="var(--kk-success-ink)"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--kk-ink)', lineHeight: 1.45 }}>
                Вес в&nbsp;норме — 4,2&nbsp;кг это центр диапазона для&nbsp;метиса 3&nbsp;лет.
              </div>
              <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 4 }}>
                Спросить у&nbsp;Кусь&nbsp;→
              </div>
            </div>
          </button>
          <button
            onClick={onChat}
            style={{
              width: '100%', textAlign: 'left',
              padding: '12px 14px', marginBottom: 6,
              background: 'var(--kk-warm-bg)',
              border: '1px solid var(--kk-warm-edge)',
              borderRadius: 14,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconActivity size={14} color="var(--kk-warm-ink)"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--kk-warm-ink)', fontWeight: 600, lineHeight: 1.4 }}>
                Активность ниже нормы
              </div>
              <div style={{ fontSize: 12, color: 'var(--kk-warm-ink)', opacity: 0.85, marginTop: 2, lineHeight: 1.4 }}>
                Подобрать план игр? Открыть чат с&nbsp;Кусь&nbsp;→
              </div>
            </div>
          </button>
        </PetSection>

        <button
          className="kk-btn kk-btn-ghost"
          style={{ marginTop: 14, color: 'var(--kk-error-ink)' }}
          onClick={() => openSheet && openSheet({
            icon: <IconClose size={22} color="#fff"/>,
            iconBg: 'var(--kk-error-ink)',
            title: 'Удалить ' + pet.name + '?',
            body: 'Все данные паспорта и&nbsp;наблюдения Кусь будут стёрты. Это нельзя отменить.',
            primaryLabel: 'Да, удалить',
            danger: true,
            onPrimary: () => { onLogout && onLogout(); showToast && showToast('Питомец удалён'); },
            secondaryLabel: 'Отмена',
          })}
        >Удалить питомца</button>
      </div>

      <KKBottomNav active="pet" onChange={onTab}/>

      {editKey && (
        <div className="kk-modal-bg" onClick={() => setEditKey(null)}>
          <div className="kk-sheet" onClick={e => e.stopPropagation()}>
            <div className="kk-sheet-handle"/>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Изменить</h3>
            {editKey === 'concerns' || editKey === 'allergies' ? (
              <textarea
                className="kk-textarea"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
            ) : (
              <input
                className="kk-input"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="kk-btn kk-btn-secondary" onClick={() => setEditKey(null)}>Отмена</button>
              <button className="kk-btn kk-btn-primary" onClick={saveEdit}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PetSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="kk-section-label" style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{__html: title}}/>
      <div style={{ background: 'var(--kk-bg)', borderRadius: 14, padding: '0 4px' }}>
        {children}
      </div>
    </div>
  );
}

function PetRow({ label, value, onEdit, status, multi }) {
  return (
    <div className="kk-data-row">
      <span className="kk-data-label" dangerouslySetInnerHTML={{__html: label}}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: multi ? 1 : undefined, justifyContent: multi ? 'flex-end' : undefined }}>
        {status === 'partial' && (
          <span className="kk-badge kk-badge-warm" style={{ marginRight: 4 }}>Уточнить</span>
        )}
        <span
          className="kk-data-value"
          style={multi ? { textAlign: 'right', flex: 1, color: value === '—' ? 'var(--kk-ink-4)' : undefined, fontWeight: 400, maxWidth: 220 } : {}}
        >{value || '—'}</span>
        {onEdit && (
          <button onClick={onEdit} style={{ background: 'none', border: 0, padding: 4 }}>
            <IconEdit size={14} color="var(--kk-ink-4)"/>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Settings / profile ─── */
function SettingsScreen({ onBack, onTab, onLogout, prefs, setPrefs, openSheet, showToast, onHelp, onChat, onOpenKB, onOpenFAQ, userName, setUserName }) {
  const [editUser, setEditUser] = useStateS(false);
  const [name, setName] = useStateS(userName || 'Виктор');

  function openInfo(title, body, items, primary) {
    openSheet && openSheet({ title, body, items, primaryLabel: primary, secondaryLabel: 'Закрыть' });
  }
  return (
    <div className="kk-screen">
      <KKStatus />
      <KKTopBar title="ПРОФИЛЬ" right={<button className="kk-topbar-action" onClick={onHelp}><IconQuestion size={14}/></button>}/>
      <div className="kk-scroll" style={{ padding: '20px 20px 24px' }}>
        {/* User card */}
        <div style={{
          padding: 16, borderRadius: 18, background: 'var(--kk-bg-soft)',
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22,
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 27, background: 'var(--kk-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 19,
          }}>{name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--kk-ink-3)' }}>+7 (999) 123‑45‑67</div>
          </div>
          <button
            className="kk-btn-sm kk-btn kk-btn-secondary"
            style={{ background: '#fff' }}
            onClick={() => setEditUser(true)}
          >
            <IconEdit size={13}/>
          </button>
        </div>

        <div className="kk-section-label" style={{ marginBottom: 4 }}>УВЕДОМЛЕНИЯ</div>
        <div style={{ background: 'var(--kk-bg)', borderRadius: 14, padding: '0 4px', marginBottom: 22 }}>
          <SettingsToggle
            icon={<IconBell size={16}/>}
            label="Пуши от&nbsp;Кусь"
            sub="Напоминания о&nbsp;воде, активности, прививках"
            value={prefs.kusPush}
            onToggle={() => setPrefs({ ...prefs, kusPush: !prefs.kusPush })}
          />
          <SettingsToggle
            icon={<IconSparkle size={14}/>}
            label="Проактивные сценарии"
            sub="Кусь сам начинает разговор, если что-то заметил"
            value={prefs.proactive}
            onToggle={() => setPrefs({ ...prefs, proactive: !prefs.proactive })}
          />
          <SettingsToggle
            icon={<IconGift size={14}/>}
            label="Новости бренда"
            sub="Новости запуска корма, бета"
            value={prefs.news}
            onToggle={() => setPrefs({ ...prefs, news: !prefs.news })}
          />
        </div>

        <div className="kk-section-label" style={{ marginBottom: 4 }}>АККАУНТ</div>
        <div style={{ background: 'var(--kk-bg)', borderRadius: 14, padding: '0 4px', marginBottom: 22 }}>
          <SettingsRow
            icon={<IconShield size={16}/>}
            label="Безопасность"
            meta="PIN, биометрия"
            onClick={() => openSheet && openSheet({
              icon: <IconShield size={22} color="#000"/>, iconBg: 'var(--kk-bg-soft)',
              title: 'Безопасность',
              body: 'Сейчас доступен вход по&nbsp;номеру и&nbsp;через&nbsp;соцсети. PIN и&nbsp;Face&nbsp;ID появятся в&nbsp;следующих версиях.',
              items: [
                { icon: <IconCheck size={14} color="var(--kk-success-ink)"/>, title: 'SMS-код', sub: 'Включено' },
                { icon: <IconClose size={14} color="var(--kk-ink-3)"/>, title: 'PIN-код', sub: 'Скоро' },
                { icon: <IconClose size={14} color="var(--kk-ink-3)"/>, title: 'Face ID', sub: 'Скоро' },
              ],
              secondaryLabel: 'Закрыть',
            })}
          />
          <SettingsRow
            icon={<IconUser size={16}/>}
            label="Личные данные"
            meta="Имя, телефон"
            onClick={() => setEditUser(true)}
          />
          <SettingsRow
            icon={<IconHeadset size={16}/>}
            label="Связь с&nbsp;поддержкой"
            onClick={() => onChat && onChat()}
          />
        </div>

        <div className="kk-section-label" style={{ marginBottom: 4 }}>О ПРОДУКТЕ</div>
        <div style={{ background: 'var(--kk-bg)', borderRadius: 14, padding: '0 4px', marginBottom: 22 }}>
          <SettingsRow
            icon={<IconBook size={16}/>}
            label="База знаний"
            onClick={() => onOpenKB && onOpenKB()}
          />
          <SettingsRow
            icon={<IconQuestion size={16}/>}
            label="Частые вопросы"
            meta="24 ответа"
            onClick={() => onOpenFAQ && onOpenFAQ()}
          />
          <SettingsRow
            icon={<IconHeart size={16}/>}
            label="О Kosh Kuse"
            onClick={() => openSheet && openSheet({
              icon: <KKWordmark size="lg"/>,
              title: 'Kosh Kuse',
              body: 'Подписочная цифрово-физическая система заботы о&nbsp;кошке.<br/><br/><b>Kosh</b> — структура, <b>Kuse</b> — ритуал.<br/><br/>На&nbsp;старте: ассистент Кусь и&nbsp;цифровой паспорт. В&nbsp;июле — холистик-корм и&nbsp;подписка. Дальше — закреплённый ветеринар, грумминг, психологи, отели.',
              primaryLabel: 'Понятно',
            })}
          />
        </div>

        {/* Roadmap card */}
        <div className="kk-card" style={{ background: 'var(--kk-bg-soft)', borderColor: 'transparent', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <IconSparkle size={16} color="var(--kk-pink-deep)"/>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Что появится в&nbsp;ближайших версиях</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RoadmapItem when="июль" what="Подписка на&nbsp;корм и&nbsp;доставка" status="next"/>
            <RoadmapItem when="лето" what="Закреплённый ветеринар" status="planned"/>
            <RoadmapItem when="осень" what="Маркетплейс партнёров" status="planned"/>
          </div>
        </div>

        <button
          className="kk-btn kk-btn-ghost"
          onClick={() => openSheet && openSheet({
            title: 'Выйти из&nbsp;аккаунта?',
            body: 'Данные паспорта останутся на&nbsp;этом устройстве — войдёте снова и&nbsp;всё на&nbsp;месте.',
            primaryLabel: 'Выйти',
            danger: true,
            onPrimary: () => onLogout && onLogout(),
            secondaryLabel: 'Отмена',
          })}
          style={{ color: 'var(--kk-error-ink)' }}
        >
          Выйти из&nbsp;аккаунта
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 22 }}>
          KOSH KUSE · v1.0 · бета<br/>Made with 🐾 в&nbsp;Москве
        </div>
      </div>

      <KKBottomNav active="settings" onChange={onTab}/>

      {editUser && (
        <div className="kk-modal-bg" onClick={() => setEditUser(false)}>
          <div className="kk-sheet" onClick={e => e.stopPropagation()}>
            <div className="kk-sheet-handle"/>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>Личные данные</h3>
            <div className="kk-field-label">Имя</div>
            <input className="kk-input" value={name} onChange={e => setName(e.target.value)} autoFocus/>
            <div className="kk-field-label" style={{ marginTop: 14 }}>Номер телефона</div>
            <input className="kk-input" value="+7 (999) 123-45-67" disabled style={{ opacity: 0.6 }}/>
            <div style={{ fontSize: 11, color: 'var(--kk-ink-4)', marginTop: 6 }}>
              Чтобы сменить номер — напишите в&nbsp;поддержку.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button className="kk-btn kk-btn-secondary" onClick={() => setEditUser(false)}>Отмена</button>
              <button className="kk-btn kk-btn-primary" onClick={() => { setEditUser(false); setUserName && setUserName(name); showToast && showToast('Сохранено'); }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsToggle({ icon, label, sub, value, onToggle }) {
  return (
    <div className="kk-row" style={{ alignItems: 'flex-start' }}>
      <div className="kk-row-icon">{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{__html: label}}/>
        {sub && <div style={{ fontSize: 11, color: 'var(--kk-ink-3)', marginTop: 2, lineHeight: 1.4 }} dangerouslySetInnerHTML={{__html: sub}}/>}
      </div>
      <button className={`kk-switch ${value ? 'is-on' : ''}`} onClick={onToggle}/>
    </div>
  );
}

function SettingsRow({ icon, label, meta, onClick }) {
  return (
    <button onClick={onClick} className="kk-row" style={{ width: '100%', background: 'none', border: 0, borderBottom: '1px solid var(--kk-line)' }}>
      <div className="kk-row-icon">{icon}</div>
      <span className="kk-row-label" dangerouslySetInnerHTML={{__html: label}}/>
      {meta && <span className="kk-row-meta">{meta}</span>}
      <span className="kk-row-arrow"><IconChevron size={16}/></span>
    </button>
  );
}

function RoadmapItem({ when, what, status }) {
  const dot = status === 'next' ? 'var(--kk-pink-deep)' : 'var(--kk-line-2)';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12 }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: dot, flexShrink: 0 }}/>
      <span style={{ width: 56, color: 'var(--kk-ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, fontWeight: 500 }}>{when}</span>
      <span style={{ color: 'var(--kk-ink)' }} dangerouslySetInnerHTML={{__html: what}}/>
    </div>
  );
}

/* ─── Notifications inbox (sheet) ─── */
function NotificationsSheet({ onClose, onOpenChat, notifs, markAllRead }) {
  return (
    <div className="kk-modal-bg" onClick={onClose}>
      <div className="kk-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85%', display: 'flex', flexDirection: 'column' }}>
        <div className="kk-sheet-handle"/>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, flex: 1 }}>Уведомления</h2>
          <button className="kk-btn-ghost" style={{ background: 'none', border: 0, fontSize: 12, color: 'var(--kk-ink-3)' }} onClick={markAllRead}>
            Прочитать все
          </button>
        </div>
        <div style={{ overflow: 'auto', flex: 1, scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifs.map(n => (
            <button
              key={n.id}
              className={`kk-notif ${n.unread ? 'is-unread' : ''}`}
              onClick={() => { onOpenChat(); onClose(); }}
              style={{ textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 18, background: n.bg || 'var(--kk-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kk-ink)' }}>{n.title}</div>
                  <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--kk-ink-4)' }}>{n.when}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--kk-ink-3)', marginTop: 2, lineHeight: 1.4 }} dangerouslySetInnerHTML={{__html: n.body}}/>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PetScreen, SettingsScreen, NotificationsSheet });
