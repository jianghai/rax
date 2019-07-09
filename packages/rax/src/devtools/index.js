import Instance from '../vdom/instance';
import Host from '../vdom/host';
import reconciler from './reconciler';

const renderer = {
  ComponentTree: {
    getClosestInstanceFromNode(node) {
      return Instance.get(node);
    },
    getNodeFromInstance(inst) {
      // inst is an internal instance (but could be a composite)
      while (inst._renderedComponent) {
        inst = inst._renderedComponent;
      }

      if (inst) {
        return inst._nativeNode;
      } else {
        return null;
      }
    }
  },
  Mount: {
    get _instancesByReactRootID() {
      const rootComponents = {};

      // Ignore display top-level root component
      for (let rootID in Host.rootComponents) {
        rootComponents[rootID] = Host.rootComponents[rootID]._renderedComponent;
      }

      return rootComponents;
    },

    _renderNewRootComponent: reconciler.renderNewRootComponent
  },
  Reconciler: reconciler,
  // monitor the info of all components
  monitor: null
};

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject(renderer);
}
