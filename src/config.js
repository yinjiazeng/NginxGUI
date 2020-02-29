import { nuomi } from 'nuomi';

nuomi.config({
  effects: {
    updateState(payload) {
      this.dispatch({
        type: '_updateState',
        payload,
      });
    },
  },
});
