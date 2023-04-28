function Task(title, id) {
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.iscomplete = null
    this.id = id
}

Task.prototype.Delete = function(){
    delete this
}

const TaskView = (id) => {
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
    let regularview = null

    const CreateNode = function(id, propertyname, inputtype){
        let ret = document.createElement('div')
        ret.className = 'inputholder'

        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + propertyname + '-' + id)

        innerviews[propertyname] = document.createElement('input')
        innerviews[propertyname].type = inputtype
        innerviews[propertyname].name = propertyname
        innerviews[propertyname].className = 'task-' + propertyname
        innerviews[propertyname].id = 'task-' + propertyname + '-' + id

        ret.appendChild(label)
        ret.appendChild(innerviews[propertyname])

        return ret
    }

    const CreateRadio = function(id, propertyname, value){
        let ret = document.createElement('div')
        ret.className = 'radioholder'

        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + value + '-' + id)
        label.textContent = value

        innerviews[value] = document.createElement('input')
        innerviews[value].textContent = value
        innerviews[value].type = 'radio'
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
        innerviews.savebutton.form_id = formid
        innerviews.savebutton.addEventListener('click', savefunction, false)
        
        return innerviews.savebutton
    }

    const SetOnSaveButtonClickedListener = function(onSaveButtonClicked){
        if(innerviews.savebutton != null){innerviews.savebutton.removeEventListener('click', savefunction, false)}
        savefunction = onSaveButtonClicked
        innerviews.savebutton.addEventListener('click', onSaveButtonClicked, false)
    }

    const CreateDeleteButton = function(formid){
        innerviews.deletebutton = document.createElement('button')
        innerviews.deletebutton.textContent = 'Delete'
        innerviews.deletebutton.className = 'task-delete'
        innerviews.deletebutton.type = 'button'
        innerviews.deletebutton.form_id = formid
        return innerviews.deletebutton
    }

    const SetOnDeleteButtonClickedListener = function(onDeleteButtonClicked){
        if(innerviews.deletebutton != null) {innerviews.deletebutton.removeEventListener('click', deletefunction, false)}
        deletefunction = onDeleteButtonClicked
        innerviews.deletebutton.addEventListener('click', deletefunction, false)
    }

    const GetNode = () => {
        if(regularview == null){
        let card = document.createElement('div')
        card.className = 'task-card task-regular-card'
        card.id = id + '-regular-card'
        
        let form = document.createElement('form')
        form.className = 'task-form'
        form.id = id + '-form'
        card.appendChild(form)

        form.appendChild(CreateNode(id + 'title', 'title', 'text'))
        form.appendChild(CreateNode(id  + 'description', 'description', 'text'))
        form.appendChild(CreateNode(id + 'dueDate', 'dueDate', 'date'))
        form.appendChild(CreateRadio(id + 'highpriority', 'priority', 'high'))
        form.appendChild(CreateRadio(id  + 'normalpriority', 'priority', 'normal'))
        form.appendChild(CreateRadio(id  + 'lowpriority', 'priority', 'low'))
        form.appendChild(CreateNode(id  + 'notes', 'notes', 'text'))
        form.appendChild(CreateNode(id  + 'iscomplete', 'iscomplete', 'checkbox'))
        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + 'iscomplete' + '-' + id)
        label.textContent = 'Completed'
        form.appendChild(label)
        form.appendChild(CreateSaveButton(form.id))
        form.appendChild(CreateDeleteButton(form.id))

        regularview = card

        return card
        }
        
        return regularview
    }
    return {GetNode, SetOnSaveButtonClickedListener, SetOnDeleteButtonClickedListener, innerviews}
}


const SideTaskView = (id) => {
    let node = null
    const {taskview} = TaskView(id)

    const GetNode = () =>{
        if(node == null){
            let card = document.createElement('div')
            card.className = 'task-card task-side-card'
            card.id = id + '-regular-card'

            card.appendChild(taskview.CreateNode(id + 'title', 'title', 'text'))
            card.appendChild(taskview.CreateNode(id  + 'iscomplete', 'iscomplete', 'checkbox'))

            node = card
            return card
        }
        return node
    }

    return {GetNode, innerviews}
}

