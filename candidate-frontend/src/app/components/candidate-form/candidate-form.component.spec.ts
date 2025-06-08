import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidateFormComponent } from './candidate-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CandidateService } from '../../services/candidate.service';
import { of, throwError } from 'rxjs';
import { Candidate } from 'src/app/models/candidate.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let mockService: Partial<CandidateService>;

  beforeEach(async () => {
    mockService = { uploadCandidate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        CandidateFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [{ provide: CandidateService, useValue: mockService }],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(CandidateFormComponent, {
      set: { template: '', styles: [] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form should have 3 controls and be invalid initially', () => {
    expect(Object.keys(component.form.controls)).toEqual(['name','surname','file']);
    expect(component.form.valid).toBe(false);
  });

  it('onSubmit() emits and resets on success', fakeAsync(() => {
    const fake: Candidate = { name:'T', surname:'U', seniority:'junior', years:2, availability:true };
    (mockService.uploadCandidate as jest.Mock).mockReturnValue(of(fake));

    const file = new File(['d'], 'f.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    component.form.setValue({ name:'T', surname:'U', file });

    const spy = jest.spyOn(component.candidateAdded, 'emit');
    component.onSubmit();
    tick();

    expect(spy).toHaveBeenCalledWith(fake);
    expect(component.form.value.name).toBe('');
    expect(component.errorMsg).toBeNull();
    expect(component.isSubmitting).toBe(false);
  }));

  it('onSubmit() sets errorMsg on service error', fakeAsync(() => {
    (mockService.uploadCandidate as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
    component.form.setValue({
      name: 'X',
      surname: 'Y',
      file: new File([''], 'x.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    });

    component.onSubmit();
    tick();

    expect(component.errorMsg).toBe('fail');
    expect(component.isSubmitting).toBe(false);
  }));
});
