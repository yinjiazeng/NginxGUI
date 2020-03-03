import { message } from 'antd';
import { nuomi, router } from 'nuomi';

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
