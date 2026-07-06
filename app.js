const STORAGE_KEY = "blockplan-prototype-v1";
const LANG_STORAGE_KEY = "blockplan-language";
const THEME_STORAGE_KEY = "blockplan-theme";
const ONBOARDING_STORAGE_KEY = "blockplan-onboarding-seen";
const EXPORT_VERSION = 1;
const MINUTES_PER_DAY = 24 * 60;
const DAY_START_HOUR = 0;
const DAY_HOUR_COUNT = 24;
const DEFAULT_LANG = "zh";

const classColors = {
  考研: "#4f7cff",
  生活: "#0f9f6e",
  项目: "#d65f32",
  杂事: "#7c3aed",
};

const defaultState = {
  view: "week",
  focus: "all",
  anchorDate: isoDate(new Date()),
  selectedInstanceId: null,
  templates: [
    {
      id: uid(),
      name: "高数第三章复习",
      className: "考研",
      tags: ["数学", "高数", "第三章"],
      duration: 90,
      color: "#4f7cff",
      mode: "slot",
      note: "拉格朗日中值定理、单调性、极值。完成标准：整理 5 个易错点。",
    },
    {
      id: uid(),
      name: "英语阅读精练",
      className: "考研",
      tags: ["英语", "阅读"],
      duration: 60,
      color: "#22a06b",
      mode: "slot",
      note: "一篇阅读，做题后复盘错因和生词。",
    },
    {
      id: uid(),
      name: "政治选择题",
      className: "考研",
      tags: ["政治", "选择"],
      duration: 45,
      color: "#d94867",
      mode: "slot",
      note: "刷 30 道选择题，记录薄弱章节。",
    },
    {
      id: uid(),
      name: "午饭",
      className: "生活",
      tags: ["吃饭", "固定"],
      duration: 45,
      color: "#0f9f6e",
      mode: "slot",
      note: "生活类任务也能进入排程，避免计划只剩学习。",
    },
    {
      id: uid(),
      name: "项目资料整理",
      className: "项目",
      tags: ["比赛", "资料"],
      duration: 120,
      color: "#d65f32",
      mode: "slot",
      note: "把资料、引用和截图统一收进项目文件夹。",
    },
    {
      id: uid(),
      name: "晚间复盘",
      className: "杂事",
      tags: ["复盘", "统计"],
      duration: 30,
      color: "#7c3aed",
      mode: "slot",
      note: "记录完成、推迟、卡点，给明天重排用。",
    },
  ],
  instances: [],
};

let state = loadState();
let language = loadLanguage();
let theme = loadTheme();
let activeGuideTopic = "blocks";
let dragTemplateId = null;
let dragInstanceId = null;

const els = {};

