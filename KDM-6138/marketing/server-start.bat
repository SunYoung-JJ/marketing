@echo off
rem KDM-6138 marketing local server (Tomcat 10.1) - http://localhost:8080/KDM-6138/marketing/html/pub_list.html
set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.4\jbr"
set "CATALINA_HOME=%USERPROFILE%\tools\apache-tomcat-10.1.34"
call "%CATALINA_HOME%\bin\startup.bat"
start "" "http://localhost:8080/KDM-6138/marketing/html/pub_list.html"
