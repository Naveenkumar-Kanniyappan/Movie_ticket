let users = JSON.parse(localStorage.getItem("users")) || [];

users.forEach((user) => {
  let loginName = document.getElementById("login_user_name");
  if (loginName) {
    loginName.textContent = `${user.username}`;
  }
});
if (window.location.pathname.includes("homepage.html")) {
  document.addEventListener("DOMContentLoaded", function () {
  let loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn !== "true") {
  alert("You must log in first!");
  window.location.href = "loginpage.html"; 
  }
  });
  }
  
  if (window.location.pathname.includes("index.html")) {
  let navegate = document.getElementById("logoutBtn");
  navegate.addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "loginpage.html"; 
  });
  }
  
  let slide = document.getElementById("slide-images");
  let prevBtn = document.getElementById("prev-btn");
  let nextBtn = document.getElementById("next-btn");
  
  let currentIndex = 0;
  
  function updateCarousel() {
  let offset = -currentIndex * 100;
  slide.style.transform = `translateX(${offset}%)`;
  }
  
  [nextBtn, prevBtn].forEach((button) => {
  button.addEventListener("click", () => {
  let totalImages = slide.children.length;
  if (button === nextBtn) {
  currentIndex = (currentIndex + 1) % totalImages; 
  } else if (button === prevBtn) {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  }
  updateCarousel();
  });
  });
  
  setInterval(() => {
  const totalImages = slide.children.length;
  currentIndex = (currentIndex + 1) % totalImages;
  updateCarousel();
  }, 3000);
  
  let api = "https://mimic-server-api.vercel.app/movies";
  let imgDiv = document.getElementById("movies-container");
  
  let request = new XMLHttpRequest();
  request.open("GET", api);
  request.onload = function () {
  let data = JSON.parse(request.responseText);
  for (let i = 0; i < data.length; i++) {
  let movie = data[i];
  let imgcontainer = document.createElement("div");
  imgcontainer.style.width = "100%";
  imgcontainer.style.height = "auto";
  imgcontainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  imgcontainer.style.borderRadius = "10px";
  imgcontainer.style.overflow = "hidden";
  
  let img = document.createElement("img");
  img.src = movie.poster_path;
  img.style.width = "100%";
  img.style.height = "250px";
  imgcontainer.appendChild(img);
  
  let title = document.createElement("h3");
  title.textContent = movie.title;
  title.style.textAlign = "center";
  title.style.color = "black";
  imgcontainer.appendChild(title);
  
  if (movie.original_language == "ta") {
  let language = document.createElement("p");
  language.textContent = "Language: Tamil";
  language.style.textAlign = "center";
  language.style.color = "black";
  imgcontainer.appendChild(language);    
  }
  
  let release = document.createElement("p");
  release.textContent = "Release Date: " + movie.release_date;
  release.style.textAlign = "center";
  release.style.color = "black";
  imgcontainer.appendChild(release);
  
  if (movie.adult == false) {
  let adult = document.createElement("p");
  adult.textContent = "Adult: No";
  adult.style.textAlign = "center";
  adult.style.color = "black";
  imgcontainer.appendChild(adult);
  } else {
  let adult = document.createElement("p");
  adult.textContent = "Adult: Yes";
  adult.style.textAlign = "center";
  adult.style.color = "black";
  imgcontainer.appendChild(adult);
  }
  
  let genreMapping = {
  28: "Action",
  80: "Crime",
  53: "Thriller",
  18: "Drama",
  10751: "Family",
  35: "Comedy",
  12: "Adventure",
  14: "Fantasy",
  36: "History",
  10749: "Romance"
  };
  
  let genreNames = [];
  for (let i = 0; i < movie.genre_ids.length; i++) {
  let genreId = movie.genre_ids[i];
  if (genreMapping[genreId]) {
  genreNames.push(genreMapping[genreId]);
  }
  }
  
  let genre = document.createElement("p");
  genre.textContent = "Genre: " + genreNames.join(", ");
  genre.style.textAlign = "center";
  genre.style.color = "black";
  imgcontainer.appendChild(genre);
  
  let rating = document.createElement("p");
  rating.textContent = "Rating: " + movie.vote_average + " / 10";
  rating.style.textAlign = "center";
  rating.style.color = "black";
  imgcontainer.appendChild(rating);
  
  imgDiv.appendChild(imgcontainer);
  }
  };
  request.send();
  
  postMovieLink.addEventListener("click", (e) => {
  e.preventDefault();
  postMovieModal.classList.remove("hidden");
  });
  
  cancelPost.addEventListener("click", () => {
  postMovieModal.classList.add("hidden");
  });
  
  postMovieForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    let movieTitle = document.getElementById("movieTitle").value;
    let movieGenreInput = document.getElementById("movieGenre").value;
    let movieGenreArray = movieGenreInput.split(",");
    let movieGenre = [];
  
    for (let i = 0; i < movieGenreArray.length; i++) {
      movieGenre.push(movieGenreArray[i].trim());
    }
  
    let movieLanguage = document.getElementById("movieLanguage").value;
    let moviePoster = document.getElementById("moviePoster").value;
    let movieReleaseDate = document.getElementById("movieReleaseDate").value;
    let movieRating = parseFloat(document.getElementById("movieRating").value);
  
    let genreSelect = {
      Action: 28,
      Crime: 80,
      Thriller: 53,
      Drama: 18,
      Family: 10751,
      Comedy: 35,
      Adventure: 12,
      Fantasy: 14,
      History: 36,
      Romance: 10749,
    };
  
    let genreIds = [];
    for (let i = 0; i < movieGenre.length; i++) {
      let genreId = genreSelect[movieGenre[i]];
      if (genreId) {
        genreIds.push(genreId);
      }
    }
  
    if (genreIds.length === 0) {
      console.error("No valid genres selected.");
      return;
    }
  
    let newMovie = {
      title: movieTitle,
      genre_ids: genreIds,
      original_language: movieLanguage,
      poster_path: moviePoster,
      release_date: movieReleaseDate,
      vote_average: movieRating,
      adult: false,
    };
  
    let request = new XMLHttpRequest();
    request.open("POST", "https://mimic-server-api.vercel.app/movies");
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
      if (request.status === 201) {
        let movie = JSON.parse(request.responseText);
  
        let imgcontainer = document.createElement("div");
        imgcontainer.style.width = "100%";
        imgcontainer.style.height = "auto";
        imgcontainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        imgcontainer.style.borderRadius = "10px";
        imgcontainer.style.overflow = "hidden";
  
        let img = document.createElement("img");
        img.src = movie.poster_path;
        img.style.width = "100%";
        img.style.height = "250px";
        imgcontainer.appendChild(img);
  
        let title = document.createElement("h3");
        title.textContent = movie.title;
        title.style.textAlign = "center";
        title.style.color = "black";
        imgcontainer.appendChild(title);
  
        let genre = document.createElement("p");
        genre.textContent = "Genre: " + movieGenre.join(", ");
        genre.style.textAlign = "center";
        genre.style.color = "black";
        imgcontainer.appendChild(genre);
  
        let language = document.createElement("p");
        language.textContent = "Language: " + movie.original_language;
        language.style.textAlign = "center";
        language.style.color = "black";
        imgcontainer.appendChild(language);
  
        let release = document.createElement("p");
        release.textContent = "Release Date: " + movie.release_date;
        release.style.textAlign = "center";
        release.style.color = "black";
        imgcontainer.appendChild(release);
  
        let rating = document.createElement("p");
        rating.textContent = "Rating: " + movie.vote_average + " / 10";
        rating.style.textAlign = "center";
        rating.style.color = "black";
        imgcontainer.appendChild(rating);
  
        moviesContainer.appendChild(imgcontainer);
  
        postMovieForm.reset();
        postMovieModal.classList.add("hidden");
      } else {
        console.error("Failed to add movie:", request.responseText);
      }
    };
  
    request.send(JSON.stringify(newMovie));
  });

    let searchInput = document.querySelector("input[placeholder='Search for Movies, Events, Plays, Sports and Activities']");
    let searchButton = document.querySelector("button.bg-red-600");
    let searchPopup = document.getElementById("searchPopup");
    let searchResults = document.getElementById("searchResults");
    let closeSearchPopup = document.getElementById("closeSearchPopup");
  
    function performSearch(query) {
      if (query) {
        let request = new XMLHttpRequest();
        let url = `https://mimic-server-api.vercel.app/movies?q=${query}`;
        request.open("GET", url);
        request.onload = function () {
          if (request.status === 200) {
            let data = JSON.parse(request.responseText);
            searchResults.innerHTML = "";
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let movie = data[i];
  
                let li = document.createElement("li");
                li.style.marginBottom = "10px";
  
                let title = document.createElement("h3");
                title.textContent = `Title: ${movie.title}`;
                title.style.fontWeight = "bold";
  
                let language = document.createElement("p");
                language.textContent = `Language: ${movie.original_language}`;
  
                let releaseDate = document.createElement("p");
                releaseDate.textContent = `Release Date: ${movie.release_date}`;
  
                let rating = document.createElement("p");
                rating.textContent = `Rating: ${movie.vote_average} / 10`;
  
                let genreMapping = {
                  28: "Action",
                  80: "Crime",
                  53: "Thriller",
                  18: "Drama",
                  10751: "Family",
                  35: "Comedy",
                  12: "Adventure",
                  14: "Fantasy",
                  36: "History",
                  10749: "Romance",
                };
  
                let genreNames = [];
                for (let j = 0; j < movie.genre_ids.length; j++) {
                  let genreId = movie.genre_ids[j];
                  if (genreMapping[genreId]) {
                    genreNames.push(genreMapping[genreId]);
                  }
                }
  
                let genres = document.createElement("p");
                genres.textContent = `Genres: ${genreNames.join(", ")}`;
  
                let poster = document.createElement("img");
                poster.src = movie.poster_path;
                poster.style.width = "100px";
                poster.style.height = "150px";
                poster.style.marginTop = "10px";
  
                li.appendChild(title);
                li.appendChild(language);
                li.appendChild(releaseDate);
                li.appendChild(rating);
                li.appendChild(genres);
                li.appendChild(poster);
  
                searchResults.appendChild(li);
              }
              searchPopup.classList.remove("hidden");
            } else {
              searchResults.innerHTML = "<li>No results found</li>";
              searchPopup.classList.remove("hidden");
            }
          } else {
            console.error("Failed to fetch search results");
          }
        };
        request.onerror = function () {
          console.error("Network error occurred");
        };
        request.send();
      }
    }
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let query = searchInput.value.trim();
        performSearch(query);
      }
    });
  
    searchButton.addEventListener("click", () => {
      let query = searchInput.value.trim();
      performSearch(query);
    });
  
    closeSearchPopup.addEventListener("click", () => {
      searchPopup.classList.add("hidden");
});
