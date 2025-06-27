import { Component,OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatListModule} from '@angular/material/list';

import { ManageServiceService } from '../../services/manage-service.service';
import { ManageRuleService } from '../../services/manage-rule.service';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { Rule } from '../../interfaces/rule';
import { Service } from '../../interfaces/service';
import { LocalWriteService } from '../../services/local-write.service';
import { ManageServerService } from '../../services/manage-server.service';
import { ManageLogService } from '../../services/manage-log.service';
import { Server } from '../../interfaces/server';
import { HomeComponent } from '../home/home.component';

import { finalize, Subject ,takeUntil } from 'rxjs';
@Component({
  selector: 'app-detail-server',
  imports: [
    MatMenuModule ,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    RouterModule
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

  constructor(
    private router: Router,
    private inRoute:ActivatedRoute,
    private mS:ManageServiceService ,
    private mR:ManageRuleService,
    private storage: LocalWriteService,
    private mServer:ManageServerService,
    private log:ManageLogService
  ) {}


 ngOnInit(): void{
   this.ip = this.inRoute.snapshot.paramMap.get('ip');
   if(this.ip !== null && this.ip.length>0){
     this.activeRulesList = this.mR.getRulesByIp(this.ip);

     this.localServer = this.mServer.getServerByIp(this.ip);
     //this.activeRulesList = this.mR.getRulesByIp(this.ip);
     this.actualUser = this.storage.getData('email')??'';
      this.loadActiveRules();


     this.log.setLog(this.actualUser,"Corvo:visione status server="+this.ip);
     if(this.localServer.id===-1){
       alert("Problema di rete sarai disconnesso");
       this.logout();
     }

     if(this.activeRulesList.length>0){
       this.generalRules = this.activeRulesList.filter(obj=>!('service' in obj));

       this.rulesDB = this.activeRulesList.filter(obj=>obj.service===1);
       this.rulesDocker = this.activeRulesList.filter(obj=>obj.service===2);
       this.rulesHa = this.activeRulesList.filter(obj=>obj.service===3);

     }

   }
 }

  /**
  * load rules from database using getRulesByIpO method
  */
  private loadActiveRules():void{
    this.isLoadingRules = true;
    this.activeRulesError = null;

    this.mR.getRulesByIpO(this.ip??"").pipe(
      takeUntil(this.destroy$),
      finalize(()=>this.isLoadingRules = false)
    ).subscribe({
        next:(rules)=>{
          this.activeRulesList = rules;
          console.log("Detail Server: Loading Active rules from database");
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
  this.log.setLog(this.actualUser,"Corvo:logout da detail server");
    this.storage.clearData();
      this.router.navigate(['']);
  }
  navigateToLynis(){
    this.router.navigate(['lynis',this.ip]);
  }
  navigateToHome(){
    this.router.navigate(['home']);
  }
}
