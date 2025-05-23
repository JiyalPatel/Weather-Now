const API_KEY = "72ee30e5edc24afe4e79e637e3fe03c5";
const UNIT = "metric";

let _IMG = document.querySelector("#WeatherIMG");
let _Temp = document.querySelector("#Temp");
let _Humidity = document.querySelector("#Humidity");
let _Wind = document.querySelector("#Wind");
let _City = document.querySelector("#City");

let _Input = document.querySelector("#Input");
let _InputBTN = document.querySelector("#InputBTN");

let _error = document.querySelector("#error")

const loader = document.querySelector("#loader");
const weatherBox = document.querySelector("#weather-container");


function updateWeatherImage(weatherType) {
  switch (weatherType) {
    case "Clear":
      _IMG.src = "./assets/clear.png";
      break;
    case "Mist":
      _IMG.src = "./assets/mist.png";
      break;
    case "Drizzle":
      _IMG.src = "./assets/drizzle.png";
      break;
    case "Clouds":
      _IMG.src = "./assets/clouds.png";
      break;
    case "Rain":
      _IMG.src = "./assets/rain.png";
      break;
    case "Snow":
      _IMG.src = "./assets/snow.png";
      break;
    default:
      _IMG.src = "./assets/clear.png"; // fallback image
      break;
  }
}

async function getData(URL) {

  loader.style.display = "flex";
  weatherBox.style.display = "none";
  _error.style.display = "none";

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function updateWeatherUI (InputCity) {
  
  

  let lat = null;
  let lon = null;

  let city = InputCity;

  let GEO_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  var GEO_DATA = await getData(GEO_URL);
  
   if (!GEO_DATA || GEO_DATA.length === 0) {
    loader.style.display = "none";
    _error.style.display = "block";
    _error.textContent = "City not found. Please enter a valid city name.";
    return;
  }

  if (GEO_DATA) {
      city = GEO_DATA[0].name;
      lat = GEO_DATA[0].lat;
      lon = GEO_DATA[0].lon;
  }

  let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNIT}&appid=${API_KEY}`;

  var WEATHER_DATA = await getData(URL);

  if (WEATHER_DATA) {
    console.log(WEATHER_DATA);
    _City.textContent = city
    _Temp.textContent = WEATHER_DATA.main.temp + " °C";
    _Humidity.textContent = WEATHER_DATA.main.humidity + " %";
    _Wind.textContent = WEATHER_DATA.wind.speed + " Km/h";
    updateWeatherImage(WEATHER_DATA.weather[0].main);
  }

  loader.style.display = "none";
  weatherBox.style.display = "block";

}

async function updateWeatherUIbyCoords (InputLat, InputLon) {

  let lat = InputLat;
  let lon = InputLon;

  let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNIT}&appid=${API_KEY}`;

  var WEATHER_DATA = await getData(URL);

  if (WEATHER_DATA) {
      console.log(WEATHER_DATA);
      _City.textContent = WEATHER_DATA.name;
      _Temp.textContent = WEATHER_DATA.main.temp + " °C";
      _Humidity.textContent = WEATHER_DATA.main.humidity + " %";
      _Wind.textContent = WEATHER_DATA.wind.speed + " Km/h";
      updateWeatherImage(WEATHER_DATA.weather[0].main);
  }

  loader.style.display = "none";
  weatherBox.style.display = "block";

}

_Input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    _InputBTN.click();
  }
});

_InputBTN.addEventListener("click", () => {
  inputData = _Input.value.trim();
  if (!inputData) {
    alert("Please enter a city name.");
    return;
  }

  // Optional: Check if input contains only letters and spaces
  const isValid = /^[a-zA-Z\s]+$/.test(inputData);
  if (!isValid) {
    alert("Please enter a valid city name (letters only).");
    return;
  }
  
  updateWeatherUI(inputData);

});


window.addEventListener("DOMContentLoaded", () => {

    loader.style.display = "flex";
    weatherBox.style.display = "none";

    _Input.focus();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("User Location:", lat, lon);

          updateWeatherUIbyCoords(lat, lon);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Couldn't get your location. Please enter your city manually.");
          updateWeatherUI("New York");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }

});