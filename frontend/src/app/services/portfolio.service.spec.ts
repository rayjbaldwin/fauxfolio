import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PortfolioService, PortfolioSummary } from './portfolio.service';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpTesting: HttpTestingController;
  const BASE_URL = 'http://localhost:3000/api/portfolios';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PortfolioService
      ]
    });

    service = TestBed.inject(PortfolioService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserPortfolios() should GET an array of portfolios', () => {
    const mockResponse: PortfolioSummary[] = [
      { id: 1, name: 'LOL' },
      { id: 2, name: 'Yes' }
    ];
    service.getUserPortfolios().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpTesting.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
