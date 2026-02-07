   export const  formatStatstics= (data, mode) => {
        const stats = data.reduce((acc, item) => {
            const dateObj = new Date(item.date + 'T00:00:00');
            let key;

            if (mode === 'daily') key = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            else if (mode === 'monthly') key = dateObj.toLocaleDateString('en-US', { month: 'short' });
            else if (mode === 'yearly') key = item.date.split('-')[0];

            acc[key] = (acc[key] || 0) + item.completed;
            return acc;
        }, {});

        return Object.keys(stats).map(name => ({
            name,
            completed: stats[name]
        }));
    }
