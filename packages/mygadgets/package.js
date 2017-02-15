Package.describe({
  name: 'jspoet:mygadgets',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.3.1');
  api.use([
    'ecmascript',
    'mdg:validated-method',
    'tunifight:loggedin-mixin',
    'ziarno:provide-mixin',
    'ziarno:restrict-mixin',
    'didericis:permissions-mixin',
    'aldeed:simple-schema',
    'meteorhacks:subs-manager'
  ]);
  Npm.depends({
    'object-path': '0.11.1',
  });
  api.mainModule('my-gadgets.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jspoet:mygadgets');
  api.mainModule('my-gadgets-tests.js');
});
