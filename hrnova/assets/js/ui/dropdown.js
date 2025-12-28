let activeDropdown = null;

export function initDropdowns() {
    document.addEventListener('click', handleDropdownClick);
    document.addEventListener('keydown', handleDropdownKeydown);
}

function handleDropdownClick(e) {
    const toggle = e.target.closest('[data-dropdown-toggle]');

    if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        const dropdownId = toggle.getAttribute('data-dropdown-toggle');
        const dropdown = document.querySelector(`[data-dropdown="${dropdownId}"]`);

        if (dropdown) {
            toggleDropdown(dropdown, toggle);
        }
        return;
    }

    if (!e.target.closest('[data-dropdown-menu]')) {
        closeAllDropdowns();
    }
}

function handleDropdownKeydown(e) {
    if (e.key === 'Escape' && activeDropdown) {
        closeDropdown(activeDropdown);
    }
}

function toggleDropdown(dropdown, toggle) {
    const menu = dropdown.querySelector('[data-dropdown-menu]');
    const isOpen = menu.classList.contains('dropdown__menu--active');

    if (isOpen) {
        closeDropdown(dropdown);
    } else {
        closeAllDropdowns();
        openDropdown(dropdown, toggle);
    }
}

function openDropdown(dropdown, toggle) {
    const menu = dropdown.querySelector('[data-dropdown-menu]');

    menu.classList.add('dropdown__menu--active');
    toggle.setAttribute('aria-expanded', 'true');

    activeDropdown = dropdown;

    requestAnimationFrame(() => {
        positionDropdown(dropdown, menu);
    });
}

function closeDropdown(dropdown) {
    const menu = dropdown.querySelector('[data-dropdown-menu]');
    const toggle = dropdown.querySelector('[data-dropdown-toggle]');

    if (menu) {
        menu.classList.remove('dropdown__menu--active');
    }

    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
    }

    if (activeDropdown === dropdown) {
        activeDropdown = null;
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(dropdown => closeDropdown(dropdown));
}

function positionDropdown(dropdown, menu) {
    const rect = dropdown.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    menu.style.top = '';
    menu.style.bottom = '';
    menu.style.left = '';
    menu.style.right = '';

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < menuRect.height && spaceAbove > spaceBelow) {
        menu.style.bottom = '100%';
        menu.style.marginBottom = '8px';
    } else {
        menu.style.top = '100%';
        menu.style.marginTop = '8px';
    }

    if (menu.classList.contains('dropdown__menu--right')) {
        const spaceRight = viewportWidth - rect.right;
        if (spaceRight < menuRect.width) {
            menu.style.left = '0';
            menu.style.right = 'auto';
        } else {
            menu.style.right = '0';
            menu.style.left = 'auto';
        }
    }
}

export function closeDropdownById(dropdownId) {
    const dropdown = document.querySelector(`[data-dropdown="${dropdownId}"]`);
    if (dropdown) {
        closeDropdown(dropdown);
    }
}
