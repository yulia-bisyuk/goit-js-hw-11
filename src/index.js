import './sass/main.scss';
import bootstrap from 'bootstrap';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a');
const queryString = require('query-string');
const refs = {
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('input'),
    searchingBtn: document.querySelector('.btn-outline-success'),
    loadingBtn: document.querySelector('.btn-secondary'),
}

refs.searchingBtn.addEventListener('click', onSearchSubmit);

let currentPage = 1;

async function fetchPictures() {

    const API_KEY = '25297171-b070f342ccd33435260198644';
    const BASE_URL = 'https://pixabay.com/api/';

    const params = {
        q: refs.input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
    };
    const searchParams = queryString.stringify(params);

    refs.gallery.innerHTML = '';
    try {
    const data = await fetch(`${BASE_URL}?key=${API_KEY}&${searchParams}`);
        const pictures = await data.json();
        console.log(pictures);
        currentPage +=1;
        
        if (pictures.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        return pictures;
    } catch (error) {
        console.log(error);
}
}


function onSearchSubmit(e) {
    e.preventDefault();
    fetchPictures()
        .then(renderMarkup)
        .then((markup) => {
            refs.gallery.insertAdjacentHTML('beforeend', markup);
            lightbox.refresh();
            refs.loadingBtn.classList.remove('visually-hidden');
        });
}


function renderMarkup(pictures) {

    return pictures.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        console.log(webformatURL, likes);
       
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
    


}

