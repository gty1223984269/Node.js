const Base = require('./base.js');

function generateTreeMenu(arr, pid = 0) {
  const temp = [];
  for (const item of arr) {
    if (item.parentId === pid) {
      item.children = generateTreeMenu(arr, item.id);
      temp.push(item);
    }
  }
  return temp;
}
module.exports = class extends Base {
  /**
   * 获取sku信息，用于购物车编辑时选择规格
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async menuListAction() {
    const arr = await this.model('bk_menu').select();
    const menuList = generateTreeMenu(arr,0);
    return this.success({
      menuList: menuList
    });
  }

  

};


