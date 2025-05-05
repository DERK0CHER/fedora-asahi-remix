import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { TransparentBox } from '../components/transparent.js';
import { BarButton, SymbolicButton } from '../buttons.js';
import { getString } from '../../../i18n/i18n.js';

const { Box } = Widget;

/**
 * Creates the indicators section for the bar
 * @param {number} monitor - Monitor index
 * @returns {import('gi://Gtk').Widget} - Indicators widget
 */
export const Indicators = (monitor) => {
    return Box({
        className: 'bar-indicators spacing-h-5',
        children: [
            SymbolicButton('notification-symbolic', getString('Notifications'), () => {
                Utils.toggleWindow('sideright');
            }),
            SymbolicButton('preferences-system-symbolic', getString('Settings'), () => {
                Utils.execAsync(['bash', '-c', Utils.userOptions?.apps?.settings || 'gnome-control-center'])
                    .catch(console.error);
                Utils.closeEverything();
            }),
            SymbolicButton('system-shutdown-symbolic', getString('Power menu'), () => {
                // Toggle session menu
                Utils.toggleWindow(`session${monitor}`);
            }),
        ]
    });
};
