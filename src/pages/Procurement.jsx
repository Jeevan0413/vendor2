import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle2, Truck, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

const SEED_POS = [
  { id: 'PO-2024-011', item: 'Dell Laptops x15', vendor: 'TechNova Solutions', amount: '$18,500', date: 'Oct 11', status: 'Requested' },
  { id: 'PO-2024-012', item: 'Office Chairs x30', vendor: 'BuildCore Supplies', amount: '$4,200', date: 'Oct 12', status: 'Approved' },
  { id: 'PO-2024-013', item: 'Logistics Batch Q4', vendor: 'SwiftLog Freight', amount: '$12,000', date: 'Oct 13', status: 'In Transit' },
  { id: 'PO-2024-014', item: 'Server Rack Upgrade', vendor: 'TechNova Solutions', amount: '$8,900', date: 'Oct 14', status: 'Delivered' },
];

const Procurement = () => {
  const { searchQuery } = useAppStore();
  const [pos, setPos] = useState(SEED_POS);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isViewPOOpen, setIsViewPOOpen] = useState(false);
  const [isEditPOOpen, setIsEditPOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  
  const [newPO, setNewPO] = useState({ vendor: '', item: '', amount: '', status: 'Requested' });

  const handleAddPO = (e) => {
    e.preventDefault();
    const poToAdd = {
      id: `PO-2024-${Math.floor(Math.random() * 900) + 100}`,
      item: newPO.item,
      vendor: newPO.vendor || 'Unknown Vendor',
      amount: newPO.amount ? `$${parseFloat(newPO.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}` : '$0.00',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'Requested',
    };
    setPos([poToAdd, ...pos]);
    setPos([poToAdd, ...pos]);
    setNewPO({ vendor: '', item: '', amount: '', status: 'Requested' });
    setIsAddPOOpen(false);
  };

  const handleDeletePO = (id) => {
    if (window.confirm('Are you sure you want to delete this Purchase Order?')) {
      setPos(pos.filter(po => po.id !== id));
      setIsViewPOOpen(false);
    }
  };

  const openEditPO = (po) => {
    setNewPO({
      ...po,
      amount: po.amount.replace(/[^0-9.]/g, '') // strip $ and commas for editing
    });
    setIsViewPOOpen(false);
    setIsEditPOOpen(true);
  };

  const handleEditPO = (e) => {
    e.preventDefault();
    const updatedPO = {
      ...newPO,
      amount: newPO.amount.includes('$') ? newPO.amount : `$${parseFloat(newPO.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`
    };
    setPos(pos.map(p => p.id === newPO.id ? updatedPO : p));
    setNewPO({ vendor: '', item: '', amount: '', status: 'Requested' });
    setIsEditPOOpen(false);
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
                  onClick={() => { setSelectedPO(card); setIsViewPOOpen(true); }}
                  className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-cyan-400">{card.id}</span>
                    <span className="text-xs text-slate-400">{card.date}</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1">{card.item}</h4>
                  <p className="text-xs text-slate-400 mb-3">{card.vendor}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-50">{card.amount}</span>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-800" />
                      <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-slate-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddPOOpen} onClose={() => setIsAddPOOpen(false)} title="Create Purchase Order">
        <form className="space-y-4" onSubmit={handleAddPO}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
              <select className="input-field" required value={newPO.vendor} onChange={(e) => setNewPO({...newPO, vendor: e.target.value})}>
                <option value="">Select Vendor...</option>
                <option>TechNova Solutions</option>
                <option>BuildCore Supplies</option>
                <option>SwiftLog Freight</option>
                <option>MedEquip Global</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Item Description *</label>
              <input type="text" className="input-field" required placeholder="What are you purchasing?" value={newPO.item} onChange={(e) => setNewPO({...newPO, item: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
              <input type="number" min="1" className="input-field" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unit Price ($)</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0.00" value={newPO.amount} onChange={(e) => setNewPO({...newPO, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Order Date</label>
              <input type="date" className="input-field text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expected Delivery</label>
              <input type="date" className="input-field text-slate-400" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50 mt-4">
            <button type="button" onClick={() => setIsAddPOOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Generate PO</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewPOOpen} onClose={() => setIsViewPOOpen(false)} title="Purchase Order Details">
        {selectedPO && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 border-b border-slate-700/50 pb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <ShoppingCart className="text-cyan-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">{selectedPO.item}</h3>
                <p className="text-sm text-cyan-400 font-mono mt-0.5">{selectedPO.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Vendor</p>
                <p className="text-slate-200 font-medium">{selectedPO.vendor}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Amount</p>
                <p className="text-slate-200 font-medium">{selectedPO.amount}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Date Created</p>
                <p className="text-slate-200 font-medium">{selectedPO.date}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Current Status</p>
                <span className="bg-slate-800 text-slate-300 py-1 px-3 rounded-full text-xs font-medium border border-slate-700">
                  {selectedPO.status}
                </span>
              </div>
            </div>
            <div className="pt-6 flex justify-between items-center border-t border-slate-700/50 mt-4">
              <button onClick={() => handleDeletePO(selectedPO.id)} className="btn-secondary text-rose-400 hover:text-rose-300 hover:border-rose-500/50 flex items-center">
                <Trash2 size={16} className="mr-2" />
                Delete PO
              </button>
              <div className="flex gap-3">
                <button onClick={() => openEditPO(selectedPO)} className="btn-secondary flex items-center">
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </button>
                <button onClick={() => setIsViewPOOpen(false)} className="btn-primary">Close</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditPOOpen} onClose={() => { setIsEditPOOpen(false); setNewPO({ vendor: '', item: '', amount: '', status: 'Requested' }); }} title="Edit Purchase Order">
        <form className="space-y-4" onSubmit={handleEditPO}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
              <select className="input-field" required value={newPO.vendor} onChange={(e) => setNewPO({...newPO, vendor: e.target.value})}>
                <option value="">Select Vendor...</option>
                <option>TechNova Solutions</option>
                <option>BuildCore Supplies</option>
                <option>SwiftLog Freight</option>
                <option>MedEquip Global</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Item Description *</label>
              <input type="text" className="input-field" required placeholder="What are you purchasing?" value={newPO.item} onChange={(e) => setNewPO({...newPO, item: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select className="input-field" value={newPO.status} onChange={(e) => setNewPO({...newPO, status: e.target.value})}>
                <option>Requested</option>
                <option>Approved</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unit Price ($)</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0.00" value={newPO.amount} onChange={(e) => setNewPO({...newPO, amount: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700/50 mt-4">
            <button type="button" onClick={() => { setIsEditPOOpen(false); setNewPO({ vendor: '', item: '', amount: '', status: 'Requested' }); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Procurement;
