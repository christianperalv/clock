const globe = document.getElementById('globe');
const digitalClock = document.getElementById('digital-clock');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const countryName = document.getElementById('country-name');
const dateDisplay = document.getElementById('date-display');
const dateFormatSelector = document.getElementById('date-format');
const timeFormatSelector = document.getElementById('time-format');
const timezoneSelector = document.getElementById('timezone');

const countries = [
    { name: 'Londres', offset: 0 },
    { name: 'Nueva York', offset: -4 },
    { name: 'Tokio', offset: 9 }
];

let currentCountryIndex = 0;
let currentTimeFormat = '24'; // 24H por defecto
let currentDateFormat = 'long'; // Fecha larga por defecto

// Cargar configuraciones previas desde el almacenamiento local
function loadSettings() {
    const storedTimezone = localStorage.getItem('timezone');
    const storedTimeFormat = localStorage.getItem('timeFormat');
    const storedDateFormat = localStorage.getItem('dateFormat');

    if (storedTimezone) timezoneSelector.value = storedTimezone;
    if (storedTimeFormat) timeFormatSelector.value = storedTimeFormat;
    if (storedDateFormat) dateFormatSelector.value = storedDateFormat;

    currentCountryIndex = timezoneSelector.selectedIndex;
    currentTimeFormat = storedTimeFormat || currentTimeFormat;
    currentDateFormat = storedDateFormat || currentDateFormat;
}

// Guardar configuraciones en el almacenamiento local
function saveSettings() {
    localStorage.setItem('timezone', timezoneSelector.value);
    localStorage.setItem('timeFormat', timeFormatSelector.value);
    localStorage.setItem('dateFormat', dateFormatSelector.value);
}

// Actualizar la hora y fecha
function updateClock() {
    const now = new Date();
    const offset = countries[currentCountryIndex].offset;
    const localTime = new Date(now.getTime() + (offset * 60 + now.getTimezoneOffset()) * 60000);

    // Mostrar la hora en formato 12H o 24H
    let hours = localTime.getHours();
    let ampm = '';
    if (currentTimeFormat === '12') {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // la hora 0 es la 12 en formato 12H
    }

    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    const seconds = localTime.getSeconds().toString().padStart(2, '0');

    // Reloj digital
    digitalClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`.trim();

    // Actualizar reloj analógico
    secondHand.style.transform = `rotate(${localTime.getSeconds() * 6}deg)`;
    minuteHand.style.transform = `rotate(${localTime.getMinutes() * 6}deg)`;
    hourHand.style.transform = `rotate(${(hours * 30) + (localTime.getMinutes() / 2)}deg)`;

    // Actualizar fecha
    let formattedDate;
    switch (currentDateFormat) {
        case 'short':
            formattedDate = localTime.toLocaleDateString();
            break;
        case 'medium':
            formattedDate = localTime.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
            break;
        case 'long':
        default:
            formattedDate = localTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    dateDisplay.textContent = `Fecha: ${formattedDate}`;

    // Actualizar el nombre del país
    countryName.textContent = countries[currentCountryIndex].name;
}

// Event listeners para guardar y actualizar la configuración
timezoneSelector.addEventListener('change', () => {
    currentCountryIndex = timezoneSelector.selectedIndex;
    saveSettings();
    updateClock();
});

timeFormatSelector.addEventListener('change', () => {
    currentTimeFormat = timeFormatSelector.value;
    saveSettings();
    updateClock();
});

dateFormatSelector.addEventListener('change', () => {
    currentDateFormat = dateFormatSelector.value;
    saveSettings();
    updateClock();
});

// Inicializar la configuración y mostrar el reloj
loadSettings();
setInterval(updateClock, 1000);
updateClock();
