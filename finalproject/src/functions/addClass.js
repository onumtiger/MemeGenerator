/**
 * add class to an element
 * @param {id of element} id 
 * @param {class that should be added} className 
 */

export const addClass = (id, className) => {
    let element = document.getElementById(id);
    element.classList.add(className);
}