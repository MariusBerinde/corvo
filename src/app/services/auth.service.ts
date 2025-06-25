import { Injectable } from '@angular/core';
import {User,Role} from '../interfaces/user';
import * as bcrypt from 'bcryptjs';
import {ManageLogService } from './manage-log.service';
import {LocalWriteService} from './local-write.service';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,  Observable,  throwError } from 'rxjs';

import { catchError, tap, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  actualUsername:string='';
  private loggedUser:any = null ;
  private readonly API_BASE = 'http://localhost:8083';

  tmpUsers:User[]=[
    {
      "email":"t1@gmail.com",
      "username":"usertest1",
      "pwd":"$2b$10$WMF4GdzAxb4tTPILIjGc9uUcSuslGtPdGT8D3LcAmrenpn3bxRZou",
      "role":Role.Supervisor
  },{
      "email":"t2@gmail.com",
      "username":"usertest2",
      "pwd":"$2b$10$xe5BgWrwLTUf7j1UYrDm/e.M608PIcaeQRZqJHDQo54ikZrK.hlzy",
      "role":Role.Worker
  }
  ];

  approvedUsers:string[]=["t1@gmail.com","t2@gmail.com","td@gmail.com"];


/**
 * Returns all logs associated with a user given their email address.
 * @param email - The email address of the user
 * @returns An array of Log objects associated with the user (may be empty)
 */
  constructor(
    private log:ManageLogService,
    private storage:LocalWriteService,
    private http:HttpClient
  ) {
    const localEmail:string  = this.storage.getData('email')??'';
    if(localEmail.length>0){

      const username = this.getUserName(localEmail)??'';
      if(username.length>0)
        this.actualUsername = username;
    }
  }
  /*  Create the hash value of the plain text using the bcrypt library
   *  @param plain string - A general string
   *  @returns a string with the hash of the plain text
   */
  creaHash(plain:string):string{
    const sale=bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plain,sale);
  }
  /* Check if the plain text have the encrypted value
   * @param plain - String the plain text
   * @param encrypted - the hash value
   * @returns true if the plain text have encrypted as hash false otherwise
   */
  cmpPlainPwd(plain:string,encripted:string):boolean{
    return bcrypt.compareSync(plain,encripted);
  }

  /*
   * Checks whether the provided password matches the password of the user with the given email.
   * @param email - the user email
   * @param pwd - the password of the user
   * @returns true if pwd is the password of the user false otherwise
   */
  checkUserPwd(email:string,pwd:string):Promise<boolean>{


    const data={"email":email,"password":pwd};
    console.log("test richiesta post");
    const url = 'http://localhost:8083/authUser';
    return new Promise(
      (resolve) => {
        this.http.post(
          url,data,{
        observe: 'response'
          }

        ).subscribe(
            {
              next:(response)=>{
                console.log("Status in checkUserPwd =",response.status);
                console.log("Body in checkUserPwd =",response.body);
                if (response.status === 200)
                  if( response.body !== null)
                    this.loggedUser = response.body;
                   var tmp:any = response.body;

                  this.storage.saveData('email',tmp.email);
                  this.storage.saveData('username',tmp.username);
                  this.storage.saveData('role',tmp.role);

                resolve(response.status === 200);
              },
              error:(error)=>{
                console.log("error in checkUserPwd =",error.status);
                resolve(false);
              }

            });

      });

  }

  public getLoggedUser (){
    return this.loggedUser;
  }

  checkUserPwd1(email:string,pwd:string):boolean{


    const hash:string |  undefined= this.tmpUsers.find(user=>user.email===email)?.pwd;

    if (!hash) {
      console.warn(`Nessun utente trovato con email ${email}`);
      console.log(`Nessun utente trovato con email ${email}`);
      return false;
    }
    return this.cmpPlainPwd(pwd,hash);
  }

  /**
 * Creates a new user account with the given email, username, password, and role.
 * @param email - The user's email address.
 * @param username - The user's username.
 * @param plainPwd - The user's plain-text password.
 * @param role - The user's role (Supervisor or Worker). Defaults to Worker.
 * @returns True if the user was successfully created; false if an account with the given email already exists.
 */

  createUser(email: string, username: string, plainPwd: string, role: Role = Role.Worker): boolean {
    const exists = this.tmpUsers.some(user => user.email === email);
    if (exists) {
      console.warn(' Utente già registrato con questa email');
      return false;
    }
    const pwdHash = this.creaHash(plainPwd);
    const newUser: User = {
      email,
      username,
      pwd: pwdHash,
      role,
    };

    return true;
  }

  createUser2(email: string, username: string, plainPwd: string, role: Role = Role.Worker):Promise<boolean>{

    const data = {
      "username":"lol",
      "user":{"name":username,"email":email,"password":plainPwd,"role":role}
    };
    console.log("dentro isEmailApproved");
    const url = 'http://localhost:8083/addUser';

    return new Promise((resolve) => {
      this.http.post(url, data, {
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in createUser2 =", response.status);
            console.log("Body in createUser2 =", response.body);

            // Email approvata solo se status è 200
            resolve(response.status === 200);
          },
          error: (error) => {
            console.log("Error in createUser2 - Status =", error.status);

            // Gestisci i diversi casi di errore
            if(error.status === 200)
              resolve(true)
            if (error.status === 404) {
              console.log("Email non trovata nella lista approvate");
            } else if (error.status === 400) {
              console.log("Richiesta malformata");
            } else {
              console.log("Errore generico:", error);
            }

            resolve(false);
          }
        });
    });

  }

  /*  Returns the data of the user with the given email
   *  @param email - the user's  email
   * @returns The user data if found; otherwise, undefined.
  */
  getUserData(email:string):User|undefined{
    this.log.setLog(this.actualUsername,`Scaricati i dati di ${email}`);
    return this.tmpUsers.find(user=>user.email===email);
  }

