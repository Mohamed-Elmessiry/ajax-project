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
    var resultsHeading = document.createElement('h2');
    resultsHeading.setAttribute('class', 'results-heading');
    resultsHeading.innerHTML = 'Results';
    resultsContainer.appendChild(resultsHeading);
    if (dataArray.hits.length > 0) {
      for (var i = 0; i < dataArray.hits.length; i++) {
        resultsContainer.appendChild(createElement(dataArray.hits[i]));
      }
    } else {
      resultsContainer.appendChild(noResults('No results available to display'));
    }

  });
  request.send();
}

function noResults(message) {
  var noResultsMessage = document.createElement('p');
  noResultsMessage.setAttribute('class', 'noResult');
  noResultsMessage.innerHTML = message;
  return noResultsMessage;
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
  resultsContainer.className = 'results hidden';
  singleResultDiv.className = 'hidden';
  favoritesContainer.className = 'favorites hidden';
  singleDiv.className = 'single-favorite hidden';
  resultsContainer.innerHTML = '';
  if (singleResultHolder) {
    singleResultHolder.remove();
  }

  clearFavorites();

});

function clearFavorites() {
  var allFavDivs = document.querySelectorAll('.favorites-div');
  for (var i = 0; i < allFavDivs.length; i++) {
    allFavDivs[i].remove();
  }

}

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

var singleResultHolder = null;

function createDomTree(hit) {
  singleResultHolder = document.createElement('div');
  singleResultHolder.setAttribute('class', 'result-holder-single');
  singleResultDiv.classList.remove('hidden');
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

    for (var i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].dish === dishName.textContent) {
        return;
      }

    }
    var listItemsSelector = document.querySelectorAll('.list-element');
    var values = {
      photo: image.style.backgroundImage,
      dish: dishName.textContent,
      ingredients: [],
      link: fullRecipeButton.href

    };
    for (var k = 0; k < listItemsSelector.length; k++) {
      values.ingredients.push(listItemsSelector[k].textContent);

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
  // singleDiv.className = 'single-favorite hidden';

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

}

function createFavorites(favoritesObject) {
  if (favoritesObject.favorites.length > 0) {
    for (var i = 0; i < favoritesObject.favorites.length; i++) {
      favoritesContainer.appendChild(displayFavorites(data.favorites[i]));
    }
  } else {
    favoritesContainer.appendChild(noResults('No favorites available to display'));
  }
}

var singleDiv = document.querySelector('.single-favorite');
var currentFavoriteDish = null;

favoritesContainer.addEventListener('click', function () {

  if (event.target.matches('.favorites-photo')) {
    var favDiv = document.querySelector('.fav-holder-single');
    if (favDiv) {
      favDiv.remove();
    }

    for (var i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].dish === event.target.getAttribute('id')) {

        currentFavoriteDish = data.favorites[i];
        if (!currentFavoriteDish.notes) {
          currentFavoriteDish.notes = [];
        }
        singleDiv.appendChild(createSingleFavorite(currentFavoriteDish));
      }

    }
    favoritesContainer.className = 'favorites hidden';
  }

});

var singleFavHolder = null;

function createSingleFavorite(fav) {

  singleFavHolder = document.createElement('div');
  singleFavHolder.setAttribute('class', 'fav-holder-single');
  var favtag = document.createElement('h3');
  favtag.setAttribute('class', 'favorites-tag');
  favtag.innerHTML = 'Favorites';
  singleFavHolder.appendChild(favtag);
  var singleFavImage = document.createElement('div');
  singleFavImage.setAttribute('class', 'results-photo-div');
  singleFavImage.style.backgroundImage = fav.photo;
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
    ingredientElement.setAttribute('class', 'list-element');
    ingredientElement.textContent = fav.ingredients[k];
    ingredientsList.appendChild(ingredientElement);
  }
  var buttonNdivHolder = document.createElement('div');
  buttonNdivHolder.setAttribute('class', 'button-n-div');
  textDiv.appendChild(buttonNdivHolder);
  var notesHeading = document.createElement('h4');
  notesHeading.setAttribute('class', 'notes-heading');
  notesHeading.textContent = 'Notes';
  buttonNdivHolder.appendChild(notesHeading);

  var addNote = document.createElement('a');
  addNote.setAttribute('class', 'add-notes');
  addNote.textContent = 'Add New Notes';
  addNote.addEventListener('click', addNoteClick);
  buttonNdivHolder.appendChild(addNote);

  var notesList = document.createElement('ul');
  notesList.setAttribute('id', 'notes-list');
  singleFavHolder.appendChild(notesList);

  for (var i = 0; i < fav.notes.length; i++) {
    var singleNote = document.createElement('li');
    singleNote.setAttribute('class', 'fav-notes');
    singleNote.textContent = fav.notes[i];
    notesList.appendChild(singleNote);
  }
  return singleFavHolder;

}
function addNoteClick() {

  var divHolder = document.createElement('div');
  divHolder.setAttribute('class', 'notes-holder');

  var divNote = document.createElement('div');
  divNote.setAttribute('class', 'divNote');
  divHolder.appendChild(divNote);
  var closeButtonHolder = document.createElement('div');
  closeButtonHolder.setAttribute('class', 'close-button-holder');
  divNote.appendChild(closeButtonHolder);
  var closeButton = document.createElement('button');
  closeButton.innerHTML = 'x';
  closeButton.setAttribute('class', 'close-button');
  closeButton.addEventListener('click', removeNoteClick);
  closeButtonHolder.appendChild(closeButton);
  var addHeader = document.createElement('h3');
  addHeader.innerHTML = 'Add Note';
  addHeader.setAttribute('class', 'add-header');
  divNote.appendChild(addHeader);
  var ta = document.createElement('textarea');
  ta.setAttribute('id', 'textAreaNote');
  divNote.appendChild(ta);

  var buttonDiv = document.createElement('div');
  divNote.appendChild(buttonDiv);

  var btn = document.createElement('button');
  btn.setAttribute('class', 'save-note-button');
  btn.innerHTML = 'Submit';
  btn.addEventListener('click', saveNoteClick);
  buttonDiv.appendChild(btn);
  document.getElementById('divSingle').appendChild(divHolder);

}
function saveNoteClick() {
  var note = document.getElementById('textAreaNote').value;

  currentFavoriteDish.notes.push(note);
  displayNote(note);
  removeNoteClick();

}

function removeNoteClick() {
  var notesHolder = document.querySelector('.notes-holder');
  notesHolder.remove();

}

function displayNote(note) {
  var notesContainer = document.getElementById('notes-list');
  var singleNote = document.createElement('li');
  singleNote.textContent = note;
  notesContainer.appendChild(singleNote);
}
