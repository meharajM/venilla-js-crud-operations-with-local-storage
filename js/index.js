
class Tweets {
    constructor(){
        this.tweets = this.getStoredTweets();
        this.sortByDate;
    }
    getStoredTweets() {
        const tweetsList = localStorage.getItem('tweets');
        if (tweetsList) {
            return JSON.parse(tweetsList).map((tweet) => new Tweet(tweet));
        }
        return [];
    }
    saveTweetsToStore(tweetsList) {
        localStorage.setItem('tweets', JSON.stringify(this.tweets));
    }
    addTweet(tweet) {
        this.tweets.push(tweet);
        this.sortByDate();
        this.saveTweetsToStore();
    }
    updateTweet(tweet) {
        const tweetObj = this.getById(tweet.id);
        tweetObj.text = tweet.text;
    }
    sortByDate() {
        this.tweets.sort((tweet1, tweet2) => {
            return tweet2.date.getTime() - tweet1.date.getTime();
        });


    }
    getTweetsList() {
        return this.tweets;
    }
    loadTweets() {
        const tweetsList = this.getTweetsList();
        const tweetListContainer = document.querySelector(".tweet-list-container");
        const ul = document.createElement('div');
        tweetsList.forEach(tweetObj => {
            const li = document.createElement('li');
            const tweetContent = tweetObj.getTweetHtml();
            const tweetContainer = document.createElement('div');
            tweetContainer.setAttribute('class', 'tweet-container');
            tweetContainer.innerHTML = tweetContent;
            li.appendChild(tweetContainer);
            ul.appendChild(li);        
        });
        tweetListContainer.replaceChild(ul, tweetListContainer.childNodes[0]);
        setOptionsEvents();

    }
    delete(tweet) {
        this.tweets = this.tweets.filter((tweetObj) => tweetObj.id != tweet.id)
        this.saveTweetsToStore();
        this.loadTweets();
        setOptionsEvents();
    }
    getById(id) {
        const tweets = this.tweets;
        for(let i=0;i<tweets.length-1;i++) {
            if (tweets[i].id == id) {
                return tweets[i];
            }
        }
    }
}
function Tweet(tweet){
        this.text = tweet.text || "";
        this.date = tweet.date ? new Date(tweet.date) : new Date();
        this.id = tweet.id || this.date.getTime();
    }

    Tweet.prototype.edit = function(text) {
        this.text = text;
    }
    Tweet.prototype.getTweet = function() {
        return this;
    }
    Tweet.prototype.getReadableTime = function(){
        const date = this.date;
        return {
            year: date.getFullYear(),
            month: date.getMonth()+1,
            date: date.getDate(),
            hours: date.getHours(),
            mins: date.getMinutes(),
            secs: date.getSeconds(),
        }
            
         
    }
    Tweet.prototype.getTweetHtml = function(){
        const tweetTemplate = document.querySelector('.templates #tweet-template').innerHTML;
        const readableTime = this.getReadableTime();
        const time = `${readableTime.date}/${readableTime.month}/${readableTime.year} ${readableTime.hours}:${readableTime.mins}`;
        return tweetTemplate.replace('{{text}}', this.text).replace('{{time}}', time).replace('{{id}}', this.id);
    }
    



function saveTweet(ev) {
    const tweetText = document.querySelector('#tweet-text');
    const tweetObj = {text: tweetText.value};
    const id = ev.currentTarget.getAttribute('data-id');
    if (id) {
        tweetObj.id = id;
        tweetObj.date = id;
    }
    const tweet = new Tweet(tweetObj);
    if (id) {
        tweets.updateTweet(tweet);
        ev.currentTarget.removeAttribute('data-id')
    } else {
    tweets.addTweet(tweet);

    }
    tweetText.value = "";
    tweets.loadTweets();
}
function onDelete(ev) {
    const id = ev.currentTarget.id;
    tweets.delete({id});
}
function onEdit(ev) {
    const id = ev.currentTarget.id;
    const tweet = tweets.getById(id);
    const textArea = document.querySelector('#tweet-text');
    textArea.value = tweet.text;
    saveBtn.setAttribute('data-id', id);
}
function setOptionsEvents() {
    const deleteBtn = document.querySelectorAll('.tweet-list-container .options .delete');
    const editBtn = document.querySelectorAll('.edit');
    for(let i=0; i< editBtn.length -1; i++ ){
        deleteBtn[i].addEventListener('click', onDelete);
    editBtn[i].addEventListener('click', onEdit);

    }


}
    const saveBtn = document.querySelector('#save-tweet');
    saveBtn.addEventListener('click', saveTweet);
    const tweets = new Tweets();
    tweets.loadTweets();
    setOptionsEvents();