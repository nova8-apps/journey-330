// @nova8/auto-legal v1 — auto-generated Privacy screen.
// This file is owned by Nova8 and gets re-rendered whenever the user
// saves the Privacy Info form in the dashboard. Edit the marker line
// above to "user-owned" to opt out of auto-sync.
// Generated at: 2026-05-24
// Source of truth: src/lib/legal-config.ts

import { ScrollView, View, Text, Linking, Pressable } from "react-native";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export default function PrivacyScreen() {
  const c = LEGAL_CONFIG;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
        Privacy Policy
      </Text>
      <Text style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        {c.displayName}
      </Text>

      <Text style={{ marginBottom: 12 }}>
        This page summarises how {c.displayName} handles your data. The full,
        legally binding privacy policy is hosted online and updated whenever
        we change how the app handles personal information.
      </Text>

      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL(c.hostedPolicyUrl)}
        style={{ paddingVertical: 12, marginBottom: 16 }}
      >
        <Text style={{ color: "#0a66ff", fontWeight: "600" }}>
          Read the full privacy policy →
        </Text>
      </Pressable>

      <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, marginBottom: 6 }}>
        What we collect
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Only the data the app needs to function (account info if you sign in,
        any content you create, and basic crash/diagnostic logs). We do not
        sell your data.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, marginBottom: 6 }}>
        Your rights
      </Text>
      <Text style={{ marginBottom: 12 }}>
        You can request a copy of your data, ask us to delete it, or close
        your account at any time by contacting us.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, marginBottom: 6 }}>
        Contact
      </Text>
      <Text style={{ marginBottom: 4 }}>{c.legalName || c.displayName}</Text>
      <Pressable accessibilityRole="link" onPress={() => Linking.openURL("mailto:" + c.contactEmail)}>
        <Text style={{ color: "#0a66ff" }}>{c.contactEmail}</Text>
      </Pressable>
      {c.country ? <Text style={{ marginTop: 4, color: "#666" }}>{c.country}</Text> : null}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
