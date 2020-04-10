SET Today=%Date:~7,2%-%Date:~4,2%-%Date:~10,4%
set presenttime=%time:~0,2%-%time:~3,2%-%time:~6,2%

call :Strip %Today% %presenttime%
set ldt=%Today%_%presenttime%

echo %today%
md %today%
set sqlcommand= -u root -p rems
mysqldump %sqlcommand% > %today%\%ldt%.sql
pause

:Strip
set Today=%1
set presenttime=%2
echo [%Today%]
echo [%presenttime%]