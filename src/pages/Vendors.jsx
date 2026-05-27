import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, MoreVertical, Edit2, Eye, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

const SEED_VENDORS = [
  { id: "V-1042", name: "TechNova Solutions", category: "IT Services", contact: "Alice Smith", email: "alice@technova.io", status: "Active", risk: "Low", rating: 4.8 },
  { id: "V-1089", name: "BuildCore Supplies", category: "Construction", contact: "Bob Jones", email: "ops@buildcore.com", status: "Active", risk: "Medium", rating: 4.2 },
  { id: "V-1102", name: "MedEquip Global", category: "Healthcare", contact: "Carol White", email: "supply@medequip.org", status: "Under Review", risk: "High", rating: 3.5 },
  { id: "V-1155", name: "SwiftLog Freight", category: "Logistics", contact: "Dave Brown", email: "hello@swiftlog.net", status: "Active", risk: "Low", rating: 4.5 },
  { id: "V-1204", name: "GreenLeaf Wholesale", category: "E-commerce", contact: "Eve Davis", email: "sales@greenleaf.shop", status: "Inactive", risk: "Low", rating: 4.0 },
];

const Vendors = () => {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [vendors, setVendors] = useState(SEED_VENDORS);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  const [newVendor, setNewVendor] = useState({ name: '', category: 'IT Services', contact: '', email: '', phone: '' });

  const resetForm = () => {
    setNewVendor({ name: '', category: 'IT Services', contact: '', email: '', phone: '' });
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    const vendorToAdd = {
      id: `V-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newVendor.name,
      category: newVendor.category,
      contact: newVendor.contact || 'N/A',
      email: newVendor.email,
      status: 'Under Review',
      risk: 'Pending',
      rating: 0.0,
    };
    setVendors([vendorToAdd, ...vendors]);
    setVendors([vendorToAdd, ...vendors]);
    resetForm();
    setIsAddVendorOpen(false);
  };

  const handleEditVendor = (e) => {
    e.preventDefault();
    setVendors(vendors.map(v => v.id === newVendor.id ? newVendor : v));
    resetForm();
    setIsEditModalOpen(false);
  };

  const handleDeleteVendor = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const openEditModal = (vendor) => {
    setNewVendor(vendor);
    setIsEditModalOpen(true);
  };

  const openViewModal = (vendor) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Vendor Directory</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and evaluate your vendor network</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button onClick={() => setIsFiltersOpen(true)} className="btn-secondary flex items-center shrink-0">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <button onClick={() => setIsAddVendorOpen(true)} className="btn-primary flex items-center shrink-0">
            <Plus size={16} className="mr-2" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium hidden md:table-cell">Category</th>
                <th className="p-4 font-medium hidden lg:table-cell">Contact</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden sm:table-cell">Risk Score</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 shrink-0">
                        <span className="text-slate-300 font-semibold">{vendor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{vendor.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{vendor.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-slate-300">{vendor.category}</td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm text-slate-300">{vendor.contact}</div>
                    <div className="text-xs text-slate-500">{vendor.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`badge-success ${
                      vendor.status === 'Active' ? 'badge-success' : 
                      vendor.status === 'Under Review' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex items-center">
                      {vendor.risk === 'Low' && <ShieldCheck size={16} className="text-emerald-500 mr-2" />}
                      {vendor.risk === 'Medium' && <AlertCircle size={16} className="text-amber-500 mr-2" />}
                      {vendor.risk === 'High' && <AlertCircle size={16} className="text-rose-500 mr-2" />}
                      <span className="text-sm text-slate-300">{vendor.risk}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm">
                      <span className="font-semibold text-slate-50 mr-1">{vendor.rating}</span>
                      <span className="text-amber-400">★</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openViewModal(vendor)} className="btn-icon" title="View details"><Eye size={16} /></button>
                      <button onClick={() => openEditModal(vendor)} className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteVendor(vendor.id)} className="btn-icon hover:text-rose-400" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No vendors found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-700/50 flex justify-between items-center text-sm text-slate-400">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">1</button>
            <button className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800">2</button>
            <button className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800">Next</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isAddVendorOpen} onClose={() => setIsAddVendorOpen(false)} title="Register New Vendor">
        <form className="space-y-4" onSubmit={handleAddVendor}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company Name *</label>
              <input type="text" className="input-field" required placeholder="e.g. Acme Corp" value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select className="input-field" value={newVendor.category} onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}>
                <option>IT Services</option>
                <option>Construction</option>
                <option>Logistics</option>
                <option>Healthcare</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contact Person</label>
            <input type="text" className="input-field" placeholder="Full Name" value={newVendor.contact} onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
              <input type="email" className="input-field" required placeholder="email@company.com" value={newVendor.email} onChange={(e) => setNewVendor({...newVendor, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={newVendor.phone} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddVendorOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Register Vendor</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Vendor">
        <form className="space-y-4" onSubmit={handleEditVendor}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company Name *</label>
              <input type="text" className="input-field" required placeholder="e.g. Acme Corp" value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select className="input-field" value={newVendor.category} onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}>
                <option>IT Services</option>
                <option>Construction</option>
                <option>Logistics</option>
                <option>Healthcare</option>
                <option>E-commerce</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contact Person</label>
            <input type="text" className="input-field" placeholder="Full Name" value={newVendor.contact} onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
              <input type="email" className="input-field" required placeholder="email@company.com" value={newVendor.email} onChange={(e) => setNewVendor({...newVendor, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" value={newVendor.phone || ''} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select className="input-field" value={newVendor.status} onChange={(e) => setNewVendor({...newVendor, status: e.target.value})}>
                <option>Active</option>
                <option>Under Review</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Risk Level</label>
              <select className="input-field" value={newVendor.risk} onChange={(e) => setNewVendor({...newVendor, risk: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Vendor Details">
        {selectedVendor && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 border-b border-slate-700/50 pb-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-2xl text-slate-300 font-bold">{selectedVendor.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">{selectedVendor.name}</h3>
                <p className="text-sm text-cyan-400 font-mono mt-0.5">{selectedVendor.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Category</p>
                <p className="text-slate-200 font-medium">{selectedVendor.category}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Contact Person</p>
                <p className="text-slate-200 font-medium">{selectedVendor.contact}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Email Address</p>
                <p className="text-slate-200 font-medium">{selectedVendor.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Rating</p>
                <div className="flex items-center">
                  <span className="font-semibold text-slate-50 mr-1">{selectedVendor.rating}</span>
                  <span className="text-amber-400">★</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Status</p>
                <span className={`badge-success ${
                  selectedVendor.status === 'Active' ? 'badge-success' : 
                  selectedVendor.status === 'Under Review' ? 'badge-warning' : 'badge-error'
                }`}>
                  {selectedVendor.status}
                </span>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Risk Level</p>
                <div className="flex items-center">
                  {selectedVendor.risk === 'Low' && <ShieldCheck size={16} className="text-emerald-500 mr-2" />}
                  {selectedVendor.risk === 'Medium' && <AlertCircle size={16} className="text-amber-500 mr-2" />}
                  {selectedVendor.risk === 'High' && <AlertCircle size={16} className="text-rose-500 mr-2" />}
                  <span className="text-slate-200 font-medium">{selectedVendor.risk}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} title="Advanced Filters">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <div className="flex gap-2">
              <label className="flex items-center space-x-2 text-slate-300"><input type="checkbox" className="rounded border-slate-700 bg-slate-900" /> <span>Active</span></label>
              <label className="flex items-center space-x-2 text-slate-300 ml-4"><input type="checkbox" className="rounded border-slate-700 bg-slate-900" /> <span>Under Review</span></label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Risk Level</label>
            <div className="flex gap-2">
              <label className="flex items-center space-x-2 text-slate-300"><input type="checkbox" className="rounded border-slate-700 bg-slate-900" /> <span>Low</span></label>
              <label className="flex items-center space-x-2 text-slate-300 ml-4"><input type="checkbox" className="rounded border-slate-700 bg-slate-900" /> <span>Medium</span></label>
              <label className="flex items-center space-x-2 text-slate-300 ml-4"><input type="checkbox" className="rounded border-slate-700 bg-slate-900" /> <span>High</span></label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setIsFiltersOpen(false)} className="btn-secondary">Clear All</button>
            <button onClick={() => setIsFiltersOpen(false)} className="btn-primary">Apply Filters</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Vendors;
