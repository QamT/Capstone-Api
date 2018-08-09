const news = {
  URL: function(){
    return this.searchTerm ? `https://newsapi.org/v2/everything?q=${this.searchTerm}&language=en&sortBy=popularity&apiKey=${this.apiKey}` :
                             `https://newsapi.org/v2/top-headlines?country=us&category=${this.category}&pageSize=5&apiKey=${this.apiKey}`;                     
  },
  apiKey: '288be39487e849e69452bd97b766832e',
  searchTerm: '',
  category: '',
  // template: `<li class='news-result'>
  //             <a href='${data.url}' target='_blank' rel='noopener noreferrer'>
  //               <img src='${data.urlToImage}' class=${data.urlToImage ? '' : 'hidden'} alt='image'>
  //               <div>
  //                 <h3>${data.title}</h3>
  //                 <p>${data.source.name}</p>
  //               </div>
  //             </a>
  //           </li>
  //           <hr>`,
  init() {
    fetchData(this.URL())
    .then(data => renderNewsData(data.articles));
  }
}

const reddit = {
  URL: function() {
    return this.searchTerm ? `https://www.reddit.com/search.json?q=${this.searchTerm}` :
           `https://www.reddit.com/.json?limit=5`;
  },
  searchTerm: '',
  // template: `<li class='reddit-results'>
  //             <img src='${data.data.preview.images[0].source.url}' alt='thumbnail'>
  //             <div class='reddit-results_info'>
  //               <span>Score: ${data.data.score}</span>
  //               <a href='https://www.reddit.com${data.data.permalink}' target='_blank' rel='noopener noreferrer'>
  //                 <h3>${data.data.title}</h3>
  //                 <p>${data.data.author}</p>
  //               </a>
  //               <a href='https://www.reddit.com/${data.data.subreddit_name_prefixed}' target='_blank' rel='noopener noreferrer'>
  //                 <p>Subreddit: ${data.data.subreddit}</p>
  //               </a>
  //             </div>
  //           </li>
  //           <hr>`,
  init() {
    fetchData(this.URL())
    .then(data => renderRedditData(data.data.children));
  }
}

