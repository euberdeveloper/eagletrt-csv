import { EagleRecord, EagleGroup, instanceOfEagleGroup, instanceOfEagleMessages } from "../../interfaces/eagletrt";

async function mergeGroups(result: EagleGroup, group: EagleGroup): Promise<void> {
    for (const key in group) {
        const resultElement = result[key];
        const groupElement = result[key];

        if (instanceOfEagleGroup(resultElement) && instanceOfEagleGroup(groupElement)) {
            await mergeGroups(resultElement, groupElement);
        }
        else if (instanceOfEagleMessages(resultElement) && instanceOfEagleMessages(groupElement)) {
            const newElements = groupElement.sort((x, y) => x.timestamp - y.timestamp);
            result[key] = result[key] ? [...resultElement, ...newElements] : newElements;
        }
    }
}

export async function parseRecords(records: EagleRecord[]): Promise<EagleGroup> {
    if (records && records.length) {
        const result = {};

        for (const record of records) {
            await mergeGroups(result, record);
        }

        return result;
    }
    else {
        return null;
    }
}