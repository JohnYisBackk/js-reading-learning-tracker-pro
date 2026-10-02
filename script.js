"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

// Header
const searchInput = document.getElementById("searchInput");
const navLinks = document.querySelectorAll(".nav-link");
const toggleBtn = document.getElementById("toggleBtn");

// Navigation
const statsSection = document.querySelector(".stats-section");
const learningItemsSection = document.querySelector(".learning-items-section");
const footer = document.querySelector(".footer");

// Add Learning Item
const learningForm = document.getElementById("learningForm");
const titleInput = document.getElementById("titleInput");

const typeSelect = document.getElementById("typeSelect");
const typeIcon = document.getElementById("typeIcon");

const categorySelect = document.getElementById("categorySelect");
const categoryIcon = document.getElementById("categoryIcon");

const prioritySelect = document.getElementById("prioritySelect");
const priorityIcon = document.getElementById("priorityIcon");

const statusSelect = document.getElementById("statusSelect");
const statusIcon = document.getElementById("statusIcon");

const progressInput = document.getElementById("progressInput");
const hoursInput = document.getElementById("hoursInput");
const notesInput = document.getElementById("notesInput");

const addItemBtn = document.getElementById("addItemBtn");

// Stats
const totalItemsValue = document.getElementById("totalItemsValue");
const completedItemsValue = document.getElementById("completedItemsValue");
const completedRateValue = document.getElementById("completedRateValue");
const learningHoursValue = document.getElementById("learningHoursValue");
const averageProgressValue = document.getElementById("averageProgressValue");

// Learning Controls
const librarySearchInput = document.getElementById("librarySearchInput");
const librarySortSelect = document.getElementById("librarySortSelect");
const typeFilters = document.querySelectorAll(".type-filter");

// Learning Items List
const learningItemsList = document.getElementById("learningItemsList");

// ======================================================
// STATE
// ======================================================

let items = [];

let activeTypeFilter = "all";
let activeSortFilter = "newest";

let editingId = null;

let currentTheme = "dark";

// ======================================================
// SAVE / LOAD DATA
// ======================================================

function saveData() {
  localStorage.setItem("readingLearningTracker", JSON.stringify(items));
}

function loadData() {
  try {
    const storedData = localStorage.getItem("readingLearningTracker");

    if (!storedData) return;

    items = JSON.parse(storedData);
  } catch (error) {
    console.error(error);
  }
}

// ======================================================
// THEME
// ======================================================

function loadTheme() {
  try {
    const storedTheme = localStorage.getItem("readingLearningTrackerTheme");

    if (storedTheme) {
      currentTheme = storedTheme;
    }
  } catch (error) {
    console.error(error);
  }

  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem("readingLearningTrackerTheme", currentTheme);

  applyTheme();
}

// ======================================================
// NAVIGATION
// ======================================================

function navigateToSection(selectedPage) {
  switch (selectedPage) {
    case "dashboard":
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      break;

    case "library":
      learningItemsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      break;

    case "progress":
      statsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      break;

    case "about":
      footer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      break;
  }
}

// ======================================================
// UPDATE SELECT ICONS
// ======================================================

const typeIcons = {
  book: "bi-book-fill",
  course: "bi-play-fill",
  article: "bi-file-earmark-text-fill",
  video: "bi-camera-video-fill",
};

function updateTypeIcon() {
  const selectedType = typeSelect.value;

  const selectedIcon = typeIcons[selectedType] || "bi-play-fill";

  typeIcon.className = `bi ${selectedIcon} select-icon`;
}

const categoryIcons = {
  programming: "bi-code-slash",
  development: "bi-braces",
  "web-design": "bi-palette-fill",
  javascript: "bi-filetype-js",
  career: "bi-briefcase-fill",
  other: "bi-grid-fill",
};

function updateCategoryIcon() {
  const selectedCategory = categorySelect.value;

  const selectedIcon = categoryIcons[selectedCategory] || "bi-code-slash";

  categoryIcon.className = `bi ${selectedIcon} select-icon`;
}

const priorityIcons = {
  low: "bi-flag",
  medium: "bi-flag-fill",
  high: "bi-exclamation-triangle-fill",
};

function updatePriorityIcon() {
  const selectedPriority = prioritySelect.value;

  const selectedIcon = priorityIcons[selectedPriority] || "bi-flag-fill";

  priorityIcon.className = `bi ${selectedIcon} select-icon`;
}

const statusIcons = {
  "not-started": "bi-circle",
  "in-progress": "bi-play-circle-fill",
  completed: "bi-check-circle-fill",
};

function updateStatusIcon() {
  const selectedStatus = statusSelect.value;

  const selectedIcon = statusIcons[selectedStatus] || "bi-circle";

  statusIcon.className = `bi ${selectedIcon} select-icon`;
}

