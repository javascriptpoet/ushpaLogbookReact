export default ({scope:{
    externals:{
        meteor:{
            _
        }
    },
    vars:{
        toArray
    }
}})=>(stylings)=>{
    const res=_.reduce(
        toArray(stylings),
        (memo,styling)=>{
            let style={},className=[],otherStyles={};
            if(typeof styling === 'object') 
                ({style, className, ...otherStyles} = styling);
            else
                //better be a string or array of strings
                className=styling
            Object.assign(memo.style,otherStyles);
            memo.className.push(toArray(className));
            return memo;
        },
        {
            className:[],
            style:{}
        }
    )
}
    
