# HideComposerButtons

Choose which message-composer buttons are visible in Discord.

Maintained by [@yrdn576-lgtm](https://github.com/yrdn576-lgtm).

## Features

The plugin provides context-menu controls for the Gift, GIF, Emoji, Sticker, and Apps composer buttons.

## Installation (Vencord source build)

This repository contains **Vencord userplugin source code**. It is not a standalone extension and is not loaded by the standard Vencord Installer.

1. Set up a Vencord source checkout using the official Vencord development instructions.
2. Copy the `hideComposerButtons` folder into `src/userplugins/`.
3. From the Vencord repository root, run `pnpm test:ts` and `pnpm build --dev`.
4. Follow Vencord's official development instructions to install/activate the locally built version. Building alone does not install it into Discord.
5. Enable **HideComposerButtons** in Vencord's plugin settings.

Back up your existing setup before replacing an installed Vencord build. Do not run commands you do not understand.

## Tests

`tests/live.js` is a manual live-renderer test. It requires the plugin to be running and its context-menu submenu to be open. Review the test before running it.

## Compatibility

Discord UI selector changes may require maintenance. This source has not been independently compiled or tested by this repository publication.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
