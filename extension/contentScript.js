function extractEmailBody() {
  const emailElement = document.querySelector('.a3s');

  if (emailElement) {
    let emailBody = emailElement.innerText;
    const word_count = emailBody.split(/\s+/).length;
    let emailPrompt =  " You are an expert email summarizer agent trained to accurately, succinctly and effectively summarize emails."
         " Follow these steps exactly for every email you analyze:"
         " First I will give you the length of the email in words and you will respond within my specified range of summary lengths based on the word count."
         " If the email is less than 50 words, respond with a summary between 10-20 words."
         " If the email is between 50-100 words, respond with a summary between 20-40 words."
         " If the email is between 100-200 words, respond with a summary between 40-70 words."
         " If the email is between 200-500 words, respond with a summary between 70-100 words."
         " If the email is over 500 words, respond with a summary between 100-150 words."
         " The email I will provide you is " + word_count + " words long."
         " Analyze the email below and provide a summary.";

    const subjectElement = document.querySelector('h2.hP');
    const subject = subjectElement ? subjectElement.innerText : 'Subject not found';

    const senderElement = document.querySelector('.gD');
    const sender = senderElement ? senderElement.getAttribute('email') : 'Sender not found';

    generateEmailHash(sender, subject).then(emailHash => {
    checkEmailHash(emailHash, (alreadyChecked) => {
      console.log("🔍 Checking email with saved hash");
    if (alreadyChecked) {
      console.log("⚠️ This email has already been checked.");
      return;
    }

    console.log("📧 Extracted Email Body:\n", emailBody);

    if (!emailBody) {
      console.log("⚠️ No email body found to check");
      console.log("test", document.querySelector('.a3s'));
      return;
    }

    chrome.runtime.sendMessage(
      { type: "CHECK_EMAIL", content: emailBody, prompt: emailPrompt },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("❌ Runtime error:", chrome.runtime.lastError.message);
        } else {
          console.log("📨 Background Responded ");

          if (isMaliciousEmail(emailBody)) {
            emailBody = "";
            console.warn("⚠️ Malicious content detected in email body");
            const cautionElements = document.createElement("div");
            cautionElements.style.color = "red";
            cautionElements.style.fontWeight = "bold";
            cautionElements.style.marginBottom = "5px";
            cautionElements.style.fontSize = "14px";
            cautionElements.innerText = "Malicious content detected in response. API may be compromised. Please contact developer at grantklein528@gmail.com";
            emailElement.prepend(cautionElements);
            return;
          }
          else if (response.data.errors === "Internal API server error. Please try again later.") {
            const cautionElements = document.createElement("div");
            cautionElements.style.color = "red";
            cautionElements.style.fontWeight = "bold";
            cautionElements.style.marginBottom = "5px";
            cautionElements.style.fontSize = "14px";
            cautionElements.innerText = "Internal API server error. Please try again later.";
            emailElement.prepend(cautionElements);
          } else if (response.data.errors === "API rate limit exceeded. Please wait 24 hours before trying again.") {
            const cautionElements = document.createElement("div");
            cautionElements.style.color = "red";
            cautionElements.style.fontWeight = "bold";
            cautionElements.style.marginBottom = "5px";
            cautionElements.style.fontSize = "14px";
            cautionElements.innerText = "API rate limit exceeded. Please wait 24 hours before trying again.";
            emailElement.prepend(cautionElements);
          }

          const resultElement = document.createElement("div");
          resultElement.style.color = "black";
          resultElement.style.fontWeight = "bold";
          resultElement.style.marginBottom = "5px";
          resultElement.style.fontSize = "16px";
          resultElement.innerText = `Summarized Result: ${response.data.result}`;

          emailElement.prepend(resultElement);
          console.log("✅ Result injected at the top of email body");

          if (response.data.errors == "") {
            chrome.storage.local.get({ coinCount: 0 }, (items) => {
              if (items.coinCount < 99) {
                 items.coinCount += 1;
              }
              chrome.storage.local.set({ coinCount: items.coinCount }, () => {
                console.log(`✅ Coin count updated: ${items.coinCount}`);
                chrome.runtime.sendMessage({ type: "COIN_COUNT_UPDATED" });
              });
            });
          }
        }
      }
    );
  });
}); 
}
}

function checkEmailHash(emailHash, callback) {
  chrome.runtime.sendMessage(
    { type: "CHECK_EMAIL_HASH", emailHash },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Runtime error:", chrome.runtime.lastError.message);
        callback(false); 
      } else {
        callback(response.alreadyChecked);
      }
    }
  );
}

function generateEmailHash(sender, subject) {
  const senderWordCount = sender.split(/\s+/).length;
  const subjectWordCount = subject.split(/\s+/).length;

  const hashInput = `${senderWordCount}-${subjectWordCount}`;

  // Generate a SHA-256 hash
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(hashInput))
    .then(hashBuffer => {
      // Convert hash buffer to a hex string
      return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
    });
}

function isMaliciousEmail(emailBody) {
  const patterns = [
  /<script.*?>.*?<\/script>/gi,         // Script tags
  /javascript:/gi,                      // JS protocol
  /on\w+\s*=/gi,                        // Event handlers like onload, onclick
  /<iframe.*?>.*?<\/iframe>/gi,         // Iframes
  /<img.*?src=.*?>/gi,                  // Suspicious images
  /eval\(/gi,                           // JS eval
  /document\.cookie/gi,                 // Cookie access
  /window\.location/gi,                 // Redirection
  /style\s*=\s*['"]?expression\(/gi     // CSS expressions
  ];

  return patterns.some(pattern => pattern.test(emailBody));
}

extractEmailBody();
