(function() {
    'use strict';

    /**
     * Chrome Extension: Domain Swap
     * As a convenience for web development work, allows you to swap your active
     * tab easily between a "production" domain name and a "test" domain name.
     * Originally built to switch back and forth to a BrowserSync proxy quickly,
     * but potentially useful for other scenarios as well.
     */
    class DomainSwap {

        /**
         * Establish our extension's properties, and register our menu bar
         * button's click handler
         *
         * @param string testHost The hostname that represents our working TEST domain
         * @see https://developer.chrome.com/extensions/browserAction
         */
        constructor( testHost = 'localhost:3000' ) {

            this.testHost = testHost;
            this.tab      = null;
            this.url      = '';

            chrome.browserAction.onClicked.addListener( () => {
                this.buttonClicked();
            } );

        }

        /**
         * Our main logic! Whenever the menu bar button is clicked, this method
         * fires with the following actions:
         * 1) grab the currently active browser tab
         * 2) if going from PROD to TEST, set a localStorage key for the original hostname
         * 3) if going from TEST to PROD, fetch that localStorage key
         * 4) swap the active tab's URL accordingly between PROD or TEST
         *
         * @param  object tab The currently active Chrome browser tab
         * @see https://developer.chrome.com/extensions/storage
         */
        buttonClicked( tab ) {
            chrome.tabs.query( { currentWindow: true, active: true }, ( tab ) => {

                // As a convenience, hoist our tab and URL helper into
                // object properties
                this.tab = tab;
                this.url = new URL( tab[0].url );

                // Are we going from PROD to TEST or vice-versa?
                if ( this.url.host !== this.testHost ) {

                    // Capture our current hostname and then switch over to our TEST host name!
                    chrome.storage.local.set( { 'productionHost' : this.url.host }, () => {
                        this.updateURL( this.testHost );
                    } );

                } else {

                    // We were already on TEST, so fetch our original hostname back and switch to it
                    chrome.storage.local.get( 'productionHost', ( items ) => {
                        if ( 'undefined' === typeof items.productionHost ) {
                            alert( 'I‘m not sure where to go!\nRun this on your production domain first?' );
                            return;
                        } else {
                            this.updateURL( items.productionHost );
                        }
                    } );

                }
            } );
        }

        /**
         * Updates our active browser tab to point to a new hostname,
         * preserving the other aspects of the URL.
         *
         * @param string newHost The new domain hostname that the tab will redirect to
         * @see https://developer.chrome.com/extensions/tabs#method-update
         */
        updateURL( newHost ) {
            chrome.tabs.update( this.tab.id, { url: this.url.protocol + newHost + this.url.pathname + this.url.hash } );
        }
    }

    // Fire away!
    const swap = new DomainSwap();
})();