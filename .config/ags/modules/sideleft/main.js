import PopupWindow from '../.widgethacks/popupwindow.js';
import SidebarLeft from "./sideleft.js";
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box, EventBox } = Widget;

export default () => PopupWindow({
    keymode: 'on-demand',
    anchor: ['left', 'top', 'bottom'],
    name: 'sideleft',
    layer: 'top',
    child: Box({
        className: 'transparent-bg', // Add a class for CSS targeting
        css: 'background-color: transparent !important;', // Direct CSS transparency
        children: [
            SidebarLeft(),
            // Create a simple EventBox to handle click-to-close instead of using clickCloseRegion
            EventBox({
                css: 'background-color: transparent !important;',
                onPrimaryClick: () => App.closeWindow('sideleft'),
                onSecondaryClick: () => App.closeWindow('sideleft'),
                onMiddleClick: () => App.closeWindow('sideleft'),
            }),
        ]
    })
});