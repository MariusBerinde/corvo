import { Injectable } from '@angular/core';
import { Log } from '../interfaces/log';

@Injectable({
  providedIn: 'root'
})
export class ManageLogService {

  protected listaLog:Log[]=[{
    "id":0,
    "data":"Mon May 05 2025 10:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "user":"t1@gmail.com",
    "desc":"creato utente XXXX"
  },
  {
    "id":1,
    "data":"Mon May 05 2025 10:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "user":"t1@gmail.com",
    "desc":"creato utente YYYY"
  },
  {
    "id":2,
    "data":"Mon May 05 2025 11:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.111",
    "user":"t1@gmail.com",
    "desc":"creato db",
  },
  {
    "id":3,
    "data":"Mon May 05 2025 11:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.112",
    "user":"t1@gmail.com",
    "desc":"creato db",
  },
  {
    "id":4,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t1@gmail.com",
    "desc":"creato db",
  },
  {
    "id":5,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t1@gmail.com",
    "desc":"modificata regola XXX",
  },
  {
    "id":6,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t2@gmail.com",
    "desc":" modificata regola YYY",
  },
  {
    "id":7,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t2@gmail.com",
    "desc":"modificata regola ZZZ",
  },

  {
    "id":8,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t2@gmail.com",
    "desc":" inserita regola ABC",
  },

  {
    "id":9,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "server":"193.168.111.113",
    "user":"t2@gmail.com",
    "desc":"Modificata regola ACD",
  }
  ];
  constructor() { }
  getAllLogs():Log[]{
    return this.listaLog;
  }

  /**
  * returns the log of user with email
  * @ param email - the email of the user
  */
getUserLog(email: string): Log[] {
  console.log("email ricevuta =",email);
  const userLogs = this.listaLog.filter(log => log.user === email);

  if (userLogs.length > 1) {
    return userLogs; // Restituisce il vettore completo se ci sono più log
  } else if (userLogs.length === 1) {
    return userLogs; // Restituisce il vettore con un solo elemento se ne trova uno
  } else {
    return []; // Restituisce il vettore vuoto se non trova log per l'email
  }
}

  /**
  * create a log with user,descr,server,service as params
  * @ param string - the email of the user
  * @ descr string - a string that describe the event
  * @ server string - the ip of the server where the event is logged
  * @ service string - the name of servcice where the event is logged
  */
  setLog(user:string,descr:string,server?:string,service?:string){
    const value = Date.now();
    const currentDate = new Date(value);

    const currentDateStr = currentDate.toString();
    const lastId=this.listaLog[this.listaLog.length-1].id;
    const actualLog:Log={
      id:lastId+1,
      data:currentDateStr,
      user:user,
      server:server,
      service:service,
      desc:descr,
    };

   this.listaLog.push(actualLog);
  }



}
