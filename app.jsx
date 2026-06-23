// app.jsx — Root app: routing between onboarding, passport, and main tabs

const { useState: useStateA, useEffect: useEffectA } = React;

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "startScreen": "splash",
  "darkMode": false,
  "showProactive": true,
  "accent": "pink",
  "campaign": "none",
  "campaignMode": "splash"
}/*EDITMODE-END*/;

const SEED_NOTIFS = [
  { id: 1, unread: true, title: 'Кусь', when: '15&nbsp;мин', body: 'Утреннее наблюдение: Луна вчера не отметилась в&nbsp;активности. Проверим?', icon: <IconPaw size={16} color="#000"/>, bg: 'var(--kk-pink)' },
  { id: 2, unread: true, title: 'Пора попить', when: '2&nbsp;ч', body: 'Не забудьте поменять воду. Свежая вода — половина успеха питания.', icon: <IconDrop size={16} color="var(--kk-blue-ink)"/>, bg: 'var(--kk-blue-bg)' },
  { id: 3, unread: false, title: 'Бета · 500', when: 'вчера', body: 'Спасибо, что вошли в&nbsp;ранний доступ. Первые подписки — в&nbsp;июле.', icon: <IconGift size={16} color="var(--kk-warm-ink)"/>, bg: 'var(--kk-warm-bg)' },
  { id: 4, unread: false, title: 'Игра вечером', when: 'вчера', body: '15&nbsp;минут активности после&nbsp;19:00 поможет Луне крепко спать ночью.', icon: <IconPlay size={14} color="#000"/>, bg: 'var(--kk-pink)' },
  { id: 5, unread: false, title: 'История', when: '2&nbsp;дня', body: 'Появился новый сюжет: «Нормы для&nbsp;метисов». Загляните на&nbsp;главный экран.', icon: <IconBook size={16}/>, bg: 'var(--kk-bg-soft)' },
];

const DEFAULT_PET = {
  name: 'Луна', species: 'cat', sex: 'female',
  breed: 'Метис', breedKnown: true,
  birthday: '15 мар 2023',
  weight: '4.2', sterilized: 'yes',
  diet: 'wet+dry', mealsPerDay: 2, portion: '60',
  activity: 'medium', habitat: 'apartment',
  vaccinations: 'partial', allergies: '',
  concerns: 'Иногда прячется во время гостей',
};

function HELP_SHEET(openChatWith, openSettings) {
  return {
    icon: <IconHeadset size={24} color="#000"/>,
    iconBg: 'var(--kk-pink)',
    title: 'Чем помочь?',
    body: 'Если что-то непонятно — Кусь ответит. Если нужен живой человек — позовите оператора прямо из&nbsp;чата.',
    items: [
      { icon: <IconChat size={16}/>, title: 'Спросить у&nbsp;Кусь', sub: 'AI · отвечает мгновенно', onClick: () => openChatWith && openChatWith(null) },
      { icon: <IconHeadset size={16}/>, title: 'Связаться с&nbsp;поддержкой', sub: 'Через чат · 4 минуты в&nbsp;среднем', onClick: () => openChatWith && openChatWith('Позови, пожалуйста, человека.') },
      { icon: <IconBook size={16}/>, title: 'База знаний', sub: 'Породы, нормы, риски', onClick: () => openSettings && openSettings() },
    ],
    secondaryLabel: 'Закрыть',
  };
}