const i18n = {
  zh: {
    appSubtitle: "任务块排程器",
    languageToggle: "EN",
    languageTitle: "Switch to English",
    themeDark: "深色模式",
    themeLight: "浅色模式",
    switchToDark: "切换到深色模式",
    switchToLight: "切换到浅色模式",
    helpTitle: "使用指南",
    onboardingTitle: "三步开始使用 BlockPlan",
    onboardingSubtitle: "把常做的事做成块，再拖进时间表。",
    onboardingStep1Title: "先建任务块",
    onboardingStep1Body: "点击新建块，保存名称、分类、标签、颜色和默认时长。",
    onboardingStep2Title: "拖到时间格",
    onboardingStep2Body: "从模板库拖到周视图或日视图，任务就会拥有日期和时间。",
    onboardingStep3Title: "执行和复盘",
    onboardingStep3Body: "点击任务查看详情，右侧面板可以完成、拆分、延后或删除。",
    onboardingGuide: "查看使用演示",
    onboardingGuideHide: "收起使用演示",
    onboardingDone: "开始使用",
    guideTabsLabel: "使用演示目录",
    guideTopics: [
      {
        id: "blocks",
        tab: "任务块",
        title: "先把常做的事做成任务块",
        body: "点击新建块，填写名称、分类、标签、默认时长、颜色和备注。模板会留在左侧，以后可以反复拖出来用。",
        tip: "建议把名称写成可执行动作，例如“英语阅读精练”或“项目资料整理”。",
      },
      {
        id: "schedule",
        tab: "拖拽",
        title: "拖到时间格，计划就落地了",
        body: "从左侧模板库按住任务块，拖到中间日历画布的具体日期和时间。松手后，它会变成一次已经安排好的任务。",
        tip: "任务块高度会跟随时长变化，冲突任务会被标记出来。",
      },
      {
        id: "details",
        tab: "详情",
        title: "点击任务查看完整详情",
        body: "日历里的短任务可能只显示名称和时间。点击任务块或当前日清单里的任务，会弹出详情卡，显示状态、分类、完整时间和备注。",
        tip: "详情卡用于快速查看；右侧详情面板负责修改任务。",
      },
      {
        id: "adjust",
        tab: "调整",
        title: "在右侧面板调整和复盘",
        body: "选择任务后，可以标为完成、拆分、提前、延后、缩短、延长、推迟一天或删除。当前日清单会自动按时间排序。",
        tip: "删除只会删除这一次安排，不会删除左侧模板。",
      },
      {
        id: "preferences",
        tab: "偏好",
        title: "语言和深色模式都保存在本机",
        body: "顶部 EN / 中文 可以切换界面语言，◐ / ◑ 可以切换浅色和深色模式。你的任务名称、备注和标签不会被自动翻译。",
        tip: "第一次打开会跟随系统主题，手动切换后会记住选择。",
      },
      {
        id: "backup",
        tab: "备份",
        title: "用导入导出保护你的计划",
        body: "导出会把任务块和排程保存成 JSON 文件；导入可以恢复；重置会清空当前数据并恢复默认示例。",
        tip: "清缓存、换浏览器、卸载应用或换设备前，先导出一份 JSON。",
      },
      {
        id: "ai",
        tab: "AI 草稿",
        title: "AI 生成是本地规则草稿",
        body: "输入自然语言描述，BlockPlan 会识别常见任务关键词和时间表达，快速创建任务块和排程草稿。",
        tip: "当前不会调用在线大模型，更适合当作快速录入入口。",
      },
    ],
    toolbarLabel: "排程工具栏",
    previous: "上一段时间",
    today: "回到今天",
    next: "下一段时间",
    viewSwitch: "视图切换",
    views: { week: "周", day: "日", class: "类" },
    aiGenerate: "AI 生成",
    addBlock: "新建块",
    export: "导出",
    import: "导入",
    reset: "重置",
    library: "模板库",
    librarySubtitle: "先建块，再拖进时间表",
    collapseLibrary: "收起模板库",
    search: "搜索",
    searchPlaceholder: "数学 / 吃饭 / 论文",
    focus: { all: "全部", 考研: "考研", 生活: "生活", 项目: "项目" },
    queue: "待安排",
    queueSubtitle: "模板还没生成过实例",
    detail: "详情",
    detailHint: "选择一个任务块",
    detailEmpty: "点击日历里的任务，或从左侧拖入一个任务块。",
    currentList: "当前日清单",
    currentListSubtitle: "由当前日期任务自动生成",
    stats: "统计",
    statsSubtitle: "按大类汇总已排时间",
    dialogNew: "新建任务块",
    dialogEdit: "编辑任务块",
    close: "关闭",
    name: "名称",
    namePlaceholder: "高数第三章复习",
    className: "大类",
    tags: "子类 / tag",
    tagsPlaceholder: "数学, 高数, 第三章",
    duration: "默认时长",
    color: "颜色",
    mode: "排程类型",
    note: "备注",
    notePlaceholder: "可以写资料、目标、完成标准",
    cancel: "取消",
    save: "保存",
    aiDialogTitle: "AI 生成任务块",
    aiPromptLabel: "描述你想安排的事",
    aiPromptExample: "明天上午安排高数第三章复习 90 分钟，下午安排英语阅读 60 分钟，晚上留 30 分钟复盘。",
    aiNote: "原型里用规则解析模拟 AI：会识别数学、英语、政治、复盘、吃饭、运动等关键词并创建任务块。",
    generate: "生成",
    plannerSubtitle: "横轴日期，纵轴时间。拖动任务块到格子里。",
    classPlannerTitle: "分类排程",
    classPlannerSubtitle: "横轴 class/tag，纵轴日期。适合检查大类之间的占比。",
    timeCorner: "时间",
    dateCorner: "日期",
    minute: "分钟",
    emptyUnscheduled: "所有任务块都至少安排过一次。",
    emptyCurrentDate: "当前日期还没有安排。",
    emptyStats: "拖入任务后会生成统计。",
    untagged: "未标记",
    unclassified: "未分类",
    conflictTitle: "这个时间段和同一天的其他任务重叠",
    detailTask: "任务",
    detailCategory: "分类",
    detailTime: "时间",
    detailConflict: "冲突",
    conflictText: "这个时间段和同一天的其他任务重叠。",
    detailNote: "备注",
    detailStatus: "状态",
    detailPopoverTitle: "任务详情",
    statusPlanned: "计划中",
    statusDone: "已完成",
    noNote: "暂无备注",
    markUndone: "标为未完成",
    markDone: "标为完成",
    split: "拆成两块",
    earlier: "提前15分",
    later: "延后15分",
    shorter: "缩短15分",
    longer: "延长15分",
    postpone: "推迟一天",
    delete: "删除",
    generatedFrom: "由描述生成",
    importInvalid: "导入失败：文件不是有效的 BlockPlan JSON。",
    importDone: "导入完成。",
    importParseError: "导入失败：JSON 文件无法解析。",
    resetConfirm: "确定要清空当前数据并恢复默认示例吗？建议先导出备份。",
    modes: { slot: "时间段", point: "时间点", day: "整天", week: "跨周" },
    classes: { 考研: "考研", 生活: "生活", 项目: "项目", 杂事: "杂事" },
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    aiNames: {
      math: "数学复习",
      english: "英语训练",
      politics: "政治刷题",
      meal: "吃饭",
      exercise: "运动",
      project: "项目推进",
      review: "晚间复盘",
      fallback: "新任务",
    },
    aiTags: {
      math: ["数学"],
      english: ["英语"],
      politics: ["政治"],
      meal: ["吃饭"],
      exercise: ["运动"],
      project: ["项目"],
      review: ["复盘"],
      fallback: ["AI"],
    },
  },
  en: {
    appSubtitle: "Task Block Scheduler",
    languageToggle: "中文",
    languageTitle: "切换到中文",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    helpTitle: "User guide",
    onboardingTitle: "Start BlockPlan in three steps",
    onboardingSubtitle: "Turn recurring work into blocks, then place them on your planner.",
    onboardingStep1Title: "Create task blocks",
    onboardingStep1Body: "Use New Block to save the name, class, tags, color, and default duration.",
    onboardingStep2Title: "Drag into time",
    onboardingStep2Body: "Drag a block from the template library into week or day view to give it a date and time.",
    onboardingStep3Title: "Execute and review",
    onboardingStep3Body: "Click a task for details. Use the right panel to mark done, split, postpone, or delete.",
    onboardingGuide: "Show in-app guide",
    onboardingGuideHide: "Hide in-app guide",
    onboardingDone: "Start planning",
    guideTabsLabel: "Guide sections",
    guideTopics: [
      {
        id: "blocks",
        tab: "Blocks",
        title: "Turn recurring work into task blocks",
        body: "Click New Block, then fill in the name, class, tags, default duration, color, and note. The template stays in the left library for reuse.",
        tip: "Use actionable names such as English reading or Project research.",
      },
      {
        id: "schedule",
        tab: "Drag",
        title: "Drag into a time slot to make the plan real",
        body: "Hold a block from the template library, drag it onto a date and time in the planner canvas, then release. It becomes a scheduled task instance.",
        tip: "Task height follows duration, and overlapping tasks are marked as conflicts.",
      },
      {
        id: "details",
        tab: "Details",
        title: "Click a task to see complete details",
        body: "Short task cards may only show name and time. Click a scheduled task or current-day item to open a card with status, category, full time, and notes.",
        tip: "The popover is for viewing; use the right detail panel to edit.",
      },
      {
        id: "adjust",
        tab: "Adjust",
        title: "Use the right panel to adjust and review",
        body: "After selecting a task, mark it done, split it, move it earlier/later, resize it, postpone it, or delete it. The current-day list stays sorted by time.",
        tip: "Delete removes only this scheduled instance, not the original template.",
      },
      {
        id: "preferences",
        tab: "Prefs",
        title: "Language and theme preferences stay local",
        body: "Use EN / 中文 to switch language, and ◐ / ◑ to switch light or dark mode. User-created names, notes, and tags are not auto-translated.",
        tip: "BlockPlan follows system theme at first launch, then remembers your manual choice.",
      },
      {
        id: "backup",
        tab: "Backup",
        title: "Protect your plan with import and export",
        body: "Export saves task blocks and schedules as JSON. Import restores them. Reset clears current data and restores default examples.",
        tip: "Export before clearing cache, switching browsers, uninstalling, or moving devices.",
      },
      {
        id: "ai",
        tab: "AI Draft",
        title: "AI Draft is local rule-based drafting",
        body: "Describe your plan in natural language. BlockPlan recognizes common task keywords and timing phrases to create blocks and draft schedules.",
        tip: "The current version does not call an online model; treat it as fast input.",
      },
    ],
    toolbarLabel: "Planner toolbar",
    previous: "Previous range",
    today: "Today",
    next: "Next range",
    viewSwitch: "View switcher",
    views: { week: "Week", day: "Day", class: "Class" },
    aiGenerate: "AI Draft",
    addBlock: "New Block",
    export: "Export",
    import: "Import",
    reset: "Reset",
    library: "Template Library",
    librarySubtitle: "Build blocks first, then drag them into time",
    collapseLibrary: "Collapse template library",
    search: "Search",
    searchPlaceholder: "math / meal / paper",
    focus: { all: "All", 考研: "Exam", 生活: "Life", 项目: "Project" },
    queue: "Unscheduled",
    queueSubtitle: "Templates that have not been placed yet",
    detail: "Details",
    detailHint: "Select a task block",
    detailEmpty: "Click a scheduled task, or drag a block from the left.",
    currentList: "Current Day",
    currentListSubtitle: "Generated from the current day's schedule",
    stats: "Stats",
    statsSubtitle: "Scheduled time by category",
    dialogNew: "New Task Block",
    dialogEdit: "Edit Task Block",
    close: "Close",
    name: "Name",
    namePlaceholder: "Calculus chapter review",
    className: "Class",
    tags: "Subclass / tags",
    tagsPlaceholder: "math, calculus, chapter 3",
    duration: "Default duration",
    color: "Color",
    mode: "Schedule type",
    note: "Note",
    notePlaceholder: "Materials, goal, or completion standard",
    cancel: "Cancel",
    save: "Save",
    aiDialogTitle: "AI Draft Task Blocks",
    aiPromptLabel: "Describe what you want to schedule",
    aiPromptExample: "Tomorrow morning schedule calculus review for 90 minutes, afternoon English reading for 60 minutes, and evening review for 30 minutes.",
    aiNote: "This prototype simulates AI with local rules. It recognizes keywords such as math, English, politics, review, meal, exercise, and project.",
    generate: "Generate",
    plannerSubtitle: "Dates across, time down. Drag task blocks into the grid.",
    classPlannerTitle: "Class Planner",
    classPlannerSubtitle: "Class/tag across, date down. Useful for checking category balance.",
    timeCorner: "Time",
    dateCorner: "Date",
    minute: "min",
    emptyUnscheduled: "Every task block has been scheduled at least once.",
    emptyCurrentDate: "No tasks scheduled for this date.",
    emptyStats: "Drag tasks in to generate stats.",
    untagged: "Untagged",
    unclassified: "Unclassified",
    conflictTitle: "This time range overlaps another task on the same day",
    detailTask: "Task",
    detailCategory: "Category",
    detailTime: "Time",
    detailConflict: "Conflict",
    conflictText: "This time range overlaps another task on the same day.",
    detailNote: "Note",
    detailStatus: "Status",
    detailPopoverTitle: "Task Details",
    statusPlanned: "Planned",
    statusDone: "Done",
    noNote: "No note",
    markUndone: "Mark Undone",
    markDone: "Mark Done",
    split: "Split",
    earlier: "15m earlier",
    later: "15m later",
    shorter: "15m shorter",
    longer: "15m longer",
    postpone: "Postpone 1 day",
    delete: "Delete",
    generatedFrom: "Generated from",
    importInvalid: "Import failed: this is not a valid BlockPlan JSON file.",
    importDone: "Import complete.",
    importParseError: "Import failed: the JSON file could not be parsed.",
    resetConfirm: "Clear current data and restore the default examples? Export a backup first if needed.",
    modes: { slot: "Time Block", point: "Time Point", day: "All Day", week: "Cross-week" },
    classes: { 考研: "Exam Prep", 生活: "Life", 项目: "Project", 杂事: "Misc" },
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    aiNames: {
      math: "Math Review",
      english: "English Practice",
      politics: "Politics Practice",
      meal: "Meal",
      exercise: "Exercise",
      project: "Project Work",
      review: "Evening Review",
      fallback: "New Task",
    },
    aiTags: {
      math: ["Math"],
      english: ["English"],
      politics: ["Politics"],
      meal: ["Meal"],
      exercise: ["Exercise"],
      project: ["Project"],
      review: ["Review"],
      fallback: ["AI"],
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  seedInstances();
  bindEvents();
  render();
  showOnboardingIfNeeded();
});

function cacheElements() {
  Object.assign(els, {
    appShell: document.querySelector(".app-shell"),
    templateList: document.querySelector("#templateList"),
    unscheduledList: document.querySelector("#unscheduledList"),
    plannerCanvas: document.querySelector("#plannerCanvas"),
    rangeTitle: document.querySelector("#rangeTitle"),
    rangeSubtitle: document.querySelector("#rangeSubtitle"),
    legend: document.querySelector("#legend"),
    taskDetailPopover: document.querySelector("#taskDetailPopover"),
    detailHint: document.querySelector("#detailHint"),
    detailContent: document.querySelector("#detailContent"),
    currentListTitle: document.querySelector("#currentListTitle"),
    currentListSubtitle: document.querySelector("#currentListSubtitle"),
    todayList: document.querySelector("#todayList"),
    statsList: document.querySelector("#statsList"),
    templateSearch: document.querySelector("#templateSearch"),
    templateDialog: document.querySelector("#templateDialog"),
    templateForm: document.querySelector("#templateForm"),
    templateName: document.querySelector("#templateName"),
    templateClass: document.querySelector("#templateClass"),
    templateTags: document.querySelector("#templateTags"),
    templateDuration: document.querySelector("#templateDuration"),
    templateColor: document.querySelector("#templateColor"),
    templateMode: document.querySelector("#templateMode"),
    templateNote: document.querySelector("#templateNote"),
    addTemplateButton: document.querySelector("#addTemplateButton"),
    collapseLibrary: document.querySelector("#collapseLibrary"),
    aiDialog: document.querySelector("#aiDialog"),
    aiForm: document.querySelector("#aiForm"),
    aiPrompt: document.querySelector("#aiPrompt"),
    aiDraftButton: document.querySelector("#aiDraftButton"),
    languageToggleButton: document.querySelector("#languageToggleButton"),
    themeToggleButton: document.querySelector("#themeToggleButton"),
    helpButton: document.querySelector("#helpButton"),
    onboardingDialog: document.querySelector("#onboardingDialog"),
    onboardingDoneButton: document.querySelector("#onboardingDoneButton"),
    guideToggleButton: document.querySelector("#guideToggleButton"),
    guidePanel: document.querySelector("#guidePanel"),
    guideTabs: document.querySelector("#guideTabs"),
    guideContent: document.querySelector("#guideContent"),
    exportDataButton: document.querySelector("#exportDataButton"),
    importDataButton: document.querySelector("#importDataButton"),
    resetDataButton: document.querySelector("#resetDataButton"),
    importDataInput: document.querySelector("#importDataInput"),
    todayButton: document.querySelector("#todayButton"),
    prevRange: document.querySelector("#prevRange"),
    nextRange: document.querySelector("#nextRange"),
  });
}

function bindEvents() {
  els.addTemplateButton.addEventListener("click", () => openTemplateDialog());
  els.languageToggleButton.addEventListener("click", toggleLanguage);
  els.themeToggleButton.addEventListener("click", toggleTheme);
  els.helpButton.addEventListener("click", openOnboarding);
  els.guideToggleButton.addEventListener("click", toggleGuidePanel);
  els.onboardingDialog.addEventListener("close", () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
  });

  els.templateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveTemplateFromDialog();
  });

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });

  els.aiDraftButton.addEventListener("click", () => {
    els.aiDialog.showModal();
  });

  els.aiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createAiDrafts();
  });
  els.aiPrompt.addEventListener("input", () => {
    els.aiPrompt.dataset.touched = "true";
  });

  els.exportDataButton.addEventListener("click", exportData);
  els.importDataButton.addEventListener("click", () => els.importDataInput.click());
  els.importDataInput.addEventListener("change", importDataFromFile);
  els.resetDataButton.addEventListener("click", resetData);

  els.templateSearch.addEventListener("input", renderTemplates);

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      state.selectedInstanceId = null;
      saveState();
      render();
    });
  });

  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.focus = button.dataset.focus;
      saveState();
      render();
    });
  });

  els.collapseLibrary.addEventListener("click", () => {
    els.appShell.classList.toggle("library-collapsed");
  });

  els.todayButton.addEventListener("click", () => {
    state.anchorDate = isoDate(new Date());
    saveState();
    render();
  });

  els.prevRange.addEventListener("click", () => shiftRange(-1));
  els.nextRange.addEventListener("click", () => shiftRange(1));
  els.plannerCanvas.addEventListener("scroll", hideTaskDetailPopover);
  window.addEventListener("resize", hideTaskDetailPopover);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.taskDetailPopover.hidden) {
      hideTaskDetailPopover();
      return;
    }
    if (isEditingContext(event.target)) return;
    if (event.key === "Delete" && state.selectedInstanceId) {
      deleteInstance(state.selectedInstanceId);
    }
  });

  document.addEventListener("click", (event) => {
    if (els.taskDetailPopover.hidden) return;
    if (els.taskDetailPopover.contains(event.target)) return;
    if (event.target.closest(".scheduled-block, .class-block, .today-item")) return;
    hideTaskDetailPopover();
  });
}

