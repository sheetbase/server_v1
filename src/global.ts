(process => {
    // proxy of Sheetbase.app
    const Sheetbase = process['Sheetbase'];
    process['sheetbase'] = Sheetbase.app;
})(this);