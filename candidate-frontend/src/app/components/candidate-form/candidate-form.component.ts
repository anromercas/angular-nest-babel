import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Candidate } from 'src/app/models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
})
export class CandidateFormComponent {
  @Output() candidateAdded = new EventEmitter<Candidate>();

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    file: new FormControl<File | null>(null, [Validators.required]),
  });

  isSubmitting = false;
  errorMsg: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  
  constructor(private candidateService: CandidateService) {}

  onFileSelected(event: Event) {
    console.log('File selected:', event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.form.patchValue({ file });
      this.form.get('file')!.updateValueAndValidity();
      this.errorMsg = null;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.errorMsg = null;

    const { name, surname, file } = this.form.value;
    if (!(file instanceof File)) {
      this.errorMsg = 'Archivo inválido';
      this.isSubmitting = false;
      return;
    }

    this.candidateService.uploadCandidate(name!, surname!, file).subscribe({
      next: (candidate) => {
        this.candidateAdded.emit(candidate);
        this.form.reset({
          name: '',
          surname: '',
          file: null,
        });
        this.form.get('file')?.setErrors(null);
        this.form.markAsPristine();
        this.form.markAsUntouched();
        Object.values(this.form.controls).forEach(control => {
          control.setErrors(null);
        });
        if (this.fileInputRef?.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
        }
        this.errorMsg = null;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMsg = err.message;
        this.isSubmitting = false;
      },
    });
  }
}