function toggleLanguage() {
  language = language === "zh" ? "en" : "zh";
  localStorage.setItem(LANG_STORAGE_KEY, language);
  render();
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme();
  applyLanguageChrome();
}

function showOnboardingIfNeeded() {
  if (localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1") return;
  window.setTimeout(openOnboarding, 350);
}

function openOnboarding() {
  applyLanguageChrome();
  if (!els.onboardingDialog.open) {
    els.onboardingDialog.showModal();
  }
}

function toggleGuidePanel() {
  els.guidePanel.hidden = !els.guidePanel.hidden;
  els.guideToggleButton.textContent = els.guidePanel.hidden ? t("onboardingGuide") : t("onboardingGuideHide");
  renderGuidePanel();
}

function renderGuidePanel() {
  if (!els.guideTabs || !els.guideContent) return;
  const topics = t("guideTopics", []);
  if (!Array.isArray(topics) || !topics.length) return;
  if (!topics.some((topic) => topic.id === activeGuideTopic)) {
    activeGuideTopic = topics[0].id;
  }

  els.guideTabs.innerHTML = "";
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `guide-tab${topic.id === activeGuideTopic ? " is-active" : ""}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(topic.id === activeGuideTopic));
    button.textContent = topic.tab;
    button.addEventListener("click", () => {
      activeGuideTopic = topic.id;
      renderGuidePanel();
    });
    els.guideTabs.append(button);
  });

  const topic = topics.find((item) => item.id === activeGuideTopic) || topics[0];
  els.guideContent.innerHTML = `
    <h3>${escapeHtml(topic.title)}</h3>
    <p>${escapeHtml(topic.body)}</p>
    <div class="guide-tip">${escapeHtml(topic.tip)}</div>
  `;
}

function render() {
  hideTaskDetailPopover();
  applyTheme();
  applyLanguageChrome();
  updateSegments();
  updateFocusChips();
  renderTemplates();
  renderUnscheduled();
  renderLegend();
  renderPlanner();
  renderDetails();
  renderTodayList();
  renderStats();
}

function applyLanguageChrome() {
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = language === "en" ? "BlockPlan Task Block Scheduler" : "BlockPlan 任务块排程器";
  document.querySelector(".brand p").textContent = t("appSubtitle");
  document.querySelector(".toolbar").setAttribute("aria-label", t("toolbarLabel"));
  els.prevRange.title = t("previous");
  els.prevRange.setAttribute("aria-label", t("previous"));
  els.todayButton.title = t("today");
  els.todayButton.setAttribute("aria-label", t("today"));
  els.nextRange.title = t("next");
  els.nextRange.setAttribute("aria-label", t("next"));
  document.querySelector(".segmented").setAttribute("aria-label", t("viewSwitch"));
  els.languageToggleButton.textContent = t("languageToggle");
  els.languageToggleButton.title = t("languageTitle");
  els.languageToggleButton.setAttribute("aria-label", t("languageTitle"));
  els.themeToggleButton.textContent = theme === "dark" ? "◑" : "◐";
  els.themeToggleButton.title = theme === "dark" ? t("switchToLight") : t("switchToDark");
  els.themeToggleButton.setAttribute("aria-label", els.themeToggleButton.title);
  els.helpButton.title = t("helpTitle");
  els.helpButton.setAttribute("aria-label", t("helpTitle"));
  els.aiDraftButton.textContent = t("aiGenerate");
  els.addTemplateButton.textContent = t("addBlock");
  els.exportDataButton.textContent = t("export");
  els.importDataButton.textContent = t("import");
  els.resetDataButton.textContent = t("reset");

  setText(".library-panel .panel-head h2", t("library"));
  setText(".library-panel .panel-head p", t("librarySubtitle"));
  els.collapseLibrary.title = t("collapseLibrary");
  els.collapseLibrary.setAttribute("aria-label", t("collapseLibrary"));
  setText(".search-box span", t("search"));
  els.templateSearch.placeholder = t("searchPlaceholder");
  setText(".queue-panel .panel-head h2", t("queue"));
  setText(".queue-panel .panel-head p", t("queueSubtitle"));
  setText(".detail-panel .panel-head h2", t("detail"));
  setText(".stats-panel .panel-head h2", t("stats"));
  setText(".stats-panel .panel-head p", t("statsSubtitle"));

  setText("#templateDialog label:nth-of-type(1) span", t("name"));
  els.templateName.placeholder = t("namePlaceholder");
  setText("#templateDialog label:nth-of-type(2) span", t("className"));
  setText("#templateDialog label:nth-of-type(3) span", t("tags"));
  els.templateTags.placeholder = t("tagsPlaceholder");
  setText("#templateDialog label:nth-of-type(4) span", t("duration"));
  setText("#templateDialog label:nth-of-type(5) span", t("color"));
  setText("#templateDialog label:nth-of-type(6) span", t("mode"));
  setText("#templateDialog label:nth-of-type(7) span", t("note"));
  els.templateNote.placeholder = t("notePlaceholder");
  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    if (button.classList.contains("icon-button")) button.setAttribute("aria-label", t("close"));
  });
  document.querySelector("#templateDialog .dialog-actions .ghost-button").textContent = t("cancel");
  document.querySelector("#saveTemplateButton").textContent = t("save");
  translateTemplateClassOptions();
  translateModeOptions();

  setText("#aiDialog .dialog-head h2", t("aiDialogTitle"));
  setText("#aiDialog .stacked span", t("aiPromptLabel"));
  if (!els.aiPrompt.dataset.touched) els.aiPrompt.value = t("aiPromptExample");
  setText("#aiDialog .dialog-note", t("aiNote"));
  document.querySelector("#aiDialog .dialog-actions .ghost-button").textContent = t("cancel");
  document.querySelector("#runAiButton").textContent = t("generate");

  setText("#onboardingTitle", t("onboardingTitle"));
  setText("#onboardingSubtitle", t("onboardingSubtitle"));
  setText("#onboardingStep1Title", t("onboardingStep1Title"));
  setText("#onboardingStep1Body", t("onboardingStep1Body"));
  setText("#onboardingStep2Title", t("onboardingStep2Title"));
  setText("#onboardingStep2Body", t("onboardingStep2Body"));
  setText("#onboardingStep3Title", t("onboardingStep3Title"));
  setText("#onboardingStep3Body", t("onboardingStep3Body"));
  els.guideTabs.setAttribute("aria-label", t("guideTabsLabel"));
  els.guideToggleButton.textContent = els.guidePanel.hidden ? t("onboardingGuide") : t("onboardingGuideHide");
  els.onboardingDoneButton.textContent = t("onboardingDone");
  renderGuidePanel();
}

function renderTemplates() {
  const query = els.templateSearch.value.trim().toLowerCase();
  const templates = state.templates.filter((template) => {
    const byFocus = state.focus === "all" || template.className === state.focus;
    const haystack = [
      template.name,
      template.className,
      template.tags.join(" "),
      template.note,
    ]
      .join(" ")
      .toLowerCase();
    return byFocus && (!query || haystack.includes(query));
  });

  els.templateList.innerHTML = "";
  templates.forEach((template) => {
    const card = document.createElement("article");
    card.className = "task-card";
    card.draggable = true;
    card.style.setProperty("--task-color", template.color);
    card.dataset.templateId = template.id;
    card.innerHTML = `
      <div class="card-title">
        <span>${escapeHtml(template.name)}</span>
        <span>${formatDuration(template.duration)}</span>
      </div>
      <div class="card-meta">
        <span>${escapeHtml(displayClassName(template.className))}</span>
        <span>${modeLabel(template.mode)}</span>
      </div>
      <div class="card-tags">
        ${template.tags.map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
    `;
    card.addEventListener("dragstart", (event) => {
      dragTemplateId = template.id;
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", template.id);
    });
    card.addEventListener("dragend", () => {
      dragTemplateId = null;
    });
    card.addEventListener("dblclick", () => openTemplateDialog(template));
    els.templateList.append(card);
  });
}

function renderUnscheduled() {
  const scheduledTemplateIds = new Set(state.instances.map((instance) => instance.templateId));
  const unscheduled = state.templates.filter((template) => !scheduledTemplateIds.has(template.id));
  els.unscheduledList.innerHTML = "";

  if (!unscheduled.length) {
    els.unscheduledList.innerHTML = `<div class="empty-state">${t("emptyUnscheduled")}</div>`;
    return;
  }

  unscheduled.slice(0, 6).forEach((template) => {
    const card = document.createElement("button");
    card.className = "queue-card";
    card.type = "button";
    card.style.setProperty("--task-color", template.color);
    card.innerHTML = `
      <div class="card-title">
        <span>${escapeHtml(template.name)}</span>
        <span>${formatDuration(template.duration)}</span>
      </div>
      <div class="card-meta">${escapeHtml(displayClassName(template.className))} · ${escapeHtml(template.tags[0] || t("untagged"))}</div>
    `;
    card.addEventListener("click", () => quickSchedule(template.id));
    els.unscheduledList.append(card);
  });
}

function renderLegend() {
  const visibleClasses = getVisibleClasses();
  els.legend.innerHTML = visibleClasses
    .map(
      (className) => `
        <span class="legend-item">
          <i class="legend-dot" style="--legend-color:${classColors[className] || "#64748b"}"></i>
          ${escapeHtml(displayClassName(className))}
        </span>
      `,
    )
    .join("");
}

function renderPlanner() {
  if (state.view === "class") {
    renderClassPlanner();
    return;
  }
  renderTimePlanner();
}

function renderTimePlanner() {
  const days = getVisibleDays();
  const hours = Array.from({ length: DAY_HOUR_COUNT }, (_, index) => index + DAY_START_HOUR);
  const today = isoDate(new Date());
  const activeDate = getCurrentListDate();
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  grid.style.setProperty("--days", days.length);

  els.rangeTitle.textContent = state.view === "day" ? formatFullDate(days[0]) : `${formatMonthDay(days[0])} - ${formatMonthDay(days[days.length - 1])}`;
  els.rangeSubtitle.textContent = t("plannerSubtitle");

  const corner = createDiv("grid-corner", t("timeCorner"));
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  grid.append(corner);
  days.forEach((day, dayIndex) => {
    const header = createDiv("day-header", `<strong>${weekdayName(day)}</strong><span>${formatMonthDay(day)}</span>`);
    header.style.gridColumn = String(dayIndex + 2);
    header.style.gridRow = "1";
    if (day === today) header.classList.add("is-today-column");
    if (day === activeDate) header.classList.add("is-active-date");
    grid.append(header);
  });

  hours.forEach((hour, hourIndex) => {
    const label = createDiv("time-label", `${pad(hour)}:00`);
    label.style.gridColumn = "1";
    label.style.gridRow = String(hourIndex + 2);
    grid.append(label);
    days.forEach((day, dayIndex) => {
      const cell = createDiv("grid-cell", "");
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(hourIndex + 2);
      cell.dataset.date = day;
      cell.dataset.hour = String(hour);
      if (day === today) cell.classList.add("is-today-column");
      if (day === activeDate) cell.classList.add("is-active-date");
      bindDropTarget(cell, day, hour);
      grid.append(cell);
    });
  });

  els.plannerCanvas.replaceChildren(grid);

  getVisibleInstances(days).forEach((instance) => {
    const template = getTemplate(instance.templateId);
    if (!template) return;
    const dayIndex = days.indexOf(instance.date);
    const startHour = Math.floor(instance.start / 60);
    const hourIndex = hours.indexOf(startHour);
    if (dayIndex === -1 || hourIndex === -1) return;

    const block = document.createElement("button");
    block.className = "scheduled-block";
    block.type = "button";
    block.draggable = true;
    if (instance.id === state.selectedInstanceId) block.classList.add("is-selected");
    if (hasTimeConflict(instance)) {
      block.classList.add("has-conflict");
      block.title = t("conflictTitle");
    }
    block.style.setProperty("--task-color", template.color);
    block.style.setProperty("--duration-hours", String(instance.duration / 60));
    block.style.setProperty("--offset-hours", String((instance.start % 60) / 60));
    block.style.gridColumn = String(dayIndex + 2);
    block.style.gridRow = `${hourIndex + 2} / span ${Math.max(1, Math.ceil(((instance.start % 60) + instance.duration) / 60))}`;
    block.innerHTML = `
      <strong>${escapeHtml(template.name)}</strong>
      <span>${formatMinutes(instance.start)} - ${formatMinutes(instance.start + instance.duration)}</span>
      <em>${escapeHtml(displayClassName(template.className))} / ${escapeHtml(template.tags[0] || t("untagged"))}</em>
    `;
    block.addEventListener("click", (event) => {
      event.stopPropagation();
      selectInstance(instance.id, block.getBoundingClientRect());
    });
    block.addEventListener("dragstart", (event) => {
      dragInstanceId = instance.id;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/x-blockplan-instance", instance.id);
    });
    block.addEventListener("dragend", () => {
      dragInstanceId = null;
    });
    grid.append(block);
  });
}

function renderClassPlanner() {
  const days = getWeekDays(state.anchorDate);
  const classNames = getVisibleClasses();
  const activeDate = getCurrentListDate();
  const grid = document.createElement("div");
  grid.className = "class-grid";
  grid.style.setProperty("--classes", classNames.length);

  els.rangeTitle.textContent = t("classPlannerTitle");
  els.rangeSubtitle.textContent = t("classPlannerSubtitle");

  const corner = createDiv("grid-corner", t("dateCorner"));
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  grid.append(corner);
  classNames.forEach((className, classIndex) => {
    const header = createDiv("class-header", `<strong>${escapeHtml(displayClassName(className))}</strong><span>${formatDuration(countClassMinutes(className, days))}</span>`);
    header.style.gridColumn = String(classIndex + 2);
    header.style.gridRow = "1";
    grid.append(header);
  });

  days.forEach((day, dayIndex) => {
    const label = createDiv("date-label", `${weekdayName(day)}<br>${formatMonthDay(day)}`);
    label.style.gridColumn = "1";
    label.style.gridRow = String(dayIndex + 2);
    if (day === activeDate) label.classList.add("is-active-date");
    grid.append(label);
    classNames.forEach((className, classIndex) => {
      const cell = createDiv("class-cell", `<div class="class-bucket"></div>`);
      cell.style.gridColumn = String(classIndex + 2);
      cell.style.gridRow = String(dayIndex + 2);
      cell.dataset.date = day;
      cell.dataset.className = className;
      if (day === activeDate) cell.classList.add("is-active-date");
      bindClassDropTarget(cell, day, className);
      grid.append(cell);
    });
  });

  els.plannerCanvas.replaceChildren(grid);

  getVisibleInstances(days).forEach((instance) => {
    const template = getTemplate(instance.templateId);
    if (!template) return;
    const classCell = Array.from(grid.querySelectorAll(".class-cell")).find(
      (cell) => cell.dataset.date === instance.date && cell.dataset.className === template.className,
    );
    const cell = classCell?.querySelector(".class-bucket");
    if (!cell) return;
    const block = document.createElement("button");
    block.type = "button";
    block.className = "class-block";
    block.style.setProperty("--task-color", template.color);
    block.innerHTML = `<strong>${escapeHtml(template.name)}</strong><span>${formatMinutes(instance.start)} · ${formatDuration(instance.duration)}</span>`;
    block.addEventListener("click", () => selectInstance(instance.id, block.getBoundingClientRect()));
    cell.append(block);
  });
}

function renderDetails() {
  const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
  if (!instance) {
    els.detailHint.textContent = t("detailHint");
    els.detailContent.className = "detail-content empty-state";
    els.detailContent.innerHTML = `<p>${t("detailEmpty")}</p>`;
    return;
  }

  const template = getTemplate(instance.templateId);
  if (!template) {
    hideTaskDetailPopover();
    return;
  }

  els.detailHint.textContent = `${formatFullDate(instance.date)} · ${formatMinutes(instance.start)}`;
  els.detailContent.className = "detail-content";
  els.detailContent.innerHTML = taskDetailBodyHtml(instance, template);
  bindTaskDetailActions(els.detailContent, instance.id);
}

function showTaskDetailPopover(instanceId, anchorRect) {
  const instance = state.instances.find((item) => item.id === instanceId);
  const template = getTemplate(instance?.templateId);
  if (!instance || !template || !anchorRect) {
    hideTaskDetailPopover();
    return;
  }

  els.taskDetailPopover.hidden = false;
  els.taskDetailPopover.style.setProperty("--task-color", template.color);
  els.taskDetailPopover.innerHTML = `
    <div class="task-popover-head">
      <div>
        <span>${t("detailPopoverTitle")}</span>
        <h3>${escapeHtml(template.name)}</h3>
      </div>
      <button class="icon-button popover-close" type="button" data-close-popover aria-label="${t("close")}">×</button>
    </div>
    <div class="task-popover-time">${formatFullDate(instance.date)} · ${formatMinutes(instance.start)} - ${formatMinutes(instance.start + instance.duration)}</div>
    ${taskDetailBodyHtml(instance, template, { includeActions: false })}
  `;
  els.taskDetailPopover.querySelector("[data-close-popover]").addEventListener("click", hideTaskDetailPopover);
  positionTaskDetailPopover(anchorRect);
}

function hideTaskDetailPopover() {
  if (!els.taskDetailPopover) return;
  els.taskDetailPopover.hidden = true;
  els.taskDetailPopover.innerHTML = "";
}

function positionTaskDetailPopover(anchorRect) {
  const card = els.taskDetailPopover;
  const margin = 12;
  const gap = 10;
  const width = Math.min(340, window.innerWidth - margin * 2);
  card.style.width = `${width}px`;

  const cardRect = card.getBoundingClientRect();
  let left = anchorRect.right + gap;
  if (left + cardRect.width > window.innerWidth - margin) {
    left = anchorRect.left - cardRect.width - gap;
  }
  left = clamp(left, margin, window.innerWidth - cardRect.width - margin);

  let top = anchorRect.top;
  if (top + cardRect.height > window.innerHeight - margin) {
    top = anchorRect.bottom - cardRect.height;
  }
  top = clamp(top, margin, window.innerHeight - cardRect.height - margin);

  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}

function taskDetailBodyHtml(instance, template, options = {}) {
  const includeActions = options.includeActions !== false;
  return `
    <div class="detail-grid">
      <div class="detail-row">
        <span>${t("detailTask")}</span>
        <strong>${escapeHtml(template.name)}</strong>
      </div>
      <div class="detail-row">
        <span>${t("detailStatus")}</span>
        <p>${instance.status === "done" ? t("statusDone") : t("statusPlanned")}</p>
      </div>
      <div class="detail-row">
        <span>${t("detailCategory")}</span>
        <p>${formatTemplateCategory(template)}</p>
      </div>
      <div class="detail-row">
        <span>${t("detailTime")}</span>
        <p>${formatFullDate(instance.date)} ${formatMinutes(instance.start)} - ${formatMinutes(instance.start + instance.duration)}</p>
      </div>
      ${
        hasTimeConflict(instance)
          ? `<div class="detail-row conflict-row">
              <span>${t("detailConflict")}</span>
              <p>${t("conflictText")}</p>
            </div>`
          : ""
      }
      <div class="detail-row">
        <span>${t("detailNote")}</span>
        <p>${escapeHtml(template.note || t("noNote"))}</p>
      </div>
    </div>
    ${
      includeActions
        ? `<div class="detail-actions">
            <button type="button" data-action="toggle">${instance.status === "done" ? t("markUndone") : t("markDone")}</button>
            <button type="button" data-action="split">${t("split")}</button>
            <button type="button" data-action="earlier">${t("earlier")}</button>
            <button type="button" data-action="later">${t("later")}</button>
            <button type="button" data-action="shorter">${t("shorter")}</button>
            <button type="button" data-action="longer">${t("longer")}</button>
            <button type="button" data-action="postpone">${t("postpone")}</button>
            <button type="button" data-action="delete" class="danger">${t("delete")}</button>
          </div>`
        : ""
    }
  `;
}

function bindTaskDetailActions(container, instanceId) {
  container.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const actions = {
        toggle: () => toggleDone(instanceId),
        split: () => splitInstance(instanceId),
        earlier: () => shiftInstanceMinutes(instanceId, -15),
        later: () => shiftInstanceMinutes(instanceId, 15),
        shorter: () => resizeInstance(instanceId, -15),
        longer: () => resizeInstance(instanceId, 15),
        postpone: () => postponeInstance(instanceId),
        delete: () => deleteInstance(instanceId),
      };
      actions[button.dataset.action]?.();
    });
  });
}

function formatTemplateCategory(template) {
  const tags = template.tags.length ? template.tags.map(escapeHtml).join(" / ") : escapeHtml(t("untagged"));
  return `${escapeHtml(displayClassName(template.className))} / ${tags}`;
}

function renderTodayList() {
  const today = getCurrentListDate();
  const instances = state.instances
    .filter((instance) => instance.date === today)
    .sort((a, b) => a.start - b.start);

  els.currentListTitle.textContent = t("currentList");
  els.currentListSubtitle.textContent = `${formatFullDate(today)} · ${t("currentListSubtitle")}`;
  els.todayList.innerHTML = "";
  if (!instances.length) {
    els.todayList.innerHTML = `<div class="empty-state">${t("emptyCurrentDate")}</div>`;
    return;
  }

  instances.forEach((instance) => {
    const template = getTemplate(instance.templateId);
    if (!template) return;
    const item = document.createElement("button");
    item.className = `today-item ${instance.status === "done" ? "done" : ""}`;
    item.type = "button";
    item.style.setProperty("--task-color", template.color);
    if (hasTimeConflict(instance)) item.classList.add("has-conflict");
    item.innerHTML = `<strong>${escapeHtml(template.name)}</strong><span>${formatMinutes(instance.start)} · ${escapeHtml(displayClassName(template.className))} · ${escapeHtml(template.tags[0] || t("untagged"))}</span>`;
    item.addEventListener("click", () => selectInstance(instance.id, item.getBoundingClientRect()));
    els.todayList.append(item);
  });
}

function renderStats() {
  const days = state.view === "day" ? getVisibleDays() : getWeekDays(state.anchorDate);
  const visible = getVisibleInstances(days);
  const totals = {};
  visible.forEach((instance) => {
    const template = getTemplate(instance.templateId);
    if (!template) return;
    totals[template.className] = (totals[template.className] || 0) + instance.duration;
  });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((entry) => entry[1]), 1);

  els.statsList.innerHTML = "";
  if (!entries.length) {
    els.statsList.innerHTML = `<div class="empty-state">${t("emptyStats")}</div>`;
    return;
  }

  entries.forEach(([className, minutes]) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <div class="stat-label">
        <span>${escapeHtml(displayClassName(className))}</span>
        <strong>${formatDuration(minutes)}</strong>
      </div>
      <div class="stat-bar">
        <i style="--value:${Math.round((minutes / max) * 100)}%; --stat-color:${classColors[className] || "#64748b"}"></i>
      </div>
    `;
    els.statsList.append(row);
  });
}

