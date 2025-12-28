<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - HRNova</title>
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
                        <h1 class="page-header__title">Dashboard</h1>
                        <p class="page-header__description">Welcome back! Here's an overview of your HR operations.</p>
                    </div>
                    <div class="page-header__actions">
                        <button class="btn btn--secondary">
                            <svg class="btn__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Report
                        </button>
                        <button class="btn btn--primary">
                            <svg class="btn__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Employee
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__label">Total Employees</span>
                        <div class="stat-card__icon stat-card__icon--primary">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card__value">1,248</div>
                    <div class="stat-card__footer">
              <span class="stat-card__change stat-card__change--positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12%
              </span>
                        <span class="text-secondary text-sm">vs last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__label">Active Jobs</span>
                        <div class="stat-card__icon stat-card__icon--success">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card__value">48</div>
                    <div class="stat-card__footer">
              <span class="stat-card__change stat-card__change--positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                8%
              </span>
                        <span class="text-secondary text-sm">vs last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__label">Pending Leaves</span>
                        <div class="stat-card__icon stat-card__icon--warning">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card__value">24</div>
                    <div class="stat-card__footer">
              <span class="stat-card__change stat-card__change--negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                3%
              </span>
                        <span class="text-secondary text-sm">vs last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__label">New Applicants</span>
                        <div class="stat-card__icon stat-card__icon--primary">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <div class="stat-card__value">192</div>
                    <div class="stat-card__footer">
              <span class="stat-card__change stat-card__change--positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                24%
              </span>
                        <span class="text-secondary text-sm">vs last month</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-8">
                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title">Recent Activity</h2>
                        <p class="card__subtitle">Latest updates from your team</p>
                    </div>
                    <div class="card__body">
                        <div class="flex flex-col gap-4">
                            <div class="flex items-start gap-4">
                                <div class="topbar__avatar" style="flex-shrink: 0;">JD</div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-sm text-semibold">John Doe</span>
                                        <span class="text-xs text-tertiary">2 hours ago</span>
                                    </div>
                                    <p class="text-sm text-secondary">Submitted leave request for Dec 28-30</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4">
                                <div class="topbar__avatar" style="flex-shrink: 0;">JS</div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-sm text-semibold">Jane Smith</span>
                                        <span class="text-xs text-tertiary">4 hours ago</span>
                                    </div>
                                    <p class="text-sm text-secondary">Completed onboarding process</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4">
                                <div class="topbar__avatar" style="flex-shrink: 0;">MJ</div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-sm text-semibold">Mike Johnson</span>
                                        <span class="text-xs text-tertiary">Yesterday</span>
                                    </div>
                                    <p class="text-sm text-secondary">Updated personal information</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title">Upcoming Events</h2>
                        <p class="card__subtitle">Important dates and deadlines</p>
                    </div>
                    <div class="card__body">
                        <div class="flex flex-col gap-4">
                            <div class="flex gap-4">
                                <div style="width: 60px; height: 60px; background: var(--color-primary-100); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <span class="text-xs text-tertiary" style="color: var(--color-primary-600);">DEC</span>
                                    <span class="text-xl text-bold" style="color: var(--color-primary-700);">28</span>
                                </div>
                                <div>
                                    <h4 class="text-sm text-semibold mb-1">Team Meeting</h4>
                                    <p class="text-sm text-secondary">Quarterly review and planning</p>
                                    <span class="badge badge--primary mt-2">10:00 AM</span>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div style="width: 60px; height: 60px; background: var(--color-success-100); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <span class="text-xs text-tertiary" style="color: var(--color-success-600);">DEC</span>
                                    <span class="text-xl text-bold" style="color: var(--color-success-700);">31</span>
                                </div>
                                <div>
                                    <h4 class="text-sm text-semibold mb-1">Payroll Processing</h4>
                                    <p class="text-sm text-secondary">Monthly payroll deadline</p>
                                    <span class="badge badge--success mt-2">All Day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card__header">
                    <h2 class="card__title">Recent Hires</h2>
                    <p class="card__subtitle">New employees joined this month</p>
                </div>
                <div class="card__body" style="padding: 0;">
                    <div class="table-wrapper" style="border: none; border-radius: 0;">
                        <table class="table">
                            <thead class="table__head">
                            <tr class="table__row">
                                <th class="table__header">Name</th>
                                <th class="table__header">Position</th>
                                <th class="table__header">Department</th>
                                <th class="table__header">Join Date</th>
                                <th class="table__header">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="table__row table__row--clickable">
                                <td class="table__cell">
                                    <div class="flex items-center gap-3">
                                        <div class="topbar__avatar" style="width: 32px; height: 32px; font-size: 12px;">AB</div>
                                        <span>Alice Brown</span>
                                    </div>
                                </td>
                                <td class="table__cell">Senior Developer</td>
                                <td class="table__cell">Engineering</td>
                                <td class="table__cell">Dec 15, 2025</td>
                                <td class="table__cell"><span class="badge badge--success badge--dot">Active</span></td>
                            </tr>
                            <tr class="table__row table__row--clickable">
                                <td class="table__cell">
                                    <div class="flex items-center gap-3">
                                        <div class="topbar__avatar" style="width: 32px; height: 32px; font-size: 12px;">CD</div>
                                        <span>Charlie Davis</span>
                                    </div>
                                </td>
                                <td class="table__cell">Product Manager</td>
                                <td class="table__cell">Product</td>
                                <td class="table__cell">Dec 18, 2025</td>
                                <td class="table__cell"><span class="badge badge--warning badge--dot">Onboarding</span></td>
                            </tr>
                            <tr class="table__row table__row--clickable">
                                <td class="table__cell">
                                    <div class="flex items-center gap-3">
                                        <div class="topbar__avatar" style="width: 32px; height: 32px; font-size: 12px;">EF</div>
                                        <span>Emma Foster</span>
                                    </div>
                                </td>
                                <td class="table__cell">UX Designer</td>
                                <td class="table__cell">Design</td>
                                <td class="table__cell">Dec 20, 2025</td>
                                <td class="table__cell"><span class="badge badge--success badge--dot">Active</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
</body>
</html>
