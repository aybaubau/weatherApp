var cities = [];
var today = moment().format('L');

function init() {
  if (localStorage.length > 0) {
    cities = JSON.parse(localStorage.getItem('cities'));
    renderButtons(cities);
    var lastCity = localStorage.getItem('lastCity');
    searchCity(lastCity);
  }
};

$("#city-search").on("submit", function (event) {
  var city = $("#city-input").val().trim();
  if ($('#city-input').val() == '') {
    return false;
  } else if (cities.includes(city)) {
    event.preventDefault();
    searchCity(city);
    localStorage.setItem('lastCity', city);
  } else {
    event.preventDefault();
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    renderButtons(cities);
    searchCity(city);
    localStorage.setItem('lastCity', city);
  }
});

function renderButtons(pastSearches) {
  $("#buttons-view").empty();
  // Loops through the array of cities
  for (var i = 0; i < pastSearches.length; i++) {
    // Then dynamicaly generates buttons for each movie in the array
    var a = $("<button>");
    // Adds a class of movie to our button
    a.addClass("city btn btn-light");
    // Added a data-attribute
    a.attr("data-name", pastSearches[i]);
    // Provided the initial button text
    a.text(pastSearches[i]);
    // Added the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}

init();

function searchCity(searchCity) {
  var currentConditions = `http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=db4ee215f9a9ef59e9a5d2bf7c56adf9&units=imperial`;

  $.ajax({
    url: currentConditions,
    method: "GET"
  }).then(function (response) {
    $('#city').html(`${response.name} (${today})`);
    $('#temp').text(`Temperature: ${response.main.temp}`);
    $('#humidity').text(`Humidity: ${response.main.humidity}`);
    $('#wind-speed').text(`Wind Speed: ${response.wind.speed}`);
    var lat = parseInt(response.coord.lat);
    var lon = parseInt(response.coord.lon);
    getCoordWeather(lat, lon);
    })
};

function getCoordWeather(x, y){
var coordWeather = `http://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&
exclude={minutely,hourly}&appid=db4ee215f9a9ef59e9a5d2bf7c56adf9&units=imperial`
$.ajax({
  url: coordWeather,
  method: "GET"
}).then(function(response){
  if (response.current.uvi < 6) {
    $('#uv-index').html(`UV Index: <span class="badge badge-primary">${response.current.uvi}</span>`);
  } else if (response.current.uvi < 8) {
    $('#uv-index').html(`UV Index: <span class="badge badge-warning">${response.current.uvi}</span>`);
  } else {
    $('#uv-index').html(`UV Index: <span class="badge badge-danger">${response.current.uvi}</span>`);
  }
  
  var forecast = response.daily;
  for (i=1; i<6; i++){
    var date = moment().add(i, 'd').format('L');
    const $date = $(`#${i}`).add('<p>').text(date);
    const $figure = $(`#${i}`).add('<figure>');
    const $icon = $figure.add('<img>').attr("src", `http://openweathermap.org/img/wn/${forecast[i].weather[0].icon}@2x.png`);
    $($figure).append($icon);
    const $temp = $(`#${i}`).add('<p>').text('Temp: ' + forecast[i].temp.day);
    const $humidity = $(`#${i}`).add('<p>').text('Humidity: ' + forecast[i].humidity);
    $(`#${i}`).empty();
    $(`#${i}`).append($date);
    $(`#${i}`).append($figure);
    $(`#${i}`).append($temp);
    $(`#${i}`).append($humidity);
  }
})
};

$(".city").on("click", function (event) {
  event.preventDefault();
  var city = $(this).attr("data-name");
  localStorage.setItem('lastCity', city);
  searchCity(city);
});