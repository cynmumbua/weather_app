const wDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const wMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const iconValue = {
  CLEARDAY: "clear-day",
  CLEARNIGHT: "clear-night",
  RAIN: "rain",
  SNOW: "snow",
  SLEET: "sleet",
  WIND: "wind",
  FOG: "fog",
  CLOUDY: "cloudy",
  PARTLY_CLOUDY_DAY: "partly-cloudy-day",
  PARTLY_CLOUDY_NIGHT: "partly-cloudy-night"
};
//fetch data from API current weather condition
function fetchWeatherReport(apiKey, latitude, longitude) {
  let DsProxyLink = "https://cors-anywhere.herokuapp.com/";
  let dsApiLink = `${DsProxyLink}https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,alerts,flags`;

  fetch(dsApiLink)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let resultsHTML = "";
      let tableHTML = "";
      let summary = data.currently.summary;
      let temperature = ((data.currently.temperature - 32) * 5) / 9;
      let icon = data.currently.icon;
      let precipProbability = data.currently.precipProbability;
      let humidity = data.currently.humidity;
      let windSpeed = data.currently.windSpeed;
      let ts = new Date(data.currently.time * 1000);

      let forecastDate = `${wDay[ts.getDay()]} ${
        wMonth[ts.getMonth()]
      } ${ts.getDate()}`;

      //Set values for the current conditions
      document.getElementById("dayTime").innerHTML = forecastDate;
      document.getElementById("summary").innerHTML = summary;
      document.getElementById("currentTemp").innerHTML = `${Math.round(
        temperature
      )}&deg`;
      document.getElementById("weatherIcon").src = getICON(icon);
      document.getElementById(
        "preciptation"
      ).innerHTML = `Precipitation ${precipProbability * 100}%`;
      document.getElementById("humidity").innerHTML = `Humidity ${Math.round(
        humidity * 100
      )}%`;
      document.getElementById("wind").innerHTML = `Winds ${Math.round(
        windSpeed
      )} mph`;

      document.getElementById("weeklyForecast").innerHTML = getWeeklyForecast(
        data.daily
      );
      document.getElementById("summaryDate").innerHTML = getSelectedDate(
        data.daily
      );
    })
    .catch(err => {
      throw `error ${err} occured`;
    });
}
//displays the weeks weather condition
function getWeeklyForecast(fData) {
  let resultsHTML =
    "<tr><th>Day</th><th>Conditions</th><th>Hi</th><th>Lo</th></tr>";
  rowcount = fData.data.length;
  if (rowcount > 8) {
    rowcount = 8;
  }

  for (i = 0; i < rowcount; i++) {
    let ts = new Date(fData.data[i].time * 1000);

    let dayTime = wDay[ts.getDay()];
    let summary = fData.data[i].summary;
    let tempHigh = `${Math.round(
      ((fData.data[i].temperatureHigh - 32) * 5) / 9
    )}&deg`;
    let tempLow = `${Math.round(
      ((fData.data[i].temperatureLow - 32) * 5) / 9
    )}&deg`;

    resultsHTML += getRow(dayTime, summary, tempHigh, tempLow);
  }

  return resultsHTML;
}

function getRow(dayTime, summary, tempHigh, colVal4) {
  return `<tr><td>${dayTime}</td><td>${summary}</td><td>${tempHigh}</td><td>${colVal4}</td></tr>`;
}
//function fetch the data from API to get the future/past weather condition 
function fetchFutureWeatherReport(apiKey, latitude, longitude) {
  let strDate = document.getElementById("sDate").value;
  let toTimestamp = Date.parse(strDate) / 1000;
  console.log(toTimestamp);
  let DsProxyLink = "https://cors-anywhere.herokuapp.com/";
  let dsApiLink = `${DsProxyLink}https://api.darksky.net/forecast/9cf33b926d24e164a355f4df2d24ba9c/-1.1056331,37.0188397,${toTimestamp}?exclude=currently,flags`;

  fetch(dsApiLink)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let summary = data.daily.data[0].summary;
      let temperature = ((data.daily.data[0].temperatureHigh - 32) * 5) / 9;
      document.getElementById("summaryDate").innerHTML = summary;
      document.getElementById("temperatureDate").innerHTML = `Temp: ${Math.round(
        temperature
      )}&deg`;
    })
    .catch(err => {
      throw `error ${err} occured`;
    });
}

//function to get name of the location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("geo location not supported");
  }
}
//function to get the lattitde and longitude of current location
function success(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  document.getElementById("location").innerHTML =
    "lat: " + lat + " lng: " + lng;

  codeLatLng(lat, lng);
  fetchFutureWeatherReport(
    dsApiKey,
    position.coords.latitude,
    position.coords.longitude
  );

  fetchWeatherReport(
    dsApiKey,
    position.coords.latitude,
    position.coords.longitude
  );
}

function error() {
  alert(`geocoder error ${error}`);
}

let geocoder = new google.maps.Geocoder();

function initialize() {
  geocoder = new google.maps.Geocoder();
}

function codeLatLng(lat, lng) {
  let latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({ latLng: latlng }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results);
      if (results[1]) {
        let address = results[0].formatted_address;
        alert("address =" + address);
      } else {
        alert("No results found");
      }
    }
  });
}
//switch case function to get the desired icon
function getICON(icon) {
  switch (icon) {
    case iconValue.CLEARDAY:
      return "images/clear-day.svg";

    case iconValue.CLOUDY:
    case iconValue.PARTLY_CLOUDY_DAY:
      return "images/partly-cloudy-day.svg";

    case iconValue.CLEARNIGHT:
      return "images/clear-night.svg";

    case iconValue.PARTLY_CLOUDY_NIGHT:
      return "images/partly-cloudy-night.svg";
    case iconValue.RAIN:
      return "images/rain.svg";

    case iconValue.SNOW:
      return "images/snow.svg";

    case iconValue.SLEET:
      return "images/Sleet.svg";

    default:
      return "images/clear-day.svg";
  }
}
