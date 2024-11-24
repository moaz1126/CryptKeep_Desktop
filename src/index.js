const { app, BrowserWindow, ipcMain, Menu, shell} = require('electron');
const path = require('node:path');
const fs = require('fs');
const https = require('https'); // Ensure https is imported
const { exec } = require('child_process');
const { format } = require('url'); // Ensure the format function from the url module is imported
const https2 = require('follow-redirects').https;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow;
let newWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, 
      contextIsolation: false, 
      enableRemoteModule: true,
      webSecurity: false,
      devTools: false
    },
    icon: path.join(__dirname, 'icon2.png') // path to your icon
  });

  mainWindow.webContents.session.clearCache();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Exit', click: () => { app.quit(); } }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', role: 'minimize' },
        { label: 'Close', role: 'close' }
      ]
    },
    {
      label: 'Introduction',
      click: () => {
        mainWindow.webContents.send('open-new-window', 'Other/introduction.html');
      }
    },
    {
      label: 'About',
      submenu: [
        { 
          label: 'CryptKeep Website', 
          click: () => { shell.openExternal('https://cryptkeep-web.web.app/'); } 
        },
        { 
          label: 'Discord', 
          click: () => { shell.openExternal('https://discord.com/users/1064210185062719548'); } 
        },
        { 
          label: 'My Website', 
          click: () => { shell.openExternal('https://about-moaz1126.web.app/'); } 
        },
        { 
          label: 'Website Github', 
          click: () => { shell.openExternal('https://github.com/moaz1126/CryptKeep/'); } 
        },
        { 
          label: 'Desktop Github', 
          click: () => { shell.openExternal('https://github.com/moaz1126/CryptKeep_Desktop.git'); } 
        }
      ]
    }
    // ,
    // { 
    //   label: 'View',
    //   submenu: [ 
    //     {
    //        label: 'Reload', 
    //        role: 'reload' 
    //     }, 
    //     { 
    //       label: 'Toggle Developer Tools', 
    //       role: 'toggledevtools' } 
    //     ] 
    // }
  ];
  
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on('save-json', (event, jsonObject, fileName) => {
  const userDataPath = app.getPath('documents');
  const filePath = path.join(userDataPath, 'CryptKeep', fileName);

  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) {
      event.reply('save-json-reply', 'Failed to create directory');
      return;
    }

    fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), (err) => {
      if (err) {
        event.reply('save-json-reply', 'Failed to save file');
      } else {
        event.reply('save-json-reply', `File has been saved to ${filePath}`);
      }
    });
  });
});


// Add this handler for deleting the file
ipcMain.on('delete-json', (event, fileName) => {
  const userDataPath = app.getPath('documents');
  const filePath = path.join(userDataPath, 'CryptKeep', fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      event.reply('delete-json-reply', `Failed to delete file: ${filePath}`);
    } else {
      event.reply('delete-json-reply', `File deleted: ${filePath}`);
    }
  });
});


// Add this handler for reading the file
ipcMain.on('read-json', (event, fileName) => {
  const userDataPath = app.getPath('documents');
  const filePath = path.join(userDataPath, 'CryptKeep', fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      event.reply('read-json-reply', `Failed to read file: ${filePath}`);
    } else {
      event.reply('read-json-reply', data);
    }
  });
});



// ipcMain.on('download-and-run', (event, fileUrl) => {
//   const downloadsPath = app.getPath('downloads');
//   const fileName = path.basename(fileUrl.split('?')[0]);
//   const filePath = path.join(downloadsPath, fileName);
//   const file = fs.createWriteStream(filePath);

//   https.get(fileUrl, (response) => {
//     const totalBytes = parseInt(response.headers['content-length'], 10);
//     let downloadedBytes = 0;

//     response.pipe(file);

//     response.on('data', (chunk) => {
//       downloadedBytes += chunk.length;
//       const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
//       event.sender.send('download-progress', progress);
//     });

//     file.on('finish', () => {
//       file.close(() => {
//         console.log('Download completed.');
//         event.sender.send('download-complete', filePath);
//       });
//     });
//   }).on('error', (err) => {
//     fs.unlink(filePath, () => {});
//     console.error('Download error:', err);
//   });
// });

ipcMain.on('download-and-run', (event, fileUrl) => {
  const downloadsPath = app.getPath('downloads');
  const fileName = path.basename(fileUrl.split('?')[0]);
  const filePath = path.join(downloadsPath, fileName);
  const file = fs.createWriteStream(filePath);

  const request = https2.get(fileUrl, (response) => {
    if (response.statusCode === 200) {
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let downloadedBytes = 0;

      response.pipe(file);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
        event.sender.send('download-progress', progress);
      });

      file.on('finish', () => {
        file.close(() => {
          console.log('Download completed.');
          event.sender.send('download-complete', filePath);
        });
      });
    } else if (response.statusCode === 302 || response.statusCode === 301) {
      https.get(response.headers.location, (res) => {
        res.pipe(file);
      });
    } else {
      console.error('Download failed:', response.statusCode);
      event.sender.send('download-error', `Download failed: ${response.statusCode}`);
    }
  });

  request.on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error('Download error:', err);
    event.sender.send('download-error', err.message);
  });
  request.setTimeout(15000, () => {
    request.abort();
    fs.unlink(filePath, () => {});
    console.error('Request timed out', fileUrl);
    event.sender.send('download-error', 'Request timed out');
  });
  
});


ipcMain.on('run-installer', (event, filePath) => {
  exec(filePath, (err) => {
    if (err) {
      console.error('Execution error:', err);
    } else {
      console.log('File executed successfully.');
      app.quit(); // Close the Electron app after running the installer
    }
  });
});


ipcMain.on('open-new-window', (event, fileName) => {
  newWindow = new BrowserWindow({
    width: 800,
    height: 800,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false, // This disables web security, allowing local resources to be loaded
      devTools: false, // This disables DevTools
    },
    icon: path.join(__dirname, 'icon2.png') // path to your icon
  });
  // Menu.setApplicationMenu(null);
  newWindow.loadURL(format({
    pathname: path.join(__dirname, fileName),
    protocol: 'file:',
    slashes: true
  })).catch(err => console.error('Failed to load file:', err));
  newWindow.setMenu(null); 
  newWindow.on('closed', () => {
    newWindow = null;
  });
});


// IPC handler to close the new window
ipcMain.on('close-new-window', () => {
  if (newWindow) {
    newWindow.close();
  }
});


function getCpuSerialNumber() {
  return new Promise((resolve, reject) => {
    exec('wmic cpu get ProcessorId', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return resolve('');  // Use resolve instead of reject to handle errors gracefully
      }
      const cpuSerial = stdout.split('\n')[1].trim();
      resolve(cpuSerial);
    });
  });
}

function getMotherboardSerialNumber() {
  return new Promise((resolve, reject) => {
    exec('wmic baseboard get SerialNumber', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return resolve('');  // Use resolve instead of reject to handle errors gracefully
      }
      const serialNumber = stdout.split('\n')[1].trim();
      resolve(serialNumber);
    });
  });
}


ipcMain.on('get-cpu-serial', async (event) => {
  const CPU = await getCpuSerialNumber();
  event.sender.send('cpu-num', CPU);
});



