export interface TranslationKeys {
  filters: {
    all: string
    text: string
    links: string
    images: string
    files: string
  }
  tabs: {
    behaviour: string
    position: string
    appearance: string
  }
  header: {
    searchPlaceholder: string
    settings: string
    close: string
    whatsNew: string
  }
  behaviour: {
    languageTitle: string
    languageDesc: string
    systemDefault: string
    launchAtLoginTitle: string
    launchAtLoginDesc: string
    incognitoTitle: string
    incognitoDesc: string
    hoverActivationTitle: string
    hoverActivationDescOn: string
    hoverActivationDescOff: string
    disabledHoverOff: string
    fullscreenProtectionTitle: string
    fullscreenProtectionDesc: string
    clearUnpinnedTitle: string
    clearUnpinnedDesc: string
    soundEffectsTitle: string
    soundEffectsDesc: string
    autoUpdatesTitle: string
    autoUpdatesDescOn: string
    autoUpdatesDescOff: string
    checkForUpdates: string
    checkingForUpdates: string
    isUpToDate: string
    checkAgain: string
    tryAgain: string
    updateCheckFailed: string
    updateAvailableTitle: string
    updateAvailableDesc: string
    downloadAndUpdate: string
    skip: string
    downloadingUpdate: string
    updateReadyTitle: string
    updateReadyDesc: string
    restartToUpdate: string
    restartToUpdateBelow: string
    newUpdateAvailableBelow: string
    autoDeleteTitle: string
    autoDeleteDesc: string
    never: string
    capacityTitle: string
    capacityDesc: string
  }
  position: {
    edgePlacementTitle: string
    edgePlacementDesc: string
    leftEdge: string
    rightEdge: string
    displayTitle: string
    displayDesc: string
    primaryDisplay: string
    verticalPositionTitle: string
    verticalPositionDesc: string
    top: string
    center: string
    bottom: string
    triggerZone: string
    edgeLocationHintTitle: string
    edgeLocationHintDesc: string
    edgeTriggerPositionTitle: string
    edgeTriggerPositionDesc: string
    hoverAreaSizeTitle: string
    hoverAreaSizeDesc: string
    medium: string
    edgeTriggerThicknessTitle: string
    edgeTriggerThicknessDesc: string
    panelHeightTitle: string
    panelHeightDesc: string
  }
  appearance: {
    copyIndicatorTitle: string
    copyIndicatorDesc: string
    indicatorStyleTitle: string
    indicatorStyleDesc: string
    typography: string
    textSizeTitle: string
    textSizeDesc: string
    audioAndFeedback: string
    small: string
    normal: string
    medium: string
    large: string
    cardViewTitle: string
    cardViewDesc: string
    modernCards: string
    compactRows: string
    logoStyle: string
    tickStyle: string
    copyStyle: string
    sparkleStyle: string
  }
  item: {
    copy: string
    pinned: string
    pin: string
    unpin: string
    delete: string
    clear: string
    dropToSave: string
    dropToSaveDesc: string
    justNow: string
    ago: string
    expand: string
    textItem: string
    imageItem: string
    fileItem: string
    linkItem: string
    items: string
    recent: string
    expandPinned: string
    collapsePinned: string
    screenshot: string
    ungroup: string
    copyFilePath: string
    moreImages: string
    moreFiles: string
    singleFile: string
    scrollToTop: string
  }
  fileKinds: {
    pdf: string
    word: string
    excel: string
    powerpoint: string
    archive: string
    text: string
    code: string
    audio: string
    video: string
    image: string
    file: string
  }
  emptyState: {
    shelfEmpty: string
    noResultsFound: string
    shelfEmptyHint: string
    noResultsHint: string
    noClipsFound: string
    copyTypeHint: string
    textClips: string
    links: string
    images: string
    files: string
  }
  onboarding: {
    welcomeTitle: string
    welcomeDesc: string
    collectTitle: string
    collectDesc: string
    dragTitle: string
    dragDesc: string
    stacksTitle: string
    stacksDesc: string
    ungroupTitle: string
    ungroupDesc: string
    mergeTitle: string
    mergeDesc: string
    previewTitle: string
    previewDesc: string
    configTitle: string
    configDesc: string
    skip: string
    back: string
    next: string
    getStarted: string
    extractedCard: string
    dropToExtract: string
    proTips: string
    proTip1: string
    proTip2: string
    proTip3: string
    proTip4: string
  }
  tray: {
    showClipboard: string
    settings: string
    incognito: string
    hoverTrigger: string
    stickTo: string
    left: string
    right: string
    display: string
    quit: string
    welcomeTitle: string
    welcomeBody: string
  }
  flyout: {
    copyBeaconStyleTitle: string
    openLink: string
    copyContent: string
    saveFile: string
    extractedFromBundle: string
    itemsCount: string
    selectedCount: string
    selectAll: string
    deselectAll: string
    copySelected: string
    pasteSelected: string
    paste: string
    clearSelection: string
    contentTruncated: string
    clickToPaste: string
    copyText: string
    copyImage: string
    copyFile: string
    clickToPasteDrag: string
    openInExplorer: string
    current: string
  }
  toast: {
    copiedToClipboard: string
    itemDeleted: string
    itemPinned: string
    itemUnpinned: string
    settingsSaved: string
  }
  footer: {
    communityAndSupport: string
    feedbackTitle: string
    feedbackDesc: string
    submitFeedback: string
    applicationGroup: string
    quitTitle: string
    quitDesc: string
    starOnGithub: string
    githubPromo: string
    version: string
  }
}

export interface LanguageMeta {
  code: string
  name: string
  nativeName: string
  rtl?: boolean
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'system', name: 'System Default', nativeName: 'System Default (Auto)' },
  { code: 'en', name: 'English', nativeName: 'English (US)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' }
]

export const en: TranslationKeys = {
  filters: { all: 'All', text: 'Text', links: 'Links', images: 'Images', files: 'Files' },
  tabs: { behaviour: 'Behaviour', position: 'Position', appearance: 'Appearance' },
  header: { searchPlaceholder: 'Search history...', settings: 'Settings', close: 'Close', whatsNew: "What's New" },
  behaviour: {
    languageTitle: 'Language',
    languageDesc: 'Select UI language for system menus and controls',
    systemDefault: 'System Default (Auto)',
    launchAtLoginTitle: 'Launch at login',
    launchAtLoginDesc: 'Start silently in background when computer boots',
    incognitoTitle: 'Incognito mode',
    incognitoDesc: 'Temporarily pause recording new clipboard items',
    hoverActivationTitle: 'Hover Activation',
    hoverActivationDescOn: 'Slide open shelf when hovering cursor near screen edge',
    hoverActivationDescOff: 'Hover trigger paused. Use Alt + C to open',
    disabledHoverOff: 'Disabled because Hover Activation is turned off',
    fullscreenProtectionTitle: 'Fullscreen Protection',
    fullscreenProtectionDesc: 'Automatically pause edge hover while playing games or watching fullscreen videos',
    clearUnpinnedTitle: 'Clear unpinned on restart',
    clearUnpinnedDesc: 'Wipe unpinned items whenever the app restarts',
    soundEffectsTitle: 'Sound Effects',
    soundEffectsDesc: 'Play tactile audio feedback for toggles, sliders, and button clicks',
    autoUpdatesTitle: 'Automatic updates',
    autoUpdatesDescOn: 'Check for and download app updates automatically in background',
    autoUpdatesDescOff: 'Background update checks paused. Check for updates manually below',
    checkForUpdates: 'Check for updates',
    checkingForUpdates: 'Checking GitHub for updates...',
    isUpToDate: '✓ Edge-Drop is up to date',
    checkAgain: 'Check again',
    tryAgain: 'Try again',
    updateCheckFailed: 'Update check failed',
    updateAvailableTitle: 'Edge-Drop v{version} is available!',
    updateAvailableDesc: 'A newer version is ready on GitHub. Would you like to download and update now?',
    downloadAndUpdate: 'Download & Update',
    skip: 'Skip',
    downloadingUpdate: 'Downloading update package in background...',
    updateReadyTitle: 'Update v{version} Ready',
    updateReadyDesc: 'Click to restart Edge-Drop and apply the update.',
    restartToUpdate: 'Restart to Update',
    restartToUpdateBelow: 'Restart to update below',
    newUpdateAvailableBelow: 'New update available below',
    autoDeleteTitle: 'Auto-delete timer',
    autoDeleteDesc: 'Automatically purge copied items (preserves Pinned)',
    never: 'Never',
    capacityTitle: 'History capacity',
    capacityDesc: 'Maximum unpinned items stored in history'
  },
  position: {
    edgePlacementTitle: 'Edge Placement',
    edgePlacementDesc: 'Choose which screen edge Edge-Drop anchors to',
    leftEdge: 'Left Edge',
    rightEdge: 'Right Edge',
    displayTitle: 'Display Screen',
    displayDesc: 'Choose which monitor Edge-Drop attaches to',
    primaryDisplay: 'Primary Display',
    verticalPositionTitle: 'Vertical Position',
    verticalPositionDesc: 'Adjust vertical alignment along screen edge',
    top: 'Top',
    center: 'Center',
    bottom: 'Bottom',
    triggerZone: 'Trigger Zone',
    edgeLocationHintTitle: 'Edge location hint',
    edgeLocationHintDesc: 'Subtly illuminate beacon on screen edge when touching edge at wrong position',
    edgeTriggerPositionTitle: 'Edge trigger position',
    edgeTriggerPositionDesc: 'Placement of hover trigger strip relative to shelf',
    hoverAreaSizeTitle: 'Hover area size',
    hoverAreaSizeDesc: 'Hover area size on the screen edge',
    medium: 'Medium',
    edgeTriggerThicknessTitle: 'Edge trigger thickness',
    edgeTriggerThicknessDesc: 'Physical thickness of the invisible trigger strip',
    panelHeightTitle: 'Panel height',
    panelHeightDesc: 'Vertical size of the clipboard shelf'
  },
  appearance: {
    copyIndicatorTitle: 'Copy Indicator',
    copyIndicatorDesc: 'Show subtle visual beacon on screen edge when copying',
    indicatorStyleTitle: 'Indicator Style',
    indicatorStyleDesc: 'Choose visual shape style for edge copy indicator',
    typography: 'Typography',
    textSizeTitle: 'Text size',
    textSizeDesc: 'Adjust UI typography scale across Edge-Drop',
    audioAndFeedback: 'Audio & Feedback',
    small: 'Small',
    normal: 'Normal',
    medium: 'Medium',
    large: 'Large',
    cardViewTitle: 'Card Layout',
    cardViewDesc: 'Toggle between modern cards or compact list rows',
    modernCards: 'Modern Cards',
    compactRows: 'Compact Rows',
    logoStyle: 'Logo',
    tickStyle: 'Tick',
    copyStyle: 'Copy',
    sparkleStyle: 'Sparkle'
  },
  item: {
    copy: 'Copy',
    pinned: 'PINNED',
    pin: 'Pin',
    unpin: 'Unpin',
    delete: 'Delete',
    clear: 'Clear',
    dropToSave: 'Drop to save',
    dropToSaveDesc: 'Any file, image, link, or text',
    justNow: 'just now',
    ago: 'ago',
    expand: 'Expand',
    textItem: 'Text',
    imageItem: 'Image',
    fileItem: 'File',
    linkItem: 'Link',
    items: 'items',
    recent: 'RECENT',
    expandPinned: 'Expand pinned items',
    collapsePinned: 'Collapse pinned items',
    screenshot: 'Screenshot',
    ungroup: 'Ungroup from collection',
    copyFilePath: 'Copy file path',
    moreImages: '+{count} more images',
    moreFiles: '+{count} more files',
    singleFile: '1 file',
    scrollToTop: 'Scroll to top'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'Slides',
    archive: 'Archive',
    text: 'Text',
    code: 'Code',
    audio: 'Audio',
    video: 'Video',
    image: 'Image',
    file: 'File'
  },
  emptyState: {
    shelfEmpty: 'Shelf is empty',
    noResultsFound: 'No results found',
    shelfEmptyHint: 'Copy anything or drop files here to begin',
    noResultsHint: 'Try a different keyword or clear search',
    noClipsFound: 'No {type} found',
    copyTypeHint: 'Copy {type} or switch back to All',
    textClips: 'text clips',
    links: 'links',
    images: 'images',
    files: 'files'
  },
  onboarding: {
    welcomeTitle: 'Welcome to Edge-Drop',
    welcomeDesc: 'Edge-Drop lives hidden on the left edge of your screen. Simply move your mouse to the left edge to open the panel, and move away to hide it.',
    collectTitle: 'Collect Anything',
    collectDesc: 'Whenever you press Ctrl+C to copy text, images, or files, Edge-Drop automatically catches and saves them in the background.',
    dragTitle: 'Drag & Drop Anywhere',
    dragDesc: 'Need to use an item? Just open the panel and drag the card directly into any application, folder, or document.',
    stacksTitle: 'Explore File Stacks',
    stacksDesc: 'Copying multiple files groups them into a stack. You can drag the entire stack, or click it to view and extract individual files.',
    ungroupTitle: 'Ungroup & Split Stacks',
    ungroupDesc: 'Want to separate items in a stack? Click to expand the stack, then drag any subitem to the left edge of the screen. A glowing coral bar will appear—drop the item on it to extract it back into a standalone card.',
    mergeTitle: 'Combine & Merge Items',
    mergeDesc: 'Combine separate file or image cards by dragging them directly onto each other. This organizes your shelf by bundling related assets into a stack.',
    previewTitle: 'Preview Flyout',
    previewDesc: 'Click the preview button on any card to open a side flyout. Inspect high-resolution images, browse file collections, read long text snippets, or drag items directly from the preview.',
    configTitle: 'Configure Your Clipboard',
    configDesc: 'Customize how Edge-Drop works for you.',
    skip: 'Skip',
    back: 'Back',
    next: 'Next',
    getStarted: 'Get Started',
    extractedCard: 'Extracted card',
    dropToExtract: 'Drop to extract back into a standalone card',
    proTips: 'Pro Tips',
    proTip1: 'Press Alt + C to instantly toggle the shelf.',
    proTip2: 'Access settings anytime via the gear icon (top right).',
    proTip3: 'Drag & drop files to the left edge to add them.',
    proTip4: 'Click a text box, then a clipboard item to auto-paste.'
  },
  tray: {
    showClipboard: 'Show Clipboard',
    settings: 'Settings',
    incognito: 'Incognito (pause capture)',
    hoverTrigger: 'Hover Trigger (open on hover)',
    stickTo: 'Stick to',
    left: 'Left',
    right: 'Right',
    display: 'Display',
    quit: 'Quit Edge-Drop',
    welcomeTitle: 'Edge-Drop Clipboard Shelf',
    welcomeBody: 'Hover against the middle-left screen edge, or press Alt+C to slide open your shelf.'
  },
  flyout: {
    copyBeaconStyleTitle: 'Copy Indicator Style',
    openLink: 'Open Link',
    copyContent: 'Copy Content',
    saveFile: 'Save File',
    extractedFromBundle: 'Extracted from file stack',
    itemsCount: '{count} items',
    selectedCount: '{count} Selected',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    copySelected: 'Copy Selected',
    pasteSelected: 'Paste Selected',
    paste: 'Paste',
    clearSelection: 'Clear Selection',
    contentTruncated: '… (content truncated)',
    clickToPaste: 'Click to paste',
    copyText: 'Copy Text',
    copyImage: 'Copy Image',
    copyFile: 'Copy File',
    clickToPasteDrag: 'Click to paste · Drag to move',
    openInExplorer: 'Open location in Explorer',
    current: 'Current'
  },
  toast: {
    copiedToClipboard: 'Copied to clipboard',
    itemDeleted: 'Item deleted',
    itemPinned: 'Item pinned',
    itemUnpinned: 'Item unpinned',
    settingsSaved: 'Settings saved'
  },
  footer: {
    communityAndSupport: 'Community & Support',
    feedbackTitle: 'Feedback & Issues',
    feedbackDesc: 'Report bugs or suggest features on GitHub',
    submitFeedback: 'Submit Feedback ↗',
    applicationGroup: 'Application',
    quitTitle: 'Quit Edge-Drop',
    quitDesc: 'Close application and stop background process',
    starOnGithub: 'Star on GitHub',
    githubPromo: 'If you like Edge-Drop, please consider starring the project on GitHub!',
    version: 'Version'
  }
}

