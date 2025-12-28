<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users - HRNova</title>
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<div class="page-shell">
    <div id="sidebar-mount"></div>
    <div id="topbar-mount"></div>

    <main class="main-content">
        <div class="content-container">
            <div class="page-header">
                <div class="page-header__top">
                    <div>
                        <h1 class="page-header__title" data-i18n="users.title">Users & Permissions</h1>
                        <p class="page-header__description" data-i18n="users.description">Manage system users, roles, and permissions.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="users.stats.total">Total Users</div>
                    <div class="stat-card__value" id="statTotal">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="users.stats.active">Active</div>
                    <div class="stat-card__value" style="color: var(--color-success-600);" id="statActive">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="users.stats.admins">Administrators</div>
                    <div class="stat-card__value" style="color: var(--color-primary-600);" id="statAdmins">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="users.stats.inactive">Inactive</div>
                    <div class="stat-card__value" style="color: var(--color-error-600);" id="statInactive">0</div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-2">
                    <div id="usersTableContainer"></div>
                </div>

                <div>
                    <div class="card mb-6">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="users.roles.title">Roles & Permissions</h2>
                        </div>
                        <div class="card__body">
                            <div id="rolesPanel"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/users.js"></script>
</body>
</html>
