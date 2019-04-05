Object.defineProperty(Object.prototype,
    "IsEmpty",
    {
        get: function IsEmpty() {
            switch (typeof this)
            {
                case "string":
                    return this.length === 0;
                case "object":
                    return Object.keys(this).length === 0;
                default:
                    return false;
            }
        }
    });

String.prototype.toUCFirst = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

String.IsNullOrEmpty = (value) => value === null || value.IsEmpty;

String.Empty = "";