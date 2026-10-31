const fs = require('fs');
const path = require('path');

const docContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>YUMQUICK — Food Delivery Mobile App Documentation</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #391713;
    background-color: #ffffff;
    margin: 40px;
  }
  h1 {
    color: #E95322;
    border-bottom: 3px solid #F5CB58;
    padding-bottom: 10px;
    font-size: 28pt;
  }
  h2 {
    color: #391713;
    border-bottom: 2px solid #F3E9B5;
    padding-bottom: 6px;
    margin-top: 30px;
    font-size: 18pt;
  }
  h3 {
    color: #E95322;
    font-size: 14pt;
    margin-top: 20px;
  }
  p, li {
    font-size: 11pt;
    color: #333333;
  }
  .highlight-box {
    background-color: #FFF8F5;
    border-left: 5px solid #E95322;
    padding: 15px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 10pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 10pt;
  }
  th {
    background-color: #E95322;
    color: #ffffff;
    text-align: left;
    padding: 10px;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid #EFEFEF;
  }
  tr:nth-child(even) {
    background-color: #F8F8F8;
  }
  code {
    background-color: #F3E9B5;
    color: #391713;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: Consolas, monospace;
  }
  pre {
    background-color: #2D2D2D;
    color: #F8F8F8;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: Consolas, monospace;
    font-size: 10pt;
  }
</style>
</head>
<body>

  <h1>🍔 YUMQUICK — Food Delivery App</h1>
  <p><strong>Comprehensive Technical Architecture, Design System & API Documentation</strong></p>

  <div class="highlight-box">
    <p><strong>App Version:</strong> 1.0.0 | <strong>SDK:</strong> Expo SDK 58 | <strong>React Native:</strong> 0.88 | <strong>TypeScript:</strong> 6.0</p>
    <p><strong>Backend Stack:</strong> Python REST APIs (FastAPI / Django) | <strong>Base URL:</strong> <code>http://192.168.1.11:8000</code></p>
  </div>

  <h2>1. Executive Project Summary</h2>
  <p><strong>YUMQUICK</strong> is a modern, high-performance cross-platform mobile food delivery application designed for iOS and Android. Built with React Native, Expo Router v58, and TypeScript, it connects seamlessly to a Python REST API backend managing over 540+ dishes, categories, and orders.</p>

  <h2>2. Design System & Brand Palette</h2>
  <p>The application follows a warm, appetizing, and accessible design system:</p>

  <table>
    <thead>
      <tr>
        <th>Color Name</th>
        <th>Hex Code</th>
        <th>Role in UI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Primary Gold</strong></td>
        <td><code>#F5CB58</code></td>
        <td>Filter buttons, active category pills, discount badges, progress bars</td>
      </tr>
      <tr>
        <td><strong>Light Cream</strong></td>
        <td><code>#F3E9B5</code></td>
        <td>Form input background fills, icon circles, rating boxes</td>
      </tr>
      <tr>
        <td><strong>Brand Orange</strong></td>
        <td><code>#E95322</code></td>
        <td>Hero text highlights, primary action buttons, prices, cart badges</td>
      </tr>
      <tr>
        <td><strong>Light Peach</strong></td>
        <td><code>#FFDECF</code></td>
        <td>Special offer badges, steam particles, soft highlight backgrounds</td>
      </tr>
      <tr>
        <td><strong>Dark Brown</strong></td>
        <td><code>#391713</code></td>
        <td>Primary typography, headings, icons, dark mode elements</td>
      </tr>
      <tr>
        <td><strong>Background</strong></td>
        <td><code>#F8F8F8</code></td>
        <td>Off-white clean app screen background</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Authentication & Security Architecture</h2>
  <p>The app features a guarded authentication architecture managed via <code>src/context/auth-context.tsx</code> and Expo Router layout guards:</p>

  <h3>A. Form Validation System (Positive & Negative Test Cases)</h3>
  <ul>
    <li><strong>Email/Mobile Field:</strong> Validates presence, email regex (<code>name@domain.com</code>) or phone length (8–15 digits). Highlights red border on error.</li>
    <li><strong>Password Field:</strong> Requires at least 6 characters with show/hide password eye toggle.</li>
    <li><strong>Full Name & DOB:</strong> Validates minimum 2 characters (letters only) and date format (<code>DD/MM/YYYY</code>).</li>
  </ul>

  <h3>B. Session Persistence & Protected Routing</h3>
  <ul>
    <li>Auth tokens and user sessions are stored securely in <code>@react-native-async-storage/async-storage</code>.</li>
    <li>Unauthenticated users attempting to access protected screens are automatically redirected to <code>/welcome</code>.</li>
  </ul>

  <h2>4. User Experience & Animated Loaders</h2>
  <h3>Chef Kitchen Animated Loader (<code>src/app/preparing.tsx</code>)</h3>
  <p>Upon completing Log In or Sign Up, users experience a 60 FPS 3-second animated chef loader:</p>
  <ul>
    <li>👨‍🍳 Bouncing Chef Hat and wiggling cooking pot with rising steam particles.</li>
    <li>🍔 Bouncing food items (Burger, Pizza, Cheese).</li>
    <li>📊 Progress bar filling smoothly from 0% to 100%.</li>
    <li>💬 Sequential kitchen messages ("Master Chef is firing up the kitchen...", "Sizzling fresh ingredients...", "Almost ready!").</li>
  </ul>

  <h2>5. Python Backend API Specification</h2>
  <p>Connected to Python server on <code>http://192.168.1.11:8000</code>:</p>

  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Method & Endpoint</th>
        <th>Description / Payload</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Auth</strong></td>
        <td><code>POST /auth/signup</code></td>
        <td>Registers user with <code>fullName</code>, <code>email</code>, <code>password</code>, <code>mobile</code>, <code>dob</code></td>
      </tr>
      <tr>
        <td><strong>Auth</strong></td>
        <td><code>POST /auth/login</code></td>
        <td>Authenticates with <code>email</code> or <code>phone</code> + <code>password</code></td>
      </tr>
      <tr>
        <td><strong>Menu</strong></td>
        <td><code>GET /menu/categories</code></td>
        <td>Fetches horizontal category chips</td>
      </tr>
      <tr>
        <td><strong>Menu</strong></td>
        <td><code>GET /menu</code></td>
        <td>Fetches 540+ dishes with <code>category</code>, <code>search</code>, and pagination</td>
      </tr>
      <tr>
        <td><strong>Menu</strong></td>
        <td><code>GET /menu/${'{dishId}'}</code></td>
        <td>Fetches single dish details</td>
      </tr>
      <tr>
        <td><strong>Orders</strong></td>
        <td><code>POST /orders</code></td>
        <td>Places new order with <code>customer_name</code>, <code>item_id</code>, <code>quantity</code></td>
      </tr>
      <tr>
        <td><strong>Orders</strong></td>
        <td><code>GET /orders/${'{orderId}'}</code></td>
        <td>Tracks live order status (received, preparing, delivered)</td>
      </tr>
    </tbody>
  </table>

  <h2>6. Directory Structure</h2>
  <pre>
