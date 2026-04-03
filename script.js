function checkLink(input) {
  if (!input) return;

  let result = document.getElementById("result");
  let log = document.getElementById("fraudLog");
  let resultCard = document.getElementById("result-card");

  let suspiciousWords = ["free", "win", "money", "offer", "click", "login", "verify", "account", "gift"];
  let suspiciousTLDs = [".xyz", ".top", ".biz", ".tk", ".zip"];
  
  let isFraud = false;
  let reason = "";

  const lowerInput = input.toLowerCase();

  // Check for keywords
  for (let word of suspiciousWords) {
    if (lowerInput.includes(word)) {
      isFraud = true;
      reason = "⚠ Suspicious keyword detected: " + word;
      break;
    }
  }

  // Check for suspicious TLDs
  suspiciousTLDs.forEach(tld => {
    if (lowerInput.endsWith(tld) || lowerInput.includes(tld + "/")) {
      isFraud = true;
      reason = "⚠ Uses a high-risk domain extension (" + tld + ")";
    }
  });

  // Check for non-HTTPS or IP-based URLs
  if (lowerInput.startsWith("http://")) {
    isFraud = true;
    reason = "⚠ Connection is not secure (HTTP)";
  } else if (/(\d{1,3}\.){3}\d{1,3}/.test(lowerInput)) {
    isFraud = true;
    reason = "⚠ Direct IP addresses are often used for phishing";
  }

  resultCard.classList.remove("hidden");
  if (isFraud) {
    result.innerText = "❌ This link looks suspicious!";
    result.className = "danger";
    log.innerText = reason;
  } else {
    result.innerText = "✅ This link looks safe.";
    result.className = "safe";
    log.innerText = "";
  }
}

// QR Scanner
function onScanSuccess(decodedText) {
  document.getElementById("qrInput").value = decodedText;
  checkLink(decodedText);
}

let scanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: { width: 250, height: 250 }
});

scanner.render(onScanSuccess);