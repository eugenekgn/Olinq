var Olinq = function () {
  'use strict'
};



Olinq.prototype = function () {
  var queryBuilder = '',
  clear = function () {
    queryBuilder = '';
  },
  from = function (objectName) {
    queryBuilder += (objectName + '?');
    return this;
  },
  // param: parameter, use "Parent/Child" relationship for to search for children elements
  // operator: 
  //    eq   – Equal to 
  //    ne   – Not equal to 
  //    lt   – Less than 
  //    le   – Less than or equal to 
  //    gt   – Greater than 
  //    ge   – Greater than or equal to
  //    endswith - endswith 
  //    nend - Not Ends with
  //    substringof - substringof
  // value: value to compare
  where = function (param, operator, value) {
    if (!param) {
      throw 'param is null or empty';
    }
    if (!operator) {
      throw 'param is null or empty';
    }
    if (!value) {
      throw 'value is null or empty';
    }

    if (queryBuilder.indexOf('$filter') == -1) {
      queryBuilder += '$filter=';
    }

    switch (operator) {
      case 'eq':
      case '=':
        queryBuilder += (param + ' eq ' + applyAlphaWrapper(value));
        break;
      case 'ne':
      case '!=':
        queryBuilder += (param + ' ne ' + applyAlphaWrapper(value));
        break;
      case 'gt':
      case '>':
        queryBuilder += (param + param + ' gt ' + applyAlphaWrapper(value));
        break;
      case 'ge':
        queryBuilder += (param + ' ge ' + applyAlphaWrapper(value));
        break;
      case 'lt':
      case '<':
        queryBuilder += (param + ' ne ' + applyAlphaWrapper(value));
        break;
      case 'nend':
        queryBuilder += ('not endswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      case 'substringof':
        queryBuilder += ('substringof(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      case 'substringof':
        queryBuilder += ('endswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      case 'startswith':
        queryBuilder += ('startswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      default:
        throw 'Invalid operator provided';
    };

    return this;
  },
  and = function () {
    queryBuilder += ' and ';
    return this;
  },
  or = function () {
    queryBuilder += ' or ';
    return this;
  },
    //The maximum number of items returned in the result set for each page.
  take = function (num) {
    checkIfEndsWithAmp(true);
    queryBuilder += '$top=' + num;
    return this;
  },
  //The number of rows to skip in the result set before beginning to return results.
  skip = function (num) {
    checkIfEndsWithAmp(true);
    queryBuilder += '$skip=' + num;
    return this;
  },
  // direction: desc or asc
  orderby = function (param, direction) {
    checkIfEndsWithAmp(true);
    queryBuilder += '$orderby=' + param + ' ' + direction;
    return this;
  },
  select = function (value) {
    checkIfEndsWithAmp(true);
    queryBuilder += '$select=';
    if (value instanceof Array) {
      queryBuilder += arrayToCommaSeparatedValues(value);
    }
    else {
      queryBuilder += value;
    }
    return this;
  },
  expand = function (value) {
    checkIfEndsWithAmp(true);
    queryBuilder += '$expand=';
    if (value instanceof Array) {
      queryBuilder += arrayToCommaSeparatedValues(value);
    }
    else {
      queryBuilder += value;
    }
    return this;
  },
  toString = function () {
    var res = queryBuilder;
    queryBuilder = '';
    return res;
  };
  //private methods
  var checkIfEndsWithAmp = function (add) {
    var strSize = queryBuilder.length - 1;
    if (queryBuilder[strSize] != '?' && queryBuilder[strSize] != '&' && add) {
      queryBuilder += '&';
    }
  },
  arrayToCommaSeparatedValues = function (arr) {
    var values = '';
    for (var i = 0; i < arr.length; i++) {
      values += arr[i] + ',';
    }

    return values.substring(0, values.length - 1);
  },
  applyAlphaWrapper = function (value) {
    if (isNaN(value)) {
      return '\'' + value + '\'';
    }
    return value;
  };

  return {
    and: and,
    clear: clear,
    expand: expand,
    from: from,
    or: or,
    orderby: orderby,
    select: select,
    skip: skip,
    take: take,
    top: take,
    toString: toString,
    where: where
  }
}();

