import { router } from 'nuomi';
import { storage, normalize, delay } from '../../../utils';
import getDefaultPath from '../../../utils/getDefaultPath';

export default {
  save(data) {
    const newData = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (key !== 'logs') {
        newData[key] = normalize(value);
      } else if (value) {
        newData[key] = value.map((path) => normalize(path)).filter((path) => path);
      }
    });
    this.updateState(newData);
    storage('nginx', JSON.stringify(newData));
  },
  async $saveNginx(data) {
    this.save(data);
    await delay();
    router.replace('/nginx', true);
  },
  init() {
    const nginx = this.initNginxFromStorage();
    if (!nginx) {
      this.updateState(getDefaultPath());
    }
  },
};
