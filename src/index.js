import './personal_logo.jpg'
import './style.css'
import EventHandler from './handler.js'
import {Task, TaskView, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView} from './component.js'

const EVENT_CLICK = 'click'
const EVENT_PROJECT_ADDED = 'project added'
const EVENT_TASK_ADDED = 'task added'
const EVENT_PROJECT_REMOVED = 'project removed'
const EVENT_TASK_REMOVED = 'task removed'


let eventhandler = EventHandler()
let addproject = document.querySelector('#add-project-button')
addproject.addEventListener(EVENT_CLICK, (event) => {
    eventhandler.trigger(EVENT_PROJECT_ADDED, event)
}, false)


let port = new Portfolio('main')
let portcontroller = PortfolioController(port)
let portview = PortfolioView(port)




let container = document.querySelector('#detailbar')

container.appendChild(portview.RegularView())

let defaultProject = new Project('Default')

