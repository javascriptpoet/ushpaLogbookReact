export default ({scope:{
    externals:{
        reactAddonsTestUtils:{
            isElement,
            isElementOfType,
            isDOMComponent,
            isCompositeComponent,
            isCompositeComponentWithType,
        },
        t
    }
}})=>new class {
    constructor(){
        this.ReactElementOfType=t.irreducible('ReactElementOfType',(ReactType)=>(v)=>isElementOfType(ReactType,v));
        this.DOMComponent=t.irreducible('DOMComponent',(v)=>isDOMComponent(v));
        this.ReactCompositeComponent=t.irreducible('ReactCompositeComponent',(v)=>isCompositeComponent(v));
        this.ReactCompositeComponentWithType=t.irreducible('ReactCompositeComponentWithType',(ReactType)=>(v)=>isCompositeComponentWithType(ReactType));
        this.TClassComponent=t.irreducible('TClassComponent',(v)=>T.Component.isPrototypeOf(v));
        this.TElement=t.irreducible('TElement',(v)=>{
            t.struct({
                type:t.Function,
                options:t.maybe(t.struct)
            }).is(v)
        });
        this.TObjectComponent=t.irreducible('TObjectComponent',(v)=>{this.TElement.is(v)});
        this.TComponent=t.irreducible('TComponent',(v)=>(this.TObjectComponent.is(v) || this.TClassComponent.is(v)));
    }
}


