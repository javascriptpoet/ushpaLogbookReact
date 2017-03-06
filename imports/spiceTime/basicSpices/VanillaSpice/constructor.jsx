//TODO handle isStructured,finish declareEl,handle isComp,handle spiceName and getFlavor by declareSpice
export default ({makeSTScope,
    externals:{},
    utils:{SelfBinder,getLocalFiles}
})=>({parentScope})=>({self:{
    throwError,
    declareSpice,
    getFlavor
}})=>{
    const {FullName,basicSpices,LocalFiles}=makeSTScope({dirPath:'./basicSpices/VanillaSpice',parentScope});
    return ({
        externals,
        require:rootRequire,
        isStructured,
        pSpiceNode={
            path:[],
            spiceScope:basicSpices,
            typesScope:{},
            elScope:{}
        },
        moduleName,
        defineSpices=()=>{}
    })=>{
        const {
            rootRequire:pRootRequire,
            path:pPath,
            spiceScope:pSpiceScope,
            typesScope:pTypesScope,
            elScope:pElScope
        }=pSpiceNode;

        //every time new rootRequire is passed, a sandbox scope is formed
        if(rootRequire){
            this.rootRequire=rootRequire,
                this.LocalFiles=getLocalFiles({rootRequire})
        }
        const {
            path,
            fullName,
            firstName,
            flavor,
            spiceScope
        }=Object.assign(this,{
            isStructured,
            path:pPath.push(this.fullName.firstName),
            spiceScope:Object.create(pSpiceScope),
            //name overrides flavor of spice
            ...(()=>{
                const {flavor:nameFlavor,firstName,fullName}=new FullName({name:moduleName});
                return {firstName,fullName,
                    flavor:Object.assign(getFlavor(),nameFlavor)
                }
            })(),
        });
        const strPath=path.join('/');
        if(!pPath.length && !rootRequire)throwError('require must be provided at top level');
        const localFiles=new LocalFiles({rootRequire})({dirPath:strPath});

        /*First system tick - spiceTick
         spiceScope is constructed. New spices can be declared by first usage in module name or by $spice
         modules. Their can be many, one module per spice. defineSpices can define declared spices but can not declare,
         mostly for visibility reasons If spices are declared by $spice files up scope from first usage, the order of $spice
         importation is not guaranteed. defineSpices func should be used to control composition then.
         */
        //declare all new spices advertized by $spice files and usage in module names
        const newSpices=localFiles.map(({reducing:spiceFiles,fileName,require})=>{
            const {nameType,spiceName}=new FullName({name:fileName});
            if(nameType==='newSpice' || nameType==='el')if(!spiceScope[spiceName]){
                declareSpice(spiceName);
                return spiceName
            }
        });
        /*now we can define what we declared. definitions are granular and sequence does not matter
         spices can be defined in $spice files as well as in defineSpices where deps can be handled better
         */
        const defineSpicesProps={spiceScope,
            scopeMe:(func)=>func(spiceScope)
        };
        defineSpices(defineSpicesProps);
        newSpices.forEach((spice)=>{!!spice && rootRequire(strPath)({...defineSpicesProps,declareSpice})});

        /*Second system tick - defineTick
         all el types are defined. el types are speices of spices - one of the spice classes in scope
         so, they are all declared by now. Again, sequence of definition does not matter. A type can be refined
         many times anywhere downscope and upscope, any place after spice declaration been made. Its the spice
         class that will be refined, then, a module aquires that type of spice by using its name in its name (pun intented)
         */

    }
}