/**
 * Returns the username of the user with the given email.
 * @param email - The user's email address.
 * @returns The user's username if found; otherwise, undefined.
 */
  getUserName(email:string):string|undefined{
    this.log.setLog(this.actualUsername,`Recuperato lo username di ${email}`);
    return this.tmpUsers.find(user=>user.email===email)?.username;
  }

  /* Returns the role of the user with the given email
   *  @param email - the user's  email
   *  @returns The user's role if found ;otherwise, undefined.
  */
  getUserRole(email:string):Role|undefined{
    this.log.setLog(this.actualUsername,`Recuperato il ruolo di ${email}`);
    return this.tmpUsers.find(user=>user.email===email)?.role;
  }


  /**
   * Returns the role of the logged user
   */
  getLoggedRole():Role{
    return this.loggedUser.role;
  }

  /* Sets a new password for the user with the given email
   *  @param email - the user's  email
   *  @param newPwd - the new plain-text password to set
   *  @returns true if the password was successfully update; otherwise;false
  */
  setNewPwd(email:string,newPwd:string):boolean{
    this.log.setLog(this.actualUsername,`Creata nuova password per l'utente con mail ${email}`);
    const refUser :User|undefined = this.tmpUsers.find( u=> u.email === email);
    if(refUser ){
      refUser.pwd = this.creaHash(newPwd);
      return true;
    }
    else{
      return false;
    }
  }
  updatePwdUser(email:string,oldPwd:string,newPwd:string):Promise<Number>{

    const data={"email":email,"oldPassword":oldPwd,"newPassword":newPwd};
    console.log("set New Pwd test richiesta post");

    const url = `${this.API_BASE}/updatePassword`;
    return new Promise(
      (resolve)=>{
        this.http.post(
          url,data,{
        observe: 'response'
          }
        ).subscribe(
            {
              next:(response)=>{
                console.log("Status in update updatePwdUser =",response.status);
                console.log("Body in updatePwdUser =",response.body);
                /*
                if (response.status === 200){
                  if( response.body !== null){
                    var msgResponse:string = response.body.toString() ;
                    if(msgResponse ==="true")
                      resolve();
                  }
                }
                */
                resolve(response.status)
              },
              error:(error)=>{
                console.log("error in checkUserPwd =",error.status);

                resolve(error.status);
              }

            })
      }
    );
  }

  /* Delete the user account associated with the given email
   *  @param email - the user's email
   *  @returns true if the user account was successfully deleted;false if no matching user was found for the provided email.
   */
  deleteUser(email:string):boolean{
    const iUser = this.tmpUsers.findIndex(user=>user.email===email);
    if(iUser<0||iUser>this.tmpUsers.length){
      this.log.setLog(this.actualUsername,`Tentato di cancellare l'utente con email ${email}`);
      return false;
    }
      this.log.setLog(this.actualUsername,`Cancellato l'utente con email ${email}`);
      this.tmpUsers.splice(iUser,1);
      return true;

  }
