import { nuomi } from 'nuomi';
import { storage } from './utils';

nuomi.config({
  effects: {
    initNginxFromStorage() {
      const nginx = storage('nginx');
      if (nginx) {
        this.updateState(JSON.parse(nginx));
      }
      return nginx;
    },
    updateState(payload) {
      this.dispatch({
        type: '_updateState',
        payload,
      });
    },
  },
});
