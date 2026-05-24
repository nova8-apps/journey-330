// @nova8/auto-legal v1 — auto-generated Terms screen.
// This file is owned by Nova8 and gets re-rendered whenever the user
// saves the Privacy Info form in the dashboard. Edit the marker line
// above to "user-owned" to opt out of auto-sync.
// Generated at: 2026-05-24
// Source of truth: src/lib/legal-config.ts

import { ScrollView, View, Text, Linking, Pressable } from "react-native";
import { LEGAL_CONFIG } from "@/lib/legal-config";

export default function TermsScreen() {
  const c = LEGAL_CONFIG;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
        Terms of Use
      </Text>
      <Text style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        {c.displayName}
      </Text>

      <Text style={{ marginBottom: 12 }}>
        Your use of {c.displayName} is governed by Apple's Standard End User
        License Agreement (EULA), which Apple provides for all apps
        distributed through the App Store unless the developer ships a
        custom EULA.
      </Text>

      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL(c.appleStandardEulaUrl)}
        style={{ paddingVertical: 12, marginBottom: 16 }}
      >
        <Text style={{ color: "#0a66ff", fontWeight: "600" }}>
          Read the Standard EULA →
        </Text>
      </Pressable>

      <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, marginBottom: 6 }}>
        Subscriptions
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Any subscription or in-app purchase is processed by Apple. Payment is
        charged to your Apple ID, and subscriptions auto-renew unless turned
        off at least 24 hours before the end of the current period. You can
        manage and cancel subscriptions in your Apple ID settings.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, marginBottom: 6 }}>
        Contact
      </Text>
      <Text style={{ marginBottom: 4 }}>{c.legalName || c.displayName}</Text>
      <Pressable accessibilityRole="link" onPress={() => Linking.openURL("mailto:" + c.contactEmail)}>
        <Text style={{ color: "#0a66ff" }}>{c.contactEmail}</Text>
      </Pressable>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
