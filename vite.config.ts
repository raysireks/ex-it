import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs';
import * as path from 'path';

// Helper to load Firebase Config
function loadFirebaseConfig() {
  const secretPath = path.resolve(__dirname, 'secrets/firebaseConfig.json');
  try {
    if (fs.existsSync(secretPath)) {
      const data = fs.readFileSync(secretPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read local secrets file.");
  }

  // Fallback to Env Var (for CI/CD)
  if (process.env.FIREBASE_CONFIG_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_CONFIG_JSON);
    } catch (e) {
      console.error("Failed to parse FIREBASE_CONFIG_JSON env var.");
    }
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
