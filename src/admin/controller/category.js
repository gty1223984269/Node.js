const Base = require('./base.js');
function generateTreeMenu(arr, pid = 0) {
  const temp = [];
  for (const item of arr) {
    if (item.parent_id === pid) {
      item.children = generateTreeMenu(arr, item.id);
      temp.push(item);
    }
  }
  return temp;
}
module.exports = class extends Base {

  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const model = this.model('category'); 
    const data = await model.where({is_show: 1}).order(['sort_order ASC']).select();
    const topCategory = data.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push(item);
      data.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
      });
    });
    return this.success(categoryList);
  }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).order(['id ASC']).select();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('category');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('category');
    values.is_show = values.is_show ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('category').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }

  async categoryListAction() {
    const arr=[];
    const list = await this.model('category').field(['id', 'name', 'icon_url','parent_id' ]).select();
    list.forEach(function(item,index)
     {
      arr.push({
        id:item.id,
        label:item.name,
        icon_url:item.icon_url,
        parent_id:item.parent_id
      });
     })
    const categoryList= generateTreeMenu(arr,0);
    return this.success({
      categoryList:categoryList
    });
  }
  //添加分类
  async categoryAddAction() {
    const parent_id = this.post('parent_id');
    const name = this.post('name');
    await this.model('category').add({parent_id:parent_id,name:name,icon_url:'',img_url:'',wap_banner_url:'',level:'',front_name:''});
    return this.success("操作成功");
  }
  
  //删除分类
  async categoryDeleteAction() {
    const id = this.post('id');
    await this.model('category').where({id:id}).delete();
    return this.success("操作成功");
  }

};
