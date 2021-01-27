const Base = require('./base.js');

module.exports = class extends Base {
  async configListAction() {
    const list = await this.model('bk_module_config').select();
    return this.success({
      moduleList: list,
    });
  }
};
