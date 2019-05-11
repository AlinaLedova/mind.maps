/*** Definitions ***/

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.1" }
];

console.log(description);

/*** Configuration ***/

const DefaultParentName = "Item";

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
        console.log(this.childItems()[0].parentItem());
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


ko.bindingHandlers.dropItem = {
    update: function(element, valueAccessor)
    {
        let value = ko.unwrap(valueAccessor());

        $(".item").draggable({
            appendTo: ".main-window"
        });

        $(".main-window").droppable({

        });
        console.log("Drop Item: ");
    }
};


/******************************
*   Start Program
******************************/
let mindMap = new MindMap();

$(document).ready(function(){
    ko.applyBindings(mindMap);
});