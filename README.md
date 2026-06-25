# Password Strength Analyzer

A Chrome extension that helps you analyze password strength, estimate crack times, get actionable security feedback, and generate secure passwords.

## Features

- **Password Strength Analysis**: Uses the `zxcvbn` library to provide realistic password strength estimations in real-time as you type.
- **Crack Time Estimation**: Displays an estimated time it would take an attacker to guess or crack your password.
- **Vulnerability Checks**: Checks your password against the Top 1000 RockYou common passwords dataset to instantly flag compromised passwords.
- **Real-time Requirements Feedback**: Visual indicators to ensure your password meets standard security requirements (length, uppercase, lowercase, numbers, special characters, and not common).
- **Password Strengthener**: A one-click tool that takes a weak password and applies smart transformations (leetspeak, appending random characters) to instantly make it stronger.
- **Secure Password Generator**: Generate completely random, strong passwords with customizable length and character sets (uppercase, numbers, symbols).
- **Settings**: Customizable minimum password length, toggleable crack time visibility, and an option to automatically copy generated passwords to the clipboard.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top right corner.
4. Click on the **Load unpacked** button.
5. Select the directory containing the extension files (`d:\amity\3rd sem\NTCC\pass`).

## Usage

1. Click on the extension icon in your Chrome toolbar.
2. **To analyze a password**: Start typing in the password field. The strength meter, requirements, and crack time will update automatically. If the password is weak, you can click the "Strengthen" button (magic wand icon) to automatically improve it.
3. **To generate a password**: Use the sliders and checkboxes at the bottom to configure your desired password complexity, then click "Generate".
4. **Settings**: Click the gear icon in the top right to access extension settings.

## File Structure

- `manifest.json`: The configuration file for the Chrome extension.
- `popup.html`: The HTML structure of the extension's popup interface.
- `popup.css`: The styling for the popup interface.
- `popup.js`: The core logic for strength analysis, password generation, and UI interactions.
- `zxcvbn.js`: Dropbox's realistic password strength estimator library.
- `rockyou_top.js`: A dataset containing top common passwords used for vulnerability checking.
- `icon.png` & `password.png`: Extension icons.

## Technologies Used

- HTML5, CSS3, JavaScript
- [zxcvbn](https://github.com/dropbox/zxcvbn) for password strength estimation.
