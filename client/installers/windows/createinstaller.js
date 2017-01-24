const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
     .then(createWindowsInstaller)
     .catch((error) => {
     console.error(error.message || error)
     process.exit(1)
 })

function getInstallerConfig () {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'release-builds')

    return Promise.resolve({
       appDirectory: path.join(outPath, 'CommanderLog-win32-ia32/'),
       loadingGif: path.join(rootPath, 'images', 'cmdrLoader.gif'),
       authors: 'Brian Kennedy',
       noMsi: true,
       outputDirectory: path.join(outPath, 'windows-installer'),
       exe: 'CommanderLog.exe',
       setupExe: 'CommanderLogInstaller.exe',
       iconUrl: 'https://github.com/bpkennedy/cmdr-logs/blob/master/commanderLog.ico'
   })
}
