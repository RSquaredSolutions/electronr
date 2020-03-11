const builder = require('electron-builder');
const path = require('path');

const win32Targets = [{target: 'nsis', arch: ['x64', 'ia32']}]

/*
	--dir
	--mac
	--win
*/
let flags = process.argv;
let buildTargets;
let onlyDir = false;
const filenameFormat = 'electronr-${version}-${arch}.${ext}';

process.chdir(path.resolve(__dirname, '../'));

if (flags.length > 2) {
	flags = flags.slice(2)
	onlyDir = flags.includes('--dir')
}

buildTargets = flags.filter(el => ['--mac', '--win'].includes(el));
if (buildTargets.length === 0) {
	switch(process.platform) {
		case 'darwin':
			buildTargets.push('--mac');
			break;
		case 'win32':
			buildTargets.push('--win');
			break;
	}
}

if (buildTargets.length === 0) {
	process.exit(0);
}

const config = {
	appId: 'xyz.rsquaredsolutions.electronr',
	productName: 'ElectronR',
	npmRebuild: false,
	directories: {
		output: 'dist',
		buildResources: 'build'
	},
	afterSign: './build/after-sign.js',
	mac: {
		category: 'public.app-category.education',
		darkModeSupport: false,
		icon: './build/icon.icns',
		target: (onlyDir) ? 'dir' : 'dmg',
		artifactName: filenameFormat,
		hardenedRuntime: true,
		gatekeeperAssess: false,
		entitlements: path.join(__dirname, './build/entitlements.plist'),
		entitlementsInherit: path.join(__dirname, './build/entitlements.plist'),
		extraResources: [
			{
				from: './build/scripts',
				to: 'scripts'
			}
		]
	},
	win: {
		target: (onlyDir) ? 'dir' : win32Targets,
		artifactName: filenameFormat,
		icon: './build/icon.png',
		verifyCodeSignature: false,
		extraResources: [
			{
				from: './build/scripts',
				to: 'scripts'
			}
		]
	},
	dmg: {
		icon: './build/icon.icns',
		contents: [
			{
				x: 130,
				y: 220
			},
			{
				x: 410,
				y: 220,
				type: 'link',
				path: '/Applications'
			}
		],
		window: {
			width: 540,
			height: 400
		}
	},
	nsis: {
		oneClick: false,
		perMachine: false,
		allowElevation: true,
		allowToChangeInstallationDirectory: true,
		uninstallDisplayName: '${productName}'
	}
};

runBuilder().then(() => {
	// all done
}).catch((err) => {
	process.exit(1);
});

async function runBuilder() {
	for (let flag of buildTargets) {
		let target;
		if (flag === '--mac') target = Platform.MAC.createTarget();
		if (flag === '--win') target = Platform.WINDOWS.createTarget();
		await builder.build({'targets': target, 'config': config});
	}
};