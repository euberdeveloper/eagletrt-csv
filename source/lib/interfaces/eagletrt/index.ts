export interface EagleMessage {
    timestamp: number;
    value: string | number | object;
}

export type EagleMessages = EagleMessage[];

export interface EagleGroup {
    [key: string]: EagleMessages | EagleGroup;
}

export type EagleRecord = { id: number; timestamp: number; } & EagleGroup;

export function instanceOfEagleMessages(obj: EagleGroup | EagleMessages): obj is EagleMessages {
    return Array.isArray(obj);
}

export function instanceOfEagleGroup(obj: EagleGroup | EagleMessages): obj is EagleGroup {
    return !Array.isArray(obj) && typeof obj === 'object';
}
