import { getString } from '../../i18n/i18n.js';

/**
 * Creates a styled button for the bar
 * @param {string} icon - Material icon name
 * @param {string} tooltip - Tooltip text
 * @param {Function} onClick - Click handler function
 * @returns {import('gi://Gtk').Widget} - Button widget
 */
export const BarButton = (icon, tooltip, onClick) => {
    return Button({
        className: 'bar-button',
        tooltipText: tooltip || '',
        onClicked: onClick || (() => {}),
        child: Box({
            homogeneous: true,
            children: [
                Label({
                    className: 'icon-material txt-norm',
                    label: icon,
                }),
            ],
        }),
        setup: setupCursorHover,
    });
};

/**
 * Creates a module button that can be used to switch content in the bar
 * @param {string} moduleId - Unique identifier for the module
 * @param {string} icon - Material icon name
 * @param {string} name - Display name for the button (will be translated)
 * @param {Function} onActivate - Function to call when button is activated
 * @returns {import('gi://Gtk').Widget} - Module button widget
 */
export const ModuleButton = (moduleId, icon, name, onActivate) => {
    return Widget.Button({
        className: 'button-minsize bar-module-btn txt-small spacing-h-5',
        onClicked: (button) => {
            if (onActivate) onActivate(moduleId);
            
            // Toggle active state on this button and remove from siblings
            const kids = button.get_parent().get_children();
            for (let i = 0; i < kids.length; i++) {
                if (kids[i] != button) kids[i].toggleClassName('bar-module-btn-active', false);
                else button.toggleClassName('bar-module-btn-active', true);
            }
        },
        child: Box({
            className: 'spacing-h-5',
            children: [
                Label({
                    className: `txt icon-material`,
                    label: icon,
                }),
                Label({
                    label: getString(name) || name,
                    className: 'txt txt-smallie',
                }),
            ]
        }),
        setup: (button) => Utils.timeout(1, () => {
            setupCursorHover(button);
        })
    });
};

/**
 * Creates a command button that sends a specific command when clicked
 * @param {string} command - Command to execute
 * @param {string} displayName - Display name for the button (defaults to command)
 * @returns {import('gi://Gtk').Widget} - Command button widget
 */
export const CommandButton = (command, displayName = command) => Button({
    className: 'bar-command-chip bar-command-chip-action txt txt-small',
    onClicked: () => sendMessage(command),
    setup: setupCursorHover,
    label: displayName || command,
});
