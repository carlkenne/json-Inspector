(function ($) {
    var _formatters = [
        //Array
        {
            filter:function (key, value) {
                return (value instanceof Array);
            },
            format:function (value,settings) {
                return settings.arrayLabel + "[" + value.length + "]";
            }
        },
        //Object
        {
            filter:function (key, value) {
                return (value instanceof Object && !(value instanceof Array));
            },
            format:function (value,settings) {
                return settings.objectLabel;
            }
        },
        //Date (iso 8601)
        {
            filter:function (key, value) {
                //could find a regexp for this i guess..
                return (typeof value === 'string'
                    && value.indexOf("T") == 10
                    && value.indexOf("-") == 4
                    && value.indexOf(":") == 13)
            },
            format:function (value) {
                var date = new Date(value).toString();
                return date.substr(0, date.indexOf("GMT"));
            }
        }
    ];

    var _settings = {objectLabel:"Object", arrayLabel:"Array"};
    var _createSettings = function (additionalSettings) {
        var settings = {};
        for (var key in _settings) {
            if (_settings.hasOwnProperty(key)) {
                settings[key] = _settings[key];
            }
        }
        for (var key in additionalSettings) {
            if (additionalSettings.hasOwnProperty(key)) {
                settings[key] = additionalSettings[key];
            }
        }
        return settings;
    };


    var JsonInspectorBuilder = (function () {

        this._formattingRules = [];
        this._settings = {};

        function JsonInspectorBuilder(formattingRules, settings) {
            this._formattingRules = formattingRules;
            this._settings = settings;
        };

        JsonInspectorBuilder.prototype.createListIn = function (parentElement, json) {
            var currentUlElement = $("<ul>", {}).appendTo(parentElement);
            for (var key in json) {
                var value = json[key];
                var currentLiElement = $("<li>").appendTo(currentUlElement);
                var formattedValue = value;

                if (value instanceof Object || value instanceof Array) {
                    var liElement = $("<li>").appendTo(currentUlElement);
                    this.createListIn(liElement, value);
                    currentLiElement.attr("class", "has-content");
                }

                //format value
                for (i = 0; i < this._formattingRules.length; i++) {
                    if (this._formattingRules[i].filter(key, value)) {
                        formattedValue = this._formattingRules[i].format(value, this._settings);
                    }
                }
                currentLiElement.text(key + ": " + formattedValue);
            }
        };
        return JsonInspectorBuilder;
    })();

    $.fn.renderJson = function (json, additionalFormattingRules, additionalSettings) {
        var formattingRules = _formatters.concat(additionalFormattingRules);
        var jsonInspectorBuilder = new JsonInspectorBuilder(formattingRules,_createSettings(additionalSettings));
        jsonInspectorBuilder.createListIn($(this), {root:json});
        $(".has-content").click(function () {
            $(this).toggleClass("expanded");
        });
    };
})(jQuery);

$(document).ready(function () {
    var additionalFormattingRules = [
        {
            filter:function (key, value) {
                return (value instanceof Object && !(value instanceof Array))
                    && value.name !== 'undefined';
            },
            format: function (value, settings) {
                return settings.objectLabel + " {" + value.name + "}";
            }
        }
    ];

    $("#json-here").renderJson({
            'name':'hello',
            'data':'world',
            'date':'2012-03-19T23:22:21',
            'children':[
                {'name':'first-child', 'id':'1234'},
                {'name':'second-child', 'id':'5678'}
            ]
        },
        additionalFormattingRules);
});