export const es: TranslationKeys = {
  filters: { all: 'Todos', text: 'Texto', links: 'Enlaces', images: 'Imágenes', files: 'Archivos' },
  tabs: { behaviour: 'Comportamiento', position: 'Posición', appearance: 'Apariencia' },
  header: { searchPlaceholder: 'Buscar historial...', settings: 'Ajustes', close: 'Cerrar', whatsNew: 'Novedades' },
  behaviour: {
    languageTitle: 'Idioma',
    languageDesc: 'Selecciona el idioma de la interfaz para controles y menús',
    systemDefault: 'Predeterminado del sistema (Auto)',
    launchAtLoginTitle: 'Iniciar al arrancar',
    launchAtLoginDesc: 'Iniciar silenciosamente en segundo plano al encender el equipo',
    incognitoTitle: 'Modo incógnito',
    incognitoDesc: 'Pausar temporalmente el registro de nuevos elementos del portapapeles',
    hoverActivationTitle: 'Activación al pasar el cursor',
    hoverActivationDescOn: 'Deslizar el panel al pasar el cursor cerca del borde',
    hoverActivationDescOff: 'Activación pausada. Usa Alt + C para abrir',
    disabledHoverOff: 'Desactivado porque la activación al pasar el cursor está apagada',
    fullscreenProtectionTitle: 'Protección en pantalla completa',
    fullscreenProtectionDesc: 'Pausar activación automática durante juegos o vídeos a pantalla completa',
    clearUnpinnedTitle: 'Borrar no fijados al reiniciar',
    clearUnpinnedDesc: 'Eliminar elementos no fijados cada vez que se reinicie la aplicación',
    soundEffectsTitle: 'Efectos de sonido',
    soundEffectsDesc: 'Reproducir respuesta táctil de audio al cambiar opciones y botones',
    autoUpdatesTitle: 'Actualizaciones automáticas',
    autoUpdatesDescOn: 'Buscar y descargar actualizaciones automáticamente en segundo plano',
    autoUpdatesDescOff: 'Búsqueda automática pausada. Comprobar manualmente abajo',
    checkForUpdates: 'Buscar actualizaciones',
    checkingForUpdates: 'Buscando actualizaciones en GitHub...',
    isUpToDate: '✓ Edge-Drop está actualizado',
    checkAgain: 'Buscar de nuevo',
    tryAgain: 'Reintentar',
    updateCheckFailed: 'Error al comprobar actualizaciones',
    updateAvailableTitle: '¡Edge-Drop v{version} está disponible!',
    updateAvailableDesc: 'Una nueva versión está lista en GitHub. ¿Deseas descargarla y actualizar ahora?',
    downloadAndUpdate: 'Descargar y actualizar',
    skip: 'Omitir',
    downloadingUpdate: 'Descargando paquete de actualización en segundo plano...',
    updateReadyTitle: 'Actualización v{version} lista',
    updateReadyDesc: 'Haz clic para reiniciar Edge-Drop y aplicar la actualización.',
    restartToUpdate: 'Reiniciar para actualizar',
    restartToUpdateBelow: 'Reinicia abajo para actualizar',
    newUpdateAvailableBelow: 'Nueva actualización disponible abajo',
    autoDeleteTitle: 'Temporizador de borrado automático',
    autoDeleteDesc: 'Eliminar automáticamente elementos copiados (conserva los fijados)',
    never: 'Nunca',
    capacityTitle: 'Capacidad del historial',
    capacityDesc: 'Máximo de elementos no fijados guardados en el historial'
  },
  position: {
    edgePlacementTitle: 'Borde de pantalla',
    edgePlacementDesc: 'Elige en qué borde de la pantalla se ancla Edge-Drop',
    leftEdge: 'Borde izquierdo',
    rightEdge: 'Borde derecho',
    displayTitle: 'Pantalla',
    displayDesc: 'Elige en qué monitor se muestra Edge-Drop',
    primaryDisplay: 'Pantalla principal',
    verticalPositionTitle: 'Posición vertical',
    verticalPositionDesc: 'Ajusta la alineación vertical a lo largo del borde',
    top: 'Arriba',
    center: 'Centro',
    bottom: 'Abajo',
    triggerZone: 'Zona de activación',
    edgeLocationHintTitle: 'Pista de ubicación del borde',
    edgeLocationHintDesc: 'Iluminar suavemente el borde de la pantalla al tocar fuera de posición',
    edgeTriggerPositionTitle: 'Posición de activación en el borde',
    edgeTriggerPositionDesc: 'Ubicación de la franja de activación respecto al panel',
    hoverAreaSizeTitle: 'Tamaño del área de activación',
    hoverAreaSizeDesc: 'Tamaño del área táctil en el borde de la pantalla',
    medium: 'Mediano',
    edgeTriggerThicknessTitle: 'Grosor de activación',
    edgeTriggerThicknessDesc: 'Grosor físico de la franja de activación invisible',
    panelHeightTitle: 'Altura del panel',
    panelHeightDesc: 'Tamaño vertical del panel de portapapeles'
  },
  appearance: {
    copyIndicatorTitle: 'Indicador de copia',
    copyIndicatorDesc: 'Mostrar señal visual sutil en el borde al copiar',
    indicatorStyleTitle: 'Estilo de indicador',
    indicatorStyleDesc: 'Elige la forma del indicador visual de copia',
    typography: 'Tipografía',
    textSizeTitle: 'Tamaño de texto',
    textSizeDesc: 'Ajusta la escala de fuente de la interfaz',
    audioAndFeedback: 'Audio y comentarios',
    small: 'Pequeño',
    normal: 'Normal',
    medium: 'Mediano',
    large: 'Grande',
    cardViewTitle: 'Diseño de tarjetas',
    cardViewDesc: 'Alternar entre tarjetas modernas o filas compactas',
    modernCards: 'Tarjetas modernas',
    compactRows: 'Filas compactas',
    logoStyle: 'Logo',
    tickStyle: 'Marca',
    copyStyle: 'Copia',
    sparkleStyle: 'Destello'
  },
  item: {
    copy: 'Copiar',
    pinned: 'FIJADOS',
    pin: 'Fijar',
    unpin: 'Desfijar',
    delete: 'Eliminar',
    clear: 'Limpiar',
    dropToSave: 'Soltar para guardar',
    dropToSaveDesc: 'Cualquier archivo, imagen, enlace o texto',
    justNow: 'hace un momento',
    ago: 'atrás',
    expand: 'Expandir',
    textItem: 'Texto',
    imageItem: 'Imagen',
    fileItem: 'Archivo',
    linkItem: 'Enlace',
    items: 'elementos',
    recent: 'RECIENTES',
    expandPinned: 'Expandir fijados',
    collapsePinned: 'Contraer fijados',
    screenshot: 'Captura de pantalla',
    ungroup: 'Desagrupar',
    copyFilePath: 'Copiar ruta del archivo',
    moreImages: '+{count} más imágenes',
    moreFiles: '+{count} más archivos',
    singleFile: '1 archivo',
    scrollToTop: 'Ir arriba'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'Presentación',
    archive: 'Archivo',
    text: 'Texto',
    code: 'Código',
    audio: 'Audio',
    video: 'Vídeo',
    image: 'Imagen',
    file: 'Archivo'
  },
  emptyState: {
    shelfEmpty: 'El panel está vacío',
    noResultsFound: 'Sin resultados',
    shelfEmptyHint: 'Copia algo o arrastra archivos aquí para empezar',
    noResultsHint: 'Intenta con otra palabra clave o limpia la búsqueda',
    noClipsFound: 'No se encontraron {type}',
    copyTypeHint: 'Copia {type} o vuelve a Todos',
    textClips: 'textos',
    links: 'enlaces',
    images: 'imágenes',
    files: 'archivos'
  },
  onboarding: {
    welcomeTitle: 'Bienvenido a Edge-Drop',
    welcomeDesc: 'Edge-Drop vive oculto en el borde izquierdo de tu pantalla. Mueve el cursor al borde para abrir el panel.',
    collectTitle: 'Colecciona cualquier cosa',
    collectDesc: 'Cada vez que copias texto, imágenes o archivos con Ctrl+C, Edge-Drop los guarda automáticamente.',
    dragTitle: 'Arrastra y suelta donde quieras',
    dragDesc: '¿Necesitas usar un elemento? Simplemente abre el panel y arrastra la tarjeta a cualquier app.',
    stacksTitle: 'Explora pilas de archivos',
    stacksDesc: 'Copiar varios archivos los agrupa en una pila. Puedes arrastrar la pila entera o verla individualmente.',
    ungroupTitle: 'Desagrupa elementos',
    ungroupDesc: 'Extrae subelementos arrastrándolos hacia la barra coral en el borde izquierdo.',
    mergeTitle: 'Combina elementos',
    mergeDesc: 'Arrastra tarjetas unas sobre otras para combinarlas en una pila.',
    previewTitle: 'Vista previa flotante',
    previewDesc: 'Abre la vista previa para inspeccionar imágenes, textos o archivos en alta resolución.',
    configTitle: 'Configura tu portapapeles',
    configDesc: 'Personaliza Edge-Drop a tu gusto.',
    skip: 'Omitir',
    back: 'Atrás',
    next: 'Siguiente',
    getStarted: 'Empezar',
    extractedCard: 'Tarjeta extraída',
    dropToExtract: 'Suelta para extraer',
    proTips: 'Consejos útiles',
    proTip1: 'Presiona Alt + C para abrir el panel instantáneamente.',
    proTip2: 'Accede a los ajustes desde el icono de engranaje.',
    proTip3: 'Arrastra y suelta archivos en el borde izquierdo.',
    proTip4: 'Haz clic en un campo de texto y luego en un elemento.'
  },
  tray: {
    showClipboard: 'Mostrar Portapapeles',
    settings: 'Ajustes',
    incognito: 'Incógnito (pausar captura)',
    hoverTrigger: 'Activación al pasar cursor',
    stickTo: 'Anclar a',
    left: 'Izquierda',
    right: 'Derecha',
    display: 'Pantalla',
    quit: 'Salir de Edge-Drop',
    welcomeTitle: 'Panel Edge-Drop',
    welcomeBody: 'Pasa el cursor por el borde izquierdo o usa Alt+C para abrir.'
  },
  flyout: {
    copyBeaconStyleTitle: 'Estilo del indicador de copia',
    openLink: 'Abrir enlace',
    copyContent: 'Copiar contenido',
    saveFile: 'Guardar archivo',
    extractedFromBundle: 'Extraído de la pila',
    itemsCount: '{count} elementos',
    selectedCount: '{count} seleccionados',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Desmarcar todo',
    copySelected: 'Copiar seleccionados',
    pasteSelected: 'Pegar seleccionados',
    paste: 'Pegar',
    clearSelection: 'Limpiar selección',
    contentTruncated: '… (contenido truncado)',
    clickToPaste: 'Haz clic para pegar',
    copyText: 'Copiar texto',
    copyImage: 'Copiar imagen',
    copyFile: 'Copiar archivo',
    clickToPasteDrag: 'Haz clic para pegar · Arrastra para mover',
    openInExplorer: 'Abrir ubicación en el Explorador',
    current: 'Actual'
  },
  toast: {
    copiedToClipboard: 'Copiado al portapapeles',
    itemDeleted: 'Elemento eliminado',
    itemPinned: 'Elemento fijado',
    itemUnpinned: 'Elemento desfijado',
    settingsSaved: 'Ajustes guardados'
  },
  footer: {
    communityAndSupport: 'Comunidad y Soporte',
    feedbackTitle: 'Comentarios y Problemas',
    feedbackDesc: 'Informa de errores o sugiere funciones en GitHub',
    submitFeedback: 'Enviar Comentarios ↗',
    applicationGroup: 'Aplicación',
    quitTitle: 'Salir de Edge-Drop',
    quitDesc: 'Cerrar la aplicación y detener el proceso en segundo plano',
    starOnGithub: 'Dar estrella en GitHub',
    githubPromo: '¡Si te gusta Edge-Drop, apóyanos con una estrella en GitHub!',
    version: 'Versión'
  }
}

