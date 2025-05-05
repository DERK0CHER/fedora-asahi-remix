import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { TransparentBox } from '../components/transparent.js';
import { getString } from '../../../i18n/i18n.js';

/**
 * Creates the normal workspaces widget for the bar
 * @returns {Promise<import('gi://Gtk').Widget>} - Workspaces widget
 */
export const NormalOptionalWorkspaces = async () => {
    // Determine which workspaces implementation to use based on available window manager
    try {
        // Try to use Hyprland workspaces if available
        const isHyprland = await Hyprland.client?.tryGet?.('activeworkspace').then(() => true).catch(() => false);
        
        if (isHyprland) {
            const { default: HyprlandWorkspaces } = await import('./workspaces_hyprland.js');
            return HyprlandWorkspaces();
        } else {
            const { default: SwayWorkspaces } = await import('./workspaces_sway.js');
            return SwayWorkspaces();
        }
    } catch (error) {
        console.error('Failed to load workspaces:', error);
        
        // Fallback to an empty box
        return TransparentBox({
            className: 'workspaces-container',
            homogeneous: true,
            children: [
                Widget.Label({
                    className: 'txt-small',
                    label: getString('No workspaces available'),
                }),
            ],
        });
    }
};
