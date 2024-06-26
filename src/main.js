const api = axios.create({
  headers: { "Content-Type": "application/json;charset=utf-8" },
  params: { api_key: API_KEY },
});

const url = "https://api.themoviedb.org/3/";

let page = 1;
let total_pages;

//get trending movies list
async function getTrendingMoviesPreview() {
  const { data } = await api(url + "trending/movie/day");

  const moviesList = data.results;

  const moviesListContainer = document.querySelector(
    "#trendingPreview .trendingPreview-movieList"
  );

  moviesListContainer.innerHTML = "";

  moviesList.forEach((item) => {
    appendMovieItem({
      item,
      container: moviesListContainer,
      lazyLoading: true,
    });
  });
}

//get trending movies list
async function getLikedMovies() {
  const likedMovies = localStorage.getItem("likedMovies");
  const parsedLikedMovies = JSON.parse(likedMovies);
  
  likedMoviesList.innerHTML = "";

  if (likedMovies && parsedLikedMovies?.length !== 0) {
    parsedLikedMovies.forEach((item) => {
      appendMovieItem({
        item,
        container: likedMoviesList,
        lazyLoading: true,
      });
    });
  } else {
    likedMoviesList.innerHTML = `<div class="liked-movies-header">
    <h2 class="liked-movies-title">You haven't liked any movies yet</h2>
  </div>`;
  }
}

//function selector
function callSelector() {
  if (location.hash.startsWith("#search")) {
    getMoviesBySearch();
  } else if (location.hash.startsWith("#genre")) {
    getMoviesByGenre();
  } else if (location.hash.startsWith("#trending")) {
    getTrendingMovies();
  }
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
async function getMoviesByGenre() {
  let genre = location.hash.split("=")[1];
  let [name, id] = genre.split("-");
  const { data } = await api(
    `${url}discover/movie?with_genres=${id}&page=${page}`
  );

  const moviesList = data.results;
  total_pages = data?.total_pages;

  headerCategoryTitle.innerHTML = name.replace(/%20/g, " ");

  if (page === 1) {
    genericSection.innerHTML = "";
  }

  moviesList.forEach((item) => {
    appendMovieItem({ item, container: genericSection });
  });
}

//get movies by search result
async function getMoviesBySearch() {
  let query = location.hash.split("=")[1];
  const { data } = await api(`${url}search/movie?query=${query}$page=${page}`);

  const moviesList = data.results;
  total_pages = data?.total_pages;

  headerCategoryTitle.innerHTML = `results for "${search.replace(
    /%20/g,
    " "
  )}"`;

  if (page === 1) {
    genericSection.innerHTML = "";
  }

  moviesList.forEach((item) => {
    appendMovieItem({ item, container: genericSection });
  });
}

//get movies by search result
async function getTrendingMovies() {
  const { data } = await api(`${url}trending/movie/day?page=${page}`);

  const moviesList = data?.results;
  total_pages = data?.total_pages;

  headerCategoryTitle.innerHTML = "Trending movies";

  if (page === 1) {
    genericSection.innerHTML = "";
  }

  moviesList.forEach((item) => {
    appendMovieItem({ item, container: genericSection });
  });
}

//get more
function infiniteScroll() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight && page < total_pages) {
    page++;
    callSelector();
  }
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
  url("https://image.tmdb.org//t/p/w500${poster_path}")`;

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
    appendMovieItem({ item, container: relatedMoviesContainer });
  });
}

//append movie item
function appendMovieItem({ item, container, lazyLoading = false }) {
  const { title, poster_path: src, id, overview } = item;

  const movieItemContainer = document.createElement("div");
  const image = document.createElement("img");
  const likeBtn = document.createElement("button");

  movieItemContainer.classList.add("movie-container");

  image.classList.add("movie-img");
  image.setAttribute("alt", title);
  image.setAttribute(
    lazyLoading ? "data-img" : "src",
    "https://image.tmdb.org/t/p/w300" + src
  );
  movieItemContainer.style.height = "100%";

  likeBtn.classList.add("like-button");

  if (localStorage.getItem("likedMovies")?.includes(id)) {
    likeBtn.classList.add("like-button--liked");
  }

  movieItemContainer.appendChild(image);
  movieItemContainer.appendChild(likeBtn);
  container.appendChild(movieItemContainer);

  image.addEventListener("error", () => {
    const textImage = document.createElement("div");
    textImage.classList.add("movie-img");
    textImage.classList.add("image-text");
    textImage.innerHTML = `<h2 class='image-text--title'>${title}</h2>`;

    textImage.innerHTML += `<small class='image-text--overview'>${overview}</small>`;
    movieItemContainer.replaceChild(textImage, image);
  });

  image.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `movie=${title}-${id}`;
  });

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("like-button--liked");

    if (!localStorage.getItem("likedMovies")) {
      localStorage.setItem("likedMovies", JSON.stringify([item]));
    } else {
      let parsedLikedMovies = JSON.parse(localStorage.getItem("likedMovies"));

      if (!localStorage.getItem("likedMovies").includes(id)) {
        localStorage.setItem(
          "likedMovies",
          JSON.stringify([...parsedLikedMovies, item])
        );
      } else {
        localStorage.setItem(
          "likedMovies",
          JSON.stringify(
            parsedLikedMovies.filter((likedMovie) => likedMovie.id !== id)
          )
        );
      }
    }

    getLikedMovies();
    getTrendingMoviesPreview()
  });

  if (lazyLoading) {
    LazyLoader.observe(image);
  }
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

//utils
const LazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});
