function Observer() {
    var observer = {};
    var viewList = [];

    observer.addView = function(view) {
        viewList.push(view);
    }
    observer.fireEvent = function(message, data, from) {
        viewList.forEach(function(view) {
            if (view.hasOwnProperty('onMessage')) {
                view.onMessage(message, data, from);
            }

        })
    }
    return observer;
}




var obs = Observer();
var themeRiver = ThemeRiver(obs);
var radar = Radar(obs);
var boxplot = Boxplot(obs);
var line = Line(obs);
var map = Map(obs);
var gantt = Gantt(obs);
var cluster = Cluster(obs);

