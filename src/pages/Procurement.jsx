import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle2, Truck, Plus, Eye, Edit2, Trash2, X, Package, User, DollarSign, CalendarDays } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

const SEED_POS = [
  { id: 'PO-2024-011', item: 'Dell Laptops x15', vendor: 'TechNova Solutions', amount: '$18,500', date: 'Oct 11', deliveryDate: 'Nov 01', quantity: 15, unitPrice: '1233.33', status: 'Requested', notes: 'Urgent — for new employee onboarding batch.' },
  { id: 'PO-2024-012', item: 'Office Chairs x30', vendor: 'BuildCore Supplies', amount: '$4,200', date: 'Oct 12', deliveryDate: 'Oct 25', quantity: 30, unitPrice: '140.00', status: 'Approved', notes: 'Ergonomic chairs for the new floor.' },
  { id: 'PO-2024-013', item: 'Logistics Batch Q4', vendor: 'SwiftLog Freight', amount: '$12,000', date: 'Oct 13', deliveryDate: 'Nov 15', quantity: 1, unitPrice: '12000.00', status: 'In Transit', notes: 'Q4 freight batch for distribution centers.' },
  { id: 'PO-2024-014', item: 'Server Rack Upgrade', vendor: 'TechNova Solutions', amount: '$8,900', date: 'Oct 14', deliveryDate: 'Oct 28', quantity: 1, unitPrice: '8900.00', status: 'Delivered', notes: 'Datacenter expansion project phase 2.' },
];

