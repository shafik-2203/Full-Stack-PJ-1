// Authentication Conflict Resolution Utility

export interface AuthConflictInfo {
  email?: string;
  username?: string;
  conflictType: string;
  isVerified?: boolean;
}

export interface ConflictResolution {
  success: boolean;
  action: string;
  message: string;
  nextStep?: string;
}

export class AuthConflictResolver {
  // Debug auth conflicts
  static async debugAuthConflict(email: string, username: string) {
    try {
      const response = await fetch("/api/debug/auth-conflict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      });

      return await response.json();
    } catch (error) {
      console.error("Debug auth conflict error:", error);
      return { success: false, error: error.message };
    }
  }

  // Resolve "user already exists" but "account not found" conflicts
  static async resolveSignupLoginConflict(
    email: string,
    username: string,
  ): Promise<ConflictResolution> {
    try {
      // First check if there's a verified account
      const verifiedCheck = await fetch("/api/auth/resolve-conflict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          action: "get_verified_account",
        }),
      });

      const verifiedResult = await verifiedCheck.json();

      if (verifiedResult.success && verifiedResult.user) {
        // There's a verified account - user should login
        return {
          success: true,
          action: "redirect_to_login",
          message: `A verified account exists. Please try logging in with email: ${verifiedResult.user.email}`,
          nextStep: "login",
        };
      }

      // Clear unverified accounts that might be conflicting
      const clearResponse = await fetch("/api/auth/resolve-conflict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          action: "clear_unverified",
        }),
      });

      const clearResult = await clearResponse.json();

      if (clearResult.success && clearResult.changes > 0) {
        return {
          success: true,
          action: "cleared_conflicts",
          message: `Cleared ${clearResult.changes} unverified account(s). You can now sign up again.`,
          nextStep: "retry_signup",
        };
      }

      return {
        success: false,
        action: "manual_intervention",
        message:
          "Unable to automatically resolve conflict. Please contact support.",
        nextStep: "contact_support",
      };
    } catch (error) {
      console.error("Resolve conflict error:", error);
      return {
        success: false,
        action: "error",
        message: "Network error while resolving conflict",
        nextStep: "retry",
      };
    }
  }

  // Handle signup conflicts automatically
  static async handleSignupConflict(
    email: string,
    username: string,
    conflictType: string,
  ): Promise<{ resolved: boolean; message: string; action?: string }> {
    console.log(
      `🔧 Resolving ${conflictType} conflict for ${email}/${username}`,
    );

    const resolution = await this.resolveSignupLoginConflict(email, username);

    if (resolution.success) {
      if (resolution.action === "redirect_to_login") {
        return {
          resolved: true,
          message: resolution.message,
          action: "redirect_login",
        };
      } else if (resolution.action === "cleared_conflicts") {
        return {
          resolved: true,
          message: resolution.message,
          action: "retry_signup",
        };
      }
    }

    return {
      resolved: false,
      message: resolution.message || "Could not resolve conflict automatically",
    };
  }

  // Handle login "account not found" errors
  static async handleLoginNotFound(
    username: string,
  ): Promise<{ resolved: boolean; message: string; action?: string }> {
    try {
      // Check if there are any accounts with similar credentials
      const debugInfo = await this.debugAuthConflict(username, username);

      if (debugInfo.success && debugInfo.debug) {
        const { allUsers } = debugInfo.debug;

        // Look for similar emails or usernames
        const similarUsers = allUsers.filter(
          (user: any) =>
            user.email.toLowerCase().includes(username.toLowerCase()) ||
            user.username.toLowerCase().includes(username.toLowerCase()) ||
            username.toLowerCase().includes(user.email.toLowerCase()) ||
            username.toLowerCase().includes(user.username.toLowerCase()),
        );

        if (similarUsers.length > 0) {
          const suggestions = similarUsers
            .filter((u: any) => u.is_verified)
            .map((u: any) => `${u.email} (username: ${u.username})`)
            .slice(0, 3);

          if (suggestions.length > 0) {
            return {
              resolved: false,
              message: `Account not found. Did you mean: ${suggestions.join(", ")}?`,
              action: "suggest_alternatives",
            };
          }
        }
      }

      return {
        resolved: false,
        message:
          "Account not found. Please check your credentials or sign up for a new account.",
        action: "suggest_signup",
      };
    } catch (error) {
      return {
        resolved: false,
        message: "Could not verify account details. Please try again.",
      };
    }
  }
}