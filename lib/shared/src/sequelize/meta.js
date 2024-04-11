const s = require('sequelize');
const qs = require('sequelize/lib/sql-string');

const literalOptions = {
  literal: s.literal,
  tsQuery: (val) =>
    (Object.keys(val)[0] &&
      s.literal(
        `"${Object.keys(val)[0]}" @@ to_tsquery(${qs.escape(
          Object.values(val)[0].replace(new RegExp(' ', 'g'), '&'),
          null,
          'postgres'
        )})`
      )) ||
    null,
  websearchQuery: (val) =>
    (Object.keys(val)[0] &&
      s.literal(
        `"${Object.keys(val)[0]}" @@ websearch_to_tsquery(${qs.escape(
          Object.values(val)[0],
          null,
          'postgres'
        )})`
      )) ||
    null,
  fn: s.fn,
  col: s.col,
  cast: s.cast
};
const metaOptions = {
  adjacent: s.Op.adjacent,
  all: s.Op.all,
  and: s.Op.and,
  any: s.Op.any,
  between: s.Op.between,
  col: s.Op.col,
  contained: s.Op.contained,
  contains: s.Op.contains,
  endsWith: s.Op.endsWith,
  eq: s.Op.eq,
  gt: s.Op.gt,
  gte: s.Op.gte,
  iLike: s.Op.iLike,
  in: s.Op.in,
  iRegexp: s.Op.iRegexp,
  is: s.Op.is,
  like: s.Op.like,
  lt: s.Op.lt,
  lte: s.Op.lte,
  match: s.Op.match,
  ne: s.Op.ne,
  noExtendLeft: s.Op.noExtendLeft,
  noExtendRight: s.Op.noExtendRight,
  not: s.Op.not,
  notBetween: s.Op.notBetween,
  notILike: s.Op.notILike,
  notIn: s.Op.notIn,
  notIRegexp: s.Op.notIRegexp,
  notLike: s.Op.notLike,
  notRegexp: s.Op.notRegexp,
  or: s.Op.or,
  overlap: s.Op.overlap,
  placeholder: s.Op.placeholder,
  regexp: s.Op.regexp,
  startsWith: s.Op.startsWith,
  strictLeft: s.Op.strictLeft,
  strictRight: s.Op.strictRight,
  substring: s.Op.substring,
  values: s.Op.values
};

module.exports = { literalOptions, metaOptions };
