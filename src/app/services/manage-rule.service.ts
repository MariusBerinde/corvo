import { Injectable } from '@angular/core';
import { Rule } from '../interfaces/rule';
import { Service } from '../interfaces/service';

@Injectable({
  providedIn: 'root'
})
export class ManageRuleService {
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
  constructor() { }
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
}
