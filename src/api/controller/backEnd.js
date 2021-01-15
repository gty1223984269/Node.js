const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {

    const  menuList = await this.model('bk_menu').select();
    return this.success({
      menuList: menuList
    });
  }
};
