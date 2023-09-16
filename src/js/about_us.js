export default class AboutUs{
    constructor(){
        document.getElementById("back").addEventListener("click",()=>{
            history.back();
        });
    }
}
let aboutDev = new AboutUs();