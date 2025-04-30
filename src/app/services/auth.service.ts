import { Injectable } from '@angular/core';
import {User,Role} from '../interfaces/user';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tmpUsers:User[]=[
    {
      "email":"t1@gmail.com",
      "username":"usertest1",
      "pwd":"$2b$10$WMF4GdzAxb4tTPILIjGc9uUcSuslGtPdGT8D3LcAmrenpn3bxRZou",
      "role":1
  },{
      "email":"t2@gmail.com",
      "username":"usertest2",
      "pwd":"$2b$10$xe5BgWrwLTUf7j1UYrDm/e.M608PIcaeQRZqJHDQo54ikZrK.hlzy",
      "role":0
  }

  ];

  constructor() { }
  creaHash(plain:string):string{
    const sale=bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plain,sale);
  }
  cmpPlainPwd(plain:string,encripted:string):boolean{
    return bcrypt.compareSync(plain,encripted);
  }
  checkUserPwd(email:string,pwd:string):boolean{
    const hash:string |  undefined= this.tmpUsers.find(user=>user.email===email)?.pwd;

    if (!hash) {
      console.warn(`Nessun utente trovato con email ${email}`);
      return false;
    }
    return this.cmpPlainPwd(pwd,hash);
  }
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

    this.tmpUsers.push(newUser);
    console.log(' Utente creato:', newUser);
    return true;
  }
  getUserData(email:string):User|undefined{
    return this.tmpUsers.find(user=>user.email===email);
  }
  getUserName(email:string):string|undefined{
    return this.tmpUsers.find(user=>user.email===email)?.username;
  }


  //TODO:impementare funzioni
}
