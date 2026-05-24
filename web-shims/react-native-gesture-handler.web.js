// Web-safe shim for react-native-gesture-handler.
// The real library is native-bridge code with no working web bundle in our
// scaffold. We redirect to this file from metro.config.js when platform==='web'.
// We export every name an agent is likely to import, so JSX usage like
// <GestureHandlerRootView>, <GestureDetector>, Swipeable, etc. all render
// as plain children pass-throughs instead of crashing as 'undefined'.
const React = require("react");
const { View, ScrollView, FlatList } = require("react-native");

const passthrough = (Tag) => {
  const C = React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(Tag, { ref, ...props }, children)
  );
  C.displayName = "GHWebShim";
  return C;
};

const GestureHandlerRootView = passthrough(View);
const GestureDetector = ({ children }) => children == null ? null : children;

// Gesture.Pan() / Tap() / etc. must return a chainable builder so code like
//   Gesture.Pan().activeOffsetX([-10,10]).onUpdate(...).onEnd(...) doesn't crash.
function chainable() {
  const self = {};
  const methods = [
    "enabled","shouldCancelWhenOutside","hitSlop","cancelsTouchesInView",
    "runOnJS","manualActivation","minPointers","maxPointers",
    "activeOffsetX","activeOffsetY","failOffsetX","failOffsetY",
    "minDistance","minVelocity","minVelocityX","minVelocityY",
    "averageTouches","numberOfTaps","maxDelay","maxDuration",
    "maxDistance","direction","minNumberOfFingers","maxNumberOfFingers",
    "onBegin","onStart","onUpdate","onChange","onEnd","onFinalize",
    "onTouchesDown","onTouchesMove","onTouchesUp","onTouchesCancelled",
    "simultaneousWithExternalGesture","requireExternalGestureToFail",
    "blocksExternalGesture","withRef","withTestId",
  ];
  for (const m of methods) self[m] = () => self;
  return self;
}

const Gesture = {
  Pan: chainable, Tap: chainable, LongPress: chainable, Pinch: chainable,
  Rotation: chainable, Fling: chainable, ForceTouch: chainable, Hover: chainable,
  Manual: chainable, Native: chainable, Race: () => chainable(),
  Simultaneous: () => chainable(), Exclusive: () => chainable(),
};

// State enum (some libraries compare against these)
const State = {
  UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5,
};
const Directions = { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 };

const RectButton = passthrough(View);
const BorderlessButton = passthrough(View);
const BaseButton = passthrough(View);
const RawButton = passthrough(View);
const TouchableHighlight = passthrough(View);
const TouchableNativeFeedback = passthrough(View);
const TouchableOpacity = passthrough(View);
const TouchableWithoutFeedback = passthrough(View);

const PanGestureHandler = passthrough(View);
const TapGestureHandler = passthrough(View);
const LongPressGestureHandler = passthrough(View);
const PinchGestureHandler = passthrough(View);
const RotationGestureHandler = passthrough(View);
const FlingGestureHandler = passthrough(View);
const ForceTouchGestureHandler = passthrough(View);
const NativeViewGestureHandler = passthrough(View);

const Swipeable = passthrough(View);
const DrawerLayout = passthrough(View);

module.exports = {
  __esModule: true,
  default: {},
  GestureHandlerRootView, GestureDetector, Gesture, State, Directions,
  RectButton, BorderlessButton, BaseButton, RawButton,
  TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback,
  PanGestureHandler, TapGestureHandler, LongPressGestureHandler,
  PinchGestureHandler, RotationGestureHandler, FlingGestureHandler,
  ForceTouchGestureHandler, NativeViewGestureHandler,
  Swipeable, DrawerLayout,
  ScrollView, FlatList,
  gestureHandlerRootHOC: (C) => C,
  enableScreens: () => {},
  enableLegacyWebImplementation: () => {},
};
