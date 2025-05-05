
const { Gtk } = imports.gi;

export function iconExists(iconName) {
    let iconTheme = Gtk.IconTheme.get_default();
    return iconTheme.has_icon(iconName);
}

export function substitute(str) {
    if (!str || str === "") return "image-missing-symbolic";

    // Special case handling for specific icons
    const specialIcons = {
        'battery': 'battery-symbolic',
        'spark': 'sparkle-symbolic',
        'notifications': 'notification-symbolic',
        'notifications_paused': 'notifications-disabled-symbolic',
        'volume_up': 'audio-volume-high-symbolic',
        'bluetooth': 'bluetooth-symbolic',
        'wifi': 'network-wireless-symbolic',
        'tune': 'preferences-system-symbolic'
    };
    
    if (specialIcons[str]) return specialIcons[str];

    // First check if already has -symbolic suffix
    if (str.endsWith('-symbolic') && iconExists(str)) 
        return str;
    
    // Try direct symbolic version
    const symbolicName = `${str}-symbolic`;
    if (iconExists(symbolicName))
        return symbolicName;
    
    // Try Adwaita symbolic version
    const adwaitaSymbolicName = `adwaita-${str}-symbolic`;
    if (iconExists(adwaitaSymbolicName))
        return adwaitaSymbolicName;
    
    // Check for direct substitutions
    if (userOptions.icons.substitutions[str]) {
        const substitution = userOptions.icons.substitutions[str];
        return substitution.endsWith('-symbolic') ? 
            substitution : `${substitution}-symbolic`;
    }

    // Try regex substitutions
    for (let i = 0; i < userOptions.icons.regexSubstitutions.length; i++) {
        const substitution = userOptions.icons.regexSubstitutions[i];
        const regex = new RegExp(substitution.regex);
        const replacedName = str.replace(regex, substitution.replace);
        if (replacedName !== str) {
            // Ensure result ends with -symbolic
            return replacedName.endsWith('-symbolic') ? 
                replacedName : `${replacedName}-symbolic`;
        }
    }

    // Convert to kebab case as a last resort
    const kebabCaseStr = str.toLowerCase().replace(/\s+/g, "-");
    if (kebabCaseStr !== str) {
        const kebabSymbolic = `${kebabCaseStr}-symbolic`;
        if (iconExists(kebabSymbolic))
            return kebabSymbolic;
    }

    // Fallback to original with symbolic suffix
    return `${str}-symbolic`;
}