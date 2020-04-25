import { myFetch } from "./fetch.js";

function attachEvents() {
  const types = {
    Sunny: "&#x2600", // ☀
    "Partly sunny": "&#x26C5", //⛅
    Overcast: "&#x2601", // ☁
    Rain: "&#x2614", // ☂
    Degrees: "&#176" // °
  };
  const elements = {
    location: () => document.getElementById("location"),
    getWeatherBtn: () => document.getElementById("submit"),
    forecast: () => document.getElementById("forecast"),
    currentConditions: () => document.getElementById("current"),
    threeDayConditions: () => document.getElementById("upcoming")
  };

  elements.getWeatherBtn().addEventListener("click", getLocation);
  function getLocation() {
    forecast.style.display = "block";
    let currentLocation = elements.location().value;

    myFetch()
      .locations()
      .then(data => {
        const { code, name } = data.find(o => o.name === currentLocation);
        return Promise.all([myFetch().today(code), myFetch().upcoming(code)]);
      })
      .then(([today, upcoming]) => {
        todayWeather(today, upcoming);
      })
      .catch(err => alert(err));
  }
  function todayWeather(today, upcoming) {
    let { name, forecast } = today;
    let { low, high, condition } = forecast;
    let divForecast = createElements("div", ["forecasts"]);
    let spanSymbol = createElements(
      "span",
      ["condition", "symbol"],
      types[condition]
    );
    let spanCondition = createElements("span", ["condition"]);
    let spanCity = createElements("span", ["forecast-data"], name);
    let spanDegrees = createElements(
      "span",
      ["forecast-data"],
      `${low}&deg/${high}&deg`
    );
    let spanWeather = createElements("span", ["forecast-data"], condition);
    append(spanCondition, spanCity);
    append(spanCondition, spanDegrees);
    append(spanCondition, spanWeather);
    append(divForecast, spanSymbol);
    append(divForecast, spanCondition);
    append(elements.currentConditions(), divForecast);
    upcomingWeather(upcoming);
  }
  function upcomingWeather(upcoming) {
    let { forecast, name } = upcoming;
    let divUpcomingInfo = createElements("div", ["forecast-info"]);
    append(elements.threeDayConditions(), divUpcomingInfo);

    for (let day of forecast) {
      let { condition, high, low } = day;
      let spanUpcoming = createElements("span", ["upcoming"]);
      let spanUpcomingSymbol = createElements(
        "span",
        ["symbol"],
        types[condition]
      );
      let spanUpcomingDegrees = createElements(
        "span",
        ["forecast-data"],
        `${low}&deg/${high}&deg`
      );
      let spanUpcomingWeather = createElements(
        "span",
        ["forecast-data"],
        condition
      );
      append(spanUpcoming, spanUpcomingSymbol);
      append(spanUpcoming, spanUpcomingDegrees);
      append(spanUpcoming, spanUpcomingWeather);
      append(divUpcomingInfo, spanUpcoming);
    }
  }

  function createElements(elementType, className = undefined, content) {
    let element;
    element = document.createElement(elementType);
    for (let c of className) {
      element.classList.add(c);
    }
    if (content !== undefined) {
      element.innerHTML = content;
    }
    return element;
  }
  function append(parent, child) {
    return parent.appendChild(child);
  }
}

attachEvents();
