import { Injectable } from '@angular/core';
import { LynisTest,Lynis } from '../interfaces/lynis';

@Injectable({
  providedIn: 'root'
})
export class ManageLynisService {
  skippableTestList:LynisTest[]=[
{"id":"ACCT-2754",   "os":"FreeBSD",    "desc":"Check for available FreeBSD accounting information (security)"},
{"id":"ACCT-2760",   "os":"OpenBSD",    "desc":"Check for available OpenBSD accounting information (security)"},
{"id":"ACCT-9622",   "os":"Linux",      "desc":"Check for available Linux accounting information (security)"},
{"id":"ACCT-9626",   "os":"Linux",      "desc":"Check for sysstat accounting data (security)"},
{"id":"ACCT-9628",   "os":"Linux",      "desc":"Check for auditd (security)"},
{"id":"ACCT-9630",   "os":"Linux",      "desc":"Check for auditd rules (security)"},
{"id":"ACCT-9632",   "os":"Linux",      "desc":"Check for auditd configuration file (security)"},
{"id":"ACCT-9634",   "os":"Linux",      "desc":"Check for auditd log file (security)"},
{"id":"ACCT-9636",   "os":"Linux",      "desc":"Check for Snoopy wrapper and logger (security)"},
{"id":"ACCT-9650",   "os":"Solaris",    "desc":"Check Solaris audit daemon (security)"},
{"id":"ACCT-9652",   "os":"Solaris",    "desc":"Check auditd SMF status (security)"},
{"id":"ACCT-9654",   "os":"Solaris",    "desc":"Check BSM auditing in /etc/system (security)"},
{"id":"ACCT-9656",   "os":"Solaris",    "desc":"Check BSM auditing in module list (security)"},
{"id":"ACCT-9660",   "os":"Solaris",    "desc":"Check location of audit events (security)"},
{"id":"ACCT-9662",   "os":"Solaris",    "desc":"Check Solaris auditing stats (security)"},
{"id":"AUTH-9204",             "desc":"Check users with an UID of zero (security)"},
{"id":"AUTH-9208",             "desc":"Check non-unique accounts in passwd file (security)"},
{"id":"AUTH-9212",             "desc":"Test group file (security)"},
{"id":"AUTH-9216",             "desc":"Check group and shadow group files (security)"},
{"id":"AUTH-9218",  "os":"FreeBSD",    "desc":"Check harmful login shells (security)"},
{"id":"AUTH-9222",             "desc":"Check for non unique groups (security)"},
{"id":"AUTH-9226",             "desc":"Check non unique group names (security)"},
{"id":"AUTH-9228",             "desc":"Check password file consistency with pwck (security)"},
{"id":"AUTH-9229",             "desc":"Check password hashing methods (security)"},
{"id":"AUTH-9230",             "desc":"Check group password hashing rounds (security)"},
{"id":"AUTH-9234",             "desc":"Query user accounts (security)"},
{"id":"AUTH-9240",             "desc":"Query NIS+ authentication support (security)"},
{"id":"AUTH-9242",             "desc":"Query NIS authentication support (security)"},
{"id":"AUTH-9250",             "desc":"Checking sudoers file (security)"},
{"id":"AUTH-9252",             "desc":"Check sudoers file (security)"},
{"id":"AUTH-9254",  "os":"Solaris",    "desc":"Solaris passwordless accounts (security)"},
{"id":"AUTH-9262",             "desc":"Checking presence password strength testing tools (PAM) (security)"},
{"id":"AUTH-9264",             "desc":"Checking presence pam.conf (security)"},
{"id":"AUTH-9266",             "desc":"Checking presence pam.d files (security)"},
{"id":"AUTH-9268",             "desc":"Checking presence pam.d files (security)"},
{"id":"AUTH-9278",             "desc":"Checking LDAP pam status (security)"},
{"id":"AUTH-9282",             "desc":"Checking password protected account without expire date (security)"},
{"id":"AUTH-9283",             "desc":"Checking accounts without password (security)"},
{"id":"AUTH-9284",             "desc":"Checking locked user accounts in /etc/passwd (security)"},
{"id":"AUTH-9286",             "desc":"Checking user password aging (security)"},
{"id":"AUTH-9288",             "desc":"Checking for expired passwords (security)"},
{"id":"AUTH-9304",  "os":"Solaris",    "desc":"Check single user login configuration (security)"},
{"id":"AUTH-9306",  "os":"HP-UX",      "desc":"Check single boot authentication (security)"},
{"id":"AUTH-9308",  "os":"Linux",      "desc":"Check single user login configuration (security)"},
{"id":"AUTH-9340",  "os":"Solaris",    "desc":"Solaris account locking (security)"},
{"id":"AUTH-9328",             "desc":"Default umask values (security)"},
{"id":"AUTH-9402",             "desc":"Query LDAP authentication support (security)"},
{"id":"AUTH-9406",             "desc":"Query LDAP servers in client configuration (security)"},
{"id":"AUTH-9408",             "desc":"Logging of failed login attempts via /etc/login.defs (security)"},
{"id":"AUTH-9409",  "os":"OpenBSD",    "desc":"Check for doas file (security)"},
{"id":"AUTH-9410",  "os":"OpenBSD",    "desc":"Check for doas file permissions (security)"},
{"id":"BANN-7113",  "os":"FreeBSD",    "desc":"Check COPYRIGHT banner file (security)"},
{"id":"BANN-7124",             "desc":"Check issue banner file (security)"},
{"id":"BANN-7126",             "desc":"Check issue banner file contents (security)"},
{"id":"BANN-7128",             "desc":"Check issue.net banner file (security)"},
{"id":"BANN-7130",             "desc":"Check issue.net banner file contents (security)"},
{"id":"BOOT-5104",             "desc":"Determine service manager (security)"},
{"id":"BOOT-5116",             "desc":"Check if system is booted in UEFI mode (security)"},
{"id":"BOOT-5121",             "desc":"Check for GRUB boot loader presence (security)"},
{"id":"BOOT-5122",             "desc":"Check for GRUB boot password (security)"},
{"id":"BOOT-5139",             "desc":"Check for LILO boot loader presence (security)"},
{"id":"BOOT-5142",             "desc":"Check SPARC Improved boot loader (SILO) (security)"},
{"id":"BOOT-5184",             "desc":"Check permissions for boot files/scripts (security)"},
{"id":"BOOT-5202",             "desc":"Check uptime of system (security)"},
{"id":"BOOT-5260",             "desc":"Check single user mode for systemd (security)"},
{"id":"CONT-8102",             "desc":"Checking Docker status and information (security)"},
{"id":"CONT-8104",             "desc":"Checking Docker info for any warnings (security)"},
{"id":"CONT-8106",             "desc":"Gather basic stats from Docker (security)"},
{"id":"CONT-8107",             "desc":"Check number of unused Docker containers (performance)"},
{"id":"CONT-8108",             "desc":"Check file permissions for Docker files (security)"},
{"id":"CORE-1000",             "desc":"Check all system binaries (performance)"},
{"id":"CRYP-7902",             "desc":"Check expire date of SSL certificates (security)"},
{"id":"BOOT-5155",             "desc":"Check for YABOOT boot loader configuration file (security)"},
{"id":"BANN-7124",             "desc":"Check issue banner file (security)"},
{"id":"BANN-7126",             "desc":"Check issue banner file contents (security)"},
{"id":"BANN-7128",             "desc":"Check issue.net banner file (security)"},
{"id":"BANN-7130",             "desc":"Check issue.net banner file contents (security)"},
{"id":"BOOT-5104",             "desc":"Determine service manager (security)"},
{"id":"BOOT-5116",             "desc":"Check if system is booted in UEFI mode (security)"},
{"id":"BOOT-5121",             "desc":"Check for GRUB boot loader presence (security)"},
{"id":"BOOT-5122",             "desc":"Check for GRUB boot password (security)"},
{"id":"BOOT-5139",             "desc":"Check for LILO boot loader presence (security)"},
{"id":"BOOT-5142",             "desc":"Check SPARC Improved boot loader (SILO) (security)"},
{"id":"BOOT-5184",             "desc":"Check permissions for boot files/scripts (security)"},
{"id":"BOOT-5202",             "desc":"Check uptime of system (security)"},
{"id":"BOOT-5260",             "desc":"Check single user mode for systemd (security)"},
{"id":"CONT-8102",             "desc":"Checking Docker status and information (security)"},
{"id":"CONT-8104",             "desc":"Checking Docker info for any warnings (security)"},
{"id":"CONT-8106",             "desc":"Gather basic stats from Docker (security)"},
{"id":"CONT-8107",             "desc":"Check number of unused Docker containers (performance)"},
{"id":"CONT-8108",             "desc":"Check file permissions for Docker files (security)"},
{"id":"CORE-1000",             "desc":"Check all system binaries (performance)"},
{"id":"CRYP-7902",             "desc":"Check expire date of SSL certificates (security)"},
{"id":"BOOT-5155",             "desc":"Check for YABOOT boot loader configuration file (security)"},
{"id":"BOOT-5102",  "os":"AIX",        "desc":"Check for AIX boot device (security)"},
{"id":"BOOT-5106",  "os":"MacOS",      "desc":"Check EFI boot file on macOS (security)"},
{"id":"BOOT-5108",  "os":"Linux",      "desc":"Test Syslinux boot loader (security)"},
{"id":"BOOT-5109",  "os":"Linux",      "desc":"Test rEFInd boot loader (security)"},
{"id":"BOOT-5117",  "os":"Linux",      "desc":"Check for systemd-boot boot loader (security)"},
{"id":"BOOT-5124",  "os":"FreeBSD",    "desc":"Check for FreeBSD boot loader presence (security)"},
{"id":"BOOT-5126",  "os":"NetBSD",     "desc":"Check for NetBSD boot loader presence (security)"},
{"id":"BOOT-5159",  "os":"OpenBSD",    "desc":"Check for OpenBSD boot loader presence (security)"},
{"id":"BOOT-5165",  "os":"FreeBSD",    "desc":"Check for FreeBSD boot services (security)"},
{"id":"BOOT-5170",  "os":"Solaris",    "desc":"Check for Solaris boot daemons (security)"},
{"id":"BOOT-5177",  "os":"Linux",      "desc":"Check for Linux boot and running services (security)"},
{"id":"BOOT-5180",  "os":"Linux",      "desc":"Check for Linux boot services (Debian style) (security)"},
{"id":"BOOT-5261",  "os":"DragonFly",  "desc":"Check for DragonFly boot loader presence (security)"},
{"id":"BOOT-5262",  "os":"OpenBSD",    "desc":"Check for OpenBSD boot daemons (security)"},
{"id":"BOOT-5263",  "os":"OpenBSD",    "desc":"Check permissions for boot files/scripts (security)"},
{"id":"BOOT-5264",  "os":"Linux",      "desc":"Run systemd-analyze security (security)"},
{"id":"CONT-8004",  "os":"Solaris",    "desc":"Query running Solaris zones (security)"},
{"id":"CRYP-7930",  "os":"Linux",      "desc":"Determine if system uses LUKS encryption (security)"},
{"id":"CRYP-7931",  "os":"Linux",      "desc":"Determine if system uses encrypted swap (security)"},
{"id":"CRYP-8002",  "os":"Linux",      "desc":"Gather kernel entropy (security)"},
{"id":"CRYP-8004",  "os":"Linux",      "desc":"Presence of hardware random number generators (security)"},
{"id":"CRYP-8005",  "os":"Linux",      "desc":"Presence of software pseudo random number generators (security)"},
{"id":"FILE-6323",  "os":"Linux",      "desc":"Checking EXT file systems (security)"},
{"id":"FILE-6330",  "os":"FreeBSD",    "desc":"Checking ZFS file systems (security)"},
{"id":"FILE-6344",  "os":"Linux",      "desc":"Checking proc mount options (security)"},
{"id":"FILE-6368",  "os":"Linux",      "desc":"Checking ACL support on root file system (security)"},
{"id":"FILE-6372",  "os":"Linux",      "desc":"Checking / mount options (security)"},
{"id":"FILE-6374",  "os":"Linux",      "desc":"Linux mount options (security)"},
{"id":"FILE-6376",  "os":"Linux",      "desc":"Determine if /var/tmp is bound to /tmp (security)"},
{"id":"FILE-6394",  "os":"Linux",      "desc":"Test swappiness of virtual memory (performance)"},
{"id":"FILE-6439",  "os":"DragonFly",  "desc":"Checking HAMMER PFS mounts (security)"},
  ];
  actualConif:Lynis={
    "auditor":"lol",
    "listIdSkippedTest":[]
  };
  constructor() { }
/**
 * Retrieves the list of Lynis tests that can be skipped.
 * @returns An array of skippable LynisTest objects.
 */
  getSkippableTestList():LynisTest[]{
    return this.skippableTestList;
  }
/**
 * Sets the auditor name in the current Lynis configuration.
 * @param user - The name of the auditor to assign.
 */
  setAuditor(user:string){
    this.actualConif.auditor=user;
  }
/**
 * Replaces the current Lynis configuration with the provided one.
 * @param config - The new Lynis configuration object.
 */
  setConfig(config:Lynis){
    this.actualConif=config;
  }
/**
 * Returns the current Lynis configuration in use.
 * @returns The current Lynis configuration object.
 */
  getActualConfig():Lynis{
    return this.actualConif;
  }
/**
 * Retrieves the list of IDs of the tests that have been skipped in the current configuration.
 * @returns An array of test ID strings that were skipped.
 */
  getSkippedTests():string[]{
    return this.actualConif.listIdSkippedTest;
  }

}
