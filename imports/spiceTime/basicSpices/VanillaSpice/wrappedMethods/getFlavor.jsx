/*
generates flavor built into the spice.
all flavors can be overriden on the instance thru el name
NOTE that it generates spiceName and that is not overriden unless a new spice is declared based on the existing one
 */
export default ()=>()=>({self})=>()=>({spiceName:'vnilla'})