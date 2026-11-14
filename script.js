// Мобильное меню
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Закрыть меню" : "Открыть меню"
  );
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  });
});

// Интерактивный калькулятор уборки
const typeTabs = document.querySelectorAll(".type-tab");
const areaRange = document.querySelector("#areaRange");
const areaOutput = document.querySelector("#areaOutput");
const extraInputs = document.querySelectorAll(".extra-input");
const totalPriceEl = document.querySelector("#totalPrice");
const summaryMetaEl = document.querySelector("#summaryMeta");
const applyCalcBtn = document.querySelector("#applyCalcBtn");
const messageField = document.querySelector("#message");

const typeLabels = {
  basic: "Поддерживающая уборка",
  deep: "Генеральная уборка",
  renovation: "Уборка после ремонта"
};

let currentType = "basic";
let currentRate = 75;
let currentBase = 1500;

function formatRub(num) {
  return num.toLocaleString("ru-RU") + " ₽";
}

function updateCalculator() {
  const area = Number(areaRange.value);
  areaOutput.textContent = area;

  let extrasTotal = 0;
  const selectedExtras = [];

  extraInputs.forEach((input) => {
    if (input.checked) {
      extrasTotal += Number(input.value);
      selectedExtras.push(input.dataset.name);
    }
  });

  const rawTotal = currentBase + area * currentRate + extrasTotal;
  const roundedTotal = Math.round(rawTotal / 100) * 100;

  const cleanersCount = area > 75 || currentType === "renovation" ? "2 клинера" : "1 клинер";
  const estHours =
    currentType === "basic"
      ? "~3–4 ч"
      : currentType === "deep"
      ? "~5–6 ч"
      : "~6–8 ч";

  totalPriceEl.textContent = formatRub(roundedTotal);
  summaryMetaEl.textContent = `${typeLabels[currentType]} · ${area} м² · ${cleanersCount} (${estHours})`;

  return {
    typeLabel: typeLabels[currentType],
    area,
    extras: selectedExtras,
    total: formatRub(roundedTotal)
  };
}

typeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    typeTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    currentType = tab.dataset.type;
    currentRate = Number(tab.dataset.rate);
    currentBase = Number(tab.dataset.base);
    updateCalculator();
  });
});

// Переключение таба калькулятора при клике на карточку тарифа
document.querySelectorAll("[data-select-type]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetType = btn.dataset.selectType;
    const matchingTab = document.querySelector(`.type-tab[data-type="${targetType}"]`);
    if (matchingTab) {
      matchingTab.click();
    }
  });
});

areaRange.addEventListener("input", updateCalculator);
extraInputs.forEach((input) => input.addEventListener("change", updateCalculator));

// Перенос расчёта прямо в форму заявки
applyCalcBtn.addEventListener("click", () => {
  const data = updateCalculator();
  const extrasText = data.extras.length ? `, доп. опции: ${data.extras.join(", ")}` : "";
  messageField.value = `${data.typeLabel}, площадь ${data.area} м²${extrasText}. Расчётная сумма: ${data.total}.`;

  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#name").focus();
});

updateCalculator();

// Обработка формы
const form = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const userName = document.querySelector("#name").value.trim();
  formMessage.textContent = `${userName}, заявка принята! В реальном проекте эти данные сразу улетают владельцу бизнеса в Telegram-бот.`;

  form.reset();
});