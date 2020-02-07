$(document).ready(function() {
    var date = moment().format("MM/DD/YYYY");
    var APIKey = "4c10f574a6e568cd7ff7c586d271e484";
    // initialize myCitiees array
    var myCities = JSON.parse(localStorage.getItem('myCities'));
    if(myCities===null){
        var myCities = [];
        localStorage.setItem("myCities", JSON.stringify(myCities));
    } else {
        var cityName = firstUpper(myCities[0]);
        getCityInfo(cityName);
        displayHistory();
        display5Day(cityName);
    }

    // search button click
    $("button").on("click", function(event) {
        if($(this).attr("type") === "submit") {
            event.preventDefault();
            cityName = $(".city-search").val().trim().toLowerCase();
            myCities.push(cityName);
            localStorage.setItem("myCities", JSON.stringify(myCities));
            console.log(cityName);
            cityName = firstUpper(cityName);
            getCityInfo(cityName);
            display5Day(cityName);
        }
    })
    // history button click
    $("button").on("click", function(event) {
        if($(this).attr("type") === "city") {
            event.preventDefault();
            cityName = $(this).data("city");
            console.log(cityName);
            cityName = firstUpper(cityName);
            getCityInfo(cityName);
            display5Day(cityName);
        }
    })

    function display5Day(cityName) {
        $("#5-day").empty();
        var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function(r) {
            for(i = 0; i < 5; i++) {
                // create and append new div
                var newDiv = $("<div>").addClass("col-md-2 forecast day" + i);
                var w = (i * 8) + 5;
                $("#5-day").append(newDiv);
                // set and append new date 
                var date5 = moment().add(i + 1, 'days').format("MM/DD/YYYY");
                var newDate = $("<p>").addClass("date-5 small").text(date5);
                $(".day" + i).append(newDate);
                // set main weather icon
                var icon5 = r.list[w].weather[0].icon;
                var iconURL5 = "http://openweathermap.org/img/wn/" + icon5 + "@2x.png";
                var iconImage5 = $("<img>").attr("src", iconURL5);
                $(".day" + i).append(iconImage5);
                // set humidity
                var newHumidity = $("<p>").addClass("humidity-5 small").text("Humidity: " + r.list[w].main.humidity + "%");
                $(".day" + i).append(newHumidity);
                // set temperature in degrees F
                var temp5 = (r.list[w].main.temp - 273.15) * 1.8 + 32;
                var newTemp = $("<p>").addClass("temperature-5 small").text("Temp: " + Number(temp5).toFixed(2) + " °F");
                $(".day" + i).append(newTemp);
            }    
        })
    }
    function displayHistory() {
        $(".history").empty();
        if(myCities.length < 8) {
            for(i = 0; i < myCities.length; i++) {
                newBtn = $("<button>").text(firstUpper(myCities[i])).attr("data-city", myCities[i]).addClass("btn space").attr("type", "city");
                newLi = $("<li>");
                $(".history").append(newLi);
                newLi.append(newBtn);
            }
        } else {
            for(i = 0; i < 8; i++) {
            newBtn = $("<button>").text(firstUpper(myCities[i])).attr("data-city", myCities[i]).addClass("btn space").attr("type", "city");
            newLi = $("<li>");
            $(".history").append(newLi);
            newLi.append(newBtn);
            }
        }
    }
    function firstUpper(str) {
        var stri = str.charAt(0).toUpperCase() + str.substr(1);
        return stri
    }
    function getCityInfo(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        $(".city-name").text(cityName + " (" + date + ")");
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            //   set wind speed
            $(".wind-speed").text("Wind Speed: " + Number(response.wind.speed * 2.236936).toFixed(2) + " mph");
            // set humidity
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            // set temperature in degrees F
            var temp = (response.main.temp - 273.15) * 1.8 + 32;
            $(".temperature").text("Temperature: " + Number(temp).toFixed(2) + " °F");
            // record lat and lon for use in UV-index ajax call
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            // set main weather icon
            var icon = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            var iconImage = $("<img>").attr("src", iconURL);
            $(".city-name").append(iconImage);
            // create uv index url for ajax call
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
            // make uv index ajax call
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(res) {
                //   set UV index
                $(".uv-index").text("UV-Index: " + res[0].value);
            });
        
        });
    }
})