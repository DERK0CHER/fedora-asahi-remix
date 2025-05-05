import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Gtk from 'gi://Gtk';
import GLib from 'gi://GLib';
import { iconExists } from './icons.js';
import { darkMode } from './system.js';

const { Icon } = Widget;

/**
 * Check if a slim icon exists in the assets/applicons/slim directory
 * @param {string} iconName - Name of the icon without extension
 * @returns {boolean} - Whether the icon exists
 */
export function slimIconExists(iconName) {
    const iconPath = `${App.configDir}/assets/applicons/slim/${iconName}.svg`;
    return GLib.file_test(iconPath, GLib.FileTest.EXISTS);
}

/**
 * Get the icon path or name, preferring slim icons when available
 * @param {string} iconName - Name of the icon (standard symbolic name)
 * @returns {string} - Path to slim icon or symbolic icon name
 */
export function getSymbolicIcon(iconName) {
    // Some icon names need translation between symbolic names and slim names
    const nameMap = {
        // Network icons
        'network-wireless-signal-excellent-symbolic': 'network-wifi-signal-excellent-symbolic',
        'network-wireless-signal-good-symbolic': 'network-wifi-signal-good-symbolic',
        'network-wireless-signal-ok-symbolic': 'network-wifi-signal-ok-symbolic',
        'network-wireless-signal-weak-symbolic': 'network-wifi-signal-weak-symbolic',
        'network-wireless-signal-none-symbolic': 'network-wifi-signal-none-symbolic',
        'network-wired-symbolic': 'network-wired',
        'network-wired-acquiring-symbolic': 'network-wired-acquiring',
        'network-wired-disconnected-symbolic': 'network-wired-disconnected',
        
        // Audio icons
        'audio-volume-high-symbolic': 'audio-volume-high',
        'audio-volume-medium-symbolic': 'audio-volume-medium',
        'audio-volume-low-symbolic': 'audio-volume-low',
        'audio-volume-muted-symbolic': 'audio-volume-muted',
        
        // Microphone icons
        'microphone-sensitivity-high-symbolic': 'microphone-sensitivity-high',
        'microphone-sensitivity-medium-symbolic': 'microphone-sensitivity-medium',
        'microphone-sensitivity-low-symbolic': 'microphone-sensitivity-low',
        'microphone-sensitivity-muted-symbolic': 'microphone-sensitivity-muted',
        
        // Battery icons
        'battery-full-symbolic': 'battery-full',
        'battery-good-symbolic': 'battery-good',
        'battery-low-symbolic': 'battery-low',
        'battery-empty-symbolic': 'battery-empty',
        'battery-full-charging-symbolic': 'battery-full-charging',
        'battery-good-charging-symbolic': 'battery-good-charging',
        'battery-low-charging-symbolic': 'battery-low-charging',
        'battery-empty-charging-symbolic': 'battery-empty-charging',
        
        // Bluetooth icons
        'bluetooth-active-symbolic': 'bluetooth-active',
        'bluetooth-disabled-symbolic': 'bluetooth-disabled',
        
        // Notification icons
        'notification-symbolic': 'notification',
        'notification-new-symbolic': 'notification-new',
        
        // System icons
        'system-shutdown-symbolic': 'system-shutdown',
        'preferences-system-symbolic': 'preferences-system',
        'view-grid-symbolic': 'view-grid',
        
        // Dialog icons
        'dialog-information-symbolic': 'dialog-information',
        'dialog-warning-symbolic': 'dialog-warning',
        'dialog-error-symbolic': 'dialog-error',
    };

    // Map the icon name if it's in our mapping
    const mappedName = nameMap[iconName] || iconName;
    
    // First, remove any '-symbolic' suffix to check for the slim icon
    const baseName = mappedName.replace(/-symbolic$/, '');
    
    // Check if a slim version exists
    if (slimIconExists(baseName)) {
        return `${App.configDir}/assets/applicons/slim/${baseName}.svg`;
    }
    
    // If no slim version, use the symbolic name if it exists in the theme
    if (iconExists(iconName)) {
        return iconName;
    }
    
    // Otherwise, try the mapped name or a generic fallback
    return iconExists(mappedName) ? mappedName : 'dialog-information-symbolic';
}

/**
 * Creates an icon widget using slim icons when available with symbolic fallback
 * @param {string} iconName - Name of the icon (standard symbolic name)
 * @param {Object} props - Additional properties for the Icon widget
 * @returns {import('gi://Gtk').Widget} - Icon widget
 */
export const SymbolicIcon = (iconName, props = {}) => {
    // Always use black icons - no automatic color detection
    return Icon({
        ...props,
        className: `symbolic-icon symbolic-icon-${darkMode.value ? 'dark' : 'light'} ${props.className || ''}`,
        icon: getSymbolicIcon(iconName),
    });
};
