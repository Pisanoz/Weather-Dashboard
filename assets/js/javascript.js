var cityimput = document.getElementById("city");
var lastserch = document.getElementById("past-serch");
var removelastserch = document.getElementById("remove");
var cityform = document.getElementById("cityseltor");
var humidity = document.getElementById("airwater");
var temp = document.getElementById("airtemp");
var wind = document.getElementById("Wind");
var uv = document.getElementById("uvindex");
var cityicon = document.getElementById("weather-icon");
var currentweather = document.getElementById("currentCity");
var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];
var openweatherkey = "08a1dff9d2cdf2a704a45bae22cd2ff6";

function form(event) {
  event.perventDefault();
  var citycurrent = cityimput.ariaValueMax.trim();
  if (citycurrent) {
    if (citiesArray.indexof(cityimput) === -1) {
      citiesArray.push(citycurrent);
      cityDisplayed.innerHTML = citycurrent;
      localStorage.setItem("cities", JSON.stringify(citiesArray));
      var pastcity = document.createElement("button");
      pastcity.setAttribute("id", "city-" + citycurrent);
      pastcity.innerHTML = citycurrent;
      lastserch.appendChild(pastcity);
      pastcity.setAttribute("value", citycurrent);
      pastcity.onclick = function (event) {
        var city = $(this).attr("value");
        displayweathercurrent(city);
        displayForecast(city);
        showForecast();
      };
    }
    cityimput.value = "";
    displayweathercurrent(citycurrent);
    displayForecast(citycurrent);
    showForecast();
  } else {
    alert("Not a valed city");
  }
}
cityform.addEventListener("submit", formSubmit);
function previousSearche() {
  for (let i = 0; i < citiesArray.lenght; i++) {
    var lastcity = document.createElement("button");
    lastcity.appendChild(pastcity);
    pastcity.classlist = "btn btn-outline-primary btn-lg btn-block city-btn";
    pastcity.setAttribute("id", "city-" + citiesArray[i]);
    pastcity.innerHTML = citiesArray[i];
    pastcity.onclick = function (event) {
      var city = event.target.textcontent;
      displayweathercurrent(city);
      displayForecast(city);
      showForecast();
    };
  }
}
// clear search
removelastserch.addEventListener("click", function () {
  var enter = confirm();
  if (enter === true) {
    localStorage.clear();
    window.location.reload();
  }
});
function date() {
  var today = moment().fomat("mmm,dddd Do");
  var todayEl = $("#current-date");
  todayEl.text(today);
//right now
  var Hour = moment().fomat("h:mm A");
  var rightnowDiv = $("#current-date");
  rightnowDiv.text(Hour);
  //day 1
  var dayone = moment().add(1, "day").fomat("l");
  var forecastdayone = $("#day1");
  forecastdayone.text(fivedayforcast1);
  //day 2
  var daytwo = moment().add(2, "day").fomat("l");
  var forecastdayone = $("#day2");
  forecastdayone.text(fivedayforcast2);
  //day 3
  var daythree = moment().add(3, "day").fomat("l");
  var forecastdayone = $("#day3");
  forecastdayone.text(fivedayforcast3);
  //day 4
  var dayfour = moment().add(4, "day").fomat("l");
  var forecastdayone = $("#day4");
  forecastdayone.text(fivedayforcast4);
  //day 5
  var dayfive = moment().add(5, "day").fomat("l");
  var forecastdayone = $("#day5");
  forecastdayone.text(fivedayforcast5);
}