export const fr: TranslationKeys = {
  filters: { all: 'Tous', text: 'Texte', links: 'Liens', images: 'Images', files: 'Fichiers' },
  tabs: { behaviour: 'Comportement', position: 'Position', appearance: 'Apparence' },
  header: { searchPlaceholder: 'Rechercher...', settings: 'Paramètres', close: 'Fermer', whatsNew: 'Nouveautés' },
  behaviour: {
    languageTitle: 'Langue',
    languageDesc: 'Sélectionner la langue de l\'interface',
    systemDefault: 'Par défaut du système (Auto)',
    launchAtLoginTitle: 'Lancer au démarrage',
    launchAtLoginDesc: 'Démarrer silencieusement en arrière-plan',
    incognitoTitle: 'Mode incognito',
    incognitoDesc: 'Suspendre temporairement l\'enregistrement',
    hoverActivationTitle: 'Activation au survol',
    hoverActivationDescOn: 'Ouvrir en survolant le bord de l\'écran',
    hoverActivationDescOff: 'Survol en pause. Utilisez Alt + C',
    disabledHoverOff: 'Désactivé car l\'activation au survol est désactivée',
    fullscreenProtectionTitle: 'Protection plein écran',
    fullscreenProtectionDesc: 'Mettre en pause en mode plein écran',
    clearUnpinnedTitle: 'Effacer non épinglés au redémarrage',
    clearUnpinnedDesc: 'Effacer les éléments non épinglés à chaque redémarrage',
    soundEffectsTitle: 'Effets sonores',
    soundEffectsDesc: 'Jouer un retour sonore tactile',
    autoUpdatesTitle: 'Mises à jour automatiques',
    autoUpdatesDescOn: 'Télécharger automatiquement les mises à jour',
    autoUpdatesDescOff: 'Vérification automatique en pause',
    checkForUpdates: 'Vérifier les mises à jour',
    checkingForUpdates: 'Vérification...',
    isUpToDate: '✓ Edge-Drop est à jour',
    checkAgain: 'Revérifier',
    tryAgain: 'Réessayer',
    updateCheckFailed: 'Échec de la vérification',
    updateAvailableTitle: 'Edge-Drop v{version} disponible !',
    updateAvailableDesc: 'Une nouvelle version est disponible.',
    downloadAndUpdate: 'Télécharger & Mettre à jour',
    skip: 'Ignorer',
    downloadingUpdate: 'Téléchargement de la mise à jour...',
    updateReadyTitle: 'Mise à jour v{version} prête',
    updateReadyDesc: 'Cliquez pour redémarrer Edge-Drop.',
    restartToUpdate: 'Redémarrer pour mettre à jour',
    restartToUpdateBelow: 'Redémarrer ci-dessous',
    newUpdateAvailableBelow: 'Mise à jour disponible ci-dessous',
    autoDeleteTitle: 'Minuteur de suppression automatique',
    autoDeleteDesc: 'Purger automatiquement les éléments copiés (conserve les épinglés)',
    never: 'Jamais',
    capacityTitle: 'Capacité de l\'historique',
    capacityDesc: 'Nombre maximum d\'éléments non épinglés conservés'
  },
  position: {
    edgePlacementTitle: 'Bord d\'ancrage',
    edgePlacementDesc: 'Choisir le bord de l\'écran',
    leftEdge: 'Bord gauche',
    rightEdge: 'Bord droit',
    displayTitle: 'Écran',
    displayDesc: 'Choisir l\'écran principal',
    primaryDisplay: 'Écran principal',
    verticalPositionTitle: 'Position verticale',
    verticalPositionDesc: 'Ajuster l\'alignement vertical',
    top: 'Haut',
    center: 'Centre',
    bottom: 'Bas',
    triggerZone: 'Zone de déclenchement',
    edgeLocationHintTitle: 'Indice de position au bord',
    edgeLocationHintDesc: 'Éclairer subtilement le bord lors d\'un toucher hors zone',
    edgeTriggerPositionTitle: 'Position de déclenchement au bord',
    edgeTriggerPositionDesc: 'Emplacement de la bande de survol par rapport au volet',
    hoverAreaSizeTitle: 'Taille de la zone de survol',
    hoverAreaSizeDesc: 'Taille de la zone de survol au bord de l\'écran',
    medium: 'Moyen',
    edgeTriggerThicknessTitle: 'Épaisseur de déclenchement',
    edgeTriggerThicknessDesc: 'Épaisseur physique de la bande invisible de déclenchement',
    panelHeightTitle: 'Hauteur du volet',
    panelHeightDesc: 'Taille verticale du volet de presse-papiers'
  },
  appearance: {
    copyIndicatorTitle: 'Indicateur de copie',
    copyIndicatorDesc: 'Afficher un signal visuel lors de la copie',
    indicatorStyleTitle: 'Style d\'indicateur',
    indicatorStyleDesc: 'Choisir la forme de l\'indicateur',
    typography: 'Typographie',
    textSizeTitle: 'Taille du texte',
    textSizeDesc: 'Ajuster la taille de la police',
    audioAndFeedback: 'Audio et retours',
    small: 'Petit',
    normal: 'Normal',
    medium: 'Moyen',
    large: 'Grand',
    cardViewTitle: 'Disposition des cartes',
    cardViewDesc: 'Alterner entre cartes et liste compacte',
    modernCards: 'Cartes modernes',
    compactRows: 'Lignes compactes',
    logoStyle: 'Logo',
    tickStyle: 'Coche',
    copyStyle: 'Copie',
    sparkleStyle: 'Étoile'
  },
  item: {
    copy: 'Copier',
    pinned: 'ÉPINGLÉS',
    pin: 'Épingler',
    unpin: 'Désépingler',
    delete: 'Supprimer',
    clear: 'Vider',
    dropToSave: 'Déposer pour enregistrer',
    dropToSaveDesc: 'Tout fichier, image, lien ou texte',
    justNow: 'à l\'instant',
    ago: 'plus tôt',
    expand: 'Agrandir',
    textItem: 'Texte',
    imageItem: 'Image',
    fileItem: 'Fichier',
    linkItem: 'Lien',
    items: 'éléments',
    recent: 'RÉCENTS',
    expandPinned: 'Développer les épinglés',
    collapsePinned: 'Réduire les épinglés',
    screenshot: 'Capture d\'écran',
    ungroup: 'Dégrouper',
    copyFilePath: 'Copier le chemin du fichier',
    moreImages: '+{count} images de plus',
    moreFiles: '+{count} fichiers de plus',
    singleFile: '1 fichier',
    scrollToTop: 'Haut de page'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'Présentation',
    archive: 'Archive',
    text: 'Texte',
    code: 'Code',
    audio: 'Audio',
    video: 'Vidéo',
    image: 'Image',
    file: 'Fichier'
  },
  emptyState: {
    shelfEmpty: 'Le volet est vide',
    noResultsFound: 'Aucun résultat',
    shelfEmptyHint: 'Copiez du texte ou glissez des fichiers ici',
    noResultsHint: 'Essayez un autre mot-clé',
    noClipsFound: 'Aucun {type} trouvé',
    copyTypeHint: 'Copiez des {type} ou revenez à Tous',
    textClips: 'textes',
    links: 'liens',
    images: 'images',
    files: 'fichiers'
  },
  onboarding: {
    welcomeTitle: 'Bienvenue sur Edge-Drop',
    welcomeDesc: 'Edge-Drop reste masqué sur le bord gauche. Glissez le curseur pour l\'ouvrir.',
    collectTitle: 'Collectez tout',
    collectDesc: 'Copiez n\'importe quel contenu avec Ctrl+C, Edge-Drop le sauvegarde automatiquement.',
    dragTitle: 'Glissez-déposez',
    dragDesc: 'Glissez directement les cartes dans vos applications.',
    stacksTitle: 'Piles de fichiers',
    stacksDesc: 'Les fichiers multiples sont regroupés automatiquement.',
    ungroupTitle: 'Dégrouper les piles',
    ungroupDesc: 'Faites glisser un sous-élément vers la barre de gauche pour l\'extraire.',
    mergeTitle: 'Fusionner des éléments',
    mergeDesc: 'Déposez des cartes les unes sur les autres pour créer une pile.',
    previewTitle: 'Aperçu détaillé',
    previewDesc: 'Inspectez les images et textes dans le volet d\'aperçu.',
    configTitle: 'Configuration',
    configDesc: 'Personnalisez vos préférences.',
    skip: 'Passer',
    back: 'Retour',
    next: 'Suivant',
    getStarted: 'Commencer',
    extractedCard: 'Carte extraite',
    dropToExtract: 'Déposez pour extraire',
    proTips: 'Conseils pros',
    proTip1: 'Appuyez sur Alt + C pour afficher le volet.',
    proTip2: 'Accédez aux paramètres via l\'icône engrenage.',
    proTip3: 'Glissez-déposez des fichiers sur le bord gauche.',
    proTip4: 'Cliquez sur une zone texte puis sur un élément.'
  },
  tray: {
    showClipboard: 'Afficher le presse-papiers',
    settings: 'Paramètres',
    incognito: 'Incognito (pause)',
    hoverTrigger: 'Survol actif',
    stickTo: 'Ancrer à',
    left: 'Gauche',
    right: 'Droite',
    display: 'Écran',
    quit: 'Quitter Edge-Drop',
    welcomeTitle: 'Presse-papiers Edge-Drop',
    welcomeBody: 'Survolez le bord gauche ou utilisez Alt+C.'
  },
  flyout: {
    copyBeaconStyleTitle: 'Style de l\'indicateur',
    openLink: 'Ouvrir le lien',
    copyContent: 'Copier le contenu',
    saveFile: 'Enregistrer le fichier',
    extractedFromBundle: 'Extrait de la pile',
    itemsCount: '{count} éléments',
    selectedCount: '{count} Sélectionnés',
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner',
    copySelected: 'Copier les éléments sélectionnés',
    pasteSelected: 'Coller les éléments sélectionnés',
    paste: 'Coller',
    clearSelection: 'Effacer la sélection',
    contentTruncated: '… (contenu tronqué)',
    clickToPaste: 'Cliquer pour coller',
    copyText: 'Copier le texte',
    copyImage: 'Copier l\'image',
    copyFile: 'Copier le fichier',
    clickToPasteDrag: 'Cliquer pour coller · Glisser pour déplacer',
    openInExplorer: 'Ouvrir dans l\'Explorateur',
    current: 'Actuel'
  },
  toast: {
    copiedToClipboard: 'Copié dans le presse-papiers',
    itemDeleted: 'Élément supprimé',
    itemPinned: 'Élément épinglé',
    itemUnpinned: 'Élément désépinglé',
    settingsSaved: 'Paramètres enregistrés'
  },
  footer: {
    communityAndSupport: 'Communauté et Support',
    feedbackTitle: 'Commentaires et Problèmes',
    feedbackDesc: 'Signaler des bugs ou suggérer des fonctionnalités sur GitHub',
    submitFeedback: 'Envoyer des Commentaires ↗',
    applicationGroup: 'Application',
    quitTitle: 'Quitter Edge-Drop',
    quitDesc: 'Fermer l\'application et arrêter le processus en arrière-plan',
    starOnGithub: 'Étoiler sur GitHub',
    githubPromo: 'Si vous aimez Edge-Drop, ajoutez une étoile sur GitHub !',
    version: 'Version'
  }
}

