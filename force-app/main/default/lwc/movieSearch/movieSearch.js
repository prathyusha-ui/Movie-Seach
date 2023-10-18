import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieSearch__c";


const DELAY = 300;

export default class MovieSearch extends LightningElement {
    selectedType = "";
    selectedSearch = "";
    selectedPageno = "1";
    delayTimeout;
    loading = false;
    searchResults = [];
    selectedMovie = "";

    @wire(MessageContext)
    messageContext;


    get typeoptions() {
        return [
            { label: "None", value:"" },
            { label: "Movie", value: "movie" },
            { label: "Series", value: "series" },
            { label: "Episodes", value: "episode" },
        ];
    }

    handleChange(event) {
        this.loading = true;
        let { name, value } = event.target;
        if (name === "type") {
            this.selectedType = value;
        } else if (name === "search") {
            this.selectedSearch = value;
        } else if (name === "pageno") {
            this.selectedPageno = value;
        }
        //debouncing used to avoid frequent API/Apex call ::on search of everyletter
        clearTimeout(this.delayTimeout);
       this.delayTimeout= setTimeout(() => {
            this.searchMovie()
        },DELAY)
    }
    
    //To make API call,search for entered name

    async searchMovie() {
        const url = `https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPageno}&apikey=1bd7a423`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("movie search output::", data);
        this.loading = false;
        if (data.Response === "True") {
            this.searchResults = data.Search
        }

    }

    movieSelectedHandler(event) {
        this.selectedMovie = event.detail;

        const payload = { movieId: this.selectedMovie};

        publish(this.messageContext, MOVIE_CHANNEL, payload);
        
    }

    get displayResult() {
        return this.searchResults.length > 0 ? true :false
    }

   

}