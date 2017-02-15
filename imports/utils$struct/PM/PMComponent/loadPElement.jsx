/*
member method of pMElement
@method loadPElement({pElement})
    after screens been fed a PComponent and composed all their pElements into the last one, representing the  entire
    permission tree of this pM, this func is used to install/connect/update them with/into/to this instance of PM - pM

    @Params
    pElement {instanceof pMElement#PComponent}
 */
export default ({
    T:{createTClass},
})=>({pElement})=>{
    this.pElement=pElement;

    //propagate downstream and setup all pElement objects
    //this is to compose props that will not change at run time cos permission structure will not.
    //build path into state for each pElement
    pElement.treeWalker({
        onEachNode:({current:{name},parrent:{path}})=>{
            current.path = `${path}${path ? '' : '.'}${name}`;
        }
    })({parent:{}});

    //build TType of config form for each pElement
    pElement.treeWalker({
        onBranchNode:({current:{getChildren,template}})=>{
            const getTChildren=(what)=>({childPElement,name})=>childPElement.TType[what];
            current.TType=createTClass({
                compose(){
                    return {
                        type:t.struct(getTChildren('type')),
                        options:{
                            template,
                            fields:getTChildren('options')
                        }
                    }
                }
            })
        }
    })({parent:{}});

    //build default permission tree for each pElement
    pElement.treeWalker({
        onPermissionNode:({current})=>{
            current.defaultPermissions=current.permissionFunc
        },
        onEachNode:({current})=>{
            const {getChildren}=current;
            current.defaultPermissions=getChildren({
                getChild:({childPElement:{defaultPermissions}})=>defaultPermissions
            })
        }
    })({parent:{}});
};
