export default class AboutDev {
  constructor() {
    document.getElementById("back").addEventListener("click", () => {
      history.back();
    });
  }
}
let aboutDev = new AboutDev();