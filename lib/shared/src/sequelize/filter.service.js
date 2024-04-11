const { isUndefined, omit, omitBy } =  require('lodash');
const {  literalOptions, metaOptions } = require('./meta');

class FilterService {
  constructor(){
    this.metaOptions = metaOptions;
    this.literalOptions = literalOptions;
  }
  calcPage(queryMeta) {
    const order = queryMeta?.order;
    const { page, limit } = this.makeMeta(queryMeta);

    return {
      ...((queryMeta?.paginate && {
        offset: limit * (page - 1),
        limit: limit,
      }) ||
        {}),
      order: order,
    };
  }

  makeMeta(queryMeta) {
    const page = (queryMeta?.page <= 0 && 1) || queryMeta?.page || 1;
    const limit = (queryMeta?.limit < 50 && queryMeta?.limit) || 50;
    return { page, limit };
  }

  filter(filter){
    const filterMeta = this.makeFilterMeta(filter.filterMeta || {});
    return omitBy({ ...filter, ...filterMeta, filterMeta: undefined }, isUndefined);
  }

  makeFilterMeta(filterMeta) {
    for (const key in filterMeta) {
      if (this.metaOptions[key]) {
        filterMeta[this.metaOptions[key]] = this.filterTypeCast(filterMeta[key]);
        filterMeta = omit(filterMeta, [key]);
        if (typeof filterMeta[this.metaOptions[key]] !== 'object') {
          continue;
        }
      }
      if (this.literalOptions[key]) {
        filterMeta[key] = this.literalOptions[key](filterMeta[key]);
        continue;
      }

      if (typeof filterMeta[key] === 'object') {
        filterMeta[key] = this.makeFilterMeta(filterMeta[key]);
        continue;
      }
      if (typeof filterMeta[this.metaOptions[key]] === 'object') {
        filterMeta[this.metaOptions[key]] = this.makeFilterMeta(filterMeta[this.metaOptions[key]]);
        const schema = filterMeta[this.metaOptions[key]];
        for (const skey in schema) {
          if (typeof schema[skey] === 'object') {
            schema[skey] = this.makeFilterMeta(schema[skey]);
          }
        }
      }
    }
    return filterMeta;
  }

  filterTypeCast(val) {
    if (typeof val === 'string' && val === 'null') {
      return null;
    }
    return val;
  }
}

module.exports = new FilterService()