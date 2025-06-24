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
    this.acutalConfig=this.lynis.getActualConfig(this.ip);
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
        console.log("Elementi ricevuti dal dialog:", ris);
        console.log("listIdSkippedTest aggiornato:", this.acutalConfig.listIdSkippedTest);
        this.cdr.detectChanges(); // Forza l'aggiornamento della vista
      } else {
        console.log("Nessun elemento selezionato o dialog annullato.");
      }
    });
    //console.log("Valore di listIdSkippedTest dopo subscribe (prima della chiusura del dialog):", this.acutalConfig.listIdSkippedTest);
  }


  navigateToHome(){
    this.router.navigate(['home']);
  }
}

