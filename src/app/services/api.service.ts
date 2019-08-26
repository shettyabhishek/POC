import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

//importing the case model 
import { Case } from '../model/case';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    apiURL: string = '../../assets/data/cases.json';
    constructor(private httpClient: HttpClient) { }

    //Function to fetch cases
    public getAllCases(): Observable<any>{
        return this.httpClient.get(this.apiURL).pipe(map(this._extractData));
    }
    private _extractData(res: Response){
        let body = res;
        return  body || {};
    }
}
