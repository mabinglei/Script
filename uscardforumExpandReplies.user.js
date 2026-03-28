// ==UserScript==
// @name         US Card Forum Expand Replies
// @namespace    https://www.uscardforum.com/
// @version      1.0.0
// @description  Automatically expands hidden replies on US Card Forum topic pages.
// @author       OpenAI Codex
// @match        *://www.uscardforum.com/*
// @match        *://uscardforum.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const expandButtonSelectors = [
        "button.show-replies",
        "button[aria-controls*='replies']",
        "button[aria-label*='回复']",
        "button[aria-label*='repl']",
        "button.btn.post-action-menu__show-replies"
    ];

    const handledButtons = new WeakSet();
    const selectorList = expandButtonSelectors.join(", ");
    let observer = null;
    let sweepTimer = null;
    let sweepCount = 0;
    const maxSweepCount = 12;

    function getReplyContainer(button) {
        const controlsId = button.getAttribute("aria-controls");
        if (controlsId) {
            return document.getElementById(controlsId);
        }

        return button.closest(".topic-post, article")?.querySelector(".embedded-posts, .replies");
    }

    function isExpanded(button, replyContainer) {
        if (button.getAttribute("aria-expanded") === "true") {
            return true;
        }

        if (!(replyContainer instanceof HTMLElement)) {
            return false;
        }

        if (replyContainer.hidden) {
            return false;
        }

        const style = window.getComputedStyle(replyContainer);
        if (style.display === "none" || style.visibility === "hidden") {
            return false;
        }

        return replyContainer.childElementCount > 0 || replyContainer.textContent.trim().length > 0;
    }

    function shouldExpand(button) {
        if (!(button instanceof HTMLButtonElement)) {
            return false;
        }

        if (button.disabled || handledButtons.has(button)) {
            return false;
        }

        if (!button.classList.contains("show-replies") && !button.classList.contains("post-action-menu__show-replies")) {
            return false;
        }

        if (button.getAttribute("aria-expanded") !== "false") {
            handledButtons.add(button);
            return false;
        }

        const label = [
            button.getAttribute("aria-label") ?? "",
            button.textContent ?? ""
        ].join(" ").toLowerCase();

        if (!label.includes("回复") && !label.includes("repl")) {
            return false;
        }

        const replyContainer = getReplyContainer(button);
        if (replyContainer && isExpanded(button, replyContainer)) {
            handledButtons.add(button);
            return false;
        }

        return true;
    }

    function clickButton(button) {
        try {
            button.click();
        } catch {
            button.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }
    }

    function expandReplies(root = document) {
        const buttons = root.querySelectorAll(selectorList);
        let clickedCount = 0;

        buttons.forEach((button) => {
            if (!shouldExpand(button)) {
                return;
            }

            handledButtons.add(button);
            clickButton(button);
            clickedCount += 1;
        });

        return clickedCount;
    }

    function stopSweep() {
        if (sweepTimer !== null) {
            window.clearInterval(sweepTimer);
            sweepTimer = null;
        }
    }

    function startSweep() {
        stopSweep();
        sweepCount = 0;

        sweepTimer = window.setInterval(() => {
            sweepCount += 1;
            const clickedCount = expandReplies();

            if (clickedCount === 0 || sweepCount >= maxSweepCount) {
                stopSweep();
            }
        }, 500);
    }

    function startObservers() {
        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) {
                        continue;
                    }

                    if (node.matches?.(selectorList)) {
                        expandReplies(node.parentElement ?? document);
                        startSweep();
                        return;
                    }

                    if (node.querySelector?.(selectorList)) {
                        expandReplies(node);
                        startSweep();
                        return;
                    }
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function bootstrap() {
        expandReplies();
        startSweep();
        startObservers();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
    } else {
        bootstrap();
    }
})();