export const de: TranslationKeys = {
  filters: { all: 'Alle', text: 'Text', links: 'Links', images: 'Bilder', files: 'Dateien' },
  tabs: { behaviour: 'Verhalten', position: 'Position', appearance: 'Erscheinungsbild' },
  header: { searchPlaceholder: 'Verlauf durchsuchen...', settings: 'Einstellungen', close: 'Schließen', whatsNew: 'Neuheiten' },
  behaviour: {
    languageTitle: 'Sprache',
    languageDesc: 'Sprache für Steuerelemente und Menüs auswählen',
    systemDefault: 'Systemstandard (Auto)',
    launchAtLoginTitle: 'Beim Autostart starten',
    launchAtLoginDesc: 'Beim Hochfahren des Computers im Hintergrund starten',
    incognitoTitle: 'Inkognito-Modus',
    incognitoDesc: 'Zwischenablage-Aufzeichnung vorübergehend pausieren',
    hoverActivationTitle: 'Hover-Aktivierung',
    hoverActivationDescOn: 'Leiste öffnen, wenn der Zeiger den Bildschirmrand berührt',
    hoverActivationDescOff: 'Hover pausiert. Verwenden Sie Alt + C zum Öffnen',
    disabledHoverOff: 'Deaktiviert, da Hover-Aktivierung ausgeschaltet ist',
    fullscreenProtectionTitle: 'Vollbild-Schutz',
    fullscreenProtectionDesc: 'Automatisches Öffnen bei Spielen oder Vollbildvideos pausieren',
    clearUnpinnedTitle: 'Nicht angeheftete beim Neustart löschen',
    clearUnpinnedDesc: 'Nicht angeheftete Einträge bei jedem Neustart der App löschen',
    soundEffectsTitle: 'Soundeffekte',
    soundEffectsDesc: 'Taktiles Audio-Feedback bei Interaktionen abspielen',
    autoUpdatesTitle: 'Automatische Updates',
    autoUpdatesDescOn: 'Updates automatisch im Hintergrund prüfen und herunterladen',
    autoUpdatesDescOff: 'Automatische Prüfung pausiert. Manuell unten prüfen',
    checkForUpdates: 'Nach Updates suchen',
    checkingForUpdates: 'GitHub wird nach Updates durchsucht...',
    isUpToDate: '✓ Edge-Drop ist auf dem neuesten Stand',
    checkAgain: 'Erneut prüfen',
    tryAgain: 'Erneut versuchen',
    updateCheckFailed: 'Update-Prüfung fehlgeschlagen',
    updateAvailableTitle: 'Edge-Drop v{version} ist verfügbar!',
    updateAvailableDesc: 'Eine neue Version ist verfügbar. Jetzt herunterladen?',
    downloadAndUpdate: 'Herunterladen & Aktualisieren',
    skip: 'Überspringen',
    downloadingUpdate: 'Update-Paket wird im Hintergrund heruntergeladen...',
    updateReadyTitle: 'Update v{version} bereit',
    updateReadyDesc: 'Klicken zum Neustarten von Edge-Drop.',
    restartToUpdate: 'Neu starten zum Aktualisieren',
    restartToUpdateBelow: 'Unten neu starten',
    newUpdateAvailableBelow: 'Neues Update unten verfügbar',
    autoDeleteTitle: 'Automatische Lösch-Zeitschaltuhr',
    autoDeleteDesc: 'Kopierte Einträge automatisch bereinigen (Angeheftete bleiben erhalten)',
    never: 'Nie',
    capacityTitle: 'Verlaufskapazität',
    capacityDesc: 'Maximale Anzahl nicht angehefteter Einträge im Verlauf'
  },
  position: {
    edgePlacementTitle: 'Bildschirmrand',
    edgePlacementDesc: 'Wählen Sie den Verankerungsrand',
    leftEdge: 'Linker Rand',
    rightEdge: 'Rechter Rand',
    displayTitle: 'Bildschirm',
    displayDesc: 'Wählen Sie den Monitor aus',
    primaryDisplay: 'Hauptbildschirm',
    verticalPositionTitle: 'Vertikale Position',
    verticalPositionDesc: 'Vertikale Ausrichtung am Rand anpassen',
    top: 'Oben',
    center: 'Mitte',
    bottom: 'Unten',
    triggerZone: 'Auslösezone',
    edgeLocationHintTitle: 'Rand-Hinweis',
    edgeLocationHintDesc: 'Sanftes Aufleuchten am Rand bei Berührung außerhalb der Zone',
    edgeTriggerPositionTitle: 'Auslöseposition am Rand',
    edgeTriggerPositionDesc: 'Platzierung des Auslösestreifens relativ zur Ablage',
    hoverAreaSizeTitle: 'Größe des Auslösebereichs',
    hoverAreaSizeDesc: 'Größe des Hover-Bereichs am Bildschirmrand',
    medium: 'Mittel',
    edgeTriggerThicknessTitle: 'Dicke der Auslösezone',
    edgeTriggerThicknessDesc: 'Physische Dicke des unsichtbaren Auslösestreifens',
    panelHeightTitle: 'Ablagehöhe',
    panelHeightDesc: 'Vertikale Größe der Zwischenablage-Ablage'
  },
  appearance: {
    copyIndicatorTitle: 'Kopier-Indikator',
    copyIndicatorDesc: 'Visuelles Signal am Rand beim Kopieren anzeigen',
    indicatorStyleTitle: 'Indikator-Stil',
    indicatorStyleDesc: 'Form des Indikators wählen',
    typography: 'Typografie',
    textSizeTitle: 'Textgröße',
    textSizeDesc: 'Schriftgröße anpassen',
    audioAndFeedback: 'Audio & Feedback',
    small: 'Klein',
    normal: 'Normal',
    medium: 'Mittel',
    large: 'Groß',
    cardViewTitle: 'Karten-Layout',
    cardViewDesc: 'Zwischen modernen Karten und kompakter Liste wechseln',
    modernCards: 'Moderne Karten',
    compactRows: 'Kompakte Zeilen',
    logoStyle: 'Logo',
    tickStyle: 'Haken',
    copyStyle: 'Kopie',
    sparkleStyle: 'Funkeln'
  },
  item: {
    copy: 'Kopieren',
    pinned: 'ANGEHEFTET',
    pin: 'Anheften',
    unpin: 'Lösen',
    delete: 'Löschen',
    clear: 'Leeren',
    dropToSave: 'Ablegen zum Speichern',
    dropToSaveDesc: 'Jede Datei, Bild, Link oder Text',
    justNow: 'gerade eben',
    ago: 'her',
    expand: 'Erweitern',
    textItem: 'Text',
    imageItem: 'Bild',
    fileItem: 'Datei',
    linkItem: 'Link',
    items: 'Einträge',
    recent: 'ZULEZT',
    expandPinned: 'Angeheftete erweitern',
    collapsePinned: 'Angeheftete einklappen',
    screenshot: 'Screenshot',
    ungroup: 'Stapel auflösen',
    copyFilePath: 'Dateipfad kopieren',
    moreImages: '+{count} weitere Bilder',
    moreFiles: '+{count} weitere Dateien',
    singleFile: '1 Datei',
    scrollToTop: 'Nach oben scrollen'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'Präsentation',
    archive: 'Archiv',
    text: 'Text',
    code: 'Code',
    audio: 'Audio',
    video: 'Video',
    image: 'Bild',
    file: 'Datei'
  },
  emptyState: {
    shelfEmpty: 'Ablage ist leer',
    noResultsFound: 'Keine Ergebnisse',
    shelfEmptyHint: 'Kopieren Sie Inhalte oder ziehen Sie Dateien hierher',
    noResultsHint: 'Versuchen Sie ein anderes Suchwort',
    noClipsFound: 'Keine {type} gefunden',
    copyTypeHint: 'Kopieren Sie {type} oder wechseln Sie zu Alle',
    textClips: 'Texte',
    links: 'Links',
    images: 'Bilder',
    files: 'Dateien'
  },
  onboarding: {
    welcomeTitle: 'Willkommen bei Edge-Drop',
    welcomeDesc: 'Edge-Drop befindet sich am linken Bildschirmrand. Bewegen Sie die Maus dorthin zum Öffnen.',
    collectTitle: 'Alles sammeln',
    collectDesc: 'Strg+C speichert automatisch Texte, Bilder und Dateien.',
    dragTitle: 'Überall hinziehen',
    dragDesc: 'Ziehen Sie Karten direkt in beliebige Anwendungen.',
    stacksTitle: 'Dateistapel nutzen',
    stacksDesc: 'Mehrere Dateien werden automatisch zu Stapeln zusammengefasst.',
    ungroupTitle: 'Stapel auflösen',
    ungroupDesc: 'Ziehen Sie ein Element zum linken Rand, um es zu entpacken.',
    mergeTitle: 'Karten zusammenführen',
    mergeDesc: 'Ziehen Sie Karten aufeinander, um Stapel zu erstellen.',
    previewTitle: 'Vorschau-Fenster',
    previewDesc: 'Betrachten Sie Bilder und Dokumente in hoher Auflösung.',
    configTitle: 'Einstellungen',
    configDesc: 'Passen Sie Edge-Drop individuell an.',
    skip: 'Überspringen',
    back: 'Zurück',
    next: 'Weiter',
    getStarted: 'Loslegen',
    extractedCard: 'Entpackte Karte',
    dropToExtract: 'Ablegen zum Entpacken',
    proTips: 'Profi-Tipps',
    proTip1: 'Drücken Sie Alt + C, um die Leiste zu öffnen.',
    proTip2: 'Einstellungen über das Zahnrad-Symbol öffnen.',
    proTip3: 'Dateien an den linken Rand ziehen.',
    proTip4: 'Textfeld anklicken, dann auf einen Eintrag klicken.'
  },
  tray: {
    showClipboard: 'Zwischenablage anzeigen',
    settings: 'Einstellungen',
    incognito: 'Inkognito (Pause)',
    hoverTrigger: 'Hover-Aktivierung',
    stickTo: 'Anheften an',
    left: 'Links',
    right: 'Rechts',
    display: 'Bildschirm',
    quit: 'Edge-Drop beenden',
    welcomeTitle: 'Edge-Drop Ablage',
    welcomeBody: 'Fahren Sie an den linken Rand oder drücken Sie Alt+C.'
  },
  flyout: {
    copyBeaconStyleTitle: 'Kopier-Indikator Stil',
    openLink: 'Link öffnen',
    copyContent: 'Inhalt kopieren',
    saveFile: 'Datei speichern',
    extractedFromBundle: 'Aus Stapel entpackt',
    itemsCount: '{count} Einträge',
    selectedCount: '{count} Ausgewählt',
    selectAll: 'Alle auswählen',
    deselectAll: 'Auswahl aufheben',
    copySelected: 'Ausgewählte kopieren',
    pasteSelected: 'Ausgewählte einfügen',
    paste: 'Einfügen',
    clearSelection: 'Auswahl löschen',
    contentTruncated: '… (Inhalt gekürzt)',
    clickToPaste: 'Klicken zum Einfügen',
    copyText: 'Text kopieren',
    copyImage: 'Bild kopieren',
    copyFile: 'Datei kopieren',
    clickToPasteDrag: 'Klicken zum Einfügen · Ziehen zum Bewegen',
    openInExplorer: 'Im Explorer öffnen',
    current: 'Aktuell'
  },
  toast: {
    copiedToClipboard: 'In Zwischenablage kopiert',
    itemDeleted: 'Eintrag gelöscht',
    itemPinned: 'Eintrag angeheftet',
    itemUnpinned: 'Eintrag gelöst',
    settingsSaved: 'Einstellungen gespeichert'
  },
  footer: {
    communityAndSupport: 'Community & Hilfe',
    feedbackTitle: 'Feedback & Fehler',
    feedbackDesc: 'Fehler melden oder Funktionen auf GitHub vorschlagen',
    submitFeedback: 'Feedback Senden ↗',
    applicationGroup: 'Anwendung',
    quitTitle: 'Edge-Drop Beenden',
    quitDesc: 'Anwendung schließen und Hintergrundprozess stoppen',
    starOnGithub: 'Auf GitHub bewerten',
    githubPromo: 'Wenn Ihnen Edge-Drop gefällt, geben Sie uns einen Stern auf GitHub!',
    version: 'Version'
  }
}

