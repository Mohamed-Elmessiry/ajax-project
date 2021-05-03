/* global data */
/* exported data */

var searchInput = document.querySelector('.dish-input');

var formSelector = document.querySelector('form');
formSelector.addEventListener('submit', handleSearchSubmit);

var resultsContainer = document.querySelector('.results');

var container = document.querySelector('.container');
var body = document.querySelector('body');

var header = document.querySelector('header');

var homeButton = document.querySelector('.home');

var dataArray = [];

function getRecipesBySearchTerm(searchTerm) {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.edamam.com/search?q=' + searchTerm + '&app_id=fded7f13&app_key=fe0290905c896adb657df2abeca75626');
  request.responseType = 'json';
  request.addEventListener('load', function () {
    dataArray = request.response;

    for (var i = 0; i < dataArray.hits.length; i++) {
      resultsContainer.appendChild(createElement(dataArray.hits[i]));
    }

  });
  request.send();
}

function handleSearchSubmit() {
  getRecipesBySearchTerm(searchInput.value);
  event.preventDefault();
  container.className = 'hidden';
  body.className = 'body-active';
  header.className = 'header-active';
  resultsContainer.className = 'results';

}

homeButton.addEventListener('click', function () {
  container.className = 'container';
  body.className = 'body';
  header.className = 'header';
  resultsContainer.className = 'hidden';
  singleResultDiv.className = 'hidden';
  favoritesContainer.className = 'favorites hidden';

});

function createElement(obj) {

  var resultHolder = document.createElement('div');
  resultHolder.setAttribute('class', 'result-holder');
  var photoDiv = document.createElement('div');
  photoDiv.style.backgroundImage = 'url(' + obj.recipe.image + ')';
  photoDiv.setAttribute('class', 'results-photo-div');
  photoDiv.setAttribute('id', obj.recipe.label);
  resultHolder.appendChild(photoDiv);
  var dishName = document.createElement('h1');
  dishName.setAttribute('class', 'dish-name');
  dishName.innerHTML = obj.recipe.label;
  resultHolder.appendChild(dishName);

  return resultHolder;

}

var singleResultDiv = document.querySelector('.single-result');

function createDomTree(hit) {
  var singleResultHolder = document.createElement('div');
  singleResultHolder.setAttribute('class', 'result-holder-single');
  var image = document.createElement('div');
  image.setAttribute('class', 'results-photo-div');
  image.style.backgroundImage = 'url(' + hit.recipe.image + ')';
  singleResultHolder.appendChild(image);

  var textContentHolder = document.createElement('div');
  textContentHolder.className = 'text-content-holder';
  singleResultHolder.appendChild(textContentHolder);

  var dishName = document.createElement('h1');
  dishName.className = 'dish-name';
  dishName.textContent = hit.recipe.label;
  textContentHolder.appendChild(dishName);
  var ingredientsLabel = document.createElement('h4');
  ingredientsLabel.className = 'ingredients-heading';
  ingredientsLabel.textContent = 'Ingredients';
  textContentHolder.appendChild(ingredientsLabel);
  var ingredientsList = document.createElement('ul');
  ingredientsList.className = 'list-holder';
  textContentHolder.appendChild(ingredientsList);
  for (var k = 0; k < hit.recipe.ingredientLines.length; k++) {
    var ingredientsContent = document.createElement('li');
    ingredientsContent.textContent = hit.recipe.ingredientLines[k];
    ingredientsList.appendChild(ingredientsContent);
    ingredientsContent.className = 'list-element';
  }
  var buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('class', 'buttons-holder');
  textContentHolder.appendChild(buttonDiv);
  var fullRecipeButton = document.createElement('a');
  fullRecipeButton.value = 'View Full Recipe';
  fullRecipeButton.textContent = 'View Full Recipe';
  fullRecipeButton.className = 'view-full-recipe';
  fullRecipeButton.setAttribute('href', hit.recipe.url);
  buttonDiv.appendChild(fullRecipeButton);
  var saveButton = document.createElement('button');
  saveButton.textContent = 'Save to Favourties';
  saveButton.className = 'save-to-favorites';
  buttonDiv.appendChild(saveButton);
  saveButton.addEventListener('click', function save() {
    var listItemsSelector = document.querySelectorAll('.list-element');
    var values = {
      photo: image.style.backgroundImage,
      dish: dishName.textContent,
      ingredients: [],
      link: fullRecipeButton.href

    };
    for (var i = 0; i < listItemsSelector.length; i++) {
      values.ingredients.push(listItemsSelector[i].textContent);

    }
    data.favorites.unshift(values);

  });

  return singleResultHolder;

}

