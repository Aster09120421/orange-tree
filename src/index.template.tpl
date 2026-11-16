<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta
      name="description"
      content="一棵由参数、光线和交互构成的数字橘树。触碰果实，观察它如何被重新编译。"
    />
    <meta name="theme-color" content="#080b09" />
    <title>ORANGE_TREE_07 / Parametric Study</title>
    <link rel="stylesheet" href="./styles.css?v=20261116h" />
  </head>
  <body>
    <div class="app" id="app" data-theme="dark">
      <div class="backdrop" aria-hidden="true">
        <div class="backdrop-grid"></div>
        <div class="amber-field"></div>
        <div class="blueprint-rings"></div>
        <div class="noise"></div>
      </div>

      <header class="topbar">
        <a class="identity" href="#" aria-label="ORANGE TREE 07 首页">
          <span class="identity-mark" aria-hidden="true">
            <svg viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="7" />
              <path d="M14 1v4M14 23v4M1 14h4M23 14h4M4.8 4.8l2.8 2.8M20.4 20.4l2.8 2.8M23.2 4.8l-2.8 2.8M7.6 20.4l-2.8 2.8" />
            </svg>
          </span>
          <span class="identity-copy">
            <strong>ORANGE_TREE</strong>
            <small>PARAMETRIC BOTANY / OT—07</small>
          </span>
        </a>

        <div class="runtime" aria-label="系统状态">
          <span class="live-indicator"></span>
          <span>SYSTEM ONLINE</span>
          <i>/</i>
          <span id="runtimeClock">00:00:00</span>
          <i>/</i>
          <span><b id="fpsReadout">60.0</b> FPS</span>
        </div>

        <nav class="toolbar" aria-label="场景控制">
          <button
            class="tool-button"
            id="soundButton"
            type="button"
            aria-pressed="false"
            aria-label="开启背景音乐与音效"
          >
            <span class="button-status"></span>
            <span class="button-label">AUDIO</span>
            <span class="button-value" id="soundValue">OFF</span>
          </button>
          <button class="tool-button" id="themeButton" type="button">
            <span class="button-status"></span>
            <span class="button-label">MODE</span>
            <span class="button-value" id="themeValue">DARK</span>
          </button>
          <button class="tool-button" id="guideButton" type="button" aria-label="打开使用说明">
            <span class="button-status"></span>
            <span class="button-label">GUIDE</span>
            <span class="button-value">?</span>
          </button>
          <button class="tool-button" id="languageButton" type="button" aria-label="Change language">
            <span class="button-status"></span>
            <span class="button-label">LANG</span>
            <span class="button-value" id="languageValue">中文</span>
          </button>
        </nav>
      </header>

      <main class="workspace">
        <section class="brief" aria-labelledby="heroTitle">
          <div class="brief-heading">
            <span>01 / SPECIMEN</span>
            <span>CITRUS_SINENSIS</span>
          </div>

          <div class="tree-space-status" id="treeSpaceStatus">
            <span id="spaceModeLabel">MAIN_TREE / 主树</span>
            <em id="treeSpaceName"></em>
            <b id="spaceCodeLabel">PUBLIC</b>
          </div>

          <h1 id="heroTitle">
            <span>GOLDEN</span>
            <strong>ORANGE</strong>
            <em>TREE<span class="cursor-block"></span></em>
          </h1>

          <p class="chinese-title" data-i18n="subtitle">一树金橘，被光线编译。</p>
          <p class="description" data-i18n-html="description">
            一组实时生成的枝干、叶簇与果实节点。<br />
            触碰任意金橘，完成一次采集调用。
          </p>

          <div class="algorithm" aria-label="生成算法参数">
            <div class="panel-heading">
              <span>GROWTH_ALGORITHM</span>
              <span>JS / RUNNING</span>
            </div>
            <pre><code><span class="code-dim">const</span> tree = <span class="code-function">grow</span>({
  seed: <span class="code-number" id="seedValue">0007</span>,
  light: <span class="code-number">0.92</span>,
  wind: <span class="code-number" id="windValue">0.18</span>,
  leaves: <span class="code-number" id="leafValue">1024</span>,
  fruit: <span class="code-number" id="fruitValue">28</span>,
  notes: <span class="code-number" id="personalNoteValue">00</span>
});</code></pre>
            <div class="algorithm-status">
              <span><i></i> COMPILED</span>
              <span id="buildTime">BUILD 18MS</span>
            </div>
          </div>

          <div class="controls">
            <button class="primary-action" id="windButton" type="button">
              <span class="action-index">W</span>
              <span class="action-copy">
                <strong data-i18n="wind">APPLY WIND</strong>
                <small data-i18n="windMeta">FIELD IMPULSE / 1.4S</small>
              </span>
              <span class="action-arrow" aria-hidden="true">→</span>
            </button>
            <div class="side-actions">
              <button class="secondary-action plant-action" id="plantButton" type="button">
                <span data-i18n="plant">PLANT</span>
                <span>＋</span>
              </button>
              <button class="secondary-action" id="seedButton" type="button">
                <span data-i18n="regenerate">REGENERATE</span>
                <span>↻</span>
              </button>
            </div>
          </div>

          <button class="tree-space-button" id="treeSpaceButton" type="button">
            <span data-i18n="treeSpace">我的橘树</span>
            <b id="myTreeButtonCode">＋</b>
          </button>

          <div class="mobile-actions" aria-label="移动端场景控制">
            <button
              class="mobile-tool"
              id="mobileSoundButton"
              type="button"
              aria-pressed="false"
              aria-label="开启背景音乐与音效"
            >
              <span>AUDIO</span>
              <b id="mobileSoundValue">OFF</b>
            </button>
            <button class="mobile-tool" id="mobileThemeButton" type="button">
              <span>MODE</span>
              <b id="mobileThemeValue">DARK</b>
            </button>
            <button class="mobile-tool" id="mobileGuideButton" type="button">
              <span>GUIDE</span>
              <b>?</b>
            </button>
            <button class="mobile-tool" id="mobileLanguageButton" type="button">
              <span>LANG</span>
              <b id="mobileLanguageValue">中文</b>
            </button>
          </div>

          <div class="harvest-row">
            <span class="harvest-label" data-i18n="harvestLabel">HARVEST_BUFFER</span>
            <span class="harvest-value" id="harvestCount">00</span>
            <span class="harvest-slash">/</span>
            <span class="harvest-total" id="harvestTotal">28</span>
            <div class="harvest-bar" aria-hidden="true"><i id="harvestBar"></i></div>
          </div>

          <div class="log-line" id="systemLog" role="status" aria-live="polite">
            <span>›</span>
            <span id="logText">scene.ready // select a fruit node</span>
          </div>
        </section>

        <section class="tree-stage" id="treeStage" aria-label="金橘树参数化模型">
          <div class="stage-header">
            <span>MODEL_VIEW / PERSPECTIVE_01</span>
            <span class="stage-status"><i></i> LIVE GEOMETRY</span>
          </div>

          <div class="cursor-coordinates" id="cursorReadout">
            <span>X <b>0470.00</b></span>
            <span>Y <b>0328.00</b></span>
          </div>

          <div class="stage-corners" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </div>

          <div class="stage-scanner" aria-hidden="true"></div>
          <div class="tree-glow" aria-hidden="true"></div>

          <svg
            class="tree-model"
            id="treeArt"
            viewBox="0 0 940 940"
            role="img"
            aria-labelledby="treeTitle treeDesc"
          >
            <title id="treeTitle">参数化金橘树</title>
            <desc id="treeDesc">由实时生成的枝干网络、叶簇节点和金橘果实构成的数字橘树。</desc>
            <defs>
              <radialGradient id="fruitCore" cx=".34" cy=".28" r=".8">
                <stop offset="0" stop-color="#fff4bb" />
                <stop offset=".2" stop-color="#ffd057" />
                <stop offset=".62" stop-color="#f5a515" />
                <stop offset=".9" stop-color="#d56506" />
                <stop offset="1" stop-color="#8d3703" />
              </radialGradient>
              <radialGradient id="fruitHalo">
                <stop offset="0" stop-color="#ffc64b" stop-opacity=".34" />
                <stop offset=".55" stop-color="#ffac25" stop-opacity=".09" />
                <stop offset="1" stop-color="#ffac25" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="trunkFill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#111711" />
                <stop offset=".48" stop-color="#273127" />
                <stop offset=".7" stop-color="#151d16" />
                <stop offset="1" stop-color="#090d0a" />
              </linearGradient>
              <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="13" />
              </filter>
            </defs>

            <g class="diagram-grid" aria-hidden="true">
              <path class="axis-main" d="M470 94V878M92 558H854" />
              <path class="axis-bounds" d="M148 558H792M470 144V820" />
              <path class="axis-ticks" d="M464 158h12M464 206h12M464 254h12M464 302h12M464 350h12M464 398h12M464 446h12M464 494h12M464 542h12M464 590h12M464 638h12M464 686h12M464 734h12M464 782h12M464 830h12M150 552v12M210 552v12M270 552v12M330 552v12M390 552v12M450 552v12M510 552v12M570 552v12M630 552v12M690 552v12M750 552v12" />
              <circle cx="470" cy="430" r="318" />
              <circle cx="470" cy="430" r="254" />
              <ellipse cx="470" cy="864" rx="318" ry="42" />
            </g>

            <g class="diagram-labels" aria-hidden="true">
              <text x="79" y="562">Y 0</text>
              <text x="480" y="113">X 0</text>
              <text x="773" y="334">R 318</text>
              <text x="608" y="539">ORIGIN / 0470, 0558</text>
              <text x="155" y="843">GROUND_PLANE</text>
              <text x="734" y="717">NODE_DEPTH 07</text>
              <path d="M686 324h64M718 292v64" />
            </g>

            <g class="tree-roots" id="treeRoots" filter="url(#softGlow)"></g>
            <g class="branch-network branch-back" id="branchBack"></g>
            <g class="canopy-network canopy-back" id="canopyBack"></g>
            <g class="fruit-network fruit-back" id="fruitBack"></g>
            <g class="trunk-model" id="trunkModel"></g>
            <g class="branch-network branch-mid" id="branchMid"></g>
            <g class="canopy-network canopy-mid" id="canopyMid"></g>
            <g class="fruit-network fruit-mid" id="fruitMid"></g>
            <g class="canopy-network canopy-front" id="canopyFront"></g>
            <g class="fruit-network fruit-front" id="fruitFront"></g>
            <g class="ground-scan" aria-hidden="true">
              <ellipse cx="470" cy="866" rx="182" ry="23" />
              <path d="M288 866h18M634 866h18M470 843v-13" />
            </g>
          </svg>

          <canvas id="particles" aria-hidden="true"></canvas>

          <figure class="poem-card" id="poemCard" aria-live="polite" aria-atomic="true">
            <div class="poem-meta">
              <span><span id="poemKind">HARVEST_NOTE</span> / <b id="poemNumber">00</b></span>
              <span id="poemMetaRight">FIELD_WRITING</span>
            </div>
            <blockquote id="poemText">光落下来时，叶子没有躲。</blockquote>
            <figcaption>
              <i></i>
              <span id="poemSource">橘树采集批注</span>
            </figcaption>
            <div class="poem-actions">
              <button class="poem-reply" id="openReplyButton" type="button">
                <span data-i18n="replyAction">REPLY / 回复</span>
                <b id="noteReplyCount">00</b>
              </button>
              <button class="poem-harvest" id="harvestPersonalButton" type="button">
                <span data-i18n="harvestAction">HARVEST / 摘下</span>
                <b>−</b>
              </button>
            </div>
          </figure>

          <div class="interaction-note">
            <span class="crosshair" aria-hidden="true">+</span>
            <span data-i18n="interactionHint">[ CLICK FRUIT TO HARVEST ]</span>
          </div>

          <div class="model-metrics">
            <div>
              <span>CANOPY_NODES</span>
              <strong id="nodeCount">1024</strong>
            </div>
            <div>
              <span>FRUIT_NODES</span>
              <strong id="metricFruitCount">28</strong>
            </div>
            <div>
              <span>LIGHT_FIELD</span>
              <strong>0.92</strong>
            </div>
          </div>

          <div class="model-tag model-tag-left">
            <span>BRANCH_SYSTEM_04</span>
            <small>RECURSIVE / 7 LEVELS</small>
          </div>

          <div class="model-tag model-tag-right">
            <span>YIELD_PREDICTION</span>
            <small>98.4% / OPTIMAL</small>
          </div>

          <div class="stage-footer">
            <span>SEED <b id="stageSeed">0007</b></span>
            <span>POETRY_DB <b id="poetryDbCount">LOADING</b></span>
            <span>UNITS / PX</span>
          </div>
        </section>
      </main>

      <div class="tree-space-plaque" id="treeSpacePlaque" hidden>
        <div class="tree-plaque-copy">
          <span data-i18n="privateTree">私密橘树</span>
          <strong id="treeNameUnderTree"></strong>
          <small id="treeCodeUnderTree"></small>
        </div>
        <button id="returnMainButton" type="button">
          <span>←</span>
          <span data-i18n="backToMain">返回主树</span>
        </button>
      </div>

      <footer class="footer">
        <span>ORANGE TREE LAB © MMXXVI</span>
        <span>LIGHT / CODE / TIME</span>
        <span>31.2304° N &nbsp; 121.4737° E</span>
      </footer>

      <div class="plant-dialog" id="plantDialog" aria-hidden="true">
        <button class="dialog-backdrop" type="button" data-close-dialog aria-label="关闭种橘子窗口"></button>
        <section
          class="plant-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plantTitle"
          aria-describedby="plantDescription"
        >
          <header class="plant-header">
            <span>CULTIVATE_ORANGE / 01</span>
            <button class="dialog-close" id="closePlantButton" type="button" aria-label="关闭">×</button>
          </header>
          <div class="plant-content">
            <p class="plant-index">PERSONAL_GRAFT / LOCAL_STORAGE</p>
            <h2 id="plantTitle" data-i18n-html="plantTitle">种一颗<br />有名字的橘子。</h2>
            <p class="plant-description" id="plantDescription" data-i18n-html="plantDescription">
              留下一句话。它会成为树上一颗独有的果实，<br />
              以后再点开，这句话仍会回到这里。
            </p>
            <label class="note-label" for="personalNote" data-i18n="messageLabel">YOUR_MESSAGE / 你的留言</label>
            <div class="note-field">
              <textarea
                id="personalNote"
                maxlength="48"
                rows="3"
                placeholder="写下一句只有这颗橘子记得的话……"
                data-i18n-placeholder="messagePlaceholder"
              ></textarea>
              <span class="note-counter" id="noteCounter">00 / 48</span>
            </div>
            <div class="signature-field">
              <label for="personalNoteAuthor" data-i18n="signatureLabel">SIGNATURE / 署名</label>
              <input
                id="personalNoteAuthor"
                type="text"
                maxlength="16"
                autocomplete="nickname"
                placeholder="匿名种橘人"
                data-i18n-placeholder="signaturePlaceholder"
              />
            </div>
            <div class="plant-meta">
              <span>STORAGE / <b id="storageModeLabel">LOCAL_BROWSER</b></span>
              <span>SLOTS / <b id="personalSlotValue">00 / 28</b></span>
            </div>
            <div class="plant-actions">
              <button class="dialog-cancel" id="cancelPlantButton" type="button" data-i18n="cancel">取消</button>
              <button class="dialog-submit" id="confirmPlantButton" type="button" disabled>
                <span data-i18n="plantSubmit">种下这颗橘子</span>
                <span>＋</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="plant-dialog reply-dialog" id="replyDialog" aria-hidden="true">
        <button class="dialog-backdrop" type="button" data-close-reply aria-label="关闭回复窗口"></button>
        <section
          class="plant-panel reply-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="replyTitle"
        >
          <header class="plant-header">
            <span>REPLY_THREAD / OPEN</span>
            <button class="dialog-close" id="closeReplyButton" type="button" aria-label="关闭">×</button>
          </header>
          <div class="reply-content">
            <p class="plant-index">RESPOND_TO_PERSONAL_ORANGE</p>
            <h2 id="replyTitle" data-i18n="replyTitle">回应这颗橘子。</h2>
            <blockquote class="reply-original" id="replyOriginal"></blockquote>
            <div class="reply-thread-heading">
              <span data-i18n="repliesLabel">REPLIES / 回复</span>
              <b id="replyThreadCount">00</b>
            </div>
            <div class="reply-thread" id="replyThread"></div>
            <label class="note-label" for="replyInput" data-i18n="replyLabel">YOUR_REPLY / 你的回应</label>
            <div class="reply-name-row">
              <input
                id="replyAuthor"
                type="text"
                maxlength="16"
                autocomplete="nickname"
                placeholder="署名（可选）"
                data-i18n-placeholder="replySignaturePlaceholder"
              />
              <span id="replyCounter">00 / 64</span>
            </div>
            <textarea
              class="reply-input"
              id="replyInput"
              maxlength="64"
              rows="3"
              placeholder="留下一句回应……"
              data-i18n-placeholder="replyPlaceholder"
            ></textarea>
            <div class="plant-actions">
              <button class="dialog-cancel" id="cancelReplyButton" type="button" data-i18n="cancel">取消</button>
              <button class="dialog-submit" id="confirmReplyButton" type="button" disabled>
                <span data-i18n="replySubmit">发出回复</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="plant-dialog guide-dialog" id="guideDialog" aria-hidden="true">
        <button class="dialog-backdrop" type="button" data-close-guide aria-label="关闭使用说明"></button>
        <section
          class="plant-panel guide-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guideTitle"
        >
          <header class="plant-header">
            <span>FIELD_MANUAL / v3.0</span>
            <button class="dialog-close" id="closeGuideButton" type="button" aria-label="关闭">×</button>
          </header>
          <div class="guide-content">
            <p class="plant-index">HOW_TO_STAY_WITH_THE_TREE</p>
            <h2 id="guideTitle" data-i18n-html="guideTitle">与这棵树<br />相处的方法。</h2>
            <div class="guide-steps">
              <article>
                <span>01</span>
                <div><b data-i18n="guideStep1Title">摘一颗橘子</b><p data-i18n="guideStep1Body">点击树上发光的金橘，会读到一条诗歌，并计入采集数量。</p></div>
              </article>
              <article>
                <span>02</span>
                <div><b data-i18n="guideStep2Title">种下自己的橘子</b><p data-i18n="guideStep2Body">点击 `PLANT`，留下最多 48 字的留言和可选署名。</p></div>
              </article>
              <article>
                <span>03</span>
                <div><b data-i18n="guideStep3Title">回复与摘下</b><p data-i18n="guideStep3Body">点开个人橘子后可以回复留言；连续点击两次 `HARVEST / 摘下` 可以移除自己的橘子。</p></div>
              </article>
              <article>
                <span>04</span>
                <div><b data-i18n="guideStep4Title">背景声音</b><p data-i18n="guideStep4Body">点击 `AUDIO` 开启维瓦尔第《四季·春》第一乐章的舒缓改编；刮风时只会听见轻柔风声。</p></div>
              </article>
              <article>
                <span>05</span>
                <div><b data-i18n="guideStep5Title">进入私密橘树</b><p data-i18n="guideStep5Body">点击“我的橘树”可以创建一棵带编号的树；输入别人的六位编号即可进入并回复。</p></div>
              </article>
            </div>
            <div class="guide-note">
              <span data-i18n="guideNoteTitle">LOCAL MODE</span>
              <p data-i18n="guideNoteBody">留言与回复保存在当前浏览器；点击 AUDIO 可以开启背景音乐。</p>
            </div>
            <button class="guide-confirm" id="confirmGuideButton" type="button">
              <span data-i18n="guideClose">回到橘树下</span>
              <span>→</span>
            </button>
          </div>
        </section>
      </div>

      <div class="plant-dialog language-dialog" id="languageDialog" aria-hidden="true">
        <button class="dialog-backdrop" type="button" data-close-language aria-label="Close language menu"></button>
        <section
          class="plant-panel language-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="languageTitle"
        >
          <header class="plant-header">
            <span>LANGUAGE_SYSTEM / 08</span>
            <button class="dialog-close" id="closeLanguageButton" type="button" aria-label="Close">×</button>
          </header>
          <div class="language-content">
            <p class="plant-index">DISPLAY_LANGUAGE</p>
            <h2 id="languageTitle" data-i18n="languageTitle">选择界面语言</h2>
            <p class="language-description" data-i18n="languageDescription">
              界面文字会立即切换，诗歌与留言保持原样。
            </p>
            <div class="language-grid" id="languageGrid"></div>
          </div>
        </section>
      </div>

      <div class="plant-dialog tree-access-dialog" id="treeAccessDialog" aria-hidden="true">
        <button class="dialog-backdrop" type="button" data-close-tree-access aria-label="Close"></button>
        <section
          class="plant-panel tree-access-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="treeAccessTitle"
        >
          <header class="plant-header">
            <span>TREE_NETWORK / PRIVATE</span>
            <button class="dialog-close" id="closeTreeAccessButton" type="button" aria-label="Close">×</button>
          </header>
          <div class="tree-access-content">
            <p class="plant-index">ORANGE_TREE_SPACES</p>
            <h2 id="treeAccessTitle" data-i18n="treeDialogTitle">进入一棵私密橘树。</h2>
            <p class="tree-access-description" data-i18n="treeDialogDescription">
              创建时无需填写编号，系统会自动生成随机六位编号；输入朋友分享的编号可进入已有私密树。
            </p>
            <section class="tree-account-card" aria-labelledby="treeAccountTitle">
              <div class="tree-section-heading">
                <span id="treeAccountTitle" data-i18n="anonymousAccount">匿名账号</span>
                <b>ANON</b>
              </div>
              <p class="tree-account-status" id="treeAccountStatus" data-i18n="accountAutoCreate">
                首次创建私密树时会自动生成账号和恢复码。
              </p>
              <code class="tree-account-code" id="treeAccountCode" hidden></code>
              <div class="tree-account-actions">
                <button id="copyAccountCodeButton" type="button" data-i18n="copyRecoveryCode" hidden>
                  复制恢复码
                </button>
                <button id="toggleAccountRecoveryButton" type="button" data-i18n="showAccountRecovery">
                  已有恢复码？恢复账号
                </button>
              </div>
              <div class="tree-account-recovery" id="accountRecoverySection" hidden>
                <label for="accountRecoveryInput" data-i18n="accountRecoveryLabel">账号恢复码</label>
                <input
                  id="accountRecoveryInput"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="OT-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  data-i18n-placeholder="accountRecoveryPlaceholder"
                />
                <button id="recoverAccountButton" type="button" data-i18n="recoverAccount">
                  恢复匿名账号
                </button>
                <p class="tree-access-error" id="accountRecoveryError" role="status" aria-live="polite"></p>
              </div>
            </section>
            <button class="tree-mode-toggle" id="toggleTreeJoinButton" type="button" data-i18n="showJoinTree">
              已有编号？进入朋友的橘树
            </button>
            <div class="tree-access-section" id="treeJoinSection" hidden>
              <div class="tree-section-heading">
                <span data-i18n="joinExistingTree">进入已有橘树</span>
                <b>JOIN</b>
              </div>
              <label for="treeCodeInput" data-i18n="treeCodeLabel">橘树编号</label>
              <div class="tree-code-row">
                <input
                  id="treeCodeInput"
                  type="text"
                  inputmode="numeric"
                  maxlength="6"
                  autocomplete="off"
                  placeholder="000000"
                  data-i18n-placeholder="treeCodePlaceholder"
                />
                <button id="enterTreeButton" type="button" data-i18n="enterTree">进入</button>
              </div>
              <p class="tree-access-error" id="treeAccessError" role="status" aria-live="polite"></p>
            </div>
            <div class="tree-owner-summary" id="treeOwnerSummary" hidden>
              <span data-i18n="myTreeCode">我的橘树编号</span>
              <b id="ownerTreeCode">------</b>
              <div>
                <button id="openOwnTreeButton" type="button" data-i18n="enterMyTree">进入我的树</button>
                <button id="copyTreeCodeButton" type="button" data-i18n="copyCode">复制编号</button>
                <button class="tree-destroy-button" id="destroyPrivateTreeButton" type="button" data-i18n="destroyTree">
                  销毁这棵树
                </button>
              </div>
            </div>
            <div class="tree-create-section" id="treeCreateSection">
              <div class="tree-section-heading">
                <span data-i18n="createTreeTitle">种一棵自己的橘树</span>
                <b>PRIVATE</b>
              </div>
              <label for="treeNameInput" data-i18n="treeNameLabel">橘树名称</label>
              <input
                id="treeNameInput"
                type="text"
                maxlength="20"
                placeholder="例如：晚风里的橘树"
                data-i18n-placeholder="treeNamePlaceholder"
              />
              <label for="treeOwnerName" data-i18n="ownerName">你的名字</label>
              <input
                id="treeOwnerName"
                type="text"
                maxlength="16"
                autocomplete="nickname"
                placeholder="匿名种树人"
                data-i18n-placeholder="ownerNamePlaceholder"
              />
              <label for="treeFirstMessage" data-i18n="firstTreeMessage">第一句留言</label>
              <textarea
                id="treeFirstMessage"
                maxlength="48"
                rows="3"
                placeholder="写下一句只属于这棵树的话……"
                data-i18n-placeholder="firstTreeMessagePlaceholder"
              ></textarea>
              <button class="tree-create-button" id="createTreeButton" type="button" data-i18n="createTree">
                种下我的橘树
              </button>
              <p class="tree-create-hint" data-i18n="treeCodeAuto">六位访问编号会在创建后自动生成。</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <script src="./i18n.js?v=20261117a"></script>
    <script src="./poetry-db.js?v=20261116h"></script>
    <script src="./app.js?v=20261116h"></script>
  </body>
</html>
