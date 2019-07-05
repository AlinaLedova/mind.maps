/*** Definitions ***/

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.9.0" }
];

/*** Configuration ***/

const debugMode = true;

const DefaultItemName = "Item";
const DefaultDataFileName = "data";
const DefaultFileType = "json";
const DefaultLinesColor = "#CC0000";
const DefaultItemHalfWidth = 50;
const DefaultItemHalfHeight = 25;

function logDebug()
{
    if(debugMode)
        console.log(...arguments);
}

let reader = new FileReader();

/*********************
 *  Utility Functions
 ********************/

let fileLoaded = ko.observable(false);

function getFile()
{
    let file = document.getElementById("file").files[0];
    reader.readAsText(file);

    if (reader.readyState > 0)
        fileLoaded(true);
}

/*********************
 *
 ********************/

class DataItem
{
    constructor()
    {
        this.name = DefaultDataFileName;
        this.type = DefaultFileType;
        this.data = String.Empty;
    }
}

class Item
{
    constructor(x = 0, y = 0)
    {
        this.name = ko.observable(DefaultItemName);
        this.title = ko.observable(String.Empty);
        this.description = ko.observable(String.Empty);
        this.positionX = ko.observable(x);
        this.positionY = ko.observable(y);
        this.childItems = ko.observableArray([]);
        this.editing = ko.observable(false);
    }

    addChildItem()
    {
        this.childItems.push(new Item(0, 0));
    }

    removeChildItem(instanceItem)
    {
        this.childItems.remove(instanceItem);
    }

    static ItemFromJson(json)
    {
        let newItem = new Item(json.positionX, json.positionY);
        newItem.name(json.name);
        newItem.title(json.title);
        newItem.description(json.description);
        newItem.editing(json.editing);

        for (let i = 0; i < json.childItems.length; i++)
        {
            let child = Item.ItemFromJson(json.childItems[i]);
            newItem.childItems.push(child);
        }

        return newItem;
    }

    changeEditing(editing)
    {
         this.editing(editing);
    }
}

class MindMap
{
    constructor(dataItem)
    {
        this.created = ko.observable(false);
        this.data = dataItem;
        this.downloadData = ko.observable();
        this.description = ko.observableArray(description);
        this.rootItem = ko.observable(new Item(0, 0));
    }

    createCleanMindMap()
    {
        this.created(true);
    }

    updateMindMap()
    {
        let json = JSON.parse(reader.result);
        this.description(json.description);
        this.rootItem(Item.ItemFromJson(json.rootItem));
        this.created(true);
    }

    getData(filename, json)
    {
        let obj = {
            Data: JSON.stringify(json),
            Mime: "text/json",
            FileName: `${filename}.json`
        };

        return obj;
    }

    toJSON()
    {
        let json = {
            description: this.description(),
            rootItem: ko.toJS(this.rootItem)
        };

        let filename = "data";
        this.downloadData(this.getData(filename, json));

        return json;
    }
}

/***********************
 *  Download
 **********************/
ko.bindingHandlers.BlobDownload = {
    update: function(element, valueAccessor)
    {
        let value = ko.unwrap(valueAccessor());
        if (typeof value.FileName === "string" && !value.FileName.IsEmpty)
            element.setAttribute("download", value.FileName);

        if (typeof value.Mime === "string" && !value.Mime.IsEmpty)
            element.setAttribute("type", value.Mime);

        element.setAttribute("href", URL.createObjectURL(new Blob([value.Data])));
    }
};

/**********************
 *  Custom Bindings
 *********************/

ko.bindingHandlers.PrintLine = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let value = ko.unwrap(valueAccessor());
        element.innerHTML = String.Empty;

        for (let i = 0; i < value.childItems().length; i++)
        {
            let line = document.createElement("line");
            line.setAttribute("x1", value.positionX() + DefaultItemHalfWidth);
            line.setAttribute("y1", value.positionY() + DefaultItemHalfHeight);
            line.setAttribute("x2", value.childItems()[i].positionX() + DefaultItemHalfWidth);
            line.setAttribute("y2", value.childItems()[i].positionY() + DefaultItemHalfHeight);
            line.setAttribute("stroke", DefaultLinesColor);

            element.innerHTML += line.outerHTML;
        }
    }
};

ko.bindingHandlers.DragNDrop = {
    init: function (element, valueAccessor) {

    },
    update: function(element, valueAccessor) {
        let value = valueAccessor();

        element.style.top = `${value.positionY()}px`;
        element.style.left = `${value.positionX()}px`;

        $(element).draggable({
            stop: function(event, ui) {
                let posX = ui.position.left;
                value.positionX(posX);

                let posY = ui.position.top;
                value.positionY(posY);
            }
        });
    }
};

/******************************
*   Start Program
******************************/
let data = new DataItem();
let mindMap = new MindMap(data);

$(document).ready(function(){
    ko.applyBindings(mindMap);
});