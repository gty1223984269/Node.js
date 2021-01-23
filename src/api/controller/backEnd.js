const Base = require('./base.js');
const fs = require('fs');

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
   * 获取菜单分类
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async menuListAction() {
    const arr = await this.model('bk_menu').select();
    const menuList = generateTreeMenu(arr, 0);
    return this.success({
      menuList: menuList
    });
  }

  /**
   * 获取学校列表
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async schoolListAction() {
    const schoolList = await this.model('bk_school').select();
    return this.success({
      schoolList: schoolList
    });
  }

   /**
   * 获取产品列表
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async productListAction() {
    const productList = await this.model('bk_product_list').where({is_delete:0}).select();
    return this.success({
      productList: productList
    });
  }
  /**
   * 添加或更新产品信息
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async productSaveAction() {
    let id = this.post('id');
    const productData = {
      title: this.post('title'),
      money: this.post('money'),
      img_path: this.post('img_path'),
      is_default: this.post('is_default') === true ? 1 : 0
    };

    if (think.isEmpty(id)) {
      addressId = await this.model('bk_product_list').add(productData);
    } else {
      await this.model('bk_product_list').where({ id: id }).update(productData);
    }
    return this.success("操作成功");
  }

  /**
   * 删除指定的产品
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async productDeleteAction() {
    const id = this.post('id');
    await this.model('bk_product_list').where({ id: id }).delete();
    return this.success('删除成功');
  }

  /**
  * 保存用户头像
  * @returns {Promise.<void>}
  */
  async uploadFileAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }
    var path = think.ROOT_PATH + '/upload/';
    var fileName = avatar.name;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    fs.readFile(avatar.path, function (error, buffer) {
      fs.writeFile(path + `/${fileName}`, buffer, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

};