const TaskController = (task) => {
    let views = []
    let project = null
    
    function AddView(view){
        view.GetNode();
        views.push(view)
        view.SetOnSaveButtonClickedListener(OnSave)
        view.SetOnDeleteButtonClickedListener(OnDelete)
    }

    const OnDelete = () => {
        views.forEach(view => {
            view.GetNode().remove()
        })
    }

    function OnSave(){
        views.forEach((view) => {
            task.title= view.innerviews.title.textContent
            task.description= view.innerviews.description.textContent
            task.dueDate = view.innerviews.dueDate.textContent

            if(view.innerviews.high.ischecked) task.priority = 'high'
            if(view.innerviews.normal.ischecked) task.priority = 'normal'
            if(view.innerviews.low.ischecked) task.priority = 'low'

            task.notes= view.innerviews.notes.textContent
            task.iscomplete = view.innerviews.iscomplete.ischecked
        })
    }

    function SetID(id){
        task.id = id
    }

    function GetID(){
        return task.id
    }

    return {AddView, SetID, GetID, project}
}

function Project(name, id){
    this.taskcontrollers = []
    this.title = name
    this.id = id
    this.portfolio = null
}

Project.prototype.AddTaskController = function(taskcontroller){
    this.taskcontrollers.push(taskcontroller)
    taskcontroller.project = this
}

Project.prototype.RemoveProjectByObject = function (taskcontroller){
    for(let i = 0; i < this.taskcontrollers.length; i++){
        if(this.taskscontroller[i] === taskcontroller) {this.tasks.splice(i, 0)}
        taskcontroller.project = null
    }
}

Project.prototype.RemoveProjectByIndex = function RemoveTaskByIndex(index){
    this.taskcontrollers[index].project = null
    this.taskcontrollers.splice(index,0)
}

Project.prototype.Delete = function (){
    delete this
}


const ProjectView = (id) => {
    let node = null
    let addtaskfunction = null
    let deleteprojectfunction = null

    let innerviews = {
        projecttitle : null,
        addtaskbutton : null,
        deleteprojectbutton : null,
        expandicon : null
    }

    const GetNode = () => {
        if (node == null){
            let projectpage = document.createElement('div')
            projectpage.classname = 'project-regular-card'
            projectpage.id = id + '-page'
            node = projectpage
            
            let projecttitle = document.createElement('div')
            projecttitle.id = id + '-title'
            innerviews.projecttitle = projecttitle
            projectpage.appendChild(projecttitle)

            let addtaskbutton = document.createElement('button')
            addtaskbutton.textContent = 'Add Task'
            addtaskbutton.className = 'add-task-button project-lv-button'
            addtaskbutton.id = id + '-add-task'
            innerviews.addtaskbutton = addtaskbutton
            projectpage.appendChild(addtaskbutton)

            let deleteproject = document.createElement('button')
            deleteproject.textContent = 'Delete Project'
            deleteproject.className = 'add-task-button project-lv-button'
            deleteproject.id = id + '-delete-project'
            innerviews.deleteprojectbutton = deleteproject
            projectpage.appendChild(deleteproject)

            let expandicon = document.createElement('img')
            expandicon.className = 'project-lv-icon'
            expandicon.id = id + '-expand-project'
            innerviews.expandicon = expandicon
            projectpage.appendChild(expandicon)

            return projectpage
        }
        return node;
    }

    const SetOnAddTaskButtonClickedListener = function(onAddTaskButtonClicked){
        innerviews.addtaskbutton.removeEventListener('click', addtaskfunction, false)
        addtaskfunction = onAddTaskButtonClicked
        innerviews.addtaskbutton.addEventListener('click', addtaskfunction, false)
    }

    const SetOnDeleteButtonClickedListener = function(onDeleteButtonClicked){
        innerviews.deleteprojectbutton.removeEventListener('click', deleteprojectfunction, false)
        deleteprojectfunction = onDeleteButtonClicked
        innerviews.deleteprojectbutton.addEventListener('click', deleteprojectfunction, false)
    }

    const AddTaskView = function(taskview){
        node.appendChild(taskview.GetNode())
    }

    const RemoveView = function(){
        node.remove()
    }

    return {GetNode, SetOnAddTaskButtonClickedListener, SetOnDeleteButtonClickedListener, AddTaskView, RemoveView, innerviews}
}

const ProjectSideview = (id) => {
    let node = null;
    const {projectview} = ProjectView(id)

    const GetNode = () => {
        if (node == null){
            let projectpage = document.createElement('div')
            projectpage.classname = 'project-side-card'
            projectpage.id = id + '-page'
            node = projectpage
            
            let projecttitle = document.createElement('div')
            projecttitle.id = id + '-title'
            projectview.innerviews.projecttitle = projecttitle
            projectpage.appendChild(projecttitle)

            let expandicon = document.createElement('img')
            expandicon.className = 'project-lv-side-icon'
            expandicon.id = id + '-expand-project'
            projectview.innerviews.expandicon = expandicon
            projectpage.appendChild(expandicon)

            return projectpage
        }
        return node;
    }

    return {GetNode, innerviews}
}

