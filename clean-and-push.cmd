@echo off
echo Cleaning Git cache and removing .env files from history...
echo.

cd /d "c:\Users\Dell\OneDrive\Desktop\mern-ecommerce-2024\forever-full-stack"

echo Removing .env files from Git cache...
git rm --cached backend/.env
git rm --cached frontend/.env
git rm --cached admin/.env

echo Removing .env files from Git history completely...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env frontend/.env admin/.env" --prune-empty --tag-name-filter cat -- --all

echo Cleaning up references...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo Adding all files (without .env)...
git add .

echo Committing clean version...
git commit -m "Clean commit: MERN e-commerce project without secrets"

echo Force pushing to repository...
git push --force-with-lease origin main

echo.
echo Successfully pushed clean repository without secrets!
echo https://github.com/kowshik538/ecommers.git

pause
