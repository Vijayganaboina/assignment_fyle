import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { ApiService } from "./services/api.service";
import { of } from 'rxjs';
import { FormsModule } from "@angular/forms";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('ApiService', ['getUser']);
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FormsModule,
      ],
      providers: [{ provide: ApiService, useValue: mockService }]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

it('should fetch user details and repositories when fetchDataFromApi is called with a valid username', fakeAsync(() => {
  const username = 'johnpapa';
  const userDetails = { name: 'john' };
  const repositories = [{ 
    "name": "demo",
    "full_name": "Akash5657/demo",
    "languages_url": "https://api.github.com/repos/Akash5657/demo/languages",
  }];
  const languagesResponse = {
    "JavaScript": 1051,
    "CSS": 806,
    "HTML": 237
  };
  mockService.getUser.withArgs(`users/${username}`).and.returnValue(of(userDetails));
  mockService.getUser.withArgs(`users/${username}/repos`).and.returnValue(of(repositories));
  mockService.getUser.and.returnValue(of(languagesResponse)); // Mock getUser for languages

  component.username = username;
  component.fetchDataFromApi();
  tick(); // Simulate passage of time to allow for async operations

  expect(component.userDetails).toEqual(userDetails);
  expect(component.repositories).toEqual(repositories);
  expect(component.repositoriesWithLanguages).toEqual([{ name: 'demo', html_url: undefined, description: undefined, languages: ["JavaScript", "CSS", "HTML"] }]);
  expect(mockService.getUser).toHaveBeenCalledWith(`users/${username}`);
  expect(mockService.getUser).toHaveBeenCalledWith(`users/${username}/repos`);
  expect(mockService.getUser.calls.count()).toBe(3); // Ensure getUser is called only twice
}));


  it('should log an error when fetchDataFromApi is called with an empty username', () => {
    spyOn(console, 'error');
    component.username = '';
    component.fetchDataFromApi();

    expect(console.error).toHaveBeenCalledWith('Username is required');
    expect(mockService.getUser).not.toHaveBeenCalled();
  });

});
