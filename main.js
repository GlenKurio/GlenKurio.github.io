const slider = document.querySelector('.slider-container'),

  slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;


let lastScrollTime = 0;


// Prevent "image doubleing" while dragging
slides.forEach((slide, index) => {
  const slideImg = slide.querySelector('img');
  slideImg.addEventListener('dragstart', (e) => e.preventDefault());

  // Touch Events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse Events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
  slide.addEventListener('wheel', handleMouseScroll);
});


// Disable context menu
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}


function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionY(event);
    isDragging = true;

    animationID = requestAnimationFrame(animation);

    slider.classList.add('grabbing');
  }
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();


  slider.classList.remove('grabbing');
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionY(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function getPositionY(event) {
  return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
  slider.style.transform = `translateY(${currentTranslate}px)`;
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerHeight;

  prevTranslate = currentTranslate;
  setSliderPosition();
}

// Scroll func
function handleMouseScroll(event) {
  const currentTime = new Date().getTime();

  if (currentTime - lastScrollTime < 300) {
    // Prevent rapid scrolling
    return;
  }

  lastScrollTime = currentTime;


  if (event.deltaY > 0) {
    // Scroll down
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
    }
  } else {
    // Scroll up
    if (currentIndex > 0) {
      currentIndex -= 1;
    }
  }

  setPositionByIndex();
}



