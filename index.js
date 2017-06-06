// flexbox polyfill
document.onload = () => {
  flexibility(document.getElementsByClassName("layer")[0]);
};

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

//helper function to properly display duration into time bits
const Timer = duration => {
  const hours = Math.floor(duration / 3600 % 24);
  const minutes = Math.floor(duration / 60 % 60);
  const seconds = Math.floor(duration % 60);

  return {
    hours,
    minutes,
    seconds
  };
};

const displayEndTime = (duration, span) => {
  const endTime = new Date(new Date().getTime() + duration * 1000);

  //trick to add trailing 0 to single digit numbers
  let endH = ("0" + endTime.getHours()).slice(-2);
  let endM = ("0" + endTime.getMinutes()).slice(-2);

  span.innerHTML = `timer ends at ${endH}:${endM}`;
};

const displayProgressCirle = duration => {
  const progress = document.getElementsByClassName("progress")[0];
  // 2* PI * 120(radius)
  let dashOffset = 754;
  //step needed to move in exactly one frame(~15ms) for smooth transition
  const step = 754 / (duration * 1000 / 15);

  const progressInterval = setInterval(() => {
    dashOffset -= step;
    progress.setAttribute("stroke-dashoffset", dashOffset);
    if (dashOffset <= 0) {
      clearInterval(progressInterval);
    }
  }, 15);
};

const startTimer = (className, duration) => {
  // display timer and finish time and hide preset buttons
  toggleDisplay("timer", true);
  toggleDisplay("config", false);
  toggleDisplay("endTime", true);

  const timer = document.getElementsByClassName(className)[0];

  displayProgressCirle(duration);
  // get and display ending time.
  displayEndTime(duration, timer.querySelector(".endTime"));

  let hours = "";
  let minutes = "";
  let seconds = "";

  //select Text svg element to display remaining time
  const display = document.getElementById("Text");
  let remainingTime = duration;

  const updateTimer = () => {
    //remaining time converted using helper funcion Timer()
    const t = Timer(remainingTime--);

    //display hours only if it is not 0
    t.hours !== 0 ? (hours = `${("0" + t.hours).slice(-2)}:`) : (hours = "");
    minutes = ("0" + t.minutes).slice(-2);
    seconds = ("0" + t.seconds).slice(-2);

    display.innerHTML = `${hours}${minutes}:${seconds}`;

    //when timer finishes, hide counter and display new timer button
    if (remainingTime < 0) {
      timerStarted = false;
      toggleDisplay("endTime", false);
      toggleDisplay("finished", true);
      clearInterval(timeinterval);
    }
  };
  //call once first to avoid one second delay before starting timer
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
      let input = element.parentNode.parentNode.children[0];
      input.value = handleInc(+input.value, +input.max);
    }
    if (element.classList[0] === "decrease") {
      let input = element.parentNode.parentNode.children[0];
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

/*button to close window window.close() only works if the window is opened by the script,
 so i have no idea how to close the app, unless it was a chrome extension i guess,
so this functionality is not fulfilled...

const closeButton = document.getElementById("close");
closeButton.onclick = () => {
 window.open(location, "_parent").close();
};*/

//button to restart new timer
const restartButton = document.getElementById("restart");
restartButton.onclick = () => {
  toggleDisplay("timer", false);
  toggleDisplay("config", true);
  toggleDisplay("finished", false);
};
