var Olinq = function () {
  'use strict'
};


Olinq.prototype = function () {
  var queryBuilder = '',
  whereCondition = '',
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
  //    not endswith - Not Ends with
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

    if (whereCondition.indexOf('$filter') == -1) {
      whereCondition += '$filter=';
    }

    var collection = param.split(',');
    var conditionals = '';
    if(collection.length > 0){
       console.log('col' + collection);
       param = collection[0];
       for (var i=1; i<collection.length; i++)
       { 
          // pad number of letter
          var col = collection[i].split(' ');
          col[2] = applyAlphaWrapper(col[2]);
          console.log(col);  
          collection[i] = col[0] + ' ' + col[1] + ' ' + col[2];
          conditionals += (' and c/' + collection[i]);
       }
     }

    // check for nested objects
    collection = param.split('.');
    if(collection.length > 1){
      param = ' c/' + collection[1] + ')' + conditionals;
      whereCondition += (collection[0] + '/any(c: ');
    }

    whereBuilder(param, operator, value);
    return this;
  },
  and = function () {
    whereCondition += ' and ';
    return this;
  },
  or = function () {
    whereCondition += ' or ';
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
  // direction: desc or as
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

    if (whereCondition.match(" and $")) {
      whereCondition = whereCondition.substring(0, whereCondition.length - 5);
    }
    else if (whereCondition.match(" or $")) {
      whereCondition = whereCondition.substring(0, whereCondition.length - 4);
    }
    var res = queryBuilder + ((queryBuilder.length > 0) ? "&" : "") + whereCondition;

    queryBuilder = whereCondition = '';

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
  },
  whereBuilder = function(param, operator,value){
        switch (operator) {
      case 'eq':
      case '=':
        whereCondition += (param + ' eq ' + applyAlphaWrapper(value));
        break;
      case 'ne':
      case '!=':
        whereCondition += (param + ' ne ' + applyAlphaWrapper(value));
        break;
      case 'gt':
      case '>':
        whereCondition += (param + param + ' gt ' + applyAlphaWrapper(value));
        break;
      case 'ge':
        whereCondition += (param + ' ge ' + applyAlphaWrapper(value));
        break;
      case 'lt':
      case '<':
        whereCondition += (param + ' ne ' + applyAlphaWrapper(value));
        break;
      case 'notendswith':
        whereCondition += ('not endswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      case 'substringof':
        whereCondition += ('substringof(' + applyAlphaWrapper(value) + ',' + param + ')');
        break;
      case 'substringof':
        whereCondition += ('endswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      case 'startswith':
        whereCondition += ('startswith(' + param + ',' + applyAlphaWrapper(value) + ')');
        break;
      default:
        throw 'Invalid operator provided ( ' + operator + ' )';
      }
    
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


