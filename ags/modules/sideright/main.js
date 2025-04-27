import PopupWindow from '../.widgethacks/popupwindow.js';
import SidebarRight from "./sideright.js";
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box, EventBox } = Widget;

export default () => PopupWindow({
    keymode: 'on-demand',
    anchor: ['right', 'top', 'bottom'],
    name: 'sideright',
    layer: 'top',
    child: Box({
        className: 'transparent-bg', // Add a class for CSS targeting
        css: 'background-color: transparent !important;', // Direct CSS transparency
        children: [
            // Create a simple EventBox to handle click-to-close instead of using clickCloseRegion
            EventBox({
                css: 'background-color: transparent !important;',
                onPrimaryClick: () => App.closeWindow('sideright'),
                onSecondaryClick: () => App.closeWindow('sideright'),
                onMiddleClick: () => App.closeWindow('sideright'),
            }),
            SidebarRight(),
        ]
    })
});