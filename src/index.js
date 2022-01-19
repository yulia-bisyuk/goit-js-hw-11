import './sass/main.scss';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const queryString = require('query-string');
const refs = {
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('.btn-outline-success'),
    loadMoreBtn: document.querySelector('.btn-success'),
}

refs.searchBtn.addEventListener('click', onSearchSubmit);
refs.input.addEventListener('change', onInputChange);
refs.loadMoreBtn.addEventListener('click', onSearchSubmit);

let lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
let hitsPerPage = 100;


async function fetchPictures() {

    const API_KEY = '25297171-b070f342ccd33435260198644';
    axios.defaults.baseURL = 'https://pixabay.com/api/';
  

    const params = {
        q: refs.input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: hitsPerPage,
    };
    const searchParams = queryString.stringify(params);
    console.log(searchParams);

    if (!refs.input.value) return;

    try {
        const response = await axios.get(`?key=${API_KEY}&${searchParams}`);
        // console.log(data);
        const pictures = await response.data;
        console.log(pictures);
            currentPage +=1;
        if (pictures.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else if ((hitsPerPage * currentPage) > pictures.totalHits) {
            Notiflix.Notify.warning('We\'re sorry, but you\'ve reached the end of search results.');
        }
        else {
            Notiflix.Notify.info(`Hooray! We found ${pictures.totalHits} images.`);
            refs.loadMoreBtn.classList.remove('visually-hidden');
        }
        return pictures;
    } catch (error) {
        console.log(error);
}
}

function onInputChange(e) {
    
   const previousInputValue = localStorage.setItem('value', e.currentTarget.value)
    if (previousInputValue !== e.currentTarget.value) {
        refs.gallery.innerHTML = '';
        currentPage = 1;
        
    } 
   
}

function onSearchSubmit(e) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    e.preventDefault();
    fetchPictures().then(renderMarkup); 
    
}
// function onLoadMoreBtn() {
//     fetchPictures().then(renderMarkup);
//         // .then((markup) => {
//             // refs.gallery.insertAdjacentHTML('beforeend', markup);
//             // lightbox.refresh();
//             // refs.loadMoreBtn.classList.remove('visually-hidden');
//         // });;
//  }

function renderMarkup(pictures) {

   const markup = pictures.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {

        return `
        <div class="img-thumb">
        <a href="${largeImageURL}" class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="370px" height="294"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      <br> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>
      <br> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <br> ${comments}
    </p>
    <p class="info-item">
      <b >Downloads:</b>
      <br> ${downloads}
    </p>
  </div>
  </div>
`;
    }).join('');
   
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    
    
}

