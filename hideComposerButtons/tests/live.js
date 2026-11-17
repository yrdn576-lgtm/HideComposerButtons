// Run in the Discord renderer with Hide Buttons open.
// The test exercises the live menu and restores the starting settings on exit.
async function testHideComposerButtons() {
    const ids = ["gift", "gif", "emoji", "sticker", "apps"];
    const store = Vencord.Settings.plugins.HideComposerButtons;
    const plugin = Vencord.Plugins.plugins.HideComposerButtons;
    const original = Object.fromEntries(ids.map(id => [id, store[id]]));
    const style = () => document.getElementById("vc-hide-composer-buttons-style");
    const hidden = id => document.body.classList.contains("vc-hcb-hide-" + id);
    const item = id => document.querySelector('[role="menuitemcheckbox"][id$="vc-hcb-' + id + '"]');
    const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const results = [];
    function check(condition, message) {
        if (!condition) throw new Error(message);
    }

    check(plugin.started && style() && ids.every(item), "Open the running plugin's submenu first");
    try {
        const targets = {};
        for (const id of ids) {
            const rule = [...style().sheet.cssRules].find(rule => rule.selectorText.includes("vc-hcb-hide-" + id + " "));
            const selector = rule.selectorText.replaceAll("body.vc-hcb-hide-" + id + " ", "");
            targets[id] = [...document.querySelectorAll(selector)];
            check(targets[id].length, id + " has no matching element");
        }
        function verify() {
            for (const id of ids) {
                check(hidden(id) === !store[id], id + " class");
                check(item(id)?.getAttribute("aria-checked") === String(store[id]), id + " checkbox");
                check(targets[id].every(el => el.isConnected && Boolean(el.getClientRects().length) === store[id]), id + " layout");
            }
        }
        verify();
        for (const id of ids) {
            for (const value of [!original[id], original[id]]) {
                item(id).click();
                check(store[id] === value && hidden(id) === !value, id + " synchronous change");
                await frame();
                verify();
            }
            results.push(id + " hide/restore");
        }
        for (const id of ids) store[id] = false;
        check(Vencord.Plugins.stopPlugin(plugin), "stop");
        check(!style() && ids.every(id => !hidden(id)), "cleanup");
        check(Object.values(targets).flat().every(el => el.getClientRects().length), "restore layout");
        check(Vencord.Plugins.startPlugin(plugin), "start");
        check(style() && ids.every(hidden), "reapply settings");
        results.push("stop/start");
    } finally {
        if (!plugin.started) Vencord.Plugins.startPlugin(plugin);
        Object.assign(store, original);
    }
    return results;
}
