/**
 * remove class from an element
 * @param {id of element} id 
 * @param {class that should be removed} className 
 */

 export const removeClass = (id, className) => {
    let element = document.getElementById(id);
    element.classList.remove(className);
}