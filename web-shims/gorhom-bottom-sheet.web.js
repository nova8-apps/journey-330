// Web-safe shim for @gorhom/bottom-sheet.
const React = require("react");
const { View, ScrollView, FlatList } = require("react-native");

const passthrough = React.forwardRef(({ children, ...props }, ref) =>
  React.createElement(View, { ref, ...props }, children)
);
const BottomSheet = passthrough;
const BottomSheetModal = passthrough;
const BottomSheetModalProvider = ({ children }) => children == null ? null : children;
const BottomSheetView = passthrough;
const BottomSheetScrollView = React.forwardRef(({ children, ...props }, ref) =>
  React.createElement(ScrollView, { ref, ...props }, children)
);
const BottomSheetFlatList = React.forwardRef((props, ref) =>
  React.createElement(FlatList, { ref, ...props })
);
const BottomSheetSectionList = React.forwardRef((props, ref) =>
  React.createElement(FlatList, { ref, ...props })
);
const BottomSheetTextInput = passthrough;
const BottomSheetBackdrop = passthrough;
const BottomSheetHandle = passthrough;
const BottomSheetFooter = passthrough;

// useBottomSheet / useBottomSheetModal return chainable no-op refs/handlers.
const noopHandle = {
  present: () => {}, dismiss: () => {}, snapToIndex: () => {},
  snapToPosition: () => {}, expand: () => {}, collapse: () => {}, close: () => {},
  forceClose: () => {},
};
const useBottomSheet = () => noopHandle;
const useBottomSheetModal = () => noopHandle;
const useBottomSheetSpringConfigs = () => ({});
const useBottomSheetTimingConfigs = () => ({});
const useBottomSheetInternal = () => ({});
const useBottomSheetDynamicSnapPoints = () => ({
  animatedHandleHeight: 0, animatedSnapPoints: [], animatedContentHeight: 0,
  handleContentLayout: () => {},
});

module.exports = {
  __esModule: true,
  default: BottomSheet,
  BottomSheet, BottomSheetModal, BottomSheetModalProvider,
  BottomSheetView, BottomSheetScrollView, BottomSheetFlatList,
  BottomSheetSectionList, BottomSheetTextInput, BottomSheetBackdrop,
  BottomSheetHandle, BottomSheetFooter,
  useBottomSheet, useBottomSheetModal,
  useBottomSheetSpringConfigs, useBottomSheetTimingConfigs,
  useBottomSheetInternal, useBottomSheetDynamicSnapPoints,
  SCREEN_HEIGHT: 0, SCREEN_WIDTH: 0, WINDOW_HEIGHT: 0, WINDOW_WIDTH: 0,
};
