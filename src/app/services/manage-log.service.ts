import { Injectable,HostListener } from '@angular/core';
import { Log } from '../interfaces/log';
import { Observable, throwError } from 'rxjs';
import {HttpClient,HttpHeaders,HttpErrorResponse,HttpResponse } from '@angular/common/http';
import { retry, catchError,map } from 'rxjs/operators';
import {LocalWriteService} from './local-write.service';
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { resolve } from 'node:path';
import { response } from 'express';
import { brotliCompress } from 'node:zlib';
import { environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ManageLogService {

  //private readonly API_BASE = 'http://localhost:8083';
  private readonly API_BASE = environment.apiBaseUrl;
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

  private localLogs:Log[] = [];
  private email:string='';
  private username:string='';

  constructor(
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

    const localEmail:string  = this.storage.getData('email')??'';

      if(localEmail.length>0)
        this.email = localEmail;
    this.username = this.storage.getData("username")??"";
  }
  /* Returns all the logs from the database
   */
  getAllLogs():Log[]{
    return this.listaLog;
  }

  /**
   *  Returns all the logs from the database using Observable.
   *  The REST request needs username parameter (technically is the email address)
   */
  public getAllLogsO():Observable<Log[]>{

    const url = `${this.API_BASE}/getAllLogs`;
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
  if (error.status === 0 ) {
    errorMessage = 'Errore di connessione al server';
  //} else if (error.status >= 400 && error.status < 500) {
  } else if (error.status >= HttpStatusCode.BadRequest && error.status < HttpStatusCode.InternalServerError) {
    errorMessage = 'Errore nella richiesta';
  } else if (error.status >= HttpStatusCode.InternalServerError) {
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


  /**
   * returns the logs of the user that is identified with the param email
   */
  getUserLogO(email: string){

    const url = `${this.API_BASE}/getUserLogs`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'email': this.email
    });
    console.log("lanciato getUserLog con email = ",this.email);

    return this.http.get<Log[]>(url, {
      headers: headers,
      observe: 'response'
    }).pipe(
        map((response: HttpResponse<Log[]>) => response.body!),
        retry(2),
        catchError(this.handleError)
      );
  }


  /*
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
    const actualLog:Log={
      data:currentDateStr,
      userEmail:user,
      ip:server,
      service:service,
      descr:descr,
    };

    console.log(`inserimento log ${actualLog.userEmail}`)


   this.localLogs.push(actualLog);
  }

public async loadLocalLogs(): Promise<boolean> {
  const url = `${this.API_BASE}/addAllLogs`;
  const data = {
    "username": this.username,
    "logs": this.localLogs
  }
    console.log(`loadLocalLogs username = ${data.username} `)
    console.log(`loadLocalLogs logs = ${this.localLogs}`)

  try {
    const response = await lastValueFrom(
      this.http.post<String>(url, data, { observe: 'response' })
    );

    return response.status === HttpStatusCode.Ok;

  } catch (error: any) {
    console.log("loadLocalLogs error:", error);

    switch (error.status) {
      case HttpStatusCode.BadRequest:
        throw new Error(`Bad Request: ${error.message || 'Invalid request'}`);

      case HttpStatusCode.Unauthorized:
        throw new Error(`Unauthorized: ${error.message || 'Authentication failed'}`);

      default:
        throw new Error(`Request failed with status ${error.status}: ${error.message || 'Unknown error'}`);
    }
  }
}

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    try {
      if (this.localLogs.length > 0) {
        const data = {
          username: this.username,
          logs: this.localLogs
        };

        const blob = new Blob([JSON.stringify(data)], {
          type: 'application/json'
        });

        navigator.sendBeacon(`${this.API_BASE}/addAllLogs`, blob);

        // opzionale: svuota i log locali se vuoi
        // this.localLogs = [];
      }
    } catch (e) {
      console.warn('Errore nell\'invio dei log prima della chiusura:', e);
    }
  }

}