export const hi: TranslationKeys = {
  filters: { all: 'सभी', text: 'टेक्स्ट', links: 'लिंक', images: 'इमेज', files: 'फ़ाइलें' },
  tabs: { behaviour: 'व्यवहार', position: 'स्थिति', appearance: 'रूप-रंग' },
  header: { searchPlaceholder: 'इतिहास खोजें...', settings: 'सेटिंग्स', close: 'बंद करें', whatsNew: 'नया क्या है' },
  behaviour: {
    languageTitle: 'भाषा',
    languageDesc: 'सिस्टम नियंत्रणों के लिए भाषा चुनें',
    systemDefault: 'सिस्टम डिफ़ॉल्ट (ऑटो)',
    launchAtLoginTitle: 'लॉगिन पर शुरू करें',
    launchAtLoginDesc: 'कंप्यूटर बूट होने पर बैकग्राउंड में शुरू करें',
    incognitoTitle: 'इंकॉग्निटो मोड',
    incognitoDesc: 'नया क्लिपबोर्ड डेटा रिकॉर्ड करना रोकें',
    hoverActivationTitle: 'होवर सक्रियण',
    hoverActivationDescOn: 'स्क्रीन किनारे पर कर्सर लाने पर शेल्फ़ खोलें',
    hoverActivationDescOff: 'होवर रुका हुआ है। खोलने के लिए Alt + C दबाएं',
    disabledHoverOff: 'अक्षम है क्योंकि होवर सक्रियण बंद है',
    fullscreenProtectionTitle: 'फ़ुलस्क्रीन सुरक्षा',
    fullscreenProtectionDesc: 'गेमिंग या फ़ुलस्क्रीन वीडियो के दौरान होवर रोकें',
    clearUnpinnedTitle: 'पुनारंभ पर अनपिन साफ़ करें',
    clearUnpinnedDesc: 'ऐप रीस्टार्ट होने पर अनपिन सामग्री साफ़ करें',
    soundEffectsTitle: 'ध्वनि प्रभाव',
    soundEffectsDesc: 'बटन और टॉगल पर ऑडियो प्रतिक्रिया बजाएं',
    autoUpdatesTitle: 'स्वचालित अपडेट',
    autoUpdatesDescOn: 'बैकग्राउंड में स्वचालित अपडेट जांचें और डाउनलोड करें',
    autoUpdatesDescOff: 'अपडेट जांच रुकी हुई है। नीचे मैन्युअल रूप से जांचें',
    checkForUpdates: 'अपडेट जांचें',
    checkingForUpdates: 'GitHub पर अपडेट की जांच की जा रही है...',
    isUpToDate: '✓ Edge-Drop अद्यतन है',
    checkAgain: 'पुनः जांचें',
    tryAgain: 'पुनः प्रयास करें',
    updateCheckFailed: 'अपडेट जांच विफल रही',
    updateAvailableTitle: 'Edge-Drop v{version} उपलब्ध है!',
    updateAvailableDesc: 'नया संस्करण तैयार है। क्या आप अभी डाउनलोड करना चाहते हैं?',
    downloadAndUpdate: 'डाउनलोड करें और अपडेट करें',
    skip: 'छोड़ें',
    downloadingUpdate: 'बैकग्राउंड में अपडेट पैक डाउनलोड हो रहा है...',
    updateReadyTitle: 'अपडेट v{version} तैयार है',
    updateReadyDesc: 'Edge-Drop रीस्टार्ट करने के लिए क्लिक करें।',
    restartToUpdate: 'रीस्टार्ट करके अपडेट करें',
    restartToUpdateBelow: 'अपडेट के लिए नीचे रीस्टार्ट करें',
    newUpdateAvailableBelow: 'नीचे नया अपडेट उपलब्ध है',
    autoDeleteTitle: 'स्वतः-हटाने का टाइमर',
    autoDeleteDesc: 'कॉपी की गई सामग्री स्वतः साफ़ करें (पिन की गई सुरक्षित रहेगी)',
    never: 'कभी नहीं',
    capacityTitle: 'इतिहास की क्षमता',
    capacityDesc: 'इतिहास में सहेजी जाने वाली अनपिन सामग्री की अधिकतम संख्या'
  },
  position: {
    edgePlacementTitle: 'स्क्रीन किनारा',
    edgePlacementDesc: 'चुनें कि Edge-Drop किस किनारे पर रहे',
    leftEdge: 'बायां किनारा',
    rightEdge: 'दायां किनारा',
    displayTitle: 'डिस्प्ले स्क्रीन',
    displayDesc: 'मॉनिटर चुनें',
    primaryDisplay: 'मुख्य डिस्प्ले',
    verticalPositionTitle: 'लंबवत स्थिति',
    verticalPositionDesc: 'किनारे पर लंबवत संरेखण समायोजित करें',
    top: 'ऊपर',
    center: 'बीच में',
    bottom: 'नीचे',
    triggerZone: 'ट्रिगर क्षेत्र',
    edgeLocationHintTitle: 'स्क्रीन किनारा संकेत',
    edgeLocationHintDesc: 'गलत स्थान पर छूने पर किनारे पर हल्का प्रकाश दिखाएं',
    edgeTriggerPositionTitle: 'होवर ट्रिगर की स्थिति',
    edgeTriggerPositionDesc: 'शेल्फ़ की तुलना में होवर पट्टी की स्थिति',
    hoverAreaSizeTitle: 'होवर क्षेत्र का आकार',
    hoverAreaSizeDesc: 'स्क्रीन किनारे पर होवर क्षेत्र का आकार',
    medium: 'मध्यम',
    edgeTriggerThicknessTitle: 'ट्रिगर पट्टी की मोटाई',
    edgeTriggerThicknessDesc: 'अदृश्य ट्रिगर पट्टी की भौतिक मोटाई',
    panelHeightTitle: 'शेल्फ़ की ऊंचाई',
    panelHeightDesc: 'क्लिपबोर्ड शेल्फ़ का लंबवत आकार'
  },
  appearance: {
    copyIndicatorTitle: 'कॉपी संकेतक',
    copyIndicatorDesc: 'कॉपी करते समय किनारे पर दृश्य संकेतक दिखाएं',
    indicatorStyleTitle: 'संकेतक शैली',
    indicatorStyleDesc: 'संकेतक का आकार चुनें',
    typography: 'टाइपोग्राफी (पाठ)',
    textSizeTitle: 'पाठ आकार',
    textSizeDesc: 'इंटरफ़ेस फ़ॉन्ट का आकार समायोजित करें',
    audioAndFeedback: 'ऑडियो और प्रतिक्रिया',
    small: 'छोटा',
    normal: 'सामान्य',
    medium: 'मध्यम',
    large: 'बड़ा',
    cardViewTitle: 'कार्ड लेआउट',
    cardViewDesc: 'आधुनिक कार्ड या कॉम्पैक्ट सूची में बदलें',
    modernCards: 'आधुनिक कार्ड',
    compactRows: 'कॉम्पैक्ट पंक्तियाँ',
    logoStyle: 'लोगो',
    tickStyle: 'टिक',
    copyStyle: 'कॉपी',
    sparkleStyle: 'चमक'
  },
  item: {
    copy: 'कॉपी',
    pinned: 'पिन किए गए',
    pin: 'पिन करें',
    unpin: 'अनपिन करें',
    delete: 'हटाएं',
    clear: 'साफ़ करें',
    dropToSave: 'सहेजने के लिए यहां छोड़ें',
    dropToSaveDesc: 'कोई भी फ़ाइल, इमेज, लिंक या टेक्स्ट',
    justNow: 'अभी-अभी',
    ago: 'पहले',
    expand: 'विस्तार करें',
    textItem: 'टेक्स्ट',
    imageItem: 'इमेज',
    fileItem: 'फ़ाइल',
    linkItem: 'लिंक',
    items: 'सामग्री',
    recent: 'हाल का इतिहास',
    expandPinned: 'पिन की गई सामग्री खोलें',
    collapsePinned: 'पिन की गई सामग्री बंद करें',
    screenshot: 'स्क्रीनशॉट',
    ungroup: 'अलग करें',
    copyFilePath: 'फ़ाइल पाथ कॉपी करें',
    moreImages: '+{count} अधिक इमेज',
    moreFiles: '+{count} अधिक फ़ाइलें',
    singleFile: '1 फ़ाइल',
    scrollToTop: 'ऊपर जाएं'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'स्लाइड्स',
    archive: 'आर्काइव',
    text: 'टेक्स्ट',
    code: 'कोड',
    audio: 'ऑडियो',
    video: 'वीडियो',
    image: 'इमेज',
    file: 'फ़ाइल'
  },
  emptyState: {
    shelfEmpty: 'शेल्फ़ खाली है',
    noResultsFound: 'कोई परिणाम नहीं मिला',
    shelfEmptyHint: 'शुरू करने के लिए कुछ कॉपी करें या फ़ाइलें यहां लाएं',
    noResultsHint: 'अलग शब्द खोजें या खोज साफ़ करें',
    noClipsFound: 'कोई {type} नहीं मिला',
    copyTypeHint: '{type} कॉपी करें या सभी पर वापस जाएं',
    textClips: 'टेक्स्ट क्लिप',
    links: 'लिंक',
    images: 'इमेज',
    files: 'फ़ाइलें'
  },
  onboarding: {
    welcomeTitle: 'Edge-Drop में आपका स्वागत है',
    welcomeDesc: 'Edge-Drop आपकी स्क्रीन के बाएं किनारे पर छिपा रहता है। शेल्फ़ खोलने के लिए कर्सर किनारे पर लाएं।',
    collectTitle: 'कुछ भी सहेजें',
    collectDesc: 'जब भी आप Ctrl+C दबाते हैं, Edge-Drop स्वतः सब कुछ सहेज लेता है।',
    dragTitle: 'कहीं भी ड्रैग करें',
    dragDesc: 'किसी भी सामग्री का उपयोग करने के लिए उसे सीधे ऐप या फ़ोल्डर में ड्रैग करें।',
    stacksTitle: 'फ़ाइल स्टैक',
    stacksDesc: 'एक साथ कई फ़ाइलें कॉपी करने पर वे एक स्टैक में जुड़ जाती हैं।',
    ungroupTitle: 'फ़ाइलें अलग करें',
    ungroupDesc: 'स्टैक से किसी फ़ाइल को बाहर निकालने के लिए उसे बाएं किनारे पर लाएं।',
    mergeTitle: 'कार्ड जोड़ें',
    mergeDesc: 'अलग कार्ड्स को एक-दूसरे पर ड्रैग करके एक स्टैक बनाएं।',
    previewTitle: 'पूर्वावलोकन',
    previewDesc: 'इमेज और टेक्स्ट को विस्तार से देखने के लिए प्रिव्यू खोलें।',
    configTitle: 'सेटिंग्स',
    configDesc: 'अपनी पसंद के अनुसार Edge-Drop को कस्टमाइज़ करें।',
    skip: 'छोड़ें',
    back: 'पीछे',
    next: 'आगे',
    getStarted: 'शुरू करें',
    extractedCard: 'अलग की गई फ़ाइल',
    dropToExtract: 'अलग करने के लिए यहां छोड़ें',
    proTips: 'महत्वपूर्ण सुझाव',
    proTip1: 'शेल्फ़ खोलने के लिए Alt + C दबाएं।',
    proTip2: 'गियर आइकन से सेटिंग्स खोलें।',
    proTip3: 'फ़ाइलों को जोड़ने के लिए बाएं किनारे पर ड्रैग करें।',
    proTip4: 'टेक्स्ट बॉक्स पर क्लिक करें फिर सामग्री पेस्ट करें।'
  },
  tray: {
    showClipboard: 'क्लिपबोर्ड दिखाएं',
    settings: 'सेटिंग्स',
    incognito: 'इंकॉग्निटो (कैप्चर रोकें)',
    hoverTrigger: 'होवर ट्रिगर',
    stickTo: 'किनारा चुनें',
    left: 'बायां',
    right: 'दायां',
    display: 'डिस्प्ले',
    quit: 'Edge-Drop से बाहर निकलें',
    welcomeTitle: 'Edge-Drop क्लिपबोर्ड',
    welcomeBody: 'स्क्रीन किनारे पर होवर करें या Alt+C दबाएं।'
  },
  flyout: {
    copyBeaconStyleTitle: 'कॉपी संकेतक शैली',
    openLink: 'लिंक खोलें',
    copyContent: 'सामग्री कॉपी करें',
    saveFile: 'फ़ाइल सहेजें',
    extractedFromBundle: 'स्टैक से अलग किया गया',
    itemsCount: '{count} सामग्री',
    selectedCount: '{count} चयनित',
    selectAll: 'सभी चुनें',
    deselectAll: 'चयन हटाएं',
    copySelected: 'चयनित कॉपी करें',
    pasteSelected: 'चयनित पेस्ट करें',
    paste: 'पेस्ट',
    clearSelection: 'चयन साफ़ करें',
    contentTruncated: '… (सामग्री संक्षिप्त की गई)',
    clickToPaste: 'पेस्ट करने के लिए क्लिक करें',
    copyText: 'टेक्स्ट कॉपी करें',
    copyImage: 'इमेज कॉपी करें',
    copyFile: 'फ़ाइल कॉपी करें',
    clickToPasteDrag: 'पेस्ट के लिए क्लिक करें · ले जाने के लिए ड्रैग करें',
    openInExplorer: 'फ़ोल्डर स्थान खोलें',
    current: 'वर्तमान'
  },
  toast: {
    copiedToClipboard: 'क्लिपबोर्ड पर कॉपी किया गया',
    itemDeleted: 'सामग्री हटाई गई',
    itemPinned: 'सामग्री पिन की गई',
    itemUnpinned: 'सामग्री अनपिन की गई',
    settingsSaved: 'सेटिंग्स सहेजी गईं'
  },
  footer: {
    communityAndSupport: 'समुदाय और सहायता',
    feedbackTitle: 'प्रतिक्रिया और समस्याएं',
    feedbackDesc: 'GitHub पर बग रिपोर्ट करें या सुझाव दें',
    submitFeedback: 'प्रतिक्रिया भेजें ↗',
    applicationGroup: 'एप्लिकेशन',
    quitTitle: 'Edge-Drop बंद करें',
    quitDesc: 'ऐप बंद करें और बैकग्राउंड प्रोसेस रोकें',
    starOnGithub: 'GitHub पर स्टार दें',
    githubPromo: 'यदि आपको Edge-Drop पसंद है, तो GitHub पर स्टार दें!',
    version: 'संस्करण'
  }
}

