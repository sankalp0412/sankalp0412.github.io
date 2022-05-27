const API_KEY = "api_key=c41af3823c9e59a61777f9f18239b624";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const RECOMMEND_URL = "http://54.226.113.62:8000/api/getMovies?name=";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const searchURL = BASE_URL + "/search/movie?" + API_KEY;

// const resultApi = ;

const main = document.getElementById("main");
const from = document.getElementById("form");
const search = document.getElementById("search");

getMovies(API_URL);

async function movieArray(url) {
  const res = await fetch(url);
  const response = await res.json();
  return response.results;
}

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.results[0].poster_path);
      showMovies(data.results);
    });
}

function showMovies(data, flag = false) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    var url = flag == true ? poster_path : IMG_URL + poster_path;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <button id = "${title}" class = "image-btn" onclick = "movieSelect(this.id)"> <img src="${url}" alt = ""> </button>
    <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
        <h3>
            Overview
        </h3>
        ${overview}
    </div>
        `;
    main.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 6) {
    return "orange";
  } else {
    return "red";
  }
}

from.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchterm = search.value;
  if (searchterm) {
    getMovies(searchURL + "&query=" + searchterm);
  } else {
    getMovies(API_URL);
  }
});

async function movieSelect(SelectedMovie) {
  const res = await fetch(RECOMMEND_URL + SelectedMovie);
  const data = await res.json();
  let finalRes = [];
  data.data.map(async (movie) => {
    const film = await movieArray(searchURL + "&query=" + movie);
    console.log(film[0].poster_path);
    finalRes = [
      ...finalRes,
      {
        title: movie,
        poster_path: IMG_URL + film[0].poster_path,
        vote_average: getRandomArbitrary(),
        overview: "",
      },
    ];
    console.log(finalRes);
    showMovies(finalRes, true);

  });
}

function getRandomArbitrary(min = 0, max = 12) {
  const voteAvr = [5.5, 6, 6.3, 6.8, 7, 7.4, 7.9, 8, 8.2, 8.6, 8.9, 9, 9.5];
  const index = Math.round(Math.random() * (max - min) + min);
  return voteAvr[index];
}