const youtube = {
  URL: function() {
    return this.searchTerm ? `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.searchTerm}&maxResults=20&key=${this.apiKey}` :
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=5&regionCode=us&key=${this.apiKey}`
  },
  apiKey : 'AIzaSyAWIf0o8EKYS4YqbXrVLMmIR3-dOrLgteE',
  searchTerm: '',
  // template: `<li class='youtube-results'>
  //             <a href='https://www.youtube.com/watch?v=${data.id}' target='_blank' rel='noopener noreferrer'>
  //               <img src='${data.snippet.thumbnails.medium.url}' alt='thumbnail'>  
  //             </a>
  //             <div>
  //               <a href='https://www.youtube.com/watch?v=${data.id}' target='_blank' rel='noopener noreferrer'>
  //                 <h3>${data.snippet.title}</h3>
  //               </a>
  //               <a href='https://www.youtube.com/channel/${data.snippet.channelId}' target='_blank' rel='noopener noreferrer'>
  //                 <p>${data.snippet.channelTitle}</p>
  //               </a>
  //             </div>               
  //           </li>
  //           <hr>`,
  init() {
    fetchData(this.URL())
    .then(data => renderYoutubeData(data.items));
  }
}

init();

const cards = document.getElementsByClassName('content_card');
const newsResults = document.querySelector('.content_card-results1');
const newsCategories = document.querySelectorAll('.news-navbar li');
const newsNavbar = document.getElementsByClassName('news-navbar')[0];
const newsMenu = document.getElementsByClassName('menu')[0];
const redditResults = document.querySelector('.content_card-results2');
const youtubeResults = document.querySelector('.content_card-results4');
const form = document.getElementById('search');

function fetchData(url) {
    return fetch(url)
           .then(res => res.json())
           .catch(err => console.log(err));  
}

function renderNewsData(data) {
  let result = '';
  let error = showError(data, news.searchTerm);
  console.log(data);
  data.forEach(data => {
    result += `<li class='news-result'>
                <img src='${data.urlToImage ? data.urlToImage: '#'}' class=${data.urlToImage ? null : 'hidden'} alt='news image'>
                <a href='${data.url}' target='_blank' rel='noopener noreferrer'>               
                  <h3>${data.title}</h3>
                  <p>${data.source.name}</p>                 
                </a>
                </li>
                <hr>`
  });
  newsResults.innerHTML = result ? result : error;
  let lis = Array.from(document.querySelectorAll('.content_card-results1 li'));
  transition(lis);
}

function renderRedditData(data) {
  let result = '';
  let error = showError(data, reddit.searchTerm);
  console.log(data);
  data.forEach(data => {
    result += `<li class='reddit-results'>
                <img src='${data.data.preview ? data.data.preview.images[0].source.url : 'https://www.joeyoungblood.com/wp-content/uploads/2016/02/reddit-logo.jpg'}' alt='thumbnail'>
                <div class='reddit-results_info'>
                  <span>Score: ${data.data.score}</span>
                  <a href='https://www.reddit.com${data.data.permalink}' target='_blank' rel='noopener noreferrer'>
                    <h3>${data.data.title}</h3>
                    <p>${data.data.author}</p>
                  </a>
                  <a href='https://www.reddit.com/${data.data.subreddit_name_prefixed}' target='_blank' rel='noopener noreferrer'>
                    <p>Subreddit: ${data.data.subreddit}</p>
                  </a>
                </div>
              </li>
              <hr>`
  });
  redditResults.innerHTML = result ? result : error;
  let lis = Array.from(document.querySelectorAll('.content_card-results2 li'));
  transition(lis);
}

function renderYoutubeData(data) {
  let results = '';
  let error = showError(data, youtube.searchTerm);
  console.log(data);
  data.forEach(data => {
    results += `<li class='youtube-results'>
                  <a href='https://www.youtube.com/watch?v=${data.id.videoId ? data.id.videoId : data.id}' target='_blank' rel='noopener noreferrer'>
                    <img src='${data.snippet.thumbnails.medium.url}' alt='thumbnail'>  
                  </a>
                  <div>
                    <a href='https://www.youtube.com/watch?v=${data.id.videoId ? data.id.videoId : data.id}' target='_blank' rel='noopener noreferrer'>
                      <h3>${data.snippet.title}</h3>
                    </a>
                    <a href='https://www.youtube.com/channel/${data.snippet.channelId}' target='_blank' rel='noopener noreferrer'>
                      <p>${data.snippet.channelTitle}</p>
                    </a>
                  </div>               
                </li>
                <hr>`
  });
  youtubeResults.innerHTML = results ? results : error;
  let lis = Array.from(document.querySelectorAll('.content_card-results4 li'));
  transition(lis);
}

function showError(data, value) {
  return data.length === 0 ? `<div class='error'>
                                <h3>No results found for ${value}</h3>
                                <p>Try a different keyword</p>
                              </div>` : null;
}

function transition(elements) {
  elements.forEach((li, i) => {
   
      li.style.animation = i < 5 ? `fadeIn ${i + 1}s` : `fadeIn 5s`;
      li.style.opacity = 1;
  });
}

function openContent(element) {
  console.log(element);
  // window.open(url, '_blank', `toolbar=yes, scrollbars=yes, resizable=yes, top=${window.innerHeight/2}, left=${window.innerWidth/2}, width=500, height=500`);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let searchBar = document.getElementById('search-bar');
  let searchTerm = searchBar.value;
  let searchContent = document.getElementById('content-select').value;
  
  if(searchTerm) {
    switch(searchContent) {
      case 'all':
        news.searchTerm = reddit.searchTerm = youtube.searchTerm = searchTerm;
        init();
        break;
      case 'news':
        news.searchTerm = searchTerm;
        news.init();
        break;
      case 'reddit':
        reddit.searchTerm = searchTerm;
        reddit.init();
        break;
      case 'youtube':
        youtube.searchTerm = searchTerm;
        youtube.init();
        break;
    }
    searchBar.value = '';
  }
});


Array.from(cards).forEach(card => card.addEventListener('click', (e) => {

  if (e.target.parentElement.nodeName === 'A' && window.innerHeight > 500 && window.innerWidth > 860) {
    e.preventDefault();
    let url = e.target.parentElement.attributes[0].nodeValue;
    window.open(url, '_blank', `toolbar=yes,scrollbars=yes,resizable=yes,top=${window.innerHeight/4},left=${window.innerWidth/4},width=${window.innerWidth/(1.7)},height=${window.innerHeight/(1.5)}`);
  }
}));

Array.from(newsCategories).forEach(category => category.addEventListener('click', (e) => {
  news.category = e.target.dataset.category;
  news.init();
}));

newsMenu.addEventListener('click', () => {
  newsNavbar.classList.toggle('collapse');
})

function init() {
  news.init();
  reddit.init();
  youtube.init();
}

//optimization

//responsiveness
//loading data efficiently
//accessibility 
//transitions
//styling
//add web icon
//refactor