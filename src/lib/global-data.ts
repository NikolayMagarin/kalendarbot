export const globalData: GlobalData = {
  chatIds: [2097992443, 1464486368],
};

// globalData может хранить только типы, которые можно привести к JSON (Record, array и примитивные), поэтому не используем Map или Set
export interface GlobalData extends Record<string, any> {
  chatIds: number[];
}

export function redefineData(data: any) {
  for (const [key, value] of Object.entries(data)) {
    globalData[key] = value;
  }
}