function bindDropTarget(cell, date, hour) {
  cell.addEventListener("dragover", (event) => {
    if (!dragTemplateId && !dragInstanceId) return;
    event.preventDefault();
    cell.classList.add("is-drop-target");
  });
  cell.addEventListener("dragleave", () => cell.classList.remove("is-drop-target"));
  cell.addEventListener("drop", (event) => {
    event.preventDefault();
    cell.classList.remove("is-drop-target");
    const instanceId = event.dataTransfer.getData("application/x-blockplan-instance") || dragInstanceId;
    if (instanceId) {
      moveInstance(instanceId, date, hour * 60);
      return;
    }
    const templateId = event.dataTransfer.getData("text/plain") || dragTemplateId;
    createInstance(templateId, date, hour * 60);
  });
}

function bindClassDropTarget(cell, date, className) {
  cell.addEventListener("dragover", (event) => {
    const movingInstance = state.instances.find((instance) => instance.id === dragInstanceId);
    const templateId = dragTemplateId || movingInstance?.templateId;
    if (!templateId) return;
    const template = getTemplate(templateId);
    if (!template || template.className !== className) return;
    event.preventDefault();
    cell.classList.add("is-drop-target");
  });
  cell.addEventListener("dragleave", () => cell.classList.remove("is-drop-target"));
  cell.addEventListener("drop", (event) => {
    event.preventDefault();
    cell.classList.remove("is-drop-target");
    const instanceId = event.dataTransfer.getData("application/x-blockplan-instance") || dragInstanceId;
    if (instanceId) {
      const instance = state.instances.find((item) => item.id === instanceId);
      const template = getTemplate(instance?.templateId);
      if (!template || template.className !== className) return;
      moveInstance(instanceId, date, 9 * 60);
      return;
    }
    const templateId = event.dataTransfer.getData("text/plain") || dragTemplateId;
    const template = getTemplate(templateId);
    if (!template || template.className !== className) return;
    createInstance(templateId, date, 9 * 60);
  });
}

