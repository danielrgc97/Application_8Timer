import { interval } from 'rxjs';

export interface Caja{
    id: number;
    nombre: string;
    timerValue: number;
    countingValue: number;
    counting: boolean;
    interval;
    role: string;
}
