const { Gio, GLib } = imports.gi;
import GtkSource from "gi://GtkSource?version=3.0";
import App from 'resource:///com/github/Aylur/ags/app.js'
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { darkMode } from './modules/.miscutils/system.js';

// Import your user options or define fallback options
// If importing doesn't work, we'll use this fallback
const fallbackUserOptions = {
    icons: {
        symbolicIconTheme: {
            dark: 'Adwaita',
            light: 'Adwaita'
        }
    }
};

// Try to get userOptions, use fallback if it doesn't exist
const userOptions = globalThis.userOptions || fallbackUserOptions;

const CUSTOM_SOURCEVIEW_SCHEME_PATH = `${App.configDir}/assets/themes/sourceviewtheme${darkMode.value ? '' : '-light'}.xml`;
export const COMPILED_STYLE_DIR = `${GLib.get_user_cache_dir()}/ags/user/generated`;

function loadSourceViewColorScheme(filePath) {
    try {
        // Check if file exists
        const file = Gio.File.new_for_path(filePath);
        if (!file.query_exists(null)) {
            console.log(`Theme file doesn't exist: ${filePath}`);
            return;
        }
        
        const [success, contents] = file.load_contents(null);
        if (!success) {
            console.error('Failed to load the XML file.');
            return;
        }
        
        // Parse the XML content and set the Style Scheme
        const schemeManager = GtkSource.StyleSchemeManager.get_default();
        schemeManager.append_search_path(file.get_parent().get_path());
    } catch (e) {
        console.error('Error loading source view scheme:', e);
    }
}

globalThis['handleStyles'] = (resetMusic) => {
    // Reset
    Utils.exec(`mkdir -p "${GLib.get_user_state_dir()}/ags/scss"`);
    if (resetMusic) {
        Utils.exec(`bash -c 'echo "" > ${GLib.get_user_state_dir()}/ags/scss/_musicwal.scss'`);
        Utils.exec(`bash -c 'echo "" > ${GLib.get_user_state_dir()}/ags/scss/_musicmaterial.scss'`);
    }
    
    // Generate overrides with transparency
    let lightdark = darkMode.value ? "dark" : "light";
    
    // Get icon theme, with fallback
    const iconTheme = userOptions?.icons?.symbolicIconTheme?.[lightdark] || 'Adwaita';
    
    // Write CSS that forces transparency
    Utils.writeFileSync(
        `
        @mixin symbolic-icon {
            -gtk-icon-theme: '${iconTheme}';
        }
        
        // Variables to override for transparency
        $transparent: true;
        $background: transparent;
        $surface: transparent;
        $surfaceDim: transparent;
        $surfaceBright: transparent;
        $surfaceContainerLowest: transparent;
        $surfaceContainerLow: transparent;
        $surfaceContainer: transparent;
        $surfaceContainerHigh: transparent;
        $surfaceContainerHighest: transparent;
        
        // Force all backgrounds to be transparent
        * {
            background-color: transparent !important;
            background-image: none !important;
        }
        
        .window, .background, .csd, .container, .box {
            background-color: transparent !important;
            background-image: none !important;
        }
        
        // Remove box shadows
        * {
            box-shadow: none !important;
        }
        `,
        `${GLib.get_user_state_dir()}/ags/scss/_lib_mixins_overrides.scss`
    );
    
    // Compile and apply with better error handling
    async function applyStyle() {
        try {
            // Ensure directory exists
            Utils.exec(`mkdir -p ${COMPILED_STYLE_DIR}`);
            
            // Try to compile main.scss first
            try {
                Utils.exec(`sass -I "${GLib.get_user_state_dir()}/ags/scss" -I "${App.configDir}/scss/fallback" "${App.configDir}/scss/main.scss" "${COMPILED_STYLE_DIR}/style.css"`);
            } catch (sassError) {
                console.error('Error compiling main SCSS, trying fallback:', sassError);
                
                // If main fails, create a minimal transparent CSS directly
                Utils.writeFileSync(
                    `
                    * {
                        background-color: transparent !important;
                        background-image: none !important;
                        box-shadow: none !important;
                    }
                    
                    .window, .background, .csd {
                        background: transparent !important;
                    }
                    
                    .label, .text {
                        color: white;
                    }
                    `,
                    `${COMPILED_STYLE_DIR}/style.css`
                );
            }
            
            // Apply the CSS
            App.resetCss();
            App.applyCss(`${COMPILED_STYLE_DIR}/style.css`);
            console.log('[LOG] Transparent styles loaded');
        } catch (e) {
            console.error('Fatal error in styling system:', e);
        }
    }
    
    // Apply style and load source view theme
    applyStyle().then(() => {
        loadSourceViewColorScheme(CUSTOM_SOURCEVIEW_SCHEME_PATH);
    }).catch(error => {
        console.error('Style application error:', error);
    });
};