function Task(title) {
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.project = null
}

const TaskView = (task) => {
    const CreateNode = function(task, propertyname, inputtype){
        let node = document.createElement(inputtype)
        node.textContent = task[propertyname]
        node.className = 'task-' + propertyname
        return node
    }

    const CreateRadioButton = function(task, priority){

    }

    const RegularView = (task) => {
        let card = document.createElement('div')
        card.className = 'task-card'
        
        let form = document.createElement('form')
        form.className = 'task-form'
        card.appendChild(form)

        form.appendChild(CreateNode(task, 'title', 'input'))
        form.appendChild(CreateNode(task, 'description', 'input'))
        form.appendChild(CreateNode(task, 'dueDate', 'date'))
        form.appendChild(CreateRadioButton(task, task.priority))

    }
    const SidebarView = (task) => {

    }
    return {RegularView, SidebarView}
}

function Project(name){
    this.tasks = []
    this.name = name
}

const ProjectView = (project) => {
    const RegularView = (project) => {

    }
    const SidebarView = (project) => {

    }
    return {RegularView, SidebarView}
}

const ProjectController = (project) => {
    const AddTask = (task) => {
        project.task.push(task)
    }
    const RemoveTaskByObject = (task) => {
        for(let i = 0; i < project.tasks.length; i++){
            if(project.tasks[i] === task) {project.tasks.splice(i, 0)}
        }
    }
    const RemoveTaskByIndex = (index) =>{
        project.tasks.splice(index,0)
    }

    return {AddTask, RemoveTaskByObject, RemoveTaskByIndex}
}