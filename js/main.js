// Get all of the images with the lazy load class name
const images = document.querySelectorAll('.lazy-image');
const config = {
  // If the image gets within 50px in the Y axis, start the download
  rootMargin: '50px 0px',
  threshold: 0.01
}

// The observer for the images on the page
let imageCount = images.length;
let observer;

// If the Intersection Observer API is not supported, load the images immediately
if (!('IntersectionObserver' in window)) {
  loadImagesImmediately(images);
} else {
  // The Intersection Observer API is supported -- lazy load images
  observer = new IntersectionObserver(onIntersection, config);

  images.forEach(image => {
    observer.observe(image);
  });
}

/**
* Fetchs the image for the given URL
* @param {string} url
*/
function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = resolve;
    image.onerror = reject;
  });
}

/**
* Preloads the image
* @param {object} image
*/
function preloadImage(image) {
  const src = image.dataset.src;
  if (!src) {
    return;
  }

  return fetchImage(src).then(() => { applyImage(image, src); });
}

/**
* Load all of the images immediately
* @param {NodeListOf<Element>} images
*/
function loadImagesImmediately(images) {
  return images.forEach(image => {
    preloadImage(image);
  });
}

/**
* Disconnect the observer
*/
function disconnect() {
  if (!observer) {
    return;
  }

  observer.disconnect();
}

/**
* On intersection
* @param {array} entries
*/
function onIntersection(entries) {
  // Disconnect if we've loaded all the images
  if (imageCount === 0) {
    observer.disconnect();
  }

  // Loop through the entries
  entries.forEach(entry => {
    // Check if in viewport
    if (entry.intersectionRatio > 0) {
      imageCount--;

      // Stop watching and load the image
      observer.unobserve(entry.target);
      preloadImage(entry.target);
    }
  });
}

/**
* Apply the image
* @param {object} img
* @param {string} src
*/
function applyImage(img, src) {
  // Prevent this from being lazy loaded a second time
  img.classList.add('lazy-image--handled');
  img.src = src;
  img.classList.add('fade-in');
}

function loadHeroImage() {
  const heroImage = document.getElementsByClassName('mountains')[0];

  heroImage.src = 'img/mountains.jpg';
  heroImage.classList.add('fade-in');
}

window.onload = loadHeroImage;
