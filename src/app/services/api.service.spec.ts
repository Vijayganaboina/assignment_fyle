import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { Constants } from '../constants';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to getUser endpoint', () => {
    const mockUrl = 'api/user';
    const matchUrl = "https://api.github.com/api/user";
    const mockResponse = { name: 'John', username: 'john123' };

    service.getUser(mockUrl).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(matchUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should append base URL if not present in getUser method', () => {
    const mockUrl = 'user';
    const expectedUrl = Constants.BASE_URL + 'user';
    const mockResponse = { name: 'John', username: 'john123' };

    service.getUser(mockUrl).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
});
