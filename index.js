// boolean used to prevent starting multiple timers at once.
let timerStarted = false;

// helper function to display or hide specific element based on its classname/
//  display :Boolean --> true = display, false = hide.
const toggleDisplay = (className, display) => {
  const cList = document.getElementsByClassName(className)[0].classList;
  if (display) {
    cList.remove("hidden");
    cList.add("visible");
  } else {
    cList.remove("visible");
    cList.add("hidden");
  }
};

const Timer = duration => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor(duration / 60 % 60);
  var hours = Math.floor(duration / 3600 % 24);

  return {
    hours,
    minutes,
    seconds
  };
};

const startTimer = (className, duration) => {
  // display timer and hide preset buttons
  toggleDisplay("timer", true);
  toggleDisplay("config", false);

  const timer = document.getElementsByClassName(className)[0];

  // get and display ending time.
  const endTime = new Date(new Date().getTime() + duration * 1000);
  timer.querySelector(
    ".endTime"
  ).innerHTML = `timer ends at ${endTime.getHours()} : ${endTime.getMinutes()}`;

  //select correspanding span
  const hours = timer.querySelector(".hours");
  const minutes = timer.querySelector(".minutes");
  const seconds = timer.querySelector(".seconds");

  let remainingTime = duration;

  const updateTimer = () => {
    const t = Timer(remainingTime--);
    if (t.hours !== 0) hours.innerHTML = `${("0" + t.hours).slice(-2)} : `;
    minutes.innerHTML = ("0" + t.minutes).slice(-2);
    seconds.innerHTML = ("0" + t.seconds).slice(-2);
    if (remainingTime < 0) {
      timerStarted = false;
      toggleDisplay("finished", true);
      clearInterval(timeinterval);
    }
  };

  updateTimer();
  const timeinterval = setInterval(updateTimer, 1000);
};

// use ES6 spread operator to convert HTMLCollection (children) to array.
const presets = [...document.getElementsByClassName("presets")[0].children];
// make use of the data attribute
presets.forEach(child => {
  child.addEventListener("click", () => {
    if (!timerStarted) {
      startTimer("timer", +child.dataset.val * 60);
      timerStarted = true;
    }
  });
});

// use event delegation to handle increment and decrement
document
  .getElementsByClassName("custom")[0]
  .addEventListener("click", event => {
    event.preventDefault();
    let element = event.target;
    if (element.classList[0] === "increase") {
      let input = element.parentNode.children[2];
      input.value = handleInc(+input.value, +input.max);
    }
    if (element.classList[0] === "decrease") {
      let input = element.parentNode.children[2];
      input.value = handleDec(+input.value, +input.min);
    }
  });

const handleInc = (val, max) => {
  let newVal = 0;
  if (val >= max) {
    newVal = val;
  } else {
    newVal = val + 1;
  }
  return newVal;
};
const handleDec = (val, min) => {
  let newVal = 0;
  if (val <= min) {
    newVal = val;
  } else {
    newVal = val - 1;
  }
  return newVal;
};

//button to start custom timer
const startButton = document.getElementsByClassName("start")[0];
startButton.onclick = () => {
  const [h, m, s] = [...document.getElementsByTagName("input")];
  const customDuration = +h.value * 3600 + +m.value * 60 + +s.value;
  if (+h.value + +m.value + +s.value !== 0) startTimer("timer", customDuration);
};

//button to close window window.close() only works if the window is opened by the script,
// so i have no idea how to close the app, unless it was a chrome extension i guess,
//so this functionality is not fulfilled...

//const closeButton = document.getElementById("close");
//closeButton.onclick = () => {
// window.open(location, "_parent").close();
//};

//button to restart new timer
const restartButton = document.getElementById("restart");
restartButton.onclick = () => {
  toggleDisplay("timer", false);
  toggleDisplay("config", true);
  toggleDisplay("finished", false);
};
