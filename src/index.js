import './personal_logo.jpg'
import './style.css'
import {Project, Portfolio, PortfolioController, PortfolioView} from './component.js'

let testportfolio = new Portfolio(crypto.randomUUID())
let testcontroller = PortfolioController(testportfolio)
testcontroller.AddProject(new Project('Default', crypto.randomUUID()))
let testview = PortfolioView(testcontroller.GetID())

testcontroller.AddView(testview)

let container = document.querySelector('#detailbar')
container.appendChild (testview.GetNode())

let addprojectbutton = document.querySelector('#add-project-button')
addprojectbutton.addEventListener('click', () => {
    testcontroller.AddProject(new Project('', crypto.randomUUID()))
}, false)