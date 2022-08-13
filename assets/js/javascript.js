

$("#find-city").on("click", function (event) {
	event.preventDefault();
	clickBool = true;
	createWeatherData(event);
});

$("#search-history").on("click", function (event) {
	clickBool = true;
	createWeatherData(event);
});

function createWeatherData(event) {
	if (localStorage.length !== 0 && !$("#city-input").val() && !clickBool) {
		var userInputCity = localStorage.getItem(localStorage.length - 1);
	} else if (
		event.target.matches("button") ||
		(event.target.matches("i") && clickBool)
	) {
		event.preventDefault();
		var userInputCity = $("#city-input").val().toLowerCase().trim();
	} else if (event.target.matches("li") && clickBool) {
		var userInputCity = event.target
			.getAttribute("data-city")
			.toLowerCase()
			.trim();
	} else {
		return;
	}

	if (userInputCity === "") {
		return;
	}

	let localStorageBool = false;
	if (localStorage.length === 0) {
		localStorage.setItem(0, userInputCity);
		createSearchHistory();
		localStorageBool = true;
	} else {
		for (let i = 0; i < localStorage.length; i++) {
			if (localStorage.getItem(i) === userInputCity) {
				localStorageBool = true;
			}
		}
	}

	if (!localStorageBool) {
		localStorage.setItem(localStorage.length, userInputCity);
		createSearchHistory();
	}

	let APIKey = "08a1dff9d2cdf2a704a45bae22cd2ff6";

	let queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		userInputCity +
		"&appid=" +
		APIKey;

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		let currentDateUnix = response.dt;
		let currentDateMilliseconds = currentDateUnix * 1000;
		let currentDateConverted = new Date(
			currentDateMilliseconds
		).toLocaleDateString("en-US");

		let currentWeatherIcon = response.weather[0].icon;

		let tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);

		let lat = response.coord.lat;
		let lon = response.coord.lon;

		$(".city-date").text(response.name + " (" + currentDateConverted + ")");
		$(".city-date").append(
			$("<img>").attr({
				src:
					"https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png",
				alt: "icon representation of weather conditions",
			})
		);
		$(".temperature").text("Temperature: " + tempF + "\u00B0F");
		$(".humidity").text("Humidity: " + response.main.humidity + "%");

		$(".wind-speed").text(
			"Wind Speed: " + (response.wind.speed * 2.237).toFixed(1) + " MPH"
		);

		let forecastQueryURL =
			"https://api.openweathermap.org/data/2.5/onecall?lat=" +
			lat +
			"&lon=" +
			lon +
			"&exclude=minutely,hourly&appid=" +
			APIKey;

		$.ajax({
			url: forecastQueryURL,
			method: "GET",
		}).then(function (responseForecast) {
			$(".uv-index").text(responseForecast.daily[0].uvi);

			createUVIndexColor(responseForecast.daily[0].uvi);

			$(".forecast").empty();

			for (let i = 1; i < 6; i++) {
				$(".forecast-date-" + i).append(
					new Date(responseForecast.daily[i].dt * 1000).toLocaleDateString(
						"en-US"
					) + "<br>"
				);

				$(".forecast-" + i).append(
					$("<img>").attr({
						src:
							"https://openweathermap.org/img/wn/" +
							responseForecast.daily[i].weather[0].icon +
							"@2x.png",
						alt: "icon representation of weather conditions",
					})
				);

				$(".forecast-" + i).append(
					"<br>Temp: " +
						((responseForecast.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(
							2
						) +
						" \u00B0F<br>"
				);

				$(".forecast-" + i).append(
					"Humidity: " + responseForecast.daily[i].humidity + "%<br>"
				);
			}
		});
	});

	$("#city-input").val("");
}

function createUVIndexColor(x) {
	if (x >= 1.0 && x <= 2.99) {
		$("#uvIndexBG").attr("style", "background-color:rgb(67, 185, 30);");
	} else if (x >= 3.0 && x <= 5.99) {
		$("#uvIndexBG").attr("style", "background-color:rgb(252, 199, 33);");
	} else if (x >= 6.0 && x <= 7.99) {
		$("#uvIndexBG").attr("style", "background-color:rgb(251, 116, 27);");
	} else if (x >= 8.0 && x <= 10.99) {
		$("#uvIndexBG").attr("style", "background-color:rgb(248, 17, 22);");
	} else {
		$("#uvIndexBG").attr("style", "background-color:rgb(134, 111, 255);");
	}
}

function createSearchHistory() {
	$("#search-history").empty();
	let newString = "";
	for (let i = 0; i < localStorage.length; i++) {
		newString = capLetters(localStorage.getItem(i));
		let cityLi = $("<li>");
		cityLi.attr("data-city", newString);
		cityLi.addClass("list-group-item");
		cityLi.text(newString);
		$("#search-history").append(cityLi);
	}
}

function capLetters(str) {
	let arrayStr = str.split(" ");
	let capLetter = "";
	let newString = "";
	for (let i = 0; i < arrayStr.length; i++) {
		capLetter = arrayStr[i][0].toUpperCase();
		newString += capLetter + arrayStr[i].slice(1, arrayStr[i].length) + " ";
	}
	return newString.trim();
}

if (localStorage.length !== 0) {
	createSearchHistory();
	createWeatherData();
}

$(document).ajaxError(function () {
	alert("The city you've searched for is not valid or not in the database!");
	localStorage.removeItem(localStorage.length - 1);
	createSearchHistory();
});
