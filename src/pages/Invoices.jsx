import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, DollarSign, Upload, FileUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

const SEED_INVOICES = [
  { id: 'INV-4029', vendor: 'TechNova Solutions', amount: '$12,000', date: 'Oct 25, 2024', status: 'Paid' },
  { id: 'INV-4030', vendor: 'BuildCore Supplies', amount: '$4,500', date: 'Oct 28, 2024', status: 'Pending' },
  { id: 'INV-4035', vendor: 'SwiftLog Freight', amount: '$3,200', date: 'Nov 02, 2024', status: 'Approved' },
];

const Invoices = () => {
  const { searchQuery } = useAppStore();
  const [invoices, setInvoices] = useState(SEED_INVOICES);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState({ vendor: '', amount: '' });

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const invoiceToAdd = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      vendor: newInvoice.vendor || 'Unknown Vendor',
      amount: newInvoice.amount ? `$${parseFloat(newInvoice.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}` : '$0.00',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
    };
    setInvoices([invoiceToAdd, ...invoices]);
    setNewInvoice({ vendor: '', amount: '' });
    setIsUploadOpen(false);
  };
  
  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-2xl font-bold text-slate-50">Invoices & Payments</h2>
          <p className="text-slate-400 text-sm mt-1">Track financial transactions and approvals</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="btn-primary flex items-center shrink-0 w-full sm:w-auto justify-center">
          <Upload size={16} className="mr-2" />
          Upload Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Paid (MTD)</p>
              <h3 className="text-2xl font-bold text-slate-50">$145,200</h3>
            </div>
            <DollarSign className="text-emerald-500" size={32} />
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Pending Approval</p>
              <h3 className="text-2xl font-bold text-slate-50">$32,400</h3>
            </div>
            <FileText className="text-amber-500" size={32} />
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Approved, Unpaid</p>
              <h3 className="text-2xl font-bold text-slate-50">$18,500</h3>
            </div>
            <CheckCircle2 className="text-cyan-500" size={32} />
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30">
                  <td className="p-4 font-mono text-sm text-cyan-400">{inv.id}</td>
                  <td className="p-4 text-sm text-slate-200">{inv.vendor}</td>
                  <td className="p-4 text-sm font-medium text-slate-50">{inv.amount}</td>
                  <td className="p-4 text-sm text-slate-400">{inv.date}</td>
                  <td className="p-4">
                    <span className={`badge-success ${
                      inv.status === 'Paid' ? 'badge-success' : 
                      inv.status === 'Pending' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No invoices found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Vendor Invoice">
        <form className="space-y-4" onSubmit={handleAddInvoice}>
          <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-cyan-500/50 transition-colors">
            <div className="p-4 bg-slate-800 rounded-full mb-3 text-cyan-400">
              <FileUp size={32} />
            </div>
            <p className="text-sm font-medium text-slate-200">Drag & drop your invoice file here</p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG (Max 10MB)</p>
            <button type="button" className="btn-secondary text-xs py-1.5 mt-4">Browse Files</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Vendor</label>
              <select className="input-field" required value={newInvoice.vendor} onChange={(e) => setNewInvoice({...newInvoice, vendor: e.target.value})}>
                <option value="">Auto-detect from document...</option>
                <option>TechNova Solutions</option>
                <option>BuildCore Supplies</option>
                <option>SwiftLog Freight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">PO Reference (Optional)</label>
              <input type="text" className="input-field" placeholder="e.g. PO-2024-011" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Invoice Amount</label>
              <input type="number" step="0.01" className="input-field" placeholder="$ 0.00" required value={newInvoice.amount} onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50 mt-4">
            <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Invoice</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Invoices;
