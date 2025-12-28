<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="attendance.title">Attendance</h1>
                        <p class="page-header__description" data-i18n="attendance.description">Track and manage employee attendance records.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="attendance.stats.present">Present Today</div>
                    <div class="stat-card__value" style="color: var(--color-success-600);" id="statPresent">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="attendance.stats.late">Late Arrivals</div>
                    <div class="stat-card__value" style="color: var(--color-warning-600);" id="statLate">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="attendance.stats.absent">Absent</div>
                    <div class="stat-card__value" style="color: var(--color-error-600);" id="statAbsent">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="attendance.stats.avgWorkHours">Avg Work Hours</div>
                    <div class="stat-card__value" id="statAvgHours">0h</div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="col-span-2">
                    <div id="attendanceTableContainer"></div>
                </div>

                <div>
                    <div class="card mb-6">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="attendance.anomalies.title">Anomalies</h2>
                        </div>
                        <div class="card__body">
                            <div id="anomaliesPanel"></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="attendance.schedule.title">Shift Schedule</h2>
                        </div>
                        <div class="card__body">
                            <div id="shiftSchedule"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/attendance.js"></script>
</body>
</html>
