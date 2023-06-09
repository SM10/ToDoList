import './personal_logo.jpg'
import './style.css'
import {Project, Portfolio, PortfolioController, PortfolioView} from './component.js'

//localStorage.clear()

let testportfolio = new Portfolio(crypto.randomUUID())
let testcontroller = PortfolioController(testportfolio)

testcontroller.AddProjectViewContainer('#detailbar', testcontroller.REGULAR)
testcontroller.AddProjectViewContainer('.projectbar-content', testcontroller.SMALL)

if(storageAvailable("localStorage")){
  testcontroller.LoadData()
}

let addprojectbutton = document.querySelector('#add-project-button')
addprojectbutton.addEventListener('click', () => {
    testcontroller.AddProject(new Project('', crypto.randomUUID()))
}, false)


function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}