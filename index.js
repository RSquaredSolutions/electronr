'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const windowStateKeeper = require('electron-window-state');
const {download} = require("electron-dl");
const fs = require('fs');

const Store = require('electron-store');
const store = new Store();

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('xyz.rsquaredsolutions.electronr');

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1024,
		defaultHeight: 768
	  });

	const win = new BrowserWindow({
		title: app.getName(),
		show: false,
		// width: 1024,
		// height: 768,
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#ffffff',
		transparent: false,
		icon: path.join(__dirname, 'build/icon.png'),
		webPreferences: {
			nodeIntegration: true,
			defaultEncoding: 'UTF-8',
			disableBlinkFeatures: "Auxclick"
		}
	});

	mainWindowState.manage(win);

	win.on('ready-to-show', () => {
		win.show();
	});

	win.webContents.on('did-finish-load', () => {
		win.webContents.setZoomFactor(1);
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'index.html'));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	prep_files_and_settings();

	await app.whenReady();
	mainWindow = await createMainWindow();
})();



function prep_files_and_settings() {
	const appVersion = require(path.join(app.getAppPath(), "package.json")).version;
	store.set("version", appVersion);

	let resourcesPath = process.resourcesPath;

	//let RPortablePath = path.join(resourcesPath, "R-Portable", "bin", "RScript.exe");
	//let RPath = path.join(resourcesPath, "R-Portable", "bin", "R.exe");
	//let RToolsPath = path.join(resourcesPath, "R-Portable", "Rtools.exe");
	//let RPackageSourcePath = path.join(resourcesPath, "packages");
     
        let RScriptPath = "";
        if(process.platform == "linux")
           RScriptPath = "Rscript"
        if(process.platform == "win32")   
	  RScriptPath = "C:\\Program Files\\R\\R-3.6.2\\bin\\RScript.exe";	// TODO: static path as dictated by Docker install?
	let RAnalysisPath = path.join(resourcesPath, "scripts");
	
	if (is.development) {
		resourcesPath = path.join(__dirname, "build");

		// RPortablePath = path.join(
		// 	resourcesPath, 
		// 	"R-Portable", 
		// 	is.macos ? "R-Portable-Mac" : "R-Portable-Win",
		// 	"bin", 
		// 	"RScript.exe");

		// RPath = path.join(
		// 	resourcesPath, 
		// 	"R-Portable", 
		// 	is.macos ? "R-Portable-Mac" : "R-Portable-Win",
		// 	"bin", 
		// 	"R.exe");

		// RToolsPath = path.join(
		// 	resourcesPath, 
		// 	is.macos ? "R-Portable-Mac" : "R-Portable-Win",
		// 	"Rtools.exe");

		// RPackageSourcePath = path.join(
		// 	resourcesPath,
		// 	"packages"
		// );

		RAnalysisPath = path.join(
			resourcesPath,
			"scripts"
		);
	}

	store.set("app.resources_path", resourcesPath);	// path to resources (i.e. from "build")
	store.set("app.rscript_path", RScriptPath);	// path to RScript.exe 
	//store.set("app.r_path", RPath);
	//store.set("app.rtools_path", RToolsPath);
	//store.set("app.r_package_source_path", RPackageSourcePath);
	store.set("app.r_analysis_path", RAnalysisPath);	// path to app's analysis files (R, csv, etc)


	let userDataPath = app.getPath("userData");
	//let userPackagesPath = path.join(userDataPath, "packages");
	let userAnalysisPath = path.join(userDataPath, "analysis");	
	
	store.set("user.userdata_path", userDataPath);	//user's temp directory
	//store.set("user.packages_path", userPackagesPath);
	store.set("user.analysis_path", userAnalysisPath);	//used for temporary analysis files (inputs/outputs)

	//make_directory(userPackagesPath);
	make_directory(userAnalysisPath);
}



function make_directory(dir) {
	if (!fs.existsSync(dir)){ 
		try {
			fs.mkdirSync(dir);
		} catch (err) {
			console.log("Unable to create directory: " + err);
		}
	}
};
