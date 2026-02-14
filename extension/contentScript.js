function extractEmailBody() {
  const emailElement = document.querySelector('.a3s');

  if (emailElement) {
    let emailBody = emailElement.innerText;
    emailBody = "~" + emailBody;

    const subjectElement = document.querySelector('h2.hP');
    const subject = subjectElement ? subjectElement.innerText : 'Subject not found';

    const senderElement = document.querySelector('.gD');
    const sender = senderElement ? senderElement.getAttribute('email') : 'Sender not found';

    const emailBodyLength = emailBody.length;
    console.log(`✉️ Email Length: ${emailBodyLength} characters`);
    
    generateEmailHash(sender, subject, emailBody).then(emailHash => {
    checkEmailHash(emailHash, (alreadyChecked) => {
    if (alreadyChecked) {
      emailBody = "";
      console.warn("⚠️ This email has already been checked.");
      const cautionElements = document.createElement("div");
      cautionElements.style.color = "red";
      cautionElements.style.fontWeight = "bold";
      cautionElements.style.marginBottom = "5px";
      cautionElements.style.fontSize = "14px";
      cautionElements.innerText = "⚠️ This email has already been checked";
      emailElement.prepend(cautionElements);
      return;
    }
    console.log("✅ Email is new, proceeding with check");

    console.log("📧 Extracted Email Body:\n", emailBody);

    if (!emailBody) {
      console.log("⚠️ No email body found to check");
      console.log("test", document.querySelector('.a3s'));
      return;
    }

    chrome.runtime.sendMessage(
      { type: "CHECK_EMAIL", content: emailBody},
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("❌ Runtime error:", chrome.runtime.lastError.message);
        } else {
          console.log("📨 Background Responded " + response.data.result);

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
          } else if (response.data.errors === "API rate limit exceeded. Please wait 24 hours before trying again") {
            const cautionElements = document.createElement("div");
            cautionElements.style.color = "red";
            cautionElements.style.fontWeight = "bold";
            cautionElements.style.marginBottom = "5px";
            cautionElements.style.fontSize = "14px";
            cautionElements.innerText = "API rate limit exceeded. Please wait 24 hours before trying again";
            emailElement.prepend(cautionElements);
          }

          const resultElement = document.createElement("div");
          
          // Parse plain text response to extract summary and action items
          let summary = '';
          let actionItems = [];
          
          const responseText = response.data.result.trim();
          const lines = responseText.split('\n');
          
          let summaryLines = [];
          let actionLines = [];
          let foundActionItems = false;
          
          for (let line of lines) {
            const trimmedLine = line.trim();
            
            // Check if line starts with bullet point (•, -, *, or numbered)
            if (/^[•\-\*]/.test(trimmedLine) || /^\d+[\.\)]/.test(trimmedLine)) {
              foundActionItems = true;
              // Remove bullet point and add to action items
              const cleanedAction = trimmedLine.replace(/^[•\-\*]\s*/, '').replace(/^\d+[\.\)]\s*/, '');
              if (cleanedAction && cleanedAction.toLowerCase() !== 'no action items needed.' && cleanedAction.toLowerCase() !== 'no action items needed') {
                actionLines.push(cleanedAction);
              }
            } else if (!foundActionItems && trimmedLine) {
              // Before we find action items, add to summary
              summaryLines.push(trimmedLine);
            } else if (foundActionItems && trimmedLine && trimmedLine.toLowerCase().includes('no action items')) {
              // Don't add "No action items needed" to the list
              continue;
            }
          }
          
          summary = summaryLines.join(' ');
          actionItems = actionLines;
          
          console.log("📝 Parsed Summary:", summary);
          console.log("✅ Parsed Action Items:", actionItems);
          
          // Generate and inject the modern tag HTML
          resultElement.innerHTML = generateModernTagHTML(summary, actionItems);

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

function generateEmailHash(sender, subject, emailBody) {
  // Combine sender, subject, and actual email body content for hashing
  const hashInput = `${sender}-${subject}-${emailBody}`;

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

function generateModernTagHTML(summary, actionItems) {
  let actionList = '';
  
  if (actionItems && actionItems.length > 0) {
    actionList = actionItems.map(item => 
      `<div style="display: flex; align-items: start; margin-bottom: 6px;">
         <span style="color: #188038; margin-right: 8px; font-weight: bold;">&#10003;</span> 
         <span>${item}</span>
       </div>`
    ).join('');
  }

  return `
    <div style="
      font-family: Roboto, sans-serif;
      padding: 12px 0;
      margin-bottom: 15px;
      border-bottom: 1px dashed #ccc;">
      
      <div style="margin-bottom: 12px;">
        <span style="background: #e8f0fe; color: #1967d2; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-right: 8px; vertical-align: middle;">TL;DR</span>
        <span style="font-size: 14px; color: #202124; vertical-align: middle;">${summary}</span>
      </div>

      ${actionList ? `<div style="background: #fdfdfd; border: 1px solid #eee; padding: 10px; border-radius: 6px;">
        <div style="font-size: 12px; font-weight: bold; color: #5f6368; margin-bottom: 6px;">SUGGESTED ACTIONS</div>
        <div style="font-size: 13px; color: #333;">
          ${actionList}
        </div>
      </div>` : ''}
    </div>
  `;
}

extractEmailBody();
