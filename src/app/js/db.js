/**
 * @module db
 * 
 * @todo add each count on collections list.
 * @todo add loading indicator when loading data.
 * @todo add dragging target to eval.
 * @todo add collection
 * @todo insert doc to collection
 */

'use strict';
const electron = require('electron').remote;
const {ipcRenderer} = require('electron');
const Mongoose = require('mongoose');

var ngApp = angular.module('electmongo', ['ngRoute', "ngMaterial", "ngAnimate"]);
ngApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-green');
    //  .primaryPalette('pink')
    //  .accentPalette('orange');
    $mdThemingProvider.theme('alt-dark')
        .primaryPalette('blue');
});
ngApp.controller('dbCtrl', function ($scope) {
    $scope.db_name = "Connecting";
    $scope.docLoader = new DocLoader();

    ipcRenderer.on('db-connect', function (event, data) {
        if (!data) return;
            var mongoUrl = "mongodb://";
            mongoUrl = data.username ? `${mongoUrl}${data.username}` : mongoUrl;
            mongoUrl = data.password ? `${mongoUrl}:${data.password}` : mongoUrl ;
            if (mongoUrl === "mongodb://"){
                mongoUrl = data.ip ? mongoUrl + data.ip : mongoUrl;
            }else{
                mongoUrl = data.ip ? `${mongoUrl}@${data.ip}` : mongoUrl;
            }
            mongoUrl = data.port ? `${mongoUrl}:${data.port}` : mongoUrl;
            mongoUrl = data.name ? `${mongoUrl}/${data.name}` : mongoUrl;
            $scope.db = data;
            try {
                $scope.db.connection = Mongoose.createConnection(mongoUrl, function () {
                    $scope.config();
                });
            } catch (err) {
                console.log(err);
            }
    });
    $scope.collections = [];
    $scope.config = function () {
        var db = $scope.db;
        var mgdb = Mongoose.connection.db;
        $scope.collections = []; // cleanup existing collections' name;
        db.connection.db.listCollections().toArray(function (err, names) {
            if (err) {
                return electron.dialog(err);
            }
            var collections = [];
            names.forEach(function (name) {
                collections.push(name);
            });
            $scope.$apply(function () {
                $scope.collections = collections;
                $scope.db_name = db.name;
            });
        });
    };

    $scope.useCollection = function (index) {
        var collection = $scope.collections[index];
        var cl = $scope.db.connection.db.collection(collection.name);
        cl.find({}, function (err, docs) {
            docs.toArray().then(function (d) {
                $scope.$apply(function () {
                    $scope.docLoader = new DocLoader();
                    $scope.docLoader.config(d);
                    $scope.collection = d;
                });
            });
        });
    };

    $scope.logs = [];
    $scope.commandBox = "";
    $scope.execCommand = function () {
        var cmd = $scope.commandBox;
        var db = $scope.db;
        var mg = Mongoose;
        var re = eval(cmd);
        $scope.logs.push(re);
    };

});

var DocLoader = function () {
    this.loadedPages = {};
    this.numItems = 0;
    this.PAGE_SIZE = 50;
};

DocLoader.prototype.config = function (collection) {
    this.collection = collection;
};

DocLoader.prototype.getItemAtIndex = function (index) {
    return this.collection[index];
};

DocLoader.prototype.getLength = function () {
    if (!this.collection) {
        return 0;
    }
    return this.collection.length;
};