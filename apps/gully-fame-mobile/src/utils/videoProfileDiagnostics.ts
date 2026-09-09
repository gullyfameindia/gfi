





import { reelsService, Reel } from "@/api/services/reelsService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DiagnosticResult {
  timestamp: string;
  userId: string;
  overallStatus: "PASS" | "FAIL";
  checks: DiagnosticCheck[];
  recommendations: string[];
  apiResponse?: any;
  debugData: string;
}

export interface DiagnosticCheck {
  name: string;
  status: "PASS" | "FAIL" | "WARNING";
  message: string;
  details?: string;
}





export async function runFullDiagnostics(
  userId: string
): Promise<DiagnosticResult> {
  const checks: DiagnosticCheck[] = [];
  const recommendations: string[] = [];
  let apiResponse: any = null;

  console.log("\n================================");
  console.log("🔍 STARTING FULL DIAGNOSTICS");
  console.log("================================\n");

  
  const userIdCheck = checkUserId(userId);
  checks.push(userIdCheck);
  if (userIdCheck.status === "FAIL") {
    recommendations.push("❌ Fix: Ensure profileData.id is properly set before fetching reels");
    recommendations.push("   → Check useOwnProfile hook is returning valid id");
    recommendations.push("   → Log: console.log('[Debug] profileData.id:', profileData.id)");
  }

  
  const authCheck = await checkAuthentication();
  checks.push(authCheck);
  if (authCheck.status === "FAIL") {
    recommendations.push("❌ Fix: User not authenticated");
    recommendations.push("   → Check AsyncStorage token: await AsyncStorage.getItem('authToken')");
    recommendations.push("   → Login and retry");
  }

  
  const endpointCheck = await checkAPIEndpoint();
  checks.push(endpointCheck);
  if (endpointCheck.status === "FAIL") {
    recommendations.push("❌ Fix: Backend API not accessible");
    recommendations.push("   → Check API_BASE_URL in environment");
    recommendations.push("   → Verify backend is running at https://gullyfame.com");
    recommendations.push("   → Check network connectivity");
  }

  
  const apiCheck = await checkGetUserReelsAPI(userId);
  checks.push(apiCheck);
  apiResponse = apiCheck.apiResponse;

  if (apiCheck.status === "FAIL") {
    recommendations.push("❌ Fix: getUserReels API call failed");
    recommendations.push("   → Check backend /reels endpoint");
    recommendations.push("   → Verify userId parameter is correct");
    recommendations.push("   → Check API response in Network tab");
    if (apiResponse?.error) {
      recommendations.push(`   → Error: ${apiResponse.error}`);
    }
  } else if (apiCheck.status === "WARNING") {
    recommendations.push("⚠️  Warning: API returned success but no videos");
    recommendations.push("   → Verify videos exist in database");
    recommendations.push("   → Check filtering/pagination logic");
    recommendations.push("   → Ensure videos are published/visible");
  }

  
  if (apiResponse && apiResponse.reels) {
    const dataCheck = checkResponseDataStructure(apiResponse.reels);
    checks.push(dataCheck);
    if (dataCheck.status === "WARNING") {
      recommendations.push("⚠️  Warning: Some videos missing required fields");
      recommendations.push("   → Ensure all videos have: _id, videoUrl, thumbnail");
      recommendations.push("   → Backend should generate thumbnails after upload");
    }
  }

  
  const componentCheck: DiagnosticCheck = {
    name: "Component Mount Status",
    status: "WARNING",
    message:
      "Cannot verify component mount status from here - check console in app",
    details: "Look for: [ProfileVideoGrid] Component mounted",
  };
  checks.push(componentCheck);
  recommendations.push(
    "ℹ️  Tip: In app console, look for [ProfileVideoGrid] logs to confirm component mounted"
  );

  
  const flatlistCheck: DiagnosticCheck = {
    name: "FlatList Rendering",
    status: "WARNING",
    message: "Cannot verify FlatList rendering from here",
    details: "Look for: [FlatList] Rendering item X in console",
  };
  checks.push(flatlistCheck);
  recommendations.push("ℹ️  Tip: In app console, look for [FlatList] rendering logs");

  
  const failedChecks = checks.filter((c) => c.status === "FAIL");
  const overallStatus: "PASS" | "FAIL" = failedChecks.length > 0 ? "FAIL" : "PASS";

  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    userId,
    overallStatus,
    checks,
    recommendations,
    apiResponse,
    debugData: formatDebugData(checks, userId, apiResponse),
  };

  logDiagnosticResult(result);
  return result;
}




function checkUserId(userId: string): DiagnosticCheck {
  if (!userId) {
    return {
      name: "User ID Validation",
      status: "FAIL",
      message: "❌ User ID is empty or undefined",
      details: `Received: "${userId}"`,
    };
  }

  if (typeof userId !== "string") {
    return {
      name: "User ID Validation",
      status: "FAIL",
      message: `❌ User ID is not a string, received type: ${typeof userId}`,
      details: `Value: ${userId}`,
    };
  }

  if (userId.length < 3) {
    return {
      name: "User ID Validation",
      status: "WARNING",
      message: "⚠️  User ID seems too short",
      details: `Length: ${userId.length}`,
    };
  }

  return {
    name: "User ID Validation",
    status: "PASS",
    message: "✅ User ID is valid",
    details: `User ID: ${userId}`,
  };
}




