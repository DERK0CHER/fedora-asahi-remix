import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { TransparentBox } from '../components/transparent.js';
import { SideModule } from '../components/sidemodule.js';
import { ModuleStack, ModuleTabs } from '../components/modules.js';
import { getString } from '../../../i18n/i18n.js';

/**
 * Creates the content for the normal bar mode
 * @param {Object} params - Parameters including monitor and components
 * @returns {import('gi://Gtk').Widget} - Normal bar content
 */
export const NormalBarContent = async ({ monitor, components }) => {
    const { 
        WindowTitle, 
        Music, 
        System, 
        NormalOptionalWorkspaces, 
        Indicators 
    } = components;
    
    // Define available modules
    const modules = {
        'music': SideModule([Music()]),
        'workspaces': TransparentBox({
            homogeneous: true,
            children: [await NormalOptionalWorkspaces()],
        }),
        'system': SideModule([System()]),
    };
    
    // Tab definitions with symbolic icon names
    const tabs = [
        { id: 'music', iconName: 'audio-x-generic-symbolic', label: 'Music' },
        { id: 'workspaces', iconName: 'view-grid-symbolic', label: 'Workspaces' },
        { id: 'system', iconName: 'preferences-system-symbolic', label: 'System' },
    ];
    
    // Create the actual bar content
    return TransparentBox({
        className: 'bar-bg transparent-bg',
        setup: (self) => {
            const styleContext = self.get_style_context();
            
            // Force transparent style for this widget
            styleContext.add_class('transparent-bg');
        },
        child: Widget.CenterBox({
            startWidget: (await WindowTitle(monitor)),
            centerWidget: TransparentBox({
                className: 'spacing-v-5',
                vertical: true,
                children: [
                    ModuleTabs(tabs, { useSymbolic: true }),
                    ModuleStack(modules, { 
                        transitionDuration: Utils.userOptions?.animations?.durationSmall || 250 
                    }),
                ]
            }),
            endWidget: Indicators(monitor),
        }),
    });
};
