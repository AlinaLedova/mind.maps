/*** Definitions ***/

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.2" }
];

/*** Configuration ***/

let debugMode = true;

const DefaultParentName = "Item";

function logDebug()
{
    if(debugMode)
        console.log(...arguments);
}

/*********************
 *
 ********************/

class Item
{
    constructor()
    {
        this.name = ko.observable(DefaultParentName);
        this.title = ko.observable(String.Empty);
        this.description = ko.observable(String.Empty);
        this.positionX = ko.observable(0);
        this.positionY = ko.observable(0);
    }
}

class MainItem extends Item
{
    constructor(parent)
    {
        super();
        this.parentItem = ko.observable(parent);
        this.childItems = ko.observableArray([]);
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
        this.childItems = ko.observableArray([]);
    }

    addItem()
    {
        this.childItems.push(new MainItem(this.name()));
        logDebug(this.childItems());
        //console.log(this.childItems()[0].parentItem());
    }
}

class MindMap
{
    constructor()
    {
        this.description = ko.observableArray(description);
        this.parentItem = new ParentItem();
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

ko.components.register('parent-item', {
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
});

/******************************
*   Start Program
******************************/
let mindMap = new MindMap();

$(document).ready(function(){
    ko.applyBindings(mindMap);
});