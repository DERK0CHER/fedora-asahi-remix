import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { TransparentBox } from '../components/transparent.js';
import { BarButton, SymbolicButton } from '../buttons.js';
import { getString } from '../../../i18n/i18n.js';

const { Box, Label } = Widget;

/**
 * Creates the window title widget for the bar
 * @param {number} monitor - Monitor index
 * @returns {import('gi://Gtk').Widget} - Window title widget
 */
export const WindowTitle = async (monitor) => {
    // Get display server type
    const isHyprland = await Hyprland.client?.tryGet?.('activewindow').then(() => true).catch(() => false);
    
    return Box({
        className: 'spacing-h-5',
        children: [
            SymbolicButton('view-grid-symbolic', getString('Menu'), () => {
                // Toggle overview
                globalThis.toggleWindow?.('overview');
            }),
            isHyprland ? Box({
                className: 'bar-windowtitle spacing-h-5',
                children: [
                    Label({
                        maxWidthChars: 30,
                        truncate: 'end',
                        className: 'txt-small txt',
                        setup: (self) => self.hook(Hyprland.active.client, (self) => {
                            self.label = Hyprland.active.client.title || '';
                        }),
                    }),
                ]
            }) : null,
        ].filter(Boolean), // Remove null items
    });
};
