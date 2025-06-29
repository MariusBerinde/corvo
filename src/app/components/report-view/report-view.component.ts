import { Component,OnInit,Input  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LocalWriteService } from '../../services/local-write.service';
import { ActivatedRoute } from '@angular/router';
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

export class ReportViewComponent implements OnInit {
  @Input() ip: string = '';

  private readonly API_BASE = 'http://localhost:8083';
  reportText: string = '';
  filter: string = '';
  isLoading: boolean = false;
  error: string = '';
  username: string = '';

  constructor(private http: HttpClient,
    private storage: LocalWriteService,
 ) {}

  ngOnInit(): void {
    // Inizializza con i valori appropriati o ottienili dal servizio di autenticazione
    this.username = this.getCurrentUsername(); // Implementa questo metodo
    console.log("parametri di init IP=",this.ip,"\tusername=",this.username)

    if (this.username && this.ip) {
      this.loadReport();
    }
  }

  /**
   * Carica il report Lynis dal server
   */
  loadReport(): void {
    if (!this.username || !this.ip) {
      this.error = 'Username o IP mancanti';
      return;
    }

      console.log("lancio load report")
    this.isLoading = true;
    this.error = '';

    const headers = {
      'username': this.username,
      'ip': this.ip
    };


    const url = `${this.API_BASE}/getLynisReportByIp`;
    this.http.get(url, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (text: string) => {
        this.reportText = text;
        this.isLoading = false;
        console.log('✅ Report caricato con successo');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Errore nel caricamento del report:', error);

        if (error.status === 400) {
          this.error = 'Parametri non validi: ' + (error.error || 'Username o IP non validi');
        } else if (error.status === 404) {
          this.error = 'Report non trovato per questo IP';
        } else if (error.status === 503) {
          this.error = 'Servizio non disponibile: impossibile connettersi all\'agent';
        } else {
          this.error = 'Errore nel caricamento del report: ' + (error.error || error.message);
        }
      }
    });
  }

  /**
   * Ricarica il report
   */
  refreshReport(): void {
    this.loadReport();
  }

  /**
   * Cambia l'IP e ricarica il report (utile se l'IP cambia dinamicamente)
   */
  @Input()
  set ipAddress(newIp: string) {
    if (newIp && newIp !== this.ip) {
      this.ip = newIp;
      if (this.username) {
        this.loadReport();
      }
    }
  }

  /**
   * Restituisce le righe filtrate del report
   */
  get filteredLines(): string[] {
    if (!this.reportText) return [];
    if (!this.filter) return this.reportText.split('\n');

    return this.reportText
      .split('\n')
      .filter(line => line.toLowerCase().includes(this.filter.toLowerCase()));
  }

  /**
   * Scarica il report come file
   */
  download(): void {
    if (!this.reportText) {
      console.warn('Nessun report da scaricare');
      return;
    }

    const blob = new Blob([this.reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Nome file più descrittivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    a.download = `lynis_report_${this.ip}_${timestamp}.txt`;

    a.click();
    URL.revokeObjectURL(url);

    console.log('📥 Report scaricato');
  }

  /**
   * Pulisce il filtro
   */
  clearFilter(): void {
    this.filter = '';
  }

  /**
   * Conta le righe che corrispondono al filtro
   */
  get filteredCount(): number {
    return this.filteredLines.length;
  }

  /**
   * Conta il totale delle righe
   */
  get totalLines(): number {
    return this.reportText ? this.reportText.split('\n').length : 0;
  }

  // Metodo da implementare in base alla tua architettura
  private getCurrentUsername(): string {
    // Implementa la logica per ottenere l'username corrente
    // Esempio: return this.authService.getCurrentUser()?.username || '';

    return this.storage.getData("username")??""; // Placeholder
  }
}
