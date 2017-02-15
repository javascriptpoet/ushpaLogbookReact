const externals=require('./externals');
const utils=require('./utils')({externals});
const {getLocalScope}=require('./bootstrap$val')({externals});
const {config}=getLocalScope()

