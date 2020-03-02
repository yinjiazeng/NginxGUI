import { message } from 'antd';
import { nuomi, router } from 'nuomi';
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

message.config({
  duration: 2,
  maxCount: 3,
});

router.listener(() => {
  message.destroy();
});

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.keyCode === 116) {
    window.location.reload();
  }
});
