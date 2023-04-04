
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const currentImageContainer = document.querySelector('#current-image-container');
const searchHistory = document.querySelector('#search-history');

let searches = JSON.parse(localStorage.getItem('searches')) || [];

async function fetchData(date) {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=T76DTFqMur9eQPuNB5SnJOHLeV13ZIeeCQSrsRHp`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentImageOfTheDay() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await fetchData(today);
  const html = `
    <h2>${data.title}</h2>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
  `;
  currentImageContainer.innerHTML = html;
}

async function getImageOfTheDay() {
  const date = input.value;
  const data = await fetchData(date);
  const html = `
    <h2>${data.title}</h2>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
  `;
  currentImageContainer.innerHTML = html;
  saveSearch(date);
  addSearchToHistory();
}

function saveSearch(date) {
  searches.push(date);
  localStorage.setItem('searches', JSON.stringify(searches));
}

function addSearchToHistory() {
  searchHistory.innerHTML = '';
  searches.forEach(search => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = search;
    link.addEventListener('click', async () => {
      const data = await fetchData(search);
      const html = `
        <h2>${data.title}</h2>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
      `;
      currentImageContainer.innerHTML = html;
    });
    li.appendChild(link);
    searchHistory.appendChild(li);
  });
}

getCurrentImageOfTheDay();

form.addEventListener('submit', event => {
  event.preventDefault();
  getImageOfTheDay();
});
