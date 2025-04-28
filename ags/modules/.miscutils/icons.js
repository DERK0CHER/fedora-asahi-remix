const { Gtk } = imports.gi;

export function iconExists(iconName) {
    let iconTheme = Gtk.IconTheme.get_default();
    return iconTheme.has_icon(iconName);
}

export function substitute(str) {
    // Always try to use adwaita-symbolic icons first
    const symbolicName = `${str}-symbolic`;
    
    // Check if the icon exists in the icon theme
    if (iconExists(symbolicName)) {
        return symbolicName;
    }
    
    // Check if there's a custom icon in /assets/icons
    const customIconPath = `${App.configDir}/assets/icons/${str}-symbolic.svg`;
    if (GLib.file_test(customIconPath, GLib.FileTest.EXISTS)) {
        return customIconPath;
    }
    
    // Normal substitutions as fallback
    if (userOptions.icons.substitutions[str])
        return userOptions.icons.substitutions[str];

    // Regex substitutions as last resort
    for (let i = 0; i < userOptions.icons.regexSubstitutions.length; i++) {
        const substitution = userOptions.icons.regexSubstitutions[i];
        const replacedName = str.replace(
            substitution.regex,
            substitution.replace,
        );
        if (replacedName != str) return replacedName;
    }

    // Original string with symbolic suffix
    return `${str}-symbolic`;
}