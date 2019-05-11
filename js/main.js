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

class ParentItem extends Item
{
    constructor()
    {
        super();
        this.childItems = ko.observableArray([]);
    }
}

class MainItem extends Item
{
    constructor()
    {
        super();
        this.parentItem = ko.observable(String.Empty);
        this.childItems = ko.observableArray([]);
    }
}

class MindMap
{
    constructor()
    {
        this.description = ko.observableArray(description);
        this.parentItem = new ParentItem();
        this.editing = ko.observable(false);
    }

    edit()
    {
        if (!this.editing)
        {
            this.editing = true;
        }
        else
        {
            this.editing = false;
        }
        console.log(this.editing);
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


/******************************
*   Start Program
******************************/
let mindMap = new MindMap();

$(document).ready(function(){
    ko.applyBindings(mindMap);
});