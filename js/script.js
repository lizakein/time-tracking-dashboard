const reportEl = document.querySelector('.report');
const buttons = document.querySelectorAll('.timeframes button');

let reportData = [];
let currentFrame = 'weekly';

function renderInitialCards() {
  let html = '';

  reportData.forEach(({ title }) => {
    const cardId = title.toLowerCase().replace(/\s+/g, '-');

    html += `
      <article class="card" id="${cardId}" data-title="${title}">
        <div class="card__top">
          <img src="./images/icon-${cardId}.svg" alt="">
        </div>
        <div class="card__content">
          <div class="card__header">
            <h2 class="card__type">${title}</h2>
            <button class="card__menu" aria-label="Open menu for ${title}"><img src="./images/icon-ellipsis.svg" alt=""></button>
          </div>
          <div class="card__body">
            <p class="card__hours--current"></p>
            <p class="card__hours--previous"></p>
          </div>
        </div>
      </article>
    `;
  });

  reportEl.innerHTML = html;
}

function updateCards(timeframe) {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    const title = card.dataset.title;
    const { timeframes } = reportData.find((item) => item.title === title);
    
    const currentEl = card.querySelector('.card__hours--current');
    const previousEl = card.querySelector('.card__hours--previous');

    currentEl.textContent = `${timeframes[timeframe].current}hrs`;
    previousEl.textContent = `
      Last ${timeframe === 'daily' ? 'day' : timeframe === 'weekly' ? 'week' : 'month'} 
      - ${timeframes[timeframe].previous}hrs
    `;
  });
}

fetch('/data.json')
  .then((response) => response.json())
  .then((data) => {
    reportData = data;
    renderInitialCards();
    updateCards(currentFrame);
});

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFrame = btn.dataset.timeframe;

    buttons.forEach((b) => {
      b.classList.remove('active');
      b.ariaPressed = 'false';
    });

    btn.classList.add('active');
    btn.ariaPressed = 'true';

    updateCards(currentFrame);
  });
});