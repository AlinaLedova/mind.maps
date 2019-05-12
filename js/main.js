/*** Definitions ***/

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.1" }
];

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
            helper: "original",
            connectToSortable: false

        });

        $(".item-cloned").draggable({
            helper: "clone",
            appendTo: "body",
            connectToSortable: ".main-window",
        });



        $(".main-window").droppable({
            drop: function(event, ui)
            {
                if (!ui.draggable[0].getAttribute("class").search("item-cloned"))
                {
                    value.childItems.push(new MainItem(value.name()));
                }

                $(".item").draggable({
                    helper: "original"
                });

                console.log("Drop Item: ", ui);
            }
        });

    }
};


/******************************
*   Start Program
******************************/
let mindMap = new MindMap();

$(document).ready(function(){
    ko.applyBindings(mindMap);
});