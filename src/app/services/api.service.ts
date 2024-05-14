import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import { Constants as constants } from '../constants'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(url: string) {
    const fullUrl = url.includes(constants.BASE_URL) ? url : `${constants.BASE_URL}${url}`;
    return this.httpClient.get(fullUrl);
  }



  // implement getRepos method by referring to the documentation. Add proper types for the return type and params 
}
