function checkLink(input) {
  if (!input || input.trim() === "") return;

  let result = document.getElementById("result");
  let log = document.getElementById("fraudLog");
  let resultCard = document.getElementById("result-card");
  let progressBar = document.getElementById("progress");

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

  // Calculate AI-style Risk Percentage
  let riskPercent = Math.min(score * 25, 100);

  // UI Update Logic
  resultCard.classList.remove("hidden");
  result.innerText = `Risk Level: ${riskPercent}%`;

  // Update Progress Bar Color & Width
  progressBar.style.width = riskPercent + "%";
  if (riskPercent < 30) {
    progressBar.style.background = "var(--safe)";
    result.className = "safe";
  } else if (riskPercent < 70) {
    progressBar.style.background = "#fbbf24"; // Orange
    result.className = "warning";
  } else {
    progressBar.style.background = "var(--danger)";
    result.className = "danger";
  }

  log.innerHTML = reasons.length > 0 
    ? "<strong>Analysis:</strong><br>• " + reasons.join("<br>• ") 
    : "No suspicious patterns detected.";

  saveToHistory(input, riskPercent);
}

function saveToHistory(link, risk) {
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  // Keep only last 5 items
  history.unshift({ link, risk: risk + "%", date: new Date().toLocaleTimeString() });
  history = history.slice(0, 5);
  localStorage.setItem("qrHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let historyDiv = document.getElementById("history-container");
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  
  if (history.length === 0) return;

  historyDiv.innerHTML = "<h3>📜 Recent Scans</h3>";
  history.forEach(item => {
    historyDiv.innerHTML += `
      <div class="history-item">
        <span class="history-link">${item.link}</span>
        <span class="history-risk">${item.risk}</span>
      </div>`;
  });
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

// Load history on startup
renderHistory();