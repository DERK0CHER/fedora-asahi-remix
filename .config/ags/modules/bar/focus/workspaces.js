import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { TransparentBox } from '../components/transparent.js';
import { getString } from '../../../i18n/i18n.js';

/**
 * Creates the focus mode workspaces widget for the bar
 * @returns {Promise<import('gi://Gtk').Widget>} - Focus workspaces widget
 */
export const FocusOptionalWorkspaces = async () => {
    // Determine which workspaces implementation to use based on available window manager
    try {
        // Try to use Hyprland workspaces if available
        const isHyprland = await Hyprland.client?.tryGet?.('activeworkspace').then(() => true).catch(() => false);
        
        if (isHyprland) {
            const { default: HyprlandWorkspaces } = await import('../focus/workspaces_hyprland.js');
            return HyprlandWorkspaces();
        } else {
            const { default: SwayWorkspaces } = await import('../focus/workspaces_sway.js');
            return SwayWorkspaces();
        }
    } catch (error) {
        console.error('Failed to load focus workspaces:', error);
        
        // Fallback to an empty box
        return TransparentBox({
            className: 'workspaces-container-focus',
            homogeneous: true,
        });
    }
};
