const ___ = require('lodash');
const util = require('../util/util');
const filterService = require('./filter.service');

class CommonService {
  constructor(entities) {
    this.model = entities.model;
    this.paginate = filterService;
  }

  create = async(inputDto) => {
    const res = await this.model.create(___.omit(inputDto, ['include']), {
      ...___.pick(inputDto, ['include']),
      hooks: true,
    });

    return this.findOne({ uuid: res.uuid });
  }

  findAll = async (filter = {}) => {
    console.log(filter,"filterfilter");
    const { queryMeta } = ___.omitBy(filter, ___.isNull);
    const pMeta = await this.paginate.makeMeta(queryMeta);
    const options = await this.makeOptions(filter);
    const [count, res] = await Promise.all([
      queryMeta?.paginate && this.model.count(___.omit(options, ['include'])),
      this.model.findAll(options),
    ]);
    return { ...(((queryMeta?.paginate && { meta: { ...pMeta, count } }) || {})), data: ___.map(res, util.toJSON) };
  };

  findOne = async (filter = {}) => {
    const model = (filter?.scopes && this.model.scope(filter.scopes)) || this.model;
    const options = await this.makeOptions(filter);
    options.limit = 1;
    return await model.findOne(options);
  }

  update = async (filter, inputDto) => {
    await this.model.update(
      ___.omit(inputDto, ['include']),
      { where: filter, ...___.pick(inputDto, ['include']) },
    );

    return this.findOne(filter);
  }

  upsert = async (filter, inputDto) => {
    const res = await this.findOne(filter);
    if (res) {
      return this.update({ uuid: res.uuid },inputDto);
    }
    return this.create(inputDto);
  };

  remove = async (filter) => {
    const res = await this.findOne(filter);
    if (!res) {
      return null;
    }

    await this.model.destroy({
      where: ___.omit(filter, ['include']),
      force: true,
      cascade: true,
      ...___.pick(filter, ['include']),
    });
    return res;
  }

  makeIncludeOptions = async (includeMeta) => {
    return (includeMeta || []).map((val) => {
      val.where && (val.where = this.paginate.filter({ filterMeta: val.where }));
      val.on && (val.on = this.paginate.filter({ filterMeta: val.on }));
      return val;
    });
  }
  
  makeOptions = async (filter) =>{
    const { queryMeta, filterMeta, attributeMeta, includeMeta, ...filters } = ___.omitBy(filter, ___.isNull);
    const pFilter = await this.paginate.calcPage(queryMeta);
    const pInclude = await this.makeIncludeOptions(___.filter(includeMeta, (val) => val));

    return {
      where: this.paginate.filter({ ...filters, filterMeta }),
      ...___.omit(pFilter, ['scopes']),
      include: pInclude,
      attributes: attributeMeta,
    };
  }
}

module.exports = CommonService;
