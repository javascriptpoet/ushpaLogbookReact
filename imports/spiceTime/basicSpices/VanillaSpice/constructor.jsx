//TODO handle isStructured,finish declareEl,handle isComp,handle spiceName and getFlavor by declareSpice
export default ({makeSTScope,
    externals:{},
    utils:{SelfBinder,capitalizeFirst}
})=>({parentScope})=>({self:{
    throwError, getFlavor, getTickNames, getSpiceName,getTicks
}})=>{
    const {
        FullName,basicSpices,LocalFiles
    }=makeSTScope({dirPath:'./basicSpices/VanillaSpice',parentScope});
    const nf=()=>{};
    return ({externals,isStructured,moduleName,
        require:rootRequire,
        pSpiceNode={
            path:[],
            spiceScope:basicSpices,
            typesScope:{},
            elScope:{}
        },

        /*
        the pattern is to declare everything on the first declare tick, then, make declared entities available
        to definition tick wherever these definitions are made. The options are by these funcs below, by files
        in the local folder or by a special define folder ($def) (that will be supported later) or a combo of all.
        els and spices are partially defined (at least the basic type with attrs to be filled later) at declare time
        by name tokens (var or module names). these partial definitions are available to everybody at define time to
        help resolve circular deps.
         */
        declareSpices=nf,
        defineSpices=nf,
        declareEls=nf,
        defineEls=nf,

        /*This is a bit different. Some of the ticks are declared and defined on prototype/spice/class
        it works the same way. All declared tick names are made available to all defining funcs, so, even
        proto ticks know what the local ticks are and their sequence but they can not compose themselves with local
        ticks. At define time, local ticks are aware of proto ticks and all defined ticks become available to future
        ticks in sequence.
         */
        declareTicks:declareLocalTicks=nf,
        defineTicks:defineLocalTicks=nf
    })=>{
        const {
            rootRequire:pRootRequire,
            firstNamePath:pFirstNamePath,
            fullNamePath:pFullNamePath,
            spiceScope:pSpiceScope,
            typesScope:pTypeScope,
            elScope:pElScope,
            spiceName:pSpiceName
        }=pSpiceNode;
        const {
            fullName,firstName,flavor,spiceScope,typesScope,elScope,tickNames,ticks,spiceName,timeline
        }=Object.assign(this,{
            isStructured,
            spiceScope:Object.create(pSpiceScope),
            typeScope:Object.create(pTypeScope),
            elScope:Object.create(pElScope),
            //name overrides flavor of spice
            ...(()=>{
                //NOTE module name will always be el type
                const {flavor:nameFlavor,firstName,fullName,spiceName}=new FullName({name:moduleName});
                return {firstName,fullName,
                    //if spice of el is not specified by name token, it gets inherited from parent
                    spiceName:spiceName || pSpiceName,
                    flavor:Object.assign(getFlavor(),nameFlavor)
                }
            })(),
            spiceName:getSpiceName(),
            /*tick names get declared first, then they defined by tick funcs
            we are starting in timely fashion with proto ticks
             */
            timeline:{
                tickNames:getTickNames(), //this is from proto as part of declaring tick names
                ticks:{}
            }
        });
        const extendPath=(pPath,myName)=>`}${pPath}${pPath?'/':''}${myName}`;
        const {firstNamePath,fullNamePath}=Object.assign(this,{
            firstNamePath:extendName(pFirstNamePath,firstName),
            fullNamePath:extendName(pFullNamePath,fullName),
        });
        if(!pPath.length && !rootRequire)throwError('require must be provided at top level');
        const localModules=new LocalModules({rootRequire})({fullNamePath});
        
        /*First system tick - declare
         spiceScope,typesScope and elScope are constructed.
         */
        localModules.forEach(({moduleName,require,isDir})=>{
            const {type,firstName}=new FullName({name:moduleName});
            if((type==='spice' || (type==='tick')) && isDir) throwError(`${type} ${firstName} is being defined by a folder. only unstructured files are currently supported`);
            this[`declare${capitalizeFirst(type)}`](moduleName)
            switch(type){
                case 'spice':

                    if(isDir) throwError(`spice ${firstName} is being defined by a folder. only unstructured files are currently supported`);
                    if(spiceScope[firstName])throwError(`spice ${firstName} already declared within scope`);
                    const {extendeeSpice}=otherNameAttrs;
                    if(!spiceScope[extendeeSpice])throwError(`can not declare spice ${firstName}. extendee ${extendeeSpice} not in spiceScope`);
                    /*this will create an initial vnilla spice
                    if extendee token is specified in file name, a partial refinement will be made.
                    additional ticks can be inserted inside spice file
                     */
                    const newSpice=declareSpice(moduleName);
                    if(extendee)newSpice.define({extendee})
                    break;
                case 'el':
                    /*
                    of course, we declare new el, but, if its of a new spice, we declare that as well
                    it can be defined later in defineSpices user supplied func. It defaults to vanilla spice
                     */
                    const {flavor,spiceName}=otherNameAttrs;
                    if(!spiceScope[spiceName])declareSpice(spiceName);
                    declareEl(moduleName);
                    break;
                case 'tick':
                    /*order of ticks;
                    proto ticks
                    from $tick files defined by their seq number in name token
                    ticks defined by getTimeline in index file
                    ticks of the same name are not allowed. If you want to extend a tick func, just insert another
                    tick right after it. This keeps everything granular and composable.
                    a kill token can be inserted into tick file to disable the tick. It still be visible in scope and available
                    for composition. $hide takes care of that
                     */
                    //if seq not in the name,tick is concatted to the end of array even if there are holes
                    //if seq is wrong,tick names can not be redefined.it throws
                    const {seq}=otherNameAttrs;
                    declareTick(moduleName);
                    break;
            }
        });

        /*now we can define what we declared. definitions are granular and sequence does not matter
         spices can be defined in $spice files as well as in defineSpices where deps can be handled better
         same pattern for timeline and types
         */
        localModules.forEach(({moduleName,require,isDir})=>{
            const {type,firstName,...otherNameAttrs}=new FullName({name:moduleName});
            switch(type){
                case 'spice':
                    require(fullName)({
                        //defineSpice wrapper/tick
                        spiceScope,
                        [`define${capitalizeFirst(spiceName)}spice`]:spiceScope[spiceName].define({FullName})
                    })({
                        //defineType wrapper. now you can compose spice with ticks hanging off spice classes and any instance ticks
                        //defined on nodes/types/instances of spice classes
                        typeScope
                    })
                    break;
                case 'el':
                    /*
                     of course, we declare new el, but, if its of a new spice, we declare that as well
                     it can be defined later in defineSpices user supplied func. It defaults to vanilla spice
                     */
                    const {flavor,spiceName}=otherNameAttrs;
                    if(!spiceScope[spiceName])declareSpice(spiceName);
                    declareEl(fullName);
                    break;
                case 'tick':
                    /*order of ticks;
                     proto ticks
                     from $tick files defined by their seq number in name token
                     ticks defined by getTimeline in index file
                     ticks of the same name are not allowed. If you want to extend a tick func, just insert another
                     tick right after it. This keeps everything granular and composable.
                     a kill token can be inserted into tick file to disable the tick. It still be visible in scope and available
                     for composition. $hide takes care of that
                     */
                    const {seq}=otherNameAttrs;
                    //if seq not in the name,tick is concatted to the end of array even if there are holes
                    //if seq is wrong,tick names can not be redefined.it throws
                    declareTick(fullName);
                    break;
            }
        });


        //NOTE this will iterate only thru locals - object own props
        spiceScope.forEach(
            //spices are defined inside spice files by a namelocked function
            ({spiceType,spiceName})=>require(moduleName)({
                //defineSpice wrapper/tick
                spiceScope,
                [`define${capitalizeFirst(spiceName)}spice`]:spiceScope[spiceName].define({FullName})
            })({
                //defineType wrapper. now you can compose spice with ticks hanging off spice classes and any instance ticks
                //defined on nodes/types/instances of spice classes
                typeScope
            })
        );
        defineSpices({spiceScope,
            scopeMe:(func)=>func(spiceScope,typesScope)
        })

        /*second system tick - defineTypes

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