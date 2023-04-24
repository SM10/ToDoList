function Task(title) {
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.project = null
    this.iscomplete = null
}

const TaskView = (task, id) => {
    const innerviews = {
        title : null,
        description : null,
        dueDate : null,
        high : null,
        normal : null,
        low : null,
        notes : null,
        savebutton : null,
        deletebutton : null,
        iscomplete: null
    }

    let savefunction = null
    let deletefunction = null

    const CreateNode = function(task, propertyname, inputtype){
        let ret = document.createElement('div')
        ret.className = 'inputholder'

        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + propertyname + '-' + id)

        innerviews[propertyname] = document.createElement('input')
        innerviews[propertyname].type = inputtype
        innerviews[propertyname].textContent = task[propertyname]
        innerviews[propertyname].name = propertyname
        innerviews[propertyname].className = 'task-' + propertyname
        innerviews[propertyname].id = 'task-' + propertyname + '-' + id

        ret.appendChild(label)
        ret.appendChild(innerviews[propertyname])

        return ret
    }

    const CreateRadio = function(propertyname, value){
        let ret = document.createElement('div')
        ret.className = 'radioholder'

        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + value + '-' + id)

        innerviews[value] = document.createElement('input')
        innerviews[value].textContent = value
        innerviews[value].value = value
        innerviews[value].name = propertyname
        innerviews[value].className = 'task-' + value + '-' + id

        ret.appendChild(innerviews[value])
        ret.appendChild(label)

        return ret
    }

    const CreateSaveButton = function(formid){
        innerviews.savebutton = document.createElement('button')
        innerviews.savebutton.textContent = 'Save'
        innerviews.savebutton.className = 'task-save'
        innerviews.savebutton.type = 'button'
        innerviews.savebutton.form = formid
        innerviews.savebutton.addEventListener('click', savefunction, false)
        
        return innerviews.savebutton
    }

    const OnSaveButtonClickedListener = function(onSaveButtonClicked){
        innerviews.savebutton.removeEventListener('click', savefunction, false)
        savefunction = onSaveButtonClicked
        innerviews.savebutton.addEventListener('click', onSaveButtonClicked, false)
    }

    const CreateDeleteButton = function(formid){
        innerviews.deletebutton = document.createElement('button')
        innerviews.deletebutton.textContent = 'Delete'
        innerviews.deletebutton.className = 'task-delete'
        innerviews.deletebutton.type = 'button'
        innerviews.deletebutton.form = formid
        return innerviews.deletebutton
    }

    const OnDeleteButtonClickedListener = function(onDeleteButtonClicked){
        innerviews.deletebutton.removeEventListener('click', deletefunction, false)
        deletefunction = onDeleteButtonClicked
        innerviews.deletebutton.addEventListener('click', deletefunction, false)
    }

    const RegularView = () => {
        let card = document.createElement('div')
        card.className = 'task-card task-regular-card'
        card.id = id + '-regular-card'
        
        let form = document.createElement('form')
        form.className = 'task-form'
        form.id = id
        card.appendChild(form)

        form.appendChild(CreateNode(task, 'title', 'text'))
        form.appendChild(CreateNode(task, 'description', 'text'))
        form.appendChild(CreateNode(task, 'dueDate', 'date'))
        form.appendChild(CreateRadio(task, 'priority', 'high'))
        form.appendChild(CreateRadio(task, 'priority', 'normal'))
        form.appendChild(CreateRadio(task, 'priority', 'low'))
        form.appendChild(CreateNode(task, 'notes', 'text'))
        form.appendChild(CreateNode(task, 'iscomplete', 'checkbox'))
        form.appendChild(CreateSaveButton(form.id))
        form.appendChild(CreateDeleteButton(form.id))

        return card
    }
    const SidebarView = () => {
        let card = document.createElement('div')
        card.className = 'task-card task-side-card'
        card.textContent = task.title
        card.id = id + '-side-card'

        return card
    }
    return {RegularView, SidebarView, OnSaveButtonClickedListener, OnDeleteButtonClickedListener}
}

function Project(name){
    this.tasks = []
    this.name = name

    function GetTaskId(task){
        for (let i = 0; i < this.tasks.length; i++){
            if(this.tasks[i] == task) {return i}
        }
        return null
    }

    function AddTask(task){
        this.tasks.push(task)
    }

    function RemoveTaskByObject(task){
        for(let i = 0; i < this.tasks.length; i++){
            if(this.tasks[i] === task) {this.tasks.splice(i, 0)}
        }
    }

    function RemoveTaskByIndex(index){
        this.tasks.splice(index,0)
    }
}

