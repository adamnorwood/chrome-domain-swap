chrome.browserAction.onClicked.addListener( function( tab ) {

    chrome.tabs.query( { currentWindow: true, active: true }, function( tab ) {

        var testingHost     = 'localhost:3000';
        var currentTab      = tab[0];
        var currentURL      = new URL( currentTab.url );
        var currentHost     = currentURL.host;
        var currentProtocol = currentURL.protocol;
        var currentPath     = currentURL.pathname + currentURL.hash;

        if ( currentHost !== testingHost ) {
            chrome.storage.local.set( { 'cds-domain-swap' : currentHost } );
            chrome.tabs.update( tab.id, { url: currentProtocol + testingHost + currentPath } );
        } else {
            chrome.storage.local.get( 'cds-domain-swap', function( host ) {
                chrome.tabs.update( tab.id, { url: currentProtocol + host['cds-domain-swap'] + currentPath } );
            } );
        }
    } );

});