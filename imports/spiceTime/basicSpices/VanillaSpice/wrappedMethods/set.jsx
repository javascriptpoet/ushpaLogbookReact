/*
sets el in elScope of this node
 */
export default ()=>()=>({self:{elScope,throwError}})=>(firstName,val)=> {
    if(!(firstName in elScope))throwError(`el ${firstName} not defined. can not set to ${val}`);
    elScope[firstName]=val
}