resultsContainer.addEventListener('click', function SingleDishDisplay(event) {
  if (event.target.matches('.results-photo-div')) {
    for (var i = 0; i < dataArray.hits.length; i++) {
      if (dataArray.hits[i].recipe.label === event.target.getAttribute('id')) {
        resultsContainer.className = 'hidden';

        singleResultDiv.appendChild(createDomTree(dataArray.hits[i]));
      }
    }

  }
});

var favoritesButton = document.querySelector('.favorites-button');
favoritesButton.addEventListener('click', function () {
  singleResultDiv.className = 'single-result hidden';
  container.className = 'container hidden';
  body.className = 'body-active';
  resultsContainer.className = 'results hidden';
  header.className = 'header-active';
  favoritesContainer.className = 'favorites';

  createFavorites(data);
});
var favoritesContainer = document.querySelector('.favorites');

function displayFavorites(obj) {
  var favoritesDiv = document.createElement('div');
  favoritesDiv.setAttribute('class', 'favorites-div');
  var photo = document.createElement('div');
  photo.className = 'favorites-photo';
  photo.style.backgroundImage = obj.photo;
  photo.setAttribute('id', obj.dish);
  favoritesDiv.appendChild(photo);
  var dish = document.createElement('h1');
  dish.textContent = obj.dish;
  favoritesDiv.appendChild(dish);

  return favoritesDiv;

  // favoritesContainer.appendChild(favoritesDiv);

}

function createFavorites(favoritesObject) {
  for (var i = 0; i < favoritesObject.favorites.length; i++) {
    favoritesContainer.appendChild(displayFavorites(data.favorites[i]));

  }
}

var singleDiv = document.querySelector('.single-favorite');

favoritesContainer.addEventListener('click', function () {
  if (event.target.matches('.favorites-photo')) {
    for (var i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].dish === event.target.getAttribute('id')) {
        singleDiv.appendChild(createSingleFavorite(data.favorites[i]));

      }

    }
  }

});

function createSingleFavorite(fav) {
  var singleFavHolder = document.createElement('div');
  singleFavHolder.setAttribute('class', 'fav-holder-single');
  var singleFavImage = document.createElement('div');
  singleFavImage.setAttribute('class', 'single-fav-image');
  singleFavImage.style.backgroundImage = 'url(' + fav.photo + ')';
  singleFavHolder.appendChild(singleFavImage);
  var favDishName = document.createElement('h1');
  favDishName.setAttribute('class', 'dish-name');
  favDishName.textContent = fav.dish;
  singleFavHolder.appendChild(favDishName);

  var textDiv = document.createElement('div');
  textDiv.setAttribute('class', 'text-div');
  singleFavHolder.appendChild(textDiv);
  var ingredientsLabel = document.createElement('h4');
  ingredientsLabel.className = 'ingredients-heading';
  ingredientsLabel.textContent = 'Ingredients';
  textDiv.appendChild(ingredientsLabel);

  var ingredientsList = document.createElement('ul');
  ingredientsList.className = 'list-holder';
  textDiv.appendChild(ingredientsList);
  for (var k = 0; k < fav.ingredients.length; k++) {
    var ingredientElement = document.createElement('li');
    ingredientElement.textContent = fav.ingredients[k];
    ingredientsList.appendChild(ingredientElement);
  }

  var notesHeading = document.createElement('h4');
  notesHeading.textContent = 'Notes';
  textDiv.appendChild(notesHeading);
  var buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('class', 'button-div');
  singleFavHolder.appendChild(buttonDiv);
  var addNote = document.createElement('a');
  addNote.textContent = 'Add New Notes';
  addNote.className = 'add-notes';

}
