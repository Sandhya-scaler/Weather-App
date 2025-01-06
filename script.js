const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const weatherDetails = document.getElementById("weatherDetails");
const videoElement = document.getElementById("backgroundVideo");
const videoSource = document.getElementById("videoSource");

async function fetchWeather(location) {
  const apiKey = "c9bf99d9e2115ee61550c4df3b971413";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data = await response.json();
    updateWeatherDetails(data);
  } catch (error) {
    weatherDetails.innerHTML = `<p>${error.message}</p>`;
  }
}

function updateWeatherDetails(data) {
  const { main, weather, wind, sys } = data;
  const temperature = main.temp;
  const description = weather[0].description;
  const windSpeed = wind.speed;
  const humidity = main.humidity;
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

  let emoji = getWeatherEmoji(description);

  weatherDetails.innerHTML = `
        <h2>${emoji} ${temperature}°C</h2>
        <p>${emoji} ${description}</p>
        <p>💨 Wind Speed: ${windSpeed} m/s</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>🌅 Sunrise: ${sunrise}</p>
        <p>🌇 Sunset: ${sunset}</p>
    `;

  updateWeatherAnimation(weather[0].main);
}

function getWeatherEmoji(description) {
  switch (description.toLowerCase()) {
    case "clear sky":
      return "☀️";
    case "rain":
      return "🌧️";
    case "snow":
      return "❄️";
    case "clouds":
      return "☁️";
    case "thunderstorm":
      return "🌩️";
    case "mist":
    case "fog":
      return "🌫️";
    default:
      return "🌍";
  }
}

function updateWeatherAnimation(condition) {
  const body = document.body;
  let videoUrl = "";

  body.classList.remove("wind-effect");

  switch (condition) {
    case "Rain":
      videoUrl =
        "https://cdn.pixabay.com/video/2023/02/13/150531-798555662_large.mp4";
      break;
    case "Snow":
      videoUrl =
        "https://cdn.pixabay.com/video/2023/12/03/191855-891315497_large.mp4";
      break;
    case "Clear":
      videoUrl =
        "https://cdn.pixabay.com/video/2015/10/23/1154-143492926_medium.mp4";
      break;
    case "Clouds":
      videoUrl =
        "https://media.istockphoto.com/id/2070837460/video/flight-through-the-clouds.mp4?s=mp4-640x640-is&k=20&c=UE3NV8MheV-idcaQEkd3XqmRecUx9qQFxnoCZKhHjUk=";
      break;
    case "Thunderstorm":
      videoUrl =
        "https://cdn.pixabay.com/video/2021/05/23/75016-554074776_large.mp4";
      break;
    case "haze":
      videoUrl =
        "https://cdn.pixabay.com/video/2023/05/24/164360-830461265_large.mp4";
      break;
    case "Fog":
      videoUrl =
        "https://cdn.pixabay.com/video/2023/05/24/164360-830461265_large.mp4";
      break;
    case "Wind":
      videoUrl = "https://cdn.pixabay.com/video/2024/10/06/234979_large.mp4";
      body.classList.add("wind-effect");
      break;
  }

  videoSource.src = videoUrl;
  videoElement.load();
}

searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    fetchWeather(location);
  }
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(`${latitude},${longitude}`);
  });
}
