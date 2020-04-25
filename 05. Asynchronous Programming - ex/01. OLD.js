function attachEvents() {
    let types = {
      Sunny: "&#x2600", // ☀
      "Partly sunny": "&#x26C5", //⛅
      Overcast: "&#x2601", // ☁
      Rain: "&#x2614", // ☂
      Degrees: "&#176" // °
    };
    const location = document.getElementById("location");
    const getWeatherBtn = document.getElementById("submit");
    const forecast = document.getElementById("forecast");
    const currentConditions = document.getElementById("current");
    const threeDayConditions = document.getElementById("upcoming");
  
    getWeatherBtn.addEventListener("click", getLocation);
    function getLocation() {
      forecast.style.display = "block";
      let currentLocation = location.value;
  
      fetch(`https://judgetests.firebaseio.com/locations.json`)
        .then(res => res.json())
        .then(data => {
          for (let city of data) {
            let { name, code } = city;
            if (name === currentLocation) {
              fetch(
                `https://judgetests.firebaseio.com/forecast/today/${code}.json `
              )
                .then(res => res.json())
                .then(data => {
                  let { name, forecast } = data;
                  let { low, high, condition } = forecast;
  
                  let cerateSpanForecast = document.createElement("div");
                  let createSpanSymbol = document.createElement("span");
                  let createSpanCondition = document.createElement("span");
                  let createSpanCity = document.createElement("span");
                  let createSpanDegrees = document.createElement("span");
                  let createSpanWeather = document.createElement("span");
  
                  cerateSpanForecast.className = "forecasts";
                  createSpanSymbol.classList.add ("condition");
                  createSpanSymbol.classList.add ("symbol")
                  createSpanCondition.className = "condition";
                  createSpanCity.className = "forecast-data";
                  createSpanWeather.className = "forecast-data";
                  createSpanDegrees.className = "forecast-data";
  
                  createSpanCondition.appendChild(createSpanCity);
                  createSpanCondition.appendChild(createSpanDegrees);
                  createSpanCondition.appendChild(createSpanWeather);
                  cerateSpanForecast.appendChild(createSpanSymbol);
                  cerateSpanForecast.appendChild(createSpanCondition);
  
                  currentConditions.appendChild(cerateSpanForecast);
  
                  createSpanSymbol.innerHTML = types[condition];
                  createSpanCity.textContent = condition
                  createSpanDegrees.innerHTML = `${low}&deg/${high}&deg`;
                  createSpanCity.textContent = name;
                })
                .catch(handleError);
              fetch(
                `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
              )
                .then(res => res.json())
                .then(data => {
                  let { forecast, name } = data;
                  let createSpanForecastInfo = document.createElement("div");
                  createSpanForecastInfo.className = "forecast-info";
                  threeDayConditions.appendChild(createSpanForecastInfo)
  
                  for (let day of forecast) {
                    let { condition, high, low } = day;
                    let crateSpanUpcoming = document.createElement("span");
                    let crateSpanUpcomingSymbol = document.createElement("span");
                    let crateSpanUpcomingDegrees = document.createElement("span");
                    let crateSpanUpcomingWeather = document.createElement("span");
  
                    crateSpanUpcoming.className = "upcoming";
                    crateSpanUpcomingSymbol.className = "symbol";
                    crateSpanUpcomingDegrees.className = "forecast-data";
                    crateSpanUpcomingWeather.className = "forecast-data";
  
                    crateSpanUpcoming.appendChild(crateSpanUpcomingSymbol)
                    crateSpanUpcoming.appendChild(crateSpanUpcomingDegrees)
                    crateSpanUpcoming.appendChild(crateSpanUpcomingWeather);
  
                    createSpanForecastInfo.appendChild(crateSpanUpcoming);
  
                    crateSpanUpcomingSymbol.innerHTML=types[condition];
                    crateSpanUpcomingDegrees=`${low}&deg/${high}&deg`;
                    crateSpanUpcomingWeather.innerHTML=condition
                  }
                })
                .catch(handleError)
            }
          }
        })
        .catch(handleError);
    }
  
    function handleError(error) {
      alert('error');
    }
  }
  
  attachEvents();
  