// ======================================================
// ADD LEARNING ITEM
// ======================================================

function addItem() {
  const title = titleInput.value.trim();
  const type = typeSelect.value;
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const status = statusSelect.value;
  const progress = Number(progressInput.value);
  const hours = Number(hoursInput.value);
  const notes = notesInput.value.trim();

  // VALIDATION

  if (!title || !type || !category || !priority || !status) {
    alert("Please fill in all required information.");
    return;
  }

  if (
    Number.isNaN(progress) ||
    Number.isNaN(hours) ||
    progress < 0 ||
    progress > 100 ||
    hours < 0
  ) {
    alert("Please enter valid progress and hours.");
    return;
  }

  // EDIT EXISTING ITEM

  if (editingId !== null) {
    const item = items.find((item) => item.id === editingId);

    if (!item) return;

    item.title = title;
    item.type = type;
    item.category = category;
    item.priority = priority;
    item.status = status;
    item.progress = progress;
    item.hours = hours;
    item.notes = notes;

    editingId = null;

    addItemBtn.innerHTML = `
      <i class="bi bi-plus-lg"></i>
      Add Learning Item
    `;
  }

  // ADD NEW ITEM
  else {
    const newItem = {
      id: Date.now(),
      title,
      type,
      category,
      priority,
      status,
      progress,
      hours,
      notes,
    };

    items.push(newItem);
  }

  saveData();
  renderItems();

  // RESET FORM

  learningForm.reset();

  progressInput.value = 0;
  hoursInput.value = 0;

  updateTypeIcon();
  updateCategoryIcon();
  updatePriorityIcon();
  updateStatusIcon();
}

// ======================================================
// RENDER LEARNING ITEMS
// ======================================================

function renderItems() {
  learningItemsList.innerHTML = "";

  // SEARCH
  let filteredItems = searchItems(librarySearchInput.value);

  // FILTER
  filteredItems = filterItems(filteredItems);

  // SORT
  filteredItems = sortItems(filteredItems);

  filteredItems.forEach((item) => {
    const typeInfo = getItemTypeInfo(item.type);

    const categoryInfo = getCategoryInfo(item.category);

    const statusInfo = getStatusInfo(item.status);

    // LEARNING ITEM

    const learningItem = document.createElement("article");

    learningItem.className = "learning-item";

    // MAIN ICON

    const itemIcon = document.createElement("div");

    itemIcon.className = `learning-item-icon ${item.type}`;

    const itemMainIcon = document.createElement("i");

    itemMainIcon.className = `bi ${categoryInfo.icon}`;

    itemIcon.append(itemMainIcon);

    // CONTENT

    const itemContent = document.createElement("div");

    itemContent.className = "learning-item-content";

    // TITLE ROW

    const itemTitleRow = document.createElement("div");

    itemTitleRow.className = "learning-item-title-row";

    const itemTitle = document.createElement("h3");

    itemTitle.textContent = item.title;

    // TYPE

    const itemType = document.createElement("span");

    itemType.className = `item-type ${item.type}`;

    const itemTypeIcon = document.createElement("i");

    itemTypeIcon.className = `bi ${typeInfo.icon}`;

    itemType.append(itemTypeIcon, typeInfo.name);

    // CATEGORY

    const itemCategory = document.createElement("span");

    itemCategory.className = "item-category";

    itemCategory.textContent = categoryInfo.name;

    itemTitleRow.append(itemTitle, itemType, itemCategory);

    // DESCRIPTION

    const itemDescription = document.createElement("p");

    itemDescription.className = "learning-item-description";

    itemDescription.textContent = item.notes || "No notes added.";

    itemContent.append(itemTitleRow, itemDescription);

    // STATUS

    const itemStatus = document.createElement("div");

    itemStatus.className = "learning-item-status";

    const itemBadge = document.createElement("span");

    itemBadge.className = `status-badge ${item.status}`;

    const itemBadgeIcon = document.createElement("i");

    itemBadgeIcon.className = `bi ${statusInfo.icon}`;

    itemBadge.append(itemBadgeIcon, statusInfo.name);

    itemStatus.append(itemBadge);

    // PROGRESS

    const itemLearning = document.createElement("div");

    itemLearning.className = "learning-item-progress";

    const itemProgressHeading = document.createElement("div");

    itemProgressHeading.className = "progress-heading";

    const itemProgressLabel = document.createElement("span");

    itemProgressLabel.textContent = "Progress";

    const itemProgressValue = document.createElement("strong");

    itemProgressValue.textContent = `${item.progress}%`;

    itemProgressHeading.append(itemProgressLabel, itemProgressValue);

    const itemProgressBar = document.createElement("div");

    itemProgressBar.className = "progress-bar";

    const itemProgressFill = document.createElement("div");

    itemProgressFill.className = "progress-fill";

    itemProgressFill.style.width = `${item.progress}%`;

    itemProgressBar.append(itemProgressFill);

    itemLearning.append(itemProgressHeading, itemProgressBar);

    // HOURS

    const itemHours = document.createElement("div");

    itemHours.className = "learning-item-hours";

    const itemHoursIcon = document.createElement("i");

    itemHoursIcon.className = "bi bi-clock";

    const itemHoursContent = document.createElement("div");

    const itemHoursValue = document.createElement("strong");

    itemHoursValue.textContent = `${item.hours}h`;

    const itemHoursLabel = document.createElement("span");

    itemHoursLabel.textContent = "Hours";

    itemHoursContent.append(itemHoursValue, itemHoursLabel);

    itemHours.append(itemHoursIcon, itemHoursContent);

    // ACTIONS

    const itemActions = document.createElement("div");

    itemActions.className = "learning-item-actions";

    // EDIT BUTTON

    const itemEditButton = document.createElement("button");

    itemEditButton.className = "edit-item-button";

    itemEditButton.type = "button";

    itemEditButton.setAttribute("aria-label", "Edit learning item");

    const itemEditIcon = document.createElement("i");

    itemEditIcon.className = "bi bi-pencil-fill";

    itemEditButton.append(itemEditIcon);

    itemEditButton.addEventListener("click", () => {
      editItem(item.id);
    });

    // DELETE BUTTON

    const itemDeleteButton = document.createElement("button");

    itemDeleteButton.className = "delete-item-button";

    itemDeleteButton.type = "button";

    itemDeleteButton.setAttribute("aria-label", "Delete learning item");

    const itemDeleteIcon = document.createElement("i");

    itemDeleteIcon.className = "bi bi-trash3-fill";

    itemDeleteButton.append(itemDeleteIcon);

    itemDeleteButton.addEventListener("click", () => {
      deleteItem(item.id);
    });

    itemActions.append(itemEditButton, itemDeleteButton);

    // BUILD ITEM

    learningItem.append(
      itemIcon,
      itemContent,
      itemStatus,
      itemLearning,
      itemHours,
      itemActions,
    );

    learningItemsList.append(learningItem);
  });

  updateStats();
}

