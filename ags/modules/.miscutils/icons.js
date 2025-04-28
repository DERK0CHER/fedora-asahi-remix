const { Gtk } = imports.gi;

export function iconExists(iconName) {
    let iconTheme = Gtk.IconTheme.get_default();
    return iconTheme.has_icon(iconName);
}

export function substitute(str) {
    // First try exact symbolic name
    const symbolicName = `${str}-symbolic`;
    if (iconExists(symbolicName)) {
        return symbolicName;
    }
    
    // Then try adwaita symbolic version
    const adwaitaSymbolicName = `adwaita-${str}-symbolic`;
    if (iconExists(adwaitaSymbolicName)) {
        return adwaitaSymbolicName;
    }
    
    // Check for direct substitutions
    if (userOptions.icons.substitutions[str]) {
        const substitution = userOptions.icons.substitutions[str];
        // Ensure substitution ends with -symbolic
        return substitution.endsWith('-symbolic') ? 
            substitution : `${substitution}-symbolic`;
    }

    // Try regex substitutions
    for (let i = 0; i < userOptions.icons.regexSubstitutions.length; i++) {
        const substitution = userOptions.icons.regexSubstitutions[i];
        const replacedName = str.replace(
            substitution.regex,
            substitution.replace,
        );
        if (replacedName != str) {
            // Ensure result ends with -symbolic
            return replacedName.endsWith('-symbolic') ? 
                replacedName : `${replacedName}-symbolic`;
        }
    }

    // Last resort: Return with symbolic suffix
    return `${str}-symbolic`;
}