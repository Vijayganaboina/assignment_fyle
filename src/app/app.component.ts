
import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    
  }

  // Properties
  username: string = '';
  userDetails: any; // user details
  repositories: any;
  repositoriesWithLanguages: any = [];
  

  // Fetch user details and repositories
  fetchDataFromApi() {
    
    if (this.username.trim() === '') {
      //console.error("Username is required");
      return;
    }
    
    this.fetchUserDetails();
    this.fetchUserRepositories();
  }

  // Fetch user details
  private fetchUserDetails() {
    const url = `users/${this.username}`;
    this.apiService.getUser(url).pipe(
      catchError(error => {
        if (error.status === 404) {
          //console.error('User not found:', error);
          this.username='';
      }
      return "error";
    }
    )) .subscribe((response) => {
      this.userDetails = response;
      //console.log(this.userDetails);      
    }
    );
  }

  // Fetch user repositories
  private fetchUserRepositories() {
    const url = `users/${this.username}`;
    this.apiService.getUser(`${url}/repos`).subscribe((response) => {
      this.repositories = response;      
      this.fetchLanguages();
    });
  }

  // Fetch languages for repositories
  private fetchLanguages() {
    this.repositoriesWithLanguages = [];
    this.repositories.forEach((repo: any) => {
      
      this.apiService.getUser(repo.languages_url).subscribe(languagesResponse => {
        this.repositoriesWithLanguages.push({ 
          name: repo.name, 
          html_url: repo.html_url, 
          description: repo.description, 
          languages: Object.keys(languagesResponse) 
        });
      }); 
    });
    
  }
  
}
