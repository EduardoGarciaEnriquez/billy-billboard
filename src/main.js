const api = axios.create({
  headers: { "Content-Type": "application/json;charset=utf-8" },
  params: { api_key: API_KEY },
});

const url = "https://api.themoviedb.org/3/";

//get trending movies list
async function getTrendingMoviesPreview() {
  const { data } = await api(url + "trending/movie/day");

  const moviesList = data.results;

  const moviesListContainer = document.querySelector(
    "#trendingPreview .trendingPreview-movieList"
  );

  moviesListContainer.innerHTML = "";

  moviesList.forEach((item) => {
    appendMovieItem(item, moviesListContainer);
  });
}

//get genres list
async function getCategoriesPreview() {
  const { data } = await api(url + "genre/movie/list");

  const genres = data.genres;

  const genresListContainer = document.querySelector(
    "#categoriesPreview .categoriesPreview-list"
  );

  genresListContainer.innerHTML = "";

  genres.forEach((item) => {
    appendGenreItem(item, genresListContainer);
  });
}

//get movies by genre list
async function getMoviesByGenre({ id, name }) {
  const { data } = await api(url + "discover/movie?with_genres=" + id);

  const moviesList = data.results;

  headerCategoryTitle.innerHTML = name.replace(/%20/g, " ");

  genericSection.innerHTML = "";

  moviesList.forEach((item) => {
    appendMovieItem(item, genericSection);
  });
}

//get movies by search result
async function getMoviesBySearch(search) {
  const { data } = await api(url + "search/movie?query=" + search);

  const moviesList = data.results;

  headerCategoryTitle.innerHTML = `results for "${search.replace(
    /%20/g,
    " "
  )}"`;

  genericSection.innerHTML = "";

  moviesList.forEach((item) => {
    appendMovieItem(item, genericSection);
  });
}

//get movies by search result
async function getTrendingMovies() {
  const { data } = await api(url + "trending/movie/day");

  const moviesList = data.results;

  headerCategoryTitle.innerHTML = "Trending movies";

  genericSection.innerHTML = "";

  moviesList.forEach((item) => {
    appendMovieItem(item, genericSection);
  });
}

//get movies by search result
async function getMovieDetail(id) {
  const { data } = await api(url + "movie/" + id);

  const { title, genres, poster_path, vote_average, overview } = data;

  movieDetailTitle.innerHTML = title;
  movieDetailScore.innerHTML = vote_average.toFixed(1);
  movieDetailDescription.innerHTML = overview;
  headerSection.style.background = `linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),
  url("https://image.tmdb.org//t/p/w500${poster_path}")`
  movieDetailCategoriesList.innerHTML = "";

  genres.forEach((item) => {
    appendGenreItem(item, movieDetailCategoriesList);
  });

  getRelatedMovies(id);
}

//get related movies
async function getRelatedMovies(id) {
  const { data } = await api(`${url}movie/${id}/similar`);

  const relatedMovies = data.results;

  relatedMoviesContainer.innerHTML = "";

  relatedMovies.forEach((item) => {
    appendMovieItem(item, relatedMoviesContainer);
  });
}

//append movie item
function appendMovieItem(item, moviesListContainer) {
  const { title, poster_path: src, id } = item;

  const movieItemContainer = document.createElement("div");
  const image = document.createElement("img");

  movieItemContainer.classList.add("movie-container");

  image.classList.add("movie-img");
  image.setAttribute("alt", title);
  image.setAttribute("src", "https://image.tmdb.org/t/p/w300" + src);

  movieItemContainer.appendChild(image);
  moviesListContainer.appendChild(movieItemContainer);

  movieItemContainer.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `movie=${title}-${id}`;
  });
}

//append genre item
function appendGenreItem(item, genresListContainer) {
  const { id, name } = item;

  const genreItemContainer = document.createElement("div");
  const title = document.createElement("h3");

  genreItemContainer.classList.add("category-container");

  title.classList.add("category-title");
  title.setAttribute("id", "id" + id);
  title.textContent = name;

  genreItemContainer.appendChild(title);
  genresListContainer.appendChild(genreItemContainer);

  title.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `genre=${name}-${id}`;
  });
}
