const externals=require('./externals');
const utils=require('./utils')({externals});
const createScope=require('./bootstrap$val')({externals});

/* an ultimate one liner?
We are creating the top scope of our app. The app func is in the scope as a func and it gets executed. no return
value is expected.
 */
createScope({globals:{require, utils}})({parent:{}})({}).App();

