import { Injectable } from '@angular/core';
import { Log } from '../interfaces/log';
import { Observable, throwError } from 'rxjs';
import {HttpClient,HttpHeaders,HttpErrorResponse,HttpResponse } from '@angular/common/http';
import { retry, catchError,map } from 'rxjs/operators';
import {LocalWriteService} from './local-write.service';

@Injectable({
  providedIn: 'root'
})
export class ManageLogService {

  private readonly API_BASE = 'http://localhost:8083';
  protected listaLog:Log[]=[{
    "id":0,
    "data":"Mon May 05 2025 10:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "userEmail":"t1@gmail.com",
    "descr":"creato utente XXXX"
  },
  {
    "id":1,
    "data":"Mon May 05 2025 10:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "userEmail":"t1@gmail.com",
    "descr":"creato utente YYYY"
  },
  {
    "id":2,
    "data":"Mon May 05 2025 11:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.111",
    "userEmail":"t1@gmail.com",
    "descr":"creato db",
  },
  {
    "id":3,
    "data":"Mon May 05 2025 11:48:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.112",
    "userEmail":"t1@gmail.com",
    "descr":"creato db",
  },
  {
    "id":4,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t1@gmail.com",
    "descr":"creato db",
  },
  {
    "id":5,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t1@gmail.com",
    "descr":"modificata regola XXX",
  },
  {
    "id":6,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t2@gmail.com",
    "descr":" modificata regola YYY",
  },
  {
    "id":7,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t2@gmail.com",
    "descr":"modificata regola ZZZ",
  },

  {
    "id":8,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t2@gmail.com",
    "descr":" inserita regola ABC",
  },

  {
    "id":9,
    "data":"Mon May 05 2025 11:50:30 GMT+0200 (Ora legale dell’Europa centrale)",
    "ip":"193.168.111.113",
    "userEmail":"t2@gmail.com",
    "descr":"Modificata regola ACD",
  }
  ];
  email:string='';
  constructor(
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

    const localEmail:string  = this.storage.getData('email')??'';

      if(localEmail.length>0)
        this.email = localEmail;
  }
  /* Returns all the log from the database
   */
  getAllLogs():Log[]{
    return this.listaLog;
  }

  public getAllLogsO():Observable<Log[]>{

    const url = 'http://localhost:8083/getAllLogs';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'username': this.email
    });

    return this.http.get<Log[]>(url, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Log[]>) => response.body!),
      retry(2),
      catchError(this.handleError)
    );
  }

  private handleError =   (error: HttpErrorResponse): Observable<never> => {
  console.error('Errore API:', error);

  let errorMessage = 'Errore sconosciuto';
  if (error.status === 0) {
    errorMessage = 'Errore di connessione al server';
  } else if (error.status >= 400 && error.status < 500) {
    errorMessage = 'Errore nella richiesta';
  } else if (error.status >= 500) {
    errorMessage = 'Errore del server';
  }

  return throwError(() => new Error(errorMessage));
}

/**
 * Returns all logs associated with a user given their email address.
 * @param email - The email address of the user
 * @returns An array of Log objects associated with the user (may be empty)
 */
getUserLog(email: string): Log[] {
  console.log("email ricevuta =",email);
  const userLogs = this.listaLog.filter(log => log.userEmail === email);

    /*
  if (userLogs.length > 1) {
    return userLogs; // Restituisce il vettore completo se ci sono più log
  } else if (userLogs.length === 1) {
    return userLogs; // Restituisce il vettore con un solo elemento se ne trova uno
  } else {
    return []; // Restituisce il vettore vuoto se non trova log per l'email
  }
  */
  if(userLogs.length>=1){
      return userLogs;
    }
    else{
      return [];
    }

}
 getUserLogO(email: string){

    const url = 'http://localhost:8083/getUserLogs';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'email': this.email
    });
    console.log("lanciato getUserLog ");

    return this.http.get<Log[]>(url, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Log[]>) => response.body!),
      retry(2),
      catchError(this.handleError)
    );
  }


  /**
  * create a log with user,descr,server,service as params
  * @ param string - the email of the user
  * @ descr string - a string that describe the event
  * @ server string - the IP of the server where the event is logged
  * @ service string - the name of service where the event is logged
  */
  setLog(user:string,descr:string,server?:string,service?:string){
    const value = Date.now();
    const currentDate = new Date(value);

    const currentDateStr = currentDate.toString();
    const lastId=this.listaLog[this.listaLog.length-1].id;
    const actualLog:Log={
      id:lastId+1,
      data:currentDateStr,
      userEmail:user,
      ip:server,
      service:service,
      descr:descr,
    };

   this.listaLog.push(actualLog);
  }

}