function createInstance(templateId, date, start) {
  const template = getTemplate(templateId);
  if (!template) return;
  const duration = normalizeDuration(template.mode === "point" ? 15 : template.mode === "day" ? 8 * 60 : template.duration, 60);
  const instance = {
    id: uid(),
    templateId,
    date,
    start: clampStartForDuration(start, duration),
    duration,
    status: "planned",
    actualDuration: null,
  };
  state.instances.push(instance);
  state.selectedInstanceId = instance.id;
  saveState();
  render();
}

function quickSchedule(templateId) {
  const day = state.anchorDate;
  const latest = state.instances
    .filter((instance) => instance.date === day)
    .sort((a, b) => b.start - a.start)[0];
  const start = latest ? Math.min(latest.start + latest.duration + 15, 21 * 60) : 9 * 60;
  createInstance(templateId, day, start);
}

function moveInstance(instanceId, date, start) {
  const instance = state.instances.find((item) => item.id === instanceId);
  if (!instance) return;
  instance.date = date;
  instance.start = clampStartForDuration(start, instance.duration);
  state.selectedInstanceId = instance.id;
  saveState();
  render();
}

function selectInstance(id, anchorRect = null) {
  state.selectedInstanceId = id;
  saveState();
  renderPlanner();
  renderDetails();
  renderTodayList();
  renderStats();
  if (anchorRect) {
    showTaskDetailPopover(id, anchorRect);
  } else {
    hideTaskDetailPopover();
  }
}

