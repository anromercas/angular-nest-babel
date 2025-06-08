import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Candidate } from './models/candidate.model';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let snackBarMock: { open: jest.Mock };

  beforeEach(async () => {
    localStorage.clear();
    snackBarMock = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(AppComponent, {
      set: { template: '', styles: [] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes candidates from localStorage', () => {
    const init: Candidate[] = [{ name:'X', surname:'Y', seniority:'junior', years:1, availability:false }];
    localStorage.setItem('candidates', JSON.stringify(init));
    const f2 = TestBed.createComponent(AppComponent);
    expect(f2.componentInstance.candidates()).toEqual(init);
  });

  it('onCandidateAdded prepends, sets lastAddedCandidate and persists data', () => {
    const c: Candidate = { name:'N', surname:'M', seniority:'senior', years:3, availability:true };

    expect(component.candidates()).toEqual([]);
    component.onCandidateAdded(c);

    expect(component.candidates()[0]).toEqual(c);
    expect(component.lastAddedCandidate()).toEqual(c);
    const stored = JSON.parse(localStorage.getItem('candidates')!);
    expect(stored[0]).toEqual(c);
  });
});
