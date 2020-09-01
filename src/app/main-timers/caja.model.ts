import { interval } from 'rxjs';

export interface Caja{
    type: string;
    id: number;
    nombre: string;
    timerValue: number;
    countingValue: number;
    groupName: string;
    groupLaps: number;

    // Variables para logica timer
    counting: boolean;
    interval;
}
