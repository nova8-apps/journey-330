// Web-safe shim for react-native-pager-view.
const React = require("react");
const { View } = require("react-native");
const PagerView = React.forwardRef(({ children, style, ...props }, ref) =>
  React.createElement(View, { ref, style, ...props }, children)
);
PagerView.displayName = "PagerViewWebShim";
module.exports = { __esModule: true, default: PagerView, PagerView };
