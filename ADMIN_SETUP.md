
# Admin Setup Instructions

## Creating Admin Users

Admin access is controlled through the database. Only users with `role = 'admin'` in the `public.users` table can access admin features.

### Step 1: Create a Regular User Account
1. Go to your application's sign-in page
2. Create a new account using the email you want for the admin
3. Verify the email address through the confirmation email

### Step 2: Update User Role in Database
After the user account is created, you need to manually update their role in the database:

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → **users**
3. Find the user by their email address
4. Edit the row and change the `role` column from `student` to `admin`
5. Save the changes

### Alternative: SQL Command
You can also use SQL to create admin users:

```sql
-- Update existing user to admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Step 3: Verify Admin Access
1. Sign out and sign back in with the admin account
2. The user should now be redirected to `/admin` instead of `/student`
3. Admin features should be accessible

## Security Notes

- Admin access is determined solely by the `role` field in the database
- No automatic admin creation or email pattern matching
- All admin accounts must be created manually for security
- Regular users cannot escalate their own privileges

## Troubleshooting

**Issue**: User still redirected to student dashboard after role change
**Solution**: Make sure the user signs out and signs back in after the role change

**Issue**: Admin features not accessible
**Solution**: Check that the `role` field is exactly `'admin'` (case-sensitive) in the database