async function checkAuthentication(): Promise<DiagnosticCheck> {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      return {
        name: "Authentication",
        status: "FAIL",
        message: "❌ No auth token found in AsyncStorage",
        details: "User must be logged in to fetch reels",
      };
    }

    const isExpired = await isTokenExpired(token);
    if (isExpired) {
      return {
        name: "Authentication",
        status: "FAIL",
        message: "❌ Auth token is expired",
        details: "User needs to re-login",
      };
    }

    return {
      name: "Authentication",
      status: "PASS",
      message: "✅ Authentication token is valid",
      details: `Token length: ${token.length} chars`,
    };
  } catch (error: any) {
    return {
      name: "Authentication",
      status: "FAIL",
      message: "❌ Error checking authentication",
      details: error.message,
    };
  }
}




async function checkAPIEndpoint(): Promise<DiagnosticCheck> {
  try {
    
    const response = await fetch("https://gullyfame.com/v1/api/health", {
      method: "GET",
      timeout: 5000,
    }).catch((e) => {
      throw new Error(`Network error: ${e.message}`);
    });

    if (response.status === 200) {
      return {
        name: "API Endpoint Accessibility",
        status: "PASS",
        message: "✅ API endpoint is accessible",
        details: "Backend server is responding",
      };
    } else {
      return {
        name: "API Endpoint Accessibility",
        status: "FAIL",
        message: `❌ API returned status ${response.status}`,
        details: `Expected 200, got ${response.status}`,
      };
    }
  } catch (error: any) {
    return {
      name: "API Endpoint Accessibility",
      status: "FAIL",
      message: "❌ Cannot reach API endpoint",
      details: error.message || "Network unreachable",
    };
  }
}




async function checkGetUserReelsAPI(
  userId: string
): Promise<DiagnosticCheck & { apiResponse?: any }> {
  try {
    console.log(`[Diagnostics] Testing getUserReels API for userId: ${userId}`);

    const response = await reelsService.getUserReels(userId, {
      page: 1,
      limit: 50,
    });

    if (response.success && response.data?.items) {
      const reelCount = response.data.items.length;

      if (reelCount === 0) {
        return {
          name: "getUserReels API",
          status: "WARNING",
          message: "⚠️  API succeeded but returned 0 videos",
          details: `Response: success=true, items=[], total=${response.data.total}`,
          apiResponse: response.data,
        };
      }

      return {
        name: "getUserReels API",
        status: "PASS",
        message: `✅ API returned ${reelCount} videos`,
        details: `Videos IDs: ${response.data.items.map((r) => r._id || r.id).join(", ")}`,
        apiResponse: response.data,
      };
    } else {
      return {
        name: "getUserReels API",
        status: "FAIL",
        message: "❌ API returned unsuccessful response",
        details: `Message: ${response.message}`,
        apiResponse: response,
      };
    }
  } catch (error: any) {
    return {
      name: "getUserReels API",
      status: "FAIL",
      message: "❌ API call threw exception",
      details: error.message,
      apiResponse: { error: error.message },
    };
  }
}




function checkResponseDataStructure(reels: Reel[]): DiagnosticCheck {
  if (!Array.isArray(reels) || reels.length === 0) {
    return {
      name: "Response Data Structure",
      status: "FAIL",
      message: "❌ No reels in response",
      details: "Array is empty or not an array",
    };
  }

  const missingFields: string[] = [];
  reels.forEach((reel, idx) => {
    if (!reel._id && !reel.id) missingFields.push(`Reel ${idx}: missing _id/id`);
    if (!reel.videoUrl) missingFields.push(`Reel ${idx}: missing videoUrl`);
    if (!reel.thumbnail) missingFields.push(`Reel ${idx}: missing thumbnail`);
  });

  if (missingFields.length > 0) {
    return {
      name: "Response Data Structure",
      status: "WARNING",
      message: "⚠️  Some videos missing required fields",
      details: missingFields.join("; "),
    };
  }

  return {
    name: "Response Data Structure",
    status: "PASS",
    message: "✅ All videos have required fields",
    details: `Checked ${reels.length} videos`,
  };
}




async function isTokenExpired(token: string): Promise<boolean> {
  try {
    
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const expiryTime = payload.exp * 1000; 
    return Date.now() > expiryTime;
  } catch {
    return false;
  }
}




function formatDebugData(
  checks: DiagnosticCheck[],
  userId: string,
  apiResponse: any
): string {
  const lines: string[] = [];

  lines.push("=== VIDEO PROFILE DIAGNOSTIC REPORT ===\n");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`User ID: ${userId}\n`);

  lines.push("CHECK RESULTS:");
  checks.forEach((check) => {
    const icon = {
      PASS: "✅",
      FAIL: "❌",
      WARNING: "⚠️",
    }[check.status];
    lines.push(`  ${icon} ${check.name}: ${check.message}`);
    if (check.details) {
      lines.push(`     Details: ${check.details}`);
    }
  });

  if (apiResponse) {
    lines.push("\nAPI RESPONSE:");
    lines.push(JSON.stringify(apiResponse, null, 2));
  }

  return lines.join("\n");
}




function logDiagnosticResult(result: DiagnosticResult): void {
  console.log("\n" + "=".repeat(50));
  console.log("📊 DIAGNOSTIC RESULT: " + result.overallStatus);
  console.log("=".repeat(50) + "\n");

  console.log("CHECKS:");
  result.checks.forEach((check) => {
    const icon = {
      PASS: "✅",
      FAIL: "❌",
      WARNING: "⚠️",
    }[check.status];
    console.log(`${icon} ${check.name}: ${check.message}`);
    if (check.details) console.log(`   ${check.details}`);
  });

  console.log("\nRECOMMENDATIONS:");
  result.recommendations.forEach((rec) => {
    console.log(rec);
  });

  console.log("\n" + "=".repeat(50) + "\n");
}




export function generateShareableReport(result: DiagnosticResult): string {
  return result.debugData;
}




export const videoProfileDiagnostics = {
  runFullDiagnostics,
  generateShareableReport,
};
