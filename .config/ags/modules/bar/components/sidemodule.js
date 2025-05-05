import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box } = Widget;

/**
 * Creates a container for side modules in the bar
 * @param {Array} children - Child widgets to include in the module
 * @param {Object} props - Additional properties to pass to the Box widget
 * @returns {import('gi://Gtk').Widget} - Box widget containing the side module
 */
export const SideModule = (children, props = {}) => Box({
    className: 'bar-sidemodule',
    children: children || [],
    ...props,
});
