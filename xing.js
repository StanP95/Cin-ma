const key = '402c0814';

let searchInput = document.getElementById('Input');
let displaySearchList = document.getElementsByClassName('fav-container')[0]; // Corrige la sélection de la première instance
const fetchMoviesContainer = document.getElementById("f");

// Vérifier si l'élément searchInput existe avant d'ajouter l'écouteur d'événement
for (let elem of [searchInput]) {
    elem?.addEventListener('input', findMovies);
}

// Requête initiale pour obtenir les données d'un film spécifique
fetch('http://www.omdbapi.com/?i=tt3896198&apikey=402c0814')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching movie:', error));

// Fonction pour afficher un film spécifique
async function singleMovie() {
    let urlQueryParams = new URLSearchParams(window.location.search);
    let id = urlQueryParams.get('id');
    
    for (let param of [id]) {
        let url = `https://www.omdbapi.com/?i=${param}&apikey=${key}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            console.log(url);

            let output = `
                <div class="movie-poster">
                    <img src=${data.Poster} alt="Movie Poster">
                </div>
                <div class="movie-details">
                    <div class="details-header">
                        <div class="dh-ls">
                            <h2>${data.Title}</h2>
                        </div>
                        <div class="dh-rs">
                            <i class="fa-solid fa-bookmark" onClick="addTofavorites('${param}')" style="cursor: pointer;"></i>
                        </div>
                    </div>
                    <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                                style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
                    <ul class="details-ul">
                        <li><strong>Actors: </strong>${data.Actors}</li>
                        <li><strong>Director: </strong>${data.Director}</li>
                        <li><strong>Writers: </strong>${data.Writer}</li>
                    </ul>
                    <ul class="details-ul">
                        <li><strong>Genre: </strong>${data.Genre}</li>
                        <li><strong>Release Date: </strong>${data.DVD}</li>
                        <li><strong>Box Office: </strong>${data.BoxOffice}</li>
                        <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
                    </ul>
                    <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
                    <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
                        <i class="fa-solid fa-award"></i>
                        &thinsp; ${data.Awards}
                    </p>
                </div>
            `;
            document.querySelector('.movie-container').innerHTML = output;
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
}

// Fonction pour afficher la liste des films
async function displayMovieList(movies) {
    let output = '';
    for (let i of movies) {
        let img = (i.Poster !== 'N/A') ? i.Poster : 'img/blank-poster.webp';
        let id = i.imdbID;

        output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                            <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                        </div>
                        <div>
                            <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick="addTofavorites('${id}')"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // Utiliser une boucle pour s'assurer que displaySearchList est défini
    for (let container of [displaySearchList]) {
        container.innerHTML = output;
    }
    console.log("here is movie list ..", movies);
}

// Fonction pour rechercher des films
async function findMovies() {
    const query = searchInput.value.trim();
    for (let q of [query]) {
        let url = `https://www.omdbapi.com/?s=${q}&page=1&apikey=${key}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            for (let searchResult of [data.Search]) {
                displayMovieList(searchResult);
            }
        } catch (error) {
            console.error('Error fetching movie list:', error);
        }
    }
}
