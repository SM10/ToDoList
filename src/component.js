function Task(title) {
    this.title= title
    this.description= ""
    this.dueDate = null
    this.priority = null
    this.notes= null
    this.project = null
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
        deletebutton : null
    }
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
        
        return innerviews.savebutton
    }

    const OnSaveButtonClickedListener = function(onSaveButtonClicked){
        innerviews.savebutton.addEventListener('click',(event) => {
            task.title = innerviews.title.textContent
            task.description= innerviews.description.textContent
            task.dueDate = innerviews.description.textContent
            task.notes= innerviews.description.textContent

            if(innerviews.high.checked){task.priority = 'high'}
            if(innerviews.normal.checked){task.priority = 'normal'}
            if(innerviews.low.checked){task.priority = 'low'}

            onSaveButtonClicked(event)
        },false)
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
        innerviews.deletebutton.addEventListener('click', (event) =>{
            let regularview = document.querySelector('#' + id + '-regular-card')
            regularview.remove()
            let sidebarview = document.querySelector('#' + id + '-side-card')
            sidebarview.remove()
            onDeleteButtonClicked(event)
        }, false)
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
        form.appendChild(CreateSaveButton(form.id))
        form.appendChild(CreateDeleteButton(form.id))

        return card
    }
    const SidebarView = () => {
        let card = document.createElement('div')
        card.className = 'task-card task-side-card'
        card.textContent = task.title
        card.id = id + '-side-card'
    }
    return {RegularView, SidebarView, OnSaveButtonClickedListener, OnDeleteButtonClickedListener}
}

function Project(name){
    this.tasks = []
    this.name = name
}

const ProjectView = (project) => {
    const RegularView = () => {
        let projectpage = document.createElement('div')
        projectpage.classname = 'project-card'
        
        let projecttitle = document.createElement('div')
        projecttitle.textContent = project.name

        project.tasks.forEach((task)=>{
            projectpage.appendChild(RegularView(task))
        })

        return projectpage
    }
    const SidebarView = () => {
        let projectpage = document.createElement('div')
        projectpage.classname = 'project-side-card'

        let projecttitle = document.createElement('div')
        projecttitle.textContent = project.name
        project.tasks.forEach((task)=>{
            projectpage.appendChild(SidebarView(task))
        })
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