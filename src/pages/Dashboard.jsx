import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  CreditCard, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useAppStore } from '../store/useAppStore';

const spendData = [
  { name: 'Jan', spend: 4000 },
  { name: 'Feb', spend: 3000 },
  { name: 'Mar', spend: 2000 },
  { name: 'Apr', spend: 2780 },
  { name: 'May', spend: 1890 },
  { name: 'Jun', spend: 2390 },
  { name: 'Jul', spend: 3490 },
];

const vendorData = [
  { name: 'IT Services', count: 45 },
  { name: 'Logistics', count: 32 },
  { name: 'Office Supplies', count: 28 },
  { name: 'Consulting', count: 15 },
];

const SEED_ALERTS = [
  { vendor: 'TechNova Solutions', issue: 'SLA Breach (Uptime < 99%)', level: 'high' },
  { vendor: 'SwiftLog Freight', issue: 'Contract expiring in 15 days', level: 'medium' },
  { vendor: 'MedEquip Global', issue: 'Pending compliance review', level: 'low' },
];

const SEED_ACTIVITIES = [
  { title: 'New PO Created', desc: 'PO-2024-089 for BuildCore Supplies ($12k)', time: '2 hours ago' },
  { title: 'Invoice Approved', desc: 'INV-445 by TechNova Solutions ($4.5k)', time: '5 hours ago' },
  { title: 'Vendor Onboarded', desc: 'GreenLeaf Wholesale marked as Active', time: '1 day ago' },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-5 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} className="text-cyan-500" />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-50 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/50">
        <Icon size={20} className="text-cyan-400" />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
        {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        {change}
      </span>
      <span className="text-slate-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { searchQuery } = useAppStore();

  const filteredAlerts = SEED_ALERTS.filter(alert => 
    alert.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
    alert.issue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = SEED_ACTIVITIES.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    act.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Active Vendors" value="124" change="12%" isPositive={true} icon={Users} delay={0.1} />
        <StatCard title="Active Contracts" value="86" change="4.3%" isPositive={true} icon={FileText} delay={0.2} />
        <StatCard title="Procurement Spend" value="$2.4M" change="2.1%" isPositive={false} icon={CreditCard} delay={0.3} />
        <StatCard title="Pending Approvals" value="18" change="5" isPositive={false} icon={Clock} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card p-4 sm:p-6 lg:col-span-2"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-50">Procurement Spend Analytics</h3>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block px-3 py-1.5 w-full sm:w-auto">
              <option>Last 6 months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="glass-card p-4 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-slate-50 mb-6">Vendors by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Action / Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-50 flex items-center">
              <AlertTriangle className="text-amber-400 mr-2" size={20} />
              Risk & Compliance Alerts
            </h3>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
          </div>
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, i) => (
              <div key={i} className="flex items-start p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className={`w-2 h-2 mt-2 rounded-full mr-3 shrink-0 ${
                  alert.level === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                  alert.level === 'medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-cyan-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-200">{alert.vendor}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{alert.issue}</p>
                </div>
              </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No alerts found matching "{searchQuery}"
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-50 flex items-center">
              <TrendingUp className="text-emerald-400 mr-2" size={20} />
              Recent Activities
            </h3>
          </div>
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((act, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-500 before:rounded-full after:absolute after:left-[2.5px] after:top-4 after:w-0.5 after:h-full after:bg-slate-800 last:after:hidden">
                  <p className="text-sm font-medium text-slate-200">{act.title}</p>
                  <p className="text-xs text-slate-400">{act.desc}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{act.time}</span>
              </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No activities found matching "{searchQuery}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
