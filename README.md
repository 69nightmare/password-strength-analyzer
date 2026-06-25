# Password Strength Analyzer

**GitHub Repository:** [https://github.com/L0ner69/password-strength-analyzer](https://github.com/L0ner69/password-strength-analyzer)

## Detailed Explanation of the Output

The **Password Strength Analyzer** is a Chrome Extension designed to provide real-time, actionable feedback on password security. When interacting with the extension, the output consists of the following components:

1. **Strength Indicator**: Uses the `zxcvbn` algorithm to realistically estimate password entropy. It visually displays the strength using a color-coded 5-segment bar (Very Weak to Very Strong).
2. **Crack Time Estimation**: Displays the estimated time required for an attacker to brute-force the password at a rate of 10 guesses per second (ranging from "Instantly" to "Centuries+").
3. **Vulnerability Assessment**: Cross-references the input against the top 1,000 RockYou dataset passwords to instantly flag critically compromised, commonly used passwords.
4. **Requirements Checklist**: A dynamic checklist that updates in real-time to ensure the password meets standard security criteria (length, uppercase, lowercase, numbers, and special characters).
5. **Secure Password Generation**: A built-in tool that outputs cryptographically secure, randomized passwords based on user-defined constraints (length, symbols, numbers), with a one-click copy feature.

---

## Steps to Follow

### 1. Install Required Platform
Since this project is a Chrome Extension, the required platform is the **Google Chrome web browser** (or any Chromium-based browser like Microsoft Edge or Brave).
- Download and install Google Chrome from [google.com/chrome](https://www.google.com/chrome/).

### 2. Import Required Libraries
This extension is built using vanilla HTML, CSS, and JavaScript. It does not require a complex Node.js build process or package managers like npm. The required libraries are included directly in the source code folder:
- **`zxcvbn.js`**: Dropbox's realistic password strength estimator library.
- **`rockyou_top.js`**: A dataset containing top common passwords used for vulnerability checking.

You do not need to manually import or install these; they are already linked in the `popup.html` file via standard `<script>` tags.

### 3. Check Manual Commands
To load the extension into your browser, follow these manual configuration steps:
1. Open Google Chrome.
2. Type `chrome://extensions/` into the URL address bar and press **Enter**.
3. In the top-right corner of the Extensions page, toggle the switch to turn on **Developer mode**.
4. A new menu bar will appear at the top left. Click the button labeled **Load unpacked**.
5. A file picker dialog will open. Navigate to the directory containing your extracted source code files and click **Select Folder**.
6. The extension will now be loaded and should appear in your Chrome extensions list.

### 4. Execute
To run and test the output of the project:
1. Click the **Puzzle piece icon** (Extensions) in the top right of your Chrome toolbar.
2. Click on the **Password Strength Analyzer** extension to open the popup interface.
3. **Analyze**: Start typing a test password into the input field. Observe how the strength bar, crack time estimate, and requirements checklist update in real-time. Try typing a common password like `password123` to see the vulnerability warning.
4. **Strengthen**: If a password is weak, click the "Strengthen Password" button that appears to automatically inject entropy into your base password.
5. **Generate**: Scroll down to the generator section, adjust the length slider, select your character preferences, and click **Generate Password**. Use the copy button to copy the output to your clipboard.
6. **Settings**: Click the gear icon in the top right to customize minimum length requirements and UI preferences.