const ProjectController = (project) => {
    let views = []

    const AddView = function(view){
        view.GetNode()
        view.innerviews.projecttitle.textContent = project.title
        project.taskcontrollers.forEach((taskcontroller)=>{
            let tv = TaskView(taskcontroller)
            taskcontroller.AddView(tv)
            view.AddTaskView(tv)
        })
        views.push(view)
        view.SetOnAddTaskButtonClickedListener(() =>{
            let newtask = new Task('', crypto.randomUUID())
            AddTask(newtask)
        })
        view.SetOnDeleteButtonClickedListener(() => {
            OnDelete()
        })
    }

    const GetID = () => {
        return project.id
    }

    const AddTask = function(task){
        let taskcontroller = TaskController(task)
        taskcontroller.project = this
        project.AddTaskController(taskcontroller)

        OnTaskAdded(taskcontroller)
    }

    const OnDelete = function(){
        views.forEach((dview) => {
            dview.RemoveView()
        })
        if(project.portfolio != null) project.portfolio.RemoveProjectByObject(project)
        project.Delete()
    }

    let OnTaskAdded = function(taskcontroller){
        views.forEach(view => {
            let tv = TaskView(taskcontroller)
            taskcontroller.AddView(tv)
            view.AddTaskView(tv)
        })
    };

    const RemoveTaskByObject = (taskcontroller) => {
        views.forEach((view) => {
            view.RemoveTask(taskcontroller)
        })
        project.RemoveTaskByObject(taskcontroller)
    }

    const RemoveTaskByIndex = (index) =>{
        views.forEach((view) => {
            view.RemoveTask(project.taskcontrollers[index].OnDelete)
        })
        project.RemoveTaskByIndex(index)
    }

    const SetPortfolio = (portfolio) => {
        project.portfolio = portfolio
    }

    return {AddTask, RemoveTaskByObject, RemoveTaskByIndex, AddView, GetID, SetPortfolio}
}

function Portfolio(id){
    this.projectcontrollers = []
    this.id = id
}

Portfolio.prototype.AddProjectController = function(projectcontroller){
    this.projectcontrollers.push(projectcontroller)
}

Portfolio.prototype.RemoveProjectByObject = function(projectcontroller){
    for (let i = 0; i < this.projectcontrollers.length; i++){
        if(this.projectcontrollers[i] == projectcontroller) {this.projectcontrollers.splice(1, 0)}
    }
}

Portfolio.prototype.RemoveProjectByIndex = function(index){
    this.projectcontrollers.splice(index, 0 )
}

const PortfolioView = (id) => {
    let node = null;

    function GetNode(){
        if(node == null){
        let portfoliopage = document.createElement('div')
        portfoliopage.id = id + '-page'

        node = portfoliopage
        return portfoliopage
    }
        return node
    }

    const AddProjectView = (projectview) => {
        node.appendChild(projectview.GetNode())
    }

    const RemoveProjectView = (id) => {
        node.removeChild(document.querySelector('#' + id + '-regular-card'))
    }

    return {GetNode, AddProjectView, RemoveProjectView}
}


const PortfolioController = (portfolio) => {
    let views = []

    const GetID = () => {
        return portfolio.id
    }

    const AddProject = (project) => {
        let pc = ProjectController(project)
        portfolio.AddProjectController(pc)
        OnProjectAdded(pc)
    }

    const AddView = (view) => {
        portfolio.projectcontrollers.forEach((projectcontroller)=>{
            let pv = ProjectView(projectcontroller.GetID())
            view.GetNode().appendChild(pv.GetNode())
            projectcontroller.AddView(pv)
        })
        views.push(view)
    }

    let OnProjectAdded = function(projectcontroller){
        let pv = ProjectView(projectcontroller.GetID())
        projectcontroller.AddView(pv)
        projectcontroller.SetPortfolio(this)
        views.forEach((view) => {
            view.AddProjectView(pv)
        })
    }

    const RemoveProjectByObject = (projectcontroller) => {
        views.forEach((view) => {
            view.RemoveProjectView(projectcontroller.GetID())
        })
        portfolio.RemoveProjectByObject(projectcontroller)
    }

    const RemoveProjectByIndex = (index) => {
        portfolio.projects.splice(index, 0 )
    }

    return {AddProject, AddView, RemoveProjectByObject, RemoveProjectByIndex, OnProjectAdded, GetID}
}


export {Task, TaskView, TaskController, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView}