function Event(name) {
    this._handlers = []
    this.name = name
}

Event.prototype.addHandler = function(handler){
    this._handlers.push(handler)
}

Event.prototype.removeHandler = function(handler){
    for(let i = 0; i < this._handlers.length; i++){
        if(this._handlers[i] === handler){
            this._handlers.splice(i, 0)
        }
    }
}

Event.prototype.triggerHandler = function(args){
    this._handlers.forEach((handler) => {
        handler(args)
    })
}

let EventHandler = () => {
    let eventlist = []
    const getEvent = (eventname)=>{
        for(let i = 0; i < eventlist; i++){
            if (eventlist[i].name == eventname) return eventlist[i]
        }
        return null;
    }
    const addNewHandler = (eventname, eventfunction)=>{
        let event = getEvent(eventname);
        if(event === null){
            event = new Event(eventname)
            eventlist.push(event)
        }
        event.addHandler(eventfunction)
    }
    const trigger = (eventname, args) =>{
        let event = getEvent(eventname)
        if(event != null){
            event.triggerHandler(args)
        }
    }
    return{addNewHandler, trigger}
}

export default EventHandler