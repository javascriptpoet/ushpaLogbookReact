export default ({makeSTScope,
    utils:{SelfBinder}
})=>({parentScope})=>{
    const {wrappedMethods,constructor}=makeSTScope({dirPath:'./basicSpices/VanillaSpice',parentScope});
    return class VanillaSpice extends SelfBinder {
        constructor(props) {
            super();
            addWrappedMethods({wrappedMethods});
            constructor({self:this})(props)
        }
    }
}