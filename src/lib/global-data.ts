export const globalData: GlobalData = {
  chatIds: [2097992443, 1464486368],
  chatData: {
    '1464486368': { quote: '', dialogState: 0 },
    '2097992443': { quote: '', dialogState: 0 },
  },
};

// globalData можен хранить только типы, которые можно привести к JSON (Record, array и примитивные), поэтому не используем Map или Set
export interface GlobalData extends Record<string, any> {
  chatIds: number[];
  chatData: Record<
    number,
    {
      quote: string;
      dialogState: number;
    }
  >;
}

export function redefineData(data: any) {
  for (const [key, value] of Object.entries(data)) {
    globalData[key] = value;
  }
}
