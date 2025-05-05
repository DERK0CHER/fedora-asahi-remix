import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import { TransparentBox } from './transparent.js';
import { BarTabButton, SymbolicTabButton } from '../buttons.js';
import { getString } from '../../../i18n/i18n.js';

const { Box } = Widget;

// Variable to track current active module
export const activeModule = Variable('workspaces');

/**
 * Creates a module content stack that can switch between different modules
 * @param {Object} modules - Object with module id keys and widget values
 * @param {Object} options - Additional configuration options
 * @returns {import('gi://Gtk').Widget} - Stack widget for module content
 */
export const ModuleStack = (modules, options = {}) => {
    const { transitionDuration = 250 } = options;
    
    return Widget.Stack({
        transition: 'slide_left_right',
        transitionDuration: transitionDuration,
        children: modules,
        setup: (stack) => {
            // Listen for changes to the active module
            stack.hook(activeModule, () => {
                stack.shown = activeModule.value;
            });
        }
    });
};

/**
 * Creates a tab bar for selecting different modules
 * @param {Array} tabs - Array of tab objects with id, icon, and label
 * @param {Object} options - Options for the tab bar
 * @returns {import('gi://Gtk').Widget} - Tab bar widget
 */
export const ModuleTabs = (tabs, options = {}) => {
    const { useSymbolic = true } = options;
    
    return Box({
        className: 'bar-tabs spacing-h-5',
        hpack: 'center',
        children: tabs.map(tab => 
            useSymbolic ? 
                SymbolicTabButton(
                    tab.id, 
                    tab.iconName || `${tab.id}-symbolic`, 
                    tab.label, 
                    (id) => {
                        activeModule.value = id;
                    }
                ) : 
                BarTabButton(
                    tab.id, 
                    tab.icon, 
                    tab.label, 
                    (id) => {
                        activeModule.value = id;
                    }
                )
        ),
        setup: (box) => {
            // Set initial active tab
            setTimeout(() => {
                const children = box.get_children();
                // Find the tab for the current active module
                for (let i = 0; i < children.length; i++) {
                    if (tabs[i].id === activeModule.value) {
                        children[i].toggleClassName('bar-tab-active', true);
                        break;
                    }
                }
            }, 10);
        }
    });
};
