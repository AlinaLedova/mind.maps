/*** Definitions ***/

let dataName = "data";

let description = [
    { appName: "Mind Maps" },
    { appVersion: "0.0.3" }
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
            //logDebug("GET JSON: ", this.data);
        });
    }

    updateJson()
    {

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
        this.makeSelectable();
    }

    addChildItem()
    {
        this.childItems.push(new Item());
    }

    makeSelectable()
    {
        // need find event except selected
        $(".parent-item").selectable({
            selected: function (event, ui) {
                let children = document.getElementsByClassName("child-item");
                logDebug(event, ui);
            }
        });
        $(".children").selectable();
    }
}

class MindMap
{
    constructor(dataItem)
    {
        this.data = dataItem;
        this.downloadData = ko.observable();
        this.description = ko.observableArray(description);
        this.parentItem = new Item();
    }

    getData(filename, json)
    {
        let obj = {
            Data: JSON.stringify(json),
            Mime: "text/json",
            FileName: filename
        };

        return obj;
    }

    toJSON()
    {
        let json = {
            description: this.description(),
            parentItem: ko.toJS(this.parentItem)
        };

        let filename = "Mind_Map_json";
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

/******************************
*   Start Program
******************************/
let data = new DataItem("data");
let mindMap = new MindMap(data);

$(document).ready(function(){
    ko.applyBindings(mindMap);
});