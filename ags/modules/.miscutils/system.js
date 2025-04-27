const { GLib } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
import { fileExists } from './files.js';

export const distroID = exec(`bash -c 'cat /etc/os-release | grep "^ID=" | cut -d "=" -f 2 | sed "s/\\"//g"'`).trim();
export const isDebianDistro = (distroID == 'linuxmint' || distroID == 'ubuntu' || distroID == 'debian' || distroID == 'zorin' || distroID == 'popos' || distroID == 'raspbian' || distroID == 'kali');
export const isArchDistro = (distroID == 'arch' || distroID == 'endeavouros' || distroID == 'cachyos');
export const hasFlatpak = !!exec(`bash -c 'command -v flatpak'`);

const LIGHTDARK_FILE_LOCATION = `${GLib.get_user_state_dir()}/ags/user/colormode.txt`;
export const darkMode = Variable(!(Utils.readFile(LIGHTDARK_FILE_LOCATION).split('\n')[0].trim() == 'light'));
darkMode.connect('changed', ({ value }) => {
    let lightdark = value ? "dark" : "light";
    execAsync([`bash`, `-c`, `mkdir -p ${GLib.get_user_state_dir()}/ags/user && sed -i "1s/.*/${lightdark}/"  ${GLib.get_user_state_dir()}/ags/user/colormode.txt`])
        .then(execAsync(['bash', '-c', `${App.configDir}/scripts/color_generation/switchcolor.sh`]))
        .then(execAsync(['bash', '-c', `command -v darkman && darkman set ${lightdark}`])) // Optional darkman integration
        .catch(print);
});
globalThis['darkMode'] = darkMode;
export const hasPlasmaIntegration = !!Utils.exec('bash -c "command -v plasma-browser-integration-host"');

// Apply the glass effect overlay
const GLASS_STYLE_PATH = `${App.configDir}/style_glass_effect.css`;
if (!fileExists(GLASS_STYLE_PATH)) {
    Utils.writeFile(`/* Glass Effect Style */
/* Apply translucent glass effect to backgrounds */
.bar-bg,
.bar-group, 
.bar-group-borderless,
.sidebar-right, 
.sidebar-left,
.osd-window,
.overview-window,
.overview-search-results,
.overview-search-box,
.sidebar-module,
.sidebar-module-btn,
.sidebar-chat-wrapper,
.sidebar-centermodules-bottombar-button,
.sidebar-wifinetworks-network,
.sidebar-bluetooth-device,
.sidebar-calendar,
.session-bg,
.session-button,
.sidebar-todo-item,
.sidebar-calendar-btn,
.indicator,
.corner,
.corner-black,
.dock-bg,
.osd-color,
.system-menu,
.menu {
    background-color: rgba(0, 0, 0, 0) !important; /* Fully transparent */
    box-shadow: none !important;
    backdrop-filter: blur(10px) !important;
    -gtk-icon-shadow: none !important;
    border: none !important;
}

/* Dark theme version elements that need special handling */
.bar-bg-focus,
.osd-bg,
.osd-window {
    background-color: rgba(0, 0, 0, 0) !important; /* Fully transparent */
    box-shadow: none !important;
    backdrop-filter: blur(10px) !important;
    border: none !important;
}

/* Remove backgrounds from icon containers */
.sidebar-calendar-btn-arrow,
.sidebar-module-btn-arrow,
.sidebar-module-btn-icon,
.sidebar-bluetooth-appicon,
.sidebar-wifinetworks-icon,
.overview-search-results-icon,
.bar-group-pad,
.bar-group-pad-system,
.sidebar-moduleheader-box {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

/* Make all boxes transparent */
.bar-group-margin,
.bar-sides,
.bar-corner-spacing,
.sidebar-search-prompt-box,
.sidebar-volmixer-stream,
.sidebar-iconbutton,
.sidebar-group,
.sidebar-group-invisible-morehorizpad,
.sidebar-navrail,
.sidebar-icontabswitcher,
.sidebar-icon-actions,
* {
    background-color: transparent !important;
}`, GLASS_STYLE_PATH);
}

// Load the glass effect stylesheet
App.connect('config-parsed', () => {
    App.applyCss(GLASS_STYLE_PATH);
    
    // Add additional global transparency styles
    App.applyCss(`
        /* Global transparency styles */
        * {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
        }
        
        .bar-group-standalone,
        .overview-search-result-btn,
        .osd-music,
        .sidebar-left,
        .sidebar-right,
        .panel {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
        }
        
        /* Keep icons visible */
        .icon,
        .icon-material,
        .symbolic-icon {
            color: inherit !important;
        }
    `);
});

export const getDistroIcon = () => {
    // Always return symbolic icons
    // Arches
    if(distroID == 'arch') return 'arch-symbolic';
    if(distroID == 'endeavouros') return 'endeavouros-symbolic';
    if(distroID == 'cachyos') return 'cachyos-symbolic';
    // Funny flake
    if(distroID == 'nixos') return 'nixos-symbolic';
    // Cool thing
    if(distroID == 'fedora') return 'fedora-symbolic';
    // Debians
    if(distroID == 'linuxmint') return 'ubuntu-symbolic';
    if(distroID == 'ubuntu') return 'ubuntu-symbolic';
    if(distroID == 'debian') return 'debian-symbolic';
    if(distroID == 'zorin') return 'ubuntu-symbolic';
    if(distroID == 'popos') return 'ubuntu-symbolic';
    if(distroID == 'raspbian') return 'debian-symbolic';
    if(distroID == 'kali') return 'debian-symbolic';
    return 'linux-symbolic';
}

export const getDistroName = () => {
    // Arches
    if(distroID == 'arch') return 'Arch Linux';
    if(distroID == 'endeavouros') return 'EndeavourOS';
    if(distroID == 'cachyos') return 'CachyOS';
    // Funny flake
    if(distroID == 'nixos') return 'NixOS';
    // Cool thing
    if(distroID == 'fedora') return 'Fedora';
    // Debians
    if(distroID == 'linuxmint') return 'Linux Mint';
    if(distroID == 'ubuntu') return 'Ubuntu';
    if(distroID == 'debian') return 'Debian';
    if(distroID == 'zorin') return 'Zorin';
    if(distroID == 'popos') return 'Pop!_OS';
    if(distroID == 'raspbian') return 'Raspbian';
    if(distroID == 'kali') return 'Kali Linux';
    return 'Linux';
}