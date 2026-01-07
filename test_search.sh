#!/bin/bash

echo "1. Creating Dummy Blog with keyword 'searchable'..."
curl -s -o /dev/null -X POST http://localhost:2001/api/v1.2/blogs/create-blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"This is a searchable blog post", "content":"Content including Node.js and React", "userId":"664eb04a75616473326ea939"}' 
# Note: Since I don't have a valid token easily scriptable without login, I will manually create one via the existing endpoint or rely on existing data.
# Actually, let's just search existing data first to see if it works with what we have.

echo "2. Searching for 'huihi' (existing blog title)..."
curl "http://localhost:2001/api/v1.2/blogs/allblogs?search=huihi"
