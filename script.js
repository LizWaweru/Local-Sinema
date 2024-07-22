const fetchUrl = "https://deploy-nine-rosy.vercel.app/movies";

let allMovies = [];

// Fetch movie data from the API and populate the sidebar and display top movies on initial load
fetch(fetchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            allMovies = data;
            populateCategories(allMovies);
            displayTopMovies(allMovies);  // display top movies
        } else {
            throw new Error('Invalid data structure: Expected an object with a "movies" property');
        }
    })
    .catch(error => {
        console.error('Error fetching movie data:', error);
    });

// Function to populate categories into the sidebar
function populateCategories(categories) {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = ''; // Clear previous content

    categories.forEach(categoryObj => {
        const category = categoryObj.category;
        const categoryItem = document.createElement('li');
        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryLink.addEventListener('click', () => displayCategoryMovies(category, categoryObj.items));
        categoryItem.appendChild(categoryLink);
        categoryList.appendChild(categoryItem);
    });
}

// Function to display movies of a specific category
function displayCategoryMovies(category, movies) {
    const movieDetails = document.getElementById('movieDetails');
    const categoryTitle = document.getElementById('categoryTitle');
    movieDetails.innerHTML = ''; // Clear previous content
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Movies';

    if (movies.length > 0) {
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title} poster">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
                <a href="${movie.trailer}" target="_blank">Watch Trailer</a>
            `;
            movieDetails.appendChild(movieElement);
        });
    } else {
        movieDetails.innerHTML = '<p>No movies found for this category.</p>';
    }
}

// Function to filter and display top movies (rating > 5)
function displayTopMovies(categories) {
    const topMovies = [];

    categories.forEach(categoryObj => {
        const topMoviesInCategory = categoryObj.items.filter(movie => {
            const rating = parseFloat(movie.Rate) || 0;
            return rating > 5;
        });

        if (topMoviesInCategory.length > 0) {
            topMovies.push({
                category: categoryObj.category,
                items: topMoviesInCategory
            });
        }
    });

    const topMoviesSection = document.getElementById('movieDetails');
    const categoryTitle = document.getElementById('categoryTitle');
    topMoviesSection.innerHTML = ''; // Clear previous content
    categoryTitle.textContent = 'Top Movies';

    topMovies.forEach(categoryObj => {
        const categorySection = document.createElement('div');
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoryObj.category.charAt(0).toUpperCase() + categoryObj.category.slice(1) + ' Top Movies';
        categorySection.appendChild(categoryTitle);

        categoryObj.items.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title} poster">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
                <a href="${movie.trailer}" target="_blank">Watch Trailer</a>
            `;
            categorySection.appendChild(movieElement);
        });

        topMoviesSection.appendChild(categorySection);
    });
}

// Function to filter and display latest movies (based on release date)
function displayLatestMovies(categories) {
    const latestMovies = [];

    categories.forEach(categoryObj => {
        const latestMoviesInCategory = categoryObj.items.filter(movie => {
            const currentYear = new Date().getFullYear();
            return parseInt(movie.release_date, 10) === currentYear;
        });

        if (latestMoviesInCategory.length > 0) {
            latestMovies.push({
                category: categoryObj.category,
                items: latestMoviesInCategory
            });
        }
    });

    const latestMoviesSection = document.getElementById('movieDetails');
    const categoryTitle = document.getElementById('categoryTitle');
    latestMoviesSection.innerHTML = ''; // Clear previous content
    categoryTitle.textContent = 'Latest Movies';

    latestMovies.forEach(categoryObj => {
        const categorySection = document.createElement('div');
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoryObj.category.charAt(0).toUpperCase() + categoryObj.category.slice(1) + ' Latest Movies';
        categorySection.appendChild(categoryTitle);

        categoryObj.items.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title} poster">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
                <a href="${movie.trailer}" target="_blank">Watch Trailer</a>
            `;
            categorySection.appendChild(movieElement);
        });

        latestMoviesSection.appendChild(categorySection);
    });
}

// Search functionality
document.getElementById('searchForm').addEventListener('submit', event => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const query = document.getElementById('movieSearch').value.trim().toLowerCase();
    const movieDetails = document.getElementById('movieDetails');
    const categoryTitle = document.getElementById('categoryTitle');
    
    movieDetails.innerHTML = ''; // Clear previous content
    categoryTitle.textContent = 'Search Results';

    // Flatten the movies array to search through all movies
    const allMoviesFlattened = allMovies.flatMap(categoryObj => categoryObj.items);

    // Filter movies based on the search query
    const filteredMovies = allMoviesFlattened.filter(movie => 
        movie.title.toLowerCase().includes(query)
    );

    // Display filtered movies if any
    if (filteredMovies.length > 0) {
        filteredMovies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title} poster">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
                <a href="${movie.trailer}" target="_blank">Watch Trailer</a>
            `;
            movieDetails.appendChild(movieElement);
        });
    } else {
        movieDetails.innerHTML = '<p>No movies found for the search.</p>';
    }
});

// Event listeners for Top Movies and Latest Movies buttons
document.getElementById('topMoviesBtn').addEventListener('click', () => {
    displayTopMovies(allMovies);
});

document.getElementById('latestMoviesBtn').addEventListener('click', () => {
    displayLatestMovies(allMovies);
});