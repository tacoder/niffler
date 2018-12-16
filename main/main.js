// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const VIEW_BASE_DIR = "./renderer/"

require('electron-debug')();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({/*transparent: true, frame: false,*/backgroundColor: '#111', 
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
  mainWindow.loadFile(VIEW_BASE_DIR + 'index.html')
// mainWindow.once('ready-to-show', () => {
//   mainWindow.show()
// })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
  if (mainWindow === null) {
    createWindow()
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
  console.log(arg) // prints "ping"
  console.log("Received fatal error")
  dialog.showErrorBox("Fatal error", "Niffler has encountered a fatal error it cannot recover from - " + JSON.stringify(arg))
  app.quit()
  // event.sender.send('asynchronous-reply', 'pong')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
