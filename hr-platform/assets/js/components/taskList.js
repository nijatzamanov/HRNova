// taskList.js - Task List Component
(function(window) {
    'use strict';

    const TaskList = {

        // Generate mock tasks
        generateMockTasks: function() {
            return [
                {
                    id: 1,
                    title: 'Create branded collateral',
                    completed: false,
                    due: 'Oct 30, 2023',
                    members: [
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg'
                    ],
                    memberCount: 3,
                    progress: 25,
                    time: '9 AM'
                },
                {
                    id: 2,
                    title: 'Develop brand guidelines document',
                    completed: false,
                    due: 'Nov 04, 2023',
                    members: [
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg'
                    ],
                    memberCount:  2,
                    progress: 25,
                    time: '10 AM'
                },
                {
                    id: 3,
                    title: 'Refine UX/UI for product partials',
                    completed: false,
                    due: 'Nov 10, 2023',
                    members: [
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg'
                    ],
                    memberCount: 6,
                    progress: 10,
                    time: '11 AM'
                },
                {
                    id: 4,
                    title: 'Collaborate on website redesign',
                    completed: true,
                    due: 'Oct 23, 2023',
                    members: [
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg'
                    ],
                    memberCount: 6,
                    progress: 100,
                    time: '12 PM'
                },
                {
                    id: 5,
                    title: 'Conduct A/B testing on homepage',
                    completed: true,
                    due: 'Oct 23, 2023',
                    members: [
                        './assets/img/placeholders/avatar.svg',
                        './assets/img/placeholders/avatar.svg'
                    ],
                    memberCount:  2,
                    progress: 100,
                    time: '1 PM'
                }
            ];
        },

        // Render task list
        render: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const tasks = this.generateMockTasks();

            container.innerHTML = tasks.map(task => {
                const progressClass = task.progress >= 80 ? 'task-item__progress-fill--high' :
                    task.progress >= 50 ? 'task-item__progress-fill--medium' :
                        'task-item__progress-fill--low';

                return `
          <div class="task-item ${task.completed ? 'task-item--completed' : ''}" data-task-id="${task.id}">
            <div class="task-item__main">
              <div class="task-item__checkbox"></div>
              <div class="task-item__title">${task.title}</div>
            </div>
            
            <div class="task-item__due">${task.due}</div>
            
            <div class="task-item__members">
              ${task.members.slice(0, 4).map(avatar => `
                <img src="${avatar}" alt="Member" class="task-item__avatar">
              `).join('')}
              ${task.memberCount > 4 ? `<div class="task-item__avatar-more">+${task.memberCount - 4}</div>` : ''}
            </div>
            
            <div class="task-item__progress">
              <div class="task-item__progress-bar">
                <div class="task-item__progress-fill ${progressClass}" style="width: ${task.progress}%"></div>
              </div>
              <div class="task-item__progress-text">${task.progress}%</div>
            </div>
            
            <div class="task-item__time">${task.time}</div>
          </div>
        `;
            }).join('');

            // Attach checkbox event listeners
            container.querySelectorAll('.task-item__checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    const taskItem = e.target.closest('.task-item');
                    taskItem.classList.toggle('task-item--completed');
                });
            });
        }
    };

    window.TaskList = TaskList;
})(window);