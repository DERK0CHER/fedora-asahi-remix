import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import { StatusIcons } from '../../.commonwidgets/statusicons.js';

// Battery widget that shows icon and percentage when available
const BatteryWidget = () => Widget.Box({
    className: 'bar-batt',
    visible: Battery.available,
    children: [
        Widget.Icon({
            icon: Battery.bind('icon_name'),
        }),
        Widget.Label({
            label: Battery.bind('percent').transform(p => `${p}%`),
        }),
    ],
});

// This function creates the right side of the bar
export default (monitor = 0, moveBatteryLeft = false) => {
    // Create a box for the right side containing battery and system icons
    const rightSideBox = Widget.Box({
        className: 'spacing-h-5',
        hpack: 'end',
        children: [
            StatusIcons({}, monitor),
        ],
    });

    // If moveBatteryLeft is true, create a box that has battery on the left
    // followed by other indicators
    if (moveBatteryLeft) {
        return Widget.Box({
            className: 'spacing-h-10',
            hpack: 'end',
            children: [
                BatteryWidget(),
                rightSideBox,
            ],
        });
    }
    
    // Otherwise, default behavior (battery is part of StatusIcons)
    return rightSideBox;
};