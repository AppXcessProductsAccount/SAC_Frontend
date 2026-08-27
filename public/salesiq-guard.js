/*
 * Keeps the Zoho SalesIQ chat window shut until someone clicks its bubble.
 *
 * The widget is configured in the SalesIQ console to open its window on page
 * load, so every page arrived with a real 361x640 panel already on screen. It
 * swallowed clicks meant for the page underneath — which is why the chat seemed
 * to wake up from clicks nowhere near it — and it covered the text on the long
 * Privacy and Terms pages.
 *
 * Why this is a plain file in /public rather than a React component or an inline
 * script: in the App Router an inline `<script dangerouslySetInnerHTML>` in the
 * head is never executed, and neither a `next/script` tag nor a client component
 * reliably reached every route here. A external `src` script does run — it is
 * how the widget itself loads — so the guard rides the same mechanism.
 *
 * Hiding the window from SalesIQ's own `ready` callback is not enough: the panel
 * is opened by a proactive trigger that fires afterwards and simply re-opens it.
 * Watching for DOM changes is not enough either — the window opens exactly once,
 * and at that instant `$zoho.salesiq.floatwindow` may not exist yet, so the one
 * chance to act is missed and no further mutation ever comes. Hence a poll.
 *
 * The first pointerdown on the bubble stands the guard down permanently, so it
 * can never close a conversation someone is actually having, and it gives up
 * after a minute regardless.
 *
 * The proper home for this is the "open chat window automatically" setting in
 * the SalesIQ console. Turn that off and this file can be deleted.
 */
(function () {
    "use strict";

    var LAUNCHER = "#zsiq_float";
    var WINDOW_WRAP = "zsiq_chat_wrap";
    var OPEN_CLASS = "chat-iframe-open";
    var POLL_MS = 300;
    var GIVE_UP_AFTER_MS = 60000;

    var visitorOpenedIt = false;

    /* Capture phase: the widget handles the event itself, so a listener that
       waits for it to bubble can miss the click — and a guard that misses it
       would keep closing the window the visitor is trying to open. */
    document.addEventListener(
        "pointerdown",
        function (event) {
            var target = event.target;
            if (target && target.closest && target.closest(LAUNCHER)) {
                visitorOpenedIt = true;
            }
        },
        true
    );

    var poll = setInterval(function () {
        if (visitorOpenedIt) return;

        var wrap = document.getElementById(WINDOW_WRAP);
        if (!wrap || wrap.className.indexOf(OPEN_CLASS) < 0) return;

        try {
            window.$zoho.salesiq.floatwindow.visible("hide");
        } catch (e) {
            /* The widget has not finished wiring itself up yet; the next tick
               will try again. */
        }
    }, POLL_MS);

    setTimeout(function () {
        clearInterval(poll);
    }, GIVE_UP_AFTER_MS);
})();
