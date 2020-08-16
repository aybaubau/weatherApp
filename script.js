$("#city-search").on("submit", function(event) {
  event.preventDefault();
  var city = $('#city-input').serialize();
  var currentConditions = `api.openweathermap.org/data/2.5/weather?q=${city}&appid=db4ee215f9a9ef59e9a5d2bf7c56adf9`;
  var forecast = `api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=5&appid=db4ee215f9a9ef59e9a5d2bf7c56adf9`;

    $.ajax({
      url: currentConditions,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      // $('#city').text()

    }
    )});




    // $.ajax({
    //     url: forecast,
    //     method: "GET"
    //   }).then(function(response) {

    //   }