const statusColors = {
  Requested: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  Approved:  { text: 'text-blue-400',  bg: 'bg-blue-400/10',  border: 'border-blue-400/30' },
  'In Transit': { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  Delivered: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
};

const Procurement = () => {
  const { searchQuery } = useAppStore();
  const [pos, setPos] = useState(SEED_POS);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isViewPOOpen, setIsViewPOOpen] = useState(false);
  const [isEditPOOpen, setIsEditPOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const [newPO, setNewPO] = useState({ vendor: '', item: '', quantity: '', unitPrice: '', deliveryDate: '', notes: '' });
  const [editPO, setEditPO] = useState(null);

  const handleAddPO = (e) => {
    e.preventDefault();
    const total = parseFloat(newPO.unitPrice || 0) * parseInt(newPO.quantity || 1);
    const poToAdd = {
      id: `PO-2024-${Math.floor(Math.random() * 900) + 100}`,
      item: newPO.item,
      vendor: newPO.vendor || 'Unknown Vendor',
      amount: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deliveryDate: newPO.deliveryDate || 'TBD',
      quantity: parseInt(newPO.quantity || 1),
      unitPrice: newPO.unitPrice || '0.00',
      status: 'Requested',
      notes: newPO.notes || '',
    };
    setPos([poToAdd, ...pos]);
    setNewPO({ vendor: '', item: '', quantity: '', unitPrice: '', deliveryDate: '', notes: '' });
    setIsAddPOOpen(false);
  };

  const handleEditPO = (e) => {
    e.preventDefault();
    const total = parseFloat(editPO.unitPrice || 0) * parseInt(editPO.quantity || 1);
    const updated = { ...editPO, amount: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}` };
    setPos(pos.map(p => p.id === updated.id ? updated : p));
    setIsEditPOOpen(false);
    setEditPO(null);
  };

  const handleDeletePO = (id) => {
    if (window.confirm('Are you sure you want to delete this Purchase Order?')) {
      setPos(pos.filter(p => p.id !== id));
      setIsViewPOOpen(false);
      setSelectedPO(null);
    }
  };

  const openViewPO = (po) => {
    setSelectedPO(po);
    setIsViewPOOpen(true);
  };

  const openEditFromView = () => {
    setEditPO({ ...selectedPO });
    setIsViewPOOpen(false);
    setIsEditPOOpen(true);
  };

  const filteredPOs = pos.filter(po =>
    po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.item.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-2xl font-bold text-slate-50">Procurement Operations</h2>
          <p className="text-slate-400 text-sm mt-1">Manage purchase orders and workflows</p>
        </div>
        <button onClick={() => setIsAddPOOpen(true)} className="btn-primary flex items-center shrink-0 w-full sm:w-auto justify-center">
          <Plus size={16} className="mr-2" />
          Create PO
        </button>
      </div>

      {/* Workflow Tracker (Kanban style) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { title: "Requested", icon: Clock, count: 5, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
          { title: "Approved", icon: CheckCircle2, count: 12, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { title: "In Transit", icon: Truck, count: 8, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
          { title: "Delivered", icon: ShoppingCart, count: 45, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
        ].map((col, i) => (
          <div key={i} className="glass-panel p-4 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700/50 pb-3">
              <div className="flex items-center">
                <div className={`p-1.5 rounded-lg ${col.bg} ${col.border} border mr-2`}>
                  <col.icon size={16} className={col.color} />
                </div>
                <h3 className="font-semibold text-slate-200">{col.title}</h3>
              </div>
              <span className="bg-slate-800 text-slate-300 text-xs py-1 px-2 rounded-full font-medium">{col.count}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredPOs.filter(po => po.status === col.title).map((card) => (
                <div
                  key={card.id}
                  onClick={() => openViewPO(card)}
                  className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm hover:shadow-cyan-500/10 hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-cyan-400">{card.id}</span>
                    <span className="text-xs text-slate-400">{card.date}</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1">{card.item}</h4>
                  <p className="text-xs text-slate-400 mb-3">{card.vendor}</p>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-50">{card.amount}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-slate-500">View details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PO Details Modal (View) */}
      <Modal isOpen={isViewPOOpen} onClose={() => setIsViewPOOpen(false)} title="Purchase Order Details">
        {selectedPO && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-700/50 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 block mb-1">{selectedPO.id}</span>
                <h3 className="text-xl font-bold text-slate-50">{selectedPO.item}</h3>
              </div>
              {(() => {
                const s = statusColors[selectedPO.status] || {};
                return (
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
                    {selectedPO.status}
                  </span>
                );
              })()}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0"><User size={14} className="text-cyan-400" /></div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Vendor</p>
                  <p className="text-slate-200 font-medium">{selectedPO.vendor}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0"><DollarSign size={14} className="text-emerald-400" /></div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Total Amount</p>
                  <p className="text-slate-200 font-semibold">{selectedPO.amount}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0"><Package size={14} className="text-purple-400" /></div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Quantity</p>
                  <p className="text-slate-200 font-medium">{selectedPO.quantity} units @ ${selectedPO.unitPrice} each</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0"><CalendarDays size={14} className="text-amber-400" /></div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Order Date</p>
                  <p className="text-slate-200 font-medium">{selectedPO.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 col-span-2">
                <div className="p-2 bg-slate-800 rounded-lg shrink-0"><CalendarDays size={14} className="text-rose-400" /></div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Expected Delivery</p>
                  <p className="text-slate-200 font-medium">{selectedPO.deliveryDate}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedPO.notes && (
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-300">{selectedPO.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-700/50">
              <button
                onClick={() => handleDeletePO(selectedPO.id)}
                className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={15} /> Delete PO
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsViewPOOpen(false)} className="btn-secondary">Close</button>
                <button onClick={openEditFromView} className="btn-primary flex items-center gap-2">
                  <Edit2 size={15} /> Edit PO
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit PO Modal */}
      {editPO && (
        <Modal isOpen={isEditPOOpen} onClose={() => { setIsEditPOOpen(false); setEditPO(null); }} title="Edit Purchase Order">
          <form className="space-y-4" onSubmit={handleEditPO}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
                <select className="input-field" required value={editPO.vendor} onChange={(e) => setEditPO({ ...editPO, vendor: e.target.value })}>
                  <option value="">Select Vendor...</option>
                  <option>TechNova Solutions</option>
                  <option>BuildCore Supplies</option>
                  <option>SwiftLog Freight</option>
                  <option>MedEquip Global</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Item Description *</label>
                <input type="text" className="input-field" required value={editPO.item} onChange={(e) => setEditPO({ ...editPO, item: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
                <input type="number" min="1" className="input-field" value={editPO.quantity} onChange={(e) => setEditPO({ ...editPO, quantity: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Unit Price ($)</label>
                <input type="number" min="0" step="0.01" className="input-field" value={editPO.unitPrice} onChange={(e) => setEditPO({ ...editPO, unitPrice: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select className="input-field" value={editPO.status} onChange={(e) => setEditPO({ ...editPO, status: e.target.value })}>
                  <option>Requested</option>
                  <option>Approved</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Expected Delivery</label>
                <input type="text" className="input-field" placeholder="e.g. Nov 15" value={editPO.deliveryDate} onChange={(e) => setEditPO({ ...editPO, deliveryDate: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea rows={3} className="input-field resize-none" value={editPO.notes} onChange={(e) => setEditPO({ ...editPO, notes: e.target.value })} />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50">
              <button type="button" onClick={() => { setIsEditPOOpen(false); setEditPO(null); }} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create PO Modal */}
      <Modal isOpen={isAddPOOpen} onClose={() => setIsAddPOOpen(false)} title="Create Purchase Order">
        <form className="space-y-4" onSubmit={handleAddPO}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
              <select className="input-field" required value={newPO.vendor} onChange={(e) => setNewPO({ ...newPO, vendor: e.target.value })}>
                <option value="">Select Vendor...</option>
                <option>TechNova Solutions</option>
                <option>BuildCore Supplies</option>
                <option>SwiftLog Freight</option>
                <option>MedEquip Global</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Item Description *</label>
              <input type="text" className="input-field" required placeholder="What are you purchasing?" value={newPO.item} onChange={(e) => setNewPO({ ...newPO, item: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
              <input type="number" min="1" className="input-field" placeholder="1" value={newPO.quantity} onChange={(e) => setNewPO({ ...newPO, quantity: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unit Price ($)</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0.00" value={newPO.unitPrice} onChange={(e) => setNewPO({ ...newPO, unitPrice: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Order Date</label>
              <input type="date" className="input-field text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expected Delivery</label>
              <input type="text" className="input-field" placeholder="e.g. Nov 15" value={newPO.deliveryDate} onChange={(e) => setNewPO({ ...newPO, deliveryDate: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
              <textarea rows={3} className="input-field resize-none" placeholder="Any special instructions..." value={newPO.notes} onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50 mt-4">
            <button type="button" onClick={() => setIsAddPOOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Generate PO</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Procurement;
