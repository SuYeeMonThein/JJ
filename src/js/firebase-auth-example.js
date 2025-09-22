/**
 * Firebase Authentication Setup
 * Simple third-party auth solution
 * 
 * To use Firebase Auth:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project
 * 3. Enable Authentication > Sign-in method > Email/Password
 * 4. Get your config keys
 * 5. Add this to your HTML head:
 */

/*
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>

<script>
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
</script>
*/

class FirebaseAuthService {
  constructor() {
    this.auth = null;
    this.currentUser = null;
  }

  init() {
    if (typeof firebase !== 'undefined') {
      this.auth = firebase.auth();
      
      // Listen for auth state changes
      this.auth.onAuthStateChanged((user) => {
        this.currentUser = user;
      });
    } else {
      console.error('Firebase not loaded. Please include Firebase scripts.');
    }
  }

  // Sign up with email and password
  async signup(email, password) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully!'
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
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return {
        success: true,
        user: userCredential.user,
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
      await this.auth.signOut();
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

// Example usage in your forms:
/*
// Initialize
const firebaseAuth = new FirebaseAuthService();
firebaseAuth.init();

// Sign up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = await firebaseAuth.signup(email, password);
  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    alert(result.error);
  }
});
*/