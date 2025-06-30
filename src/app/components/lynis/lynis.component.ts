import { Component,OnInit,ChangeDetectionStrategy,inject, ChangeDetectorRef } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { ManageLynisService } from '../../services/manage-lynis.service';
import { LocalWriteService } from '../../services/local-write.service';
import { ManageLogService } from '../../services/manage-log.service';
import { AuthService } from '../../services/auth.service';
import {MatListModule, } from '@angular/material/list';
import { MatDialog, } from '@angular/material/dialog';
import { LynisTest,Lynis } from '../../interfaces/lynis';
import {MatExpansionModule} from '@angular/material/expansion';
import { LynisRulesComponent } from './lynis-rules/lynis-rules.component';
import { ReportViewComponent   } from '../report-view/report-view.component';
import { HttpClientModule } from '@angular/common/http';

import { finalize, Subject ,takeUntil } from 'rxjs';
@Component({
  selector: 'app-lynis',
  imports: [
    MatListModule,
    MatMenuModule ,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    RouterModule,
    HttpClientModule,
    ReportViewComponent
  ],
  templateUrl: './lynis.component.html',
  styleUrl: './lynis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LynisComponent implements OnInit{

  userName: string = '';
  acutalConfig:Lynis={ id:0,ip:"193.199.11.1",auditor:"", listIdSkippedTest:[]};
  descTest:LynisTest[]=[];
  mini:LynisTest[]=[];
  risDialog:string[]=[];
  ip:string = '';
  dialog = inject(MatDialog);
  isLoadingConfig = false;
  loadingConfigError : string | null = null;

  private destroy$ = new Subject<void>(); // NUOVO per gestire unsubscribe

//  @Input() private ip:string = "";

  constructor(
    private router: Router,
    private storage: LocalWriteService,
    private log: ManageLogService,
    private authService:AuthService,
    private lynis:ManageLynisService,
    private inRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit():void{
    this.userName = this.loadUserName();
    this.descTest = this.lynis.getSkippableTestList();
    this.mini = this.descTest.slice(0,20);
    this.ip = this.inRoute.snapshot.paramMap.get('ip')??'errore navigazione';
    //this.acutalConfig=this.lynis.getActualConfig(this.ip);
    this.loadLynisConfig();
  }


  loadLynisConfig():void{
    this.isLoadingConfig = true;
    this.loadingConfigError = null;
    this.lynis.getActualConfigO(this.ip).pipe(
      takeUntil(this.destroy$),
      finalize(()=>this.isLoadingConfig  = false)
    ).subscribe({
        next:(config)=>{
          this.acutalConfig = config;
          console.log("Loading config of lynis from the db");
        },
        error:(error)=>{

          console.log("Loading config of lynis from the db errol , load the mock data");
          this.acutalConfig = this.lynis.getActualConfig(this.ip);

        }
      })

  }
  loadUserName(): string {
    const email = this.storage.getData('email') ?? 'default';

    if (email === 'default') {
      return 'Altair';
    }

    const user = this.authService.getUserName(email);

    if (!user ) {
      return 'Default';
    }

    return user;
  }

  logout() {
    this.storage.clearData();
      this.router.navigate(['']);
  }
testDialog() {
    //console.log("valore di mini0=", this.mini[0]?.id);
    const dialogRef = this.dialog.open(LynisRulesComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: 'auto',
      height: 'auto',
      data: {
        ip: this.ip,
        acutalConfig: this.acutalConfig,
        mini: this.mini
      },
    });

    dialogRef.afterClosed().subscribe(ris => {
      console.log("Dialog chiuso");
      if (ris !== undefined && ris.length > 0) {
        this.acutalConfig.listIdSkippedTest = ris;
        //this.lynis.addLynisConfig(ris,this.ip);
        console.log("Elementi ricevuti dal dialog:", ris);
        console.log("listIdSkippedTest aggiornato:", this.acutalConfig.listIdSkippedTest);
        this.cdr.detectChanges(); // Forza l'aggiornamento della vista
      } else {
        console.log("Nessun elemento selezionato o dialog annullato.");
      }
    });
    //console.log("Valore di listIdSkippedTest dopo subscribe (prima della chiusura del dialog):", this.acutalConfig.listIdSkippedTest);
  }

  saveSkippedList(){
    this.lynis.addLynisConfig(this.acutalConfig.listIdSkippedTest,this.ip).then(
      isValid => {
        if (isValid)
          console.log("addLynisConfig added to db ");
        else
          console.log("addLynisConfig not added to db ");


      }
    );



  }

  // Aggiungi questa proprietà alla tua classe per tracciare l'ultimo timestamp della scansione
  private lastScanTimestamp: number = 0;
  timeToWait:number = 0;
  isStarted:boolean|null = null;
  private readonly SCAN_COOLDOWN_MS = 3 * 60 * 1000; // 3 minuti in millisecondi

  startLynisScan(): void {
    const now = Date.now();
    const timeSinceLastScan = now - this.lastScanTimestamp;

    // Controlla se sono passati almeno 3 minuti dall'ultima scansione
    if (this.lastScanTimestamp > 0 && timeSinceLastScan < this.SCAN_COOLDOWN_MS) {
      const remainingTime = Math.ceil((this.SCAN_COOLDOWN_MS - timeSinceLastScan) / 1000);
      this.timeToWait = remainingTime;
      console.warn(`Scansione bloccata. Attendere ancora ${remainingTime} secondi prima di poter avviare una nuova scansione.`);

      // Opzionale: mostra un messaggio all'utente
      // this.showMessage(`Attendere ${Math.ceil(remainingTime / 60)} minuti prima di avviare una nuova scansione.`);

      return;
    }

    // Aggiorna il timestamp dell'ultima scansione
    this.lastScanTimestamp = now;

    // Avvia la scansione
    this.lynis.startLynisScan(this.ip).then((success) => {
      if (!success) {
        // Se la scansione fallisce, resetta il timestamp per permettere un nuovo tentativo immediato
        this.lastScanTimestamp = 0;
        console.error("Scansione fallita, timestamp resettato per permettere un nuovo tentativo.");
        this.isStarted = false;
      } else {

        this.isStarted = true;
        console.log("Scansione avviata con successo.");
      }
    });
  }

  navigateToHome(){
    this.router.navigate(['home']);
  }
}