export const zhCN: TranslationKeys = {
  filters: { all: '全部', text: '文本', links: '链接', images: '图片', files: '文件' },
  tabs: { behaviour: '常规行为', position: '面板位置', appearance: '外观样式' },
  header: { searchPlaceholder: '搜索剪贴板历史...', settings: '设置', close: '关闭', whatsNew: '更新日志' },
  behaviour: {
    languageTitle: '界面语言',
    languageDesc: '选择 Edge-Drop 系统菜单和控制项语言',
    systemDefault: '跟随系统默认 (自动)',
    launchAtLoginTitle: '开机自动启动',
    launchAtLoginDesc: '开机时在后台静默启动',
    incognitoTitle: '无痕隐身模式',
    incognitoDesc: '暂停记录新的剪贴板项目',
    hoverActivationTitle: '悬停触发',
    hoverActivationDescOn: '鼠标光标接近屏幕边缘时滑出面板',
    hoverActivationDescOff: '悬停已暂停，按 Alt + C 快捷键打开',
    disabledHoverOff: '已禁用（因为悬停触发已关闭）',
    fullscreenProtectionTitle: '全屏保护',
    fullscreenProtectionDesc: '在全屏游戏或观看视频时自动暂停边缘悬停',
    clearUnpinnedTitle: '重启时清除未固定项目',
    clearUnpinnedDesc: '每次应用重启时自动清空未固定项目',
    soundEffectsTitle: '按键音效',
    soundEffectsDesc: '播放按钮和开关点击的触觉声音反馈',
    autoUpdatesTitle: '自动更新',
    autoUpdatesDescOn: '在后台自动检查并下载应用更新',
    autoUpdatesDescOff: '自动检查已暂停，可在下方手动检查',
    checkForUpdates: '检查更新',
    checkingForUpdates: '正在 GitHub 检查更新...',
    isUpToDate: '✓ Edge-Drop 已是最新版本',
    checkAgain: '重新检查',
    tryAgain: '重试',
    updateCheckFailed: '检查更新失败',
    updateAvailableTitle: 'Edge-Drop v{version} 现已可用！',
    updateAvailableDesc: 'GitHub 上有新版本，是否立即下载并更新？',
    downloadAndUpdate: '下载并更新',
    skip: '跳过',
    downloadingUpdate: '正在后台下载更新包...',
    updateReadyTitle: '更新 v{version} 已就绪',
    updateReadyDesc: '点击重启 Edge-Drop 并完成更新。',
    restartToUpdate: '重启并应用更新',
    restartToUpdateBelow: '在下方重启更新',
    newUpdateAvailableBelow: '下方有可用更新',
    autoDeleteTitle: '自动清理定时器',
    autoDeleteDesc: '自动定期清理复制的历史记录（保留已固定项目）',
    never: '从不',
    capacityTitle: '历史记录容量',
    capacityDesc: '剪贴板历史记录保存的最大未固定项目数'
  },
  position: {
    edgePlacementTitle: '屏幕边缘',
    edgePlacementDesc: '选择面板停靠的屏幕边缘',
    leftEdge: '左侧边缘',
    rightEdge: '右侧边缘',
    displayTitle: '显示器',
    displayDesc: '选择显示面板的显示器',
    primaryDisplay: '主显示器',
    verticalPositionTitle: '垂直位置',
    verticalPositionDesc: '调整面板沿边缘的垂直位置',
    top: '顶部',
    center: '居中',
    bottom: '底部',
    triggerZone: '触发区域',
    edgeLocationHintTitle: '边缘位置提示',
    edgeLocationHintDesc: '触摸非触发区域时在屏幕边缘微弱发光提示',
    edgeTriggerPositionTitle: '边缘触发位置',
    edgeTriggerPositionDesc: '悬停触发条相对于剪贴板面板的位置',
    hoverAreaSizeTitle: '悬停感应区域大小',
    hoverAreaSizeDesc: '屏幕边缘悬停触发区域的感应范围',
    medium: '中等',
    edgeTriggerThicknessTitle: '边缘触发条厚度',
    edgeTriggerThicknessDesc: '隐形边缘触发条的物理感应宽度',
    panelHeightTitle: '面板高度',
    panelHeightDesc: '剪贴板面板的垂直高度大小'
  },
  appearance: {
    copyIndicatorTitle: '复制指示器',
    copyIndicatorDesc: '复制内容时在屏幕边缘显示视觉反馈',
    indicatorStyleTitle: '指示器样式',
    indicatorStyleDesc: '选择边缘指示器的形状样式',
    typography: '字体排版',
    textSizeTitle: '文字大小',
    textSizeDesc: '调整界面字体缩放大小',
    audioAndFeedback: '声音与反馈',
    small: '小',
    normal: '标准',
    medium: '中等',
    large: '大',
    cardViewTitle: '卡片布局',
    cardViewDesc: '在现代卡片和紧凑列表之间切换',
    modernCards: '现代卡片',
    compactRows: '紧凑列表',
    logoStyle: '图标',
    tickStyle: '对勾',
    copyStyle: '复制',
    sparkleStyle: '闪烁'
  },
  item: {
    copy: '复制',
    pinned: '置顶项目',
    pin: '置顶',
    unpin: '取消置顶',
    delete: '删除',
    clear: '清空',
    dropToSave: '释放以保存',
    dropToSaveDesc: '支持任何文件、图片、链接或文本',
    justNow: '刚刚',
    ago: '前',
    expand: '展开',
    textItem: '文本',
    imageItem: '图片',
    fileItem: '文件',
    linkItem: '链接',
    items: '项',
    recent: '最近记录',
    expandPinned: '展开置顶项目',
    collapsePinned: '折叠置顶项目',
    screenshot: '截屏',
    ungroup: '拆分',
    copyFilePath: '复制文件路径',
    moreImages: '+{count} 张更多图片',
    moreFiles: '+{count} 个更多文件',
    singleFile: '1 个文件',
    scrollToTop: '回到顶部'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: '幻灯片',
    archive: '压缩包',
    text: '文本',
    code: '代码',
    audio: '音频',
    video: '视频',
    image: '图片',
    file: '文件'
  },
  emptyState: {
    shelfEmpty: '剪贴板为空',
    noResultsFound: '未找到相关结果',
    shelfEmptyHint: '复制任何内容或将文件拖放到此处即可开始',
    noResultsHint: '尝试更改关键词或清除搜索框',
    noClipsFound: '未找到{type}',
    copyTypeHint: '复制{type}或切换回全部',
    textClips: '文本项',
    links: '链接项',
    images: '图片项',
    files: '文件项'
  },
  onboarding: {
    welcomeTitle: '欢迎使用 Edge-Drop',
    welcomeDesc: 'Edge-Drop 隐藏停靠在屏幕左侧边缘。将鼠标移至左边缘即可呼出面板。',
    collectTitle: '自动收集一切',
    collectDesc: '按下 Ctrl+C 复制文本、图片或文件时，Edge-Drop 会在后台自动保存。',
    dragTitle: '随时随地拖放',
    dragDesc: '只需拖动卡片即可将其直接粘贴至任何应用程序或文件夹中。',
    stacksTitle: '文件堆栈',
    stacksDesc: '同时复制多个文件会自动合并为一个堆栈。',
    ungroupTitle: '拆分堆栈',
    ungroupDesc: '将堆栈内的文件拖至左侧边缘橙色条即可独立拆分出来。',
    mergeTitle: '合并项目',
    mergeDesc: '将文件或图片卡片互相拖放即可创建堆栈。',
    previewTitle: '大图与文本预览',
    previewDesc: '点击展开预览按钮可查看高分辨率图片或长文本。',
    configTitle: '个性化设置',
    configDesc: '根据您的习惯自定义 Edge-Drop。',
    skip: '跳过',
    back: '上一步',
    next: '下一步',
    getStarted: '开始使用',
    extractedCard: '已拆分的卡片',
    dropToExtract: '释放以拆分为独立卡片',
    proTips: '实用技巧',
    proTip1: '按 Alt + C 可即时切换剪贴板面板。',
    proTip2: '点击右上角齿轮图标随时打开设置。',
    proTip3: '将文件拖放至左侧边缘即可添加。',
    proTip4: '点击输入框，然后点击剪贴板项目即可自动粘贴。'
  },
  tray: {
    showClipboard: '显示剪贴板',
    settings: '设置',
    incognito: '无痕隐身 (暂停记录)',
    hoverTrigger: '悬停触发',
    stickTo: '停靠边缘',
    left: '左侧',
    right: '右侧',
    display: '显示器',
    quit: '退出 Edge-Drop',
    welcomeTitle: 'Edge-Drop 剪贴板',
    welcomeBody: '悬停至屏幕左侧边缘或按 Alt+C 即可呼出。'
  },
  flyout: {
    copyBeaconStyleTitle: '复制指示器样式',
    openLink: '打开链接',
    copyContent: '复制内容',
    saveFile: '保存文件',
    extractedFromBundle: '已从堆栈中拆分',
    itemsCount: '{count} 项',
    selectedCount: '已选择 {count} 项',
    selectAll: '全选',
    deselectAll: '取消全选',
    copySelected: '复制已选项',
    pasteSelected: '粘贴已选项',
    paste: '粘贴',
    clearSelection: '清除选择',
    contentTruncated: '… (内容已截断)',
    clickToPaste: '点击粘贴',
    copyText: '复制文本',
    copyImage: '复制图片',
    copyFile: '复制文件',
    clickToPasteDrag: '点击粘贴 · 拖动移动',
    openInExplorer: '在文件资源管理器中打开',
    current: '当前'
  },
  toast: {
    copiedToClipboard: '已复制到剪贴板',
    itemDeleted: '项目已删除',
    itemPinned: '项目已置顶',
    itemUnpinned: '项目已置顶',
    settingsSaved: '设置已保存'
  },
  footer: {
    communityAndSupport: '社区与支持',
    feedbackTitle: '反馈与建议',
    feedbackDesc: '在 GitHub 上提交 Bug 或功能建议',
    submitFeedback: '提交反馈 ↗',
    applicationGroup: '应用程序',
    quitTitle: '退出 Edge-Drop',
    quitDesc: '关闭应用程序并停止后台进程',
    starOnGithub: '在 GitHub 点赞',
    githubPromo: '如果您喜欢 Edge-Drop，欢迎在 GitHub 上点亮 Star！',
    version: '版本'
  }
}

