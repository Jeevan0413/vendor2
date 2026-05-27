import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, DollarSign, Upload, FileUp, Eye, Edit2, Trash2, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

const SEED_INVOICES = [
  { id: 'INV-4029', vendor: 'TechNova Solutions', amount: '$12,000', date: 'Oct 25, 2024', dueDate: 'Nov 10, 2024', poRef: 'PO-2024-014', status: 'Paid', notes: 'Server rack upgrade invoice.' },
  { id: 'INV-4030', vendor: 'BuildCore Supplies', amount: '$4,500', date: 'Oct 28, 2024', dueDate: 'Nov 15, 2024', poRef: 'PO-2024-012', status: 'Pending', notes: 'Office chairs batch.' },
  { id: 'INV-4035', vendor: 'SwiftLog Freight', amount: '$3,200', date: 'Nov 02, 2024', dueDate: 'Nov 20, 2024', poRef: 'PO-2024-013', status: 'Approved', notes: 'Q4 logistics delivery batch.' },
];

const statusStyle = {
  Paid:     { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Paid' },
  Approved: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',         label: 'Approved' },
  Pending:  { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',       label: 'Pending' },
  Rejected: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',          label: 'Rejected' },
};

const Invoices = () => {
  const { searchQuery } = useAppStore();
  const [invoices, setInvoices] = useState(SEED_INVOICES);
  const [isUploadOpen, setIsUploadOpen]   = useState(false);
  const [isViewOpen,   setIsViewOpen]     = useState(false);
  const [isEditOpen,   setIsEditOpen]     = useState(false);
  const [selected,     setSelected]       = useState(null);
  const [editInvoice,  setEditInvoice]    = useState(null);
  const [newInvoice,   setNewInvoice]     = useState({ vendor: '', amount: '', poRef: '', dueDate: '', notes: '' });

  /* ── helpers ── */
  const openView = (inv) => { setSelected(inv); setIsViewOpen(true); };
  const openEdit = (inv) => { setEditInvoice({ ...inv }); setIsViewOpen(false); setIsEditOpen(true); };

  const handleDelete = (id) => {
    if (window.confirm('Delete this invoice?')) {
      setInvoices(invoices.filter(i => i.id !== id));
      setIsViewOpen(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: newStatus } : i));
    setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const inv = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      vendor: newInvoice.vendor || 'Unknown Vendor',
      amount: newInvoice.amount ? `$${parseFloat(newInvoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$0.00',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: newInvoice.dueDate || 'TBD',
      poRef: newInvoice.poRef || '—',
      status: 'Pending',
      notes: newInvoice.notes || '',
    };
    setInvoices([inv, ...invoices]);
    setNewInvoice({ vendor: '', amount: '', poRef: '', dueDate: '', notes: '' });
    setIsUploadOpen(false);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setInvoices(invoices.map(i => i.id === editInvoice.id ? editInvoice : i));
    setIsEditOpen(false);
    setEditInvoice(null);
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Invoices &amp; Payments</h2>
          <p className="text-slate-400 text-sm mt-1">Track financial transactions and approvals</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="btn-primary flex items-center shrink-0 w-full sm:w-auto justify-center">
          <Upload size={16} className="mr-2" /> Upload Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Total Paid (MTD)', value: '$145,200', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Pending Approval', value: '$32,400',  icon: FileText,   color: 'text-amber-500'  },
          { label: 'Approved, Unpaid', value: '$18,500',  icon: CheckCircle2, color: 'text-cyan-500'  },
        ].map((c, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm mb-1">{c.label}</p>
                <h3 className="text-2xl font-bold text-slate-50">{c.value}</h3>
              </div>
              <c.icon className={c.color} size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium hidden sm:table-cell">Due Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => {
                const s = statusStyle[inv.status] || statusStyle.Pending;
                return (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 font-mono text-sm text-cyan-400">{inv.id}</td>
                    <td className="p-4 text-sm text-slate-200">{inv.vendor}</td>
                    <td className="p-4 text-sm font-semibold text-slate-50">{inv.amount}</td>
                    <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">{inv.dueDate}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>{inv.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openView(inv)} className="btn-icon" title="View"><Eye size={15} /></button>
                        <button onClick={() => openEdit(inv)} className="btn-icon" title="Edit"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(inv.id)} className="btn-icon hover:text-rose-400" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No invoices found matching "{searchQuery}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Invoice Modal ── */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Invoice Details">
        {selected && (() => {
          const s = statusStyle[selected.status] || statusStyle.Pending;
          return (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-700/50 pb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 block mb-1">{selected.id}</span>
                  <h3 className="text-xl font-bold text-slate-50">{selected.vendor}</h3>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.badge}`}>{selected.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-500 text-xs mb-0.5">Amount</p><p className="text-slate-50 font-bold text-lg">{selected.amount}</p></div>
                <div><p className="text-slate-500 text-xs mb-0.5">PO Reference</p><p className="text-slate-200 font-mono">{selected.poRef}</p></div>
                <div><p className="text-slate-500 text-xs mb-0.5">Invoice Date</p><p className="text-slate-200">{selected.date}</p></div>
                <div><p className="text-slate-500 text-xs mb-0.5">Due Date</p><p className="text-slate-200">{selected.dueDate}</p></div>
              </div>

              {selected.notes && (
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-300">{selected.notes}</p>
                </div>
              )}

              {/* Quick status actions */}
              <div className="flex flex-wrap gap-2">
                {['Pending', 'Approved', 'Paid', 'Rejected'].filter(st => st !== selected.status).map(st => (
                  <button key={st} onClick={() => handleStatusChange(selected.id, st)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                    Mark as {st}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-700/50">
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-2 rounded-lg transition-colors">
                  <Trash2 size={15} /> Delete
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setIsViewOpen(false)} className="btn-secondary">Close</button>
                  <button onClick={() => openEdit(selected)} className="btn-primary flex items-center gap-2">
                    <Edit2 size={15} /> Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Edit Invoice Modal ── */}
      {editInvoice && (
        <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditInvoice(null); }} title="Edit Invoice">
          <form className="space-y-4" onSubmit={handleEditSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
                <select className="input-field" required value={editInvoice.vendor} onChange={(e) => setEditInvoice({ ...editInvoice, vendor: e.target.value })}>
                  <option>TechNova Solutions</option><option>BuildCore Supplies</option>
                  <option>SwiftLog Freight</option><option>MedEquip Global</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Amount ($) *</label>
                <input type="text" className="input-field" required value={editInvoice.amount} onChange={(e) => setEditInvoice({ ...editInvoice, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">PO Reference</label>
                <input type="text" className="input-field" placeholder="PO-2024-xxx" value={editInvoice.poRef} onChange={(e) => setEditInvoice({ ...editInvoice, poRef: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                <input type="text" className="input-field" placeholder="e.g. Nov 20, 2024" value={editInvoice.dueDate} onChange={(e) => setEditInvoice({ ...editInvoice, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select className="input-field" value={editInvoice.status} onChange={(e) => setEditInvoice({ ...editInvoice, status: e.target.value })}>
                  <option>Pending</option><option>Approved</option><option>Paid</option><option>Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea rows={3} className="input-field resize-none" value={editInvoice.notes} onChange={(e) => setEditInvoice({ ...editInvoice, notes: e.target.value })} />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50">
              <button type="button" onClick={() => { setIsEditOpen(false); setEditInvoice(null); }} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Upload Invoice Modal ── */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Vendor Invoice">
        <form className="space-y-4" onSubmit={handleAddInvoice}>
          <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-cyan-500/50 transition-colors">
            <div className="p-4 bg-slate-800 rounded-full mb-3 text-cyan-400"><FileUp size={32} /></div>
            <p className="text-sm font-medium text-slate-200">Drag &amp; drop your invoice file here</p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG (Max 10MB)</p>
            <button type="button" className="btn-secondary text-xs py-1.5 mt-4">Browse Files</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Vendor *</label>
              <select className="input-field" required value={newInvoice.vendor} onChange={(e) => setNewInvoice({ ...newInvoice, vendor: e.target.value })}>
                <option value="">Select vendor...</option>
                <option>TechNova Solutions</option><option>BuildCore Supplies</option>
                <option>SwiftLog Freight</option><option>MedEquip Global</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Invoice Amount *</label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" required value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">PO Reference</label>
              <input type="text" className="input-field" placeholder="PO-2024-xxx" value={newInvoice.poRef} onChange={(e) => setNewInvoice({ ...newInvoice, poRef: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
              <input type="text" className="input-field" placeholder="e.g. Nov 20, 2024" value={newInvoice.dueDate} onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
              <textarea rows={2} className="input-field resize-none" placeholder="Any additional notes..." value={newInvoice.notes} onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50">
            <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Invoice</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Invoices;
