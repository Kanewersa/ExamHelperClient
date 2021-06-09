function initialize() {
    document.getElementById('minimize-button').addEventListener('click', () => {
        require('electron').remote.getCurrentWindow().minimize();
    });

    document.getElementById('control-button').addEventListener('click', () => {
        let window = require('electron').remote.getCurrentWindow();

        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    });

    document.getElementById('close-button').addEventListener('click', () => {
        Connection.close();
        require('electron').remote.getCurrentWindow().close();
    });
}

module.exports = {
    initialize: initialize
}