/**
   * Adds a user's email to the list of approved users.
   * @param email The email address of the user to approve and add.
   * @returns `true` if the email was successfully added to the approved users list,
   * `false` otherwise (which would typically indicate an unexpected issue
   * with the array's length after the push operation).
   */
  setApprovedUser(email:string):boolean{
    const oldLength = this.approvedUsers.length;
    const newLength = this.approvedUsers.push(email);
    if(oldLength === (newLength-1)){
      this.log.setLog(this.actualUsername,`aggiunto utente ${email} come registrabile`);
      return true;
    }else{
      return false;
    }
  }
  /**
   * Checks if a given email address is present in the list of approved users.
   *
   * @param email The email address to check for approval.
   * @returns `true` if the email is found in the approved users list,
   * `false` otherwise.
   */
  isEmailApproved(email:string):boolean{
    const index=this.approvedUsers.indexOf(email);
    return (index>=0 && index<=this.approvedUsers.length)
  }

  isEmailApproved2(email: string): Promise<boolean> {
    const data = {"email": email};
    console.log("dentro isEmailApproved");
    const url = 'http://localhost:8083/isEmailApproved';

    return new Promise((resolve) => {
      this.http.post(url, data, {
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in isEmailApproved2 =", response.status);
            console.log("Body in isEmailApproved2 =", response.body);

            // Email approvata solo se status è 200
            resolve(response.status === 200);
          },
          error: (error) => {
            console.log("Error in isEmailApproved2 - Status =", error.status);

            // Gestisci i diversi casi di errore
            if(error.status === 200)
              resolve(true)
            if (error.status === 404) {
              console.log("Email non trovata nella lista approvate");
            } else if (error.status === 400) {
              console.log("Richiesta malformata");
            } else {
              console.log("Errore generico:", error);
            }

            resolve(false);
          }
        });
    });
  }
 /**
   * Retrieves the list of currently approved users.
   *
   * @returns An array of strings, where each string is the identifier
   * (e.g., username, user ID) of an approved user. Returns an empty
   * array if no users are currently approved.
   */
  getApprovedUsers():string[]{
  return this.approvedUsers;
  }




/**
 * Removes the specified email from the list of approved users.
 * Logs the action and returns whether the removal was successful.
 *
 * @param email - The email address to remove from the approved list.
 * @returns True if the email was successfully removed; false if it was not found.
 */
  removeApprovedUser(email:string):boolean{

    const iEmail = this.approvedUsers.findIndex(e=>e===email);
    if( iEmail<0 ){
      this.log.setLog(this.actualUsername,`Tentato di cancellare pre-approvazione  per email ${email}`);
      return false;
    }
      this.log.setLog(this.actualUsername,`Cancellata pre-approvazione  per email ${email}`);
    this.approvedUsers.splice(iEmail,1);
    return true;
  }


  removeApprovedUserP(email:string):Promise<boolean>{

    const data = { "username":this.actualUsername,"email": email};

    console.log("dentro removeApprovedUserP");
    const url = 'http://localhost:8083/deleteEnabledUser';

    return new Promise((resolve) => {
      this.http.post(url, data, {
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in removeApprovedUserP =", response.status);
            console.log("Body in removeApprovedUserP  =", response.body);

            // Email approvata solo se status è 200
            resolve(response.status === 200);
          },
          error: (error) => {
            console.log("Error in isEmailApproved2 - Status =", error.status);

            // Gestisci i diversi casi di errore
            if(error.status === 200)
              resolve(true)
            if (error.status === 404) {
              console.log("Email non trovata nella lista approvate");
            } else if (error.status === 400) {
              console.log("Richiesta malformata");
            } else {
              console.log("Errore generico:", error);
            }

            resolve(false);
          }
        });
    });
  }
/**
 * Updates the role of a user identified by their email address.
 * @param email - The email address of the user whose role is to be updated.
 * @param newRole - The new role to assign to the user (e.g., Supervisor or Worker).
 * @returns true if the role was successfully updated; false if no user was found with the given email.
 */
  setNewRole(email:string,newRole:Role):boolean{
    this.log.setLog(this.actualUsername,`Aggiorna nuovo ruolo ${newRole} per l'utente con mail ${email}`);
    const refUser :User|undefined = this.tmpUsers.find( u=> u.email === email);
    if(refUser ){
      refUser.role = newRole;
      return true;
    }
    else{
      return false;
    }

  }
/**
 * Retrieves information for all users without including their passwords.
 * Creates a safe version of the user list by removing the password field from each user object.
 *
 * @returns An array of user objects with all properties except for the password field.
 * Each object is of type Omit<User, 'pwd'>, representing a User without the 'pwd' property.
 */
getAllUsersInfo(): Omit<User, 'pwd'>[] {
    return this.tmpUsers.map(user => {
      const { pwd, ...userWithoutPwd } = user;
      return userWithoutPwd;
    });
  }

  testPing1(username: string): Promise<boolean> {
    const url = 'http://localhost:8083/ping1';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username
    });

    return new Promise<boolean>((resolve) => {
      this.http.get<any>(url, {
        headers: headers,
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log('✅ Status:', response.status);
            console.log('📦 Body:', response.body);
            resolve(response.status === 200);
          },
          error: (error) => {

            console.error('❌ Errore HTTP:', error.status);
            if(error.status!==200){
            resolve(false);
            }
          }
        });
    });
  }

  testPost( username:string):void{
    const data={"username":username};
    console.log("test richiesta post");
    const url = 'http://localhost:8083/ping2';
    var statusMsg=0;
    var mgs;
    this.http.post(url,data,{
        observe: 'response'
    }).subscribe({
          next: (response) => {
          statusMsg = response.status
          mgs=response.body;
            console.log('✅ Status:', response.status);
            console.log('📦 Body:', response.body);
          },

          error: (error) => {
            console.error('❌ Errore HTTP:', error.status);
          }
        });

    console.log("testPost status=",statusMsg);
    console.log("testPost body=",mgs);

  }

}