reactnative-basics/
├── src/
│   ├── app/
│   │   ├── _layout.tsx      # Auth Guard & Root Layout
│   │   ├── welcome.tsx      # Welcome / Splash Screen
│   │   ├── login.tsx        # Log In Screen with Validations
│   │   ├── signup.tsx       # Sign Up Screen with Validations
│   │   ├── preparing.tsx    # Chef Kitchen Animated Loader
│   │   ├── index.tsx        # Home Screen (540+ dishes & search)
│   │   └── food/[id].tsx    # Food Details & Customization Screen
│   ├── components/          # Reusable UI components
│   ├── constants/
│   │   └── colors.ts        # Centralized Brand Color Palette
│   ├── context/
│   │   └── auth-context.tsx # Auth State Management
│   ├── services/
│   │   ├── api-client.ts    # Centralized Fetch API Client
│   │   ├── auth-service.ts  # Auth API Calls
│   │   ├── menu-service.ts  # Menu & Categories API Calls
│   │   └── order-service.ts # Cart & Order API Calls
│   └── utils/
│       └── validation.ts    # Positive & Negative Input Validators
├── DOCUMENTATION.md         # Markdown Documentation
└── YUMQUICK_Project_Documentation.doc  # Microsoft Word / Document Format
  </pre>

  <h2>7. How to Run the Project</h2>
  <pre>
# Start Dev Server for Android Emulator
npx expo start --android

# Run TypeScript Typecheck
npx tsc --noEmit

# Forward Port 8000 over ADB
adb -s emulator-5554 reverse tcp:8000 tcp:8000
  </pre>

</body>
</html>
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'YUMQUICK_Project_Documentation.doc'),
  docContent,
  'utf8'
);

console.log('Successfully generated YUMQUICK_Project_Documentation.doc');
