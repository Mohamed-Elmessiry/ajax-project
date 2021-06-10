/* exported data */
var data = {
  favorites: []
};

var previousFavorites = localStorage.getItem('favorites');
if (previousFavorites !== null) {
  data = JSON.parse(previousFavorites);
}

window.addEventListener('beforeunload', strignifynStore);

function strignifynStore(event) {
  var dataJson = JSON.stringify(data);
  localStorage.setItem('favorites', dataJson);
}
