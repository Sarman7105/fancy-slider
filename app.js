const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchForm = document.getElementById('search');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length < 1) {
    document.getElementById('error-area').style.display = 'block';
    document.getElementById('spinners').classList.add('d-none');
    gallery.innerHTML = '';
  }
  else {
    document.getElementById('error-area').style.display = 'none';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
      document.getElementById('spinners').classList.add('d-none');

    })
  }

}

const getImages = (query) => {
  document.getElementById('spinners').classList.remove('d-none');
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
  
    .then(data => {
      // console.log(data.hits);
      showImages(data.hits)
    })

    .catch(err => console.log('no data found'))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  // console.log('function is called');
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  // console.log(item);
  if (item === -1) {
    
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
  // console.log(sliders);
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  // console.log(document.getElementById('duration').val);
  let duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    alert("duration can't be negative default time 1000ms is assigned");
    duration = 1000;
  }
  // const duration = 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
searchForm.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
})
document.getElementById('back-button').addEventListener('click', function () {
  location.reload();
})