export const ja: TranslationKeys = {
  filters: { all: 'すべて', text: 'テキスト', links: 'リンク', images: '画像', files: 'ファイル' },
  tabs: { behaviour: '動作設定', position: '位置設定', appearance: '外観デザイン' },
  header: { searchPlaceholder: '検索...', settings: '設定', close: '閉じる', whatsNew: '新機能' },
  behaviour: {
    languageTitle: '表示言語',
    languageDesc: 'UIおよびメニューの表示言語を選択',
    systemDefault: 'システムデフォルト (自動)',
    launchAtLoginTitle: 'ログイン時に起動',
    launchAtLoginDesc: 'PC起動時にバックグラウンドで自動起動',
    incognitoTitle: 'シークレットモード',
    incognitoDesc: '新しいクリップボードの記録を一時停止',
    hoverActivationTitle: 'ホバー起動',
    hoverActivationDescOn: 'カーソルを画面端に近づけるとシェルフを開く',
    hoverActivationDescOff: 'ホバー無効。Alt + C で開きます',
    disabledHoverOff: 'ホバー起動が無効のためOFF',
    fullscreenProtectionTitle: '全画面保護',
    fullscreenProtectionDesc: '全画面ゲームや動画再生時はホバーを自動停止',
    clearUnpinnedTitle: '再起動時に非ピン留めを削除',
    clearUnpinnedDesc: 'アプリ再起動時に非ピン留めアイテムを消去',
    soundEffectsTitle: '効果音',
    soundEffectsDesc: 'ボタンやトグル操作時に効果音を再生',
    autoUpdatesTitle: '自動アップデート',
    autoUpdatesDescOn: 'バックグラウンドで最新版を自動確認・ダウンロード',
    autoUpdatesDescOff: '自動確認は停止中。下部から手動確認可能',
    checkForUpdates: 'アップデートを確認',
    checkingForUpdates: 'GitHubで最新版を確認中...',
    isUpToDate: '✓ Edge-Drop は最新バージョンです',
    checkAgain: '再確認',
    tryAgain: '再試行',
    updateCheckFailed: '確認に失敗しました',
    updateAvailableTitle: 'Edge-Drop v{version} が利用可能です！',
    updateAvailableDesc: '新しいバージョンが用意されています。今すぐ更新しますか？',
    downloadAndUpdate: 'ダウンロードして更新',
    skip: 'スキップ',
    downloadingUpdate: 'バックグラウンドでダウンロード中...',
    updateReadyTitle: 'アップデート v{version} 準備完了',
    updateReadyDesc: 'クリックしてEdge-Dropを再起動し適用します。',
    restartToUpdate: '再起動して更新',
    restartToUpdateBelow: '下部で再起動して更新',
    newUpdateAvailableBelow: '下部に新しいアップデートがあります',
    autoDeleteTitle: '自動削除タイマー',
    autoDeleteDesc: 'コピーされた履歴を定期的に自動削除（ピン留めは保持）',
    never: 'なし',
    capacityTitle: '履歴件数制限',
    capacityDesc: '履歴に保存する非ピン留めアイテムの最大件数'
  },
  position: {
    edgePlacementTitle: '画面の端',
    edgePlacementDesc: 'Edge-Drop panelを配置する画面の端を選択',
    leftEdge: '左端',
    rightEdge: '右端',
    displayTitle: 'ディスプレイ',
    displayDesc: '表示するモニターを選択',
    primaryDisplay: 'メインディスプレイ',
    verticalPositionTitle: '垂直位置',
    verticalPositionDesc: '画面端での上下位置を調整',
    top: '上',
    center: '中央',
    bottom: '下',
    triggerZone: 'トリガーエリア',
    edgeLocationHintTitle: '画面端のヒント表示',
    edgeLocationHintDesc: 'エリア外をタッチした際に画面端をかすかに発光',
    edgeTriggerPositionTitle: 'ホバートリガー位置',
    edgeTriggerPositionDesc: 'シェルフに対するホバー反応域の位置',
    hoverAreaSizeTitle: 'ホバー反応エリアサイズ',
    hoverAreaSizeDesc: '画面端でのホバー起動エリアの広さ',
    medium: '中',
    edgeTriggerThicknessTitle: 'トリガー帯の厚み',
    edgeTriggerThicknessDesc: '画面端に配置される透明トリガー帯の厚み',
    panelHeightTitle: 'シェルフの高さ',
    panelHeightDesc: 'クリップボードシェルフの垂直方向のサイズ'
  },
  appearance: {
    copyIndicatorTitle: 'コピーインジケーター',
    copyIndicatorDesc: 'コピー時に画面端に視覚効果を表示',
    indicatorStyleTitle: 'インジケーターのスタイル',
    indicatorStyleDesc: '視覚インジケーターの形状を選択',
    typography: '文字スタイル',
    textSizeTitle: '文字サイズ',
    textSizeDesc: '全体のフォントサイズを調整',
    audioAndFeedback: 'サウンドとフィードバック',
    small: '小',
    normal: '標準',
    medium: '中',
    large: '大',
    cardViewTitle: 'カードレイアウト',
    cardViewDesc: 'モダンカードとコンパクト表示を切り替え',
    modernCards: 'モダンカード',
    compactRows: '行表示',
    logoStyle: 'ロゴ',
    tickStyle: 'チェック',
    copyStyle: 'コピー',
    sparkleStyle: 'キラキラ'
  },
  item: {
    copy: 'コピー',
    pinned: 'ピン留め済み',
    pin: 'ピン留め',
    unpin: 'ピン留め解除',
    delete: '削除',
    clear: '消去',
    dropToSave: 'ドロップして保存',
    dropToSaveDesc: 'ファイル、画像、リンク、テキスト対応',
    justNow: 'たった今',
    ago: '前',
    expand: '拡大',
    textItem: 'テキスト',
    imageItem: '画像',
    fileItem: 'ファイル',
    linkItem: 'リンク',
    items: '件',
    recent: '最近の履歴',
    expandPinned: 'ピン留めアイテムを開く',
    collapsePinned: 'ピン留めアイテムをたたむ',
    screenshot: 'スクリーンショット',
    ungroup: 'グループ解除',
    copyFilePath: 'ファイルパスをコピー',
    moreImages: '+{count} 枚の画像',
    moreFiles: '+{count} 件のファイル',
    singleFile: '1 件のファイル',
    scrollToTop: 'トップへ戻る'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'スライド',
    archive: 'アーカイブ',
    text: 'テキスト',
    code: 'コード',
    audio: 'オーディオ',
    video: 'ビデオ',
    image: '画像',
    file: 'ファイル'
  },
  emptyState: {
    shelfEmpty: 'クリップボードは空です',
    noResultsFound: '結果が見つかりません',
    shelfEmptyHint: 'コピーするかファイルをドラッグしてください',
    noResultsHint: '別のキーワードをお試しください',
    noClipsFound: '{type}が見つかりません',
    copyTypeHint: '{type}をコピーするか「すべて」に戻してください',
    textClips: 'テキスト',
    links: 'リンク',
    images: '画像',
    files: 'ファイル'
  },
  onboarding: {
    welcomeTitle: 'Edge-Dropへようこそ',
    welcomeDesc: 'Edge-Dropは画面の左端に隠れています。カーソルを近づけて開きます。',
    collectTitle: '何でも自動保存',
    collectDesc: 'Ctrl+Cでコピーした内容をバックグラウンドで自動保存します。',
    dragTitle: '自由自在にドラッグ＆ドロップ',
    dragDesc: 'カードを任意のアプリやフォルダへ直接ドラッグできます。',
    stacksTitle: 'ファイルスタック',
    stacksDesc: '複数のファイルは1つのスタックにまとめられます。',
    ungroupTitle: 'スタックの解除',
    ungroupDesc: '左端のオレンジバーへドラッグして個別抽出できます。',
    mergeTitle: 'アイテムの結合',
    mergeDesc: 'カード同士を重ねてスタックを作成できます。',
    previewTitle: 'プレビュー機能',
    previewDesc: '画像や長文テキストを詳細プレビューできます。',
    configTitle: '環境設定',
    configDesc: 'お好みに合わせてカスタマイズしましょう。',
    skip: 'スキップ',
    back: '戻る',
    next: '次へ',
    getStarted: '始める',
    extractedCard: '抽出されたカード',
    dropToExtract: 'ドロップして抽出',
    proTips: 'ヒント',
    proTip1: 'Alt + C でシェルフを即座に開閉できます。',
    proTip2: '右上歯車アイコンから設定を開けます。',
    proTip3: 'ファイルを左端へドラッグして追加。',
    proTip4: 'テキストボックスをクリック後、項目をクリック。'
  },
  tray: {
    showClipboard: 'クリップボードを表示',
    settings: '設定',
    incognito: 'シークレットモード',
    hoverTrigger: 'ホバー起動',
    stickTo: '配置位置',
    left: '左端',
    right: '右端',
    display: 'ディスプレイ',
    quit: 'Edge-Dropを終了',
    welcomeTitle: 'Edge-Drop クリップボード',
    welcomeBody: '画面左端にホバーするかAlt+Cを押してください。'
  },
  flyout: {
    copyBeaconStyleTitle: 'インジケーターのスタイル',
    openLink: 'リンクを開く',
    copyContent: '内容をコピー',
    saveFile: 'ファイルを保存',
    extractedFromBundle: 'スタックから抽出済み',
    itemsCount: '{count}件',
    selectedCount: '{count}件 選択中',
    selectAll: 'すべて選択',
    deselectAll: '選択解除',
    copySelected: '選択アイテムをコピー',
    pasteSelected: '選択アイテムを貼り付け',
    paste: '貼り付け',
    clearSelection: '選択をクリア',
    contentTruncated: '… (内容が省略されました)',
    clickToPaste: 'クリックして貼り付け',
    copyText: 'テキストをコピー',
    copyImage: '画像をコピー',
    copyFile: 'ファイルをコピー',
    clickToPasteDrag: 'クリックで貼り付け · ドラッグで移動',
    openInExplorer: 'エクスプローラーで場所を開く',
    current: '現在の'
  },
  toast: {
    copiedToClipboard: 'クリップボードにコピーしました',
    itemDeleted: '削除しました',
    itemPinned: 'ピン留めしました',
    itemUnpinned: 'ピン留めを解除しました',
    settingsSaved: '設定を保存しました'
  },
  footer: {
    communityAndSupport: 'コミュニティとサポート',
    feedbackTitle: 'フィードバックと報告',
    feedbackDesc: 'バグ報告や新機能の提案（GitHub）',
    submitFeedback: 'フィードバックを送信 ↗',
    applicationGroup: 'アプリケーション',
    quitTitle: 'Edge-Drop を終了',
    quitDesc: 'アプリを終了しバックグラウンド処理を停止',
    starOnGithub: 'GitHubでStarを付ける',
    githubPromo: 'Edge-Dropを気に入っていただけたら、GitHubでのStarをお願いします！',
    version: 'バージョン'
  }
}

