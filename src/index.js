import './personal_logo.jpg'
import './style.css'
import {Task, TaskView, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView, TaskController} from './component.js'

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