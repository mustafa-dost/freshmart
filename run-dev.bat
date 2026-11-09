@echo off
set PATH=%ProgramFiles%\nodejs;%PATH%
cd /d "%~dp0"
where node
where npm
npm.cmd run db:generate
npm.cmd run dev
