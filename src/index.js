import './personal_logo.jpg'
import './style.css'
import {Project, Portfolio, PortfolioController, PortfolioView} from './component.js'

if (storageAvailable("localStorage")) {
    console.log('Yippee! We can use localStorage awesomeness')

  } else {
    console.log('no local storage')
  }
  

let testportfolio = new Portfolio(crypto.randomUUID())
let testcontroller = PortfolioController(testportfolio)
testcontroller.AddProject(new Project('Default', crypto.randomUUID()))

testcontroller.AddProjectViewContainer('#detailbar', testcontroller.REGULAR)
testcontroller.AddProjectViewContainer('.projectbar-content', testcontroller.SMALL)

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
  