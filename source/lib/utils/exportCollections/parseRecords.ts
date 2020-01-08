import { EagleRecord, EagleGroup, instanceOfEagleGroup, instanceOfEagleMessages } from "../../interfaces/eagletrt";

async function mergeGroups(result: EagleGroup, group: EagleGroup): Promise<void> {
    for (const key in group) {
        const resultElement = result[key];
        const groupElement = group[key];

        if (instanceOfEagleGroup(resultElement) && instanceOfEagleGroup(groupElement)) {
            await mergeGroups(resultElement, groupElement);
        }
        else if (instanceOfEagleMessages(resultElement) && instanceOfEagleMessages(groupElement)) {
            const newElements = groupElement.sort((x, y) => x.timestamp - y.timestamp);
            resultElement.push(...newElements);
        }
    }
}

export async function parseRecords(records: EagleRecord[]): Promise<EagleGroup> {
    if (records && records.length) {
        const result = records[0];
        delete result._id;

        for (let i = 0; i < records.length; i++) {
            await mergeGroups(result, records[i]);
        }
        
        return result;
    }
    else {
        return null;
    }
}