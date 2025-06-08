// src/app/app.component.ts

import { Component, signal, effect, OnInit } from '@angular/core';
import { Candidate } from './models/candidate.model';
import { CandidateFormComponent } from './components/candidate-form/candidate-form.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { CandidateService } from './services/candidate.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    CandidateFormComponent,
    CandidateListComponent,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  readonly candidates = signal<Candidate[]>(
    JSON.parse(localStorage.getItem('candidates') ?? '[]')
  );
  readonly lastAddedCandidate = signal<Candidate | null>(null);
  readonly highlightNew = signal(true);

  constructor(private candidateService: CandidateService, private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  private persistEffect = effect(() => {
    const data = this.candidates();
    localStorage.setItem('candidates', JSON.stringify(data));
  });

  onCandidateAdded(candidate: Candidate) {
    this.candidates.update(curr => [candidate, ...curr]);
    this.lastAddedCandidate.set(candidate);
    this.snackBar.open(`Candidato “${candidate.name} ${candidate.surname}” añadido`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

}
