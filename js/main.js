/*** Definitions ***/

let dataName = "data";

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.2" }
];

/*** Configuration ***/

const debugMode = true;

const DefaultParentName = "Item";
const DefaultFileType = "json";

function logDebug()
{
    if(debugMode)
        console.log(...arguments);
}

/*********************
 *
 ********************/

class DataItem
{
    constructor(name)
    {
        this.name = name;
        this.type = DefaultFileType;
        this.data = String.Empty;
        this.getJson(this.name);
    }

    getJson(name)
    {
        fetch(`${name}.${this.type}`).then(async (response) => {
            if (!response.ok) throw (`Response not OK: , ${response.status}, ${response.statusText}`);
            this.data = await response.json();
            logDebug("GET JSON: ", this.data);
        });
    }
}

class Item
{
    constructor()
    {
        this.name = ko.observable(DefaultParentName);
        this.title = ko.observable(String.Empty);
        this.description = ko.observable(String.Empty);
        this.positionX = ko.observable(0);
        this.positionY = ko.observable(0);
        this.childItems = ko.observableArray([]);
        //this.makeSelectable();
    }

    addChildItem()
    {
        this.childItems.push(new MainItem(this.name()))
    }

    /*makeSelectable()
    {
        $(document).ready(function () {
            $(".parent-item").selectable();
            $(".children").selectable();
        });
    }*/
}

class MainItem extends Item
{
    constructor(parent)
    {
        super();
        this.parentItem = ko.observable(parent);
        //this.makeSelectable();
    }

    makeDraggable()
    {
        $(".item").draggable({});
    }
}

class ParentItem extends Item
{
    constructor()
    {
        super();
        //this.makeSelectable();
    }
}

class MindMap
{
    constructor()
    {
        this.description = ko.observableArray(description);
        this.parentItem = new ParentItem();
    }

    makeSelectable()
    {
        $(document).ready(function () {
            $(".parent-item").selectable();
            $(".children").selectable();
        });
    }

    toJSON()
    {
        let json = {
            description: this.description(),
            parentItem: ko.toJS(this.parentItem)
        };

        return json;
    }
}

ko.components.register("mind-map", {
    viewModel: { instance: new MindMap() },
    template: { element: "mind-map-tpl" }
});

/*ko.components.register('parent-item', {
    viewModel: function () {
        this.parent = ko.observable(new ParentItem());
        this.parent().name("New Parent");
    },
    template: { element: "parent-item-tpl" }
});

ko.components.register('children', {
    viewModel: function (params) {
        this.children = ko.observable(params);
        //children = params;
    },
    template: { element: "children-tpl" }
});*/

/******************************
*   Start Program
******************************/
let mindMap = new MindMap();

$(document).ready(function(){
    ko.applyBindings(mindMap);
});