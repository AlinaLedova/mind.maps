/*** Definitions ***/

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.4" }
];

/*** Configuration ***/

const debugMode = true;

const DefaultItemName = "Item";
const DefaultDataFileName = "data";
const DefaultFileType = "json";

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
        this.getJson(this.name);
    }

    getJson(name)
    {
        fetch(`${name}.${this.type}`).then(async (response) => {
            if (!response.ok) throw (`Response not OK: , ${response.status}, ${response.statusText}`);
            this.data = await response.json();
            //logDebug("GET JSON: ", this.data);
        });
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
        this.makeSelectable();
    }

    addChildItem()
    {
        this.childItems.push(new Item(0, 0));
    }

    makeSelectable()
    {
        // need find event except selected
        $(".parent-item").selectable({
            selected: function (event, ui) {
                let children = document.getElementsByClassName("child-item");
                //logDebug(event, ui);
            }
        });
        $(".children").selectable();
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
        this.parentItem = ko.observable(new Item(0, 0));
    }

    createCleanMindMap()
    {
        this.created(true);
    }

    updateMindMap()
    {
        let json = JSON.parse(reader.result);
        this.description(json.description);
        this.parentItem(this.fillItem(json.parentItem));


        this.created(true);
    }

    fillItem(json)
    {
        let newItem = new Item(json.positionX, json.positionY);
        newItem.name(json.name);

        //logDebug("fill Item: ", json, newItem.name());
        return newItem;
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
            parentItem: ko.toJS(this.parentItem)
        };

        let filename = "data";
        this.downloadData(this.getData(filename, json));

        //logDebug(this.data.data);

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

ko.bindingHandlers.PrintLine = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let value = ko.unwrap(valueAccessor());
        let parentItem = bindingContext.$parent.parentItem();

        //logDebug("PRINT LINE: ",value, parentItem, element);
    }
};

/*ko.components.register("mm", {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            logDebug("Create View Model: ", params, componentInfo);

            let firstModel = {
                item: params.data
            };

            let secondModel = {
                item: params.data
            };

            logDebug(firstModel.item);

            switch (params.vm) {
                case "firstModel":
                    return firstModel;
                case "secondModel":
                    return secondModel;
            }
            //return firstModel;
        }
    },
    template: { element: "mm-tpl" }
});*/
/*
ko.components.register("mind-map", {
    viewModel: { instance: new MindMap() },
    template: { element: "mind-map-tpl" }
});

ko.components.register('parent-item', {
    viewModel: function (params) {
        this.parent = params.item;
        logDebug(this.parent);
    },
    template: { element: "parent-item-tpl" }
});*/
/*
ko.components.register('children', {
    viewModel: function (params) {
        this.children = ko.observable(params);
        //children = params;
    },
    template: { element: "children-tpl" }
});*/

ko.components.register('parent-item', {
    viewModel: function (params) {
        this.vm = params.data;
        logDebug(params);
    },
    template: { element: "parent-tpl" }
});

/******************************
*   Start Program
******************************/
let data = new DataItem();
let mindMap = new MindMap(data);

$(document).ready(function(){
    ko.applyBindings(mindMap);
});