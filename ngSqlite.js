angular.module('ngSqlite', ['config'])
.factory('DB', function($q, DB_CONFIG) {
  var self = this;
  self.db = null;

  self.init = function() {
    if (window.sqlitePlugin) {
      self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
    } else if (window.openDatabase) {
      self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
    }
  };

  /*Transformar em funcao que cria tabela recebendo um JSON 
  angular.forEach(DB_CONFIG.tables, function(table) {
    var columns = [];

    angular.forEach(table.columns, function(column) {
      columns.push(column.name + ' ' + column.type);
    });
    var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
    self.query(query)
    .then(function(result) {
      console.log('Table "' + table.name + '" initialized.');
    }, function(error) {
      console.log(error);
    });
  });
  */

  self.query = function(query, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    self.db.transaction(function(transaction) {
      transaction.executeSql(query, bindings, function(transaction, result) {
        deferred.resolve(result);
      }, function(transaction, error) {
        deferred.reject(error);
      });
    });
    return deferred.promise;
  };

  self.fetchResult = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
     output.push(result.rows.item(i)); 
    }

    return output;
  };

  return self;
})

.factory('Document', function(DB) {
  var self = this;

  //escrever funcao find. se receber vazio ou objeto vazio retorna todos
  self.all = function(table) {
    return DB.query('SELECT * FROM ' + table)
    .then(function(result) {
      return DB.fetchResult(result);
    }, function(error) {
      return error;
    });
  };

  self.put = function(document, table) {
    var columns  = [];
    var values = [];
    var bindings = '';

    angular.forEach(document, function(value, key) {
      columns.push(key);
      values.push(value);
      bindings += bindings ? ',?' : '?';
    });
    var query = 'INSERT INTO ' + table  + ' (' + columns.join(', ') + ') VALUES (' + bindings + ')';
    return DB.query(query, values); 
  };

  return self;
});
