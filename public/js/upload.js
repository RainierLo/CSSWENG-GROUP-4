FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 1,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeigth: 150
})

FilePond.parse(document.body);