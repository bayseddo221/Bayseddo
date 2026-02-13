
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Maraîchage' | 'Aviculture' | 'Céréales' | 'Bétail' | 'Arboriculture';
  location: string;
  imageUrl: string;
  targetAmount: number;
  raisedAmount: number;
  investorsCount: number;
  roi: number; // 15-20% as per requirements
  duration: number; // in months
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  status: 'Collecte' | 'En cours' | 'Clôturé';
  startDate?: string;
  endDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor';
  isVerified: boolean;
  balance: number; // Available cash (Capital + ROI of finished projects)
  investedCapital: number; // Currently locked in active projects
}

export interface InvestmentRecord {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  expectedROI: number;
  date: string;
  status: 'Actif' | 'Clôturé';
  payoutDate: string;
}
