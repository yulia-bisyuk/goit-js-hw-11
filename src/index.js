import './sass/main.scss';
import axios from 'axios';
import bootstrap from 'bootstrap';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoTemplate from '../src/templates/photos-tmpl.hbs';

const queryString = require('query-string');
const Handlebars = require("handlebars");
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
let hitsPerPage = 40;

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

    if (!refs.input.value) return;

    try {
        const response = await axios.get(`?key=${API_KEY}&${searchParams}`);
        const pictures = await response.data;
        
            currentPage +=1;
        if (pictures.hits.length === 0) {
            refs.loadMoreBtn.classList.add('visually-hidden');
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        else if ((hitsPerPage * currentPage) > pictures.totalHits) {
            refs.loadMoreBtn.classList.add('visually-hidden');
            Notiflix.Notify.warning('We\'re sorry, but you\'ve reached the end of search results.');
        }
        else {
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
    loadMore();
    
}

function infinityScroll() {
    let options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
    }

    const handleObserver = ([item]) => {
       
        if (item.isIntersecting) {
            loadMore();
        }
    }
    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(refs.loadMoreBtn);
}

infinityScroll();

function loadMore() {
 
 fetchPictures().then(renderMarkup);

}

function renderMarkup(pictures) {

    const markup = photoTemplate(pictures.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    
}

