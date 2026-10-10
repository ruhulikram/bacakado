/**
 * Haptic Feedback Utilities (Multimodal Feedback - Apple Design Principle 13)
 * Provides tactile feedback on supported devices (Android, Chrome, PWAs)
 * Gracefully degrades (no-op) on unsupported environments or iOS Safari.
 */

type HapticType = "selection" | "light" | "medium" | "heavy" | "burst" | "success" | "error";

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  selection: 8,
  light: 14,
  medium: 24,
  heavy: 40,
  burst: [15, 30, 25],
  success: [20, 40, 30, 60],
  error: [30, 50, 30, 50],
};

export function triggerHaptic(type: HapticType = "light"): void {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;
  try {
    const pattern = HAPTIC_PATTERNS[type];
    navigator.vibrate(pattern);
  } catch {
    // Graceful no-op if blocked by browser policy
  }
}
