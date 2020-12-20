export const removeClass = (id, className) => {
    let element = document.getElementById(id);
    element.classList.remove(className);
}