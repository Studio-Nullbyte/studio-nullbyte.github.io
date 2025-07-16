# Admin Data Access Query Fix

## Issue
The admin debug panel was failing with the error:
```
Admin data access test failed: "failed to parse select parameter (count(*))" (line 1, column 6)
```

## Root Cause
The issue was caused by incorrect Supabase query syntax. The code was using:
```typescript
// ❌ INCORRECT - This doesn't work in Supabase
const { data, error } = await supabase
  .from('products')
  .select('count(*)')
  .single()
```

## Solution
Changed to the correct Supabase count syntax:
```typescript
// ✅ CORRECT - This is the proper Supabase syntax
const { data, error, count } = await supabase
  .from('products')
  .select('id', { count: 'exact', head: true })
```

## What Changed
Updated the following files:
- `src/utils/adminAuthCheck.ts` - Fixed count queries in data access tests
- `src/utils/adminTroubleshooting.ts` - Already had correct syntax
- `src/hooks/useAdmin.ts` - Already had correct syntax

## How to Test
1. Go to your admin dashboard
2. Click the "Debug" button
3. Click "Data Access Test"
4. All tests should now pass without the parse error

Or run the test script in browser console:
```javascript
// Copy and paste the contents of test-admin-data-access.js
```

## Supabase Count Query Syntax Reference
```typescript
// Get count only (no data)
const { count, error } = await supabase
  .from('table_name')
  .select('*', { count: 'exact', head: true })

// Get data with count
const { data, count, error } = await supabase
  .from('table_name')
  .select('*', { count: 'exact' })

// Get count with specific column
const { count, error } = await supabase
  .from('table_name')
  .select('id', { count: 'exact', head: true })
```

The key points:
- Use `{ count: 'exact', head: true }` for count-only queries
- Use `{ count: 'exact' }` for data + count queries
- Don't use `count(*)` in the select parameter
- The count is returned as a separate property, not in the data
