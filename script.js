const $ = (s) => document.querySelector(s);
const form = $("#contactForm");
const statusEl = $("#formStatus");
const sendBtn = form.querySelector("button[type=submit]");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.className = "form-status";
  statusEl.textContent = "";
  delete statusEl.dataset.message;
  sendBtn.disabled = true;

  const label = $(".send-label");
  label.textContent = translate("Sender…");

  try {
    const formData = new FormData(form);

    if (formData.get("botcheck")) {
      throw new Error("Spam check failed");
    }
    const payload = Object.fromEntries(formData.entries());
    // An empty optional email must not be sent as an invalid Reply-To.
    if (!payload.email) delete payload.email;
    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      throw new Error("Form submission failed");
    }

    statusEl.className = "form-status ok";
    statusEl.dataset.message = "Takk! Meldingen er sendt ✓";
    statusEl.textContent = translate(statusEl.dataset.message);
    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.className = "form-status err";
    statusEl.dataset.message = "Meldingen ble ikke sendt. Ring 407 41 993 eller prøv igjen.";
    statusEl.textContent = translate(statusEl.dataset.message);
  } finally {
    sendBtn.disabled = false;
    label.textContent = translate("Send forespørsel");
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

let weatherData = null;
let weatherFailed = false;

function renderWeather() {
  const forecast = $("#forecast");
  const summary = $("#weatherSummary");
  if (weatherFailed) {
    forecast.innerHTML = "";
    const error = document.createElement("div");
    error.className = "day";
    error.style.cssText = "grid-column:1/-1;min-height:auto";
    error.textContent = translate("Værmeldingen kunne ikke lastes akkurat nå. Prøv igjen senere.");
    forecast.appendChild(error);
    summary.textContent = translate("Værdata er midlertidig utilgjengelig.");
    return;
  }
  if (!weatherData) {
    summary.textContent = translate("Henter værmelding…");
    return;
  }
  const locale = languageConfigs[language].locale;
  const dayFmt = new Intl.DateTimeFormat(locale, {weekday:"short"});
  const fullFmt = new Intl.DateTimeFormat(locale, {day:"numeric", month:"short"});
  const snowFmt = new Intl.NumberFormat(locale, {minimumFractionDigits:1, maximumFractionDigits:1});
  const d = weatherData;
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
      <div class="day-name">${i === 0 ? translate("I dag") : dayFmt.format(date)} · ${fullFmt.format(date)}</div>
      <div class="weather-icon">${weatherCodeIcon(d.weather_code[i])}</div>
      <div class="temps">${Math.round(d.temperature_2m_max[i])}° <small>${Math.round(d.temperature_2m_min[i])}°</small></div>
      <div class="snow">${translate("Snø")}<strong>${snowFmt.format(snow)} cm</strong></div>
      <div class="snow">${translate("Nedbør")}<strong>${Math.round(d.precipitation_probability_max[i] || 0)} %</strong></div>`;
    forecast.appendChild(el);
  });
  if (snowDays) {
    summary.innerHTML = translate("❄️ Prognosen viser mulig snø på <strong>{days}</strong> av de neste 7 dagene, totalt rundt <strong>{snow} cm</strong>.")
      .replace("{days}", String(snowDays))
      .replace("{snow}", snowFmt.format(snowTotal));
  } else {
    summary.textContent = translate("Ingen nevneverdig snø er meldt de neste 7 dagene akkurat nå.");
  }
}

document.addEventListener("languagechange", () => {
  renderWeather();
  $(".send-label").textContent = translate(sendBtn.disabled ? "Sender…" : "Send forespørsel");
  if (statusEl.dataset.message) statusEl.textContent = translate(statusEl.dataset.message);
});

async function loadWeather() {
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
    weatherData = (await res.json()).daily;
  } catch {
    weatherFailed = true;
  }
  renderWeather();
}
loadWeather();