function toggleDone(id) {
  const instance = state.instances.find((item) => item.id === id);
  if (!instance) return;
  instance.status = instance.status === "done" ? "planned" : "done";
  saveState();
  render();
}

function splitInstance(id) {
  const instance = state.instances.find((item) => item.id === id);
  if (!instance || instance.duration < 30) return;
  const half = Math.floor(instance.duration / 2 / 15) * 15;
  const second = {
    ...instance,
    id: uid(),
    start: instance.start + half,
    duration: instance.duration - half,
    status: "planned",
  };
  instance.duration = half;
  state.instances.push(second);
  state.selectedInstanceId = second.id;
  saveState();
  render();
}

function shiftInstanceMinutes(id, amount) {
  const instance = state.instances.find((item) => item.id === id);
  if (!instance) return;
  instance.start = clampStartForDuration(instance.start + amount, instance.duration);
  saveState();
  render();
}

function resizeInstance(id, amount) {
  const instance = state.instances.find((item) => item.id === id);
  if (!instance) return;
  const maxDuration = Math.min(8 * 60, MINUTES_PER_DAY - instance.start);
  instance.duration = clamp(instance.duration + amount, 15, Math.max(15, maxDuration));
  saveState();
  render();
}

function postponeInstance(id) {
  const instance = state.instances.find((item) => item.id === id);
  if (!instance) return;
  instance.date = shiftDate(instance.date, 1);
  saveState();
  render();
}

