/**
 * @module mainCtrl
 * 
 * @description Entrance of app. Manage user infomation, start a connection
 * 
 * @todo support multiple connection by creating dbWindows as an Array 
 * to hold different connection window and change connect button to save,
 * move connect to eact datagrid
 */

'use strict';

const electron = require('electron').remote;
const {ipcRenderer} = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const {app} = require('electron');
const Request = require('request');
const Storage = require( path.join(__dirname , './app/js/storage.js'));

let dbWindow;


var ngApp = angular.module('electmongo',['ngRoute',"ngMaterial","ngAnimate"]);
ngApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-green');
    //  .primaryPalette('pink')
    //  .accentPalette('orange');
    $mdThemingProvider.theme('alt-dark')
        .primaryPalette('blue');
});
ngApp.controller('mainCtrl',function($scope){
    
    $scope.ip = "127.0.0.1";
    $scope.port = 80;
    $scope.db_name = "mydb";
    $scope.showlog = false;
    $scope.logs = ["No logs"];

    /// methods
    $scope.setup = function(){
        var storage = new Storage();
        $scope.storage = storage;
        storage.ready().then(function(s){
            $scope.setting = storage.load("setting");
            $scope.config();
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
        $scope.logs.push("will connect to " + $scope.ip + ":" + $scope.port);
        var db = {name:$scope.db_name,ip:$scope.ip,port:$scope.port};
        if (!dbWindow){
            createDBWindow();
        }
        /// Trigger event of dbWindow to connect after the js context are loaded.
        dbWindow.webContents.on('did-finish-load',function(){
            dbWindow.webContents.send('db-connect',{name:$scope.db_name,ip:$scope.ip,port:$scope.port,username:$scope.username,password:$scope.password});
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

///Convenient mehtod to construct window.
///@todo centralize this method when main.js has exact the same;
function createDBWindow(){
    dbWindow = new BrowserWindow({width:800,height:600,titleBarStyle:'hidden'});
    dbWindow.loadURL('file://'+__dirname+"/db.html");
    dbWindow.on('closed',function(){
        dbWindow = null;
    });
}