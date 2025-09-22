/**
 * Supabase Authentication Setup
 * Modern, simple alternative to Firebase
 * 
 * To use Supabase Auth:
 * 1. Go to https://supabase.com
 * 2. Create a new project
 * 3. Get your URL and anon key from Settings > API
 * 4. Add this to your HTML head:
 */

/*
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  const supabaseUrl = 'https://your-project.supabase.co'
  const supabaseKey = 'your-anon-key'
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
</script>
*/

class SupabaseAuthService {
  constructor() {
    this.supabase = null;
    this.currentUser = null;
  }

  init(supabaseUrl, supabaseKey) {
    if (typeof window !== 'undefined' && window.supabase) {
      this.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
      
      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUser = session?.user || null;
      });
      
      // Get initial session
      this.getCurrentSession();
    } else {
      console.error('Supabase not loaded. Please include Supabase script.');
    }
  }

  async getCurrentSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser = session?.user || null;
    return session;
  }

  // Sign up with email and password
  async signup(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data.user,
        message: 'Account created! Please check your email to verify.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign in with email and password
  async login(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data.user,
        message: 'Login successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign out
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Logged out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

// Example usage:
/*
// Initialize
const supabaseAuth = new SupabaseAuthService();
supabaseAuth.init('your-supabase-url', 'your-anon-key');

// Use in forms exactly like Firebase example above
*/