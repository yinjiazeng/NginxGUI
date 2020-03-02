import { router } from 'nuomi';
import { storage } from '../../../utils';
import getDefaultPath from '../../../utils/getDefaultPath';

export default {
  save(data) {
    this.updateState(data);
    storage('nginx', JSON.stringify(data));
  },
  saveNginx(data) {
    this.save(data);
    router.replace('/nginx', true);
  },
  init() {
    const nginx = this.initNginxFromStorage();
    if (!nginx) {
      this.updateState(getDefaultPath());
    }
  },
};
