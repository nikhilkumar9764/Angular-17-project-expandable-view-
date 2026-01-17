import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { OrgNodeComponent } from '../org-node/org-node.component';
import { OrgDataService } from '../../services/org-data.service';
import { OrgNode, OrgStats } from '../../models/org-node.model';

@Component({
  selector: 'app-org-tree',
  standalone: true,
  imports: [CommonModule, OrgNodeComponent],
  templateUrl: './org-tree.component.html',
  styleUrls: ['./org-tree.component.css']
})
export class OrgTreeComponent implements OnInit, OnDestroy {
  orgData: OrgNode | null = null;
  selectedNode: OrgNode | null = null;
  showNodeDetails = true;
  stats: OrgStats = {
    totalEmployees: 0,
    totalDepartments: 0,
    maxDepth: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private orgDataService: OrgDataService) {}

  ngOnInit(): void {
    this.loadOrgData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadOrgData(): void {
    this.orgDataService.getOrgData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.orgData = data;
        this.calculateStats();
      });
  }

  
  onNodeClick(node: OrgNode): void {
    this.selectedNode = node;
  }

  onToggleExpand(nodeId: string): void {
    this.orgDataService.toggleNodeExpansion(nodeId);
  }

  
  expandAll(): void {
    this.orgDataService.expandAll();
  }

  
  collapseAll(): void {
    this.orgDataService.collapseAll();
  }

  
  toggleDetailsPanel(): void {
    this.showNodeDetails = !this.showNodeDetails;
    if (!this.showNodeDetails) {
      this.selectedNode = null;
    }
  }


  closeDetails(): void {
    this.selectedNode = null;
  }

 
  private calculateStats(): void {
    this.stats = this.orgDataService.calculateStats();
  }

  get totalEmployees(): number {
    return this.stats.totalEmployees;
  }

  
  get totalDepartments(): number {
    return this.stats.totalDepartments;
  }

  get maxDepth(): number {
    return this.stats.maxDepth;
  }
}
