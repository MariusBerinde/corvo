import { Component,OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatListModule} from '@angular/material/list';

import { ManageRuleService } from '../../services/manage-rule.service';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { Rule } from '../../interfaces/rule';
import { LocalWriteService } from '../../services/local-write.service';
import { ManageServerService } from '../../services/manage-server.service';
import { ManageLogService } from '../../services/manage-log.service';
import { Server } from '../../interfaces/server';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize, Subject ,takeUntil, interval  } from 'rxjs';
import { CommonModule } from '@angular/common'; // ✅ NgIf, NgFor, etc.
@Component({
  selector: 'app-detail-server',
  imports: [
   CommonModule,
    FormsModule,
    MatMenuModule ,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './detail-server.component.html',
  styleUrl: './detail-server.component.css'
})
export class DetailServerComponent implements OnInit{

  ip:string|null='';
  localServer:Server = {
      "id":0,
      "ip":"",
      "state":false,
      "name":"",
      "descr":""
      };
;
  activeRulesList:Rule[]=[];
  errorNetwork:boolean=false;
  isLoadingRules = false;
  activeRulesError : string | null = null;

  private destroy$ = new Subject<void>(); // NUOVO per gestire unsubscribe

    generalRules:Rule[]=[] ;
    rulesDB:Rule[]=[];
    rulesDocker:Rule[]=[];
    rulesHa:Rule[]=[];
    actualUser:string='';
    actualMail:string='';
    newName:string|null=null;
    newDescr:string|null=null;
    isEditingName = false;
    isEditingDescr = false;
    isSaving = false;
    hasChanges = false;


  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(
    private router: Router,
    private inRoute:ActivatedRoute,
    private mR:ManageRuleService,
    private storage: LocalWriteService,
    private mServer:ManageServerService,
    private log:ManageLogService
  ) {}


 ngOnInit(): void{
   this.ip = this.inRoute.snapshot.paramMap.get('ip');
    console.log("detail-server ip selected in on-init = ",this.ip);
   if(this.ip !== null && this.ip.length>0){
     this.activeRulesList = this.mR.getRulesByIp(this.ip);

     this.localServer = this.mServer.getServerByIpO(this.ip);
     //this.activeRulesList = this.mR.getRulesByIp(this.ip);
     this.actualUser = this.storage.getData('email')??'';
      this.loadActiveRules();
      this.newName = this.localServer.name??"";
      this.newDescr = this.localServer.descr??"";



     if(this.activeRulesList.length>0){
       this.generalRules = this.activeRulesList.filter(obj=>!('service' in obj));

       this.rulesDB = this.activeRulesList.filter(obj=>obj.service===1);
       this.rulesDocker = this.activeRulesList.filter(obj=>obj.service===2);
       this.rulesHa = this.activeRulesList.filter(obj=>obj.service===3);

      interval(300000) // 5 minuti
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadActiveRules();
        });

     }

   }
 }

  /**
  * load rules from database using getRulesByIpO method
  */
  private loadActiveRules():void{
    this.isLoadingRules = true;
    this.activeRulesError = null;
    console.log("selected ip = ",this.ip)

    this.mR.getRulesByIpO(this.ip??"").pipe(
      takeUntil(this.destroy$),
      finalize(()=>this.isLoadingRules = false)
    ).subscribe({
        next:(rules)=>{
          this.activeRulesList = rules;
          console.log("Detail Server: Loading Active rules from database ");
          console.log("Detail Server: deltail rules ",rules);
        },
        error : (error)=>{
          console.error("Detail Server:problem with loading data from database")
          // fallback
          this.activeRulesList = this.mR.getRulesByIp(this.ip??"");

        }
      })
  }
  reloadActiveRules():void{
    this.loadActiveRules();
  }
logout() {
    this.log.loadLocalLogs().then(
      (ris) => {
        if (ris) {
          // Solo se il caricamento è andato a buon fine, pulisci i dati locali
          this.storage.clearData();
          console.log("loading local logs to db user.component ok");
        } else {
          console.warn("loadLocalLogs returned false - logs not saved");
        }
      }
    ).catch(
        (reason) => {
          console.error(`problem with load local logs ${reason}`);
          alert(`Errore nel caricamento dei log: ${reason.message || reason}`);
        }
      ).finally(() => {
        // La navigazione avviene sempre, indipendentemente dal risultato
        this.router.navigate(['']);
      });
  }
  navigateToLynis(){
    this.router.navigate(['lynis',this.ip]);
  }
  navigateToHome(){
    this.router.navigate(['home']);
  }

  enableEdit(field: 'name' | 'descr') {
    if (field === 'name') this.isEditingName = true;
    if (field === 'descr') this.isEditingDescr = true;
    this.checkForChanges();
  }

  onInputChange() {
    this.checkForChanges();
  }

  checkForChanges() {
    this.hasChanges =
      this.newName !== this.localServer.name ||
        this.newDescr !== this.localServer.descr;
  }

  async saveChanges(): Promise<void> {
    if (!this.hasChanges || !this.ip) return;

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const nameToUpdate = this.newName !== this.localServer.name ? this.newName : null;
    const descrToUpdate = this.newDescr !== this.localServer.descr ? this.newDescr : null;

    try {
      await this.mServer.updateIpWithReject(this.ip, nameToUpdate, descrToUpdate);

      if (nameToUpdate) this.localServer.name = this.newName!;
      if (descrToUpdate) this.localServer.descr = this.newDescr!;

      this.successMessage = 'Modifiche salvate con successo ✔️';
      this.isEditingName = false;
      this.isEditingDescr = false;
      this.hasChanges = false;
    } catch (err: any) {
      this.errorMessage = err.message || 'Errore durante il salvataggio';
    } finally {
      this.isSaving = false;
    }
  }

  cancelEdit(): void {
    this.newName = this.localServer.name??"";
    this.newDescr = this.localServer.descr??"";
    this.isEditingName = false;
    this.isEditingDescr = false;
    this.hasChanges = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }
}
