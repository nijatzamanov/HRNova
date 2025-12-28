<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Settings - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="company.title">Company Settings</h1>
                        <p class="page-header__description" data-i18n="company.description">Manage departments, branches, schedules, and holidays.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-8">
                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="company.departments.title">Departments</h2>
                        <button class="btn btn-primary btn--sm" onclick="window.showAddDepartmentModal()">+ Add</button>
                    </div>
                    <div class="card__body">
                        <div id="departmentsContainer"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="company.branches.title">Branches</h2>
                        <button class="btn btn-primary btn--sm" onclick="window.showAddBranchModal()">+ Add</button>
                    </div>
                    <div class="card__body">
                        <div id="branchesContainer"></div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="company.schedules.title">Work Schedules</h2>
                        <button class="btn btn-primary btn--sm" onclick="window.showAddScheduleModal()">+ Add</button>
                    </div>
                    <div class="card__body">
                        <div id="schedulesContainer"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="company.holidays.title">Company Holidays</h2>
                        <button class="btn btn-primary btn--sm" onclick="window.showAddHolidayModal()">+ Add</button>
                    </div>
                    <div class="card__body">
                        <div id="holidaysContainer"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/company.js"></script>
</body>
</html>
