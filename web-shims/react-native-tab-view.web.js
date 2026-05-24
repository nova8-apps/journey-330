// Web-safe shim for react-native-tab-view.
const React = require("react");
const { View } = require("react-native");
const passthrough = React.forwardRef(({ children, ...props }, ref) =>
  React.createElement(View, { ref, ...props }, children)
);
const TabView = passthrough;
const TabBar = passthrough;
const SceneMap = (scenes) => ({ route }) => {
  const Comp = scenes && route && scenes[route.key];
  return Comp ? React.createElement(Comp) : null;
};
const SceneRendererPropType = {};
module.exports = {
  __esModule: true,
  default: TabView,
  TabView, TabBar, SceneMap, SceneRendererPropType,
  PagerPanResponder: {}, PagerScroll: {}, PagerExperimental: {},
};
