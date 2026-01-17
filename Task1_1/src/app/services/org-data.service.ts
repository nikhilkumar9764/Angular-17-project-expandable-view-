import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrgNode, OrgStats } from '../models/org-node.model';

@Injectable({
  providedIn: 'root'
})
export class OrgDataService {
  private orgData: OrgNode = {
    id: '1',
    name: 'Cristiano Ronaldo',
    position: 'Company Owner',
    department: 'Executive',
    email: 'cris.ronaldo@company.com',
    phone: '+1 (555) 001-0001',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'Michael Jordan',
        position: 'CEO',
        department: 'Executive',
        email: 'michael.jordan@company.com',
        phone: '+1 (555) 001-0002',
        expanded: true,
        children: [
          {
            id: '3',
            name: 'Rio Ferdinand',
            position: 'Director of Engineering',
            department: 'Engineering',
            email: 'rio.ferdinand@company.com',
            phone: '+1 (555) 001-0003',
            expanded: true,
            children: [
              {
                id: '4',
                name: 'Wayne Rooney',
                position: 'VP of Engineering',
                department: 'Engineering',
                email: 'wayne.rooney@company.com',
                phone: '+1 (555) 001-0004',
                children: [
                  {
                    id: '5',
                    name: 'David Beckham',
                    position: 'Senior Engineer',
                    department: 'Engineering',
                    email: 'david.beckham@company.com',
                    phone: '+1 (555) 001-0005'
                  },
                  {
                    id: '6',
                    name: ' Robin van Persie',
                    position: 'Senior Engineer',
                    department: 'Engineering',
                    email: 'robin.vanpersie@company.com',
                    phone: '+1 (555) 001-0006'
                  }
                ]
              }
            ]
          },
          {
            id: '7',
            name: 'Ryan Giggs',
            position: 'Director of Sales',
            department: 'Sales',
            email: 'ryan.giggs@company.com',
            phone: '+1 (555) 001-0007',
            expanded: true,
            children: [
              {
                id: '8',
                name: 'Paul Scholes',
                position: 'VP of Sales',
                department: 'Sales',
                email: 'paul.scholes@company.com',
                phone: '+1 (555) 001-0008',
                children: [
                  {
                    id: '9',
                    name: 'Martin Tyler',
                    position: 'Sales Manager',
                    department: 'Sales',
                    email: 'martin.tyler@company.com',
                    phone: '+1 (555) 001-0009'
                  }
                ]
              }
            ]
          },
          {
            id: '10',
            name: 'Gary Neville',
            position: 'Director of Marketing',
            department: 'Marketing',
            email: 'gary.neville@company.com',
            phone: '+1 (555) 001-0010',
            children: [
              {
                id: '11',
                name: 'Bryan Robson',
                position: 'VP of Marketing',
                department: 'Marketing',
                email: 'bryan.robson@company.com',
                phone: '+1 (555) 001-0011'
              }
            ]
          }
        ]
      }
    ]
  };

  private orgDataSubject = new BehaviorSubject<OrgNode>(this.orgData);
  public orgData$ = this.orgDataSubject.asObservable();

  constructor() {}

  /**
   * Get the organizational data as an observable
   */
  getOrgData(): Observable<OrgNode> {
    return this.orgData$;
  }

  /**
   * Toggle expansion state of a node by ID
   */
  toggleNodeExpansion(nodeId: string): void {
    this.toggleNode(this.orgData, nodeId);
    this.orgDataSubject.next({ ...this.orgData });
  }

  /**
   * Expand all nodes in the tree
   */
  expandAll(): void {
    this.setAllExpanded(this.orgData, true);
    this.orgDataSubject.next({ ...this.orgData });
  }

  /**
   * Collapse all nodes in the tree
   */
  collapseAll(): void {
    this.setAllExpanded(this.orgData, false);
    this.orgDataSubject.next({ ...this.orgData });
  }

  /**
   * Add a new node to a parent by ID
   */
  addNode(parentId: string, newNode: OrgNode): void {
    this.addNodeToParent(this.orgData, parentId, newNode);
    this.orgDataSubject.next({ ...this.orgData });
  }

  /**
   * Calculate statistics for the organization
   */
  calculateStats(): OrgStats {
    const totalEmployees = this.countNodes(this.orgData);
    
    const departments = new Set<string>();
    this.collectDepartments(this.orgData, departments);
    
    const maxDepth = this.calculateDepth(this.orgData);
    
    return {
      totalEmployees,
      totalDepartments: departments.size,
      maxDepth
    };
  }

  /**
   * Private helper methods
   */
  private toggleNode(node: OrgNode, targetId: string): boolean {
    if (node.id === targetId) {
      node.expanded = !node.expanded;
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (this.toggleNode(child, targetId)) {
          return true;
        }
      }
    }
    return false;
  }

  private setAllExpanded(node: OrgNode, expanded: boolean): void {
    node.expanded = expanded;
    if (node.children) {
      node.children.forEach(child => this.setAllExpanded(child, expanded));
    }
  }

  private addNodeToParent(node: OrgNode, parentId: string, newNode: OrgNode): boolean {
    if (node.id === parentId) {
      if (!node.children) {
        node.children = [];
      }
      node.children.push(newNode);
      node.expanded = true;
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (this.addNodeToParent(child, parentId, newNode)) {
          return true;
        }
      }
    }
    return false;
  }

  private countNodes(node: OrgNode): number {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => {
        count += this.countNodes(child);
      });
    }
    return count;
  }

  private collectDepartments(node: OrgNode, departments: Set<string>): void {
    if (node.department) {
      departments.add(node.department);
    }
    if (node.children) {
      node.children.forEach(child => this.collectDepartments(child, departments));
    }
  }

  private calculateDepth(node: OrgNode, currentDepth = 1): number {
    if (!node.children || node.children.length === 0) {
      return currentDepth;
    }
    const childDepths = node.children.map(child => 
      this.calculateDepth(child, currentDepth + 1)
    );
    return Math.max(...childDepths);
  }
}
