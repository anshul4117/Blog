#!/bin/bash

BASE_URL="http://localhost:2001/api/v1.2/users"
EMAIL="test@example.com"
PASSWORD="Password123!"

# Ensure user exists
curl -s -X POST "$BASE_URL/create" -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"age\":25,\"gender\":\"male\"}" > /dev/null

echo "1. Logging in..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

# Extract tokens using grep/sed (simple parsing)
ACCESS_TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RES | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Login Failed or No Refresh Token found"
  echo $LOGIN_RES
  exit 1
else
  echo "✅ Login Successful. Tokens received."
fi

echo -e "\n2. Using Refresh Token to get new Access Token..."
REFRESH_RES=$(curl -s -X POST "$BASE_URL/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

NEW_ACCESS=$(echo $REFRESH_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$NEW_ACCESS" ]; then
  echo "❌ Refresh Failed"
  echo $REFRESH_RES
else
  echo "✅ Refresh Successful. New Access Token received."
fi

echo -e "\n3. Logging out..."
LOGOUT_RES=$(curl -s -X POST "$BASE_URL/logout" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

if [[ $LOGOUT_RES == *"Logged out successfully"* ]]; then
  echo "✅ Logout Successful."
else
  echo "❌ Logout Failed"
  echo $LOGOUT_RES
fi

echo -e "\n4. Testing used Refresh Token (Should Fail)..."
FAIL_RES=$(curl -s -X POST "$BASE_URL/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

if [[ $FAIL_RES == *"not in database"* ]]; then
  echo "✅ Security Check Passed: Token rejected after logout."
else
  echo "❌ Security Check Failed: Token still valid?"
  echo $FAIL_RES
fi
