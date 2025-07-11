const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;

import { Component,OnInit} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { LocalWriteService } from '../../services/local-write.service';
import {AuthService } from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule } from '@angular/common';
import {User,Role} from '../../interfaces/user';
import {TableLogComponent } from '../table-log/table-log.component';
import { ManageLogService } from '../../services/manage-log.service';
import {TableUsersComponent } from '../table-users/table-users.component'
import { userInfo } from 'os';
import { HttpStatusCode } from '@angular/common/http';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule,
    TableLogComponent,
    TableUsersComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  actualUser:User  ={
      email:'Default@gmail.com',
      username:'defaultUsername',
      pwd:'defaultPassword',
      role:Role.Worker,
    };

/*  actualUser = signal<User>({
      email:'Default@gmail.com',
      username:'defaultUsername',
      pwd:'defaultPassword',
      role:Role.Worker,
  });

*/
  Role=Role;

  pwdI='';
  pwdRI='';
  pwdOldI='';
  hide = true;
  hides=[true,true,true];
  errorInsertOldPwd = false;
  errorPwdR = false;
  errorReusedOldPwd = false;
  constructor(
              private authService: AuthService,
              private router: Router,
              private storage: LocalWriteService,
              private log:ManageLogService
  ){ }
ngOnInit(): void{

    const email = this.storage.getData('email') ?? 'default';
    const defaultUser:User={
      email:'Default@gmail.com',
      username:'defaultUsername',
      pwd:'defaultPassword',
      role:Role.Worker,
    };
    var tmpUser = this.authService.getLoggedUser(); //TODO: to check
    if (tmpUser != null){
      //this.actualUser = tmpUser;
      //this.actualUser .set(tmpUser);
      this.actualUser = this.getUserFromDataStorage();
      /*
      if (tmpUser.role === "SUPERVISOR" )
          this.actualUser.update(x=>({...x,role:Role.Supervisor}));
      else
          this.actualUser.update(x=>({...x,role:Role.Worker}));
      console.log("costruttore di UserComponent sto usando tmpUser");
      console.log("userCompoment ruolo actualUser =",this.actualUser().role);
    }
    */


  }
  }

  private getUserFromDataStorage():User{

   var actualRoleUser:Role = Role.Worker;
    if(this.storage.getData('role')==="SUPERVISOR")
      actualRoleUser = Role.Supervisor;
  var user:User  = {
      email:this.storage.getData('email')??'',
      username:this.storage.getData('username')??'',
      pwd:'defaultPassword',
      role:actualRoleUser
    };
    return user;
  }


  formResetPwd = new FormGroup({
    pwdOld: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwdR: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
  });

    submitChangePwd(){
      this.log.setLog(this.actualUser.email,"cambiamento password");
      //this.log.setLog(this.actualUser().username,"cambiamento password");
      if(this.formResetPwd.valid){
        this.pwdI = this.formResetPwd.value.pwd??'';
        this.pwdRI = this.formResetPwd.value.pwdR?? '';
        this.pwdOldI = this.formResetPwd.value.pwdOld??'';
        //controllo che sia la vera vecchia oldPwd


      if(this.pwdI !== this.pwdRI){
        this.errorPwdR = true;
      }
      if(this.pwdI === this.pwdOldI){
        this.errorReusedOldPwd = true;
      }
      this.authService.updatePwdUser(this.actualUser.email,this.pwdOldI,this.pwdI).then(
       status => {
          if( status === HttpStatusCode.Ok)
            this.logout();
          if(status === HttpStatusCode.Forbidden)
            this.errorInsertOldPwd = true;
        }

      );

      }
    }


  logout() {
    this.log.loadLocalLogs().then(
      (ris) => {
        if (ris) {
          // Solo se il caricamento è andato a buon fine, pulisci i dati locali
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
        this.storage.clearData();
        this.router.navigate(['']);
      });
  }


  // index varia tra 0 e 2
  togglePasswordVisibility(index:number) {
    this.hides[index]= ! this.hides[index];
  }

  navigateToHome(){
    this.router.navigate(['home']);
  }

}





