/*
given full name of an el (either module or naked) creates spiceNode for it of the spice
specified in its name. after the node is instantiated it gets refined with instance props (like additional ticks).
There are many opportunities provided for defining/refining nodes/types
this func is called by declareEl
 */
export default ({makeSTScope})=>({parentScope})=>({self:pSpiceNode})=>({isStructured})=>({fullName})=>{
    const {
        typeScope:pTypeScope,
        constructor:pConstructor,
        children:pChildren,
        spiceScope:pSpiceScope,
        throwError,
        flavor:{spiceName:spiceInParent}
    }=pSpiceNode;
    const {FullName}=makeSTScope({dirPath: './basicSpices/VanillaSpice/wrappedMethods', parentScope});
    const {firstName,spiceName:spiceInName}=fullNameObj = new FullName({fullName});

    //spice is inherited from parent if not specified by name and defaults to vanillaSpice if needs be
    const spiceName=(spiceInName?spiceInName:spiceInParent) || 'vnilla';
    if(!(spiceName in pSpiceScope))throwError(`rotten spice in el name ${fullName}`);
    pChildren[firstName]=new pSpiceScope[spiceName]({pSpiceScope,fullName,isStructured

    })
}