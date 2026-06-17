@echo off
echo Starting service wake-up (cold restart triggers)...
echo ------------------------------------------------

echo Pinging: https://shelf-mates-proxy.onrender.com/health
curl -s -o NUL -w "Response Status Code: %%{http_code}\n" https://shelf-mates-proxy.onrender.com/health
echo ------------------------------------------------

echo Pinging: https://shelf-mates-server.onrender.com/health
curl -s -o NUL -w "Response Status Code: %%{http_code}\n" https://shelf-mates-server.onrender.com/health
echo ------------------------------------------------

echo Pinging: https://shelf-mates-agent-api.onrender.com
curl -s -o NUL -w "Response Status Code: %%{http_code}\n" https://shelf-mates-agent-api.onrender.com
echo ------------------------------------------------

echo Wake-up calls finished!
pause
