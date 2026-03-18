
import React from 'react';
import { Project } from '../types';
import { MapPin, TrendingUp, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Button } from './Button';

interface ProjectCardProps {
  project: Project;
  onInvest: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInvest }) => {
  const percent = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

  return (
    <div className="group bg-white rounded-[40px] shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(22,101,52,0.12)] hover:-translate-y-2 transition-all duration-700 border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-green-800 uppercase tracking-widest shadow-sm">
          {project.category}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-widest mb-2">
             <MapPin size={12} className="mr-1.5 text-green-400" />
             {project.location}
           </div>
           <h3 className="text-2xl font-black text-white leading-tight mb-2">{project.title}</h3>
        </div>
        <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
           <ArrowUpRight size={20} />
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 transition-colors group-hover:bg-green-50/50">
                <div className="flex items-center text-green-700 text-[10px] font-black uppercase tracking-widest mb-1.5">
                    <TrendingUp size={12} className="mr-1.5"/> ROI
                </div>
                <span className="font-black text-xl text-slate-900">+{project.roi}%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                    <Clock size={12} className="mr-1.5"/> Durée
                </div>
                <span className="font-black text-xl text-slate-900">{project.duration}m</span>
            </div>
        </div>

        <div className="mt-auto space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2.5">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collecté</span>
                  <span className="text-xl font-black text-green-700">{project.raisedAmount.toLocaleString()} <span className="text-xs font-bold">FCFA</span></span>
               </div>
               <span className="text-slate-900 font-black text-sm">{percent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5">
               <div 
                 className="bg-green-600 h-2.5 rounded-full transition-all duration-[2s] shadow-[0_0_12px_rgba(22,101,52,0.3)]" 
                 style={{ width: `${percent}%` }}
               ></div>
            </div>
          </div>

          <Button onClick={() => onInvest(project)} className="w-full font-black rounded-2xl py-5 shadow-xl shadow-green-900/10 active:scale-95 transition-all text-sm uppercase tracking-widest">
            Investir dans ce projet
          </Button>
        </div>
      </div>
    </div>
  );
};
