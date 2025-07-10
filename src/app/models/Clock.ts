export default class Clock {
    startTime: string;
    speed: number;
    currentTime: string;
    hourDeg: number;
    minuteDeg: number;
    secondDeg: number;
    intervalId: any;
    baseTimeStamp: number;
    accumulatedSeconds: number;
    initialHours: number;
    initialMinutes: number;
    initialSeconds: number;

    constructor(startTime: string = '12:00', speed: number = 1) {
        this.startTime = startTime;
        this.speed = speed;
        this.currentTime = startTime;
        this.hourDeg = 0;
        this.minuteDeg = 0;
        this.secondDeg = 0;
        this.intervalId = null;

        this.baseTimeStamp = Date.now();
        this.accumulatedSeconds = 0;
        
        const timeParts = startTime.split(':').map(Number);
        this.initialHours = timeParts[0] || 0;
        this.initialMinutes = timeParts[1] || 0;
        this.initialSeconds = timeParts[2] || 0;
    }

    update() {
        const now = Date.now()
        const elapsedRealSeconds = (now - this.baseTimeStamp) / 1000
        const elapsedClockSeconds = elapsedRealSeconds * this.speed
        this.accumulatedSeconds = elapsedClockSeconds

        const totalSeconds = this.initialHours * 3600 + this.initialMinutes * 60 + this.initialSeconds + this.accumulatedSeconds

        const clockTime = new Date(totalSeconds * 1000)
        const hrs = clockTime.getUTCHours()
        const mins = clockTime.getUTCMinutes()
        const secs = clockTime.getUTCSeconds()

        this.secondDeg = secs * 6
        this.minuteDeg = mins * 6 + secs * 0.1
        this.hourDeg = hrs * 30 + mins * 0.5

        this.currentTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    start() {
        this.baseTimeStamp = Date.now()
        this.update()
        this.intervalId = setInterval(() => this.update(), 1000 / this.speed)
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    setTime(newTime: string) {
        const timeParts = newTime.split(':').map(Number);
        const hours = timeParts[0] || 0;
        const minutes = timeParts[1] || 0;
        const seconds = timeParts[2] || 0;
        
        this.initialHours = hours;
        this.initialMinutes = minutes;
        this.initialSeconds = seconds;
        this.accumulatedSeconds = 0;
        this.baseTimeStamp = Date.now();
        this.update();
    }
}