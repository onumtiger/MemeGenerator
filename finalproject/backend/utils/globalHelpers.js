// GLOBAL FUNCTION TO GET DATE
module.exports = {
    getTodayString: ()=>{
        let d = new Date();
        let day = `${d.getDate()}`.padStart(2, '0');
        let month = `${d.getMonth()+1}`.padStart(2, '0');
        let year = d.getFullYear();
        return `${year}/${month}/${day}`; //form: yyyy/mm/dd
    }
}