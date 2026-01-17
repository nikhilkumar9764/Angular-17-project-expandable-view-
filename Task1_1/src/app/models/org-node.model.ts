export interface OrgNode {
    id: string;
    name: string;
    position: string;
    department?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    children?: OrgNode[];
    expanded?: boolean;
  }
  
  export interface OrgStats {
    totalEmployees: number;
    totalDepartments: number;
    maxDepth: number;
  }
  
  