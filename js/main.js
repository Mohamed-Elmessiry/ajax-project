
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
      createElement(dataArray.hits[i]);
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

  resultsContainer.appendChild(resultHolder);

}

var singleResultDiv = document.querySelector('.single-result');

resultsContainer.addEventListener('click', function (event) {
  if (event.target.matches('.results-photo-div')) {
    for (var i = 0; i < dataArray.hits.length; i++) {
      if (dataArray.hits[i].recipe.label === event.target.getAttribute('id')) {
        resultsContainer.className = 'hidden';
        var singleResultHolder = document.createElement('div');
        singleResultHolder.setAttribute('class', 'result-holder-single');
        var image = document.createElement('div');
        image.setAttribute('class', 'results-photo-div');
        image.style.backgroundImage = 'url(' + dataArray.hits[i].recipe.image + ')';
        singleResultHolder.appendChild(image);
        var dishName = document.createElement('h1');
        dishName.className = 'dish-name';
        dishName.textContent = dataArray.hits[i].recipe.label;
        singleResultHolder.appendChild(dishName);
        var ingredientsLabel = document.createElement('h4');
        ingredientsLabel.className = 'ingredients-heading';
        ingredientsLabel.textContent = 'Ingredients';
        singleResultHolder.appendChild(ingredientsLabel);
        var ingredientsList = document.createElement('ul');
        ingredientsList.className = 'list-holder';
        singleResultHolder.appendChild(ingredientsList);
        for (var k = 0; k < dataArray.hits[i].recipe.ingredientLines.length; k++) {
          var ingredientsContent = document.createElement('li');
          ingredientsContent.textContent = dataArray.hits[i].recipe.ingredientLines[k];
          ingredientsList.appendChild(ingredientsContent);
          ingredientsContent.className = 'list-element';
        }
        var buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('class', 'buttons-holder');
        singleResultHolder.appendChild(buttonDiv);
        var fullRecipeButton = document.createElement('button');
        fullRecipeButton.value = 'View Full Recipe';
        fullRecipeButton.textContent = 'View Full Recipe';
        fullRecipeButton.className = 'view-full-recipe';
        fullRecipeButton.addEventListener('click', function () {
          document.location = dataArray.hits[i].recipe.url;
        });
        buttonDiv.appendChild(fullRecipeButton);
        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save to Favourties';
        saveButton.className = 'save-to-favorites';
        buttonDiv.appendChild(saveButton);

        singleResultDiv.appendChild(singleResultHolder);
      }
    }

  }
});