function App() {
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);
  const [stage, setStage] = useStateA(t.startScreen);   // 'splash' | 'phone' | 'sms' | 'welcome' | 'passport' | 'main' | 'login'
  const [tab, setTab] = useStateA('home');              // 'home' | 'chat' | 'pet' | 'settings'
  const [phone, setPhone] = useStateA('9991234567');
  const [code, setCode] = useStateA('');
  const [pet, setPet] = useStateA(DEFAULT_PET);
  const [userName, setUserName] = useStateA('Виктор');     // user's own name (asked during signup)
  // Campaign activation: URL ?c=<id> overrides tweak; tweak override > URL > none
  const urlCampaign = React.useMemo(() => parseCampaign(), []);
  const activeCampaign = (t.campaign && t.campaign !== 'none') ? t.campaign : urlCampaign;
  const [campaignDismissed, setCampaignDismissed] = useStateA(false);
  const [seen, setSeen] = useStateA({});                // stories seen
  const [proactiveSeen, setProactiveSeen] = useStateA({});
  const [storyId, setStoryId] = useStateA(null);
  const [showNotifs, setShowNotifs] = useStateA(false);
  const [notifs, setNotifs] = useStateA(SEED_NOTIFS);
  const [prefs, setPrefs] = useStateA({ kusPush: true, proactive: true, news: true });
  const [sheet, setSheetState] = useStateA(null);   // generic info / confirm sheet
  const [toast, setToast] = useStateA(null);        // brief toast message
  const [chatSeed, setChatSeed] = useStateA(null);  // when set, opens chat with prefilled message
  const [todayDone, setTodayDone] = useStateA({});
  const [planTasks, setPlanTasks] = useStateA([]);   // tasks produced by the "Составить план" flow → shown in «Сегодня»
  const [careItems, setCareItems] = useStateA(CARE_SEED);   // health care calendar (Здоровье)
  const [articleId, setArticleId] = useStateA(null);   // when set, KB shows article view
  const [settingsPage, setSettingsPage] = useStateA(null);   // null | 'faq' | …
  const [petPage, setPetPage] = useStateA(null);   // null | 'status' | 'brelok'
  const [foundOpen, setFoundOpen] = useStateA(false);   // public NFC-scan passport overlay

  function openSheet(cfg) { setSheetState(cfg); }
  function closeSheet() { setSheetState(null); }
  // Append plan tasks to «Сегодня», de-duped by id (re-running the flow won't double them).
  function addPlanTasks(tasks) {
    setPlanTasks(prev => {
      const ids = new Set(prev.map(t => t.id));
      return [...prev, ...(tasks || []).filter(t => !ids.has(t.id))];
    });
  }
  // Mark a care item done → its next due date is pushed out by its period.
  // Vaccination also syncs back to the passport status (partial → full).
  function markCareDone(id) {
    setCareItems(items => items.map(it => it.id === id ? { ...it, dueInDays: it.everyDays } : it));
    if (id === 'vacc') setPet(p => ({ ...p, vaccinations: 'full' }));
    showToast('Отметил ✓ Напомню к&nbsp;следующему разу 🐾');
  }
  function goHealth() { setStage('main'); setTab('pet'); setPetPage('health'); }
  function showToast(msg) { setToast(msg); }
  function openChatWith(prefill) {
    setChatSeed(prefill || null);
    setStage('main');
    setTab('chat');
  }

  // when startScreen tweak changes, jump
  useEffectA(() => { setStage(t.startScreen); }, [t.startScreen]);

  function markStorySeen(id) { setSeen(s => ({ ...s, [id]: true })); }
  function dismissProactive(key) { setProactiveSeen(p => ({ ...p, [key]: true })); }

  const notifCount = notifs.filter(n => n.unread).length;

  function gotoMain(tabId = 'home') {
    setStage('main');
    setTab(tabId);
  }

  let screen;
  if (stage === 'splash') {
    // Campaign-aware splash: 3 activation modes
    if (activeCampaign && !campaignDismissed) {
      if (t.campaignMode === 'splash') {
        screen = (
          <CampaignSplash
            campaignId={activeCampaign}
            onPrimary={() => setStage('phone')}
            onLogin={() => setStage('login')}
            onDismiss={() => setCampaignDismissed(true)}
          />
        );
      } else if (t.campaignMode === 'story') {
        // story mode: render normal splash underneath, overlay story
        screen = (
          <>
            <SplashScreen
              onPrimary={() => setStage('phone')}
              onLogin={() => setStage('login')}
            />
            <CampaignStory
              campaignId={activeCampaign}
              onPrimary={() => { setCampaignDismissed(true); setStage('phone'); }}
              onDismiss={() => setCampaignDismissed(true)}
            />
          </>
        );
      } else {
        // sheet mode: normal splash + modal sheet on top
        screen = (
          <>
            <SplashScreen
              onPrimary={() => setStage('phone')}
              onLogin={() => setStage('login')}
            />
            <CampaignSheet
              campaignId={activeCampaign}
              onPrimary={() => { setCampaignDismissed(true); setStage('phone'); }}
              onDismiss={() => setCampaignDismissed(true)}
            />
          </>
        );
      }
    } else {
      screen = (
        <SplashScreen
          onPrimary={() => setStage('phone')}
          onLogin={() => setStage('login')}
        />
      );
    }
  } else if (stage === 'phone') {
    screen = (
      <PhoneScreen
        phone={phone}
        setPhone={setPhone}
        mode="signup"
        onBack={() => setStage('splash')}
        onContinue={() => setStage('sms')}
        onLogin={() => setStage('login')}
        onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
        onSocial={(provider) => {
          showToast(`Авторизация через&nbsp;${provider === 'google' ? 'Google' : provider === 'yandex' ? 'Яндекс' : 'Telegram'}…`);
          setTimeout(() => setStage('username'), 700);
        }}
      />
    );
  } else if (stage === 'login') {
    screen = (
      <PhoneScreen
        phone={phone}
        setPhone={setPhone}
        mode="login"
        onBack={() => setStage('splash')}
        onContinue={() => { setCode(''); setStage('sms-login'); }}
        onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
        onSocial={(provider) => {
          showToast(`Вход через&nbsp;${provider === 'google' ? 'Google' : provider === 'yandex' ? 'Яндекс' : 'Telegram'}…`);
          setTimeout(() => gotoMain('home'), 700);
        }}
      />
    );
  } else if (stage === 'sms' || stage === 'sms-login') {
    screen = (
      <SmsScreen
        phone={phone}
        code={code}
        setCode={setCode}
        onBack={() => setStage(stage === 'sms-login' ? 'login' : 'phone')}
        onContinue={() => setStage(stage === 'sms-login' ? 'main' : 'username')}
        onHelp={() => openSheet({
          title: 'Не приходит код?',
          body: 'SMS обычно доходит за&nbsp;~30 секунд. Если нет — проверьте сеть и&nbsp;нажмите «отправить повторно». Можно также войти через&nbsp;Google, Яндекс или&nbsp;Telegram.',
          primaryLabel: 'Понятно',
          secondaryLabel: 'Связаться с поддержкой',
          onSecondary: () => openChatWith('SMS-код не приходит'),
        })}
      />
    );
  } else if (stage === 'username') {
    screen = (
      <UserNameScreen
        userName={userName}
        setUserName={setUserName}
        onBack={() => setStage('sms')}
        onContinue={() => setStage('welcome')}
        onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
      />
    );
  } else if (stage === 'welcome') {
    screen = (
      <WelcomeScreen
        userName={userName}
        onContinue={() => setStage('passport')}
        onSkip={() => gotoMain('home')}
        onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
      />
    );
  } else if (stage === 'passport') {
    screen = (
      <PassportFlow
        onBack={() => setStage('welcome')}
        onDone={(data) => { setPet(data); gotoMain('home'); }}
        onSkip={() => {
          openSheet({
            icon: <IconPaw size={22} color="#000"/>, iconBg: 'var(--kk-pink)',
            title: 'Пропустить заполнение?',
            body: 'Кусь сможет давать общие советы, но&nbsp;точность будет ниже. Вернуться к&nbsp;паспорту можно из&nbsp;вкладки «Питомец».',
            primaryLabel: 'Да, заполню позже',
            onPrimary: () => gotoMain('home'),
            secondaryLabel: 'Продолжить заполнение',
          });
        }}
        onHelp={() => openSheet({
          icon: <IconPaw size={22} color="#000"/>, iconBg: 'var(--kk-pink)',
          title: 'Зачем эти данные?',
          body: 'Чтобы Кусь давал точные советы. Все поля влияют на&nbsp;рекомендации по&nbsp;питанию, активности и&nbsp;здоровью. Можно пропустить и&nbsp;заполнить позже.',
          primaryLabel: 'Понятно',
          secondaryLabel: 'Пропустить весь паспорт',
          onSecondary: () => gotoMain('home'),
        })}
      />
    );
  } else if (stage === 'main') {
    if (tab === 'home') {
      screen = (
        <HomeScreen
          pet={pet}
          userName={userName}
          notifCount={notifCount}
          onOpenStory={(id) => setStoryId(id)}
          onTab={setTab}
          onTile={(id) => handleTile(id)}
          onChat={() => openChatWith(null)}
          onChatWith={openChatWith}
          onPet={() => setTab('pet')}
          onOpenStatus={() => { setPetPage('status'); setTab('pet'); }}
          onNotif={() => setShowNotifs(true)}
          onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          openSheet={openSheet}
          showToast={showToast}
          todayDone={todayDone}
          setTodayDone={setTodayDone}
          planTasks={planTasks}
          onHealth={goHealth}
          storiesSeen={seen}
          proactiveSeen={t.showProactive ? proactiveSeen : { activityCard: true }}
          dismissProactive={dismissProactive}
        />
      );
    } else if (tab === 'chat') {
      screen = (
        <ChatScreen
          onTab={setTab}
          onBack={() => setTab('home')}
          seed={chatSeed}
          clearSeed={() => setChatSeed(null)}
          onPlanReady={addPlanTasks}
        />
      );
    } else if (tab === 'kb') {
      if (articleId) {
        screen = (
          <KnowledgeArticle
            articleId={articleId}
            onBack={() => setArticleId(null)}
            onTab={(id) => { setArticleId(null); setTab(id); }}
            onChat={(q) => openChatWith(q)}
            onOpenArticle={(id) => setArticleId(id)}
          />
        );
      } else {
        screen = (
          <KnowledgeScreen
            onBack={() => setTab('home')}
            onTab={setTab}
            onChat={(q) => openChatWith(q)}
            onOpenArticle={(id) => setArticleId(id)}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('kb')))}
          />
        );
      }
    } else if (tab === 'pet') {
      if (petPage === 'status') {
        screen = (
          <StatusScreen
            onBack={() => setPetPage(null)}
            onTab={(id) => { setPetPage(null); setTab(id); }}
            openSheet={openSheet}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          />
        );
      } else if (petPage === 'brelok') {
        screen = (
          <BrelokScreen
            pet={pet}
            onBack={() => setPetPage(null)}
            onTab={(id) => { setPetPage(null); setTab(id); }}
            onPreview={() => setFoundOpen(true)}
            openSheet={openSheet}
            showToast={showToast}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          />
        );
      } else if (petPage === 'health') {
        screen = (
          <HealthScreen
            pet={pet}
            careItems={careItems}
            onMark={markCareDone}
            onBack={() => setPetPage(null)}
            onTab={(id) => { setPetPage(null); setTab(id); }}
            onChat={(q) => openChatWith(q)}
            openSheet={openSheet}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          />
        );
      } else {
      screen = (
        <PetScreen
          pet={pet}
          setPet={setPet}
          onBack={() => setTab('home')}
          onChat={() => openChatWith(null)}
          onChatWith={openChatWith}
          onTab={setTab}
          onStatus={() => setPetPage('status')}
          onBrelok={() => setPetPage('brelok')}
          onHealth={() => setPetPage('health')}
          careItems={careItems}
          openSheet={openSheet}
          showToast={showToast}
          onLogout={() => setStage('splash')}
          onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          onRefresh={() => setStage('passport')}
        />
      );
      }
    } else if (tab === 'settings') {
      if (settingsPage === 'faq') {
        screen = (
          <FAQScreen
            onBack={() => setSettingsPage(null)}
            onTab={(id) => { setSettingsPage(null); setTab(id); }}
            onChat={(q) => openChatWith(q)}
            showToast={showToast}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
          />
        );
      } else {
        screen = (
          <SettingsScreen
            onBack={() => setTab('home')}
            onTab={setTab}
            onLogout={() => setStage('splash')}
            openSheet={openSheet}
            showToast={showToast}
            onHelp={() => openSheet(HELP_SHEET(openChatWith, () => setTab('settings')))}
            onChat={() => openChatWith(null)}
            onOpenKB={() => setTab('kb')}
            onOpenFAQ={() => setSettingsPage('faq')}
            userName={userName}
            setUserName={setUserName}
            prefs={prefs}
            setPrefs={setPrefs}
          />
        );
      }
    }
  }

  function handleTile(id) {
    if (id === 'faq') {
      setTab('kb');
    } else if (id === 'soon-vet') {
      openSheet({
        icon: <IconHeart size={26} color="#000"/>, iconBg: 'var(--kk-warm-bg)',
        title: 'Ветеринар появится позже',
        body: 'В&nbsp;V2 (июль) откроем чат с&nbsp;ветеринаром, видео-приём и&nbsp;выезд. В&nbsp;премиум-тарифе будет закреплённый «семейный ветеринар».<br/><br/>Пока — позовите специалиста из&nbsp;чата с&nbsp;Кусь, он передаст оператору.',
        primaryLabel: 'Открыть чат с&nbsp;Кусь',
        onPrimary: () => openChatWith(null),
        secondaryLabel: 'Понятно',
      });
    } else if (id === 'soon-shop') {
      openSheet({
        icon: <IconGift size={26} color="#000"/>, iconBg: 'var(--kk-success-bg)',
        title: 'Подписка на&nbsp;корм — в&nbsp;июле',
        body: 'Сейчас вы в&nbsp;бета-группе из&nbsp;500. Когда корм будет готов — увидите тарифы и&nbsp;калькулятор порции прямо здесь.<br/><br/>Мы сообщим в&nbsp;первую очередь.',
        primaryLabel: 'Хорошо',
      });
    }
  }

  return (
    <>
      <KKDeviceStage>
        {screen}
        {storyId && (
          <StoryViewer
            startId={storyId}
            onClose={() => setStoryId(null)}
            markSeen={markStorySeen}
            onChatWith={openChatWith}
            openTile={handleTile}
          />
        )}
        {showNotifs && (
          <NotificationsSheet
            notifs={notifs}
            markAllRead={() => setNotifs(ns => ns.map(n => ({ ...n, unread: false })))}
            onClose={() => setShowNotifs(false)}
            onOpenChat={() => { gotoMain('chat'); }}
          />
        )}
        {sheet && <KKSheet {...sheet} onClose={closeSheet}/>}
        {toast && <KKToast message={toast} onClose={() => setToast(null)}/>}
        {foundOpen && (
          <FoundPetScreen
            pet={pet}
            ownerName={userName}
            ownerPhone={'+7 ' + phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4')}
            showToast={showToast}
            onClose={() => setFoundOpen(false)}
          />
        )}
      </KKDeviceStage>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Спецпроекты">
          <TweakSelect
            label="Кампания"
            value={t.campaign || 'none'}
            onChange={(v) => { setTweak('campaign', v); setCampaignDismissed(false); }}
            options={[
              { value: 'none', label: 'Без кампании' },
              { value: 'partner-cafe', label: '☕ Кафе-партнёр (бонус)' },
              { value: 'vet-influencer', label: '🩺 Ветеринар-инфлюенсер' },
              { value: 'tg-ads', label: '✈️ Telegram-реклама' },
              { value: 'cat-day', label: '🎉 День кошек' },
              { value: 'landing-1', label: '🐾 Лендинг 1' },
            ]}
          />
          <TweakSelect
            label="Режим активации"
            value={t.campaignMode}
            onChange={(v) => { setTweak('campaignMode', v); setCampaignDismissed(false); }}
            options={[
              { value: 'splash', label: 'Ко-брендированный сплеш' },
              { value: 'story', label: 'Сразу в&nbsp;сторис' },
              { value: 'sheet', label: 'Модал поверх сплеша' },
            ]}
          />
          <TweakButton
            label="Перезапустить активацию"
            onClick={() => { setCampaignDismissed(false); setStage('splash'); }}
          />
        </TweakSection>
        <TweakSection label="Поток">
          <TweakSelect
            label="Стартовый экран"
            value={t.startScreen}
            onChange={(v) => setTweak('startScreen', v)}
            options={[
              { value: 'splash', label: 'Splash / waitlist' },
              { value: 'phone', label: 'Регистрация — телефон' },
              { value: 'sms', label: 'Ввод кода SMS' },
              { value: 'username', label: 'Имя пользователя' },
              { value: 'welcome', label: 'Кусь приветствует' },
              { value: 'passport', label: 'Цифровой паспорт' },
              { value: 'main', label: 'Приложение (home)' },
            ]}
          />
          <TweakToggle
            label="Проактивные карточки"
            value={t.showProactive}
            onChange={(v) => setTweak('showProactive', v)}
          />
        </TweakSection>
        <TweakSection label="Питомец">
          <TweakText
            label="Имя"
            value={pet.name}
            onChange={(v) => setPet({ ...pet, name: v })}
          />
          <TweakSelect
            label="Активность"
            value={pet.activity}
            onChange={(v) => setPet({ ...pet, activity: v })}
            options={[
              { value: 'low', label: 'Спокойная' },
              { value: 'medium', label: 'Средняя' },
              { value: 'high', label: 'Активная' },
            ]}
          />
          <TweakText
            label="Вес (кг)"
            value={pet.weight}
            onChange={(v) => setPet({ ...pet, weight: v })}
          />
        </TweakSection>
        <TweakSection label="Действия">
          <TweakButton
            label="Открыть Задания (Главная)"
            onClick={() => { setStage('main'); setTab('home'); setPetPage(null); }}
          />
          <TweakButton
            label="Открыть Статус питомца"
            onClick={() => { setStage('main'); setPetPage('status'); setTab('pet'); }}
          />
          <TweakButton
            label="Открыть Брелок (NFC)"
            onClick={() => { setStage('main'); setPetPage('brelok'); setTab('pet'); }}
          />
          <TweakButton
            label="Страница при сканировании чипа"
            onClick={() => setFoundOpen(true)}
          />
          <TweakButton
            label="Начать сначала"
            onClick={() => { setStage('splash'); setTab('home'); setPetPage(null); setPet(DEFAULT_PET); setPlanTasks([]); setCareItems(CARE_SEED); setTodayDone({}); }}
          />
          <TweakButton
            label="Сбросить уведомления и сторис"
            onClick={() => { setNotifs(SEED_NOTIFS); setProactiveSeen({}); setSeen({}); }}
          />
          <TweakButton
            label="Открыть чат с Кусь"
            onClick={() => { setStage('main'); setTab('chat'); }}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
