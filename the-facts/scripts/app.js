(function (g) {
    var api = "http://facts.azurewebsites.net/api/",
        el = new Everlive({
            apiKey: "prlnB38rYu0v65Tt",
            scheme: "http"
        });
        

    // create a variable on the window to hold all of our custom code
    g.app = {};

    // share function to call custom plugin
    var share = function(joke) {
        g.plugins.social.share(joke);
    }         

    // get a random joke by category
    var getRandomJoke = function (category, viewModel) {
        g.app.application.showLoading();
        $.get(api + "jokes?type=" + category, function (data) {
            // update the view model
            viewModel.set("joke", data.JokeText);
            g.app.application.hideLoading();
        });
    };

    // create a base class for the nerdy and funny view
    var JokeModel = kendo.Class.extend({
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
                    return kendo.support.mobileOS.ios || false;
                }
            });

            // expose a random joke method
            this.getRandomJoke = function () {
                getRandomJoke(that.category, that.viewModel);
            }
        }
    });

    // create a new funny model from the base jokeModel class
    g.app.funny = new JokeModel("funny");

    // create a new nerdy model from the base jokeModel class
    g.app.nerdy = new JokeModel("nerdy");

    g.app.dashboard = (function () {

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

    var init = function () {

        var os = kendo.support.mobileOS;
        var statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";

        // create a new kendo ui mobile app using the whole page
        new kendo.mobile.Application(document.body, {
            transition: "slide", init: function () {

                g.app.application = this;
                getRandomJoke("funny", g.app.funny.viewModel);

                navigator.splashscreen.hide();

            },
            statusBarStyle: statusBarStyle,
            skin: "flat"
        });

        // register this app with Everlive to receive push notifications
        var device = el.push.currentDevice();

        var settings = {
            iOS: {
                badge: true,
                sound: true,
                alert: true
            },
            notificationCallbackIOS: function (e) {
                alert(e);
            },
            notificationCallbackAndroid: function(e) {
                alert(e);
            }
        };

        device.enableNotifications(settings).then(
            function () {
                alert("notifications enabled");
                return device.getRegistration();    
            },
            function(err) {
                alert(err);
            }
        ).then(
            function (e) {
                alert(e);
            },
            function(err) {
                alert(err);
            }
        );
       
    }

    document.addEventListener("deviceready", init, false);

    document.addEventListener("offline", function () {
        g.app.application.navigate("#offline");
    });

    document.addEventListener("online", function () {
        if (g.app.application) {
            g.app.application.navigate("#:back");
        }
    });

    

}(window));


