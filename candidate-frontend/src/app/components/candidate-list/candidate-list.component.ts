import { Component, Input, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Candidate } from 'src/app/models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css'],
})
export class CandidateListComponent {
  displayedColumns = [
    'name',
    'surname',
    'seniority',
    'years',
    'availability',
  ];

  dataSource = new MatTableDataSource<Candidate>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @Input()
  set candidates(data: Candidate[]) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  @Input() lastAddedCandidate: Candidate | null = null;
  @Input() highlightNew = true;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isNew(row: Candidate): boolean {
    return this.highlightNew && row === this.lastAddedCandidate;
  }
}
