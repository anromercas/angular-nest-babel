import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateListComponent } from './candidate-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Candidate } from '../../models/candidate.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;
  const mockData: Candidate[] = [
    { name: 'A', surname: 'B', seniority: 'junior', years: 1, availability: true },
    { name: 'C', surname: 'D', seniority: 'senior', years: 5, availability: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CandidateListComponent,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(CandidateListComponent, {
      set: { template: '', styles: [] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
    component.dataSource.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dataSource should have 2 items', () => {
    expect(component.dataSource.data.length).toBe(2);
  });

  it('isNew() returns true only for lastAddedCandidate when highlightNew is true', () => {
    component.lastAddedCandidate = mockData[1];
    component.highlightNew = true;
    expect(component.isNew(mockData[0])).toBe(false);
    expect(component.isNew(mockData[1])).toBe(true);
  });

  it('isNew() returns false when highlightNew is false', () => {
    component.lastAddedCandidate = mockData[1];
    component.highlightNew = false;
    expect(component.isNew(mockData[1])).toBe(false);
  });
});
