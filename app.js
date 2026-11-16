(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const app = document.querySelector("#app");
  const stage = document.querySelector("#treeStage");
  const poemCard = document.querySelector("#poemCard");
  const poemText = document.querySelector("#poemText");
  const poemNumber = document.querySelector("#poemNumber");
  const poemSource = document.querySelector("#poemSource");
  const poemKind = document.querySelector("#poemKind");
  const poemMetaRight = document.querySelector("#poemMetaRight");
  const openReplyButton = document.querySelector("#openReplyButton");
  const noteReplyCount = document.querySelector("#noteReplyCount");
  const harvestPersonalButton = document.querySelector("#harvestPersonalButton");
  const poetryDbCount = document.querySelector("#poetryDbCount");
  const canvas = document.querySelector("#particles");
  const ctx = canvas.getContext("2d");
  const windButton = document.querySelector("#windButton");
  const seedButton = document.querySelector("#seedButton");
  const plantButton = document.querySelector("#plantButton");
  const plantDialog = document.querySelector("#plantDialog");
  const closePlantButton = document.querySelector("#closePlantButton");
  const cancelPlantButton = document.querySelector("#cancelPlantButton");
  const confirmPlantButton = document.querySelector("#confirmPlantButton");
  const personalNoteInput = document.querySelector("#personalNote");
  const personalNoteAuthor = document.querySelector("#personalNoteAuthor");
  const noteCounter = document.querySelector("#noteCounter");
  const storageModeLabel = document.querySelector("#storageModeLabel");
  const personalSlotValue = document.querySelector("#personalSlotValue");
  const replyDialog = document.querySelector("#replyDialog");
  const closeReplyButton = document.querySelector("#closeReplyButton");
  const cancelReplyButton = document.querySelector("#cancelReplyButton");
  const confirmReplyButton = document.querySelector("#confirmReplyButton");
  const replyInput = document.querySelector("#replyInput");
  const replyAuthor = document.querySelector("#replyAuthor");
  const replyCounter = document.querySelector("#replyCounter");
  const replyThread = document.querySelector("#replyThread");
  const replyThreadCount = document.querySelector("#replyThreadCount");
  const replyOriginal = document.querySelector("#replyOriginal");
  const guideDialog = document.querySelector("#guideDialog");
  const closeGuideButton = document.querySelector("#closeGuideButton");
  const confirmGuideButton = document.querySelector("#confirmGuideButton");
  const languageDialog = document.querySelector("#languageDialog");
  const closeLanguageButton = document.querySelector("#closeLanguageButton");
  const languageGrid = document.querySelector("#languageGrid");
  const languageButton = document.querySelector("#languageButton");
  const mobileLanguageButton = document.querySelector("#mobileLanguageButton");
  const languageValue = document.querySelector("#languageValue");
  const mobileLanguageValue = document.querySelector("#mobileLanguageValue");
  const treeSpaceButton = document.querySelector("#treeSpaceButton");
  const myTreeButtonCode = document.querySelector("#myTreeButtonCode");
  const treeSpaceStatus = document.querySelector("#treeSpaceStatus");
  const spaceModeLabel = document.querySelector("#spaceModeLabel");
  const treeSpaceName = document.querySelector("#treeSpaceName");
  const spaceCodeLabel = document.querySelector("#spaceCodeLabel");
  const treeSpacePlaque = document.querySelector("#treeSpacePlaque");
  const treeNameUnderTree = document.querySelector("#treeNameUnderTree");
  const treeCodeUnderTree = document.querySelector("#treeCodeUnderTree");
  const returnMainButton = document.querySelector("#returnMainButton");
  const treeAccessDialog = document.querySelector("#treeAccessDialog");
  const closeTreeAccessButton = document.querySelector("#closeTreeAccessButton");
  const treeCodeInput = document.querySelector("#treeCodeInput");
  const enterTreeButton = document.querySelector("#enterTreeButton");
  const treeAccessError = document.querySelector("#treeAccessError");
  const treeOwnerSummary = document.querySelector("#treeOwnerSummary");
  const ownerTreeCodeLabel = document.querySelector("#ownerTreeCode");
  const openOwnTreeButton = document.querySelector("#openOwnTreeButton");
  const copyTreeCodeButton = document.querySelector("#copyTreeCodeButton");
  const treeCreateSection = document.querySelector("#treeCreateSection");
  const treeNameInput = document.querySelector("#treeNameInput");
  const treeOwnerName = document.querySelector("#treeOwnerName");
  const treeFirstMessage = document.querySelector("#treeFirstMessage");
  const createTreeButton = document.querySelector("#createTreeButton");
  const soundButton = document.querySelector("#soundButton");
  const themeButton = document.querySelector("#themeButton");
  const guideButton = document.querySelector("#guideButton");
  const mobileSoundButton = document.querySelector("#mobileSoundButton");
  const mobileThemeButton = document.querySelector("#mobileThemeButton");
  const mobileGuideButton = document.querySelector("#mobileGuideButton");
  const soundValue = document.querySelector("#soundValue");
  const themeValue = document.querySelector("#themeValue");
  const mobileSoundValue = document.querySelector("#mobileSoundValue");
  const mobileThemeValue = document.querySelector("#mobileThemeValue");
  const harvestCount = document.querySelector("#harvestCount");
  const harvestTotal = document.querySelector("#harvestTotal");
  const harvestBar = document.querySelector("#harvestBar");
  const logText = document.querySelector("#logText");
  const seedValue = document.querySelector("#seedValue");
  const stageSeed = document.querySelector("#stageSeed");
  const leafValue = document.querySelector("#leafValue");
  const fruitValue = document.querySelector("#fruitValue");
  const personalNoteValue = document.querySelector("#personalNoteValue");
  const windValue = document.querySelector("#windValue");
  const nodeCount = document.querySelector("#nodeCount");
  const metricFruitCount = document.querySelector("#metricFruitCount");
  const cursorReadout = document.querySelector("#cursorReadout");
  const buildTime = document.querySelector("#buildTime");
  const fpsReadout = document.querySelector("#fpsReadout");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const urlParams = new URLSearchParams(window.location.search);
  const snapshotMode = urlParams.has("snapshot");
  const languageStorageKey = "orange-tree-language-v1";
  const i18n = window.ORANGE_I18N || {
    languages: [{ code: "zh-CN", label: "简体中文", short: "中文" }],
    strings: { "zh-CN": {} },
  };
  const supportedLanguageCodes = new Set(i18n.languages.map((language) => language.code));
  let currentLanguage = "zh-CN";
  const queryLanguage = urlParams.get("lang");
  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    const browserLanguage = navigator.language || "zh-CN";
    const browserBase = browserLanguage.toLowerCase().split("-")[0];
    currentLanguage =
      queryLanguage && supportedLanguageCodes.has(queryLanguage)
        ? queryLanguage
        : storedLanguage && supportedLanguageCodes.has(storedLanguage)
        ? storedLanguage
        : supportedLanguageCodes.has(browserLanguage)
          ? browserLanguage
          : i18n.languages.find((language) => language.code.toLowerCase().split("-")[0] === browserBase)?.code ||
            "zh-CN";
  } catch {
    currentLanguage = "zh-CN";
  }
  const COMMUNITY_API_KEY = "orange-tree-community-api-v1";
  const queryApi = (urlParams.get("api") || "").trim();
  let storedApi = "";
  try {
    if (/^https?:\/\//.test(queryApi)) {
      window.localStorage.setItem(COMMUNITY_API_KEY, queryApi);
      storedApi = queryApi;
    } else {
      storedApi = window.localStorage.getItem(COMMUNITY_API_KEY) || "";
    }
  } catch {
    storedApi = /^https?:\/\//.test(queryApi) ? queryApi : "";
  }
  const communityApiBase = /^https?:\/\//.test(storedApi)
    ? storedApi.replace(/\/+$/, "")
    : /^https?:$/.test(window.location.protocol)
      ? window.location.origin
      : "";

  const layerIds = {
    roots: document.querySelector("#treeRoots"),
    branchBack: document.querySelector("#branchBack"),
    branchMid: document.querySelector("#branchMid"),
    canopyBack: document.querySelector("#canopyBack"),
    canopyMid: document.querySelector("#canopyMid"),
    canopyFront: document.querySelector("#canopyFront"),
    fruitBack: document.querySelector("#fruitBack"),
    fruitMid: document.querySelector("#fruitMid"),
    fruitFront: document.querySelector("#fruitFront"),
    trunk: document.querySelector("#trunkModel"),
  };

  const clusters = [
    { x: 470, y: 246, rx: 205, ry: 110, layer: "back", count: 72, seed: 2 },
    { x: 300, y: 307, rx: 161, ry: 105, layer: "back", count: 60, seed: 8 },
    { x: 643, y: 301, rx: 165, ry: 109, layer: "back", count: 61, seed: 15 },
    { x: 211, y: 396, rx: 121, ry: 92, layer: "back", count: 44, seed: 20 },
    { x: 723, y: 396, rx: 125, ry: 95, layer: "back", count: 45, seed: 27 },
    { x: 365, y: 381, rx: 155, ry: 119, layer: "mid", count: 68, seed: 34 },
    { x: 574, y: 373, rx: 164, ry: 123, layer: "mid", count: 71, seed: 41 },
    { x: 266, y: 461, rx: 124, ry: 88, layer: "mid", count: 43, seed: 49 },
    { x: 678, y: 466, rx: 130, ry: 92, layer: "mid", count: 46, seed: 57 },
    { x: 469, y: 465, rx: 203, ry: 112, layer: "mid", count: 79, seed: 63 },
    { x: 336, y: 538, rx: 128, ry: 68, layer: "front", count: 47, seed: 71 },
    { x: 477, y: 551, rx: 167, ry: 73, layer: "front", count: 59, seed: 79 },
    { x: 607, y: 534, rx: 114, ry: 66, layer: "front", count: 39, seed: 87 },
    { x: 429, y: 207, rx: 121, ry: 70, layer: "front", count: 39, seed: 95 },
    { x: 560, y: 228, rx: 106, ry: 67, layer: "front", count: 36, seed: 106 },
    { x: 321, y: 240, rx: 95, ry: 62, layer: "front", count: 31, seed: 114 },
  ];

  const fruitPositions = [
    [282, 294, 0.77, "back"], [338, 255, 0.72, "back"], [393, 314, 0.82, "back"],
    [461, 229, 0.78, "back"], [513, 285, 0.74, "back"], [571, 245, 0.79, "back"],
    [617, 321, 0.76, "back"], [673, 293, 0.72, "back"], [716, 364, 0.77, "back"],
    [253, 381, 0.69, "back"], [379, 383, 0.83, "mid"], [438, 355, 0.78, "mid"],
    [516, 343, 0.75, "mid"], [578, 415, 0.85, "mid"], [650, 379, 0.76, "mid"],
    [278, 450, 0.73, "mid"], [337, 471, 0.78, "mid"], [413, 438, 0.8, "mid"],
    [486, 440, 0.86, "mid"], [552, 479, 0.8, "mid"], [632, 468, 0.75, "mid"],
    [690, 440, 0.7, "mid"], [318, 525, 0.78, "front"], [383, 546, 0.82, "front"],
    [455, 524, 0.88, "front"], [521, 540, 0.84, "front"], [591, 514, 0.77, "front"],
    [457, 596, 0.7, "front"],
  ];

  const personalFruitAnchors = [
    [329, 338, 0.9, "front"],
    [607, 342, 0.92, "front"],
    [246, 419, 0.86, "front"],
    [694, 414, 0.88, "front"],
    [357, 300, 0.86, "mid"],
    [553, 299, 0.88, "mid"],
    [316, 492, 0.9, "front"],
    [620, 500, 0.9, "front"],
    [423, 477, 0.92, "front"],
    [527, 502, 0.9, "front"],
    [377, 565, 0.84, "front"],
    [560, 568, 0.84, "front"],
    [302, 364, 0.8, "mid"],
    [640, 355, 0.82, "mid"],
    [228, 455, 0.78, "front"],
    [710, 457, 0.78, "front"],
    [275, 545, 0.78, "front"],
    [658, 555, 0.78, "front"],
    [404, 395, 0.8, "mid"],
    [533, 397, 0.8, "mid"],
    [345, 586, 0.76, "front"],
    [610, 590, 0.76, "front"],
    [456, 620, 0.74, "front"],
    [525, 615, 0.74, "front"],
    [205, 383, 0.76, "front"],
    [739, 386, 0.76, "front"],
    [380, 270, 0.8, "mid"],
    [560, 270, 0.8, "mid"],
  ];

  const PERSONAL_NOTES_KEY = "orange-tree-personal-notes-v1";
  const OWNED_TOKENS_KEY = "orange-tree-owned-oranges-v1";
  const PRIVATE_TREES_KEY = "orange-tree-private-spaces-v1";
  const OWNER_TREE_CODE_KEY = "orange-tree-owner-code-v1";
  const MAX_PERSONAL_NOTES = personalFruitAnchors.length;

  const poems = [
    "光落下来时，叶子没有躲。",
    "有些成熟，只发生在无人看见的时辰。",
    "风走得很慢，像在替谁记得。",
    "一颗果实，是漫长的光终于有了形状。",
    "你我之间，曾隔着一整棵树的和风。",
    "不是所有甜，都需要被说破。",
    "秋天没有偏心，只是把金色留得久一点。",
    "我接住它，也接住一小段安静。",
    "枝头的重量，来自光，不来自等待。",
    "时间从树影里经过，留下了可被尝到的一部分。",
    "世界很大，能把一颗橘子照透的光很小。",
    "成熟不是抵达，是愿意把自己交给季节。",
    "有风经过，万物才学会轻轻回应。",
    "不必摘尽满树金橘，留几颗给迟来的黄昏。",
    "喜欢是轻的，像光停在果皮上，不惊动一颗露水。",
    "我们看见甜，却常常忘记它走过的那段路。",
    "叶子把光分给每一颗尚未被命名的果实。",
    "所谓圆满，是愿意在一件事里慢慢变黄。",
    "山高水远，果子仍记得日出的方向。",
    "有些相遇没有声音，像阳光落进果皮。",
    "一天之中，总有一刻适合什么都不做。",
    "被认真照亮过的东西，会自己发光。",
    "不是所有等待都有答案，但树还在长。",
    "秋意从指尖传来，很轻，也很确定。",
    "如果风记得来路，它就不会错过这一树金黄。",
    "把今日的甜收好，明日仍有新的光。",
    "一颗橘子里，藏着整个夏天没有说完的话。",
    "你不必成为火焰，也能照亮一小片人间。",
  ];

  const fallbackPoetryEntries = poems.map((text) => ({ text, source: "橘树采集批注" }));
  const poetryEntries =
    window.ORANGE_POETRY_DB?.entries?.length > 0
      ? window.ORANGE_POETRY_DB.entries
      : fallbackPoetryEntries;
  poetryDbCount.textContent = `${poetryEntries.length} ENTRIES`;

  let currentSeed = 7;
  let mainTreeSeed = currentSeed;
  let currentVisualSeed = currentSeed;
  let harvest = Number(sessionStorage.getItem("orange-tree-harvest-v2") || 0);
  let totalFruit = fruitPositions.length;
  let personalNotes = loadPersonalNotes();
  let localPrivateTrees = loadLocalPrivateTrees();
  let privateTreeNotes = [];
  let currentPrivateCode = "";
  let currentPrivateTreeName = "";
  let ownerTreeCode = loadOwnerTreeCode();
  let ownedOrangeTokens = loadOwnedOrangeTokens();
  let activePoemDeck = poetryEntries.slice(0, totalFruit);
  let currentPersonalNote = null;
  let communityEnabled = false;
  let harvestConfirmTimer = 0;
  let soundEnabled = false;
  let audioContext = null;
  let ambientMaster = null;
  let ambientTimer = 0;
  let ambientNodes = [];
  let ambientStep = 0;
  const vivaldiSpringTheme = [
    659.25, 659.25, 659.25, 659.25,
    659.25, 739.99, 830.61, 880,
    830.61, 739.99, 659.25, 493.88,
    554.37, 622.25, 659.25, 659.25,
    659.25, 739.99, 830.61, 880,
    830.61, 739.99, 659.25, 493.88,
    554.37, 622.25, 659.25, 493.88,
    440, 493.88, 415.3, 329.63,
  ];
  let windTimeout = 0;
  let poemTimeout = 0;
  let logTimeout = 0;
  let pointerFrame = 0;
  let canvasDims = { width: 0, height: 0, dpr: 1 };
  let lastFrame = performance.now();
  let fpsSmooth = 60;
  let animationFrame = 0;

  const burstParticles = [];
  const scanParticles = [];
  const poetryRunSalt = (() => {
    try {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0];
    } catch {
      return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    }
  })();

  function randomFactory(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function t(key) {
    return i18n.strings[currentLanguage]?.[key] ?? i18n.strings["zh-CN"]?.[key] ?? key;
  }

  function applyLanguage(code) {
    if (!supportedLanguageCodes.has(code)) return;
    currentLanguage = code;
    document.documentElement.lang = code;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    const language = i18n.languages.find((item) => item.code === code);
    languageValue.textContent = language?.short || code;
    mobileLanguageValue.textContent = language?.short || code;
    languageGrid.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === code;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    resetHarvestControl();
    updateSpaceUI();
    if (currentPersonalNote) renderReplyThread(currentPersonalNote);
    try {
      window.localStorage.setItem(languageStorageKey, code);
    } catch {
      // Language still applies for the current session.
    }
  }

  function buildLanguageGrid() {
    languageGrid.replaceChildren();
    i18n.languages.forEach((language) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "language-option";
      button.dataset.language = language.code;
      button.innerHTML = `<span>${language.label}</span><small>${language.code.toUpperCase()}</small>`;
      button.addEventListener("click", () => {
        applyLanguage(language.code);
        closeLanguageDialog();
        setLog(`language.set // ${language.code} // interface`);
      });
      languageGrid.appendChild(button);
    });
  }

  function openLanguageDialog() {
    if (
      plantDialog.classList.contains("is-open") ||
      replyDialog.classList.contains("is-open") ||
      guideDialog.classList.contains("is-open") ||
      treeAccessDialog.classList.contains("is-open")
    ) {
      return;
    }
    languageDialog.classList.add("is-open");
    languageDialog.setAttribute("aria-hidden", "false");
  }

  function closeLanguageDialog() {
    languageDialog.classList.remove("is-open");
    languageDialog.setAttribute("aria-hidden", "true");
    if (window.innerWidth <= 820) {
      mobileLanguageButton.focus();
    } else {
      languageButton.focus();
    }
  }

  function normalizePersonalNotes(source) {
    if (!Array.isArray(source)) return [];
    return source
      .filter((note) => note && typeof note.text === "string" && note.text.trim())
      .map((note, index) => ({
        id: String(note.id || `restored-${index}`),
        text: note.text.trim().slice(0, 48),
        author: String(note.author || "").trim().slice(0, 16),
        treeName: String(note.treeName || "").trim().slice(0, 20),
        createdAt: note.createdAt || new Date().toISOString(),
        seed: Number(note.seed) || 0,
        shared: Boolean(note.shared),
        replies: Array.isArray(note.replies)
          ? note.replies
              .filter((reply) => reply && typeof reply.text === "string" && reply.text.trim())
              .map((reply, replyIndex) => ({
                id: String(reply.id || `reply-${index}-${replyIndex}`),
                text: reply.text.trim().slice(0, 64),
                author: String(reply.author || "").trim().slice(0, 16),
                createdAt: reply.createdAt || new Date().toISOString(),
              }))
              .slice(-24)
          : [],
      }))
      .slice(-MAX_PERSONAL_NOTES);
  }

  function loadPersonalNotes() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PERSONAL_NOTES_KEY) || "[]");
      return normalizePersonalNotes(stored);
    } catch {
      return [];
    }
  }

  function loadOwnerTreeCode() {
    try {
      return window.localStorage.getItem(OWNER_TREE_CODE_KEY) || "";
    } catch {
      return "";
    }
  }

  function saveOwnerTreeCode() {
    try {
      if (ownerTreeCode) window.localStorage.setItem(OWNER_TREE_CODE_KEY, ownerTreeCode);
      else window.localStorage.removeItem(OWNER_TREE_CODE_KEY);
    } catch {
      // Tree ownership remains available for the current session.
    }
  }

  function loadLocalPrivateTrees() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PRIVATE_TREES_KEY) || "{}");
      if (!stored || typeof stored !== "object") return {};
      return Object.fromEntries(
        Object.entries(stored).map(([code, notes]) => [code, normalizePersonalNotes(notes)]),
      );
    } catch {
      return {};
    }
  }

  function saveLocalPrivateTrees() {
    try {
      window.localStorage.setItem(PRIVATE_TREES_KEY, JSON.stringify(localPrivateTrees));
    } catch {
      // The current session can still browse the tree.
    }
  }

  function isPrivateTreeSeed(value) {
    const seed = Number(value);
    return Number.isInteger(seed) && seed >= 100000 && seed <= 999999;
  }

  function activeNotes() {
    return currentPrivateCode ? privateTreeNotes : personalNotes;
  }

  function persistActiveSpace() {
    if (currentPrivateCode) {
      localPrivateTrees[currentPrivateCode] = privateTreeNotes;
      saveLocalPrivateTrees();
    } else {
      savePersonalNotes();
    }
  }

  function savePersonalNotes() {
    try {
      window.localStorage.setItem(PERSONAL_NOTES_KEY, JSON.stringify(personalNotes));
      return true;
    } catch {
      return false;
    }
  }

  function loadOwnedOrangeTokens() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(OWNED_TOKENS_KEY) || "{}");
      return stored && typeof stored === "object" ? stored : {};
    } catch {
      return {};
    }
  }

  function saveOwnedOrangeTokens() {
    try {
      window.localStorage.setItem(OWNED_TOKENS_KEY, JSON.stringify(ownedOrangeTokens));
    } catch {
      // Ownership can still be used for the current session.
    }
  }

  function rememberOrangeOwner(orangeId, ownerToken) {
    if (!orangeId || !ownerToken) return;
    ownedOrangeTokens[orangeId] = ownerToken;
    saveOwnedOrangeTokens();
  }

  async function apiRequest(path, options = {}) {
    if (!communityApiBase) throw new Error("Community API is not configured");
    const response = await window.fetch(new URL(path, `${communityApiBase}/`).toString(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      const error = new Error(`API request failed: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  async function hydrateCommunityOranges() {
    if (!communityApiBase) return;
    try {
      const payload = await apiRequest("/api/oranges");
      const serverNotes = normalizePersonalNotes(payload.oranges || payload)
        .filter((note) => !isPrivateTreeSeed(note.seed))
        .map((note) => ({
        ...note,
        shared: true,
        }));
      const serverIds = new Set(serverNotes.map((note) => note.id));
      const localOnlyNotes = personalNotes.filter((note) => !serverIds.has(note.id));

      for (const note of localOnlyNotes) {
        try {
          const created = await apiRequest("/api/oranges", {
            method: "POST",
            body: JSON.stringify({
              text: note.text,
              author: note.author,
              seed: note.seed,
              treeName: note.treeName || "",
            }),
          });
          if (created?.ownerToken) rememberOrangeOwner(created.id, created.ownerToken);
          const migrated = normalizePersonalNotes([created])[0];
          if (migrated) {
            migrated.shared = true;
            serverNotes.push(migrated);
          }
        } catch {
          break;
        }
      }

      personalNotes = serverNotes.slice(-MAX_PERSONAL_NOTES);
      communityEnabled = true;
      storageModeLabel.textContent = "SHARED_SERVER";
      savePersonalNotes();
      renderScene(currentSeed, false);
      setLog(`community.online // ${personalNotes.length} personal oranges // shared`);
      if (snapshotMode && urlParams.has("openCommunity") && personalNotes[0]) {
        showPersonalNote(personalNotes[0]);
        if (urlParams.has("replyThread")) openReplyDialog();
      }
    } catch {
      communityEnabled = false;
    }
  }

  function buildPoemDeck(seed) {
    const random = randomFactory((seed * 2654435761) ^ poetryRunSalt);
    const shuffled = [...poetryEntries];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    activePoemDeck = shuffled.slice(0, totalFruit);
  }

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  }

  function appendPath(parent, d, attributes = {}) {
    const path = svgElement("path", { d, ...attributes });
    parent.appendChild(path);
    return path;
  }

  function setLog(message) {
    window.clearTimeout(logTimeout);
    logText.textContent = message;
    logText.parentElement.style.color = "var(--ink-muted)";
    logTimeout = window.setTimeout(() => {
      logText.textContent = "scene.idle // awaiting input";
      logText.parentElement.style.color = "";
    }, 2800);
  }

  function updateSeedLabels(displaySeed = currentSeed) {
    const padded = String(displaySeed).padStart(4, "0");
    seedValue.textContent = padded;
    stageSeed.textContent = padded;
  }

  function flashCodeValue(element) {
    element.classList.remove("is-updated");
    void element.getBoundingClientRect();
    element.classList.add("is-updated");
    window.setTimeout(() => element.classList.remove("is-updated"), 380);
  }

  function updateHarvest(animate = true) {
    const capped = Math.min(harvest, 99);
    harvestCount.textContent = String(capped).padStart(2, "0");
    const percentage = Math.min(100, (harvest / Math.max(totalFruit, 1)) * 100);
    harvestBar.style.width = `${percentage}%`;
    if (animate) {
      harvestCount.classList.remove("is-updated");
      void harvestCount.getBoundingClientRect();
      harvestCount.classList.add("is-updated");
    }
  }

  function showPoem(index) {
    window.clearTimeout(poemTimeout);
    currentPersonalNote = null;
    resetHarvestControl();
    const poemIndex = ((index % activePoemDeck.length) + activePoemDeck.length) % activePoemDeck.length;
    const poem = activePoemDeck[poemIndex] || fallbackPoetryEntries[poemIndex % fallbackPoetryEntries.length];
    poemCard.classList.remove("is-personal");
    poemKind.textContent = "HARVEST_NOTE";
    poemMetaRight.textContent = "FIELD_WRITING";
    poemText.textContent = poem.text;
    poemSource.textContent = poem.source;
    poemNumber.textContent = String(poemIndex + 1).padStart(2, "0");
    poemCard.classList.remove("is-visible");
    void poemCard.getBoundingClientRect();
    poemCard.classList.add("is-visible");
    poemTimeout = window.setTimeout(() => {
      poemCard.classList.remove("is-visible");
    }, 5400);
  }

  function showPersonalNote(note) {
    window.clearTimeout(poemTimeout);
    currentPersonalNote = note;
    resetHarvestControl();
    const noteIndex = Math.max(0, activeNotes().findIndex((item) => item.id === note.id));
    const date = new Date(note.createdAt);
    const dateLabel = Number.isNaN(date.getTime())
      ? "YOUR_ORANGE"
      : new Intl.DateTimeFormat(currentLanguage, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
    poemCard.classList.add("is-personal");
    poemKind.textContent = "PERSONAL_NOTE";
    poemMetaRight.textContent = "YOUR_ORANGE";
    poemText.textContent = note.text;
    poemSource.textContent = `${note.author || t("anonymousPlanter")} · ${dateLabel}`;
    noteReplyCount.textContent = String(note.replies?.length || 0).padStart(2, "0");
    const canHarvest = !note.shared || Boolean(ownedOrangeTokens[note.id]);
    poemCard.classList.toggle("is-foreign", !canHarvest);
    harvestPersonalButton.hidden = !canHarvest;
    poemNumber.textContent = String(noteIndex + 1).padStart(2, "0");
    poemCard.classList.remove("is-visible");
    void poemCard.getBoundingClientRect();
    poemCard.classList.add("is-visible");
    poemTimeout = window.setTimeout(() => {
      poemCard.classList.remove("is-visible");
    }, 7600);
  }

  function resetHarvestControl() {
    window.clearTimeout(harvestConfirmTimer);
    harvestPersonalButton.classList.remove("is-confirming");
    harvestPersonalButton.querySelector("span").textContent = t("harvestAction");
  }

  async function harvestPersonalOrange() {
    const note = currentPersonalNote;
    if (!note) return;
    const ownerToken = ownedOrangeTokens[note.id];
    if (communityEnabled && !ownerToken) {
      setLog("personal.harvest.denied // grower token missing // shared orange");
      return;
    }

    if (!harvestPersonalButton.classList.contains("is-confirming")) {
      window.clearTimeout(harvestConfirmTimer);
      harvestPersonalButton.classList.add("is-confirming");
      harvestPersonalButton.querySelector("span").textContent = t("confirmHarvest");
      harvestConfirmTimer = window.setTimeout(resetHarvestControl, 2600);
      return;
    }

    resetHarvestControl();
    if (communityEnabled && ownerToken && ownerToken !== "local") {
      try {
        await apiRequest(`/api/oranges/${encodeURIComponent(note.id)}`, {
          method: "DELETE",
          body: JSON.stringify({ ownerToken }),
        });
      } catch {
        setLog("personal.harvest.error // server rejected request");
        return;
      }
    }

    const active = activeNotes();
    const removedIndex = active.findIndex((item) => item.id === note.id);
    if (removedIndex >= 0) active.splice(removedIndex, 1);
    delete ownedOrangeTokens[note.id];
    persistActiveSpace();
    saveOwnedOrangeTokens();
    currentPersonalNote = null;
    poemCard.classList.remove("is-visible", "is-personal", "is-foreign");
    if (replyDialog.classList.contains("is-open")) closeReplyDialog();
    renderScene(currentSeed, false);
    setLog(`personal.harvest // note removed // ${activeNotes().length} remain`);
    if (soundEnabled) playTone(392, 0.5, 0.018);
  }

  function clearLayer(layer) {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
  }

  function renderTrunk() {
    clearLayer(layerIds.trunk);
    clearLayer(layerIds.roots);

    const outline = svgElement("path", {
      class: "trunk-outline",
      d: "M424 884L439 813L437 752L449 688L455 636L473 622L486 652L486 711L501 758L498 817L536 892L469 902L452 892Z",
    });
    layerIds.trunk.appendChild(outline);

    appendPath(layerIds.trunk, "M462 879L461 646L472 628", { class: "trunk-axis" });
    appendPath(layerIds.trunk, "M452 759L500 758M445 810L497 817M467 696h22M464 734h25", {
      class: "trunk-tick",
    });
    appendPath(layerIds.trunk, "M502 804L586 871M432 805L344 870", { class: "root-line" });
    appendPath(layerIds.trunk, "M487 679L566 714M461 682L369 718", { class: "root-line" });

    const trunkLabel = svgElement("text", { x: "503", y: "748" });
    trunkLabel.textContent = "TRUNK / D07";
    layerIds.trunk.appendChild(trunkLabel);

    appendPath(layerIds.roots, "M462 864L340 894M469 866L602 891M458 843L238 865M478 844L702 865", {
      "stroke-dasharray": "1 5",
    });
  }

  function renderBranches(seed) {
    clearLayer(layerIds.branchBack);
    clearLayer(layerIds.branchMid);
    const random = randomFactory(seed * 1013 + 41);

    function grow(x, y, length, angle, width, depth, layer) {
      const bend = (random() - 0.5) * length * 0.18;
      const endX = x + Math.cos(angle) * length + Math.cos(angle + Math.PI / 2) * bend;
      const endY = y + Math.sin(angle) * length + Math.sin(angle + Math.PI / 2) * bend;
      const controlX = x + Math.cos(angle) * length * 0.5;
      const controlY = y + Math.sin(angle) * length * 0.5;
      const path = appendPath(
        layer,
        `M${x.toFixed(1)} ${y.toFixed(1)} Q${controlX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`,
        { "stroke-width": Math.max(0.55, width).toFixed(2) },
      );
      path.setAttribute("stroke", "inherit");

      if (depth <= 2) {
        layer.appendChild(svgElement("circle", {
          class: "branch-node",
          cx: endX.toFixed(1),
          cy: endY.toFixed(1),
          r: depth === 0 ? 2.1 : 1.3,
        }));
      }

      if (depth <= 0) return;

      const childCount = depth >= 4 && random() > 0.54 ? 3 : 2;
      for (let child = 0; child < childCount; child += 1) {
        const spread = childCount === 2 ? 0.47 : 0.56;
        const offset = (child - (childCount - 1) / 2) * spread + (random() - 0.5) * 0.28;
        grow(
          endX,
          endY,
          length * (0.62 + random() * 0.14),
          angle + offset,
          width * 0.67,
          depth - 1,
          layer,
        );
      }
    }

    grow(469, 672, 177, -Math.PI / 2 + (random() - 0.5) * 0.06, 15, 7, layerIds.branchBack);
    grow(468, 705, 147, -Math.PI / 2 - 0.44, 9, 5, layerIds.branchBack);
    grow(470, 705, 151, -Math.PI / 2 + 0.47, 9, 5, layerIds.branchBack);
    grow(465, 744, 108, -Math.PI / 2 - 0.88, 6, 4, layerIds.branchMid);
    grow(473, 744, 111, -Math.PI / 2 + 0.9, 6, 4, layerIds.branchMid);
    grow(468, 622, 88, -Math.PI / 2 - 0.16, 10, 4, layerIds.branchMid);
  }

  function clusterPoints(cluster, seed, count = cluster.count) {
    const random = randomFactory(seed + cluster.seed * 73);
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random());
      const edgeNoise = 0.88 + random() * 0.16;
      points.push({
        x: cluster.x + Math.cos(angle) * cluster.rx * radius * edgeNoise,
        y: cluster.y + Math.sin(angle) * cluster.ry * radius * edgeNoise,
        r: 0.5 + Math.pow(random(), 2.2) * 1.55,
        type: random(),
      });
    }
    return points;
  }

  function renderCanopy(seed) {
    clearLayer(layerIds.canopyBack);
    clearLayer(layerIds.canopyMid);
    clearLayer(layerIds.canopyFront);

    let nodeTotal = 0;
    clusters.forEach((cluster, clusterIndex) => {
      const points = clusterPoints(cluster, seed + 311);
      nodeTotal += points.length;
      const layer = layerIds[`canopy${cluster.layer[0].toUpperCase()}${cluster.layer.slice(1)}`];
      const random = randomFactory(seed + cluster.seed * 33);

      const outlinePoints = [];
      const ridgeSteps = 20;
      for (let step = 0; step < ridgeSteps; step += 1) {
        const angle = (step / ridgeSteps) * Math.PI * 2;
        const jitter = 0.92 + random() * 0.13;
        outlinePoints.push([
          cluster.x + Math.cos(angle) * cluster.rx * jitter,
          cluster.y + Math.sin(angle) * cluster.ry * jitter,
        ]);
      }
      const outline = outlinePoints
        .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(" ");
      appendPath(layer, `${outline}Z`, { class: "cluster-outline" });

      points.forEach((point) => {
        const node = svgElement("circle", {
          cx: point.x.toFixed(1),
          cy: point.y.toFixed(1),
          r: point.r.toFixed(2),
          class: point.type > 0.94 ? "node-gold" : point.type > 0.76 ? "node-hard" : "",
          opacity: (0.3 + random() * 0.67).toFixed(2),
        });
        layer.appendChild(node);
      });

      const byX = [...points].sort((a, b) => a.x - b.x);
      let mesh = "";
      for (let i = 0; i < byX.length; i += 1) {
        const point = byX[i];
        let links = 0;
        for (let j = i + 1; j < Math.min(i + 7, byX.length) && links < 2; j += 1) {
          const candidate = byX[j];
          const dist = Math.hypot(point.x - candidate.x, point.y - candidate.y);
          if (dist < 51) {
            mesh += `M${point.x.toFixed(1)} ${point.y.toFixed(1)}L${candidate.x.toFixed(1)} ${candidate.y.toFixed(1)}`;
            links += 1;
          }
        }
      }
      appendPath(layer, mesh, {
        class: random() > 0.76 ? "mesh-accent" : "",
        opacity: (0.35 + random() * 0.4).toFixed(2),
      });

      for (let i = 0; i < 4; i += 1) {
        const point = points[Math.floor(random() * points.length)];
        const size = 3.2 + random() * 4.2;
        const polygon = svgElement("polygon", {
          points:
            `${point.x.toFixed(1)},${point.y.toFixed(1)} ` +
            `${(point.x + size).toFixed(1)},${(point.y + size * 0.45).toFixed(1)} ` +
            `${(point.x + size * 0.2).toFixed(1)},${(point.y + size).toFixed(1)}`,
          opacity: (0.26 + random() * 0.38).toFixed(2),
        });
        layer.appendChild(polygon);
      }

      if (clusterIndex < 5) {
        const connector = points[Math.floor(random() * points.length)];
        appendPath(
          layer,
          `M${cluster.x} 618Q${cluster.x} ${(cluster.y + 200).toFixed(0)} ${connector.x.toFixed(1)} ${connector.y.toFixed(1)}`,
          { opacity: "0.2" },
        );
      }
    });

    leafValue.textContent = String(nodeTotal);
    nodeCount.textContent = String(nodeTotal);
  }

  function renderFruits(seed) {
    clearLayer(layerIds.fruitBack);
    clearLayer(layerIds.fruitMid);
    clearLayer(layerIds.fruitFront);
    const random = randomFactory(seed * 53 + 19);
    const notes = activeNotes();

    fruitPositions.forEach(([baseX, baseY, scale, layerName], index) => {
      const x = baseX + (random() - 0.5) * 9;
      const y = baseY + (random() - 0.5) * 7 + Math.sin(index) * 3;
      const radius = 14 * scale;
      const layer = layerIds[`fruit${layerName[0].toUpperCase()}${layerName.slice(1)}`];
      const group = svgElement("g", {
        class: "fruit-node",
        transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
        tabindex: "0",
        role: "button",
        "aria-label": `摘取第 ${index + 1} 颗金橘`,
      });
      group.dataset.index = String(index);

      group.appendChild(svgElement("circle", {
        cx: "0",
        cy: "0",
        r: String(radius * 2.7),
        fill: "url(#fruitHalo)",
        filter: "url(#nodeGlow)",
        opacity: "0.7",
      }));

      group.appendChild(svgElement("circle", {
        class: "fruit-focus-ring",
        cx: "0",
        cy: "0",
        r: String(radius + 8),
        "stroke-dasharray": "2 2",
      }));
      group.appendChild(svgElement("circle", {
        class: "fruit-orbit",
        cx: "0",
        cy: "0",
        r: String(radius + 4.5),
      }));

      appendPath(
        group,
        `M${-radius - 10} 0H${-radius - 4}M${radius + 4} 0H${radius + 10}M0 ${-radius - 10}V${-radius - 4}M0 ${radius + 4}V${radius + 10}`,
        { class: "fruit-cross" },
      );

      group.appendChild(svgElement("circle", {
        class: "fruit-core",
        cx: "0",
        cy: "0",
        r: String(radius),
        fill: "url(#fruitCore)",
        stroke: "rgba(255, 221, 133, .5)",
        "stroke-width": "0.65",
      }));

      group.appendChild(svgElement("circle", {
        cx: String(-radius * 0.34),
        cy: String(-radius * 0.37),
        r: String(Math.max(1.2, radius * 0.12)),
        fill: "#fff7d9",
        opacity: "0.88",
      }));

      appendPath(
        group,
        `M${-radius * 0.68} ${radius * 0.4}Q0 ${radius * 0.73} ${radius * 0.68} ${radius * 0.4}`,
        {
          fill: "none",
          stroke: "rgba(121, 50, 0, .38)",
          "stroke-width": "0.7",
        },
      );

      appendPath(group, `M${radius * 0.2} ${-radius - 18}V${-radius - 3}`, {
        fill: "none",
        stroke: "rgba(154, 170, 131, .58)",
        "stroke-width": "0.75",
      });

      const code = svgElement("text", { class: "fruit-code", x: String(radius + 10), y: "-6" });
      code.textContent = `F_${String(index + 1).padStart(2, "0")}`;
      group.appendChild(code);

      const label = svgElement("text", { class: "fruit-label", x: String(radius + 10), y: "4" });
      label.textContent = "HARVEST";
      group.appendChild(label);

      const scan = svgElement("circle", {
        class: "fruit-scan",
        cx: "0",
        cy: "0",
        r: String(radius + 5),
      });
      group.appendChild(scan);

      group.addEventListener("click", () => harvestFruit(group, index));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          harvestFruit(group, index);
        }
      });
      group.addEventListener("pointerenter", () => {
        const values = cursorReadout.querySelectorAll("b");
        values[0].textContent = x.toFixed(2).padStart(7, "0");
        values[1].textContent = y.toFixed(2).padStart(7, "0");
        if (soundEnabled) playTone(312 + index * 8, 0.09, 0.012);
      });

      layer.appendChild(group);
    });

    notes.forEach((note, index) => {
      const [x, y, scale, layerName] = personalFruitAnchors[index];
      const radius = 13.5 * scale;
      const layer = layerIds[`fruit${layerName[0].toUpperCase()}${layerName.slice(1)}`];
      const group = svgElement("g", {
        class: "fruit-node personal-fruit",
        transform: `translate(${x} ${y})`,
        tabindex: "0",
        role: "button",
        "aria-label": `读取你种下的第 ${index + 1} 颗橘子上的留言`,
      });
      group.dataset.noteId = note.id;

      group.appendChild(svgElement("circle", {
        cx: "0",
        cy: "0",
        r: String(radius * 2.8),
        fill: "url(#fruitHalo)",
        filter: "url(#nodeGlow)",
        opacity: "0.9",
      }));
      group.appendChild(svgElement("circle", {
        class: "fruit-focus-ring",
        cx: "0",
        cy: "0",
        r: String(radius + 9),
        "stroke-dasharray": "2 2",
      }));
      group.appendChild(svgElement("circle", {
        class: "fruit-orbit",
        cx: "0",
        cy: "0",
        r: String(radius + 5),
      }));
      appendPath(
        group,
        `M${-radius - 11} 0H${-radius - 4}M${radius + 4} 0H${radius + 11}M0 ${-radius - 11}V${-radius - 4}M0 ${radius + 4}V${radius + 11}`,
        { class: "fruit-cross" },
      );
      group.appendChild(svgElement("circle", {
        class: "fruit-core",
        cx: "0",
        cy: "0",
        r: String(radius),
        fill: "url(#fruitCore)",
      }));
      group.appendChild(svgElement("circle", {
        cx: String(-radius * 0.34),
        cy: String(-radius * 0.37),
        r: String(Math.max(1.2, radius * 0.12)),
        fill: "#fff7d9",
        opacity: "0.9",
      }));
      appendPath(group, "M-4.2 2.1L0 -3.8L4.2 2.1ZM0 -3.8V-7.2", {
        class: "personal-sigil",
      });

      const code = svgElement("text", { class: "fruit-code", x: String(radius + 10), y: "-6" });
      code.textContent = `YOU_${String(index + 1).padStart(2, "0")}`;
      group.appendChild(code);
      const label = svgElement("text", { class: "fruit-label", x: String(radius + 10), y: "4" });
      label.textContent = "READ NOTE";
      group.appendChild(label);

      group.addEventListener("click", (event) => {
        event.stopPropagation();
        showPersonalNote(note);
        setLog(`personal.orange.open // note:${String(index + 1).padStart(2, "0")} // yours`);
        if (soundEnabled) playTone(440 + index * 12, 0.28, 0.022);
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showPersonalNote(note);
          setLog(`personal.orange.open // note:${String(index + 1).padStart(2, "0")} // yours`);
        }
      });
      group.addEventListener("pointerenter", () => {
        const values = cursorReadout.querySelectorAll("b");
        values[0].textContent = x.toFixed(2).padStart(7, "0");
        values[1].textContent = y.toFixed(2).padStart(7, "0");
      });
      layer.appendChild(group);
    });

    totalFruit = fruitPositions.length;
    fruitValue.textContent = String(totalFruit + notes.length);
    metricFruitCount.textContent = String(totalFruit + notes.length);
    personalNoteValue.textContent = String(notes.length).padStart(2, "0");
    personalSlotValue.textContent = `${String(notes.length).padStart(2, "0")} / ${MAX_PERSONAL_NOTES}`;
    harvestTotal.textContent = String(totalFruit);
    updateHarvest(false);
  }

  function renderScene(seed, announce = false, preserveMainSeed = false) {
    const start = performance.now();
    if (!preserveMainSeed) currentSeed = seed;
    updateSeedLabels(preserveMainSeed ? seed : currentSeed);
    renderTrunk();
    renderBranches(seed);
    renderCanopy(seed);
    renderFruits(seed);
    buildPoemDeck(seed);
    const elapsed = Math.max(7, Math.round(performance.now() - start + 4));
    buildTime.textContent = `BUILD ${elapsed}MS`;
    if (announce) {
      setLog(`geometry.rebuild // seed:${String(seed).padStart(4, "0")} // ok`);
      flashCodeValue(seedValue);
      flashCodeValue(leafValue);
      flashCodeValue(fruitValue);
    }
  }

  function fruitScreenPosition(group) {
    const stageRect = stage.getBoundingClientRect();
    const rect = group.querySelector(".fruit-core").getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - stageRect.left,
      y: rect.top + rect.height / 2 - stageRect.top,
    };
  }

  function harvestFruit(group, index) {
    if (group.classList.contains("is-collected")) return;
    const pos = fruitScreenPosition(group);
    burst(pos.x, pos.y, 22);
    group.classList.add("is-collected");
    group.setAttribute("aria-label", `第 ${index + 1} 颗金橘已采集`);
    harvest += 1;
    sessionStorage.setItem("orange-tree-harvest-v2", String(harvest));
    updateHarvest();
    showPoem(index);
    setLog(`fruit.collect // node:F_${String(index + 1).padStart(2, "0")} // payload:1`);
    if (soundEnabled) {
      playTone(392 + (index % 5) * 44, 0.32, 0.035);
      window.setTimeout(() => playTone(587.33, 0.5, 0.022), 95);
    }
  }

  function regenerate() {
    if (seedButton.disabled) return;
    seedButton.disabled = true;
    if (currentPrivateCode) {
      currentVisualSeed = ((currentVisualSeed * 37 + 29) % 9000) + 1;
      renderScene(currentVisualSeed, true, true);
    } else {
      currentSeed = ((currentSeed * 37 + 29) % 9000) + 1;
      mainTreeSeed = currentSeed;
      renderScene(currentSeed, true);
    }
    setLog("growth.call // tree geometry // poetry.reshuffled");
    window.setTimeout(() => {
      seedButton.disabled = false;
    }, 500);
  }

  function updatePlantForm() {
    const length = personalNoteInput.value.length;
    noteCounter.textContent = `${String(length).padStart(2, "0")} / 48`;
    confirmPlantButton.disabled =
      personalNoteInput.value.trim().length === 0 || activeNotes().length >= MAX_PERSONAL_NOTES;
  }

  function openPlantDialog() {
    if (activeNotes().length >= MAX_PERSONAL_NOTES) {
      setLog(`personal.graft.limit // ${MAX_PERSONAL_NOTES} notes // tree full`);
      return;
    }
    personalNoteInput.value = "";
    personalNoteAuthor.value = "";
    updatePlantForm();
    plantDialog.classList.add("is-open");
    plantDialog.setAttribute("aria-hidden", "false");
    window.setTimeout(() => personalNoteInput.focus(), 80);
  }

  function closePlantDialog() {
    plantDialog.classList.remove("is-open");
    plantDialog.setAttribute("aria-hidden", "true");
    plantButton.focus();
  }

  function updateSpaceUI() {
    const privateMode = Boolean(currentPrivateCode);
    app.classList.toggle("is-private-space", privateMode);
    spaceModeLabel.textContent = `${privateMode ? t("privateTree") : t("mainTree")} / ${
      privateMode ? "PRIVATE" : "MAIN"
    }`;
    spaceCodeLabel.textContent = privateMode ? `#${currentPrivateCode}` : "PUBLIC";
    treeSpaceName.textContent = privateMode ? currentPrivateTreeName : "";
    treeSpaceName.hidden = !privateMode;
    treeSpacePlaque.hidden = !privateMode;
    treeNameUnderTree.textContent = privateMode ? currentPrivateTreeName : "";
    treeCodeUnderTree.textContent = privateMode ? `TREE ID / #${currentPrivateCode}` : "";
    myTreeButtonCode.textContent = ownerTreeCode ? ownerTreeCode : "＋";
    treeSpaceButton.classList.toggle("has-owner-tree", Boolean(ownerTreeCode));
    document.title = privateMode
      ? `${t("privateTree")} #${currentPrivateCode} / ORANGE_TREE`
      : "ORANGE_TREE_07 / Parametric Study";
  }

  function updateTreeAccessSummary() {
    const hasOwnerTree = Boolean(ownerTreeCode);
    treeOwnerSummary.hidden = !hasOwnerTree;
    treeCreateSection.hidden = hasOwnerTree;
    if (hasOwnerTree) ownerTreeCodeLabel.textContent = ownerTreeCode;
  }

  function openTreeAccessDialog() {
    treeCodeInput.value = "";
    treeAccessError.textContent = "";
    updateTreeAccessSummary();
    treeAccessDialog.classList.add("is-open");
    treeAccessDialog.setAttribute("aria-hidden", "false");
    window.setTimeout(() => treeCodeInput.focus(), 80);
  }

  function closeTreeAccessDialog() {
    treeAccessDialog.classList.remove("is-open");
    treeAccessDialog.setAttribute("aria-hidden", "true");
    treeSpaceButton.focus();
  }

  async function loadTreeMessages(code) {
    let notes = localPrivateTrees[code] || [];
    if (communityApiBase) {
      try {
        const payload = await apiRequest(`/api/oranges?tree=${encodeURIComponent(code)}`);
        const remoteNotes = normalizePersonalNotes(payload.oranges || payload)
          .map((note) => ({ ...note, shared: true }));
        if (remoteNotes.length > 0) {
          notes = remoteNotes;
          communityEnabled = true;
          storageModeLabel.textContent = "SHARED_SERVER";
        }
      } catch {
        // Local cached trees remain available when the shared service is offline.
      }
    }
    return notes;
  }

  async function openPrivateTree(code, notes = null) {
    const normalizedCode = String(code || "").replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(normalizedCode)) {
      treeAccessError.textContent = t("treeNotFound");
      return false;
    }
    const treeNotes = notes || (await loadTreeMessages(normalizedCode));
    if (!treeNotes.length) {
      treeAccessError.textContent = t("treeNotFound");
      return false;
    }
    currentPrivateCode = normalizedCode;
    privateTreeNotes = treeNotes;
    currentPrivateTreeName =
      treeNotes.find((note) => note.treeName)?.treeName || `${t("privateTree")} #${normalizedCode}`;
    localPrivateTrees[normalizedCode] = treeNotes;
    saveLocalPrivateTrees();
    currentVisualSeed = (Number(normalizedCode) % 9000) + 1;
    renderScene(currentVisualSeed, false, true);
    updateSpaceUI();
    closeTreeAccessDialog();
    showPersonalNote(privateTreeNotes[0]);
    try {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#tree=${normalizedCode}`,
      );
    } catch {
      // Some local file viewers do not allow history updates.
    }
    setLog(`tree.enter // #${normalizedCode} // private space`);
    return true;
  }

  async function enterPrivateTreeFromInput() {
    const code = treeCodeInput.value.replace(/\D/g, "").slice(0, 6);
    treeCodeInput.value = code;
    treeAccessError.textContent = "";
    if (!/^\d{6}$/.test(code)) {
      treeAccessError.textContent = t("treeNotFound");
      return;
    }
    enterTreeButton.disabled = true;
    const opened = await openPrivateTree(code);
    enterTreeButton.disabled = false;
    if (!opened) treeAccessError.textContent = t("treeNotFound");
  }

  async function createMyPrivateTree() {
    const treeName = treeNameInput.value.replace(/\s+/g, " ").trim().slice(0, 20);
    const message = treeFirstMessage.value.replace(/\s+/g, " ").trim();
    if (!treeName) {
      treeAccessError.textContent = t("treeNameRequired");
      treeNameInput.focus();
      return;
    }
    if (!message) {
      treeAccessError.textContent = t("treeCreateRequired");
      treeFirstMessage.focus();
      return;
    }
    createTreeButton.disabled = true;
    treeAccessError.textContent = "";
    let code = "";
    const author = treeOwnerName.value.replace(/\s+/g, " ").trim().slice(0, 16);
    let savedNote = null;
    let shared = false;
    if (communityApiBase) {
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const candidate = String(100000 + Math.floor(Math.random() * 900000));
        if (localPrivateTrees[candidate] || candidate === ownerTreeCode) continue;
        const note = {
          id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          text: message.slice(0, 48),
          author,
          treeName,
          createdAt: new Date().toISOString(),
          seed: Number(candidate),
          shared: false,
          replies: [],
        };
        try {
          const created = await apiRequest("/api/oranges", {
            method: "POST",
            body: JSON.stringify({
              text: note.text,
              author: note.author,
              treeName: note.treeName,
              seed: note.seed,
            }),
          });
          if (created?.ownerToken) rememberOrangeOwner(created.id, created.ownerToken);
          savedNote = normalizePersonalNotes([created])[0] || note;
          savedNote.shared = true;
          shared = true;
          code = candidate;
          communityEnabled = true;
          break;
        } catch (error) {
          if (error.status === 409) continue;
          code = candidate;
          savedNote = note;
          break;
        }
      }
    } else {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const candidate = String(100000 + Math.floor(Math.random() * 900000));
        if (!localPrivateTrees[candidate] && candidate !== ownerTreeCode) {
          code = candidate;
          break;
        }
      }
    }
    if (!code || !savedNote) {
      if (!code) {
        treeAccessError.textContent = t("treeNotFound");
        createTreeButton.disabled = false;
        return;
      }
      savedNote = {
        id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        text: message.slice(0, 48),
        author,
        treeName,
        createdAt: new Date().toISOString(),
        seed: Number(code),
        shared: false,
        replies: [],
      };
    }
    if (!shared) {
      rememberOrangeOwner(savedNote.id, "local");
    }
    ownerTreeCode = code;
    saveOwnerTreeCode();
    localPrivateTrees[code] = [savedNote];
    saveLocalPrivateTrees();
    treeNameInput.value = "";
    treeOwnerName.value = "";
    treeFirstMessage.value = "";
    createTreeButton.disabled = false;
    await openPrivateTree(code, [savedNote]);
    setLog(`tree.create // #${code} // private`);
  }

  function backToMainTree() {
    currentPrivateCode = "";
    privateTreeNotes = [];
    currentPrivateTreeName = "";
    currentPersonalNote = null;
    window.clearTimeout(poemTimeout);
    poemCard.classList.remove("is-visible", "is-personal", "is-foreign");
    resetHarvestControl();
    if (treeAccessDialog.classList.contains("is-open")) closeTreeAccessDialog();
    currentSeed = mainTreeSeed;
    currentVisualSeed = mainTreeSeed;
    renderScene(mainTreeSeed, false, true);
    updateSpaceUI();
    try {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    } catch {
      // Keep the current local file URL when history is restricted.
    }
    setLog("tree.exit // main orange tree");
  }

  async function copyOwnerTreeCode() {
    if (!ownerTreeCode) return;
    try {
      await navigator.clipboard.writeText(ownerTreeCode);
      treeAccessError.textContent = t("treeCodeCopied");
    } catch {
      treeCodeInput.value = ownerTreeCode;
      treeCodeInput.select();
      document.execCommand("copy");
      treeAccessError.textContent = t("treeCodeCopied");
    }
  }

  function openGuideDialog() {
    if (
      plantDialog.classList.contains("is-open") ||
      replyDialog.classList.contains("is-open") ||
      languageDialog.classList.contains("is-open") ||
      treeAccessDialog.classList.contains("is-open")
    ) {
      return;
    }
    guideDialog.classList.add("is-open");
    guideDialog.setAttribute("aria-hidden", "false");
  }

  function closeGuideDialog() {
    guideDialog.classList.remove("is-open");
    guideDialog.setAttribute("aria-hidden", "true");
    if (window.innerWidth <= 820) {
      mobileGuideButton.focus();
    } else {
      guideButton.focus();
    }
  }

  async function plantPersonalNote() {
    const text = personalNoteInput.value.replace(/\s+/g, " ").trim();
    const notes = activeNotes();
    if (!text || notes.length >= MAX_PERSONAL_NOTES) {
      updatePlantForm();
      return;
    }

    const note = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      text: text.slice(0, 48),
      author: personalNoteAuthor.value.replace(/\s+/g, " ").trim().slice(0, 16),
      treeName: currentPrivateCode ? currentPrivateTreeName : "",
      createdAt: new Date().toISOString(),
      seed: currentPrivateCode ? Number(currentPrivateCode) : 0,
      shared: false,
      replies: [],
    };
    confirmPlantButton.disabled = true;
    let savedNote = note;
    let shared = false;
    if (communityEnabled) {
      try {
        const created = await apiRequest("/api/oranges", {
          method: "POST",
          body: JSON.stringify({
            text: note.text,
            author: note.author,
            treeName: note.treeName,
            seed: note.seed,
          }),
        });
        if (created?.ownerToken) rememberOrangeOwner(created.id, created.ownerToken);
        savedNote = normalizePersonalNotes([created])[0] || note;
        savedNote.shared = true;
        shared = true;
      } catch {
        shared = false;
      }
    }
    if (!shared && !ownedOrangeTokens[savedNote.id]) {
      rememberOrangeOwner(savedNote.id, "local");
    }
    notes.push(savedNote);
    persistActiveSpace();
    const saved = true;
    closePlantDialog();
    if (currentPrivateCode) renderScene(currentVisualSeed, false, true);
    else renderScene(currentSeed, false);
    showPersonalNote(savedNote);
    flashCodeValue(personalNoteValue);
    setLog(
      shared
        ? `personal.orange.plant // note:${String(notes.length).padStart(2, "0")} // shared`
        : saved
          ? `personal.orange.plant // note:${String(notes.length).padStart(2, "0")} // local`
        : "personal.orange.plant // memory-only // storage blocked",
    );

    if (soundEnabled) {
      playTone(523.25, 0.38, 0.028);
      window.setTimeout(() => playTone(783.99, 0.5, 0.02), 90);
    }
    window.requestAnimationFrame(() => {
      const personalFruit = document.querySelector(`[data-note-id="${savedNote.id}"]`);
      if (!personalFruit) return;
      const point = fruitScreenPosition(personalFruit);
      burst(point.x, point.y, 28);
    });
  }

  function formatReplyTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "JUST NOW";
    return new Intl.DateTimeFormat(currentLanguage, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function renderReplyThread(note) {
    const replies = note?.replies || [];
    replyThread.replaceChildren();
    replyThreadCount.textContent = String(replies.length).padStart(2, "0");
    noteReplyCount.textContent = String(replies.length).padStart(2, "0");
    replyOriginal.textContent = note?.text || "";

    if (replies.length === 0) {
      const empty = document.createElement("div");
      empty.className = "reply-empty";
      empty.textContent = t("replyEmpty");
      replyThread.appendChild(empty);
      return;
    }

    replies.forEach((reply) => {
      const item = document.createElement("article");
      item.className = "reply-item";
      const header = document.createElement("header");
      const author = document.createElement("b");
      const time = document.createElement("span");
      const text = document.createElement("p");
      author.textContent = reply.author || t("anonymousVisitor");
      time.textContent = formatReplyTime(reply.createdAt);
      text.textContent = reply.text;
      header.append(author, time);
      item.append(header, text);
      replyThread.appendChild(item);
    });
    replyThread.scrollTop = replyThread.scrollHeight;
  }

  function updateReplyForm() {
    const length = replyInput.value.length;
    replyCounter.textContent = `${String(length).padStart(2, "0")} / 64`;
    confirmReplyButton.disabled =
      replyInput.value.trim().length === 0 ||
      !currentPersonalNote ||
      (currentPersonalNote.replies?.length || 0) >= 24;
  }

  function openReplyDialog() {
    if (!currentPersonalNote) return;
    replyInput.value = "";
    replyAuthor.value = "";
    renderReplyThread(currentPersonalNote);
    updateReplyForm();
    replyDialog.classList.add("is-open");
    replyDialog.setAttribute("aria-hidden", "false");
    window.setTimeout(() => replyInput.focus(), 80);
  }

  function closeReplyDialog() {
    replyDialog.classList.remove("is-open");
    replyDialog.setAttribute("aria-hidden", "true");
    if (currentPersonalNote) openReplyButton.focus();
  }

  async function submitReply() {
    const note = currentPersonalNote;
    const text = replyInput.value.replace(/\s+/g, " ").trim();
    if (!note || !text || (note.replies?.length || 0) >= 24) {
      updateReplyForm();
      return;
    }

    confirmReplyButton.disabled = true;
    const localReply = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      text: text.slice(0, 64),
      author: replyAuthor.value.replace(/\s+/g, " ").trim().slice(0, 16),
      createdAt: new Date().toISOString(),
    };
    let shared = false;

    if (communityEnabled) {
      try {
        const updated = await apiRequest(`/api/oranges/${encodeURIComponent(note.id)}/replies`, {
          method: "POST",
          body: JSON.stringify({ text: localReply.text, author: localReply.author }),
        });
        const normalized = normalizePersonalNotes([updated])[0];
        if (normalized) {
          note.author = normalized.author;
          note.text = normalized.text;
          note.createdAt = normalized.createdAt;
          note.replies = normalized.replies;
          shared = true;
        }
      } catch {
        shared = false;
      }
    }

    if (!shared) {
      note.replies = [...(note.replies || []), localReply].slice(-24);
    }

    persistActiveSpace();
    renderReplyThread(note);
    replyInput.value = "";
    replyAuthor.value = "";
    updateReplyForm();
    setLog(`reply.add // thread:${String(note.replies.length).padStart(2, "0")} // ${shared ? "shared" : "local"}`);
    if (soundEnabled) playTone(shared ? 659.25 : 587.33, 0.28, 0.018);
  }

  function triggerWind() {
    window.clearTimeout(windTimeout);
    app.classList.add("is-windy");
    windValue.classList.add("is-updated");
    windValue.textContent = "0.74";
    setLog("field.impulse // wind:0.74 // applied");
    const rect = stage.getBoundingClientRect();
    for (let i = 0; i < 28; i += 1) {
      burst(rect.width * (0.32 + Math.random() * 0.42), rect.height * (0.18 + Math.random() * 0.42), 1, true);
    }
    if (soundEnabled) playWind();
    windTimeout = window.setTimeout(() => {
      app.classList.remove("is-windy");
      windValue.textContent = "0.18";
      windValue.classList.remove("is-updated");
    }, 1350);
  }

  function initAudio() {
    if (audioContext) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext = new AudioCtor();
  }

  function playAmbientNote(frequency, volume = 0.0085) {
    if (!audioContext || !ambientMaster || !soundEnabled) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const overtoneGain = audioContext.createGain();
    oscillator.type = "sine";
    overtone.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    overtone.frequency.setValueAtTime(frequency * 2.005, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.35);
    overtoneGain.gain.setValueAtTime(volume * 0.12, now);
    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ambientMaster);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 2.5);
    overtone.stop(now + 2.5);
  }

  function scheduleAmbientNote(delay = 900) {
    window.clearTimeout(ambientTimer);
    if (!soundEnabled || !ambientMaster) return;
    ambientTimer = window.setTimeout(() => {
      if (!soundEnabled || !ambientMaster) return;
      const note = vivaldiSpringTheme[ambientStep % vivaldiSpringTheme.length];
      playAmbientNote(note);
      if (ambientStep % 4 === 0) playAmbientNote(note * 0.5, 0.0045);
      ambientStep += 1;
      scheduleAmbientNote(760);
    }, delay);
  }

  function startAmbientMusic() {
    if (!audioContext || !soundEnabled || ambientMaster) return;
    const now = audioContext.currentTime;
    const filter = audioContext.createBiquadFilter();
    const master = audioContext.createGain();
    const droneGain = audioContext.createGain();
    const droneA = audioContext.createOscillator();
    const droneB = audioContext.createOscillator();
    filter.type = "lowpass";
    filter.frequency.value = 1250;
    filter.Q.value = 0.4;
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.42, now + 3.2);
    droneGain.gain.value = 0.008;
    droneA.type = "sine";
    droneB.type = "triangle";
    droneA.frequency.value = 164.81;
    droneB.frequency.value = 246.94;
    droneB.detune.value = -7;
    droneA.connect(droneGain);
    droneB.connect(droneGain);
    droneGain.connect(master);
    master.connect(filter);
    filter.connect(audioContext.destination);
    droneA.start(now);
    droneB.start(now);
    ambientMaster = master;
    ambientNodes = [droneA, droneB, droneGain, filter];
    ambientStep = 0;
    scheduleAmbientNote(950);
  }

  function stopAmbientMusic() {
    window.clearTimeout(ambientTimer);
    if (!audioContext || !ambientMaster) return;
    const now = audioContext.currentTime;
    ambientMaster.gain.cancelScheduledValues(now);
    ambientMaster.gain.setValueAtTime(Math.max(0.0001, ambientMaster.gain.value), now);
    ambientMaster.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    const nodes = ambientNodes;
    ambientMaster = null;
    ambientNodes = [];
    window.setTimeout(() => {
      nodes.forEach((node) => {
        try {
          if (typeof node.stop === "function") node.stop();
          node.disconnect();
        } catch {
          // The node may already be disconnected.
        }
      });
    }, 520);
  }

  function playTone(frequency, duration, volume) {
    if (!audioContext || !soundEnabled) return;
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.008, now + duration);
    filter.type = "lowpass";
    filter.frequency.value = 1500;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  function playWind() {
    if (!audioContext || !soundEnabled) return;
    if (audioContext.state === "suspended") audioContext.resume();
    const duration = 2.2;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.973 + white * 0.027;
      data[i] = previous * Math.sin((Math.PI * i) / data.length) * 0.8;
    }
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 430;
    filter.Q.value = 0.42;
    gain.gain.value = 0.024;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    source.start();
  }

  function toggleSound() {
    initAudio();
    soundEnabled = !soundEnabled;
    app.classList.toggle("is-audio-on", soundEnabled);
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    mobileSoundButton.setAttribute("aria-pressed", String(soundEnabled));
    soundValue.textContent = soundEnabled ? "ON" : "OFF";
    mobileSoundValue.textContent = soundEnabled ? "ON" : "OFF";
    const audioLabel = soundEnabled ? "关闭背景音乐与音效" : "开启背景音乐与音效";
    soundButton.setAttribute("aria-label", audioLabel);
    mobileSoundButton.setAttribute("aria-label", audioLabel);
    if (soundEnabled) {
      startAmbientMusic();
      playTone(523.25, 0.42, 0.025);
      setLog("audio.scene // Vivaldi · Four Seasons / Spring I // gentle");
    } else {
      stopAmbientMusic();
      setLog("audio.scene // suspended // off");
    }
  }

  function toggleTheme() {
    const isLight = app.dataset.theme === "light";
    app.dataset.theme = isLight ? "dark" : "light";
    themeValue.textContent = isLight ? "DARK" : "LIGHT";
    mobileThemeValue.textContent = isLight ? "DARK" : "LIGHT";
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", isLight ? "#080b09" : "#e8e3d6");
    setLog(`render.mode // ${isLight ? "dark" : "light"} // applied`);
  }

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasDims = { width: rect.width, height: rect.height, dpr };
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scanParticles.length = 0;
    const count = reduceMotion.matches ? 18 : 54;
    for (let i = 0; i < count; i += 1) {
      scanParticles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: 0.5 + Math.random() * 1.1,
        speed: 0.04 + Math.random() * 0.12,
        alpha: 0.06 + Math.random() * 0.2,
      });
    }
  }

  function burst(x, y, amount, directional = false) {
    for (let i = 0; i < amount; i += 1) {
      const angle = directional ? Math.random() * 0.3 - 0.15 : Math.random() * Math.PI * 2;
      const speed = directional ? 1.2 + Math.random() * 3.2 : 0.8 + Math.random() * 3.2;
      burstParticles.push({
        x,
        y,
        vx: directional ? speed : Math.cos(angle) * speed,
        vy: directional ? (Math.random() - 0.5) * 0.8 : Math.sin(angle) * speed,
        size: 0.8 + Math.random() * 2.3,
        life: 1,
        decay: 0.014 + Math.random() * 0.018,
        vertical: Math.random() > 0.64,
      });
    }
  }

  function drawFrame(now) {
    window.cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvasDims.width, canvasDims.height);

    const isLight = app.dataset.theme === "light";
    scanParticles.forEach((particle) => {
      particle.x += particle.speed;
      if (particle.x > canvasDims.width) particle.x = 0;
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = isLight ? "#9c7b2d" : "#d5c78f";
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });

    for (let i = burstParticles.length - 1; i >= 0; i -= 1) {
      const particle = burstParticles[i];
      particle.life -= particle.decay;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.03;
      particle.vx *= 0.988;
      if (particle.life <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = particle.life * 0.9;
      ctx.fillStyle = isLight ? "#a36700" : "#ffc64d";
      if (particle.vertical) {
        ctx.fillRect(particle.x, particle.y, particle.size * 0.6, particle.size * 5);
      } else {
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
    }
    ctx.globalAlpha = 1;

    if (now - lastFrame > 400) {
      fpsSmooth = fpsSmooth * 0.87 + (1000 / (now - lastFrame)) * 0.13;
      fpsReadout.textContent = Math.min(60, fpsSmooth).toFixed(1);
      lastFrame = now;
    }
    if (!snapshotMode) animationFrame = requestAnimationFrame(drawFrame);
  }

  function updateClock() {
    const now = new Date();
    const parts = [now.getHours(), now.getMinutes(), now.getSeconds()].map((part) =>
      String(part).padStart(2, "0"),
    );
    document.querySelector("#runtimeClock").textContent = parts.join(":");
  }

  function updatePointer(event) {
    if (event.pointerType === "touch") return;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(940, ((event.clientX - rect.left) / rect.width) * 940));
      const y = Math.max(0, Math.min(940, ((event.clientY - rect.top) / rect.height) * 940));
      const values = cursorReadout.querySelectorAll("b");
      values[0].textContent = x.toFixed(2).padStart(7, "0");
      values[1].textContent = y.toFixed(2).padStart(7, "0");
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      app.style.setProperty("--mx", (-nx * 1.5).toFixed(3));
      app.style.setProperty("--my", (-ny * 1.2).toFixed(3));
      pointerFrame = 0;
    });
  }

  windButton.addEventListener("click", triggerWind);
  seedButton.addEventListener("click", regenerate);
  plantButton.addEventListener("click", openPlantDialog);
  closePlantButton.addEventListener("click", closePlantDialog);
  cancelPlantButton.addEventListener("click", closePlantDialog);
  confirmPlantButton.addEventListener("click", plantPersonalNote);
  personalNoteInput.addEventListener("input", updatePlantForm);
  personalNoteInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      plantPersonalNote();
    }
  });
  plantDialog.querySelector("[data-close-dialog]").addEventListener("click", closePlantDialog);
  openReplyButton.addEventListener("click", openReplyDialog);
  harvestPersonalButton.addEventListener("click", harvestPersonalOrange);
  closeReplyButton.addEventListener("click", closeReplyDialog);
  cancelReplyButton.addEventListener("click", closeReplyDialog);
  confirmReplyButton.addEventListener("click", submitReply);
  replyInput.addEventListener("input", updateReplyForm);
  replyInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submitReply();
    }
  });
  replyDialog.querySelector("[data-close-reply]").addEventListener("click", closeReplyDialog);
  guideButton.addEventListener("click", openGuideDialog);
  mobileGuideButton.addEventListener("click", openGuideDialog);
  closeGuideButton.addEventListener("click", closeGuideDialog);
  confirmGuideButton.addEventListener("click", closeGuideDialog);
  guideDialog.querySelector("[data-close-guide]").addEventListener("click", closeGuideDialog);
  languageButton.addEventListener("click", openLanguageDialog);
  mobileLanguageButton.addEventListener("click", openLanguageDialog);
  closeLanguageButton.addEventListener("click", closeLanguageDialog);
  languageDialog.querySelector("[data-close-language]").addEventListener("click", closeLanguageDialog);
  treeSpaceButton.addEventListener("click", openTreeAccessDialog);
  returnMainButton.addEventListener("click", backToMainTree);
  closeTreeAccessButton.addEventListener("click", closeTreeAccessDialog);
  treeAccessDialog.querySelector("[data-close-tree-access]").addEventListener("click", closeTreeAccessDialog);
  enterTreeButton.addEventListener("click", enterPrivateTreeFromInput);
  createTreeButton.addEventListener("click", createMyPrivateTree);
  openOwnTreeButton.addEventListener("click", () => {
    if (ownerTreeCode) openPrivateTree(ownerTreeCode);
  });
  copyTreeCodeButton.addEventListener("click", copyOwnerTreeCode);
  treeCodeInput.addEventListener("input", () => {
    treeCodeInput.value = treeCodeInput.value.replace(/\D/g, "").slice(0, 6);
    treeAccessError.textContent = "";
  });
  treeCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enterPrivateTreeFromInput();
    }
  });
  treeFirstMessage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      createMyPrivateTree();
    }
  });
  soundButton.addEventListener("click", toggleSound);
  themeButton.addEventListener("click", toggleTheme);
  mobileSoundButton.addEventListener("click", toggleSound);
  mobileThemeButton.addEventListener("click", toggleTheme);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (plantDialog.classList.contains("is-open")) {
      if (event.key === "Escape") closePlantDialog();
      return;
    }
    if (replyDialog.classList.contains("is-open")) {
      if (event.key === "Escape") closeReplyDialog();
      return;
    }
    if (guideDialog.classList.contains("is-open")) {
      if (event.key === "Escape") closeGuideDialog();
      return;
    }
    if (languageDialog.classList.contains("is-open")) {
      if (event.key === "Escape") closeLanguageDialog();
      return;
    }
    if (treeAccessDialog.classList.contains("is-open")) {
      if (event.key === "Escape") closeTreeAccessDialog();
      return;
    }
    if (event.target instanceof Element && event.target.closest(".fruit-node")) return;
    if (event.key.toLowerCase() === "w") triggerWind();
    if (event.key.toLowerCase() === "r") regenerate();
    if (event.key.toLowerCase() === "h" || event.key === "?") openGuideDialog();
    if (event.key.toLowerCase() === "l") openLanguageDialog();
  });

  buildLanguageGrid();
  applyLanguage(currentLanguage);
  renderScene(currentSeed, false);
  resizeCanvas();
  updateClock();
  if (!snapshotMode) {
    window.setTimeout(openGuideDialog, 380);
  }
  hydrateCommunityOranges();
  const initialPrivateCode = /^#tree=(\d{6})$/.exec(window.location.hash)?.[1];
  if (initialPrivateCode) {
    openPrivateTree(initialPrivateCode).catch(() => {
      setLog(`tree.enter.error // #${initialPrivateCode}`);
    });
  }
  if (snapshotMode && urlParams.has("plant")) {
    openPlantDialog();
  }
  const previewPersonalNote = urlParams.get("personal");
  if (snapshotMode && previewPersonalNote) {
    const note = {
      id: "preview-note",
      text: previewPersonalNote.slice(0, 48),
      createdAt: new Date().toISOString(),
      seed: currentSeed,
    };
    personalNotes = [...personalNotes.slice(-(MAX_PERSONAL_NOTES - 1)), note];
    renderScene(currentSeed, false);
    showPersonalNote(note);
  }
  if (snapshotMode && currentPersonalNote && urlParams.has("reply")) {
    openReplyDialog();
  }
  if (snapshotMode && urlParams.has("guide")) {
    openGuideDialog();
  }
  if (snapshotMode && urlParams.has("language")) {
    openLanguageDialog();
  }
  if (snapshotMode && urlParams.has("treeAccess")) {
    openTreeAccessDialog();
  }
  const previewTree = urlParams.get("privateTree");
  if (snapshotMode && /^\d{6}$/.test(previewTree || "")) {
    const note = {
      id: "preview-private-note",
      text: "这是我留给这棵树的第一句话。",
      author: "树的主人",
      createdAt: new Date().toISOString(),
      seed: Number(previewTree),
      shared: false,
      replies: [],
    };
    openPrivateTree(previewTree, [note]).then((opened) => {
      if (opened && urlParams.has("backDemo")) {
        window.setTimeout(backToMainTree, 500);
      }
    });
  }
  if (snapshotMode && urlParams.has("createTreeDemo")) {
    treeNameInput.value = "晚风里的橘树";
    treeOwnerName.value = "树的主人";
    treeFirstMessage.value = "这是我留给这棵树的第一句话。";
    createMyPrivateTree();
  }
  const previewPoem = Number(urlParams.get("poem"));
  if (snapshotMode && Number.isInteger(previewPoem) && previewPoem > 0) {
    showPoem(previewPoem - 1);
  }
  if (!snapshotMode) window.setInterval(updateClock, 1000);
  drawFrame(performance.now());
})();
