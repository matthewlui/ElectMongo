'use strict';

const electron = require('electron').remote;
const {ipcRenderer} = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const {app} = require('electron');
const Request = require('request');
const Storage = require( path.join(__dirname , './app/js/storage.js'));

let dbWindow;

var ngApp = angular.module('mgfire',['ngRoute',"ngMaterial","ngAnimate"]);
ngApp.controller('mainCtrl',function($scope){
    
    $scope.ip = "127.0.0.1";
    $scope.port = 80;
    $scope.db_name = "mydb";
    $scope.showlog = false;
    $scope.log = "No logs";

    $scope.setup = function(){
        var storage = new Storage();
        $scope.storage = storage;
        storage.ready().then(function(s){
            $scope.setting = storage.load("setting");
            $scope.config();
        });
        Request("https://www.chatboy.xyz/log",function(err,res,body){
            $scope.log = body;
        });
    };
    
    $scope.config = function(){
        var setting = $scope.setting;
        if (!setting) return;
        $scope.$apply(function(){
            $scope.db_name = setting.name;
            $scope.ip = setting.ip;
            $scope.port = setting.port;
            $scope.username = setting.username;
            $scope.password = setting.password;
        });

    };

    $scope.switchShowlog = function(){
        $scope.showlog = !$scope.showlog;
    };

    $scope.connect = function(){
        $scope.log = $scope.log + "\n" + "will connect to " + $scope.ip + ":" + $scope.port;
        var db = {name:$scope.db_name,ip:$scope.ip,port:$scope.port};
        if (!dbWindow){
            createDBWindow();
        }
        dbWindow.webContents.on('did-finish-load',function(){
            dbWindow.webContents.send('db-connect',{name:$scope.db_name,ip:$scope.ip,port:$scope.port});
        });
        $scope.saveSetting(db);
    };

    $scope.saveSetting = function(setting){
        $scope.storage.ready().then(function(s){
            s.edited('setting',setting);
        });
    };
    $scope.setup();
});

function createDBWindow(){
    dbWindow = new BrowserWindow({width:800,height:600});
    dbWindow.loadURL('file://'+__dirname+"/db.html");
    dbWindow.on('closed',function(){
        dbWindow = null;
    });
}

var storage;
var setting;
var defualtFile;

function config(setting){
    var defaultFileName = setting.default;
    if (!defaultFileName){
        return;
    }
    var doc = storage.load(defaultFileName);
    var ip = doc.ip;
    var port = doc.port;
    var username = doc.username;
    var password = doc.password;
    if (ip&&port) {
        if (username){
            if (password){

            }
        }
    }
}

function connect(){

}



