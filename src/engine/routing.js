import { CONFIDENCE_THRESHOLDS, SLA } from "../constants";

export function routeClaim(fields) {
  const scores = Object.values(fields).map((f) => f.confidence);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const rounded = Math.round(avg * 100) / 100;

  if (rounded >= CONFIDENCE_THRESHOLDS.HIGH) {
    return { tier: "HIGH", averageConfidence: rounded, sla: SLA.HIGH };
  }

  if (rounded >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return { tier: "MEDIUM", averageConfidence: rounded, sla: SLA.MEDIUM };
  }

  return { tier: "LOW", averageConfidence: rounded, sla: null };
}
