// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog } = require('electron')
const os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// 单例
const getLock = app.requestSingleInstanceLock()

if(!getLock) {
  app.quit()
  return
}

let minHeight = 550;
let height = minHeight;

if (os.type() === 'Windows_NT') {
  minHeight = height = 564;
}

function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth:800,
    minHeight,
    width: 800,
    height,
    show: false,
    icon: 'assets/icon.png',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL('http://127.0.0.1:3000')
  } else {
    mainWindow.loadFile('./dist/index.html')
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // 解决首次打开白屏问题
  mainWindow.on('ready-to-show', function () {
    mainWindow.show()
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

// 打开目录或者文件
let singleDialog = null;
ipcMain.on('open-directory-dialog', function (event, options) {
  if (!singleDialog) {
    singleDialog = dialog.showOpenDialog(options).then(({ filePaths }) => {
      if (filePaths.length) {
        event.sender.send('selectedItem', filePaths[0]);
      }
    }).finally((e) => {
      singleDialog = null;
    })
  } else {
    event.sender.send('selectedItem', null);
  }
})
