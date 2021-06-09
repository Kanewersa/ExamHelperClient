const {app, BrowserWindow, Menu, ipcMain} = require("electron");

const mainMenuTemplate = [];

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    // and load the index.html of the app.
    win.loadFile("App/index.html");
}

function createMainMenu() {
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}

app.on('ready', createWindow);
app.on('ready', createMainMenu);


if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'F12',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
    mainMenuTemplate.push({
        label: 'Exit',
        accelerator: "ESC",
        click(item, focusedWindow) {
            win.webContents.send('pressed-esc', null);
        }
    });
}