export default ()=>()=>({self:{path}})=>(msg)=>{
    throw new Meteor.Error('spiceTime',`${path.join('/')}: ${msg}`)
}