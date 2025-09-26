# 📬 ZenBox — Your Inbox, Minus the Chaos

A lightweight Google Chrome extension that helps you process emails faster by **summarizing them directly inside Gmail** — powered by Groq’s lightning-fast LLM.

---

## ✨ Highlights

- 🧠 **Smart AI Summaries** — Condenses even long, complex emails into 1–3 clear sentences  
- 📌 **Action Items Extracted** — Lists 1–3 concise, actionable next steps  
- 📊 **Adaptive Word Count** — Summaries scale based on email length for perfect brevity  
- 🎯 **No Fluff, No Greetings** — Only the main message and key points are returned  
- ⚡ **Instant Results** — Summaries are injected directly into the email body  

---

## ❓ How It Works

ZenBox reads the Gmail email body in the DOM and sends the content to a **Groq LLM-powered summarization backend**.  

The backend returns:  
- A concise, plain-text summary that respects strict word-length rules  
- A short list of action items (if any), formatted as clean bullet points  
- Nothing extra — no greetings, subject lines, or repeated content  

The result is displayed seamlessly at the **top of your email** for quick reading.  

---

## 📦 Installation

⚠️ **Chrome Web Store version coming soon!**  

For now, install manually:

1. Download the extension `.zip` file or clone this repository.  
2. Extract the project folder (`Email_Summarizer-main`).  
3. Open `chrome://extensions` in your browser.  
4. Enable **Developer Mode** (top-right corner).  
5. Click **Load unpacked** (top-left corner).  
6. **Important**: Double-click into the `Email_Summarizer-main` folder, then again into the nested `Email_Summarizer-main` folder, and select the **`extension`** folder inside.  
7. Done! Open an email in Gmail and click the extension’s button to summarize.  

---

## 🔐 User Data & Security

ZenBox is designed with **privacy in mind**:

- 🚫 **No data storage** — Emails are never logged, saved, or stored  
- 📡 **Secure transmission** — All communication with the Groq backend is HTTPS encrypted  
- 🎯 **Only what you see is processed** — ZenBox analyzes only the currently opened email  
- 🕵️ **No personal information extraction** — Only text content is summarized  
- ✅ **Minimal permissions** — Reads Gmail DOM only when the button is clicked  

---

## 🎨 Customization

Each time you summarize an email, you earn a **Zenite** — a small reward for staying organized.  
Collect Zenites to unlock **unique color themes** for your summary box via the Options page.  

To access the Options page:  
1. Right-click the ZenBox icon in your Chrome toolbar.  
2. Select **Options** from the dropdown menu.  

---

## ⚠️ Common Issues & Disclaimers

### 1. Slow Initial Response Time
- **Cause**: The backend runs on a free-tier server with a cold start delay.  
- **Effect**: The first request may take up to 1 minute.  
- **Solution**: After the first request, responses are near-instant for the next 15 minutes. If idle beyond that, the server spins down and requires another cold start.  

### 2. Empty Summary
- **Cause**: Gmail’s DOM may not have fully loaded.  
- **Solution**: Refresh the page (🔄, `Ctrl + R` on Windows/Linux, or `Cmd + R` on Mac), wait a moment, then click **Summarize** again.  

### 3. Inaccurate Action Items
- **Cause**: For emails with no actionable items, the AI may occasionally generate “hallucinated” tasks.  
- **Note**: These cases are usually obvious and are being actively improved.  

### 4. Platform Disclaimer
- Tested thoroughly on **Windows**.  
- Expected to work on **macOS**, but not formally tested.  
- Mac users may encounter untested edge cases.  

---

## 📮 Contact & Feedback

Found a bug, accuracy issue, or have an idea to make ZenBox even better?  

📧 **grantklein528@gmail.com**

---
