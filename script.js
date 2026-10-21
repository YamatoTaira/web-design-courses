const form = document.getElementById("leadForm");
const successMessage = document.getElementById("successMessage");
const tariffInput = document.getElementById("tariff");
const selectedTariff = document.getElementById("selectedTariff");
const tariffButtons = document.querySelectorAll(".select-tariff-btn");
const priceCards = document.querySelectorAll(".price-card");
const countdownNode = document.getElementById("countdown");
const scrollProgress = document.getElementById("scrollProgress");
const revealItems = document.querySelectorAll(".reveal");

function setTariff(tariff) {
  if (!tariffInput || !selectedTariff) {
    return;
  }

  tariffInput.value = tariff;
  selectedTariff.textContent = tariff;

  priceCards.forEach((card) => {
    card.classList.toggle("selected", card.dataset.tariff === tariff);
  });
}

tariffButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tariff = button.dataset.tariff;
    if (tariff) {
      setTariff(tariff);
    }
  });
});

if (form && successMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isTelegram = /^@[\w\d_]{4,32}$/.test(contact);

    successMessage.classList.remove("error");

    if (name.length < 2) {
      successMessage.classList.add("error");
      successMessage.textContent = "Введите имя (минимум 2 символа).";
      return;
    }

    if (!isEmail && !isTelegram) {
      successMessage.classList.add("error");
      successMessage.textContent = "Укажите корректный Email или Telegram в формате @username.";
      return;
    }

    successMessage.textContent = `Готово! Заявка на тариф "${tariffInput.value}" отправлена. Мы скоро свяжемся с вами.`;
    form.reset();
    setTariff("Профи");
  });
}

function updateCountdown() {
  if (!countdownNode) {
    return;
  }

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() + 7);
  startDate.setHours(20, 0, 0, 0);

  const diff = startDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));

  countdownNode.textContent = `${days} дн. ${hours} ч.`;
}

function updateScrollProgress() {
  if (!scrollProgress) {
    return;
  }
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const width = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${width}%`;
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

setTariff("Профи");
updateCountdown();
updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.setInterval(updateCountdown, 60000);
