const $ = (s) => document.querySelector(s);
const form = $("#contactForm");
const statusEl = $("#formStatus");
const sendBtn = form.querySelector("button[type=submit]");
$("#year").textContent = new Date().getFullYear();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.className = "form-status";
  statusEl.textContent = "";
  sendBtn.disabled = true;

  const label = $(".send-label");
  const previousLabel = label.textContent;
  label.textContent = "Sender…";

  try {
    const formData = new FormData(form);

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData).toString()
    });

    if (!response.ok) {
      throw new Error("Netlify form submission failed");
    }

    statusEl.className = "form-status ok";
    statusEl.textContent = "Takk! Meldingen er sendt ✓";
    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.className = "form-status err";
    statusEl.textContent = "Meldingen ble ikke sendt. Ring 407 41 993 eller prøv igjen.";
  } finally {
    sendBtn.disabled = false;
    label.textContent = previousLabel;
  }
});

const weatherCodeIcon = (code) => {
  if ([71,73,75,77,85,86].includes(code)) return "❄️";
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if ([95,96,99].includes(code)) return "⛈️";
  if ([45,48].includes(code)) return "🌫️";
  if ([1,2,3].includes(code)) return "⛅";
  return "☀️";
};
const dayFmt = new Intl.DateTimeFormat("nb-NO", {weekday:"short"});
const fullFmt = new Intl.DateTimeFormat("nb-NO", {day:"numeric", month:"short"});

async function loadWeather() {
  const forecast = $("#forecast");
  const summary = $("#weatherSummary");
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      latitude: "59.7708",
      longitude: "9.9099",
      timezone: "Europe/Oslo",
      forecast_days: "7",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_probability_max"
    });
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather");
    const j = await res.json();
    const d = j.daily;
    forecast.innerHTML = "";
    let snowDays = 0;
    let snowTotal = 0;

    d.time.forEach((dateStr, i) => {
      const snow = Number(d.snowfall_sum[i] || 0);
      snowTotal += snow;
      if (snow > 0.05) snowDays++;
      const date = new Date(dateStr + "T12:00:00");
      const el = document.createElement("article");
      el.className = "day" + (i === 0 ? " today" : "") + (snow > 0.05 ? " snowy" : "");
      el.innerHTML = `
        <div class="day-name">${i === 0 ? "I dag" : dayFmt.format(date)} · ${fullFmt.format(date)}</div>
        <div class="weather-icon">${weatherCodeIcon(d.weather_code[i])}</div>
        <div class="temps">${Math.round(d.temperature_2m_max[i])}° <small>${Math.round(d.temperature_2m_min[i])}°</small></div>
        <div class="snow">Snø<strong>${snow.toFixed(1)} cm</strong></div>
        <div class="snow">Nedbør<strong>${Math.round(d.precipitation_probability_max[i] || 0)} %</strong></div>`;
      forecast.appendChild(el);
    });

    if (snowDays) {
      summary.innerHTML = `❄️ Prognosen viser mulig snø på <strong>${snowDays}</strong> av de neste 7 dagene, totalt rundt <strong>${snowTotal.toFixed(1)} cm</strong>.`;
    } else {
      summary.innerHTML = `Ingen nevneverdig snø er meldt de neste 7 dagene akkurat nå.`;
    }
  } catch {
    forecast.innerHTML = `<div class="day" style="grid-column:1/-1;min-height:auto">Værmeldingen kunne ikke lastes akkurat nå. Prøv igjen senere.</div>`;
    summary.textContent = "Værdata er midlertidig utilgjengelig.";
  }
}
loadWeather();
