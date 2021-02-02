const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.post('page');
    const size = this.post('size') || 10;
    const name = this.post('name') || '';
    const model = this.model('goods');
    const data = await model.where({name: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }

  async goodListAction() {
    const page = this.post('page');
    const size = this.post('size') || 10;
    const name = this.post('name') || '';
    const data = await this.model('goods').field(`nideshop_goods.id,nideshop_category.name as categoryName,
    nideshop_goods.name,nideshop_goods.brand_id,nideshop_goods.category_id,nideshop_goods.retail_price,
    nideshop_goods.primary_pic_url,nideshop_brand.name as brandName`)
    .join('nideshop_category on  nideshop_goods.category_id = nideshop_category.id')
    .join('nideshop_brand on nideshop_goods.brand_id =nideshop_brand.id ')
    .order(['id DESC']).page(page,size).countSelect();
     console.log(data);
    return this.success(data);
  }
  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
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
    await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }

  async goodsSaveAction() {
    let id = this.post('id');
    const productData = {
      name: this.post('name'),
      retail_price: this.post('retail_price'),
      primary_pic_url: this.post('primary_pic_url'),
      category_id:this.post('secondaryCategoryId'),
      brand_id:this.post('brandId')
    };
    if (think.isEmpty(id)) {
       await this.model('goods').add(productData);
    } else {
      await this.model('goods').where({ id: id }).update(productData);
    }
    return this.success("操作成功");
  }
};
