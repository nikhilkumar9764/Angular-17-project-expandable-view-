export interface FinancialNode {
    id: string;
    level: number;
    displayName: string;
    ccy?: string;
    quantity?: number;
    description?: string;
    esgRating?: string;
    costPrice?: number;
    costPriceFX?: number;
    curPrice?: number;
    curPriceFX?: number;
    priceDate?: string;
    valuationAccruedInt?: number;
    totalInCHFAccruedInt?: number;
    pATotal?: number;
    pAYTDTotal?: number;
    percentage?: number;
    children?: FinancialNode[];
    expanded?: boolean;
    isGroupHeader?: boolean;
    rows?: RowData[];
    hasDetails?: boolean;
  }
  
  export interface RowData {
    col1?: string | null;
    col2?: number | null;
    col3?: string | null;
    col4?: number |null;
    col5?: number | string| null;
    col6?: number | null;
    col7?: number | null;
    col8?: number | null;
    col9?: number | null;
    col10?: number | null;
    col11?: number | null;
  }
  
  export interface ApiResponse {
    Data: {
      Table: ApiRecord[];
    },
    Message: {
      MessageCode: number;
      Message: string;
    }
  }
  
  export interface ApiRecord {
    RecordId: number;
    TreeNodeId: number | null;
    TreeNodeSort: string | null;
    Lvl1NodeOrder: number | null;
    TreeRuleDisplayName1: string | null;
    Lvl2NodeOrder: number | null;
    TreeRuleDisplayName2: string | null;
    Lvl3NodeOrder: number | null;
    TreeRuleDisplayName3: string | null;
    Lvl4NodeOrder: number | null;
    TreeRuleDisplayName4: string | null;
    Row1Col1: string | null;
    Row1Col2: number | null;
    Row1Col3: string | null;
    Row1Col4: number | null;
    Row1Col5: number | null;
    Row1Col6: number | null;
    Row1Col7: number | null;
    Row1Col8: number | null;
    Row1Col9: number | null;
    Row1Col10: number | null;
    Row1Col11: number | null;
    Row2Col1: string | null;
    Row2Col2: number | null;
    Row2Col3: string | null;
    Row2Col4: number | null;
    Row2Col5: number | null;
    Row2Col6: number | null;
    Row2Col7: number | null;
    Row2Col8: number | null;
    Row2Col9: number | null;
    Row2Col10: number | null;
    Row3Col1: string | null;
    Row3Col2: number | null;
    Row3Col3: string | null;
    Row3Col4: number | null;
    Row3Col5: string | null;
    Row3Col6: number | null;
    Row3Col7: number | null;
    Row3Col8: number | null;
    Row3Col9: number | null;
    Row3Col10: number | null;
    EsgRatingGroupNr: number;
    ReportingTotalAsset: number;
  }
  
  