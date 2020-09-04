import { interval } from 'rxjs';

export interface Caja{
    // Propiedades globales para cualquier tipo
    id: number;
    type: string;
    groupId: number;
    circuitState: number;
    display: boolean;
    enabled: boolean;

    // Propiedades de los timers
    timerName: string;
    timerValue: number;
    countingValue: number;
    displayString: string;
        // Variables para uso de la funcion setInterval
    counting: boolean;
    interval;

    // Propiedades de los circuitos
    circuitPos: number;
    circuitName: string;
    circuitDoingLap: number;
    circuitLaps: number;
    visible: boolean;
}