// ======================================================
// GET ITEM TYPE NAME / ICON
// ======================================================

function getItemTypeInfo(type) {
  const types = {
    book: {
      name: "Book",
      icon: "bi-book-fill",
    },

    course: {
      name: "Course",
      icon: "bi-play-btn-fill",
    },

    article: {
      name: "Article",
      icon: "bi-file-earmark-text-fill",
    },

    video: {
      name: "Video",
      icon: "bi-camera-video-fill",
    },
  };

  return (
    types[type] || {
      name: "Other",
      icon: "bi-collection-fill",
    }
  );
}

// ======================================================
// GET CATEGORY NAME / ICON
// ======================================================

function getCategoryInfo(category) {
  const categories = {
    programming: {
      name: "Programming",
      icon: "bi-code-slash",
    },

    development: {
      name: "Development",
      icon: "bi-braces",
    },

    "web-design": {
      name: "Web Design",
      icon: "bi-palette-fill",
    },

    javascript: {
      name: "JavaScript",
      icon: "bi-filetype-js",
    },

    career: {
      name: "Career",
      icon: "bi-briefcase-fill",
    },

    other: {
      name: "Other",
      icon: "bi-grid-fill",
    },
  };

  return (
    categories[category] || {
      name: "Other",
      icon: "bi-grid-fill",
    }
  );
}

// ======================================================
// GET STATUS NAME / ICON
// ======================================================

function getStatusInfo(status) {
  const statuses = {
    "not-started": {
      name: "Not Started",
      icon: "bi-circle",
    },

    "in-progress": {
      name: "In Progress",
      icon: "bi-play-circle-fill",
    },

    completed: {
      name: "Completed",
      icon: "bi-check-circle-fill",
    },
  };

  return (
    statuses[status] || {
      name: "Not Started",
      icon: "bi-circle",
    }
  );
}

// ======================================================
// EDIT LEARNING ITEM
// ======================================================

function editItem(id) {
  const item = items.find((item) => item.id === id);

  if (!item) return;

  editingId = id;

  titleInput.value = item.title;
  typeSelect.value = item.type;
  categorySelect.value = item.category;
  prioritySelect.value = item.priority;
  statusSelect.value = item.status;
  progressInput.value = item.progress;
  hoursInput.value = item.hours;
  notesInput.value = item.notes;

  addItemBtn.innerHTML = `
    <i class="bi bi-check-lg"></i>
    Update Learning Item
  `;

  updateTypeIcon();
  updateCategoryIcon();
  updatePriorityIcon();
  updateStatusIcon();

  learningForm.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

// ======================================================
// DELETE LEARNING ITEM
// ======================================================

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);

  if (editingId === id) {
    editingId = null;

    learningForm.reset();

    progressInput.value = 0;
    hoursInput.value = 0;

    addItemBtn.innerHTML = `
      <i class="bi bi-plus-lg"></i>
      Add Learning Item
    `;

    updateTypeIcon();
    updateCategoryIcon();
    updatePriorityIcon();
    updateStatusIcon();
  }

  saveData();
  renderItems();
}

