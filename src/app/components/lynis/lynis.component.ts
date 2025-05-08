import { Component,OnInit,ChangeDetectionStrategy,signal,inject } from '@angular/core';
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
import {MatListModule} from '@angular/material/list';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { LynisTest,Lynis } from '../../interfaces/lynis';
import {MatExpansionModule} from '@angular/material/expansion';
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
    RouterModule
  ],
  templateUrl: './lynis.component.html',
  styleUrl: './lynis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LynisComponent implements OnInit{

  userName: string = '';
  acutalConfig:Lynis={ auditor:"", listIdSkippedTest:[] };
  descTest:LynisTest[]=[];
  mini:LynisTest[]=[];

  ip:string = '';
  dialog = inject(MatDialog);




  constructor(
    private router: Router,
    private storage: LocalWriteService,
    private log: ManageLogService,
    private authService:AuthService,
    private lynis:ManageLynisService,
    private inRoute:ActivatedRoute
  ) { }

  ngOnInit():void{
    this.userName = this.loadUserName();
    this.acutalConfig=this.lynis.getActualConfig();
    this.descTest = this.lynis.getSkippableTestList();
    this.mini = this.descTest.slice(0,5);
    this.ip = this.inRoute.snapshot.paramMap.get('ip')??'errore navigazione';
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
      this.router.navigate(['']);
  }
 testDialog(){
    this.dialog.open(DialogSelectorRules ,{
     data:{
       ip:this.ip,
       acutalConfig : this.acutalConfig,
       mini:this.mini
       //mini:this.descTest

     }, });

 }


}

@Component({

  selector:'app-dialog-selector',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './lynis_rules.component.html',
  styleUrl: './lynis.component.css',
})
export class DialogSelectorRules{
  data = inject(MAT_DIALOG_DATA);
}

