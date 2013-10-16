(function () {
    var api = "http://facts.azurewebsites.net/api/";

    // create a variable on the window to hold all of our custom code
    window.app = {};

    // share function to call custom plugin
    var share = function(joke) {
        window.plugins.social.share(joke);
    } 

    // get a random joke by category
    var getRandomJoke = function (category, viewModel) {    
        $.get(api + "jokes?type=" + category, function (data) {
            // update the view model
            viewModel.set("joke", data.JokeText);
        });
    };

    // create a base class for the nerdy and funny view
    var jokeModel = kendo.Class.extend({
        // the init method is the constructor and is called when the object 
        // is created using the 'new' keyword
        init: function (category) {
            // store a reference to the base class object
            var that = this;

            // attach a category field to this instance and set it's 
            // value to the parameter passed into the init method
            that.category = category;

            // create a view model
            that.viewModel = kendo.observable({
                joke: null,
                refresh: function () {
                    getRandomJoke(that.category, this);
                },
                share: function () {
                    share(this.get("joke"));
                },
                canShare: function () {
                    return window.app.application.os.ios;
                }
            });

            // expose a random joke method
            this.getRandomJoke = function () {
                getRandomJoke(that.category, that.viewModel);
            }
        }
    });

    // create a new funny model from the base jokeModel class
    window.app.funny = new jokeModel("funny");

    // create a new nerdy model from the base jokeModel class
    window.app.nerdy = new jokeModel("nerdy");

    window.app.dashboard = (function () {

        var init = function () {
            $("#chart").kendoChart({
                theme: "flat",
                title: {
                    text: "Chuck Norris Fact Categories"
                },
                dataSource: {
                    transport: {
                        read: api + "dashboard"
                    }
                },
                legend: {
                    position: "top"
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: false
                    }
                },
                series: [{
                    type: "pie",
                    field: "value",
                    categoryField: "category",
                    startAngle: 150,

                }]
            });
        };

        return {
            init: init
        };

    }());

    // create a new kendo ui mobile app using the whole page
    window.app.application = new kendo.mobile.Application(document.body, { transition: "slide", skin: "flat" });

    document.addEventListener("offline", function () {
        window.app.application.navigate("#offline");
    });

    document.addEventListener("online", function () {
        window.app.application.navigate("#:back");
    });

}());


