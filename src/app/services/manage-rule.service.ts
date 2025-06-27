import { Injectable } from '@angular/core';
import { Rule } from '../interfaces/rule';
import { Service } from '../interfaces/service';
import { HttpStatusCode } from '@angular/common/http';
import {LocalWriteService} from './local-write.service';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,  Observable,map, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import {ManageLogService } from './manage-log.service';
@Injectable({
  providedIn: 'root'
})
export class ManageRuleService {

  private readonly API_BASE = 'http://localhost:8083';
  private actualUsername:string='';
  private loggedUser:any = null ;
  private rulesByIpSb = new BehaviorSubject<Rule []>([]);
  public rulesByIp$ = this.rulesByIpSb.asObservable();


private listaRegole:Rule[]=[
  {
    "id":0,
    "descr":"CPT-ADM-3 - Blocco del login \"root\" eccetto per terminali fisici o console di emergenza.",
    "status":true,
    "ip":"193.168.111.111",
    "service":1
  },
  {
    "id":1,
    "descr":"ADM-ACC-5 - Configurazione sicura SSHv2.",
    "status":false,
    "ip":"193.168.111.112",
    "service":2
  },
  {
    "id":2,
    "descr":"CPT-ATR-2 - Correttezza e permessi di modifica del MOTD.",
    "status":true,
    "ip":"193.168.111.113",
    "service":3
  },
  {
    "id":3,
    "descr":"SYS-OSL-6 - Uso di cron consentito solo per \"root\".",
    "status":true,
    "ip":"193.168.111.114"
  },
  {
    "id":4,
    "descr":"SOL-LYN-1 - Lynis installato.",
    "status":false,
    "ip":"193.168.111.111",
    "service":1
  },
  {
    "id":5,
    "descr":"SUP-LOG-1 - Rsyslog installato e abilitato.",
    "status":false,
    "ip":"193.168.111.112",
    "service":2
  },
  {
    "id":6,
    "descr":"SUP-LOG-2 - Rsyslog configurato.",
    "status":true,
    "ip":"193.168.111.113",
    "service":3
  },
  {
    "id":7,
    "descr":"SUP_COR-1 - Centralizzazione dei log configurata.",
    "status":false,
    "ip":"193.168.111.114"
  },
  {
    "id":8,
    "descr":"SUP-EML-1 - SMTP non attivo.",
    "status":true,
    "ip":"193.168.111.111",
    "service":1
  },
  {
    "id":9,
    "descr":"SYS-RES-8 - IPv6 disabilitato.",
    "status":true,
    "ip":"193.168.111.112",
    "service":2
  },
  {
    "id":10,
    "descr":"SYS-FIL-1 - Firewalld installato e configurato.",
    "status":false,
    "ip":"193.168.111.113",
    "service": 3
  },
  {
    "id":11,
    "descr":"SOL-AID-1 - AIDE installato.",
    "status":true,
    "ip":"193.168.111.114"
  }];

  constructor(
    private log:ManageLogService,
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

      const username = this.storage.getData("username")??'';
      if(username.length>0)
        this.actualUsername = username;
  }
/**
 * Retrieves all rules associated with a specific IP address.
 *
 * Filters the list of rules to find those that match the provided IP.
 *
 * @param ip - The IP address for which rules are to be retrieved.
 * @returns An array of `Rule` objects matching the IP; returns an empty array if no matches are found.
 */
  getRulesByIp(ip:string):Rule[]{
    const rules = this.listaRegole.filter(rule=>rule.ip===ip );
    if (rules.length >= 1) {
      return rules;
    }else{
      return [];
    }
  }


  //TODO:implement rest request with promise

  /**
  *
  *
  */
  getRulesByIpO(ip:String):Observable<Rule []>{

    const url = `${this.API_BASE}/getRulesByIp`;
    const body = {
      "username":this.actualUsername,
      "ip":ip
    }
    return this.http.post<Rule[]>(url,body).pipe(

      tap((rules)=>{
        this.rulesByIpSb.next(rules);
      }),
      catchError(this.handleError)
    )

  }

  getValuesOfRules():Rule[]{
    return this.rulesByIpSb.value;
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

}
