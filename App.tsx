
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Sprout, TrendingUp, ShieldCheck, 
  BarChart3, User, LogOut, ChevronRight, CheckCircle2, 
  Wallet, Leaf, ArrowRight, Wheat, Bot, Plus, Search,
  Filter, Landmark, History, CreditCard, Droplets, MapPin,
  FileText, Upload, AlertCircle, Calendar, ArrowUpRight,
  PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, Cell, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie 
} from 'recharts';

import { Project, User as UserType, InvestmentRecord } from './types';
import { ProjectCard } from './components/ProjectCard';
import { Button } from './components/Button';
import { analyzeProjectRisks } from './services/geminiService';
import { AIChat } from './components/AIChat';

// --- MOCK DATA ---
const MOCK_PROJECTS: Project[] = [
  {
    id: 'piment-mboro',
    title: 'Exploitation de Piment à Mboro',
    description: 'Culture intensive de piment "oiseau" sur 5 hectares. Installation d\'un système d\'irrigation solaire performant pour garantir des rendements élevés toute l\'année.',
    category: 'Maraîchage',
    location: 'Mboro, Thiès',
    imageUrl: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=800&auto=format&fit=crop',
    targetAmount: 5000000,
    raisedAmount: 3850000,
    investorsCount: 34,
    roi: 19,
    duration: 6,
    riskLevel: 'Moyen',
    status: 'Collecte'
  },
  {
    id: 'concombre-bambilor',
    title: 'Exploitation de Concombres à Bambilor',
    description: 'Production de concombres de qualité premium sous serres ombragées. Un cycle court et une forte demande sur le marché de Dakar pour un retour sur investissement rapide.',
    category: 'Maraîchage',
    location: 'Bambilor, Dakar',
    imageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=800&auto=format&fit=crop',
    targetAmount: 3000000,
    raisedAmount: 1200000,
    investorsCount: 15,
    roi: 16,
    duration: 4,
    riskLevel: 'Faible',
    status: 'Collecte'
  },
  {
    id: 'aviculture-mbour',
    title: 'Ferme Avicole Bio Mbour',
    description: 'Production de poulets de chair élevés en plein air avec alimentation 100% naturelle. Projet à fort impact local.',
    category: 'Aviculture',
    location: 'Mbour, Thiès',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop',
    targetAmount: 4500000,
    raisedAmount: 4100000,
    investorsCount: 42,
    roi: 17,
    duration: 5,
    riskLevel: 'Faible',
    status: 'Collecte'
  }
];

const MOCK_INVESTMENTS: InvestmentRecord[] = [
  {
    id: 'inv-past-1',
    projectId: 'old-1',
    projectName: 'Piment Mboro (Session 1 - 2024)',
    amount: 500000,
    expectedROI: 19,
    date: '10 Jan 2024',
    status: 'Clôturé',
    payoutDate: '15 Juin 2024'
  },
  {
    id: 'inv-active-1',
    projectId: 'piment-mboro',
    projectName: 'Piment Mboro (Session Actuelle)',
    amount: 250000,
    expectedROI: 19,
    date: '12 Fév 2025',
    status: 'Actif',
    payoutDate: '12 Août 2025'
  }
];

const MARKET_DATA = [
  { mois: 'Jan', piment: 800, concombre: 450 },
  { mois: 'Fév', piment: 950, concombre: 500 },
  { mois: 'Mar', piment: 1200, concombre: 400 },
  { mois: 'Avr', piment: 1100, concombre: 350 },
  { mois: 'Mai', piment: 1400, concombre: 550 },
  { mois: 'Juin', piment: 1600, concombre: 600 },
];

// --- VIEWS ---

