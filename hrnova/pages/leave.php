<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Management - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="leave.title">Leave Management</h1>
                        <p class="page-header__description" data-i18n="leave.description">Manage employee leave requests and balances.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8" id="leaveBalanceCards">
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="leave.balance.annual">Annual Leave</div>
                    <div class="stat-card__value" id="balanceAnnual">0</div>
                    <div class="text-xs text-secondary mt-2" data-i18n="leave.balance.daysAvailable">days available</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="leave.balance.sick">Sick Leave</div>
                    <div class="stat-card__value" id="balanceSick">0</div>
                    <div class="text-xs text-secondary mt-2" data-i18n="leave.balance.daysAvailable">days available</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="leave.balance.pending">Pending Requests</div>
                    <div class="stat-card__value" style="color: var(--color-warning-600);" id="statPending">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="leave.balance.approved">Approved This Month</div>
                    <div class="stat-card__value" style="color: var(--color-success-600);" id="statApproved">0</div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="col-span-2">
                    <div id="leaveTableContainer"></div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="leave.calendar.title">Team Calendar</h2>
                    </div>
                    <div class="card__body">
                        <div id="leaveCalendar"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/leave.js"></script>
</body>
</html>
