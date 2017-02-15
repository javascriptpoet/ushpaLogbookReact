Package.describe({
  name: 'jspoet:associations',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'relational layer for mongodb allowing reactive joins thru a predefined system of relationships between collections',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.3.1');
  api.use(['ecmascript','jspoet:mygadgets','aldeed:simple-schema','aldeed:collection2']);
  api.mainModule('main.js');
  Npm.depends({
    'filtr': '0.3.0',
  });
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jspoet:associations');
  api.mainModule('associations-tests.js');
});
                                                                                                                                      