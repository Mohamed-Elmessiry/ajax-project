
var searchInput = document.querySelector('.dish-input');

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
  var ingredientsHeading = document.createElement('h4');
  ingredientsHeading.innerHTML = 'Ingredients';
  ingredientsHeading.className = 'ingredients-heading hidden';
  resultHolder.appendChild(ingredientsHeading);
  var ingredientsHolder = document.createElement('ul');
  resultHolder.appendChild(ingredientsHolder);
  ingredientsHolder.className = 'list-holder hidden';

  for (var i = 0; i < obj.recipe.ingredientLines.length; i++) {
    var listElement = document.createElement('li');
    listElement.innerHTML = obj.recipe.ingredientLines[i];
    ingredientsHolder.appendChild(listElement);
    listElement.className = 'list-element hidden';
  }
  var buttonsHolder = document.createElement('div');
  buttonsHolder.className = 'buttons-holder hidden';

  resultHolder.appendChild(buttonsHolder);

  var fullRecipeButton = document.createElement('button');
  fullRecipeButton.value = 'View Full Recipe';
  fullRecipeButton.textContent = 'View Full Recipe';
  fullRecipeButton.className = 'view-full-recipe';
  fullRecipeButton.addEventListener('click', function () {
    document.location = obj.recipe.url;
  });
  buttonsHolder.appendChild(fullRecipeButton);

  var saveButton = document.createElement('button');
  saveButton.textContent = 'Save to Favourties';
  saveButton.className = 'save-to-favorites';
  buttonsHolder.appendChild(saveButton);

  resultsContainer.appendChild(resultHolder);

}

var resultsHeading = document.querySelector('.results-heading');

resultsContainer.addEventListener('click', function (event) {
  if (event.target.matches('.results-photo-div')) {
    var clickedResult = event.target.closest('.result-holder');
    var resultHolders = document.querySelectorAll('.result-holder');
    var ingredientsTitle = document.querySelector('.ingredients-heading');
    var ingredientsListHolder = document.querySelector('.list-holder');
    var ingredientsText = document.querySelectorAll('.list-element');
    var buttonsContainer = document.querySelector('.buttons-holder');
    var photoDivSelector = document.querySelector('.results-photo-div');

    for (var i = 0; i < resultHolders.length; i++) {
      if (resultHolders[i] === clickedResult) {
        resultHolders[i].className = 'result-holder';
        ingredientsTitle.className = 'ingredients-heading';
        ingredientsListHolder.className = 'list-holder';
        for (var k = 0; k < ingredientsText.length; k++) {
          ingredientsText[k].className = 'list-element';
        }
        buttonsContainer.className = 'buttons-holder';
        resultsHeading.className = 'results-heading hidden';
        photoDivSelector.className = 'results-photo-div-adjusted';

      } else {
        resultHolders[i].className = 'hidden';
      }
    }
  }
});
