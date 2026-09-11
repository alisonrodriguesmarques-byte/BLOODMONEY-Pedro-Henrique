const moneyEl = document.getElementById("money");
const perClickEl = document.getElementById("perClick");
const pedro = document.getElementById("pedro");
const feedback = document.getElementById("feedback");
const statusEl = document.getElementById("status");
const upgrades = document.querySelectorAll(".upgrade");
const resetBtn = document.getElementById("reset");

let money = Number(localStorage.getItem("bm_money") || 0);
let perClick = Number(localStorage.getItem("bm_perClick") || 1);
let won = false;

function formatMoney(value) {
  return "$" + Math.floor(value).toLocaleString("pt-BR");
}

function save() {
  localStorage.setItem("bm_money", money);
  localStorage.setItem("bm_perClick", perClick);
}

function updateScreen() {
  moneyEl.textContent = formatMoney(money);
  perClickEl.textContent = formatMoney(perClick);

  upgrades.forEach(button => {
    const cost = Number(button.dataset.cost);
    button.disabled = money < cost || won;
  });

  if (money >= 25000 && !won) {
    won = true;
    statusEl.textContent = "META ALCANÇADA! Pedro Henrique conseguiu o objetivo.";
    pedro.disabled = true;
  }
}

function showFeedback() {
  feedback.textContent = "+" + formatMoney(perClick);
  feedback.classList.remove("show");
  void feedback.offsetWidth;
  feedback.classList.add("show");
}

function earn() {
  if (won) return;

  money += perClick;
  showFeedback();
  statusEl.textContent = "Boa! Continue tocando para aumentar o dinheiro.";
  save();
  updateScreen();
}

pedro.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  earn();
});

upgrades.forEach(button => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    const cost = Number(button.dataset.cost);
    const add = Number(button.dataset.add);

    if (money < cost || won) return;

    money -= cost;
    perClick += add;

    statusEl.textContent = `Upgrade comprado! Agora cada toque vale ${formatMoney(perClick)}.`;
    save();
    updateScreen();
  });
});

resetBtn.addEventListener("click", () => {
  money = 0;
  perClick = 1;
  won = false;
  pedro.disabled = false;
  localStorage.removeItem("bm_money");
  localStorage.removeItem("bm_perClick");
  statusEl.textContent = "Jogo reiniciado. Toque em Pedro para começar.";
  updateScreen();
});

updateScreen();
