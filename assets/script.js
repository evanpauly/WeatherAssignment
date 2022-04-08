search = $('#search')
currentTime = $('#current-time').text(moment().format('L'))
var icon = 'http://openweathermap.org/img/wn/'
city = $('#city').val()
var cityName = city
var history = (localStorage.getItem("last-city"));

$(document).ready(function pageLoad() {

    var history = (localStorage.getItem("last-city"));
    var searchHistory = $("<button id='last-search class='btn'>").text(history)
    var searchP = $("<div>");
    searchP.append(searchHistory)
    $("#search-form").append(searchP);

});

$('#search').click(function getWeather(event) {
    event.preventDefault();

    $('#weather-container').empty()
    $('#forecast').empty()

    var selectedCity = $('#city').val()
    var api = 'https://api.openweathermap.org/data/2.5/onecall?q=' +selectedCity+ '&units=imperial&appid=dde58f68314faeaa7da575df7ce45ca0';

    fetch(api)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {

        var name = $('<h3>').text(data.name)
        $('#weather-container').append(name)

        var date = $('<h3>').text(moment.unix(data.dt).format('MM/DD/yyyy'))
        date.val('')
        $('#weather-container').append(date)

        var icon = $('<img>').attr('src', icon + data.weather[0].icon + '.png')
        var icon = icon.attr('style', "height: 50px, width: 30px")
        $('#weather-container').append(icon)

        var temp = $('<h3>').text("Temp: " + data.main.temp)
        $('#weather-container').append(temp)

        var wind = $('<h3>').text("wind: " + data.wind.speed)
        $('#weather-container').append(wind)

        var humidity = $('<h3>').text("Humidity: " + data.main.humidity)
        $('#weather-container').append(humidity)

        getUvi(data.coord.lat, data.coord.lon);

        localStorage.setItem("city", selectedCity)

    })

});

function getUvi(lat, lon) {
    var call = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=dde58f68314faeaa7da575df7ce45ca0'

    fetch(call)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        var uvi = $('<h3>').text("UV Index: " + data.current.uvi)
        $('#weather-container').append(uvi)

        for (var i = 0; i < 5; i++) {

            var temp = data.daily[i].temp.day
            var humidity = data.daily[i].humidity
            var pic = data.daily[i].weather[0].pic
            var unixTime = data.daily[i].dt;
            var date = new Date(unixTime * 1000);
            var date = (date.toLocaleDateString("en-US"));

            var dailyWeather = $("<div class='card'>");
            var todayDate = $("<h3 class='card'>").text(date);
            var todayTemp = $("<p class='card'>").text("Temp: " + temp);
            var todayHumidity = $("<p class='card'>").text("Humidity: " + humidity);
            var icon = $('<img>').attr('src', icon + pic + '.png')
            var icon = icon.attr('style', "height: 50px, width: 30px")

            dailyWeather.append(todayDate);
            dailyWeather.append(todayTemp);
            dailyWeather.append(todayHumidity);
            dailyWeather.append(icon);
            $("#forecast").append(dailyWeather);

        }
    })
}