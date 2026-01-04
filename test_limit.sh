#!/bin/bash
for i in {1..7}
do
   echo "Request $i"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:2001/api/v1.2/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com", "password":"password"}'
   sleep 0.5
done
