# Bookmark2
🤦🏾‍♂️... bookmarking on steriod!

FavIcon API discussion... https://groups.google.com/a/chromium.org/g/chromium-extensions/c/qS1rVpQVl8o/m/qmg1M13wBAAJ

### Current State
- Support for firefox and chrome:
  ```shell
  > web-ext run --source-dir ./dist --target (firefox-desktop/chromium) --verbose
  ```

  In ff -> about:debugging#/runtime/this-firefox

- Supporting both mv2 and mv3 (default)
  `MANIFEST_VERSION=2 npm run start`


### Known Issue
- different # are returned for `window.screen` on chrome vs firefox... we will default to chrome here and look for a ff workaround.


SPLIT PANELS- https://htmldom.dev/create-resizable-split-views/
CUSTOM EVENTS - https://htmldom.dev/trigger-an-event/
GET HTML TEXT ONLY - https://htmldom.dev/strip-html-from-a-given-text/
