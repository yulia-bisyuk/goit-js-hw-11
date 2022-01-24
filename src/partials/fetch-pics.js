import axios from 'axios';

export async function fetchPictures(query, page) {
    
    const API_KEY = '25297171-b070f342ccd33435260198644';
    axios.defaults.baseURL = 'https://pixabay.com/api/';
  
    try {
        const response = await axios.get(`?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        const pictures = await response.data;

        return pictures;
        
    } catch (error) {
        console.log(error);
}
}
