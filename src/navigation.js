window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

searchFormBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = searchFormInput.value;
  if (inputValue) {
    location.hash = "search=" + searchFormInput.value;
  }
});

arrowBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.hash = window.history.back();
});

trendingBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.hash = "trending";
});

window.addEventListener("scroll", () => infiniteScroll(), { passive: false });

function navigator() {
  window.scrollTo(0, 0);
  page = 1;
  if (location.hash.startsWith("#search")) {
    searchPage();
  } else if (location.hash.startsWith("#movie")) {
    movieDetail();
  } else if (location.hash.startsWith("#genre")) {
    genrePage();
  } else if (location.hash.startsWith("#trending")) {
    trendingPage();
  } else {
    home();
  }
}

function home() {
  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();

  headerSection.style.background = "";
  headerSection.classList.remove("header-container--long");
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");
  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");
}

function searchPage() {
  headerSection.style.background = "";
  headerSection.classList.remove("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.remove("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  getMoviesBySearch(search);
}

function movieDetail() {
  headerSection.style.background = "white";
  headerSection.classList.add("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  let id = location.hash.split("-")[1];
  getMovieDetail(id);
}

function genrePage() {
  headerSection.style.background = "";
  headerSection.classList.remove("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  getMoviesByGenre();
}

function trendingPage() {
  headerSection.style.background = "";
  headerSection.classList.remove("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");
  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  getTrendingMovies();
}
