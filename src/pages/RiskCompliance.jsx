import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, FileSearch, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SEED_AUDITS = [
  { vendor: 'MedEquip Global', type: 'ISO 27001 Security Audit', status: 'Failed', date: 'Oct 29, 2024' },
  { vendor: 'TechNova Solutions', type: 'Financial Risk Assessment', status: 'Passed', date: 'Oct 25, 2024' },
  { vendor: 'BuildCore Supplies', type: 'Environmental Compliance', status: 'Passed', date: 'Oct 20, 2024' },
  { vendor: 'SwiftLog Freight', type: 'Data Privacy Assessment', status: 'Pending', date: 'Oct 15, 2024' },
];

const RiskCompliance = () => {
  const { searchQuery } = useAppStore();
  
  const filteredAudits = SEED_AUDITS.filter(audit => 
    audit.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
    audit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-50">Risk & Compliance</h2>
        <p className="text-slate-400 text-sm mt-1">Monitor vendor risk scores and compliance audits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center mb-4">
            <ShieldCheck size={24} className="text-emerald-500 mr-3" />
            <h3 className="text-lg font-semibold text-slate-50">Compliant</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50 mb-1">86</p>
          <p className="text-sm text-slate-400">Vendors passing all checks</p>
        </div>

        <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center mb-4">
            <Shield size={24} className="text-amber-500 mr-3" />
            <h3 className="text-lg font-semibold text-slate-50">Under Review</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50 mb-1">12</p>
          <p className="text-sm text-slate-400">Pending audit results</p>
        </div>

        <div className="glass-card p-6 bg-rose-500/5 border-rose-500/20">
          <div className="flex items-center mb-4">
            <ShieldAlert size={24} className="text-rose-500 mr-3" />
            <h3 className="text-lg font-semibold text-slate-50">High Risk</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50 mb-1">4</p>
          <p className="text-sm text-slate-400">Requires immediate action</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-slate-50 mb-6 flex items-center">
          <FileSearch className="mr-2 text-cyan-400" size={20} />
          Recent Compliance Audits
        </h3>
        <div className="space-y-3">
          {filteredAudits.length > 0 ? (
            filteredAudits.map((audit, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium text-slate-200">{audit.type}</h4>
                <p className="text-sm text-slate-400">Vendor: <span className="text-slate-300">{audit.vendor}</span></p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">{audit.date}</span>
                <span className={`w-24 text-center ${
                  audit.status === 'Passed' ? 'badge-success' : 
                  audit.status === 'Pending' ? 'badge-warning' : 'badge-error'
                }`}>
                  {audit.status}
                </span>
                <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300">View Report</button>
              </div>
            </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 border border-slate-700/50 rounded-xl bg-slate-900/20">
              No compliance audits found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RiskCompliance;
