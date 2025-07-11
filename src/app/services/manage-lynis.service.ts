import { Injectable } from '@angular/core';
import { LynisTest,Lynis } from '../interfaces/lynis';
import {ManageLogService } from './manage-log.service';
import {LocalWriteService} from './local-write.service';
import {HttpClient,HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { BehaviorSubject,  Observable,map, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { environment} from '../../environments/environment';

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
{"id":"FILE-6329",             "desc":"Checking FFS/UFS file systems (security)"},
{"id":"FILE-6332",             "desc":"Checking swap partitions (security)"},
{"id":"FILE-6336",             "desc":"Checking swap mount options (security)"},
{"id":"FILE-6354",             "desc":"Searching for old files in /tmp (security)"},
{"id":"FILE-6362",             "desc":"Checking /tmp sticky bit (security)"},
{"id":"FILE-6363",             "desc":"Checking /var/tmp sticky bit (security)"},
{"id":"FILE-6410",             "desc":"Checking Locate database (security)"},
{"id":"FILE-6430",             "desc":"Disable mounting of some filesystems (security)"},
{"id":"DNS-1600",              "desc":"Validating that the DNSSEC signatures are checked (security)"},
{"id":"DBS-1804",              "desc":"Checking active MySQL process (security)"},
{"id":"DBS-1816",              "desc":"Checking MySQL root password (security)"},
{"id":"DBS-1818",              "desc":"MongoDB status (security)"},
{"id":"DBS-1820",              "desc":"Check MongoDB authentication (security)"},
{"id":"DBS-1826",              "desc":"Checking active PostgreSQL processes (security)"},
{"id":"DBS-1828",              "desc":"PostgreSQL configuration files (security)"},
{"id":"DBS-1840",              "desc":"Checking active Oracle processes (security)"},
{"id":"DBS-1860",              "desc":"Checking active DB2 instances (security)"},
{"id":"DBS-1880",              "desc":"Checking active Redis processes (security)"},
{"id":"DBS-1882",              "desc":"Redis configuration file (security)"},
{"id":"DBS-1884",              "desc":"Redis configuration (requirepass) (security)"},
{"id":"DBS-1886",              "desc":"Redis configuration (CONFIG command renamed) (security)"},
{"id":"DBS-1888",              "desc":"Redis configuration (bind on localhost) (security)"},
{"id":"FILE-6310",             "desc":"Checking /tmp, /home and /var directory (security)"},
{"id":"FILE-6311",             "desc":"Checking LVM volume groups (security)"},
{"id":"FILE-6312",             "desc":"Checking LVM volumes (security)"},
{"id":"FILE-7524",             "desc":"Perform file permissions check (security)"},
{"id":"FINT-4310",             "desc":"AFICK availability (security)"},
{"id":"FINT-4314",             "desc":"AIDE availability (security)"},
{"id":"FINT-4315",             "desc":"Check AIDE configuration file (security)"},
{"id":"FINT-4316",             "desc":"Presence of AIDE database and size check (security)"},
{"id":"FINT-4318",             "desc":"Osiris availability (security)"},
{"id":"FINT-4322",             "desc":"Samhain availability (security)"},
{"id":"FINT-4326",             "desc":"Tripwire availability (security)"},
{"id":"FINT-4328",             "desc":"OSSEC syscheck daemon running (security)"},
{"id":"FINT-4330",             "desc":"mtree availability (security)"},
{"id":"FINT-4334",             "desc":"Check lfd daemon status (security)"},
{"id":"FINT-4336",             "desc":"Check lfd configuration status (security)"},
{"id":"FINT-4338",             "desc":"osqueryd syscheck daemon running (security)"},
 {"id":"FILE-6329",             "desc":"Checking FFS/UFS file systems (security)"},
 {"id":"FILE-6332",             "desc":"Checking swap partitions (security)"},
 {"id":"FILE-6336",             "desc":"Checking swap mount options (security)"},
 {"id":"FILE-6354",             "desc":"Searching for old files in /tmp (security)"},
 {"id":"FILE-6362",             "desc":"Checking /tmp sticky bit (security)"},
 {"id":"FILE-6363",             "desc":"Checking /var/tmp sticky bit (security)"},
 {"id":"FILE-6410",             "desc":"Checking Locate database (security)"},
 {"id":"FILE-6430",             "desc":"Disable mounting of some filesystems (security)"},
 {"id":"DNS-1600",              "desc":"Validating that the DNSSEC signatures are checked (security)"},
 {"id":"DBS-1804",              "desc":"Checking active MySQL process (security)"},
 {"id":"DBS-1816",              "desc":"Checking MySQL root password (security)"},
 {"id":"DBS-1818",              "desc":"MongoDB status (security)"},
 {"id":"DBS-1820",              "desc":"Check MongoDB authentication (security)"},
 {"id":"DBS-1826",              "desc":"Checking active PostgreSQL processes (security)"},
 {"id":"DBS-1828",              "desc":"PostgreSQL configuration files (security)"},
 {"id":"DBS-1840",              "desc":"Checking active Oracle processes (security)"},
 {"id":"DBS-1860",              "desc":"Checking active DB2 instances (security)"},
 {"id":"DBS-1880",              "desc":"Checking active Redis processes (security)"},
 {"id":"DBS-1882",              "desc":"Redis configuration file (security)"},
 {"id":"DBS-1884",              "desc":"Redis configuration (requirepass) (security)"},
 {"id":"DBS-1886",              "desc":"Redis configuration (CONFIG command renamed) (security)"},
 {"id":"DBS-1888",              "desc":"Redis configuration (bind on localhost) (security)"},
 {"id":"FILE-6310",             "desc":"Checking /tmp, /home and /var directory (security)"},
 {"id":"FILE-6311",             "desc":"Checking LVM volume groups (security)"},
 {"id":"FILE-6312",             "desc":"Checking LVM volumes (security)"},
 {"id":"FILE-7524",             "desc":"Perform file permissions check (security)"},
 {"id":"FINT-4310",             "desc":"AFICK availability (security)"},
 {"id":"FINT-4314",             "desc":"AIDE availability (security)"},
 {"id":"FINT-4315",             "desc":"Check AIDE configuration file (security)"},
 {"id":"FINT-4316",             "desc":"Presence of AIDE database and size check (security)"},
 {"id":"FINT-4318",             "desc":"Osiris availability (security)"},
 {"id":"FINT-4322",             "desc":"Samhain availability (security)"},
 {"id":"FINT-4326",             "desc":"Tripwire availability (security)"},
 {"id":"FINT-4328",             "desc":"OSSEC syscheck daemon running (security)"},
 {"id":"FINT-4330",             "desc":"mtree availability (security)"},
 {"id":"FINT-4334",             "desc":"Check lfd daemon status (security)"},
 {"id":"FINT-4336",             "desc":"Check lfd configuration status (security)"},
 {"id":"FINT-4338",             "desc":"osqueryd syscheck daemon running (security)"},
{"id":"FIRE-4502",  "os":"Linux",      "desc":"Check iptables kernel module (security)"},
{"id":"FINT-4339",  "os":"Linux",      "desc":"Check IMA/EVM Status (security)"},
{"id":"FINT-4340",  "os":"Linux",      "desc":"Check dm-integrity status (security)"},
{"id":"FINT-4341",  "os":"Linux",      "desc":"Check dm-verity status (security)"},
{"id":"FIRE-4526",  "os":"Solaris",    "desc":"Check ipf status (security)"},
{"id":"FIRE-4530",  "os":"FreeBSD",    "desc":"Check IPFW status (security)"},
{"id":"FIRE-4532",  "os":"MacOS",      "desc":"Check macOS application firewall (security)"},
{"id":"FIRE-4534",  "os":"MacOS",      "desc":"Check for outbound firewalls (security)"},
{"id":"FIRE-4536",  "os":"Linux",      "desc":"Check nftables status (security)"},
{"id":"FIRE-4538",  "os":"Linux",      "desc":"Check nftables basic configuration (security)"},
{"id":"FIRE-4540",  "os":"Linux",      "desc":"Test for empty nftables configuration (security)"},
{"id":"FINT-4350",             "desc":"File integrity software installed (security)"},
{"id":"FINT-4402",             "desc":"Checksums (SHA256 or SHA512) (security)"},
{"id":"FIRE-4508",             "desc":"Check used policies of iptables chains (security)"},
{"id":"FIRE-4512",             "desc":"Check iptables for empty ruleset (security)"},
{"id":"FIRE-4513",             "desc":"Check iptables for unused rules (security)"},
{"id":"FIRE-4518",             "desc":"Check pf firewall components (security)"},
{"id":"FIRE-4520",             "desc":"Check pf configuration consistency (security)"},
{"id":"FIRE-4524",             "desc":"Check for CSF presence (security)"},
{"id":"FIRE-4586",             "desc":"Check firewall logging (security)"},
{"id":"FIRE-4590",             "desc":"Check firewall status (security)"},
{"id":"FIRE-4594",             "desc":"Check for APF presence (security)"},
{"id":"HOME-9302",             "desc":"Create list with home directories (security)"},
{"id":"HOME-9304",             "desc":"Test permissions of user home directories (security)"},
{"id":"HOME-9306",             "desc":"Test ownership of user home directories (security)"},
{"id":"HOME-9310",             "desc":"Checking for suspicious shell history files (security)"},
{"id":"HOME-9350",             "desc":"Collecting information from home directories (security)"},
{"id":"HRDN-7220",             "desc":"Check if one or more compilers are installed (security)"},
{"id":"HRDN-7222",             "desc":"Check compiler permissions (security)"},
{"id":"HRDN-7230",             "desc":"Check for malware scanner (security)"},
{"id":"HTTP-6622",             "desc":"Checking Apache presence (security)"},
{"id":"HTTP-6624",             "desc":"Testing main Apache configuration file (security)"},
{"id":"HTTP-6626",             "desc":"Testing other Apache configuration file (security)"},
{"id":"HTTP-6632",             "desc":"Determining all available Apache modules (security)"},
{"id":"HTTP-6640",             "desc":"Determining existence of specific Apache modules (security)"},
{"id":"HTTP-6641",             "desc":"Determining existence of specific Apache modules (security)"},
{"id":"HTTP-6643",             "desc":"Determining existence of specific Apache modules (security)"},
{"id":"HTTP-6702",             "desc":"Check nginx process (security)"},
{"id":"HTTP-6704",             "desc":"Check nginx configuration file (security)"},
{"id":"HTTP-6706",             "desc":"Check for additional nginx configuration files (security)"},
{"id":"HTTP-6708",             "desc":"Check discovered nginx configuration settings (security)"},
{"id":"HTTP-6710",             "desc":"Check nginx SSL configuration settings (security)"},
{"id":"HTTP-6712",             "desc":"Check nginx access logging (security)"},
{"id":"HTTP-6714",             "desc":"Check for missing error logs in nginx (security)"},
{"id":"HTTP-6716",             "desc":"Check for debug mode on error log in nginx (security)"},
{"id":"HTTP-6720",             "desc":"Check Nginx log files (security)"},
{"id":"INSE-8000",             "desc":"Installed inetd package (security)"},
{"id":"INSE-8002",             "desc":"Status of inet daemon (security)"},
{"id":"INSE-8004",             "desc":"Presence of inetd configuration file (security)"},
{"id":"INSE-8006",             "desc":"Check configuration of inetd when it is disabled (security)"},
{"id":"INSE-8016",             "desc":"Check for telnet via inetd (security)"},
{"id":"INSE-8100",             "desc":"Installed xinetd package (security)"},
{"id":"INSE-8116",             "desc":"Insecure services enabled via xinetd (security)"},
{"id":"INSE-8200",             "desc":"Usage of TCP wrappers (security)"},
{"id":"INSE-8300",             "desc":"Presence of rsh client (security)"},
{"id":"INSE-8302",             "desc":"Presence of rsh server (security)"},
{"id":"INSE-8310",             "desc":"Presence of telnet client (security)"},
{"id":"INSE-8312",             "desc":"Presence of telnet server (security)"},
{"id":"INSE-8314",             "desc":"Presence of NIS client (security)"},
{"id":"INSE-8316",             "desc":"Presence of NIS server (security)"},
{"id":"INSE-8318",             "desc":"Presence of TFTP client (security)"},
{"id":"INSE-8320",             "desc":"Presence of TFTP server (security)"},
{"id":"INSE-8050",  "os":"MacOS",      "desc":"Check for insecure services on macOS systems (security)"},
{"id":"KRNL-5622",  "os":"Linux",      "desc":"Determine Linux default run level (security)"},
{"id":"KRNL-5677",  "os":"Linux",      "desc":"Check CPU options and support (security)"},
{"id":"KRNL-5695",  "os":"Linux",      "desc":"Determine Linux kernel version and release number (security)"},
{"id":"KRNL-5723",  "os":"Linux",      "desc":"Determining if Linux kernel is monolithic (security)"},
{"id":"KRNL-5726",  "os":"Linux",      "desc":"Checking Linux loaded kernel modules (security)"},
{"id":"KRNL-5728",  "os":"Linux",      "desc":"Checking Linux kernel config (security)"},
{"id":"KRNL-5730",  "os":"Linux",      "desc":"Checking disk I/O kernel scheduler (security)"},
{"id":"KRNL-5745",  "os":"FreeBSD",    "desc":"Checking FreeBSD loaded kernel modules (security)"},
{"id":"KRNL-5770",  "os":"Solaris",    "desc":"Checking active kernel modules (security)"},
{"id":"KRNL-5788",  "os":"Linux",      "desc":"Checking availability new Linux kernel (security)"},
{"id":"KRNL-5820",  "os":"Linux",      "desc":"Checking core dumps configuration (security)"},
{"id":"KRNL-5830",  "os":"Linux",      "desc":"Checking if system is running on the latest installed kernel (security)"},
{"id":"KRNL-5831",  "os":"DragonFly",  "desc":"Checking DragonFly loaded kernel modules (security)"},
{"id":"LOGG-2138",  "os":"Linux",      "desc":"Checking kernel logger daemon on Linux (security)"},
{"id":"LOGG-2142",  "os":"Linux",      "desc":"Checking minilog daemon (security)"},
{"id":"NAME-4024",  "os":"Solaris",    "desc":"Solaris uname -n output (security)"},
{"id":"NAME-4026",  "os":"Solaris",    "desc":"Check /etc/nodename (security)"},
{"id":"NETW-2600",  "os":"Linux",      "desc":"Checking IPv6 configuration (security)"},
{"id":"NETW-3015",  "os":"Linux",      "desc":"Checking promiscuous interfaces (Linux) (security)"},
{"id":"NETW-3032",  "os":"Linux",      "desc":"Checking for ARP monitoring software (security)"},
{"id":"PKGS-7306",  "os":"Solaris",    "desc":"Querying Solaris packages (security)"},
{"id":"PKGS-7320",  "os":"Linux",      "desc":"Check presence of arch-audit for Arch Linux (security)"},
{"id":"PKGS-7322",  "os":"Linux",      "desc":"Discover vulnerable packages on Arch Linux (security)"},
{"id":"PKGS-7348",  "os":"FreeBSD",    "desc":"Check for old distfiles (security)"},
{"id":"PKGS-7380",  "os":"NetBSD",     "desc":"Check for vulnerable NetBSD packages (security)"},
{"id":"PKGS-7390",  "os":"Linux",      "desc":"Check Ubuntu database consistency (security)"},
{"id":"PKGS-7392",  "os":"Linux",      "desc":"Check for Debian/Ubuntu security updates (security)"},
{"id":"PKGS-7394",  "os":"Linux",      "desc":"Check for Ubuntu updates (security)"},
{"id":"PRNT-2302",  "os":"FreeBSD",    "desc":"Check for printcap consistency (security)"},
{"id":"PRNT-2316",  "os":"AIX",        "desc":"Checking /etc/qconfig file (security)"},
{"id":"PRNT-2418",  "os":"AIX",        "desc":"Checking qdaemon printer spooler status (security)"},
{"id":"PRNT-2420",  "os":"AIX",        "desc":"Checking old print jobs (security)"},
{"id":"PROC-3602",  "os":"Linux",      "desc":"Checking /proc/meminfo for memory details (security)"},
{"id":"PROC-3604",  "os":"Solaris",    "desc":"Query prtconf for memory details (security)"},
{"id":"SINT-7010",  "os":"MacOS",      "desc":"System Integrity Status (security)"},
{"id":"SHLL-6202",  "os":"FreeBSD",    "desc":"Check console TTYs (security)"},
{"id":"STRG-1846",  "os":"Linux",      "desc":"Check if firewire storage is disabled (security)"},
{"id":"TIME-3136",  "os":"Linux",      "desc":"Check NTP protocol version (security)"},
{"id":"TIME-3148",  "os":"Linux",      "desc":"Check TZ variable (performance)"},
{"id":"TIME-3160",  "os":"Linux",      "desc":"Check empty NTP step-tickers (security)"},
{"id":"KRNL-6000",             "desc":"Check sysctl key pairs in scan profile (security)"},
{"id":"LDAP-2219",             "desc":"Check running OpenLDAP instance (security)"},
{"id":"LDAP-2224",             "desc":"Check presence slapd.conf (security)"},
{"id":"LOGG-2130",             "desc":"Check for running syslog daemon (security)"},
{"id":"LOGG-2132",             "desc":"Check for running syslog-ng daemon (security)"},
{"id":"LOGG-2134",             "desc":"Checking Syslog-NG configuration file consistency (security)"},
{"id":"LOGG-2136",             "desc":"Check for running systemd journal daemon (security)"},
{"id":"LOGG-2146",             "desc":"Checking logrotate.conf and logrotate.d (security)"},
{"id":"LOGG-2148",             "desc":"Checking logrotated files (security)"},
{"id":"LOGG-2150",             "desc":"Checking directories in logrotate configuration (security)"},
{"id":"LOGG-2152",             "desc":"Checking loghost (security)"},
{"id":"LOGG-2153",             "desc":"Checking loghost is not localhost (security)"},
{"id":"LOGG-2154",             "desc":"Checking syslog configuration file (security)"},
{"id":"LOGG-2160",             "desc":"Checking /etc/newsyslog.conf (security)"},
{"id":"LOGG-2162",             "desc":"Checking directories in /etc/newsyslog.conf (security)"},
{"id":"LOGG-2164",             "desc":"Checking files specified /etc/newsyslog.conf (security)"},
{"id":"LOGG-2170",             "desc":"Checking log paths (security)"},
{"id":"LOGG-2180",             "desc":"Checking open log files (security)"},
{"id":"LOGG-2190",             "desc":"Checking for deleted files in use (security)"},
{"id":"LOGG-2192",             "desc":"Checking for opened log files that are empty (security)"},
{"id":"LOGG-2210",             "desc":"Check for running metalog daemon (security)"},
{"id":"LOGG-2230",             "desc":"Check for running RSyslog daemon (security)"},
{"id":"LOGG-2240",             "desc":"Check for running RFC 3195 compliant daemon (security)"},
{"id":"MACF-6204",             "desc":"Check AppArmor presence (security)"},
{"id":"MACF-6208",             "desc":"Check if AppArmor is enabled (security)"},
{"id":"MACF-6232",             "desc":"Check SELINUX presence (security)"},
{"id":"MACF-6234",             "desc":"Check SELINUX status (security)"},
{"id":"MACF-6240",             "desc":"Detection of TOMOYO binary (security)"},
{"id":"MACF-6242",             "desc":"Status of TOMOYO MAC framework (security)"},
{"id":"MACF-6290",             "desc":"Check for implemented MAC framework (security)"},
{"id":"MAIL-8802",             "desc":"Check Exim status (security)"},
{"id":"MAIL-8804",             "desc":"Exim configuration (security)"},
{"id":"MAIL-8814",             "desc":"Check postfix process status (security)"},
{"id":"MAIL-8816",             "desc":"Check Postfix configuration (security)"},
{"id":"MAIL-8817",             "desc":"Check Postfix configuration errors (security)"},
{"id":"MAIL-8818",             "desc":"Postfix banner (security)"},
{"id":"MAIL-8820",             "desc":"Postfix configuration (security)"},
{"id":"MAIL-8838",             "desc":"Check dovecot process (security)"},
{"id":"MAIL-8860",             "desc":"Check Qmail status (security)"},
{"id":"MAIL-8880",             "desc":"Check Sendmail status (security)"},
{"id":"MAIL-8920",             "desc":"Check OpenSMTPD status (security)"},
{"id":"MALW-3275",             "desc":"Check for chkrootkit (security)"},
{"id":"MALW-3276",             "desc":"Check for Rootkit Hunter (security)"},
{"id":"MALW-3278",             "desc":"Check for LMD (security)"},
{"id":"MALW-3280",             "desc":"Check if anti-virus tool is installed (security)"},
{"id":"MALW-3282",             "desc":"Check for clamscan (security)"},
{"id":"MALW-3284",             "desc":"Check for clamd (security)"},
{"id":"MALW-3286",             "desc":"Check for freshclam (security)"},
{"id":"MALW-3288",             "desc":"Check for ClamXav (security)"},
{"id":"NAME-4016",             "desc":"Check /etc/resolv.conf default domain (security)"},
{"id":"NAME-4018",             "desc":"Check /etc/resolv.conf search domains (security)"},
{"id":"NAME-4020",             "desc":"Check non default options (security)"},
{"id":"NAME-4028",             "desc":"Check domain name (security)"},
{"id":"NAME-4032",             "desc":"Check nscd status (security)"},
{"id":"NAME-4034",             "desc":"Check Unbound status (security)"},
{"id":"NAME-4036",             "desc":"Check Unbound configuration file (security)"},
{"id":"NAME-4202",             "desc":"Check BIND status (security)"},
{"id":"NAME-4204",             "desc":"Search BIND configuration file (security)"},
{"id":"NAME-4206",             "desc":"Check BIND configuration consistency (security)"},
{"id":"NAME-4210",             "desc":"Check DNS banner (security)"},
{"id":"NAME-4230",             "desc":"Check PowerDNS status (security)"},
{"id":"NAME-4232",             "desc":"Search PowerDNS configuration file (security)"},
{"id":"NAME-4236",             "desc":"Check PowerDNS backends (security)"},
{"id":"NAME-4238",             "desc":"Check PowerDNS authoritative status (security)"},
{"id":"NAME-4304",             "desc":"Check NIS ypbind status (security)"},
{"id":"NAME-4306",             "desc":"Check NIS domain (security)"},
{"id":"NAME-4402",             "desc":"Check duplicate line in /etc/hosts (security)"},
{"id":"NAME-4404",             "desc":"Check /etc/hosts contains an entry for this server name (security)"},
{"id":"NAME-4406",             "desc":"Check server hostname mapping (security)"},
{"id":"NAME-4408",             "desc":"Check localhost to IP mapping (security)"},
{"id":"NETW-2400",             "desc":"Test hostname for valid characters and length (basics)"},
{"id":"NETW-2704",             "desc":"Basic nameserver configuration tests (security)"},
{"id":"NETW-2705",             "desc":"Check availability two nameservers (security)"},
{"id":"NETW-2706",             "desc":"Check DNSSEC status (security)"},
{"id":"NETW-3001",             "desc":"Find default gateway (route) (security)"},
{"id":"NETW-3004",             "desc":"Search available network interfaces (security)"},
{"id":"NETW-3006",             "desc":"Get network MAC addresses (security)"},
{"id":"NETW-3008",             "desc":"Get network IP addresses (security)"},
{"id":"NETW-3012",             "desc":"Check listening ports (security)"},
{"id":"NETW-3014",             "desc":"Checking promiscuous interfaces (BSD) (security)"},
{"id":"NETW-3028",             "desc":"Checking connections in WAIT state (security)"},
{"id":"NETW-3030",             "desc":"Checking DHCP client status (security)"},
{"id":"NETW-3200",             "desc":"Determine available network protocols (security)"},
{"id":"PHP-2211",              "desc":"Check php.ini presence (security)"},
{"id":"PHP-2320",              "desc":"Check PHP disabled functions (security)"},
{"id":"PHP-2368",              "desc":"Check PHP register_globals option (security)"},
{"id":"PHP-2372",              "desc":"Check PHP expose_php option (security)"},
{"id":"PHP-2374",              "desc":"Check PHP enable_dl option (security)"},
{"id":"PHP-2376",              "desc":"Check PHP allow_url_fopen option (security)"},
{"id":"PHP-2378",              "desc":"Check PHP allow_url_include option (security)"},
{"id":"PHP-2379",              "desc":"Check PHP suhosin extension status (security)"},
{"id":"PHP-2382",              "desc":"Check PHP listen option (security)"},
{"id":"PKGS-7301",             "desc":"Query NetBSD pkg (security)"},
{"id":"PKGS-7302",             "desc":"Query FreeBSD/NetBSD pkg_info (security)"},
{"id":"PKGS-7303",             "desc":"Query brew package manager (security)"},
{"id":"PKGS-7304",             "desc":"Querying Gentoo packages (security)"},
{"id":"PKGS-7308",             "desc":"Checking package list with RPM (security)"},
{"id":"PKGS-7310",             "desc":"Checking package list with pacman (security)"},
{"id":"PKGS-7312",             "desc":"Checking available updates for pacman based system (security)"},
{"id":"PKGS-7314",             "desc":"Checking pacman configuration options (security)"},
{"id":"PKGS-7328",             "desc":"Querying Zypper for installed packages (security)"},
{"id":"PKGS-7330",             "desc":"Querying Zypper for vulnerable packages (security)"},
{"id":"PKGS-7332",             "desc":"Detection of macOS ports and packages (security)"},
{"id":"PKGS-7334",             "desc":"Detection of available updates for macOS ports (security)"},
{"id":"PKGS-7345",             "desc":"Querying dpkg (security)"},
{"id":"PKGS-7346",             "desc":"Search unpurged packages on system (security)"},
{"id":"PKGS-7350",             "desc":"Checking for installed packages with DNF utility (security)"},
{"id":"PKGS-7352",             "desc":"Checking for security updates with DNF utility (security)"},
{"id":"PKGS-7354",             "desc":"Checking package database integrity (security)"},
{"id":"PKGS-7366",             "desc":"Checking for debsecan utility (security)"},
{"id":"PKGS-7370",             "desc":"Checking for debsums utility (security)"},
{"id":"PKGS-7378",             "desc":"Query portmaster for port upgrades (security)"},
{"id":"PKGS-7381",             "desc":"Check for vulnerable FreeBSD packages with pkg (security)"},
{"id":"PKGS-7382",             "desc":"Check for vulnerable FreeBSD packages with portaudit (security)"},
{"id":"PKGS-7383",             "desc":"Check for YUM package Update management (security)"},
{"id":"PKGS-7384",             "desc":"Check for YUM utils package (security)"},
{"id":"PKGS-7386",             "desc":"Check for YUM security package (security)"},
{"id":"PKGS-7387",             "desc":"Check for GPG signing in YUM security package (security)"},
{"id":"PKGS-7388",             "desc":"Check security repository in Debian/ubuntu apt sources.list file (security)"},
{"id":"PKGS-7393",             "desc":"Check for Gentoo vulnerable packages (security)"},
{"id":"PKGS-7398",             "desc":"Check for package audit tool (security)"},
{"id":"PKGS-7410",             "desc":"Count installed kernel packages (security)"},
{"id":"PKGS-7420",             "desc":"Detect toolkit to automatically download and apply upgrades (security)"},
{"id":"PRNT-2304",             "desc":"Check cupsd status (security)"},
{"id":"PRNT-2306",             "desc":"Check CUPSd configuration file (security)"},
{"id":"PRNT-2307",             "desc":"Check CUPSd configuration file permissions (security)"},
{"id":"PRNT-2308",             "desc":"Check CUPSd network configuration (security)"},
{"id":"PRNT-2314",             "desc":"Check lpd status (security)"},
{"id":"PROC-3612",             "desc":"Check dead or zombie processes (security)"},
{"id":"PROC-3614",             "desc":"Check heavy IO waiting based processes (security)"},
{"id":"PROC-3802",             "desc":"Check presence of prelink tooling (security)"},
{"id":"RBAC-6272",             "desc":"Check grsecurity presence (security)"},
{"id":"SCHD-7702",             "desc":"Check status of cron daemon (security)"},
{"id":"SCHD-7704",             "desc":"Check crontab/cronjobs (security)"},
{"id":"SCHD-7718",             "desc":"Check at users (security)"},
{"id":"SCHD-7720",             "desc":"Check at users (security)"},
{"id":"SCHD-7724",             "desc":"Check at jobs (security)"},
{"id":"SHLL-6211",             "desc":"Checking available and valid shells (security)"},
{"id":"SHLL-6220",             "desc":"Checking available and valid shells (security)"},
{"id":"SHLL-6230",             "desc":"Perform umask check for shell configurations (security)"},
{"id":"SNMP-3302",             "desc":"Check for running SNMP daemon (security)"},
{"id":"SNMP-3304",             "desc":"Check SNMP daemon file location (security)"},
{"id":"SNMP-3306",             "desc":"Check SNMP communities (security)"},
{"id":"SQD-3602",              "desc":"Check for running Squid daemon (security)"},
{"id":"SQD-3604",              "desc":"Check Squid daemon file location (security)"},
{"id":"SQD-3606",              "desc":"Check Squid version (security)"},
{"id":"SQD-3610",              "desc":"Check Squid version (security)"},
{"id":"SQD-3613",              "desc":"Check Squid file permissions (security)"},
{"id":"SQD-3614",              "desc":"Check Squid authentication methods (security)"},
{"id":"SQD-3616",              "desc":"Check external Squid authentication (security)"},
{"id":"SQD-3620",              "desc":"Check Squid access control lists (security)"},
{"id":"SQD-3624",              "desc":"Check Squid safe ports (security)"},
{"id":"SQD-3630",              "desc":"Check Squid reply_body_max_size option (security)"},
{"id":"SQD-3680",              "desc":"Check Squid version suppression (security)"},
{"id":"SSH-7402",              "desc":"Check for running SSH daemon (security)"},
{"id":"SSH-7404",              "desc":"Check SSH daemon file location (security)"},
{"id":"SSH-7406",              "desc":"Detection of OpenSSH server version (security)"},
{"id":"SSH-7408",              "desc":"Check SSH specific defined options (security)"},
{"id":"SSH-7440",              "desc":"AllowUsers and AllowGroups (security)"},
{"id":"STRG-1902",             "desc":"Check rpcinfo registered programs (security)"},
{"id":"STRG-1904",             "desc":"Check nfs rpc (security)"},
{"id":"STRG-1906",             "desc":"Check nfs rpc (security)"},
{"id":"STRG-1920",             "desc":"Checking NFS daemon (security)"},
{"id":"STRG-1926",             "desc":"Checking NFS exports (security)"},
{"id":"STRG-1928",             "desc":"Checking empty /etc/exports (security)"},
{"id":"STRG-1930",             "desc":"Check client access to nfs share (security)"},
{"id":"TIME-3104",             "desc":"Check for running NTP daemon or client (security)"},
{"id":"TIME-3106",             "desc":"Check systemd NTP time synchronization status (security)"},
{"id":"TIME-3112",             "desc":"Check active NTP associations ID's (security)"},
{"id":"TIME-3116",             "desc":"Check peers with stratum value of 16 (security)"},
{"id":"TIME-3120",             "desc":"Check unreliable NTP peers (security)"},
{"id":"TIME-3124",             "desc":"Check selected time source (security)"},
{"id":"TIME-3128",             "desc":"Check preffered time source (security)"},
{"id":"TIME-3132",             "desc":"Check NTP falsetickers (security)"},
{"id":"TIME-3170",             "desc":"Check configuration files (security)"},
{"id":"TIME-3180",             "desc":"Report if ntpctl cannot communicate with OpenNTPD (security)"},
{"id":"TIME-3181",             "desc":"Check status of OpenNTPD time synchronisation (security)"},
{"id":"TIME-3182",             "desc":"Check OpenNTPD has working peers (security)"},
{"id":"TIME-3185",             "desc":"Check systemd-timesyncd synchronized time (security)"},
{"id":"TOOL-5002",             "desc":"Checking for automation tools (security)"},
{"id":"TOOL-5102",             "desc":"Check for presence of Fail2ban (security)"},
{"id":"TOOL-5104",             "desc":"Enabled tests for Fail2ban (security)"},
{"id":"TOOL-5120",             "desc":"Presence of Snort IDS (security)"},
{"id":"TOOL-5122",             "desc":"Snort IDS configuration file (security)"},
{"id":"TOOL-5130",             "desc":"Check for active Suricata daemon (security)"},
{"id":"TOOL-5160",             "desc":"Check for active OSSEC daemon (security)"},
{"id":"TOOL-5190",             "desc":"Check presence of available IDS/IPS tooling (security)"},
{"id":"USB-1000",   "os":"Linux",      "desc":"Check if USB storage is disabled (security)"},
{"id":"USB-2000",   "os":"Linux",      "desc":"Check USB authorizations (security)"},
{"id":"USB-3000",   "os":"Linux",      "desc":"Check for presence of USBGuard (security)"},
  ];
protected listConfigs:Lynis[] = [
  {
      "id":0,
      "ip": "193.168.111.111",
      "auditor": "lol",
      "listIdSkippedTest":[]
  },
  {
      "id":1,
      "ip": "193.168.111.112",
      "auditor": "lol",
      "listIdSkippedTest":[]
  },
  {
      "id":2,
      "ip": "193.168.111.113",
      "auditor": "lol",
      "listIdSkippedTest":[]
  },

  {
      "id":2,
      "ip": "193.168.111.113",
      "auditor": "lol",
      "listIdSkippedTest":[]
  },
  ];

  private actualUsername:string='';
  private email:string = '';
  //private readonly API_BASE = 'http://localhost:8083';
  private readonly API_BASE = environment.apiBaseUrl;
  private lynisConfigSb = new BehaviorSubject<Lynis | null>(null);

  public lynisConfig$ = this.lynisConfigSb.asObservable();

  constructor(
    private log:ManageLogService,
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

      const username = this.storage.getData("username")??'';
      if(username.length>0)
        this.actualUsername = username;
    this.email=this.storage.getData('email')??'';
  }
/**
 * Retrieves the list of Lynis tests that can be skipped.
 * @returns An array of skippable LynisTest objects.
 */
  getSkippableTestList():LynisTest[]{
    return this.skippableTestList;
  }

/**
 * Replaces the current Lynis configuration with the provided one.
 * @param config - The new Lynis configuration object.

  setConfig(config:Lynis){
    this.actualConif=config;
  }
  */
/**
 * Returns the current Lynis configuration in use.
 * @returns The current Lynis configuration object.
 */
  getActualConfig(ip:string):Lynis{
    const localConfig = this.listConfigs.find(c => c.ip===ip);
    if(localConfig === undefined)
      return {
      "id":-1,
      "ip": "",
      "auditor": "lol",
      "listIdSkippedTest":[]
      };

    return  localConfig;
  }

  getActualConfigO(ip:string):Observable<Lynis>{

    const url = `${this.API_BASE}/getLynisByIp`;
    const body = {
      "username": this.actualUsername,
      "ip":ip
    }
    this.log.setLog(this.email,`get the lynis config from the ip : ${ip}`)

    return this.http.post<Lynis>(url,body).pipe(

      tap((config)=>{
        this.lynisConfigSb .next(config);
      }),
      catchError(this.handleError)
    )

  }


  private handleError(error:any):Observable<never>{
    console.error("problema con getActualConfigO lynis :",error);
    let errorMsg = "errore sconosciuto";
    if(error.error instanceof ErrorEvent){
      errorMsg = `Errore ${error.error.message}`;
    }else{

      errorMsg = `Errore ${error.status}:${error.message}`
    }
    return throwError(()=>new Error(errorMsg));
  }


/**
 * Retrieves the list of IDs of the tests that have been skipped in the current configuration.
 * @returns An array of test ID strings that were skipped.
 */
  getSkippedTests(ip:string):string[]{
    const localConfig = this.listConfigs.find(c => c.ip===ip);
    return localConfig?.listIdSkippedTest??[];
  }

  getSkippedTestsO():string[]|null{
    const config = this.lynisConfigSb.value;
    return config ? config.listIdSkippedTest : null;

  }

  /**
   * add the list of skipped ids to lynis config of the IP machine
   */
  addLynisConfig(listOfTest:string[],ip:string):Promise<Boolean>{

    const url = `${this.API_BASE}/addLynisConfig`;
    console.log()
    const body = {
      "username":this.actualUsername,
      "lynis": {
        "ip": ip,
        "auditor": this.actualUsername,
        "listIdSkippedTest":listOfTest
      }
    }
    this.log.setLog(this.email,`add the list of skippable test for the ip ${ip}`,ip)

    return new Promise(
      (resolve) => {
        this.http.post(
          url,body,{
        observe: 'response'
          }

        ).subscribe(
            {
              next:(response)=>{
                console.log("Status in addLynisConfig =",response.status);
                console.log("Body in addLynisConfig =",response.body);

                resolve(response.status === HttpStatusCode.Ok);
              },
              error:(error)=>{
                console.log("error in addLynisConfig =",error.status);
                resolve(false);
              }

            });

      });

  }

  /**
 * Starts a Lynis security scan on the specified IP address.
 * This function calls the backend REST endpoint to initiate the scan process.
 *
 * @param ip - The IP address of the target machine where the scan should be started
 * @returns Promise<boolean> - Returns true if the scan was started successfully, false otherwise
 */
  startLynisScan(ip: string): Promise<boolean> {
    const url = `${this.API_BASE}/startLynisScan`;

    const headers = new HttpHeaders({
      'username': this.actualUsername,
      'ip': ip
    });
    this.log.setLog(this.email, `start the lynis scan for the ip= ${ip}`)
    return new Promise((resolve) => {
      this.http.get(url, {
        headers: headers,
        observe: 'response'
      }).subscribe({
          next: (response) => {
            console.log("Status in startLynisScan =", response.status);
            console.log("Body in startLynisScan =", response.body);

            // La scansione è stata avviata con successo se lo status è 202 (ACCEPTED)
            resolve(response.status === HttpStatusCode.Accepted || response.status == HttpStatusCode.Ok);
          },
          error: (error) => {
            console.log("Error in startLynisScan =", error.status);
            console.log("Error message =", error.error);
          if (error.status === 200 && error.error instanceof SyntaxError) {
                    console.log("Received status 200 with empty/invalid JSON body - treating as success");
                    resolve(true);
//                    return;
                  }
            // Log dettagliato dell'errore per debugging
            if (error.status === HttpStatusCode.BadRequest) {
              console.warn("Bad request - missing username or ip field, or client not running");
            } else if (error.status === HttpStatusCode.Conflict ) {
              console.warn("Conflict - scan may already be running or user not authorized");
            } else if (error.status === HttpStatusCode.InternalServerError) {
              console.error("Internal server error occurred while starting Lynis scan");
            }

            resolve(false);
          }
        });
    });
  }


}
