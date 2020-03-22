export interface EagleMessage {
    timestamp: number;
    value: string | number | object;
}

export type EagleMessages = EagleMessage[];

export interface EagleGroup {
    [key: string]: EagleMessages | EagleGroup;
}

export type EagleRecord = { 
    id: number; 
    sessionName: string; 
    timestamp: number; 
} & EagleGroup;

export type EagleSession = { 
    sessionName: string;
    timestamp: number;
    formatted_timestamp: string;
    pilot: string;
    race: string;
};

export function instanceOfEagleMessages(obj: EagleGroup | EagleMessages): obj is EagleMessages {
    return Array.isArray(obj);
}

export function instanceOfEagleGroup(obj: EagleGroup | EagleMessages): obj is EagleGroup {
    return !Array.isArray(obj) && typeof obj === 'object';
}
