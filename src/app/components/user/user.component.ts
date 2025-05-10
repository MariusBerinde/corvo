const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;

import { Component} from '@angular/core';
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
    TableLogComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  actualUser:User;
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
  ){
    const email = this.storage.getData('email') ?? 'default';
    const defaultUser:User={
      email:'Default@gmail.com',
      username:'defaultUsername',
      pwd:'defaultPassword',
      role:Role.Worker,
    };

    this.actualUser =  this.authService.getUserData(email)??defaultUser;
    //this.actualUser =  defaultUser;

  }

  formResetPwd = new FormGroup({
    pwdOld: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwdR: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
  });

    submitChangePwd(){
      this.log.setLog(this.actualUser.username,"cambiamento password");
      if(this.formResetPwd.valid){
        this.pwdI = this.formResetPwd.value.pwd??'';
        this.pwdRI = this.formResetPwd.value.pwdR?? '';
        this.pwdOldI = this.formResetPwd.value.pwdOld??'';
        //controllo che sia la vera vecchia oldPwd
        if(this.authService.checkUserPwd(this.actualUser.email,this.pwdOldI)){
          console.log("old pwd ok");
          if(this.pwdI===this.pwdRI ){
            if(this.pwdI!=this.pwdOldI){
            console.log("cambio pwd ok");
            this.authService.setNewPwd(this.actualUser.email,this.pwdI);
            //this.router.navigate(['']);
            this.logout();
            }
            else{
              this.errorReusedOldPwd = true;
            }
          } else{
            this.errorPwdR = true;
          }
        }else{
         this.errorInsertOldPwd = true;
          var tmp='vecchia pwd errata valore inserito:'+this.pwdOldI
          //alert(tmp);

        }

      }

    }
  logout() {

    this.storage.clearData();

      this.router.navigate(['']);
  }

  // index varia tra 0 e 2
  togglePasswordVisibility(index:number) {
    this.hides[index]= ! this.hides[index];
  }

  navigateToHome(){
    this.router.navigate(['home']);
  }

}





