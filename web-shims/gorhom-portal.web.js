// Web-safe shim for @gorhom/portal.
// Falls back to inline rendering (children pass-through). The portal
// teleport behavior is lost, but in our iframe preview the visual result
// is the same since everything renders in one document anyway.
const React = require("react");

const PortalProvider = ({ children }) => children == null ? null : children;
const PortalHost = ({ children }) => children == null ? null : children;
const Portal = ({ children }) => children == null ? null : children;

const usePortal = () => ({
  addPortal: () => {}, updatePortal: () => {}, removePortal: () => {},
});

module.exports = {
  __esModule: true,
  default: Portal,
  PortalProvider, PortalHost, Portal, usePortal,
};
