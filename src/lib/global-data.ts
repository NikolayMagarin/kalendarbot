export const globalData: GlobalData = {
  chatIds: [],
  chatData: {},
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
