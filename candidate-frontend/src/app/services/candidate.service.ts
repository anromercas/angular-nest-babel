import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates';

  constructor(private http: HttpClient) {}

  uploadCandidate(
    name: string,
    surname: string,
    file: File
  ): Observable<Candidate> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('file', file, file.name);

    return this.http.post<Candidate>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en uploadCandidate:', error);
        return throwError(
          () => new Error(error.error?.message || 'Error al subir candidato')
        );
      })
    );
  }
}
