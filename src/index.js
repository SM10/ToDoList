import './personal_logo.jpg'
import './style.css'
import {Task, TaskView, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView, TaskController} from './component.js'

let testproject = new Project('', crypto.randomUUID())
let testcontroller = ProjectController(testproject)
let testview = ProjectView(testproject)

testcontroller.AddView(testview)

let container = document.querySelector('#detailbar')
container.appendChild (testview.GetNode())