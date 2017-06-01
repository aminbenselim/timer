const Timer = duration => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor(duration / 60 % 60);
  var hours = Math.floor(duration / 3600 % 24);
  var days = Math.floor(duration / (3600 * 24));

  return {
    days,
    hours,
    minutes,
    seconds
  };
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

const startTimer = (className, duration) => {
  // display timer and hide preset buttons
  toggleDisplay("display", true);
  toggleDisplay("presets", false);

  const timer = document.getElementsByClassName(className)[0];

  // get and display ending time.
  const endTime = new Date(new Date().getTime() + duration);
  timer.querySelector(".endTime").innerHTML = endTime.toUTCString();

  //select correspanding spans
  const days = timer.querySelector(".days");
  const hours = timer.querySelector(".hours");
  const minutes = timer.querySelector(".minutes");
  const seconds = timer.querySelector(".seconds");

  let remainingTime = duration;

  const updateTimer = () => {
    const t = Timer(remainingTime--);
    console.log(remainingTime);
    days.innerHTML = t.days;
    hours.innerHTML = ("0" + t.hours).slice(-2);
    minutes.innerHTML = ("0" + t.minutes).slice(-2);
    seconds.innerHTML = ("0" + t.seconds).slice(-2);
    if (remainingTime < 0) {
      timerStarted = false;
      clearInterval(timeinterval);
    }
  };

  //updateTimer();
  const timeinterval = setInterval(updateTimer, 1000);
};

// use ES6 spread operator to convert HTMLCollection (children) to array.
const presets = [...document.getElementsByClassName("presets")[0].children];

//console.log(presets);

presets.forEach(child => {
  child.addEventListener("click", event => {
    if (!timerStarted)
      switch (child.className) {
        case "five":
          startTimer("timer", 300);
          timerStarted = true;
          break;
        case "thirty":
          startTimer("timer", 1800);
          timerStarted = true;
          break;
        case "fifteen":
          startTimer("timer", 900);
          timerStarted = true;
          break;
      }
  });
});

//startTimer("timer", 10);
