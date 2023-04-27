function Task(title, id) {
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.iscomplete = null
    this.id = id
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

const TaskController = (task) => {
    let views = []
    let project = null
    
    function AddView(view){
        view.GetNode();
        views.push(view)
        view.SetOnSaveButtonClickedListener(OnSave)
        view.SetOnDeleteButtonClickedListener(OnDelete)
        console.log(views)
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
    this.name = name
    this.id = id
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


const ProjectView = (project) => {
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
            projectpage.id = project.id + '-page'
            node = projectpage
            
            let projecttitle = document.createElement('div')
            projecttitle.textContent = project.name
            innerviews.projecttitle = projecttitle
            projectpage.appendChild(projecttitle)

            let addtaskbutton = document.createElement('button')
            addtaskbutton.textContent = 'Add Task'
            addtaskbutton.className = 'add-task-button project-lv-button'
            addtaskbutton.id = project.id + '-add-task'
            innerviews.addtaskbutton = addtaskbutton
            projectpage.appendChild(addtaskbutton)

            let deleteproject = document.createElement('button')
            deleteproject.textContent = 'Delete Project'
            deleteproject.className = 'add-task-button project-lv-button'
            deleteproject.id = project.id + '-delete-project'
            innerviews.deleteprojectbutton = deleteproject
            projectpage.appendChild(deleteproject)

            let expandicon = document.createElement('img')
            expandicon.className = 'project-lv-icon'
            expandicon.id = project.id + '-expand-project'
            innerviews.expandicon = expandicon
            projectpage.appendChild(expandicon)

            project.taskcontrollers.forEach((taskcontroller)=>{
                let tv = TaskView(taskcontroller)
                taskcontroller.AddView(tv)
                AddTaskView(tv)
            })

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

    return {GetNode, SetOnAddTaskButtonClickedListener, SetOnDeleteButtonClickedListener, AddTaskView, RemoveView}
}

const ProjectController = (project) => {
    let views = []

    const AddView = function(view){
        view.GetNode()
        views.push(view)
        view.SetOnAddTaskButtonClickedListener(() =>{
            let newtask = new Task('', crypto.randomUUID())
            AddTask(newtask)
        })
        view.SetOnDeleteButtonClickedListener(() => {
            views.forEach((dview) => {
                dview.RemoveView()
            })
        })
    }

    const AddTask = function(task){
        let taskcontroller = TaskController(task)
        taskcontroller.project = this
        project.AddTaskController(taskcontroller)

        OnTaskAdded(taskcontroller)
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

    return {AddTask, RemoveTaskByObject, RemoveTaskByIndex, AddView}
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

    return {AddProject, RemoveProjectByObject, RemoveProjectByIndex, OnProjectAdded}
}

const PortfolioView = (portfolio) => {

    const RegularView = () => {
        let portfoliopage = document.createElement('div')
        portfoliopage.id = portfolio.name + '-page'

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


export {Task, TaskView, TaskController, Project, ProjectView, ProjectController, Portfolio, PortfolioController, PortfolioView}