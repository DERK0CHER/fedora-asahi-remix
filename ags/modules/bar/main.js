const { Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

import WindowTitle from "./normal/spaceleft.js";
import Indicators from "./normal/spaceright.js";
import Music from "./normal/music.js";
import System from "./normal/system.js";
import { enableClickthrough } from "../.widgetutils/clickthrough.js";
import { RoundedCorner } from "../.commonwidgets/cairo_roundedcorner.js";
import { currentShellMode } from '../../variables.js';

// Force transparency for all windows
const setupTransparency = (widget) => {
    // Apply transparency to the widget's window
    widget.connect('realize', () => {
        const window = widget.get_window();
        if (window) {
            window.set_opacity(0); // Set full transparency
        }
        
        // Try to get native GTK window and set visual
        const native = widget.get_native();
        if (native) {
            native.set_app_paintable(true);
            const visual = native.get_screen().get_rgba_visual();
            if (visual) {
                native.set_visual(visual);
            }
        }
    });
    
    return widget;
};

const NormalOptionalWorkspaces = async () => {
    try {
        return (await import('./normal/workspaces_hyprland.js')).default();
    } catch {
        try {
            return (await import('./normal/workspaces_sway.js')).default();
        } catch {
            return null;
        }
    }
};

const FocusOptionalWorkspaces = async () => {
    try {
        return (await import('./focus/workspaces_hyprland.js')).default();
    } catch {
        try {
            return (await import('./focus/workspaces_sway.js')).default();
        } catch {
            return null;
        }
    }
};

// Apply transparency classes to all boxes
const TransparentBox = (props) => Widget.Box({
    ...props,
    className: `${props.className || ''} transparent-bg`,
});

const SideModule = (children) => TransparentBox({
    className: 'bar-sidemodule',
    children: children,
});

export const Bar = async (monitor = 0) => {
    // Setup Hyprland transparency rules if using Hyprland
    try {
        // Make bar window transparent in Hyprland
        await execAsync(['hyprctl', 'keyword', 'windowrule', 'opacity 1.0 1.0,^(bar' + monitor + ')$']);
        // Disable rounding since we have our own corners
        await execAsync(['hyprctl', 'keyword', 'windowrule', 'rounding 0,^(bar' + monitor + ')$']);
    } catch (e) {
        console.error('Failed to set Hyprland window rules:', e);
    }
    
    const normalBarContent = TransparentBox({
        className: 'bar-bg transparent-bg',
        setup: (self) => {
            const styleContext = self.get_style_context();
            const minHeight = styleContext.get_property('min-height', Gtk.StateFlags.NORMAL);
            
            // Force transparent style for this widget
            styleContext.add_class('transparent-bg');
        },
        child: Widget.CenterBox({
            startWidget: (await WindowTitle(monitor)),
            centerWidget: TransparentBox({
                className: 'spacing-h-4',
                children: [
                    SideModule([Music()]),
                    TransparentBox({
                        homogeneous: true,
                        children: [await NormalOptionalWorkspaces()],
                    }),
                    SideModule([System()]),
                ]
            }),
            endWidget: Indicators(monitor),
        }),
    });
    
    const focusedBarContent = TransparentBox({
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
            self.hook(Battery, (self) => {
                if (!Battery.available) return;
                self.toggleClassName('bar-bg-focus-batterylow', Battery.percent <= userOptions.battery.low);
            });
            // Add transparent class
            self.get_style_context().add_class('transparent-bg');
        }
    });
    
    const nothingContent = TransparentBox({
        className: 'bar-bg-nothing transparent-bg',
    });
    
    return Widget.Window({
        monitor,
        name: `bar${monitor}`,
        anchor: ['top', 'left', 'right'],
        exclusivity: 'exclusive',
        visible: true,
        className: 'transparent-window',
        child: Widget.Stack({
            homogeneous: false,
            transition: 'slide_up_down',
            transitionDuration: userOptions.animations.durationLarge,
            children: {
                'normal': normalBarContent,
                'focus': focusedBarContent,
                'nothing': nothingContent,
            },
            setup: (self) => {
                self.hook(currentShellMode, (self) => {
                    self.shown = currentShellMode.value[monitor];
                });
                // Add transparent class
                self.get_style_context().add_class('transparent-bg');
            }
        }),
        setup: (self) => {
            setupTransparency(self);
        }
    });
};

export const BarCornerTopleft = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornertl${monitor}`,
    layer: 'top',
    anchor: ['top', 'left'],
    exclusivity: 'normal',
    visible: true,
    className: 'transparent-window',
    child: RoundedCorner('topleft', { className: 'corner transparent-bg', }),
    setup: (self) => {
        enableClickthrough(self);
        setupTransparency(self);
    }
});

export const BarCornerTopright = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornertr${monitor}`,
    layer: 'top',
    anchor: ['top', 'right'],
    exclusivity: 'normal',
    visible: true,
    className: 'transparent-window',
    child: RoundedCorner('topright', { className: 'corner transparent-bg', }),
    setup: (self) => {
        enableClickthrough(self);
        setupTransparency(self);
    }
});

// Add this to initialize CSS
App.connect('config-parsed', () => {
    // Add custom CSS for transparency
    App.applyCss(`
        .transparent-window, .transparent-bg, .bar-bg, .bar-bg-focus, .bar-bg-nothing, 
        .corner, .bar-sidemodule, [class*="bar-"] {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
        }
        
        * {
            -gtk-background-origin: padding-box;
            -gtk-background-type: none;
        }
    `);
});
