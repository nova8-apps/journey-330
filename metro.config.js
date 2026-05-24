const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.useWatchman = false;

const { assetExts, sourceExts } = config.resolver;
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Native-only modules redirected to web-safe shims (web-shims/) to avoid
// bundling heavy native-only code paths (shaves 5-15s off web bundle
// cold-start) WHILE keeping any direct imports working in the web preview.
//
// History: we used to return { type: "empty" } here, but that makes ALL
// imports from these modules evaluate to undefined, so any agent-emitted
// code that imports e.g. GestureHandlerRootView or GestureDetector and
// renders it as a JSX element crashes React with "Element type is invalid".
// The web-shims/*.web.js files export the same names as safe React no-ops
// (children pass-through, gesture API returns chainable stubs), so the
// generated code Just Works in the iframe preview while keeping the
// native-only code paths out of the web bundle.
//
// Modules NOT in this set because they have real web support:
//   - @react-navigation/bottom-tabs + react-native-screens (React DOM)
//   - @legendapp/motion (react-native-web supported per their docs)
const WEB_STUBBED_MODULES = new Set([
  "react-native-pager-view",
  "react-native-tab-view",
  "react-native-gesture-handler",
  "@gorhom/bottom-sheet",
  "@gorhom/portal",
]);

// Map module name -> shim file path (relative to project root).
// resolveRequest receives the importer-relative request; we redirect to an
// absolute path inside the scaffold so Metro picks up our shim instead of
// the real native module.
const path = require("path");
const WEB_STUB_SHIM_FILES = {
  "react-native-pager-view": path.resolve(__dirname, "web-shims/react-native-pager-view.web.js"),
  "react-native-tab-view": path.resolve(__dirname, "web-shims/react-native-tab-view.web.js"),
  "react-native-gesture-handler": path.resolve(__dirname, "web-shims/react-native-gesture-handler.web.js"),
  "@gorhom/bottom-sheet": path.resolve(__dirname, "web-shims/gorhom-bottom-sheet.web.js"),
  "@gorhom/portal": path.resolve(__dirname, "web-shims/gorhom-portal.web.js"),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"],
  useWatchman: false,
  resolveRequest: (context, moduleName, platform) => {
    if (platform === "web") {
      // Exact match OR scoped/subpath match (e.g. "react-native-gesture-handler/lib/...")
      for (const stub of WEB_STUBBED_MODULES) {
        if (moduleName === stub || moduleName.startsWith(stub + "/")) {
          return {
            type: "sourceFile",
            filePath: WEB_STUB_SHIM_FILES[stub],
          };
        }
      }
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
