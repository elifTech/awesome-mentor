import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

const API_URL = 'https://www.googleapis.com/youtube/v3/search/';
const API_KEY = 'AIzaSyDbnGLGNfwf5OcfzC5UJpv59MC78Ityu2k';

@Injectable()
export class YouTubeService {
    private limit: number;
    constructor (private _http: Http) {
        this.limit = 5;
    }

    // search(query: string) {
    //     const API_URL = 'https://www.googleapis.com/youtube/v3/search/';
    //     const API_KEY = 'AIzaSyDbnGLGNfwf5OcfzC5UJpv59MC78Ityu2k';
    //
    //     return this._http
    //         .get(`${API_URL}?q=${query}&key=${API_KEY}&part=snippet`)
    //         .map(response => response.json())
    //         .map(res => res.items);
    // }
    
    search(query: string, addToLimit?: number) {
        var limit = this.limit;
        if(addToLimit) limit += addToLimit;
        return this._http
            .get(`${API_URL}?q=${query}&key=${API_KEY}&part=snippet&limit=${limit}`)
            .toPromise();
    }
}