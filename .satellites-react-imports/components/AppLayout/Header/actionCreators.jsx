export const openCloseModalAT='appLayout.header.deleteAccountModal.changeShow';
export const openModalAC=()=>{
    return {
        type:openCloseModalAT,
        show:true
    }
};
export const closeModalAC=()=>{
    return {
        type:openCloseModalAT,
        show:false
    }
};