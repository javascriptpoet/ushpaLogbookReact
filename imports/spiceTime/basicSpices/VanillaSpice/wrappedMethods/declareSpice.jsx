/*
 New spices can be declared by first usage in module name or by $spice
 modules. Their can be many, one module per spice. defineSpices can define declared spices but can not declare,
 mostly for visibility reasons If spices are declared by $spice files up scope from first usage, the order of $spice
 importation is not guaranteed. defineSpices func should be used to control composition then.
 */
/*declare all new spices advertized by $spice files and usage in module names
 $spice modules can be files or folders like any other modules. Their purpose is to generate a new spice and not
 much else. They get an additional system wrapper/tick - spiceTick with spiceScope and a few utils to generate new spice.
 they do not get runTicked like other modules. the spiceNode they generate at defineTick is used as a receipe for
 the spice class they generate. The only files that matter inside $spice folders are $tick files. them and the execution
 sequence provided in the index file. THAT IS IN THE FUTURE IF NEEDED.
 For now, they are all unstructured files full of ticks bunched together by declareSpice func they get in the spiceTick wrapper.
 */
/*
the name prop can carry info for definition. we oblige and use that info to partially define spice
in this case its extendee spice
 */
export default ({makeSTScope})=>({parentScope})=>({self:{
    spiceScope
}})=>(name)=>{
    const {FullName}=makeSTScope({dirPath:'./basicSpices/VanillaSpice/wrappedMethods',parentScope});
    const {firstName:newSpicename,extendeeSpiceName}=new FullName({name});
    if(spiceScope[newSpiceName])throwError(`spice ${newSpiceName} already declared within scope`);
    if(extendeeSpiceName){
        const extendeeSpice=spiceScope[extendeeSpiceName];
        if(!extendeeSpice)throwError(`can not declare spice ${newSpiceName}. extendee ${extendeeSpiceName} not in spiceScope`);
        return class extends extendeeSpice{
            getSpiceName(){return newSpiceName}
        }
    };
    return
    const newSpice=declareSpice(moduleName);
    if(extendee)newSpice.define({extendee})
}