// ======================================================
// UPDATE ITEM PROGRESS
// ======================================================

function updateItemProgress(id, newProgress) {
  const item = items.find((item) => item.id === id);

  if (!item) return;

  const progress = Number(newProgress);

  if (Number.isNaN(progress) || progress < 0 || progress > 100) {
    return;
  }

  item.progress = progress;

  saveData();
  renderItems();
}

// ======================================================
// UPDATE ITEM STATUS
// ======================================================

function updateItemStatus(id, newStatus) {
  const item = items.find((item) => item.id === id);

  if (!item) return;

  const allowedStatuses = ["not-started", "in-progress", "completed"];

  if (!allowedStatuses.includes(newStatus)) {
    return;
  }

  item.status = newStatus;

  saveData();
  renderItems();
}

// ======================================================
// SEARCH LEARNING ITEMS
// ======================================================

function searchItems(searchTerm) {
  const search = searchTerm.trim().toLowerCase();

  if (!search) {
    return [...items];
  }

  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.notes || "").toLowerCase().includes(search)
    );
  });
}

// ======================================================
// FILTER LEARNING ITEMS
// ======================================================

function filterItems(filteredItems) {
  if (activeTypeFilter === "all") {
    return filteredItems;
  }

  return filteredItems.filter((item) => {
    return item.type === activeTypeFilter;
  });
}

// ======================================================
// SORT LEARNING ITEMS
// ======================================================

function sortItems(filteredItems) {
  const sortedItems = [...filteredItems];

  if (activeSortFilter === "newest") {
    sortedItems.sort((a, b) => b.id - a.id);
  } else if (activeSortFilter === "oldest") {
    sortedItems.sort((a, b) => a.id - b.id);
  } else if (activeSortFilter === "progress-high") {
    sortedItems.sort((a, b) => b.progress - a.progress);
  } else if (activeSortFilter === "progress-low") {
    sortedItems.sort((a, b) => a.progress - b.progress);
  } else if (activeSortFilter === "title") {
    sortedItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sortedItems;
}

// ======================================================
// UPDATE STATS
// ======================================================

function updateStats() {
  totalItemsValue.textContent = items.length;

  const completedItems = items.filter((item) => item.status === "completed");

  completedItemsValue.textContent = completedItems.length;

  const completionRate =
    items.length > 0
      ? Math.round((completedItems.length / items.length) * 100)
      : 0;

  completedRateValue.textContent = `${completionRate}% completion rate`;

  const totalHours = items.reduce((total, item) => {
    return total + item.hours;
  }, 0);

  learningHoursValue.textContent = totalHours;

  const totalProgress = items.reduce((total, item) => {
    return total + item.progress;
  }, 0);

  const averageProgress =
    items.length > 0 ? Math.round(totalProgress / items.length) : 0;

  averageProgressValue.textContent = `${averageProgress}%`;
}

// ======================================================
// EVENT LISTENERS
// ======================================================

// NAVIGATION

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
    });

    link.classList.add("active");

    const selectedPage = link.dataset.filter;

    navigateToSection(selectedPage);
  });
});

// THEME

toggleBtn.addEventListener("click", toggleTheme);

// ADD / EDIT ITEM

learningForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addItem();
});

// SELECT ICONS

typeSelect.addEventListener("change", updateTypeIcon);

categorySelect.addEventListener("change", updateCategoryIcon);

prioritySelect.addEventListener("change", updatePriorityIcon);

statusSelect.addEventListener("change", updateStatusIcon);

// LIBRARY SEARCH

librarySearchInput.addEventListener("input", () => {
  renderItems();
});

// HEADER SEARCH

searchInput.addEventListener("input", () => {
  librarySearchInput.value = searchInput.value;

  renderItems();
});

// SORT

librarySortSelect.addEventListener("change", () => {
  activeSortFilter = librarySortSelect.value;

  renderItems();
});

// TYPE FILTERS

typeFilters.forEach((button) => {
  button.addEventListener("click", () => {
    typeFilters.forEach((filter) => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    activeTypeFilter = button.dataset.type;

    renderItems();
  });
});

// ======================================================
// INITIALIZE APP
// ======================================================

function init() {
  loadData();
  loadTheme();

  updateTypeIcon();
  updateCategoryIcon();
  updatePriorityIcon();
  updateStatusIcon();

  renderItems();
}

init();
