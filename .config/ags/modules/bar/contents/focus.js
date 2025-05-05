import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { TransparentBox } from '../components/transparent.js';
import { SideModule } from '../components/sidemodule.js';

/**
 * Creates the content for the focus bar mode
 * @param {Object} params - Parameters including monitor and components
 * @returns {import('gi://Gtk').Widget} - Focus bar content
 */
export const FocusBarContent = async ({ monitor, components }) => {
    const { FocusOptionalWorkspaces, Battery } = components;
    
    return TransparentBox({
        className: 'bar-bg-focus transparent-bg',
        child: Widget.CenterBox({
            startWidget: TransparentBox({}),
            centerWidget: TransparentBox({
                className: 'spacing-h-4',
                children: [
                    SideModule([]),
                    TransparentBox({
                        homogeneous: true,
                        children: [await FocusOptionalWorkspaces()],
                    }),
                    SideModule([]),
                ]
            }),
            endWidget: TransparentBox({}),
        }),
        setup: (self) => {
            if (Battery) {
                self.hook(Battery, (self) => {
                    if (!Battery.available) return;
                    self.toggleClassName('bar-bg-focus-batterylow', 
                        Battery.percent <= Utils.userOptions?.battery?.low || 20);
                });
            }
            // Add transparent class
            self.get_style_context().add_class('transparent-bg');
        }
    });
};
