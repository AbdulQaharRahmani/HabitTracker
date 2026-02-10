import { formatDate } from "./dateFormatter";

   export const  formatStatstics= (data, mode) => {
        const stats = data.reduce((acc, item) => {
            const dateObj = new Date(item.date + 'T00:00:00');
            let key;

            if (mode === 'weekly') key = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            else if (mode === 'monthly') key = formatDate(dateObj);
            else if (mode === 'yearly') key = dateObj.toLocaleDateString('en-US', { month: 'short' });

            acc[key] = (acc[key] || 0) + item.completed;
            return acc;
        }, {});

        return Object.keys(stats).map(name => ({
            name,
            completed: stats[name]
        }));
    }
