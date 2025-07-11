/**
 * Emergency Admin Profile Creator
 * Run this in your browser console to create an admin profile
 * bypassing RLS policies that might have recursion issues
 */

async function createAdminProfileEmergency() {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No user logged in:', userError)
      return
    }
    
    console.log('Creating admin profile for user:', user.id, user.email)
    
    // Use the Supabase service role client to bypass RLS
    // First try with anon key (this might work if RLS is fixed)
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
        role: 'admin'
      }, {
        onConflict: 'user_id'
      })
      .select()
    
    if (error) {
      console.error('Error creating profile:', error)
      alert('Error: ' + error.message)
      return
    }
    
    console.log('Profile created/updated successfully:', data)
    alert('Admin profile created! Please refresh the page.')
    
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('Unexpected error: ' + error.message)
  }
}

// Run the function
createAdminProfileEmergency()
