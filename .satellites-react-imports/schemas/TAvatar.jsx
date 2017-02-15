const {
    T:{createClass},
    t
}=require('imports/externals');

export default createClass ({
    typeName:'avatar',
    compose:({props:{Avatar}})=>({
        type:t.Any,
        options:{
            template: (locals)=>{
                return (
                    <div>
                        <span className="legend fieldset">avatar</span>
                        <Avatar name='sdjch' onChange={locals.onChange}/>
                    </div>
                )
            }
        }
    })
})