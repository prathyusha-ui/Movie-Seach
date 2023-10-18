import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieSearch__c";

export default class MovieDetail extends LightningElement {
    subscription = null;
    loadComponent = false;
    movieDetails = {};

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }
    handleMessage(message) {
        let movieSelectedId = message.movieId;
        console.log("movieSelectedId", movieSelectedId);
        this.fetchMovieDetail(movieSelectedId);
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async fetchMovieDetail(movieSelectedId) {
        let url=`https://www.omdbapi.com/?i=${movieSelectedId}&plot=full&apikey=1bd7a423`
        let res = await fetch(url);
        let data = await res.json();
        console.log("Selected Movie Deatils", data);
        this.loadComponent = true;
        this.movieDetails = data;
        
    }

}