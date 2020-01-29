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
function fetchWeatherReport(apiKey, latitude, longitude) {
  let DsProxyLink = "https://cors-anywhere.herokuapp.com/";
  let dsApiLink = `${DsProxyLink}https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,alerts,flags`;

  fetch(dsApiLink)
    .then(response => {
      return response.json();
    })
    .then(data => {
      var resultsHTML = "";
      var tableHTML = "";
      let summary = data.currently.summary;
      let temperature = data.currently.temperature;
      let icon = data.currently.icon;
      let precipProbability = data.currently.precipProbability;
      let humidity = data.currently.humidity;
      let windSpeed = data.currently.windSpeed;
      let ts = new Date(data.currently.time * 1000);
      let forecastDate = `${wDay[ts.getDay()]} ${
        wMonth[ts.getMonth()]
      } ${ts.getDate()}`;

      //Set values for the current conditions
      // document.getElementById("location").innerHTML = name;
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

      document.getElementById("dailyForecast").innerHTML = getWeeklyForecast(
        data.daily
      );
      document.getElementById("weeklyForecast").innerHTML = getDailyForecast(
        data.hourly
      );
    })
    .catch(err => {
      throw `error ${err} occured`;
    });
}

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
    let tempHigh = `${Math.round(fData.data[i].temperatureHigh)}&deg`;
    let tempLow = `${Math.round(fData.data[i].temperatureLow)}&deg`;

    resultsHTML += getRow(dayTime, summary, tempHigh, tempLow);
  }

  return resultsHTML;
}
function getRow(dayTime, summary, tempHigh, colVal4) {
  return `<tr><td>${dayTime}</td><td>${summary}</td><td>${tempHigh}</td><td>${colVal4}</td></tr>`;
}
function getDailyForecast(fData) {
  let resultsHTML =
    "<tr><th>Time</th><th>Conditions</th><th>Temp</th><th>Precip</th></tr>";
  rowcount = fData.data.length;
  if (rowcount > 8) {
    rowcount = 8;
  }

  for (i = 0; i < rowcount; i++) {
    let ts = new Date(fData.data[i].time * 1000);
    let summary = "";
    let tempHigh = 0;
    let timeValue;

    //unix time needs to be formatted for display
    let hours = ts.getHours();
    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }
    timeValue += hours >= 12 ? " PM" : " AM"; // get AM/PM

    summary = fData.data[i].summary;
    tempHigh = `${Math.round(fData.data[i].temperature)}&deg`;
    let precipProbability = `${Math.round(
      fData.data[i].precipProbability * 100
    )}%`;
    resultsHTML += getRow(timeValue, summary, tempHigh, precipProbability);
  }

  return resultsHTML;
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("geo location not supported");
  }
}

function success(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  document.getElementById("location").innerHTML =
    "lat: " + lat + " lng: " + lng;

  //   alert("lat: " + lat + " lng: " + lng);
  codeLatLng(lat, lng);
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
function getICON(icon) {
  switch (icon) {
    case iconValue.CLEARDAY:
      return "images/SunnyDay.png";

    case iconValue.CLOUDY:
    case iconValue.PARTLY_CLOUDY_DAY:
      return "images/MostlySunny.png";

    case iconValue.CLEARNIGHT:
      return "images/ClearMoon.png";

    case iconValue.PARTLY_CLOUDY_NIGHT:
      return "images/CloudyMoon.png";
    case iconValue.RAIN:
      return "images/Rain.png";

    case iconValue.SNOW:
      return "images/SNOW.png";

    case iconValue.SLEET:
      return "images/Sleet.png";

    default:
      return "images/SunnyDay.png";
  }
}
