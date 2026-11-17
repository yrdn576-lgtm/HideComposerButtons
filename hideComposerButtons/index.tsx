/*
 * Vencord userplugin: HideComposerButtons
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { Menu } from "@webpack/common";

const BUTTONS = [
    {
        id: "gift",
        label: "Gift Button",
        selectors: ["[aria-label='Send a gift']"]
    },
    {
        id: "gif",
        label: "GIF Button",
        selectors: ["[aria-label='Open GIF picker']"]
    },
    {
        id: "emoji",
        label: "Emoji Button",
        selectors: [
            "[aria-label='Add Emoji']",
            "[aria-expanded]:has(> [style*='--custom-emoji-sprite-size'])"
        ]
    },
    {
        id: "sticker",
        label: "Sticker Button",
        selectors: ["[aria-label='Open sticker picker']"]
    },
    {
        id: "apps",
        label: "Apps Button",
        selectors: [
            ".app-launcher-entrypoint",
            "[class*='appLauncher']"
        ]
    }
] as const;

const settingKeys = BUTTONS.map(({ id }) => id);

const STYLE_ID = "vc-hide-composer-buttons-style";

const bodyClass = (id: string) => `vc-hcb-hide-${id}`;

const settings = definePluginSettings({
    gift: {
        type: OptionType.BOOLEAN,
        description: "Show the Gift button",
        default: true,
        onChange: visible =>
            document.body.classList.toggle(bodyClass("gift"), !visible)
    },
    gif: {
        type: OptionType.BOOLEAN,
        description: "Show the GIF button",
        default: true,
        onChange: visible =>
            document.body.classList.toggle(bodyClass("gif"), !visible)
    },
    emoji: {
        type: OptionType.BOOLEAN,
        description: "Show the Emoji button",
        default: true,
        onChange: visible =>
            document.body.classList.toggle(bodyClass("emoji"), !visible)
    },
    sticker: {
        type: OptionType.BOOLEAN,
        description: "Show the Sticker button",
        default: true,
        onChange: visible =>
            document.body.classList.toggle(bodyClass("sticker"), !visible)
    },
    apps: {
        type: OptionType.BOOLEAN,
        description: "Show the Apps button",
        default: true,
        onChange: visible =>
            document.body.classList.toggle(bodyClass("apps"), !visible)
    }
});


function buildCss() {
    return BUTTONS.flatMap(({ id, selectors }) => {
        const scope = `body.${bodyClass(id)} [class*='channelTextArea']`;

        return selectors.map(selector => {
            const target = `${scope} ${selector}`;

            if (id === "apps") {
                return `${target} {
    display: none !important;
}`;
            }

            if (id === "gift") {
                return `${scope} [class*='container_']:has(> ${selector}),
${target} {
    display: none !important;
}`;
            }

            return `${scope} .expression-picker-chat-input-button:has(${selector}),
${target} {
    display: none !important;
}`;
        });
        }).join("\n\n");
}

function applyVisibility() {
    for (const { id } of BUTTONS) {
        document.body.classList.toggle(
            bodyClass(id),
            !settings.store[id]
        );
    }
}

const contextMenuPatch: NavContextMenuPatchCallback = children => {
    const visible = settings.use(settingKeys);

    children.push(
        <Menu.MenuItem
            id="vc-hcb-buttons"
            label="Hide Buttons"
        >
            {BUTTONS.map(({ id, label }) => (
                <Menu.MenuCheckboxItem
                    key={id}
                    id={`vc-hcb-${id}`}
                    label={label}
                    checked={visible[id]}
                    dontCloseOnAction
                    action={() => {
                        settings.store[id] = !settings.store[id];
                    }}
                />
            ))}
        </Menu.MenuItem>
    );
};

export default definePlugin({
    name: "HideComposerButtons",
    description: "Hide composer buttons with compact layout and original order.",
    authors: [{ name: "you", id: 0n }],
    tags: ["Chat", "Appearance"],
    settings,

    contextMenus: {
        "textarea-context": contextMenuPatch
    },

    start() {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style");

            style.id = STYLE_ID;
            style.textContent = buildCss();

            document.head.appendChild(style);
        }

        applyVisibility();
    },

    stop() {
        document.getElementById(STYLE_ID)?.remove();

        for (const { id } of BUTTONS) {
            document.body.classList.remove(bodyClass(id));
        }
    }
});
