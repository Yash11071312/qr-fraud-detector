function checkLink(input) {
  if (!input || input.trim() === "") return;

  let result = document.getElementById("result");
  let log = document.getElementById("fraudLog");
  let resultCard = document.getElementById("result-card");

  let score = 0;
  let reasons = [];
  let suspiciousWords = ["free", "win", "money", "offer", "login", "verify", "bank", "urgent", "click", "gift", "account"];
  let suspiciousTLDs = [".xyz", ".top", ".biz", ".tk", ".zip"];
  const lowerInput = input.toLowerCase();

  // 1. Check for keywords (Multiple keywords increase risk)
  suspiciousWords.forEach(word => {
    if (lowerInput.includes(word)) {
      score++;
      reasons.push(`Suspicious word: ${word}`);
    }
  });

  // 2. Check for suspicious TLDs
  suspiciousTLDs.forEach(tld => {
    if (lowerInput.endsWith(tld) || lowerInput.includes(tld + "/")) {
      score += 2;
      reasons.push(`High-risk domain: ${tld}`);
    }
  });

  // 3. Check for non-HTTPS
  if (lowerInput.startsWith("http://")) {
    score += 2;
    reasons.push("Insecure connection (HTTP)");
  } 
  
  // 4. Check for IP-based URLs
  if (/(\d{1,3}\.){3}\d{1,3}/.test(lowerInput)) {
    score += 3;
    reasons.push("Uses direct IP address instead of domain");
  }

  // UI Update Logic
  resultCard.classList.remove("hidden");
  
  if (score >= 3) {
    result.innerText = "❌ High Risk Link";
    result.className = "danger";
    log.innerHTML = "Reasons:<br>• " + reasons.join("<br>• ");
  } else if (score >= 1) {
    result.innerText = "⚠ Medium Risk";
    result.className = "danger";
    log.innerHTML = "Warnings:<br>• " + reasons.join("<br>• ");
  } else {
    result.innerText = "✅ Safe Link";
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