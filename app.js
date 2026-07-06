const STORAGE_KEY = "blockplan-prototype-v1";
const EXPORT_VERSION = 1;
const MINUTES_PER_DAY = 24 * 60;
const DAY_START_HOUR = 0;
const DAY_HOUR_COUNT = 24;

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
let dragTemplateId = null;
let dragInstanceId = null;

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  seedInstances();
  bindEvents();
  render();
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

  document.addEventListener("keydown", (event) => {
    if (isEditingContext(event.target)) return;
    if (event.key === "Delete" && state.selectedInstanceId) {
      deleteInstance(state.selectedInstanceId);
    }
  });
}

function render() {
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
        <span>${template.duration}m</span>
      </div>
      <div class="card-meta">
        <span>${escapeHtml(template.className)}</span>
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
    els.unscheduledList.innerHTML = `<div class="empty-state">所有任务块都至少安排过一次。</div>`;
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
        <span>${template.duration}m</span>
      </div>
      <div class="card-meta">${escapeHtml(template.className)} · ${escapeHtml(template.tags[0] || "未标记")}</div>
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
          ${escapeHtml(className)}
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
  els.rangeSubtitle.textContent = "横轴日期，纵轴时间。拖动任务块到格子里。";

  const corner = createDiv("grid-corner", "Time");
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
      block.title = "这个时间段和同一天的其他任务重叠";
    }
    block.style.setProperty("--task-color", template.color);
    block.style.setProperty("--duration-hours", String(instance.duration / 60));
    block.style.setProperty("--offset-hours", String((instance.start % 60) / 60));
    block.style.gridColumn = String(dayIndex + 2);
    block.style.gridRow = `${hourIndex + 2} / span ${Math.max(1, Math.ceil(((instance.start % 60) + instance.duration) / 60))}`;
    block.innerHTML = `
      <strong>${escapeHtml(template.name)}</strong>
      <span>${formatMinutes(instance.start)} - ${formatMinutes(instance.start + instance.duration)}</span>
      <em>${escapeHtml(template.className)} / ${escapeHtml(template.tags[0] || "未标记")}</em>
    `;
    block.addEventListener("click", (event) => {
      event.stopPropagation();
      selectInstance(instance.id);
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

  els.rangeTitle.textContent = "分类排程";
  els.rangeSubtitle.textContent = "横轴 class/tag，纵轴日期。适合检查大类之间的占比。";

  const corner = createDiv("grid-corner", "Date");
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  grid.append(corner);
  classNames.forEach((className, classIndex) => {
    const header = createDiv("class-header", `<strong>${escapeHtml(className)}</strong><span>${countClassMinutes(className, days)} 分钟</span>`);
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
    block.innerHTML = `<strong>${escapeHtml(template.name)}</strong><span>${formatMinutes(instance.start)} · ${instance.duration} 分钟</span>`;
    block.addEventListener("click", () => selectInstance(instance.id));
    cell.append(block);
  });
}

function renderDetails() {
  const instance = state.instances.find((item) => item.id === state.selectedInstanceId);
  if (!instance) {
    els.detailHint.textContent = "选择一个任务块";
    els.detailContent.className = "detail-content empty-state";
    els.detailContent.innerHTML = "<p>点击日历里的任务，或从左侧拖入一个任务块。</p>";
    return;
  }

  const template = getTemplate(instance.templateId);
  if (!template) return;

  els.detailHint.textContent = `${formatFullDate(instance.date)} · ${formatMinutes(instance.start)}`;
  els.detailContent.className = "detail-content";
  els.detailContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-row">
        <span>任务</span>
        <strong>${escapeHtml(template.name)}</strong>
      </div>
      <div class="detail-row">
        <span>分类</span>
        <p>${escapeHtml(template.className)} / ${template.tags.map(escapeHtml).join(" / ")}</p>
      </div>
      <div class="detail-row">
        <span>时间</span>
        <p>${formatFullDate(instance.date)} ${formatMinutes(instance.start)} - ${formatMinutes(instance.start + instance.duration)}</p>
      </div>
      ${
        hasTimeConflict(instance)
          ? `<div class="detail-row conflict-row">
              <span>冲突</span>
              <p>这个时间段和同一天的其他任务重叠。</p>
            </div>`
          : ""
      }
      <div class="detail-row">
        <span>备注</span>
        <p>${escapeHtml(template.note || "暂无备注")}</p>
      </div>
    </div>
    <div class="detail-actions">
      <button type="button" data-action="toggle">${instance.status === "done" ? "标为未完成" : "标为完成"}</button>
      <button type="button" data-action="split">拆成两块</button>
      <button type="button" data-action="earlier">提前15分</button>
      <button type="button" data-action="later">延后15分</button>
      <button type="button" data-action="shorter">缩短15分</button>
      <button type="button" data-action="longer">延长15分</button>
      <button type="button" data-action="postpone">推迟一天</button>
      <button type="button" data-action="delete" class="danger">删除</button>
    </div>
  `;

  els.detailContent.querySelector("[data-action='toggle']").addEventListener("click", () => toggleDone(instance.id));
  els.detailContent.querySelector("[data-action='split']").addEventListener("click", () => splitInstance(instance.id));
  els.detailContent.querySelector("[data-action='earlier']").addEventListener("click", () => shiftInstanceMinutes(instance.id, -15));
  els.detailContent.querySelector("[data-action='later']").addEventListener("click", () => shiftInstanceMinutes(instance.id, 15));
  els.detailContent.querySelector("[data-action='shorter']").addEventListener("click", () => resizeInstance(instance.id, -15));
  els.detailContent.querySelector("[data-action='longer']").addEventListener("click", () => resizeInstance(instance.id, 15));
  els.detailContent.querySelector("[data-action='postpone']").addEventListener("click", () => postponeInstance(instance.id));
  els.detailContent.querySelector("[data-action='delete']").addEventListener("click", () => deleteInstance(instance.id));
}

function renderTodayList() {
  const today = getCurrentListDate();
  const instances = state.instances
    .filter((instance) => instance.date === today)
    .sort((a, b) => a.start - b.start);

  els.currentListTitle.textContent = "当前日清单";
  els.currentListSubtitle.textContent = `${formatFullDate(today)} · 由排程自动生成`;
  els.todayList.innerHTML = "";
  if (!instances.length) {
    els.todayList.innerHTML = `<div class="empty-state">当前日期还没有安排。</div>`;
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
    item.innerHTML = `<strong>${escapeHtml(template.name)}</strong><span>${formatMinutes(instance.start)} · ${escapeHtml(template.className)} · ${escapeHtml(template.tags[0] || "未标记")}</span>`;
    item.addEventListener("click", () => selectInstance(instance.id));
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
    els.statsList.innerHTML = `<div class="empty-state">拖入任务后会生成统计。</div>`;
    return;
  }

  entries.forEach(([className, minutes]) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <div class="stat-label">
        <span>${escapeHtml(className)}</span>
        <strong>${minutes}m</strong>
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

function selectInstance(id) {
  state.selectedInstanceId = id;
  saveState();
  renderPlanner();
  renderDetails();
  renderTodayList();
  renderStats();
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
      alert("导入失败：文件不是有效的 BlockPlan JSON。");
      return;
    }
    state = nextState;
    saveState();
    render();
    alert("导入完成。");
  } catch {
    alert("导入失败：JSON 文件无法解析。");
  }
}

function resetData() {
  if (!confirm("确定要清空当前数据并恢复默认示例吗？建议先导出备份。")) return;
  state = structuredClone(defaultState);
  state.anchorDate = isoDate(new Date());
  seedInstances();
  saveState();
  render();
}

function openTemplateDialog(template = null) {
  els.templateDialog.dataset.editingId = template?.id || "";
  document.querySelector("#dialogTitle").textContent = template ? "编辑任务块" : "新建任务块";
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
      note: `由描述生成：${prompt}`,
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
  const baseDate = prompt.includes("明天") ? shiftDate(state.anchorDate, 1) : state.anchorDate;
  const chunks = prompt
    .split(/[，。,；;]/)
    .map((part) => part.trim())
    .filter(Boolean);

  const drafts = chunks.map((chunk, index) => {
    const durationMatch = chunk.match(/(\d+)\s*(分钟|分|m|小时|h)/i);
    let duration = 60;
    if (durationMatch) {
      duration = Number(durationMatch[1]) * (/小时|h/i.test(durationMatch[2]) ? 60 : 1);
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
  if (/高数|数学|线代|概率/.test(text)) {
    return { name: "数学复习", className: "考研", tags: ["数学"], color: "#4f7cff" };
  }
  if (/英语|阅读|单词/.test(text)) {
    return { name: "英语训练", className: "考研", tags: ["英语"], color: "#22a06b" };
  }
  if (/政治|肖|选择题/.test(text)) {
    return { name: "政治刷题", className: "考研", tags: ["政治"], color: "#d94867" };
  }
  if (/吃饭|午饭|晚饭|早餐/.test(text)) {
    return { name: "吃饭", className: "生活", tags: ["吃饭"], color: "#0f9f6e" };
  }
  if (/运动|跑步|健身/.test(text)) {
    return { name: "运动", className: "生活", tags: ["运动"], color: "#14b8a6" };
  }
  if (/项目|比赛|论文|资料/.test(text)) {
    return { name: "项目推进", className: "项目", tags: ["项目"], color: "#d65f32" };
  }
  if (/复盘|总结|整理/.test(text)) {
    return { name: "晚间复盘", className: "杂事", tags: ["复盘"], color: "#7c3aed" };
  }
  return { name: text.slice(0, 14) || "新任务", className: "杂事", tags: ["AI"], color: "#7c3aed" };
}

function inferStart(text, index) {
  if (/上午|早上/.test(text)) return 9 * 60 + index * 15;
  if (/中午|午饭/.test(text)) return 12 * 60;
  if (/下午/.test(text)) return 14 * 60 + index * 15;
  if (/晚上|晚间/.test(text)) return 20 * 60;
  return 9 * 60 + index * 90;
}

function fallbackDraft(prompt) {
  return {
    name: prompt.slice(0, 18),
    className: "杂事",
    tags: ["AI"],
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
  });
}

function updateFocusChips() {
  document.querySelectorAll(".chip").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.focus === state.focus);
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
  return result.length ? result : ["未分类"];
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
  return {
    slot: "时间段",
    point: "时间点",
    day: "整天",
    week: "跨周",
  }[mode] || "时间段";
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
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][parseIso(value).getDay()];
}

function formatMonthDay(value) {
  const date = parseIso(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatFullDate(value) {
  const date = parseIso(value);
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
