import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs';
import * as path from 'path';

// Helper to load Firebase Config
function loadFirebaseConfig() {
  // Method 1: Environment Variable (CI/CD)
  // This is the preferred method for deployment (GitHub Actions)
  if (process.env.FIREBASE_CONFIG_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_CONFIG_JSON);
    } catch (e) {
      console.error("Failed to parse FIREBASE_CONFIG_JSON env var:", e);
    }
  }

  // Method 2: Local File (Development)
  // Use process.cwd() for compatibility
  const secretPath = path.resolve(process.cwd(), 'secrets/firebaseConfig.json');
  try {
    if (fs.existsSync(secretPath)) {
      const data = fs.readFileSync(secretPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read local secrets file:", e);
  }

  return null;
}

const firebaseConfig = loadFirebaseConfig();

export default defineConfig({
  plugins: [react()],
  base: '/ex-it/',
  define: {
    __FIREBASE_CONFIG__: JSON.stringify(firebaseConfig)
  }
})
