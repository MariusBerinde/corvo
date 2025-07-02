import { Injectable } from '@angular/core';
import {User,Role} from '../interfaces/user';
import * as bcrypt from 'bcryptjs';
import {ManageLogService } from './manage-log.service';
import {LocalWriteService} from './local-write.service';
import {HttpClient,HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { BehaviorSubject,  Observable,map, throwError } from 'rxjs';
import { catchError, tap, switchMap, switchAll } from 'rxjs/operators';
import { environment} from '../../environments/environment';

interface ServerUser {
  email: string;
  username: string;
  password: null;
  role: 'SUPERVISOR' | 'WORKER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private actualUsername:string='';
  private actualMail:string= '';
  private loggedUser:any = null ;
  //private readonly API_BASE = 'http://localhost:8083';
  private readonly API_BASE = environment.apiBaseUrl;
  private approvedUsersSb = new BehaviorSubject<string[]>([]);
  public approvedUsers$ = this.approvedUsersSb.asObservable();



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

  private approvedUsers:string[]=["t1@gmail.com","t2@gmail.com","td@gmail.com"];


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
      this.actualMail = localEmail;

      const username = this.storage.getData("username")??'';
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
    //console.log("test richiesta post");
   this.log.setLog(this.actualMail,`try to authenticate user with email ${email}`)
    const url = `${this.API_BASE}/authUser`;
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
                if (response.status === HttpStatusCode.Ok)
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


  /**
 * Creates a new user account with the given email, username, password, and role.
 * @param email - The user's email address.
 * @param username - The user's username.
 * @param plainPwd - The user's plain-text password.
 * @param role - The user's role (Supervisor or Worker). Defaults to Worker.
 * @returns True if the user was successfully created; false if an account with the given email already exists.
 */


  //TODO: check and add rejects management
  createUser2(email: string, username: string, plainPwd: string, role: Role = Role.Worker):Promise<boolean>{

    const data = {
      "username":"lol",
      "user":{"name":username,"email":email,"password":plainPwd,"role":role}
    };
    this.log.setLog(this.actualMail,`creation of an account for the user with username ${username} and email=${email}`);
    const url = `${this.API_BASE}/addUser`;

    return new Promise((resolve) => {
      this.http.post(url, data, {
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in createUser2 =", response.status);
            console.log("Body in createUser2 =", response.body);

            // Email approvata solo se status è 200
            resolve(response.status === HttpStatusCode.Ok);
          },
          error: (error) => {
            console.log("Error in createUser2 - Status =", error.status);

            // Gestisci i diversi casi di errore
            switch(error.status){
              case HttpStatusCode.Ok:
                resolve(true);
                break;
                case HttpStatusCode.NotFound: resolve(false)
              break;
                case HttpStatusCode.BadRequest : resolve(false)
              break;
                default: resolve(false)
            }
          }
        });
    });

  }

  /*  Returns the data of the user with the given email
   *  @param email - the user's  email
   * @returns The user data if found; otherwise, undefined.

  getUserData(email:string):User|undefined{
    this.log.setLog(this.actualMail,`Scaricati i dati di ${email}`);
    return this.tmpUsers.find(user=>user.email===email);
  }
*/

/**
 * Returns the username of the user with the given email.
 * @param email - The user's email address.
 * @returns The user's username if found; otherwise, undefined.
 */
  getUserName(email:string):string|undefined{
    this.log.setLog(this.actualMail,`Recuperato lo username di ${email}`);
    return this.tmpUsers.find(user=>user.email===email)?.username;
  }

  /* Returns the role of the user with the given email
   *  @param email - the user's  email
   *  @returns The user's role if found ;otherwise, undefined.
  getUserRole(email:string):Role|undefined{
    this.log.setLog(this.actualMail,`Recuperato il ruolo di ${email}`);
    return this.tmpUsers.find(user=>user.email===email)?.role;
  }
  */

  /**
   * Returns the role of the logged user
  getLoggedRole():Role{
    return this.loggedUser.role;
  }
   */

  /* Sets a new password for the user with the given email
   *  @param email - the user's  email
   *  @param newPwd - the new plain-text password to set
   *  @returns true if the password was successfully update; otherwise;false
  setNewPwd(email:string,newPwd:string):boolean{
    this.log.setLog(this.actualMail,`Creata nuova password per l'utente con mail ${email}`);
    const refUser :User|undefined = this.tmpUsers.find( u=> u.email === email);
    if(refUser ){
      refUser.pwd = this.creaHash(newPwd);
      return true;
    }
    else{
      return false;
    }
  }

  */
  /**
   * Updates tha password for the user identified with the email
   * @param email the email of the user
   * @param oldPwd the old password of the user
   * @param newPwd the new password of the user
   *
   */
  updatePwdUser(email:string,oldPwd:string,newPwd:string):Promise<Number>{

    const data={"email":email,"oldPassword":oldPwd,"newPassword":newPwd};
    console.log("set New Pwd test richiesta post");
    this.log.setLog(this.actualMail,`set new password for the user with email ${email}`)

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
  deleteUser(email:string):boolean{
    const iUser = this.tmpUsers.findIndex(user=>user.email===email);
    if(iUser<0||iUser>this.tmpUsers.length){
      this.log.setLog(this.actualMail,`Tentato di cancellare l'utente con email ${email}`);
      return false;
    }
      this.log.setLog(this.actualMail,`Cancellato l'utente con email ${email}`);
      this.tmpUsers.splice(iUser,1);
      return true;

  }
   */

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
      this.log.setLog(this.actualMail,`aggiunto utente ${email} come registrabile`);
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
  isEmailApproved(email:string):boolean{
    const index=this.approvedUsers.indexOf(email);
    return (index>=0 && index<=this.approvedUsers.length)
  }
   */

  isEmailApproved2(email: string): Promise<boolean> {
    const data = {"email": email};
    console.log("dentro isEmailApproved");
    const url = `${this.API_BASE}/isEmailApproved`;
    this.log.setLog(this.actualMail,`check if ${email} is approvede for user registration to the app`);

    return new Promise((resolve) => {
      this.http.post(url, data, {
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in isEmailApproved2 =", response.status);
            console.log("Body in isEmailApproved2 =", response.body);

            // Email approvata solo se status è 200
            resolve(response.status === HttpStatusCode.Ok);
          },
          error: (error) => {
            console.log("Error in isEmailApproved2 - Status =", error.status);
            switch(error.status){
              case HttpStatusCode.Ok:  resolve(true);
              break;
                case HttpStatusCode.BadRequest :resolve(false)
              break;
                case HttpStatusCode.NotFound : resolve(false)
              break;
                default: resolve(false)
            }

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
      this.log.setLog(this.actualMail,`Tentato di cancellare pre-approvazione  per email ${email}`);
      return false;
    }
      this.log.setLog(this.actualMail,`Cancellata pre-approvazione  per email ${email}`);
    this.approvedUsers.splice(iEmail,1);
    return true;
  }


/**
 * Updates the role of a user identified by their email address.
 * @param email - The email address of the user whose role is to be updated.
 * @param newRole - The new role to assign to the user (e.g., Supervisor or Worker).
 * @returns true if the role was successfully updated; false if no user was found with the given email.
  setNewRole(email:string,newRole:Role):boolean{
    this.log.setLog(this.actualMail,`Aggiorna nuovo ruolo ${newRole} per l'utente con mail ${email}`);
    const refUser :User|undefined = this.tmpUsers.find( u=> u.email === email);
    if(refUser ){
      refUser.role = newRole;
      return true;
    }
    else{
      return false;
    }

  }
 */
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


  /**
  * @param username the name of the user who will take from the server the list of mails of the users approved for the registration
  *
  */
  getApprovedUsersO(username:string):Observable<string[]>{

    const url = `${this.API_BASE}/getApprovedUsers`;

    console.log("getApprovedUsersO: username=",username);
    this.log.setLog(this.actualMail,"get approved users ")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username
    });

    return this.http.get<string[]>(url,{headers}).pipe(
      tap((users)=>{
        this.approvedUsersSb.next(users);
      }),
      catchError(this.handleError)
    );

  }
  /**
  * used for push the user's email in the list of the registrable users on the server
  */
  enableUserRegistration(email: string): Observable<any> {
    var username = this.storage.getData("username")??"";
    const body = { "username": "lol", "email": email } ;

    const url = `${this.API_BASE}/enableUserRegistration`;
    this.log.setLog(this.actualMail,`enable registration for email ${email}`)
    return this.http.post<any>(url, body)
      .pipe(
        tap(() => {
          // Aggiorna la lista locale aggiungendo il nuovo utente
          const currentUsers = this.approvedUsersSb.value;
          if (!currentUsers.includes(email)) {
            this.approvedUsersSb.next([...currentUsers, email]);
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteEnabledUser(email: string): Observable<number> {
    var username = this.storage.getData("username") ?? "";
    const body = { "username": username, "email": email };
    const url = `${this.API_BASE}/deleteEnabledUser`;
    this.log.setLog(this.actualMail,`disable registration to the app for user with email=${email}`)

    return this.http.post<number>(url, body)
      .pipe(
        tap((deletedItems) => {
          console.log("Elementi cancellati dal server:", deletedItems);
          if (deletedItems > 0) {
            // Aggiorna la lista locale solo se la cancellazione è riuscita
            const currentUsers = this.approvedUsersSb.value;
            const updatedUsers = currentUsers.filter(user => user !== email);
            this.approvedUsersSb.next(updatedUsers);
            console.log("Lista aggiornata nel service:", updatedUsers);
          }
        }),
        catchError(this.handleError)
      );
  }
 getCurrentApprovedUsers(): string[] {
    return this.approvedUsersSb.value;
  }

  private handleError(error:any):Observable<never>{
    console.error("problema con approved users:",error);
    let errorMsg = "errore sconosciuto";
    if(error.error instanceof ErrorEvent){
      errorMsg = `Errore ${error.error.message}`;
    }else{

      errorMsg = `Errore ${error.status}:${error.message}`
    }
    return throwError(()=>new Error(errorMsg));
  }

  isUserApproved(email: string): boolean {
    return this.approvedUsersSb.value.includes(email);
  }

  getAllUsersInfoO(username:string):Observable<Omit<User, 'pwd'>[]>{

    const url = `${this.API_BASE}/getAllUsers`;

    this.log.setLog(this.actualMail,"get all the info of the users")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': username
    });
return this.http.get<ServerUser[]>(url, { headers }).pipe(
      map(serverUsers => serverUsers.map(this.mapServerUserToClientUser.bind(this)))
    );

  }


  /**
   * Function that maps the
   */
  private mapServerUserToClientUser(serverUser: ServerUser): Omit<User, 'pwd'> {
    return {
      email: serverUser.email,
      username: serverUser.username,
      role: this.mapServerRoleToEnum(serverUser.role)
    };
  }

  /**
   * map the server version of role to the client's version
   */
  private mapServerRoleToEnum(serverRole: 'SUPERVISOR' | 'WORKER'): Role {
    return serverRole === 'SUPERVISOR' ? Role.Supervisor : Role.Worker;
  }


  /**  Updates the role of the user with the data  email
  * @argument email the email of the user that will be updated
  * @argument role the new role for the user
  */
  updateUserRole( email:string,newRole:Role):Promise<boolean>{

    const data= {
      "username": "lol",
      "user": {
        "email": email,
        "role": newRole
      }
    }

    const url = `${this.API_BASE}/updateRoleUser`;
    this.log.setLog(this.actualMail,` update the role of the user ${email} to the role ${newRole}`);
    return new Promise( (resolve) => { this.http.post( url,data,{ observe: 'response' }).
      subscribe( {
        next:(response)=>{
                console.log("Status in updateUserRole =",response.status);
                console.log("Body in updateUserRole =",response.body);
                if (response.status === HttpStatusCode.Ok)
                  if( response.body !== null)
                  this.loggedUser = response.body;

                resolve(response.status === 200);
              },
              error:(error)=>{
                if(error.status==200) resolve(true);

                console.log("error in checkUserPwd =",error.status);
                resolve(false);
              }

            });

      });
  }

  deleteUserP(email:string):Promise<boolean>{
      const data = { 'username': this.actualUsername , 'email': email};
      const url = `${this.API_BASE}/deleteUser`
    this.log.setLog(this.actualMail,`delete the user with email ${email}`)
    return new Promise( (resolve) => { this.http.post( url,data,{ observe: 'response' }).
      subscribe( {
        next:(response)=>{
                console.log("Status in deleteUserP =",response.status);
                console.log("Body in deleteUserP  =",response.body);
                if (response.status === 200)
                  //this.loggedUser = response.body;

                resolve(response.status === 200);
              },
              error:(error)=>{
                if(error.status==200) resolve(true);

                console.log("error in deleteUserP =",error.status);
                resolve(false);
              }

            });

      });
  }

}