const ProjectView = (project, id) => {

    const RegularView = () => {
        let projectpage = document.createElement('div')
        projectpage.classname = 'project-regular-card'
        projectpage.id = project + '-' + id + '-page'
        
        let projecttitle = document.createElement('div')
        projecttitle.textContent = project.name
        projectpage.appendChild(projecttitle)

        let addtaskbutton = document.createElement('button')
        addtaskbutton.textContent = 'Add Task'
        addtaskbutton.className = 'add-task-button project-lv-button'
        addtaskbutton.id = project + '-' + id + '-add-task'
        projectpage.appendChild(addtaskbutton)

        let deleteproject = document.createElement('button')
        deleteproject.textContent = 'Delete Project'
        deleteproject.className = 'add-task-button project-lv-button'
        deleteproject.id = project + '-' + id + '-delete-project'
        projectpage.appendChild(deleteproject)

        let expandicon = document.createElement('img')
        expandicon.className = 'project-lv-icon'
        expandicon.id = project + '-' + id + '-expand-project'
        projectpage.appendChild(expandicon)

        project.tasks.forEach((task)=>{
            projectpage.appendChild(TaskView(task).RegularView())
        })

        return projectpage
    }

    const SidebarView = () => {
        let projectpage = document.createElement('div')
        projectpage.classname = 'project-side-card'

        let expandicon = document.createElement('img')
        expandicon.className = 'project-lv-icon'
        expandicon.id = project + '-' + id + '-expand-project-side'
        projectpage.appendChild(expandicon)

        let projecttitle = document.createElement('div')
        projecttitle.textContent = project.name
        project.tasks.forEach((task)=>{
            projectpage.appendChild(TaskView(task).SidebarView())
        })
    }

    const OnTaskAdded = (task) => {
        let projectpage = document.querySelector('#' + project + '-' + id + '-page')
        projectpage.appendChild(TaskView(task).RegularView())
    }

    const OnTaskRemoved = (id) => {
        let projectpage = document.querySelector('#' + project + '-' + id + '-page')
        projectpage.removeChild(document.querySelector('#' + id + '-regular-card'))
    }

    return {RegularView, SidebarView, OnTaskAdded, OnTaskRemoved}
}

const ProjectController = (project) => {
    const AddTask = (task) => {
        project.AddTask(task)
    }

    let OnTaskAdded = null;

    const RemoveTaskByObject = (task) => {
        project.RemoveTaskByObject(task)
    }

    let OnTaskRemoved = null;

    const RemoveTaskByIndex = (index) =>{
        project.RemoveTaskByIndex(index)
    }

    return {AddTask, RemoveTaskByObject, RemoveTaskByIndex, OnTaskAdded, OnTaskRemoved}
}

function Portfolio(name){
    this.projects = []
    this.name = name
    function GetProjectId(project){
        for (let i = 0; i < this.projects.length; i++){
            if(this.projects[i] == project) {return i}
        }
        return null
    }

    function AddProject(project){
        this.projects.push(project)
    }

    function RemoveProjectByObject(project){
        for (let i = 0; i < this.projects.length; i++){
            if(this.projects[i] == project) {this.projects.splice(1, 0)}
        }
    }

    function RemoveProjectByIndex(index){
        this.projects.splice(index, 0 )
    }
}

const PortfolioController = (portfolio) => {
    const AddProject = (project) => {
        portfolio.AddProject(project)
    }

    let OnProjectAdded = null;

    const RemoveProjectByObject = (project) => {
        portfolio.RemoveProjectByObject(project)
    }

    const RemoveProjectByIndex = (index) => {
        portfolio.projects.splice(index, 0 )
    }

    return {AddProject, RemoveProjectByObject, RemoveProjectByIndex}
}

const PortfolioView = (portfolio) => {

    const RegularView = () => {
        let portfoliopage = document.createElement('div')
        portfoliopage.id = portfolio.name + '-page'

        let addtaskbutton = document.createElement('button')
        addtaskbutton.textContent = 'Add Project'
        addtaskbutton.className = 'add-project-button portfolio-lv-button'
        addtaskbutton.id = portfolio.name + '-add-task'
        portfoliopage.appendChild(addtaskbutton)

        portfolio.projects.forEach((project)=>{
            portfoliopage.appendChild(ProjectView(project))
        })

        return portfoliopage
    }

    const OnProjectAdded = (project) => {
        let portfoliopage = document.querySelector('#' + portfolio.name + '-page')
        portfoliopage.appendChild(ProjectView(project))
    }

    const OnProjectRemoved = (id) => {
        let projectpage = document.querySelector('#' + portfolio.name + '-page')
        projectpage.removeChild(document.querySelector('#' + id + '-regular-card'))
    }

    return {RegularView, OnProjectAdded, OnProjectRemoved}
}


export {Task, TaskView, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView}