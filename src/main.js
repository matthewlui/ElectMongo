"use strict";

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
let mainWindow;


function createWindow(){
  mainWindow = new BrowserWindow({width:400,height:600,titleBarStyle: 'hidden'});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed',function(){
    mainWindow = null;
  });
}

app.on('will-quit',function(){
  var wins = BrowserWindow.getAllWindows();
  wins.forEach(function(win){win.close()});
})

app.on('ready',createWindow);
app.on('window-all-closed',function(){
  if (process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate',function(){
  if(mainWindow === null){
    createWindow();
  }
  app.show();
});
