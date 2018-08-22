const news = {
  url() {
    return this.searchTerm ? `https://newsapi.org/v2/everything?q=${this.searchTerm}&language=en&sortBy=popularity&apiKey=${this.apiKey}` :
                             `https://newsapi.org/v2/top-headlines?country=us&category=${this.category}&pageSize=10&apiKey=${this.apiKey}`;                     
  },
  apiKey: '288be39487e849e69452bd97b766832e',
  searchTerm: '',
  category: '',
  init() {
    fetchData(this.url())
    .then(data => renderNewsData(data.articles));
  }
}

const reddit = {
  url() {
    return this.searchTerm ? `https://www.reddit.com/search.json?q=${this.searchTerm}&limit=15` :
           `https://www.reddit.com/.json?limit=10`;
  },
  searchTerm: '',
  init() {
    fetchData(this.url())
    .then(data => renderRedditData(data.data.children));
  }
}

const youtube = {
  url() {
    return this.searchTerm ? `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.searchTerm}&maxResults=20&key=${this.apiKey}` :
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&regionCode=us&key=${this.apiKey}`
  },
  apiKey : 'AIzaSyAWIf0o8EKYS4YqbXrVLMmIR3-dOrLgteE',
  searchTerm: '',
  init() {
    fetchData(this.url())
    .then(data => renderYoutubeData(data.items));
  }
}

init();

const form = document.getElementById('search'),
      cards = document.getElementsByClassName('content_card'),
      newsResults = document.getElementsByClassName('news-results')[0],
      newsCategories = document.querySelectorAll('.news-navbar li'),
      newsNavbar = document.getElementsByClassName('news-navbar')[0],
      newsMenu = document.getElementsByClassName('news-menu')[0],
      redditResults = document.getElementsByClassName('reddit-results')[0],
      youtubeResults = document.getElementsByClassName('youtube-results')[0];

function fetchData(url) {
    return fetch(url)
           .then(res => res.json())
           .catch(err => console.log(err));  
}

//Render Data

function renderNewsData(data) {
  let result = '';
  let error = showError(data, news.searchTerm, 'news');
  console.log(data);
  data.forEach(data => {
    result += `<li class='news-results_result'>
                <div class=${data.urlToImage ? 'lazy1' : null}><img data-src1='${data.urlToImage || '#'}' class=${data.urlToImage ? null : 'hidden'} alt='news image'></div>
                <a href='${data.url}' target='_blank' rel='noopener noreferrer'>               
                  <h3>${data.title}</h3>
                  <p>${data.source.name}</p>                 
                </a>
                </li>
                <hr>`
  });
  newsResults.innerHTML = result || error;
  loadImages(1);
  let lis = document.querySelectorAll('.news-results li');
  transition([...lis]);
}

function renderRedditData(data) {
  let result = '';
  let topic = document.querySelector('.content_card--2 > p');
  let error = showError(data, reddit.searchTerm, 'reddit');
  console.log(data);
  data.forEach(data => {
    let title = data.data.title.split(' ').splice(0, 20).join(' ');
    result += `<li class='reddit-results_result'>
                <div class=${data.data.preview ? 'lazy2' : null}><img data-src2='${data.data.preview ? data.data.preview.images[0].source.url : 'https://www.joeyoungblood.com/wp-content/uploads/2016/02/reddit-logo.jpg'}' alt='reddit thumbnail'></div>
                <div class='reddit-results_result-info'>
                  <span>Score: ${data.data.score}</span>
                  <a href='https://www.reddit.com${data.data.permalink}' target='_blank' rel='noopener noreferrer'>
                    <h3>${title.split(' ').length == 20 ? title + '...' : title}</h3>
                    <p>${data.data.author}</p>
                  </a>
                  <a href='https://www.reddit.com/${data.data.subreddit_name_prefixed}' target='_blank' rel='noopener noreferrer'>
                    <p>Subreddit: ${data.data.subreddit}</p>
                  </a>
                </div>
              </li>`
  });
  redditResults.innerHTML = result || error;
  if (!error) {
    topic.textContent = reddit.searchTerm || 'Popular';
  } else {
    topic.textContent = '';
  }
  loadImages(2);
  let lis = document.querySelectorAll('.reddit-results li');
  transition([...lis]);
}

function renderYoutubeData(data) {
  let results = '';
  let topic = document.querySelector('.content_card--4 > p');
  let error = showError(data, youtube.searchTerm, 'youtube');
  console.log(data);
  data.forEach(data => {
    results += `<li class='youtube-results_result'>
                  <a href='https://www.youtube.com/watch?v=${data.id.videoId || data.id}' target='_blank' rel='noopener noreferrer'>
                    <div class=lazy4><img data-src4='${data.snippet.thumbnails.medium.url}' alt='${data.snippet.title}'></div>
                    <span class=video-hover>Go To Video</span>
                  </a>
                  <div>
                    <a href='https://www.youtube.com/watch?v=${data.id.videoId || data.id}' target='_blank' rel='noopener noreferrer'>
                      <h3>${data.snippet.title}</h3>
                    </a>
                    <a href='https://www.youtube.com/channel/${data.snippet.channelId}' target='_blank' rel='noopener noreferrer'>
                      <p>${data.snippet.channelTitle}</p>
                    </a>
                  </div>               
                </li>`
  });
  youtubeResults.innerHTML = results || error;
  if (!error) {
    topic.textContent = youtube.searchTerm || 'Trending';
  } else {
    topic.textContent = '';
  }
  loadImages(4);
  let lis = document.querySelectorAll('.youtube-results li');
  transition([...lis]);
}

//Functions relevant to cards

function transition(elements) {
  elements.forEach((li, i) => {
      li.style.animation = i < 4 ? `fadeIn ${1.5 + (i * .5)}s` : `fadeIn 3s`;
  });
}

function loadImages(num) {
  [...document.querySelectorAll(`img[data-src${num}]`)].forEach((img) => {
    img.setAttribute('src', img.getAttribute(`data-src${num}`));
    img.onload = function() {
      img.parentNode.classList.remove(`lazy${num}`);
      img.removeAttribute(`data-src${num}`);
    };
  });
}

function showError(data, value, section) {
  return data.length === 0 ? `<div aria-live='polite' class='error'>
                                <h3>No results found for <span>${value}</span> in ${section} section</h3>
                                <p>Try a different keyword</p>
                              </div>` : null;
}

//Event Listeners

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchBar = document.getElementById('search-bar'),
        searchBtn = document.querySelector('.btn img');
  let searchTerm = searchBar.value,
      searchContent = document.getElementById('content-select').value;
  
  if(searchTerm) {
    searchBtn.src = 'images/build/spinner.gif';
    searchBtn.style.height = '3rem';
    setTimeout(() => {
      if (window.innerWidth > 860) {
        cards[0].scrollIntoView({ behavior: 'smooth'});
      }
      searchBtn.src = 'images/build/search.png';
      searchBtn.style.height = '2rem';
    }, 1000); 

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


[...cards].forEach(card => {
  card.addEventListener('click', openLink);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openLink(e);
    }
  });
});

function openLink(e) {
  if ((e.target.parentElement.nodeName === 'A' || e.target.nodeName === 'A') && window.innerHeight > 600 && window.innerWidth > 860) {
    e.preventDefault();
    let url = e.target.parentElement.href || e.target.href;
    window.open(url, '_blank', `toolbar=yes,scrollbars=yes,resizable=yes,top=${window.innerHeight/4},left=${window.innerWidth/4},width=${window.innerWidth/(1.7)},height=${window.innerHeight/(1.5)}`);
  }
}

[...newsCategories].forEach(category => {
  category.addEventListener('click', highlightCategory);
  category.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      highlightCategory(e);
    }
  });
});

function highlightCategory(e) {
  e.target.classList.toggle('bold');
  newsCategories.forEach(category => {
    if (category !== e.target) {
      category.classList.remove('bold');
    }
  });

  news.searchTerm = '';
  news.category = e.target.dataset.category;
  news.init();
}

if (window.innerWidth <= 1080) {
  newsCategories.forEach(category => {
    category.setAttribute('aria-hidden', 'true');
  });
}

newsMenu.addEventListener('click', collapseMenu);
newsMenu.addEventListener('keydown', (e) => {
  if (e.key = 'Enter') {
    collapseMenu(e);
  }
});

function collapseMenu(e) {
  newsNavbar.classList.toggle('collapse');
  let stateExpanded = newsMenu.getAttribute('aria-expanded');
  newsMenu.setAttribute('aria-expanded', `${stateExpanded === 'true' ? 'false' : 'true'}`);
  [...newsCategories].forEach(category => {
    category.setAttribute('aria-hidden', `${newsNavbar.classList.contains('collapse') ? 'false': 'true'}`);
  });
}

// Start

function init() {
  news.init();
  reddit.init();
  youtube.init();
}

