
var searchInput = document.querySelector('.dish-input');
// var button = document.querySelector('.search');
// // button.addEventListener('click', handleSearchSubmit);

var formSelector = document.querySelector('form');
formSelector.addEventListener('submit', handleSearchSubmit);

var resultsContainer = document.querySelector('.results');

var container = document.querySelector('.container');
var body = document.querySelector('body');

var header = document.querySelector('header');

var homeButton = document.querySelector('.home');

function getRecipesBySearchTerm(searchTerm) {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.edamam.com/search?q=' + searchTerm + '&app_id=fded7f13&app_key=fe0290905c896adb657df2abeca75626');
  request.responseType = 'json';
  request.addEventListener('load', function () {
    var data = request.response;

    for (var i = 0; i < data.hits.length; i++) {
      createElement(data.hits[i]);
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
});

function createElement(obj) {

  var resultHolder = document.createElement('div');
  resultHolder.setAttribute('class', 'result-holder');
  var photoDiv = document.createElement('div');
  photoDiv.style.backgroundImage = 'url(' + obj.recipe.image + ')';
  photoDiv.setAttribute('class', 'results-photo-div');
  resultHolder.appendChild(photoDiv);
  var dishName = document.createElement('h1');
  dishName.innerHTML = obj.recipe.label;
  resultHolder.appendChild(dishName);

  resultsContainer.appendChild(resultHolder);

}
