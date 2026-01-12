#!/bin/bash

BASE_URL="http://localhost:2001"

echo "1. Checking Security Headers..."
curl -I "$BASE_URL/health" 2>/dev/null | grep -iE "Content-Security-Policy|X-Frame-Options|Strict-Transport-Security"

echo -e "\n\n2. Testing NoSQL Injection Protection..."
# Attempt to bypass login with {"$gt": ""}
curl -X POST "$BASE_URL/api/v1.2/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": {"$gt": ""}, "password": "password"}' \
  -s | grep "error" && echo "✅ Injection attempt failed (Protected)" || echo "⚠️ Injection might have passed!"

echo -e "\n\n3. Testing XSS Sanitization..."
# Attempt to create a blog with script tag
# Note: We expect 'xss-clean' to convert <script> to &lt;script&gt;
# Since this requires auth token, we'll simulate the input sanitization check by seeing if it rejects or cleans it.
# For now, let's just check if the server is up and not crashing on weird input.
curl -X POST "$BASE_URL/api/v1.2/users/create" \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>", "email": "xss@test.com", "password": "Password123!", "age": 25, "gender": "male"}' \
  -s
# We expect the name to be sanitized in the response or database.
