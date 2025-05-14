import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'report-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.css'
})
export class ReportViewComponent {
  reportText: string = '';
  filter: string = '';

  constructor(private http: HttpClient) {
    this.http.get('/report.txt', { responseType: 'text' }).subscribe(text => {
      this.reportText = text;
    });
  }

  get filteredLines(): string[] {
    if (!this.filter) return this.reportText.split('\n');
    return this.reportText
      .split('\n')
      .filter(line => line.toLowerCase().includes(this.filter.toLowerCase()));
  }

  download(): void {
    const blob = new Blob([this.reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}
