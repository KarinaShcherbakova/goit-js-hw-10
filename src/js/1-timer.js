import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
const daysField = document.querySelector('[data-days]');
const hoursField = document.querySelector('[data-hours]');
const minutesField = document.querySelector('[data-minutes]');
const secondsField = document.querySelector('[data-seconds]');

let timerId = null;
let userSelectedDate = null;

startBtn.disabled = true;  


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}


function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});


startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  dateTimePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(timerId);
      dateTimePicker.disabled = false;
      iziToast.success({
        title: 'Success',
        message: 'Countdown completed!',
        position: 'topRight',
      });
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    daysField.textContent = addLeadingZero(days);
    hoursField.textContent = addLeadingZero(hours);
    minutesField.textContent = addLeadingZero(minutes);
    secondsField.textContent = addLeadingZero(seconds);
  }, 1000);
});