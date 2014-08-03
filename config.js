angular.module('config', [])
.constant('DB_CONFIG', {
  name: 'DB',
  tables: [
    {
    name: 'places',
    columns: [
      {name: 'id', type: 'integer primary key'},
      {name: 'nome', type: 'text'},
      {name: 'telefone', type: 'integer'}
    ]
    }
  ]
});
