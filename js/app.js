(function (global) {
    var application,
        api = "http://chuckfacts.azurewebsites.net/";

    global.app = {};

    var randomJoke = function (explicit) {
        var dfrd = $.Deferred();

        $.get(api + "joke/" + (explicit ? "explicit" : "clean"), function (data) {
            dfrd.resolve(data.JokeText);
        });

        return dfrd;
    };

    global.app.cleanModel = (function () {

        var viewModel = kendo.observable({
            joke: ""
        });

        var refresh = function () {
            randomJoke(false).then(function (joke) {
                viewModel.set("joke", joke);
            });
        };

        return {
            viewModel: viewModel,
            refresh: refresh
        };

    }());
    
    global.app.dashboardModel = (function () {

        var init = function () {
            $("#categoriesPie").kendoChart({
                theme: "flat",
                title: {
                    text: "Chuck Norris Fact Categories"
                },
                dataSource: {
                    transport: {
                        read: api + "dashboard/categories"
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
                    field: "Jokes",
                    categoryField: "Description",
                    startAngle: 150,

                }]
            });
        };

        return {
            init: init
        };

    }());

    global.app.share = function () {

        var joke = global.app.cleanModel.viewModel.get("joke");
        global.plugins.social.share(joke, null, null);

    }

    document.addEventListener("deviceready", function () {
        application = new kendo.mobile.Application(document.body, { transition: "slide", skin: "ios7" });
    }, false);

})(window);