import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FinancialNode, ApiResponse, ApiRecord, RowData } from '../models/financial-node.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  private treeDataSubject = new BehaviorSubject<FinancialNode[]>([]);
  public treeData$ = this.treeDataSubject.asObservable();

  constructor() {}

  /**
   * Process the API JSON response and build hierarchical tree
   */
  processApiData(apiResponse: ApiResponse): void {
    const records = apiResponse.Data.Table;
    const tree = this.buildHierarchy(records);
    this.treeDataSubject.next(tree);
  }

  /**
   * Build hierarchy from flat API data
   */
  private buildHierarchy(records: ApiRecord[]): FinancialNode[] {
    const hierarchyMap = new Map<string, FinancialNode>();
    const rootNodes: FinancialNode[] = [];

    // Group records by hierarchy levels
    records.forEach(record => {
      const level1Key = record.TreeRuleDisplayName1 || 'Uncategorized';
      const level2Key = record.TreeRuleDisplayName2 ? `${level1Key}|${record.TreeRuleDisplayName2}` : null;
      const level3Key = record.TreeRuleDisplayName3 ? `${level2Key}|${record.TreeRuleDisplayName3}` : null;
      const level4Key = record.TreeRuleDisplayName4 ? `${level3Key}|${record.TreeRuleDisplayName4}` : null;

      // Create Level 1 node
      if (!hierarchyMap.has(level1Key)) {
        const level1Node: FinancialNode = {
          id: level1Key,
          level: 1,
          displayName: level1Key,
          children: [],
          expanded: true,
          isGroupHeader: true,
          totalInCHFAccruedInt: 0,
          percentage: 0
        };
        hierarchyMap.set(level1Key, level1Node);
        rootNodes.push(level1Node);
      }

      const level1Node = hierarchyMap.get(level1Key)!;

      // Create Level 2 node if exists
      if (level2Key && record.TreeRuleDisplayName2) {
        if (!hierarchyMap.has(level2Key)) {
          const level2Node: FinancialNode = {
            id: level2Key,
            level: 2,
            displayName: record.TreeRuleDisplayName2,
            children: [],
            expanded: true,
            isGroupHeader: true,
            totalInCHFAccruedInt: 0,
            percentage: 0
          };
          hierarchyMap.set(level2Key, level2Node);
          level1Node.children!.push(level2Node);
        }

        const level2Node = hierarchyMap.get(level2Key)!;

        // Create Level 3 node if exists
        if (level3Key && record.TreeRuleDisplayName3) {
          if (!hierarchyMap.has(level3Key)) {
            const level3Node: FinancialNode = {
              id: level3Key,
              level: 3,
              displayName: record.TreeRuleDisplayName3,
              children: [],
              expanded: false,
              isGroupHeader: true,
              totalInCHFAccruedInt: 0,
              percentage: 0
            };
            hierarchyMap.set(level3Key, level3Node);
            level2Node.children!.push(level3Node);
          }

          const level3Node = hierarchyMap.get(level3Key)!;

          // Create Level 4 node if exists
          if (level4Key && record.TreeRuleDisplayName4) {
            if (!hierarchyMap.has(level4Key)) {
              const level4Node: FinancialNode = {
                id: level4Key,
                level: 4,
                displayName: record.TreeRuleDisplayName4,
                children: [],
                expanded: false,
                isGroupHeader: true,
                totalInCHFAccruedInt: 0,
                percentage: 0
              };
              hierarchyMap.set(level4Key, level4Node);
              level3Node.children!.push(level4Node);
            }
          }
        }
      }

      // Create detail node for the record
      const detailNode = this.createDetailNode(record);
      
      // Add to appropriate parent
      if (level4Key && hierarchyMap.has(level4Key)) {
        hierarchyMap.get(level4Key)!.children!.push(detailNode);
      } else if (level3Key && hierarchyMap.has(level3Key)) {
        hierarchyMap.get(level3Key)!.children!.push(detailNode);
      } else if (level2Key && hierarchyMap.has(level2Key)) {
        hierarchyMap.get(level2Key)!.children!.push(detailNode);
      } else {
        level1Node.children!.push(detailNode);
      }
    });

    // Calculate aggregates
    this.calculateAggregates(rootNodes, records[0]?.ReportingTotalAsset || 1);

    return rootNodes;
  }

  /**
   * Create detail node from API record
   */
  private createDetailNode(record: ApiRecord): FinancialNode {
    const rows: RowData[] = [];
    
      rows.push({
        col1: record.Row1Col1,
        col2: record.Row1Col2,
        col3: record.Row1Col3,
        col4: record.Row1Col4,
        col5: record.Row1Col5,
        col6: record.Row1Col6,
        col7: record.Row1Col7,
        col8: record.Row1Col8,
        col9: record.Row1Col9,
        col10: record.Row1Col10,
        col11: record.Row1Col11
      });
  
      rows.push({
        col1: record.Row2Col1,
        col2: record.Row2Col2,
        col3: record.Row2Col3,
        col4: record.Row2Col4,
        col5: record.Row2Col5,
        col6: record.Row2Col6,
        col7: record.Row2Col7,
        col8: record.Row2Col8,
        col9: record.Row2Col9,
        col10: record.Row2Col10
      });

    
      rows.push({
        col1: record.Row3Col1,
        col2: record.Row3Col2,
        col3: record.Row3Col3,
        col4: record.Row3Col4,
        col5: record.Row3Col5, // Can be string (Price Date) or number
        col6: record.Row3Col6,
        col7: record.Row3Col7,
        col8: record.Row3Col8,
        col9: record.Row3Col9,
        col10: record.Row3Col10
      });

    const esgRating = this.getEsgRating(record.EsgRatingGroupNr);

    return {
      id: `record-${record.RecordId}`,
      level: 0,
      displayName: record.Row1Col3 || '',
      ccy: record.Row1Col1 || undefined,
      quantity: record.Row1Col2 || undefined,
      description: record.Row1Col3 || '',
      esgRating: esgRating,
      costPrice: record.Row1Col4 || undefined,
      curPrice: record.Row1Col5 || undefined,
      valuationAccruedInt: record.Row1Col6 || undefined,
      totalInCHFAccruedInt: record.Row1Col7 !== null && record.Row1Col7 !== undefined ? record.Row1Col7 : (record.Row1Col6 || 0),
      pATotal: record.Row1Col9 || undefined,
      pAYTDTotal: record.Row1Col10 || undefined,
      percentage: record.Row1Col8 || undefined,
      rows: rows,
      expanded: false,
      isGroupHeader: false,
      hasDetails: rows.length > 1
    };
  }

  /**
   * Get ESG rating icon
   */
  private getEsgRating(ratingNr: number): string {
    if (ratingNr === -1) return '';
    if (ratingNr === 0) return '●';
    return '';
  }

  /**
   * Calculate aggregates for group nodes
   */
  private calculateAggregates(nodes: FinancialNode[], totalAsset: number): void {
    nodes.forEach(node => {
      if (node.isGroupHeader && node.children) {
        this.calculateAggregates(node.children, totalAsset);
        
        let total = 0;
        node.children.forEach(child => {
          if (child.isGroupHeader) {
            total += child.totalInCHFAccruedInt || 0;
          } else {
            // For detail nodes, use Row1Col6 (valuation) if Row1Col7 is not available
            const nodeTotal = child.totalInCHFAccruedInt || child.valuationAccruedInt || 0;
            total += nodeTotal;
          }
        });
        
        node.totalInCHFAccruedInt = total;
        node.percentage = totalAsset !== 0 ? (total / totalAsset) * 100 : 0;
      }
    });
  }

  /**
   * Get category summaries for the Ccy section
   */
  getCategorySummaries(): Array<{name: string, total: number, percentage: number}> {
    const currentTree = this.treeDataSubject.value;
    const summaries: Array<{name: string, total: number, percentage: number}> = [];
    
    currentTree.forEach(node => {
      if (node.isGroupHeader) {
        summaries.push({
          name: node.displayName,
          total: node.totalInCHFAccruedInt || 0,
          percentage: node.percentage || 0
        });
      }
    });
    
    return summaries;
  }

  /**
   * Toggle node expansion
   */
  toggleNode(nodeId: string): void {
    const currentTree = this.treeDataSubject.value;
    this.toggleNodeRecursive(currentTree, nodeId);
    this.treeDataSubject.next([...currentTree]);
  }

  private toggleNodeRecursive(nodes: FinancialNode[], nodeId: string): boolean {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.expanded = !node.expanded;
        return true;
      }
      if (node.children && this.toggleNodeRecursive(node.children, nodeId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Expand all nodes
   */
  expandAll(): void {
    const currentTree = this.treeDataSubject.value;
    this.setAllExpanded(currentTree, true);
    this.treeDataSubject.next([...currentTree]);
  }

  /**
   * Collapse all nodes
   */
  collapseAll(): void {
    const currentTree = this.treeDataSubject.value;
    this.setAllExpanded(currentTree, false);
    this.treeDataSubject.next([...currentTree]);
  }

  private setAllExpanded(nodes: FinancialNode[], expanded: boolean): void {
    nodes.forEach(node => {
      node.expanded = expanded;
      if (node.children) {
        this.setAllExpanded(node.children, expanded);
      }
    });
  }
}
