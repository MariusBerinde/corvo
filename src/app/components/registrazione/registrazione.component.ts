const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;

import {Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router } from '@angular/router';
import {ScritturaLocaleService} from '../../services/scrittura-locale.service';
import {WelcomeComponent } from '../welcome/welcome.component';
import {AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-registrazione',
  imports: [MatButtonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule],
  templateUrl:'./registrazione.component2.html',
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  emailI = '';
  errorCreationUser:boolean = false;
  errorRePassword:boolean = false;
  hidePwd:boolean = true;
  hidePwdR:boolean = true;
  nextStep:boolean = false;
  pwdI = '';
  pwdRI = '';


  togglePwdVisibility(){
    console.log("togglePwdVisibility");
    this.hidePwd=!this.hidePwd;
  }

  togglePwdRVisibility(){
    this.hidePwdR=!this.hidePwdR;
  }
  constructor(private _router: Router,private lS:ScritturaLocaleService,private auth:AuthService) { }
  formRegistrazione = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    pwd: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),
    pwdR: new FormControl('',[Validators.required ,Validators.pattern(passwordPattern)]),

  });

  submitRegistrazione(){
    if(this.formRegistrazione.valid){

      this.emailI=this.formRegistrazione.value.email??'null';
      this.pwdI=this.formRegistrazione.value.pwd??'null';
      this.pwdRI=this.formRegistrazione.value.pwdR??'null';
      const pwdUguali=this.pwdI===this.pwdRI;
      this.nextStep=pwdUguali ;

      console.log("valore scritto:",this.emailI);
      console.log("Provo a navigare verso welcome");
      if(pwdUguali){
        let username=this.emailI.substring(0,this.emailI.indexOf('@'));

        if(this.auth.createUser(this.emailI,username,this.pwdI)){
          this.lS.saveData('email',this.emailI);
          this._router.navigate(['']);
        }else{
          this.errorCreationUser = true;

        }
      }
      else{
        let username=this.emailI.substring(0,this.emailI.indexOf('@'));
        console.log("test estrazione username:",username);
        console.log("password non coincidenti");
        this.errorRePassword = true;
      }

    }
  }

}
