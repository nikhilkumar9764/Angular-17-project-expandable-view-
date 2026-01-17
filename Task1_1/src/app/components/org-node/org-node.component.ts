import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgNode } from 'src/app/models/org-node.model';

@Component({
  selector: 'app-org-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './org-node.component.html',
  styleUrls: ['./org-node.component.css']
})
export class OrgNodeComponent {
  @Input() node!: OrgNode;
  @Output() nodeClick = new EventEmitter<OrgNode>();
  @Output() toggleExpand = new EventEmitter<string>();

  
  getInitials(): string {
    return this.node.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  
  getAvatarColor(): string {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
    const index = this.node.id.charCodeAt(0) % colors.length;
    return colors[index];
  }

  
  onNodeClick(): void {
    this.nodeClick.emit(this.node);
  }

  
  onToggleExpand(event: Event): void {
    event.stopPropagation();
    this.toggleExpand.emit(this.node.id);
  }

}
