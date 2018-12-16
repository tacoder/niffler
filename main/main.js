// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const VIEW_BASE_DIR = "./renderer/"

require('electron-debug')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow, dashboardWindow

function createLoginWindow () {
  // Create the browser window.
  loginWindow = new BrowserWindow({
    backgroundColor: '#111', 
    titleBarStyle: 'hiddenInset', 
    width: 800, 
    height: 600, 
    minWidth: 800, 
    minHeight: 600, 
    title:'Niffler', 
    fullscreenable:false,
    maximizable:false
  })

  // and load the index.html of the app.
  loginWindow.loadFile(VIEW_BASE_DIR + 'login.html')

  // Emitted when the window is closed.
  loginWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loginWindow = null
  })
}

function createDashboardWindow(username){
  // Create the browser window.
  dashboardWindow = new BrowserWindow({
    width: 800, 
    height: 600, 
    minWidth: 800, 
    minHeight: 600, 
    title:'Dashboard'
  })

  // and load the index.html of the app.
  dashboardWindow.loadFile(VIEW_BASE_DIR + 'dashboard.html')

  // Emitted when the window is closed.
  dashboardWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    dashboardWindow = null
  })

  ipcMain.on('fetch-username',function(event){
    event.returnValue = username;
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoginWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWindow === null) {
    createLoginWindow()
  }
})

ipcMain.on('fatal-error', (event, arg) => {
  console.log(arg) // prints "ping"
  console.log("Received fatal error")
  dialog.showErrorBox("Fatal error", "Niffler has encountered a fatal error it cannot recover from - " + arg.message)
  app.quit()
  // event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('open-user', (event, arg) => {
  console.log("Opening user - " + JSON.stringify(arg)) // prints "ping"
  loginWindow.destroy();
  createDashboardWindow(arg.username);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
