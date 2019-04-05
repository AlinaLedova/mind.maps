/*** Definitions ***/

/*** Configuration ***/

/*********************
 *
 ********************/

class Item
{
    constructor()
    {
        this.name = String.Empty;
        this.title = String.Empty;
        this.description = String.Empty;
    }
}

class ParentItem extends Item
{
    constructor()
    {
        super();
        this.childItems = [];
    }
}

class MainItem extends Item
{
    constructor()
    {
        super();
        this.parentItem = String.Empty;
        this.childItems = [];
    }
}