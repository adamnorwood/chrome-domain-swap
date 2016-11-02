# chrome-domain-swap
A Chrome extension that lets you swap between your real domain and a testing domain, handy for things like switching to a BrowserSync proxy

Early stages: nothing much to see, but you could add this as an extension for testing using [Developer Mode](https://developer.chrome.com/extensions/getstarted#unpacked).

Currently the plugin works by swapping your current browser tab's hostname for `localhost:3000`, retaining (most) other path info. When you're ready to switch back, click the extension button again to revert to your "real" hostname. This will be made more flexible in future versions.
