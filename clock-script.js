class TimezoneClock {
    constructor() {
        this.timezones = {
            'newyork': { name: 'America/New_York', offset: -5 },
            'london': { name: 'Europe/London', offset: 0 },
            'tokyo': { name: 'Asia/Tokyo', offset: 9 },
            'sydney': { name: 'Australia/Sydney', offset: 11 },
            'dubai': { name: 'Asia/Dubai', offset: 4 },
            'singapore': { name: 'Asia/Singapore', offset: 8 }
        };
        
        this.is24HourFormat = false;
        this.showAnalog = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAllClocks();
        setInterval(() => this.updateAllClocks(), 1000);
    }

    setupEventListeners() {
        document.getElementById('toggle-format').addEventListener('click', () => {
            this.is24HourFormat = !this.is24HourFormat;
            document.getElementById('toggle-format').textContent = 
                this.is24HourFormat ? '12-Hour Format' : '24-Hour Format';
        });

        document.getElementById('toggle-analog').addEventListener('click', () => {
            this.showAnalog = !this.showAnalog;
            const container = document.querySelector('.clock-container');
            if (this.showAnalog) {
                container.classList.remove('analog-hidden');
                document.getElementById('toggle-analog').textContent = 'Hide Analog Clocks';
            } else {
                container.classList.add('analog-hidden');
                document.getElementById('toggle-analog').textContent = 'Show Analog Clocks';
            }
        });
    }

    updateAllClocks() {
        Object.keys(this.timezones).forEach(key => {
            this.updateClock(key);
        });
    }

    updateClock(timezone) {
        const now = new Date();
        
        const timeString = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timezones[timezone].name,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !this.is24HourFormat
        }).format(now);

        let [hours, minutes, seconds] = timeString.match(/\d{2}/g);
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);

        const period = this.is24HourFormat ? '' : (hours >= 12 ? 'PM' : 'AM');
        
        if (!this.is24HourFormat && hours > 12) {
            hours -= 12;
        } else if (!this.is24HourFormat && hours === 0) {
            hours = 12;
        }

        const timeString2 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById(`time-${timezone}`).textContent = timeString2;
        document.getElementById(`period-${timezone}`).textContent = period;

        this.updateAnalogClock(timezone, hours, minutes, seconds);
    }

    updateAnalogClock(timezone, hours, minutes, seconds) {
        if (!this.is24HourFormat && hours !== 12 && hours !== 0) {
            hours = hours;
        }

        const secondDegrees = (seconds / 60) * 360;
        const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

        document.getElementById(`second-${timezone}`).style.transform = `rotate(${secondDegrees}deg)`;
        document.getElementById(`minute-${timezone}`).style.transform = `rotate(${minuteDegrees}deg)`;
        document.getElementById(`hour-${timezone}`).style.transform = `rotate(${hourDegrees}deg)`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TimezoneClock();
    });
} else {
    new TimezoneClock();
}