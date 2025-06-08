import { TestBed } from '@angular/core/testing';
import { CandidateService } from './candidate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Candidate } from '../models/candidate.model';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidateService],
    });
    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('uploadCandidate() should POST to full URL and return candidate', () => {
    const file = new File(['x'], 'a.xlsx', { type: '' });
    const resp: Candidate = { name:'A', surname:'B', seniority:'junior', years:1, availability:true };

    service.uploadCandidate('A','B',file).subscribe(r => expect(r).toEqual(resp));

    const req = httpMock.expectOne('http://localhost:3000/candidates');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeInstanceOf(FormData);
    req.flush(resp);
  });
});
