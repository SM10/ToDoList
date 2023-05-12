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

const LocalStorageHandler = () => {
    function SaveTaskToLocal(task, projectname) {
        if (storageAvailable("localStorage")){
            let tasklist = localStorage.getItem('tasklist').split(',')
            if(tasklist == null) {
                localStorage.setitem('tasklist', [task.title])
            }else{
                tasklist.push(task.title)
                localStorage.setitem('tasklist', tasklist.toString())
            }

            localStorage.setItem(projectname + '-' + task.title + '-' + 'title', task.title)
            localStorage.setItem(projectname + '-' + task.title + '-' + 'description', task.description)
            localStorage.setItem(projectname + '-' + task.title + '-' + 'dueDate', task.dueDate)
            localStorage.setItem(projectname + '-' + task.title + '-' + 'priority', task.priority)
            localStorage.setItem(projectname + '-' + task.title + '-' + 'notes', task.notes)
            localStorage.setItem(projectname + '-' + task.title + '-' + 'iscomplete', task.iscomplete)
        }
    }

    function SaveProjectsToLocal(projectarray){
        if (storageAvailable("localStorage")){
            localStorage.setItem('projectlist', projectarray.toString())
        }
    }

    function LoadProjects(){
        if (storageAvailable("localStorage")){
            return localStorage.getItem('projectlist').split(',')
        }
    }

    function LoadTasks(){
        if (storageAvailable("localStorage")){
            return localStorage.getItem('tasklist').split(',')
        }
    }

    return {SaveTaskToLocal, SaveProjectsToLocal, LoadProjects, LoadTasks}
}

class Task{
    constructor(title,id){
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.iscomplete = null
    this.id = id
    }
}

Task.prototype.SetValue = (propertyname, value) => {
    this[propertyname] = value
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
    let viewmode = null

    const CreateNode = function(id, labelname, propertyname, inputtype){
        let ret = document.createElement('div')
        ret.className = id +propertyname + inputtype

        let label = document.createElement('label')
        label.setAttribute('for', 'task-' + propertyname + '-' + id)
        label.textContent = labelname

        if(innerviews[propertyname] == null){
        innerviews[propertyname] = document.createElement('input')
        innerviews[propertyname].type = inputtype
        innerviews[propertyname].name = propertyname
        innerviews[propertyname].className = 'task-' + propertyname
        innerviews[propertyname].id = 'task-' + propertyname + '-' + id
        }

        ret.appendChild(label)
        ret.appendChild(innerviews[propertyname])

        return ret
    }

    const CreateDiv = function(id, textcontent, propertyname){
        let ret = document.createElement('div')
        ret.textContent = textcontent
        ret.className = 'task-' + propertyname
        ret.id = 'task-' + propertyname + '-' + id

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
        innerviews.savebutton.id = formid
        innerviews.savebutton.addEventListener('click', savefunction, false)
        
        return innerviews.savebutton
    }

    const CreateEditButton = function(formid){
        innerviews.editbutton = document.createElement('button')
        innerviews.editbutton.textContent = 'Edit'
        innerviews.editbutton.className = 'task-save'
        innerviews.editbutton.type = 'button'
        innerviews.editbutton.id = formid
        innerviews.editbutton.addEventListener('click', (event) =>{
            viewmode.replaceWith(GetNode())
            GetNode().appendChild(innerviews.deletebutton)
        }, false)
        
        return innerviews.editbutton
    }

    const CreateViewNode = function(){
            let card = document.createElement('div')
            card.className = 'task-card task-regular-card'
            card.id = id + '-regular-card'
    
            card.appendChild(CreateDiv(id, innerviews.title.value, 'title'))
            card.appendChild(CreateDiv(id, innerviews.description.value, 'description'))
            card.appendChild(CreateDiv(id, innerviews.dueDate.value, 'dueDate'))
                if(innerviews.high.checked) card.appendChild(CreateDiv(id, innerviews.high.value, 'high'))
                if(innerviews.normal.checked) card.appendChild(CreateDiv(id, innerviews.normal.value, 'normal'))
                if(innerviews.low.checked) card.appendChild(CreateDiv(id, innerviews.low.value, 'low'))
            card.appendChild(CreateDiv(id, innerviews.notes.value, 'notes'))
            if(innerviews.iscomplete.checked == 'on') card.appendChild(CreateDiv(id, 'Completed', 'completed'))
            card.appendChild(CreateEditButton(id + '-edit'))
            let del = CreateDeleteButton(id + '-delete')
            del.addEventListener('click', () => {
                deletefunction()
                card.remove()
            })
            card.appendChild(del)
            
            viewmode = card
            return card
    }

    const SetOnSaveButtonClickedListener = function(onSaveButtonClicked){
        if(innerviews.savebutton != null){innerviews.savebutton.removeEventListener('click', savefunction, false)}
        savefunction = function(event){
            console.log('check')
            let v = CreateViewNode()
            GetNode().replaceWith(v)
            onSaveButtonClicked(event)
        }
        innerviews.savebutton.addEventListener('click', savefunction, false)
    }

    const CreateDeleteButton = function(formid){
        innerviews.deletebutton = document.createElement('button')
        innerviews.deletebutton.textContent = 'Delete'
        innerviews.deletebutton.className = 'task-delete'
        innerviews.deletebutton.type = 'button'
        innerviews.deletebutton.id = formid
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

        form.appendChild(CreateNode(id + 'title','Title', 'title', 'text'))
        form.appendChild(CreateNode(id  + 'description', 'Description', 'description', 'text'))
        form.appendChild(CreateNode(id + 'dueDate', 'Due Date', 'dueDate', 'date'))
        form.appendChild(CreateRadio(id + 'highpriority', 'priority', 'high'))
        form.appendChild(CreateRadio(id  + 'normalpriority', 'priority', 'normal'))
        form.appendChild(CreateRadio(id  + 'lowpriority', 'priority', 'low'))
        form.appendChild(CreateNode(id  + 'notes', 'Notes', 'notes', 'text'))
        form.appendChild(CreateNode(id  + 'iscomplete', 'Completed', 'iscomplete', 'checkbox'))
        form.appendChild(CreateSaveButton(id + '-save'))
        form.appendChild(CreateDeleteButton(id + '-delete'))

        regularview = card

        return card
        }
        
        return regularview
    }
    return {GetNode, SetOnSaveButtonClickedListener, SetOnDeleteButtonClickedListener, innerviews, CreateNode, CreateDiv}
}

