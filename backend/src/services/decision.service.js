export const detectHardRisk = (message) => {
  const lowerMsg = message.toLowerCase();

  const criticalPatterns = [
    "kill myself",
    "suicide",
    "end my life",
    "want to die",
    "die",
    "giving up",
    "give up",
    "end everything",
    "no point living",
  ];

  return criticalPatterns.some(pattern =>
    lowerMsg.includes(pattern)
  );
};

export const buildAIPrompt = (message, history) => {
  return `
You are an AI mental health risk detection system.

Analyze the user's CURRENT message along with RECENT HISTORY.

Return ONLY valid JSON.

JSON format:
{
  "sentiment": "positive | neutral | negative",
  "confidence": number between 0 and 1,
  "risk": "LOW | MEDIUM | HIGH",
  "trend": "STABLE | INCREASING | DECREASING",
  "action": "NONE | JOURNAL | GROUNDING | ESCALATE | CLARIFY",
  "reason": "short explanation"
}

Current message:
"${message}"

Recent history:
${history.length
  ? history
      .map(
        h =>
          `Message: "${h.message}" | Sentiment: ${h.sentiment || 'unknown'} | Risk: ${h.risk || 'unknown'}`
      )
      .join('\n')
  : 'No previous history'}

Rules:
- Self-harm or suicidal intent = HIGH risk
- Repeated negative emotions = INCREASING trend
- Severe hopelessness = HIGH risk
- Mild sadness without suicidal intent = LOW or MEDIUM risk
- Use CLARIFY only when intent is ambiguous
- Use GROUNDING for emotional distress
- Use JOURNAL for low emotional negativity
- Positive mood = LOW risk


Return STRICT JSON only.
`;
};

export const parseAIResponse = (rawText) => {
  try {
    const cleaned = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      sentiment: parsed.sentiment || 'neutral',
      confidence: parsed.confidence || 0.5,
      risk: parsed.risk || 'LOW',
      trend: parsed.trend || 'STABLE',
      action: parsed.action || 'NONE',
      decision_reason: parsed.reason || '',
    };
  } catch (error) {
    throw new Error('Invalid AI JSON response');
  }
};

export const validateAIResponse = (response) => {
  const requiredFields = [
    'sentiment',
    'confidence',
    'risk',
    'trend',
    'action',
  ];

  for (const field of requiredFields) {
    if (
      response[field] === undefined ||
      response[field] === null
    ) {
      return false;
    }
  }

  return true;
};

export const fallbackRiskEngine = (message, history = []) => {
  
  const lowerMsg = message.toLowerCase();

  // =========================
  // HARD RISK WORDS
  // =========================
  const criticalPatterns = [
    "suicide",
    "kill myself",
    "end my life",
    "die",
    "give up",
    "end everything",
  ];

  const hardRisk = criticalPatterns.some(pattern =>
    lowerMsg.includes(pattern)
  );

  if (hardRisk) {
    return {
      sentiment: "negative",
      confidence: 0.4,
      risk: "HIGH",
      trend: "INCREASING",
      action: "ESCALATE",
      decision_reason: "Fallback detected critical self-harm language",
    };
  }

  // =========================
  // NEGATIVE DETECTION
  // =========================
  const negativeWords = [
    "sad",
    "alone",
    "hopeless",
    "worthless",
    "tired",
    "loser",
    "broken",
  ];

  const negativeFound = negativeWords.some(word =>
    lowerMsg.includes(word)
  );

  const recentNegativeCount = history.filter(
    m => m.sentiment === "negative"
  ).length;

  // =========================
  // TREND
  // =========================
  let trend = "STABLE";

  if (recentNegativeCount >= 2 && negativeFound) {
    trend = "INCREASING";
  }

  // =========================
  // RISK
  // =========================
  let risk = "LOW";

  if (negativeFound) {
    risk = "MEDIUM";
  }

  if (trend === "INCREASING") {
    risk = "HIGH";
  }

  // =========================
  // ACTION
  // =========================
  let action = "JOURNAL";

  if (risk === "MEDIUM") {
    action = "GROUNDING";
  }

  if (risk === "HIGH") {
    action = "ESCALATE";
  }

  return {
    sentiment: negativeFound ? "negative" : "neutral",
    confidence: 0.4,
    risk,
    trend,
    action,
    decision_reason: "Fallback engine used",
  };
};