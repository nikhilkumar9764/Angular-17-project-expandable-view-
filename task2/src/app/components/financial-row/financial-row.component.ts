import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialNode } from '../../models/financial-node.model';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-financial-row',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatIconModule],
  templateUrl: './financial-row.component.html',
  styleUrls: ['./financial-row.component.css']
})
export class FinancialRowComponent {
  @Input() node!: FinancialNode;
  @Output() toggleNode = new EventEmitter<string>();

  onToggle(): void {
    this.toggleNode.emit(this.node.id);
  }

  formatNumber(value: number | string | undefined |null, decimals: number = 0): string {
    if (value === undefined || value === null) return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  formatPercentage(value: number | undefined | null): string {
    if (value === undefined || value === null) return '';
    return value.toFixed(2) + '%';
  }

  getLevelClass(): string {
    return `level-${this.node.level}`;
  }

  getIndentStyle(): any {
    if (this.node.isGroupHeader) {
      return { 'padding-left': `${this.node.level * 20}px` };
    }
    return { 'padding-left': `${(this.node.level + 1) * 20 + 20}px` };
  }

  // Helper method to check if value is a number
  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  // Helper method to check if value is a string
  isString(value: any): boolean {
    return typeof value === 'string';
  }

  // Helper method to check if value exists and is not null
  hasValue(value: any): boolean {
    return value !== null && value !== undefined;
  }
}