const TaskSideView = (id) =>{
    let node = null;
    const {CreateNode, innerviews, CreateDiv} = TaskView(id)

    const GetNode = () =>{
        if(node == null){
            let card = document.createElement('div')
            card.className = 'task-card task-side-card'
            card.id = id + '-regular-card'

            innerviews.title = card.appendChild(CreateDiv(id + 'title', '', 'title'))
            let check = CreateNode(id  + 'iscomplete', '', 'iscomplete', 'checkbox')
            check.setAttribute('onclick', 'return false')
            card.appendChild(check)

            node = card
            return card
        }
        return node
    }

    const SetOnSaveButtonClickedListener = (event) => {}
    const SetOnDeleteButtonClickedListener = (event) => {}

    return {GetNode, innerviews, SetOnSaveButtonClickedListener, SetOnDeleteButtonClickedListener}
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

    function OnSave(event){
        views.forEach((view) => {
          if(view.innerviews.savebutton != null && event.target.id == view.innerviews.savebutton.id){
            task.title = view.innerviews.title.value
            task.description = view.innerviews.description.value
            task.dueDate = view.innerviews.dueDate.value
            if(view.innerviews.high.value) task.priority= 'high'
            if(view.innerviews.normal.value) task.priority = 'normal'
            if(view.innerviews.low.value) task.priority = 'low'

            task.notes = view.innerviews.notes.value
            task.iscomplete = view.innerviews.iscomplete.checked
          }
          LocalStorageHandler().SaveTaskToLocal(task, project.title)
        })

        views.forEach((view) => {

            if(view.innerviews.title != null) {
                view.innerviews.title.textContent = task.title
                view.innerviews.title.value = task.title }
            if(view.innerviews.description != null) view.innerviews.description.value = task.description
            if(view.innerviews.dueDate != null) view.innerviews.dueDate.value = task.dueDate 

            if(view.innerviews[task.priority] != null) {view.innerviews[task.priority].value = task.iscomplete}

            if(view.innerviews.notes != null) view.innerviews.notes.value = task.notes
            if(view.innerviews.iscomplete != null) view.innerviews.iscomplete.checked = task.iscomplete
        })
    }

    function GetID(){
        return task.id
    }

    return {AddView, GetID, project}
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
    let titlepassfunction = null

    let innerviews = {
        projecttitle : null,
        addtaskbutton : null,
        deleteprojectbutton : null,
        expandicon : null,
        saveprojectnamebutton : null
    }

    const GetNode = () => {
        if (node == null){
            let projectpage = document.createElement('div')
            projectpage.classname = 'project-regular-card'
            projectpage.id = id + '-page'
            node = projectpage
            
            let projecttitle = document.createElement('input')
            projecttitle.id = id + '-title'
            innerviews.projecttitle = projecttitle
            projectpage.appendChild(projecttitle)

            let saveprojectnamebutton = document.createElement('button')
            saveprojectnamebutton.textContent = 'Save Title'
            saveprojectnamebutton.className = '-save-title project-lv-button'
            saveprojectnamebutton.id = id + '-save-title'
            innerviews.saveprojectnamebutton = saveprojectnamebutton
            saveprojectnamebutton.addEventListener('click', TitleSavedView, false)
            projectpage.appendChild(saveprojectnamebutton)

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

    const LoadTasks = function()    

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

    const TitleSavedView = function(){
        let newtitle = innerviews.projecttitle.value
        console.log(titlepassfunction)
        if(titlepassfunction != null){
            titlepassfunction(newtitle)
        }
        
        let projecttitle = document.createElement('div')
        projecttitle.id = id + '-title'
        projecttitle.textContent = newtitle
        innerviews.projecttitle.replaceWith(projecttitle)
        innerviews.projecttitle = projecttitle

        let saveprojectnamebutton = document.createElement('button')
        saveprojectnamebutton.textContent = 'Change Title'
        saveprojectnamebutton.className = '-change-title project-lv-button'
        saveprojectnamebutton.id = id + '-change-title'
        saveprojectnamebutton.addEventListener('click', ()=>{
            let projecttitle = document.createElement('input')
            projecttitle.id = id + '-title'
            projecttitle.value = innerviews.projecttitle.textContent
            innerviews.projecttitle.replaceWith(projecttitle)
            innerviews.projecttitle = projecttitle

            let saveprojectnamebutton = document.createElement('button')
            saveprojectnamebutton.textContent = 'Save Title'
            saveprojectnamebutton.className = '-save-title project-lv-button'
            saveprojectnamebutton.id = id + '-save-title'
            saveprojectnamebutton.addEventListener('click', TitleSavedView, false)
            innerviews.saveprojectnamebutton.replaceWith(saveprojectnamebutton)
            innerviews.saveprojectnamebutton = saveprojectnamebutton
        }, false)
        innerviews.saveprojectnamebutton.replaceWith(saveprojectnamebutton)
        innerviews.saveprojectnamebutton = saveprojectnamebutton
        
    }

    const AddTaskView = function(taskview){
        node.appendChild(taskview.GetNode())
    }

    const RemoveView = function(){
        node.remove()
    }

    function SetTitlePassFunction(titlepassfunc){
        titlepassfunction = titlepassfunc;
    }

    return {GetNode, SetOnAddTaskButtonClickedListener, SetOnDeleteButtonClickedListener, AddTaskView, RemoveView, innerviews, SetTitlePassFunction}
}

class ProjectSideView{
    constructor(id){
        this.id = id
        this.node = null;
        this.deleteprojectfunction = null;
        this.innerviews = ProjectView(id).innerviews
    }

    GetNode(){
        if (this.node == null){
            let projectpage = document.createElement('div')
            projectpage.classname = 'project-side-card'
            projectpage.id = this.id + '-page'
            
            let projecttitle = document.createElement('div')
            projecttitle.id = this.id + '-title'
            this.innerviews.projecttitle = projecttitle
            projectpage.appendChild(projecttitle)

            let expandicon = document.createElement('img')
            expandicon.className = 'project-lv-side-icon'
            expandicon.id = this.id + '-expand-project'
            this.innerviews.expandicon = expandicon
            projectpage.appendChild(expandicon)

            this.node = projectpage;

            return projectpage
        }
        return this.node;
    }

    AddTaskView(taskview){
        this.node.appendChild(taskview.GetNode())
    }

    SetOnAddTaskButtonClickedListener = (fun) => {
        const PortfolioView = (id, querystring) => {
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
        
            return {GetNode, AddProjectView, RemoveProjectView, querystring}
        }
        //do nothing
    }

    SetOnDeleteButtonClickedListener (){
        this.deleteprojectfunction = function(){
            this.GetNode().remove()
        }
    }

    SetTitlePassFunction () {}
}

const ProjectController = (project) => {
    let views = []

    const AddView = function(view){
        view.GetNode()
        view.innerviews.projecttitle.textContent = project.title
        project.taskcontrollers.forEach((taskcontroller)=>{
            AttachTaskViewsToView(view, taskcontroller)
        })
        views.push(view)
        if(view.SetOnAddTaskButtonClickedListener)
        view.SetOnAddTaskButtonClickedListener(() =>{
            let newtask = new Task('', crypto.randomUUID())
            AddTask(newtask)
        })
        view.SetOnDeleteButtonClickedListener(() => {
            OnDelete()
        })
        let titlepass = (title) => {
            project.title = title
            views.forEach(view => {
                view.innerviews.projecttitle.textContent = title
            })}
        view.SetTitlePassFunction(titlepass)
    }

    const AttachTaskViewsToView = function(view, taskcontroller){
        
        if(view instanceof ProjectSideView){
            let sv = TaskSideView(taskcontroller.GetID())
            
            taskcontroller.AddView(sv)
            view.AddTaskView(sv)

        }else if(view instanceof ProjectView){
            
            let tv = TaskView(taskcontroller.GetID())
            taskcontroller.AddView(tv)
            view.AddTaskView(tv)
        }
    }

    const GetID = () => {
        return project.id
    }

    const AddTask = function(task){
        let taskcontroller = TaskController(task)
        taskcontroller.project = this
        project.AddTaskController(taskcontroller)

        views.forEach(view => {
            let tv;
            console.log(view instanceof ProjectSideView);
            if(view instanceof ProjectSideView){
                tv = TaskSideView(taskcontroller.GetID())
            }else{
                tv = TaskView(taskcontroller.GetID())
            }
            taskcontroller.AddView(tv)
            console.log(view.GetNode())
            console.log(tv.GetNode())
            view.AddTaskView(tv)
        })
    }

    const OnDelete = function(){
        views.forEach((dview) => {
            dview.RemoveView()
        })
        if(project.portfolio != null) project.portfolio.RemoveProjectByObject(project)
        project.Delete()
    }

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


const PortfolioController = (portfolio) => {
    const REGULAR = 'regular'
    const SMALL = 'small'
    let containers = {}

    const GetID = () => {
        return portfolio.id
    }

    const AddProject = (project) => {
        let pc = ProjectController(project)
        portfolio.AddProjectController(pc)
        OnProjectAdded(pc)
    }

    const AddProjectViewContainer = (containerstring, viewtype) => {
        containers[containerstring] = viewtype
    }

    let OnProjectAdded = function(projectcontroller){

        for (const [key, value] of Object.entries(containers)){
            if(value === REGULAR){
                let pv = ProjectView(projectcontroller.GetID())
                projectcontroller.AddView(pv)
                document.querySelector(key).appendChild(pv.GetNode())
            }else if (value === SMALL){
                let psv = new ProjectSideView(projectcontroller.GetID())
                projectcontroller.AddView(psv)
                document.querySelector(key).appendChild(psv.GetNode())
            }
        }

        projectcontroller.SetPortfolio(this)
        
    }

    const RemoveProjectByObject = (projectcontroller) => {
        for (const [key, value] of Object.entries(containers)){
            document.querySelector(key).removeChild(document.querySelector('#' + projectcontroller.id + '-regular-card'))
        }

        portfolio.RemoveProjectByObject(projectcontroller)
    }

    const RemoveProjectByIndex = (index) => {
        portfolio.projects.splice(index, 0 )
    }

    return {AddProject, RemoveProjectByObject, RemoveProjectByIndex, OnProjectAdded, GetID, REGULAR, SMALL, AddProjectViewContainer}
}


export {Task, TaskView, TaskController, Project, ProjectView, ProjectController, Portfolio, PortfolioController}