export const ru: TranslationKeys = {
  filters: { all: 'Все', text: 'Текст', links: 'Ссылки', images: 'Изображения', files: 'Файлы' },
  tabs: { behaviour: 'Поведение', position: 'Позиция', appearance: 'Внешний вид' },
  header: { searchPlaceholder: 'Поиск по истории...', settings: 'Настройки', close: 'Закрыть', whatsNew: 'Что нового' },
  behaviour: {
    languageTitle: 'Язык интерфейса',
    languageDesc: 'Выберите язык элементов управления и меню',
    systemDefault: 'Системный по умолчанию (Авто)',
    launchAtLoginTitle: 'Автозапуск при входе',
    launchAtLoginDesc: 'Запускать в фоновом режиме при включении ПК',
    incognitoTitle: 'Режим инкогнито',
    incognitoDesc: 'Временно приостановить запись буфера обмена',
    hoverActivationTitle: 'Активация наведением',
    hoverActivationDescOn: 'Открывать панель при наведении курсора к краю',
    hoverActivationDescOff: 'Наведение отключено. Используйте Alt + C',
    disabledHoverOff: 'Отключено, так как активация наведением выключена',
    fullscreenProtectionTitle: 'Защита в полноэкранном режиме',
    fullscreenProtectionDesc: 'Приостанавливать наведение во время игр или видео',
    clearUnpinnedTitle: 'Очищать незакрепленные при перезапуске',
    clearUnpinnedDesc: 'Удалять незакрепленные элементы при каждом перезапуске',
    soundEffectsTitle: 'Звуковые эффекты',
    soundEffectsDesc: 'Воспроизводить звуки при нажатии кнопок и переключателей',
    autoUpdatesTitle: 'Автоматические обновления',
    autoUpdatesDescOn: 'Автоматически проверять и скачивать обновления в фоне',
    autoUpdatesDescOff: 'Автопроверка отключена. Проверьте вручную ниже',
    checkForUpdates: 'Проверить обновления',
    checkingForUpdates: 'Проверка обновлений на GitHub...',
    isUpToDate: '✓ Установлена последняя версия Edge-Drop',
    checkAgain: 'Проверить снова',
    tryAgain: 'Повторить',
    updateCheckFailed: 'Ошибка проверки обновлений',
    updateAvailableTitle: 'Доступна версия Edge-Drop v{version}!',
    updateAvailableDesc: 'Новая версия готова. Скачать и установить сейчас?',
    downloadAndUpdate: 'Скачать и обновить',
    skip: 'Пропустить',
    downloadingUpdate: 'Загрузка обновления в фоновом режиме...',
    updateReadyTitle: 'Обновление v{version} готово',
    updateReadyDesc: 'Нажмите для перезапуска Edge-Drop и применения обновления.',
    restartToUpdate: 'Перезапустить для обновления',
    restartToUpdateBelow: 'Перезапустить ниже',
    newUpdateAvailableBelow: 'Доступно обновление ниже',
    autoDeleteTitle: 'Таймер автоудаления',
    autoDeleteDesc: 'Автоматически удалять скопированное (закрепленные сохраняются)',
    never: 'Никогда',
    capacityTitle: 'Емкость истории',
    capacityDesc: 'Максимальное количество незакрепленных элементов в истории'
  },
  position: {
    edgePlacementTitle: 'Край экрана',
    edgePlacementDesc: 'Выберите край экрана для прикрепления',
    leftEdge: 'Левый край',
    rightEdge: 'Правый край',
    displayTitle: 'Монитор',
    displayDesc: 'Выберите монитор для отображения',
    primaryDisplay: 'Основной монитор',
    verticalPositionTitle: 'Вертикальное положение',
    verticalPositionDesc: 'Настройте выравнивание по высоте',
    top: 'Сверху',
    center: 'По центру',
    bottom: 'Снизу',
    triggerZone: 'Зона активации',
    edgeLocationHintTitle: 'Подсказка края',
    edgeLocationHintDesc: 'Слегка подсвечивать край при касании вне зоны',
    edgeTriggerPositionTitle: 'Положение зоны активации',
    edgeTriggerPositionDesc: 'Расположение полосы активации относительно панели',
    hoverAreaSizeTitle: 'Размер зоны активации',
    hoverAreaSizeDesc: 'Размер чувствительной зоны у края экрана',
    medium: 'Средний',
    edgeTriggerThicknessTitle: 'Толщина зоны активации',
    edgeTriggerThicknessDesc: 'Физическая толщина невидимой полосы активации',
    panelHeightTitle: 'Высота панели',
    panelHeightDesc: 'Вертикальный размер панели буфера обмена'
  },
  appearance: {
    copyIndicatorTitle: 'Индикатор копирования',
    copyIndicatorDesc: 'Показывать визуальный сигнал у края при копировании',
    indicatorStyleTitle: 'Стиль индикатора',
    indicatorStyleDesc: 'Выберите форму индикатора',
    typography: 'Типографика',
    textSizeTitle: 'Размер шрифта',
    textSizeDesc: 'Настройте масштаб шрифта интерфейса',
    audioAndFeedback: 'Звук и отклик',
    small: 'Маленький',
    normal: 'Обычный',
    medium: 'Средний',
    large: 'Большой',
    cardViewTitle: 'Вид карточек',
    cardViewDesc: 'Переключение между карточками и компактным списком',
    modernCards: 'Современные карточки',
    compactRows: 'Компактные строки',
    logoStyle: 'Логотип',
    tickStyle: 'Галочка',
    copyStyle: 'Копия',
    sparkleStyle: 'Искра'
  },
  item: {
    copy: 'Копировать',
    pinned: 'ЗАКРЕПЛЕННЫЕ',
    pin: 'Закрепить',
    unpin: 'Открепить',
    delete: 'Удалить',
    clear: 'Очистить',
    dropToSave: 'Отпустите для сохранения',
    dropToSaveDesc: 'Любой файл, изображение, ссылка или текст',
    justNow: 'только что',
    ago: 'назад',
    expand: 'Развернуть',
    textItem: 'Текст',
    imageItem: 'Изображение',
    fileItem: 'Файл',
    linkItem: 'Ссылка',
    items: 'элементов',
    recent: 'НЕДАВНИЕ',
    expandPinned: 'Развернуть закрепленные',
    collapsePinned: 'Свернуть закрепленные',
    screenshot: 'Скриншот',
    ungroup: 'Извлечь',
    copyFilePath: 'Скопировать путь к файлу',
    moreImages: '+{count} доп. изображений',
    moreFiles: '+{count} доп. файлов',
    singleFile: '1 файл',
    scrollToTop: 'Наверх'
  },
  fileKinds: {
    pdf: 'PDF',
    word: 'Word',
    excel: 'Excel',
    powerpoint: 'Слайды',
    archive: 'Архив',
    text: 'Текст',
    code: 'Код',
    audio: 'Аудио',
    video: 'Видео',
    image: 'Изображение',
    file: 'Файл'
  },
  emptyState: {
    shelfEmpty: 'Панель пуста',
    noResultsFound: 'Ничего не найдено',
    shelfEmptyHint: 'Скопируйте что-нибудь или перетащите файлы сюда',
    noResultsHint: 'Попробуйте другой запрос или очистите поиск',
    noClipsFound: '{type} не найдены',
    copyTypeHint: 'Скопируйте {type} или вернитесь ко всем',
    textClips: 'тексты',
    links: 'ссылки',
    images: 'изображения',
    files: 'файлы'
  },
  onboarding: {
    welcomeTitle: 'Добро пожаловать в Edge-Drop',
    welcomeDesc: 'Edge-Drop скрыт у левого края экрана. Наведите курсор к краю, чтобы открыть.',
    collectTitle: 'Сохраняйте всё',
    collectDesc: 'Нажатие Ctrl+C автоматически сохраняет тексты, картинки и файлы.',
    dragTitle: 'Перетаскивайте куда угодно',
    dragDesc: 'Перетаскивайте карточки напрямую в любые приложения или папки.',
    stacksTitle: 'Стопки файлов',
    stacksDesc: 'Несколько файлов автоматически объединяются в стопку.',
    ungroupTitle: 'Извлечение файлов',
    ungroupDesc: 'Перетащите элемент на левую оранжевую полосу для извлечения.',
    mergeTitle: 'Объединение',
    mergeDesc: 'Перетаскивайте карточки друг на друга для создания стопок.',
    previewTitle: 'Окно просмотра',
    previewDesc: 'Просматривайте изображения и тексты в высоком разрешении.',
    configTitle: 'Настройки',
    configDesc: 'Настройте Edge-Drop под свои нужды.',
    skip: 'Пропустить',
    back: 'Назад',
    next: 'Далее',
    getStarted: 'Начать',
    extractedCard: 'Извлеченная карточка',
    dropToExtract: 'Отпустите для извлечения',
    proTips: 'Полезные советы',
    proTip1: 'Нажмите Alt + C для вызова панели.',
    proTip2: 'Открыть настройки можно через иконку шестеренки.',
    proTip3: 'Перетащите файлы к левому краю для добавления.',
    proTip4: 'Кликните на поле ввода, затем на элемент для вставки.'
  },
  tray: {
    showClipboard: 'Показать буфер обмена',
    settings: 'Настройки',
    incognito: 'Инкогнито (пауза)',
    hoverTrigger: 'Активация наведением',
    stickTo: 'Прикрепить к',
    left: 'Слева',
    right: 'Справа',
    display: 'Монитор',
    quit: 'Выйти из Edge-Drop',
    welcomeTitle: 'Буфер обмена Edge-Drop',
    welcomeBody: 'Наведите на левый край или нажмите Alt+C.'
  },
  flyout: {
    copyBeaconStyleTitle: 'Стиль индикатора копирования',
    openLink: 'Открыть ссылку',
    copyContent: 'Скопировать содержимое',
    saveFile: 'Сохранить файл',
    extractedFromBundle: 'Извлечено из стопки',
    itemsCount: '{count} элементов',
    selectedCount: 'Выбрано: {count}',
    selectAll: 'Выбрать все',
    deselectAll: 'Снять выделение',
    copySelected: 'Скопировать выбранное',
    pasteSelected: 'Вставить выбранное',
    paste: 'Вставить',
    clearSelection: 'Очистить выбор',
    contentTruncated: '… (содержимое сокращено)',
    clickToPaste: 'Нажмите для вставки',
    copyText: 'Скопировать текст',
    copyImage: 'Скопировать изображение',
    copyFile: 'Скопировать файл',
    clickToPasteDrag: 'Нажмите для вставки · Перетащите для перемещения',
    openInExplorer: 'Открыть в Проводнике',
    current: 'Текущая'
  },
  toast: {
    copiedToClipboard: 'Скопировано в буфер обмена',
    itemDeleted: 'Элемент удален',
    itemPinned: 'Элемент закреплен',
    itemUnpinned: 'Элемент откреплен',
    settingsSaved: 'Настройки сохранены'
  },
  footer: {
    communityAndSupport: 'Сообщество и поддержка',
    feedbackTitle: 'Отзывы и вопросы',
    feedbackDesc: 'Сообщить об ошибке или предложить функцию на GitHub',
    submitFeedback: 'Отправить отзыв ↗',
    applicationGroup: 'Приложение',
    quitTitle: 'Выйти из Edge-Drop',
    quitDesc: 'Закрыть приложение и остановить фоновый процесс',
    starOnGithub: 'Поставить звезду на GitHub',
    githubPromo: 'Если вам нравится Edge-Drop, поддержите проект звездой на GitHub!',
    version: 'Версия'
  }
}

export const TRANSLATIONS: Record<string, TranslationKeys> = {
  en,
  es,
  fr,
  de,
  hi,
  'zh-CN': zhCN,
  ja,
  ru
}
