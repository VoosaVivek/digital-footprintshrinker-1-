
# Digital Footprint Shrinker – Privacy Cleanup Tool

Professional-grade desktop utility for identifying and remediating digital traces.

## 🛠 Tech Stack
- **Frontend**: React 19, Tailwind CSS, Heroicons
- **Desktop Wrapper**: Electron
- **Packaging**: Electron Builder
- **Language**: TypeScript

## 🚀 Step-by-Step: Run in VS Code

1. **Install Prerequisites**:
   - Install [Node.js (LTS)](https://nodejs.org/).
   - Install [VS Code](https://code.visualstudio.com/).

2. **Initialize Project**:
   ```bash
   # Open the project folder in terminal
   npm install
   ```

3. **Launch Desktop App (Development Mode)**:
   ```bash
   npm start
   ```

## 📦 Step-by-Step: Create EXE (Packaging)

1. **Production Build**:
   ```bash
   npm run build
   ```

2. **Generate Executable**:
   ```bash
   # This will create an installer in the /dist folder
   npm run dist
   ```

## 🛡 Security & Ethics
- **Zero-Internet Policy**: The app runs entirely in the local Electron sandbox.
- **Safety First**: No files are deleted without explicit user confirmation and a simulated backup creation.
- **Audit Ready**: Every action generates a SHA-256 hashed CSV report for verification.

## 🧪 Safe Testing Guide
1. **Virtual Machine**: Always test system-level utilities in a VM (VirtualBox/VMware).
2. **Read-Only Test**: Use the "Scan Dashboard" to see what would be deleted before clicking "Clean".
3. **Backup Check**: Verify the `/backups` folder locally after a cleanup session.
