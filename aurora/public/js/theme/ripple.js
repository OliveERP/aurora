/**
 * Aurora — material-style ripple on click.
 *
 * Delegated from document so it covers buttons rendered at any point, including
 * inside dialogs and dynamically built toolbars.
 */
import { motion_off } from "./utils";

const SELECTOR = [
	".btn",
	".aurora-dock-btn",
	".sidebar-item-container .item-anchor",
	".dropdown-item",
	".widget.shortcut-widget-box",
	".point-of-sale-app .item-wrapper",
	".point-of-sale-app .numpad-btn",
].join(",");

function spawn(event) {
	if (motion_off()) return;

	const target = event.target.closest(SELECTOR);
	if (!target || target.disabled || target.classList.contains("disabled")) return;

	// the host needs a stacking/clipping context
	const style = window.getComputedStyle(target);
	if (style.position === "static") target.style.position = "relative";

	/* A dropdown menu can be a genuine DOM descendant of its own toggle — frappe's
	   sort-selector button nests its `<ul class="dropdown-menu">` right inside the
	   `<button>` (sort_selector.html) rather than as a sibling like a normal
	   Bootstrap dropdown. Clipping such a toggle for the ripple would clip its menu
	   along with it, silently making every option unclickable after the first
	   press. So targets that carry a menu of their own keep whatever overflow they
	   already have; the ripple just renders past the corner there. */
	if (style.overflow === "visible" && !target.querySelector(".dropdown-menu")) {
		target.style.overflow = "hidden";
	}

	const rect = target.getBoundingClientRect();
	const size = Math.max(rect.width, rect.height);
	const ripple = document.createElement("span");
	ripple.className = "aurora-ripple";
	ripple.style.width = ripple.style.height = `${size}px`;
	ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
	ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

	target.appendChild(ripple);
	ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
	// belt and braces in case the animation never fires
	setTimeout(() => ripple.remove(), 900);
}

export function init() {
	document.addEventListener("pointerdown", spawn, { passive: true });
}
