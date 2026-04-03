function checkLink() {
  let input = document.getElementById("qrInput").value;
  let result = document.getElementById("result");
  let log = document.getElementById("fraudLog");

  // Basic fraud detection keywords
  let suspiciousWords = ["free", "win", "money", "offer", "click", "login"];

  let isFraud = false;

  for (let word of suspiciousWords) {
    if (input.toLowerCase().includes(word)) {
      isFraud = true;
      log.innerText = "⚠ Suspicious keyword detected: " + word;
      break;
    }
  }

  if (isFraud) {
    result.innerText = "❌ This link looks suspicious!";
    result.style.color = "red";
  } else {
    result.innerText = "✅ This link looks safe.";
    result.style.color = "lightgreen";
    log.innerText = "";
  }
}