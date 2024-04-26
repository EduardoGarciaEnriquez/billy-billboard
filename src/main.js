const api = axios.create({
  headers: { "Content-Type": "application/json;charset=utf-8" },
  params: { api_key: API_KEY },
});

const url = "https://api.themoviedb.org/3/";

//get trending movies list
async function getPopularMoviesPreview() {
  const { data } = await api(url + "movie/popular");

  const moviesList = data.results;

  const moviesListContainer = document.querySelector(
    "#trendingPreview .trendingPreview-movieList"
  );

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

  genres.forEach((item) => {
    appendGenreItem(item, genresListContainer);
  });
}

//append movie item
function appendMovieItem(item, moviesListContainer) {
  const { title, poster_path: src } = item;

  const movieItemContainer = document.createElement("div");
  const image = document.createElement("img");

  movieItemContainer.classList.add("movie-container");

  image.classList.add("movie-img");
  image.setAttribute("alt", title);
  image.setAttribute("src", "https://image.tmdb.org/t/p/w300" + src);

  movieItemContainer.appendChild(image);
  moviesListContainer.appendChild(movieItemContainer);
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
}

getPopularMoviesPreview();
getCategoriesPreview();