function deleteInstance(id) {
  state.instances = state.instances.filter((item) => item.id !== id);
  if (state.selectedInstanceId === id) state.selectedInstanceId = null;
  saveState();
  render();
}

function exportData() {
  const payload = {
    app: "BlockPlan",
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `blockplan-${isoDate(new Date())}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importDataFromFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const nextState = normalizeImportedState(parsed);
    if (!nextState) {
      alert(t("importInvalid"));
      return;
    }
    state = nextState;
    saveState();
    render();
    alert(t("importDone"));
  } catch {
    alert(t("importParseError"));
  }
}

function resetData() {
  if (!confirm(t("resetConfirm"))) return;
  state = structuredClone(defaultState);
  state.anchorDate = isoDate(new Date());
  seedInstances();
  saveState();
  render();
}

function openTemplateDialog(template = null) {
  els.templateDialog.dataset.editingId = template?.id || "";
  document.querySelector("#dialogTitle").textContent = template ? t("dialogEdit") : t("dialogNew");
  els.templateName.value = template?.name || "";
  els.templateClass.value = template?.className || "考研";
  els.templateTags.value = template?.tags.join(", ") || "";
  els.templateDuration.value = template?.duration || 90;
  els.templateColor.value = template?.color || classColors[els.templateClass.value] || "#4f7cff";
  els.templateMode.value = template?.mode || "slot";
  els.templateNote.value = template?.note || "";
  els.templateDialog.showModal();
}

function saveTemplateFromDialog() {
  const editingId = els.templateDialog.dataset.editingId;
  const payload = {
    name: els.templateName.value.trim(),
    className: els.templateClass.value,
    tags: parseTags(els.templateTags.value),
    duration: normalizeDuration(els.templateDuration.value, 90),
    color: els.templateColor.value,
    mode: normalizeMode(els.templateMode.value),
    note: els.templateNote.value.trim(),
  };
  if (!payload.name) return;

  if (editingId) {
    const index = state.templates.findIndex((template) => template.id === editingId);
    if (index !== -1) state.templates[index] = { ...state.templates[index], ...payload };
  } else {
    state.templates.unshift({ id: uid(), ...payload });
  }

  saveState();
  els.templateDialog.close();
  render();
}

function createAiDrafts() {
  const prompt = els.aiPrompt.value.trim();
  if (!prompt) return;
  const drafts = parseAiPrompt(prompt);
  drafts.forEach((draft) => {
    const duration = normalizeDuration(draft.duration, 60);
    const template = {
      id: uid(),
      name: draft.name,
      className: draft.className,
      tags: draft.tags,
      duration,
      color: draft.color,
      mode: "slot",
      note: `${t("generatedFrom")}: ${prompt}`,
    };
    state.templates.unshift(template);
    if (draft.date && draft.start !== null) {
      state.instances.push({
        id: uid(),
        templateId: template.id,
        date: draft.date,
        start: clampStartForDuration(draft.start, duration),
        duration: template.duration,
        status: "planned",
        actualDuration: null,
      });
    }
  });
  saveState();
  els.aiDialog.close();
  render();
}

function parseAiPrompt(prompt) {
  const baseDate = /明天|tomorrow/i.test(prompt) ? shiftDate(state.anchorDate, 1) : state.anchorDate;
  const chunks = prompt
    .split(/[，。,；;.]/)
    .map((part) => part.trim())
    .filter(Boolean);

  const drafts = chunks.map((chunk, index) => {
    const durationMatch = chunk.match(/(\d+)\s*(分钟|分|mins?|minutes?|m|小时|hours?|hrs?|h)/i);
    let duration = 60;
    if (durationMatch) {
      duration = Number(durationMatch[1]) * (/小时|hours?|hrs?|h/i.test(durationMatch[2]) ? 60 : 1);
    }

    const bucket = inferBucket(chunk);
    const start = inferStart(chunk, index);
    return {
      name: bucket.name,
      className: bucket.className,
      tags: bucket.tags,
      duration,
      color: bucket.color,
      date: baseDate,
      start,
    };
  });

  return drafts.length ? drafts : [fallbackDraft(prompt)];
}

function inferBucket(text) {
  if (/高数|数学|线代|概率|math|calculus|linear algebra|probability/i.test(text)) {
    return { name: t("aiNames.math"), className: "考研", tags: t("aiTags.math"), color: "#4f7cff" };
  }
  if (/英语|阅读|单词|english|reading|vocabulary|words?/i.test(text)) {
    return { name: t("aiNames.english"), className: "考研", tags: t("aiTags.english"), color: "#22a06b" };
  }
  if (/政治|肖|选择题|politics|political|multiple choice/i.test(text)) {
    return { name: t("aiNames.politics"), className: "考研", tags: t("aiTags.politics"), color: "#d94867" };
  }
  if (/吃饭|午饭|晚饭|早餐|meal|lunch|dinner|breakfast/i.test(text)) {
    return { name: t("aiNames.meal"), className: "生活", tags: t("aiTags.meal"), color: "#0f9f6e" };
  }
  if (/运动|跑步|健身|exercise|run|running|workout|fitness/i.test(text)) {
    return { name: t("aiNames.exercise"), className: "生活", tags: t("aiTags.exercise"), color: "#14b8a6" };
  }
  if (/项目|比赛|论文|资料|project|paper|thesis|資料|materials?/i.test(text)) {
    return { name: t("aiNames.project"), className: "项目", tags: t("aiTags.project"), color: "#d65f32" };
  }
  if (/复盘|总结|整理|review|summary|summarize|organize|reflection/i.test(text)) {
    return { name: t("aiNames.review"), className: "杂事", tags: t("aiTags.review"), color: "#7c3aed" };
  }
  return { name: text.slice(0, 18) || t("aiNames.fallback"), className: "杂事", tags: t("aiTags.fallback"), color: "#7c3aed" };
}

function inferStart(text, index) {
  if (/上午|早上|morning|am/i.test(text)) return 9 * 60 + index * 15;
  if (/中午|午饭|noon|lunch/i.test(text)) return 12 * 60;
  if (/下午|afternoon|pm/i.test(text)) return 14 * 60 + index * 15;
  if (/晚上|晚间|evening|night/i.test(text)) return 20 * 60;
  return 9 * 60 + index * 90;
}

function fallbackDraft(prompt) {
  return {
    name: prompt.slice(0, 18),
    className: "杂事",
    tags: t("aiTags.fallback"),
    duration: 60,
    color: "#7c3aed",
    date: state.anchorDate,
    start: 9 * 60,
  };
}

function seedInstances() {
  if (state.instances.length) return;
  const today = state.anchorDate;
  const byName = (name) => state.templates.find((template) => template.name === name)?.id;
  [
    ["高数第三章复习", 9 * 60],
    ["午饭", 12 * 60],
    ["英语阅读精练", 14 * 60],
    ["晚间复盘", 20 * 60],
    ["项目资料整理", 10 * 60, shiftDate(today, 1)],
    ["政治选择题", 16 * 60, shiftDate(today, 2)],
  ].forEach(([name, start, date = today]) => {
    const templateId = byName(name);
    const template = getTemplate(templateId);
    if (!template) return;
    state.instances.push({
      id: uid(),
      templateId,
      date,
      start,
      duration: template.duration,
      status: name === "午饭" ? "done" : "planned",
      actualDuration: null,
    });
  });
  saveState();
}

function updateSegments() {
  document.querySelectorAll(".segment").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.textContent = t(`views.${button.dataset.view}`);
  });
}

function updateFocusChips() {
  document.querySelectorAll(".chip").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.focus === state.focus);
    button.textContent = t(`focus.${button.dataset.focus}`, displayClassName(button.dataset.focus));
  });
}

function shiftRange(direction) {
  const delta = state.view === "day" ? direction : direction * 7;
  state.anchorDate = shiftDate(state.anchorDate, delta);
  saveState();
  render();
}

function getVisibleDays() {
  return state.view === "day" ? [state.anchorDate] : getWeekDays(state.anchorDate);
}

function getCurrentListDate() {
  const selected = state.instances.find((instance) => instance.id === state.selectedInstanceId);
  return selected?.date || state.anchorDate;
}

function getWeekDays(anchorDate) {
  const date = parseIso(anchorDate);
  const day = date.getDay() || 7;
  const monday = addDays(date, 1 - day);
  return Array.from({ length: 7 }, (_, index) => isoDate(addDays(monday, index)));
}

function getVisibleInstances(days) {
  return state.instances.filter((instance) => {
    const template = getTemplate(instance.templateId);
    const byFocus = state.focus === "all" || template?.className === state.focus;
    return days.includes(instance.date) && byFocus;
  });
}

function getVisibleClasses() {
  const classNames = new Set(state.templates.map((template) => template.className));
  const result = Array.from(classNames).filter((className) => state.focus === "all" || className === state.focus);
  return result.length ? result : [t("unclassified")];
}

function countClassMinutes(className, days) {
  return state.instances.reduce((sum, instance) => {
    const template = getTemplate(instance.templateId);
    if (!template || template.className !== className || !days.includes(instance.date)) return sum;
    return sum + instance.duration;
  }, 0);
}

function getTemplate(id) {
  return state.templates.find((template) => template.id === id);
}

function modeLabel(mode) {
  return t(`modes.${mode}`, t("modes.slot"));
}

function parseTags(value) {
  return value
    .split(/[,，、\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeImportedState(input) {
  const candidate = input?.state && typeof input.state === "object" ? input.state : input;
  if (!candidate || typeof candidate !== "object") return null;

  const base = structuredClone(defaultState);
  const seenTemplateIds = new Set();
  const templates = (Array.isArray(candidate.templates) ? candidate.templates : [])
    .map((template) => normalizeTemplate(template, seenTemplateIds))
    .filter(Boolean);
  const finalTemplates = templates.length ? templates : base.templates;
  const templateMap = new Map(finalTemplates.map((template) => [template.id, template]));
  const seenInstanceIds = new Set();
  const instances = (Array.isArray(candidate.instances) ? candidate.instances : [])
    .map((instance) => normalizeInstance(instance, templateMap, seenInstanceIds))
    .filter(Boolean);

  return {
    view: ["week", "day", "class"].includes(candidate.view) ? candidate.view : base.view,
    focus: typeof candidate.focus === "string" ? candidate.focus : base.focus,
    anchorDate: isIsoDate(candidate.anchorDate) ? candidate.anchorDate : isoDate(new Date()),
    selectedInstanceId: instances.some((instance) => instance.id === candidate.selectedInstanceId)
      ? candidate.selectedInstanceId
      : null,
    templates: finalTemplates,
    instances,
  };
}

function normalizeTemplate(template, seenIds) {
  if (!template || typeof template !== "object") return null;
  const className = cleanText(template.className, 24, "杂事");
  let id = cleanText(template.id, 80, "");
  if (!id || seenIds.has(id)) id = uid();
  seenIds.add(id);

  const rawTags = Array.isArray(template.tags) ? template.tags : parseTags(String(template.tags || ""));
  const tags = rawTags
    .map((tag) => cleanText(tag, 20, ""))
    .filter(Boolean)
    .slice(0, 8);

  return {
    id,
    name: cleanText(template.name, 40, "新任务"),
    className,
    tags,
    duration: normalizeDuration(template.duration, 90),
    color: isHexColor(template.color) ? template.color : classColors[className] || "#7c3aed",
    mode: normalizeMode(template.mode),
    note: cleanText(template.note, 400, ""),
  };
}

function normalizeInstance(instance, templateMap, seenIds) {
  if (!instance || typeof instance !== "object") return null;
  const templateId = cleanText(instance.templateId, 80, "");
  const template = templateMap.get(templateId);
  if (!template) return null;

  let id = cleanText(instance.id, 80, "");
  if (!id || seenIds.has(id)) id = uid();
  seenIds.add(id);

  const duration = normalizeDuration(instance.duration, template.duration);
  return {
    id,
    templateId,
    date: isIsoDate(instance.date) ? instance.date : isoDate(new Date()),
    start: clampStartForDuration(instance.start, duration),
    duration,
    status: instance.status === "done" ? "done" : "planned",
    actualDuration: instance.actualDuration == null ? null : normalizeDuration(instance.actualDuration, duration),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return normalizeImportedState(parsed) || structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", theme === "dark" ? "#0f172a" : "#2563eb");
}

function loadLanguage() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : DEFAULT_LANG;
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function t(key, fallback = key) {
  return key.split(".").reduce((value, part) => value?.[part], i18n[language]) ?? fallback;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function translateTemplateClassOptions() {
  Array.from(els.templateClass.options).forEach((option) => {
    option.textContent = displayClassName(option.value);
  });
}

function translateModeOptions() {
  Array.from(els.templateMode.options).forEach((option) => {
    option.textContent = modeLabel(option.value);
  });
}

function displayClassName(className) {
  return t(`classes.${className}`, className);
}

function formatDuration(minutes) {
  return language === "en" ? `${minutes} min` : `${minutes} 分钟`;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function createDiv(className, html) {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = html;
  return div;
}

function isEditingContext(target) {
  if (document.querySelector("dialog[open]")) return true;
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function hasTimeConflict(instance) {
  return state.instances.some(
    (other) => other.id !== instance.id && other.date === instance.date && rangesOverlap(instance, other),
  );
}

function rangesOverlap(a, b) {
  return a.start < b.start + b.duration && b.start < a.start + a.duration;
}

function normalizeDuration(value, fallback) {
  const number = Number(value);
  const safe = Number.isFinite(number) ? number : fallback;
  return clamp(Math.round(safe / 15) * 15, 15, MINUTES_PER_DAY);
}

function clampStartForDuration(value, duration) {
  const number = Number(value);
  const safe = Number.isFinite(number) ? number : 0;
  const maxStart = Math.max(0, MINUTES_PER_DAY - normalizeDuration(duration, 60));
  return clamp(Math.round(safe / 15) * 15, 0, maxStart);
}

function normalizeMode(mode) {
  return ["slot", "point", "day", "week"].includes(mode) ? mode : "slot";
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  const date = parseIso(value);
  return isoDate(date) === value;
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value));
}

function cleanText(value, maxLength, fallback = "") {
  const text = value == null ? "" : String(value);
  return (text.trim() || fallback).slice(0, maxLength);
}

function parseIso(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function shiftDate(value, amount) {
  return isoDate(addDays(parseIso(value), amount));
}

function weekdayName(value) {
  return t("weekdays")[parseIso(value).getDay()];
}

function formatMonthDay(value) {
  const date = parseIso(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatFullDate(value) {
  const date = parseIso(value);
  if (language === "en") {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatMinutes(minutes) {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
