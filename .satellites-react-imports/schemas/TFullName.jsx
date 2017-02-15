const {
    T:{createClass},
    t
}=require('imports/externals');

export default createClass ({
    typeName: 'fullName',
    compose: ()=>({
        type:t.struct({
            firstName: t.String,
            middleName: t.String,
            lastName: t.String
        }, 'FullName'),
        options:{
            legend: <span>hey</span>,
            fields:{
                firstName:{
                    label:'hello'
                }
            }
        }
    })
})
