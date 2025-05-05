import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { TransparentBox } from '../components/transparent.js';

/**
 * Creates the content for the 'nothing' bar mode (empty bar)
 * @returns {import('gi://Gtk').Widget} - Empty bar content
 */
export const NothingContent = () => {
    return TransparentBox({
        className: 'bar-bg-nothing transparent-bg',
    });
};
