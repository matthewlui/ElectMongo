'use strict';
const electron = require('electron').remote;
const {ipcRenderer} = require('electron');
const Mongoose = require('mongoose');

var ngApp = angular.module('mgfire', ['ngRoute', "ngMaterial", "ngAnimate"]);

ngApp.controller('dbCtrl', function ($scope) {
    $scope.db_name = "Connecting";

    $scope.docLoader = new DocLoader();
    ipcRenderer.on('db-connect', function (event, data) {
        if (data) {
            $scope.db = data;
            try {
                $scope.db.connection = Mongoose.createConnection('mongodb://' + data.ip + ':' + data.port + '/' + data.name, function () {
                    $scope.config();
                });
            } catch (err) {
                console.log(err);
            }
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
        /** @type {number} Total number of items. */
        this.numItems = 0;
        /** @const {number} Number of items to fetch per request. */
        this.PAGE_SIZE = 50;
    };

    DocLoader.prototype.config = function (collection) {
        this.collection = collection;
    };

    DocLoader.prototype.getItemAtIndex = function (index) {
        return this.collection[index];
    };
    DocLoader.prototype.getLength = function () {
        if (!this.collection){
            return 0;
        }
        return this.collection.length;
    };