import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import GLib from 'gi://GLib';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { setupCursorHover } from '../.widgetutils/cursorhover.js';
import { MaterialIcon } from './materialicon.js';
import { getString } from '../i18n/i18n.js';

const { Box, Button, Label } = Widget;

// Define some predefined themes with their colors
const PREDEFINED_THEMES = [
    {
        name: 'Terminal',
        icon: 'terminal',
        primary: '#33FF33', // Terminal green
        secondary: '#CCCCCC',
        background: '#000000',
        description: getString('Classic terminal green on black'),
    },
    {
        name: 'Monokai',
        icon: 'code',
        primary: '#F92672', // Monokai pink
        secondary: '#A6E22E', // Monokai green
        background: '#272822', // Monokai background
        description: getString('Monokai code editor theme'),
    },
    {
        name: 'Nord',
        icon: 'filter_drama',
        primary: '#88C0D0', // Nord blue
        secondary: '#EBCB8B', // Nord yellow
        background: '#2E3440', // Nord background
        description: getString('Nord - cold arctic theme'),
    },
    {
        name: 'Solarized',
        icon: 'sunny',
        primary: '#268BD2', // Solarized blue
        secondary: '#859900', // Solarized green
        background: '#002B36', // Solarized dark background
        description: getString('Solarized dark theme'),
    },
    {
        name: 'Dracula',
        icon: 'nightlight',
        primary: '#BD93F9', // Dracula purple
        secondary: '#FF79C6', // Dracula pink
        background: '#282A36', // Dracula background
        description: getString('Dracula - dark and colorful'),
    },
    {
        name: 'Gruvbox',
        icon: 'forest',
        primary: '#FB4934', // Gruvbox red
        secondary: '#FABD2F', // Gruvbox yellow
        background: '#282828', // Gruvbox background
        description: getString('Gruvbox - retro groove theme'),
    },
];

/**
 * Apply a predefined theme
 * @param {Object} theme - Theme object with color definitions
 */
function applyTheme(theme) {
    // Create directory if it doesn't exist
    Utils.exec(`mkdir -p ${GLib.get_user_state_dir()}/ags/user`);
    
    // Apply the theme using the switchcolor.sh script
    Utils.execAsync([
        'bash', '-c', 
        `${App.configDir}/scripts/color_generation/switchcolor.sh "${theme.primary}" --theme="${theme.name.toLowerCase()}" --force-dark`
    ]).catch(print);
    
    // Show notification
    Utils.execAsync([
        'notify-send', 
        getString('Theme Applied'), 
        getString('Switched to: ') + theme.name, 
        '-i', 'preferences-color',
        '-a', 'AGS'
    ]).catch(print);
}

/**
 * Create a single theme selection button
 * @param {Object} theme - Theme object with name, colors, and icon
 * @returns {import('gi://Gtk').Widget} - Theme button widget
 */
const ThemeSelectionButton = (theme) => {
    return Button({
        className: 'theme-selection-button',
        tooltipText: theme.description,
        child: Box({
            vertical: true,
            className: 'spacing-v-5 padding-10',
            children: [
                MaterialIcon(theme.icon, 'large'),
                Label({
                    label: theme.name,
                    className: 'txt-small',
                }),
                Box({
                    className: 'theme-color-preview spacing-h-5',
                    children: [
                        Box({
                            className: 'theme-color-sample',
                            styleString: `background-color: ${theme.primary};`,
                        }),
                        Box({
                            className: 'theme-color-sample',
                            styleString: `background-color: ${theme.secondary};`,
                        }),
                        Box({
                            className: 'theme-color-sample',
                            styleString: `background-color: ${theme.background};`,
                        }),
                    ],
                }),
            ],
        }),
        onClicked: () => applyTheme(theme),
        setup: setupCursorHover,
    });
};

/**
 * Create a grid of theme selection buttons
 * @returns {import('gi://Gtk').Widget} - Theme selection grid
 */
export const ThemeSelector = () => {
    return Box({
        className: 'theme-selector-grid',
        homogeneous: true,
        children: PREDEFINED_THEMES.map(theme => ThemeSelectionButton(theme)),
    });
};
