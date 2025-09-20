📬 ZenBox – Your Inbox, Minus the Chaos


A lightweight Google Chrome extension that helps you process emails faster by summarizing them directly inside Gmail — powered by Groq’s lightning-fast LLM.

✨ Highlights

🧠 Smart AI Summaries – Condenses even long, complex emails into 1–3 clear sentences

📌 Action Items Extracted – Lists 1–3 concise, actionable next steps from the email

📊 Adaptive Word Count – Summaries scale based on email length for perfect brevity

🎯 No Fluff, No Greetings – Only the main message and key points are returned

⚡ Instant Results – Summaries are injected directly into the email body


❓ How Does It Work?
 This extension reads the Gmail email body in the DOM and sends the full content to a Groq LLM-powered summarization backend. The backend returns:

A concise, plain-text summary that respects strict word-length rules

A short list of action items (if any), formatted as clean bullet points

Nothing extra — no greetings, subject lines, or repeated content

The result is displayed seamlessly at the top of your email for quick reading.


📦 Installation

*Chrome Store Version Coming Soon!

*For now follow these instructions for installation

Download the extension .zip file or clone this repo

Extract the project folder ("Email_Summarizer-main")

Go to chrome://extensions in your browser

Enable "Developer Mode" in the top right corner

Click "Load unpacked" in the top left corner

Very Important: Double click on the Email_Summarizer-main folder, Double click again on the Email_Summarizer-main folder and select (single click) the "extension" folder that is inside

You're good to go! Open an email in Gmail and click the extension's button to run


🔐 User Data & Security:
ZenBox is designed with privacy in mind:

🚫 No data storage – Emails are never logged, saved, or stored

📡 Secure transmission – All communication with the Groq backend is HTTPS encrypted

🎯 Only what you see is processed – ZenBox analyzes only the currently opened email

🕵️ No personal information extraction – Only text content is summarized

✅ Minimal permissions – Reads Gmail DOM (email holder) only when the button is clicked


🎨 Customize with the Options Page:
Every time you summarize an email, you earn a Zenite — a small reward for staying organized. Collect Zenite to unlock unique color themes for your summary box via the Options page.

To access the Options page:

Right-click the ZenBox icon in your Chrome toolbar

Select Options from the dropdown menu

⚠️ Common Issues, Solutions, and Disclaimers:

Slow Initial Response Time: This project is supported by a free tier backend web server that features a cold start delay. This means that the first summarize request may be delayed up to 1 minute. Once the server has spun up then all further responses for the next 15 minutes will be close to instantaneous. If no requests beyond the first one is made within that 15 minute time span then the server will spin down again and all further requests will require a spin up delay before responding.

Empty Summary: If ZenBox shows no summary, Gmail’s DOM may not have fully loaded yet.
Solution: Refresh the page using 🔄 or Ctrl+R (Windows) / Cmd+R (Mac), wait a moment, then click Summarize again.

Inaccurate Action Items: Occasionally for emails that possess no actionable items inside them the AI may hallucinate and still provide action items. When this happens it is usually very obvious. This issue is currently being looked in on.

Platform Disclaimer: This extension has been thoroughly tested on Windows. macOS compatibility is expected but untested — Mac users may experience edge cases. Report any issues using the contact info below.

📮 Contact & Feedback
Found a bug, accuracy issue, or have an idea to make ZenBox even better? Contact me at grantklein528@gmail.com



