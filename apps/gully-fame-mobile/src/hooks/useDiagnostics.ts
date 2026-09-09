





import { useEffect, useState, useCallback } from "react";
import {
  videoProfileDiagnostics,
  DiagnosticResult,
} from "@/utils/videoProfileDiagnostics";

export interface UseDiagnosticsOptions {
  enabled?: boolean; 
  runOnError?: boolean; 
  autoRunInterval?: number; 
  userId?: string; 
}

export interface UseDiagnosticsState {
  isRunning: boolean;
  result: DiagnosticResult | null;
  error: string | null;
  lastRun: Date | null;
}

export function useDiagnostics(
  options: UseDiagnosticsOptions = {}
): UseDiagnosticsState & {
  runDiagnostics: () => Promise<DiagnosticResult | null>;
  clearResults: () => void;
} {
  const {
    enabled = __DEV__, 
    runOnError = true,
    autoRunInterval = 0,
    userId = "",
  } = options;

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  
  const runDiagnostics = useCallback(async (): Promise<DiagnosticResult | null> => {
    if (!enabled || !userId) {
      console.log(
        "[useDiagnostics] Skipped: enabled=" + enabled + ", userId=" + userId
      );
      return null;
    }

    try {
      setIsRunning(true);
      setError(null);

      console.log("[useDiagnostics] Starting diagnostics for userId:", userId);

      const diagnosticResult = await videoProfileDiagnostics.runFullDiagnostics(
        userId
      );

      setResult(diagnosticResult);
      setLastRun(new Date());

      console.log("[useDiagnostics] Diagnostics complete:", {
        status: diagnosticResult.overallStatus,
        checksCount: diagnosticResult.checks.length,
        recommendations: diagnosticResult.recommendations.length,
      });

      return diagnosticResult;
    } catch (err: any) {
      const errorMessage = err.message || "Unknown error";
      console.error("[useDiagnostics] Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [enabled, userId]);

  
  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
    setLastRun(null);
  }, []);

  
  useEffect(() => {
    if (!enabled || autoRunInterval <= 0) return;

    const interval = setInterval(() => {
      console.log("[useDiagnostics] Running periodic diagnostics");
      runDiagnostics();
    }, autoRunInterval);

    return () => clearInterval(interval);
  }, [enabled, autoRunInterval, runDiagnostics]);

  return {
    isRunning,
    result,
    error,
    lastRun,
    runDiagnostics,
    clearResults,
  };
}