const IdentityVerification = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-10 border-b border-slate-50">
           <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-green-50 text-green-700 rounded-2xl">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vérification d'Identité</h2>
           </div>
           <p className="text-slate-500 font-medium leading-relaxed">Assurez la sécurité de vos investissements en validant votre identité sénégalaise.</p>
        </div>
        <div className="p-10">
           {step === 1 && (
             <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="p-6 bg-slate-50 rounded-3xl border-2 border-green-600 flex items-center gap-4 cursor-pointer transition-all">
                   <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-700 font-black text-lg">CNI</div>
                   <div className="flex-1">
                      <p className="font-black text-slate-900">Carte Nationale d'Identité</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sénégal (Biométrique)</p>
                   </div>
                   <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <Button onClick={() => setStep(2)} className="w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Continuer</Button>
             </div>
           )}
           {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="border-4 border-dashed border-slate-100 rounded-[32px] p-12 text-center space-y-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 transition-all shadow-inner">
                      <Upload size={40} />
                   </div>
                   <div>
                      <p className="font-black text-slate-900 text-lg">Téléverser le Recto</p>
                      <p className="text-sm text-slate-400 font-medium">Glissez votre fichier ici ou cliquez pour parcourir</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-2xl py-5">Retour</Button>
                   <Button onClick={() => setStep(3)} className="flex-1 rounded-2xl py-5">Soumettre</Button>
                </div>
             </div>
           )}
           {step === 3 && (
             <div className="text-center py-8 space-y-8 animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-inner ring-[12px] ring-green-50"><CheckCircle2 size={48} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">Analyse en cours</h3>
                   <p className="text-slate-500 mt-4 font-medium leading-relaxed">Nos systèmes vérifient vos documents. Vous recevrez une notification d'ici 24h. Votre solde est déjà opérationnel.</p>
                </div>
                <Button onClick={onComplete} className="w-full py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-900/10">Accéder au Portefeuille</Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const DepositView = ({ balance, onDeposit, onBack }: { balance: number, onDeposit: (amount: number) => void, onBack: () => void }) => {
  const [amount, setAmount] = useState(100000);
  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
         <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-slate-900">Alimenter le compte</h2>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Mobile Money Sénégal</p>
            </div>
            <button onClick={onBack} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600"><X size={20}/></button>
         </div>
         <div className="p-10 space-y-10">
            <div className="bg-green-700 p-8 rounded-[32px] text-white text-center shadow-lg shadow-green-900/20">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Solde Liquide</span>
               <div className="text-4xl font-black mt-2">{balance.toLocaleString()} <span className="text-lg">FCFA</span></div>
            </div>
            
            <div className="space-y-4">
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sélectionner un canal</label>
               <div className="p-6 bg-green-50 border-2 border-green-600 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600 text-2xl">W</div>
                     <div>
                        <p className="font-black text-slate-900">Wave Sénégal</p>
                        <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">0% de frais de dépôt</p>
                     </div>
                  </div>
                  <CheckCircle2 className="text-green-600" size={24} />
               </div>
            </div>

            <div className="space-y-4">
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Montant à déposer (FCFA)</label>
               <input 
                 type="number" 
                 value={amount} 
                 onChange={(e) => setAmount(Number(e.target.value))}
                 className="w-full text-4xl font-black p-8 bg-slate-50 rounded-3xl outline-none ring-1 ring-slate-100 focus:ring-4 focus:ring-green-600/10 transition-all text-center tracking-tighter" 
               />
            </div>

            <Button onClick={() => onDeposit(amount)} className="w-full py-6 rounded-3xl font-black text-lg shadow-2xl shadow-green-900/20">Confirmer et Recharger</Button>
         </div>
      </div>
    </div>
  );
};

const DashboardView = ({ user, investments, onNavigate }: { 
  user: UserType, 
  investments: InvestmentRecord[], 
  onNavigate: (v: any) => void 
}) => {
  const [tab, setTab] = useState<'overview' | 'active' | 'history'>('overview');
  
  // Logical calculation: balance (liquid) vs invested (locked)
  const totalAccountValue = user.balance + user.investedCapital;

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Alert */}
        {!user.isVerified && (
           <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl mb-8 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-amber-400 text-white rounded-2xl shadow-md"><AlertCircle size={24} /></div>
                 <div>
                    <p className="text-sm font-black text-amber-900 tracking-tight">Statut: Incomplet</p>
                    <p className="text-xs text-amber-700 font-medium">Veuillez vérifier votre identité pour débloquer les retraits.</p>
                 </div>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-800 font-black uppercase text-[10px] tracking-widest" onClick={() => onNavigate('kyc')}>Vérifier maintenant</Button>
           </div>
        )}

        {/* Global Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
           <div className="bg-green-700 p-10 rounded-[40px] text-white shadow-2xl shadow-green-900/20 col-span-1 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Sprout size={160}/></div>
              <div className="relative z-10">
                 <span className="text-green-200 text-[10px] font-black uppercase tracking-widest">Valeur Totale Net (FCFA)</span>
                 <div className="text-5xl font-black mt-3 tracking-tighter">{totalAccountValue.toLocaleString()}</div>
              </div>
              <div className="mt-12 flex gap-8 relative z-10">
                 <div>
                    <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest mb-1">Solde (Liquidités)</p>
                    <p className="text-2xl font-black">{user.balance.toLocaleString()} <span className="text-xs font-normal">FCFA</span></p>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div>
                    <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest mb-1">Engagé (Culture)</p>
                    <p className="text-2xl font-black">{user.investedCapital.toLocaleString()} <span className="text-xs font-normal">FCFA</span></p>
                 </div>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Performance Globale</span>
                 <div className="text-4xl font-black text-slate-900 mt-2">17.8%</div>
              </div>
              <div className="flex items-center text-green-600 text-xs font-bold gap-2 mt-4 bg-green-50 w-fit px-3 py-1.5 rounded-xl">
                 <TrendingUp size={16} /> ROI Moyen
              </div>
           </div>
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Dividendes Perçus</span>
                 <div className="text-4xl font-black text-slate-900 mt-2">95,000 <span className="text-xs font-normal">FCFA</span></div>
              </div>
              <Button onClick={() => onNavigate('wallet')} variant="ghost" className="p-0 h-auto text-[10px] uppercase font-black text-green-700 tracking-widest text-left hover:underline">Approvisionner le compte</Button>
           </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-12 mb-10 border-b border-slate-200">
           {[
             { id: 'overview', label: 'Plan détaillé' },
             { id: 'active', label: 'Suivi des campagnes' },
             { id: 'history', label: 'Aperçu effectués' }
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setTab(t.id as any)}
               className={`pb-5 px-4 text-[11px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'text-green-700 border-b-4 border-green-700' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t.label}
             </button>
           ))}
        </div>

        {tab === 'overview' && (
           <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                       <h3 className="font-black text-slate-900 mb-10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Activity size={24} className="text-green-600" />
                            <span>Indice des Prix (Dakar)</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Piment & Concombre</span>
                       </h3>
                       <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={MARKET_DATA}>
                                <defs>
                                   <linearGradient id="colorPiment" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="mois" axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#94a3b8'}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="piment" stroke="#16a34a" strokeWidth={4} fill="url(#colorPiment)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
                    <h4 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-widest">Allocation Actuelle</h4>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        <ResponsiveContainer width="100%" height={260}>
                           <PieChart>
                              <Pie data={[{v:80},{v:20}]} innerRadius={70} outerRadius={100} dataKey="v" paddingAngle={10}>
                                 <Cell fill="#15803d" stroke="none" />
                                 <Cell fill="#facc15" stroke="none" />
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-3xl font-black text-slate-800">2</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filières</span>
                        </div>
                    </div>
                    <div className="space-y-5 mt-10">
                       <div className="flex items-center justify-between text-xs font-black">
                          <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-700"></div> Maraîchage</div>
                          <span className="text-slate-400 tracking-widest">80%</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-black">
                          <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Aviculture</div>
                          <span className="text-slate-400 tracking-widest">20%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {tab === 'active' && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900">Projets en cours de culture</h3>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Suivi Satellitaire</span>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-white border-b border-slate-50">
                          <tr>
                             <th className="px-10 py-6">Exploitation</th>
                             <th className="px-10 py-6">Progression cycle</th>
                             <th className="px-10 py-6">ROI Attendu</th>
                             <th className="px-10 py-6">Date de Payout</th>
                             <th className="px-10 py-6 text-right">Rapport</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {investments.filter(i => i.status === 'Actif').map((inv, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-10 py-8">
                                   <p className="text-sm font-black text-slate-900">{inv.projectName}</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Engagé: {inv.amount.toLocaleString()} FCFA</p>
                                </td>
                                <td className="px-10 py-8">
                                   <div className="w-48">
                                      <div className="flex justify-between text-[9px] font-black mb-2 uppercase tracking-widest text-slate-400">
                                         <span>Phase: Floraison</span>
                                         <span>65%</span>
                                      </div>
                                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-green-600 rounded-full w-[65%] shadow-sm"></div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-black">+{inv.expectedROI}%</span>
                                </td>
                                <td className="px-10 py-8 font-black text-sm text-slate-800">{inv.payoutDate}</td>
                                <td className="px-10 py-8 text-right">
                                   <button className="text-[10px] font-black uppercase text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl transition-all">Consulter</button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {tab === 'history' && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-black text-slate-900">Historique des Payouts Effectués</h3>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><History size={20} /></div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                          <tr>
                             <th className="px-10 py-6">Campagne</th>
                             <th className="px-10 py-6">Capital Initial</th>
                             <th className="px-10 py-6">ROI Réalisé</th>
                             <th className="px-10 py-6">Total Versé sur Solde</th>
                             <th className="px-10 py-6 text-right">Clôture</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {investments.filter(i => i.status === 'Clôturé').map((inv, idx) => {
                             const roiAmount = (inv.amount * inv.expectedROI / 100);
                             const totalPayout = inv.amount + roiAmount;
                             return (
                               <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-10 py-8 font-black text-slate-900 text-sm">{inv.projectName}</td>
                                  <td className="px-10 py-8 font-bold text-slate-500">{inv.amount.toLocaleString()} FCFA</td>
                                  <td className="px-10 py-8">
                                     <span className="text-green-700 font-black">+{roiAmount.toLocaleString()} <span className="text-[8px] uppercase">FCFA</span></span>
                                  </td>
                                  <td className="px-10 py-8 font-black text-slate-900 text-sm bg-green-50/30">
                                     <div className="flex items-center gap-2">
                                        {totalPayout.toLocaleString()} <span className="text-[10px] font-bold">FCFA</span>
                                        <CheckCircle2 size={14} className="text-green-600" />
                                     </div>
                                  </td>
                                  <td className="px-10 py-8 text-right text-slate-400 text-[10px] font-black uppercase tracking-widest">{inv.payoutDate}</td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'explore' | 'kyc' | 'wallet'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investments, setInvestments] = useState<InvestmentRecord[]>(MOCK_INVESTMENTS);

  const handleLogin = () => {
    // Demo user
    // Current Balance = 595,000 (from closed inv-past-1) + 150,000 (initial) - 250,000 (inv-active-1)
    // Simplified:
    setCurrentUser({
       id: 'user1',
       name: "Mohamed Diongue",
       email: "mohamed@bayseddo.sn",
       role: 'investor',
       isVerified: false,
       balance: 495000, 
       investedCapital: 250000 
    });
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const openInvestment = (project: Project) => {
    if (!currentUser) { setAuthModalOpen(true); return; }
    setSelectedProject(project);
    setInvestmentModalOpen(true);
  };

  const finalizeInvestment = (amount: number) => {
    if (!currentUser || !selectedProject) return;
    
    const newInv: InvestmentRecord = {
      id: `inv_${Date.now()}`,
      projectId: selectedProject.id,
      projectName: selectedProject.title,
      amount: amount,
      expectedROI: selectedProject.roi,
      date: 'Aujourd\'hui',
      status: 'Actif',
      payoutDate: `Dans ${selectedProject.duration} mois`
    };
    
    setInvestments(prev => [...prev, newInv]);
    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - amount,
      investedCapital: currentUser.investedCapital + amount
    });
    setInvestmentModalOpen(false);
  };

  const handleDeposit = (amount: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance + amount
    });
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 selection:text-green-900 scroll-smooth">
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-24 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-green-700 p-2.5 rounded-2xl text-white shadow-lg shadow-green-900/20"><Sprout size={28} /></div>
            <span className="font-black text-3xl text-gray-900 tracking-tighter">Bay<span className="text-green-700">Seddo</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-12">
            <button onClick={() => setCurrentView('explore')} className={`text-xs font-black uppercase tracking-widest transition-all ${currentView === 'explore' ? 'text-green-700' : 'text-slate-500 hover:text-green-700'}`}>Opportunités</button>
            <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-green-700">Notre Impact</button>
            {currentUser ? (
               <div className="flex items-center gap-6 pl-6 border-l border-slate-100">
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Solde Liquide</p>
                     <p className="text-sm font-black text-green-700 leading-none">{currentUser.balance.toLocaleString()} FCFA</p>
                  </div>
                  <button onClick={() => setCurrentView('dashboard')} className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 font-black border border-green-100 hover:bg-white transition-all shadow-sm">
                     {currentUser.name.charAt(0)}
                  </button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-red-500 p-2"><LogOut size={20} /></Button>
               </div>
            ) : (
               <div className="flex gap-4">
                  <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest" onClick={() => setAuthModalOpen(true)}>Connexion</Button>
                  <Button className="rounded-2xl px-10 font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-green-900/20" onClick={() => setAuthModalOpen(true)}>Ouvrir un compte</Button>
               </div>
            )}
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'home' && (
           <>
            <section className="relative pt-32 pb-20 lg:pt-64 lg:pb-48 overflow-hidden">
               <div className="absolute inset-0 z-0 scale-105">
                  <img src="https://images.unsplash.com/photo-1590483734731-5079822a9451?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/60 to-black/30"></div>
               </div>
               <div className="relative z-10 max-w-7xl mx-auto px-4 text-center lg:text-left">
                  <div className="lg:w-2/3">
                     <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-green-100 text-[10px] font-black uppercase tracking-widest mb-12 backdrop-blur-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 mr-3 animate-pulse"></span>
                        Rejoignez notre equipe d'investisseurs locaux
                     </div>
                     <h1 className="text-7xl lg:text-[120px] font-black text-white tracking-[calc(-0.04em)] mb-12 leading-[0.82]">
                        La terre ne <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-green-500">trahit jamais.</span>
                     </h1>
                     <p className="text-2xl text-green-50/80 mb-16 leading-relaxed max-w-2xl font-medium">
                        Investissez dans des projets a forte valeur.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                        <Button size="lg" className="rounded-2xl shadow-[0_20px_50px_rgba(22,101,52,0.4)] px-14 uppercase text-xs tracking-widest font-black" onClick={() => setCurrentView('explore')}>Explorer les Campagnes <ArrowRight className="ml-3" size={24}/></Button>
                        <Button variant="outline" size="lg" className="rounded-2xl border-white/40 text-white hover:bg-white hover:text-green-950 px-14 uppercase text-xs tracking-widest font-black backdrop-blur-sm">En savoir plus</Button>
                     </div>
                  </div>
               </div>
            </section>
            
            <section className="py-32 bg-white">
               <div className="max-w-7xl mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                     <div className="max-w-2xl">
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-6">Campagnes Vedettes</h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">Découvrez nos exploitations phares : les concombres premium de Bambilor et les piments export de Mboro.</p>
                     </div>
                     <Button variant="ghost" className="hidden md:flex items-center gap-2 font-black text-[11px] uppercase tracking-widest text-green-700" onClick={() => setCurrentView('explore')}>Voir toutes les opportunités <ChevronRight size={16}/></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                     {MOCK_PROJECTS.map(p => <ProjectCard key={p.id} project={p} onInvest={openInvestment} />)}
                  </div>
               </div>
            </section>
           </>
        )}

        {currentView === 'explore' && (
           <div className="pt-40 pb-32 bg-slate-50 min-h-screen">
              <div className="max-w-7xl mx-auto px-4">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                    <div>
                       <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Opportunités</h1>
                       <p className="text-slate-500 font-medium text-xl mt-3">Financement participatif pour une souveraineté alimentaire.</p>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                       {['Tous', 'Maraîchage', 'Aviculture', 'Bétail'].map(c => (
                         <button key={c} className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-white border border-slate-100 hover:border-green-600 hover:shadow-lg transition-all shadow-sm">
                            {c}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {MOCK_PROJECTS.map(p => <ProjectCard key={p.id} project={p} onInvest={openInvestment} />)}
                 </div>
              </div>
           </div>
        )}

        {currentView === 'dashboard' && currentUser && (
           <DashboardView 
             user={currentUser} 
             investments={investments} 
             onNavigate={setCurrentView}
           />
        )}

        {currentView === 'kyc' && (
           <IdentityVerification onComplete={() => {
              if (currentUser) setCurrentUser({...currentUser, isVerified: true});
              setCurrentView('dashboard');
           }} />
        )}

        {currentView === 'wallet' && currentUser && (
           <DepositView 
             balance={currentUser.balance} 
             onDeposit={handleDeposit} 
             onBack={() => setCurrentView('dashboard')} 
           />
        )}
      </main>

      <footer className="bg-slate-950 text-slate-500 py-40 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-24">
             <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center gap-3 mb-12 text-white"><Sprout size={48} className="text-green-500" /><span className="font-black text-5xl tracking-tighter">Bay Seddo</span></div>
                 <p className="text-xl leading-relaxed max-w-md text-slate-400">Pionnier du financement agricole participatif au Sénégal. Bâtissons ensemble une agriculture forte et rentable.</p>
             </div>
             <div>
                 <h4 className="text-white font-black mb-12 uppercase tracking-widest text-xs">Navigation</h4>
                 <ul className="space-y-6 text-sm font-bold">
                    <li><button onClick={() => setCurrentView('explore')} className="hover:text-green-500 transition-colors">Explorer</button></li>
                    <li><button className="hover:text-green-500 transition-colors">Notre Impact</button></li>
                    <li><button className="hover:text-green-500 transition-colors">Support & Aide</button></li>
                 </ul>
             </div>
             <div>
                 <h4 className="text-white font-black mb-12 uppercase tracking-widest text-xs">Contact</h4>
                 <ul className="space-y-6 text-sm">
                    <li>Dakar Plateau, Sénégal</li>
                    <li>contact@bayseddo.sn</li>
                    <li className="font-black text-white text-lg">+221 33 800 00 00</li>
                 </ul>
             </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 mt-32 pt-12 border-t border-white/5 text-center text-[11px] uppercase tracking-widest font-black text-slate-600">© 2025 Bay Seddo - Finance Agricole Durable</div>
      </footer>

      {/* MODALS */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onLoginSuccess={handleLogin} />
      {selectedProject && (
         <InvestmentModal 
           project={selectedProject} 
           isOpen={investmentModalOpen} 
           onClose={() => setInvestmentModalOpen(false)} 
           userBalance={currentUser?.balance || 0}
           onFinalize={finalizeInvestment}
         />
      )}
      <AIChat />
    </div>
  );
};

