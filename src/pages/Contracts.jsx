import { motion } from 'framer-motion';
import { FileSignature, Calendar, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SEED_CONTRACTS = [
  { id: 1, title: 'Annual Maintenance Agreement 2024', vendor: 'TechNova Solutions', amount: '$120,000', expires: 'Dec 31, 2024', status: 'Active' },
  { id: 2, title: 'Logistics Partner 2024', vendor: 'SwiftLog Freight', amount: '$45,000', expires: 'Nov 15, 2024', status: 'Active' },
  { id: 3, title: 'Office Supplies Q4', vendor: 'BuildCore Supplies', amount: '$12,500', expires: 'Oct 31, 2024', status: 'Active' },
];

const Contracts = () => {
  const { searchQuery } = useAppStore();
  
  const filteredContracts = SEED_CONTRACTS.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Contract Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage agreements and track SLA renewals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-4 sm:p-6 col-span-2">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Active Contracts</h3>
          <div className="space-y-4">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((c) => (
              <div key={c.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg mr-4">
                    <FileSignature size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">{c.title}</h4>
                    <p className="text-sm text-slate-400">{c.vendor} • {c.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-sm text-slate-300 mb-1">
                    <Calendar size={14} className="mr-1 text-slate-400" />
                    Expires {c.expires}
                  </div>
                  <span className="badge-success">{c.status}</span>
                </div>
              </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                No contracts found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
            <AlertCircle className="text-rose-400 mr-2" size={20} />
            Action Required
          </h3>
          <div className="space-y-4">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <h4 className="font-medium text-rose-300 text-sm">Expiring Soon</h4>
              <p className="text-slate-300 text-sm mt-1">SwiftLog Freight Logistics Partner 2023</p>
              <button className="mt-3 text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded hover:bg-rose-500/30">Renew Contract</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contracts;
