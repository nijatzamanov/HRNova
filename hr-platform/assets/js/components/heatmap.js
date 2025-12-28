// heatmap.js - ROTATED: Days on top, Hours on left
(function(window) {
    'use strict';

    const Heatmap = {

        // Generate mock attendance data (ROTATED)
        generateMockData: function() {
            const data = [];
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

            // Generate for 24 hours (or subset for demo)
            const hours = [
                '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
            ];

            hours.forEach(time => {
                const row = { time, values: [] };

                days.forEach((day, index) => {
                    // Weekdays (Mon-Fri) have higher attendance
                    const isWeekday = index >= 0 && index <= 4;

                    // Work hours (09:00-17:00) have higher attendance
                    const hour = parseInt(time.split(':')[0]);
                    const isWorkHours = hour >= 9 && hour <= 17;

                    let baseLevel = 1;
                    if (isWeekday && isWorkHours) {
                        baseLevel = 5;
                    } else if (isWeekday) {
                        baseLevel = 3;
                    } else if (isWorkHours) {
                        baseLevel = 2;
                    }

                    const randomVariation = Math.floor(Math.random() * 2);
                    const level = Math.min(7, Math.max(0, baseLevel + randomVariation));
                    const count = level * 4; // Approximate number of people

                    row.values.push({ level, count, day });
                });

                data.push(row);
            });

            return data;
        },

        // Render heatmap
        render: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const data = this.generateMockData();

            container.innerHTML = data.map(row => `
        <div class="heatmap__row">
          <div class="heatmap__time-label">${row.time}</div>
          ${row.values.map(cell => `
            <div class="heatmap__cell heatmap__cell--level-${cell.level}">
              <div class="heatmap__tooltip">
                ${cell.day} ${row.time}:  ${cell.count} present
              </div>
            </div>
          `).join('')}
        </div>
      `).join('');
        }
    };

    window.Heatmap = Heatmap;
})(window);