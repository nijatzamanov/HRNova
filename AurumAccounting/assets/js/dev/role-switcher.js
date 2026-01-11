import { AurumStorage } from '../core/storage.js';

// Create role switcher UI (only in dev mode)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const createRoleSwitcher = () => {
        const container = document.createElement('div');
        container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      border: 2px solid #6C91C2;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-size: 12px;
    `;

        container.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">🔧 Role Switcher</div>
      <select id="devRoleSwitcher" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
        <option value="Admin">Admin</option>
        <option value="Accountant">Accountant</option>
        <option value="Manager">Manager</option>
      </select>
    `;

        document.body.appendChild(container);

        const select = document.getElementById('devRoleSwitcher');
        const currentUser = AurumStorage.get('current_user');
        if (currentUser) {
            select.value = currentUser.role;
        }

        select.addEventListener('change', (e) => {
            const user = AurumStorage.get('current_user') || {
                id: 1,
                name: 'Test User',
                email: 'test@aurum.az'
            };

            user.role = e.target.value;
            AurumStorage.set('current_user', user);

            alert(`Role changed to: ${e.target.value}\nPage will reload.`);
            window.location.reload();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createRoleSwitcher);
    } else {
        createRoleSwitcher();
    }
}