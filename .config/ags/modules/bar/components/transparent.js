import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box } = Widget;

/**
 * Creates a transparent box container
 * @param {Object} props - Properties for the Box widget
 * @returns {import('gi://Gtk').Widget} - Transparent Box widget
 */
export const TransparentBox = (props = {}) => Box({
    className: 'transparent-bg',
    ...props,
    setup: (self) => {
        // Ensure the transparent style is applied
        self.get_style_context().add_class('transparent-bg');
        
        // Call the original setup if provided
        if (props.setup) props.setup(self);
    },
});