// --- AUTH MODAL ---
const AuthModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[50px] w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 z-10 p-3 bg-slate-50 rounded-full transition-all"><X size={24}/></button>
        <div className="p-16">
           <div className="text-center mb-12">
              <div className="w-24 h-24 bg-green-50 text-green-700 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner border border-green-100">
                 <User size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Connexion</h2>
              <p className="text-slate-400 font-medium mt-3">Gérez vos actifs agricoles en un clic.</p>
           </div>
           <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }}>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                 <input type="email" required className="w-full px-8 py-6 bg-slate-50 rounded-3xl border-none outline-none ring-1 ring-slate-100 focus:ring-4 focus:ring-green-600/10 transition-all font-bold" placeholder="mohamed@bayseddo.sn" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mot de passe</label>
                 <input type="password" required className="w-full px-8 py-6 bg-slate-50 rounded-3xl border-none outline-none ring-1 ring-slate-100 focus:ring-4 focus:ring-green-600/10 transition-all font-bold" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full py-7 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-green-900/20">Accéder au Portail</Button>
           </form>
        </div>
      </div>
    </div>
  );
};

// --- INVESTMENT MODAL ---
const InvestmentModal = ({ project, isOpen, onClose, userBalance, onFinalize }: { 
  project: Project, 
  isOpen: boolean, 
  onClose: () => void, 
  userBalance: number,
  onFinalize: (amount: number) => void
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(250000);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  useEffect(() => {
    if (isOpen) {
       setStep(1);
       setLoadingAi(true);
       analyzeProjectRisks(project).then(res => { setAiAnalysis(res); setLoadingAi(false); });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[60px] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl relative border border-slate-100">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 z-30 p-3 bg-white/90 rounded-full shadow-lg backdrop-blur-sm"><X size={24}/></button>
        
        {step === 1 && (
           <div className="flex flex-col">
              <div className="h-96 relative">
                 <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                 <div className="absolute bottom-16 left-16 right-16">
                    <span className="bg-green-600 text-[10px] font-black uppercase text-white px-6 py-2.5 rounded-full tracking-widest mb-8 inline-block shadow-2xl">{project.category}</span>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">{project.title}</h2>
                    <div className="flex items-center gap-3 text-green-300 font-bold text-sm uppercase tracking-widest"><MapPin size={18}/> {project.location}</div>
                 </div>
              </div>
              <div className="p-16 space-y-12">
                 <div className="bg-emerald-50 border-2 border-emerald-100 p-10 rounded-[40px] relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 p-4 opacity-5 rotate-12"><Sprout size={280}/></div>
                    <div className="flex gap-8 items-start relative z-10">
                       <div className="bg-green-700 p-4 rounded-2xl text-white shadow-2xl"><Bot size={32}/></div>
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-green-800 mb-4">Conseiller Bay Seddo</h4>
                          {loadingAi ? <div className="h-5 bg-green-200 rounded w-3/4 animate-pulse"></div> : <p className="text-sm font-bold text-green-950 leading-relaxed italic">"{aiAnalysis}"</p>}
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-10">
                    <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rentabilité Contractuelle</p>
                       <p className="text-5xl font-black text-green-700">+{project.roi}%</p>
                    </div>
                    <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 transition-all hover:bg-white hover:shadow-xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cycle de Culture</p>
                       <p className="text-5xl font-black text-slate-950">{project.duration}m</p>
                    </div>
                 </div>
                 <Button onClick={() => setStep(2)} className="w-full py-8 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-900/20 active:scale-[0.98] transition-transform">Initier l'investissement</Button>
              </div>
           </div>
        )}

        {step === 2 && (
           <div className="p-20 animate-in slide-in-from-right-10 duration-500">
              <h2 className="text-5xl font-black text-slate-900 mb-16 text-center tracking-tighter">Montant de votre part</h2>
              <div className="space-y-16">
                 <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-8">Investissement (FCFA)</span>
                    <div className="flex items-center justify-center gap-4">
                       <input 
                         type="number" 
                         value={amount} 
                         onChange={(e) => setAmount(Number(e.target.value))}
                         className="text-8xl font-black text-center text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-full tracking-tighter"
                       />
                    </div>
                    <div className="flex gap-4 justify-center mt-12 flex-wrap">
                       {[100000, 250000, 500000, 1000000].map(v => (
                          <button key={v} onClick={() => setAmount(v)} className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 hover:text-white hover:shadow-xl transition-all">{v.toLocaleString()}</button>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-50 p-12 rounded-[50px] border border-slate-100 space-y-8">
                    <div className="flex justify-between items-center font-bold text-slate-400 text-sm">
                       <span className="uppercase tracking-widest text-[10px]">Solde Disponible</span>
                       <span className="text-slate-900">{userBalance.toLocaleString()} FCFA</span>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Payout Estimé (Fin de cycle)</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">(Capital + {project.roi}% ROI)</p>
                       </div>
                       <span className="text-4xl font-black text-green-700">+{(amount + (amount * project.roi / 100)).toLocaleString()} FCFA</span>
                    </div>
                 </div>

                 <div className="flex gap-6 pt-8">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-7 rounded-[32px] font-black uppercase tracking-widest text-xs">Annuler</Button>
                    <Button onClick={() => setStep(3)} disabled={amount > userBalance} className="flex-1 py-7 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-900/20 active:scale-[0.98]">Confirmer l'ordre</Button>
                 </div>
                 {amount > userBalance && (
                   <div className="flex items-center justify-center gap-3 text-red-600 font-black text-[11px] uppercase tracking-widest animate-pulse">
                      <AlertCircle size={18} /> Solde insuffisant pour cette opération
                   </div>
                 )}
              </div>
           </div>
        )}

        {step === 3 && (
           <div className="p-32 text-center space-y-12 animate-in zoom-in duration-700">
              <div className="w-40 h-40 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-inner ring-[20px] ring-green-50"><CheckCircle2 size={100} /></div>
              <div>
                 <h2 className="text-6xl font-black text-slate-900 tracking-tighter">C'est fait !</h2>
                 <p className="text-slate-500 mt-8 text-2xl font-medium leading-relaxed">Votre participation au projet **{project.title}** est validée. Vous faites désormais partie de l'aventure agricole.</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 inline-block shadow-sm">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Libération prévue du solde final</p>
                 <p className="text-3xl font-black text-slate-900">À la récolte</p>
              </div>
              <Button onClick={() => onFinalize(amount)} className="w-full py-8 rounded-[32px] font-black text-lg uppercase tracking-widest shadow-2xl shadow-green-900/10">Retour au Tableau de bord</Button>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
