// $(document).ready(function () {
var cities = [];

function init() {
  if (localStorage.length > 0) {
    cities = JSON.parse(localStorage.getItem('cities'));
    renderButtons(cities);
  }
};


$("#city-search").on("submit", function (event) {
  if ($('#city-input').val() == '') {
    return false;
  }
  event.preventDefault();
  var city = $("#city-input").val().trim();
  console.log(city);
  cities.push(city);
  localStorage.setItem('cities', JSON.stringify(cities));
  renderButtons(cities);
  searchCity(city);
});

// $.ajax({
//   url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`,
//   method: "GET"
// }).then(function (response) {
//   console.log(response);

// $.ajax({
//     url: forecast,
//     method: "GET"
//   }).then(function(response) {

//   }

function renderButtons(pastSearches) {
  $("#buttons-view").empty();
  // Loops through the array of cities
  for (var i = 0; i < pastSearches.length; i++) {
    // Then dynamicaly generates buttons for each movie in the array
    var a = $("<button>");
    // Adds a class of movie to our button
    a.addClass("city");
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
  // var forecast = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${searchCity}&cnt=5&appid=db4ee215f9a9ef59e9a5d2bf7c56adf9&units=imperial`;

  $.ajax({
    url: currentConditions,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $('#city').html(response.name);
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
  console.log(response);
  $('#uv-index').text(`UV Index: ${response.current.uvi}`);
  var forecast = response.daily;
  for (i=1; i<6; i++){
    $(`#${i}`).empty();
    $date = $(`#${i}`).add('<h5>');
    $date.text(moment().get('month') + 1);
    $icon = $(`#${i}`).add('<p>');
    $icon.text(forecast[i].weather[0].main);
    $temp = $(`#${i}`).add('<p>');
    $temp.text(forecast[i].temp.day);
    $humidity = $(`#${i}`).add('<p>');
    $humidity.text = forecast[i].humidity;
    $(`#${i}`).append($icon).append($temp).append($humidity);
  }
})
};

$(".city").on("click", function (event) {
  event.preventDefault();
  var city = $(this).attr("data-name");
  searchCity(city);
});

// });
