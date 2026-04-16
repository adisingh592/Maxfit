import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Filter, Edit2, Trash2, Eye, X } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

interface MemberDetails {
  id: number;
  reg_no: string;
  first_name: string;
  last_name: string;
  email: string;
  membership_status: string;
  join_date: string;
  expiry_date: string;
  price: number;
  trainer_id?: number;
  trainer_first?: string;
  trainer_last?: string;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  address?: string;
  dob?: string;
  goal?: string;
  source?: string;
  remaining_days?: number;
}

interface Member {
  id: number;
  regNo: string;
  name: string;
  email: string;
  joinDate: string;
  expiryDate: string;
  remainingDays: number;
  price: number;
  status: 'active' | 'expired' | 'pending';
  trainer: string;
  trainerId?: number;
}

export default function AdminMembers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTrainer, setFilterTrainer] = useState('all');
  
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [detailedMember, setDetailedMember] = useState<MemberDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [searchQuery, filterStatus, filterTrainer]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('membership_status', filterStatus);
      if (filterTrainer !== 'all') params.append('trainer_id', filterTrainer);

      const response = await api.get(`/members?${params.toString()}`);
      if (response.data) {
         const mappedMembers = response.data.members.map((m: any) => ({
             id: m.id,
             regNo: m.reg_no,
             name: `${m.first_name || ''} ${m.last_name || ''}`.trim(),
             email: m.email,
             joinDate: m.join_date ? new Date(m.join_date).toISOString().split('T')[0] : '',
             expiryDate: m.expiry_date ? new Date(m.expiry_date).toISOString().split('T')[0] : '',
             remainingDays: m.remaining_days === 'N/A' ? -1 : m.remaining_days,
             price: m.price || 0,
             status: m.membership_status || 'pending',
             trainer: m.trainer_name || 'Unassigned',
             trainerId: m.trainer_id
         }));
         setMembers(mappedMembers);
         if (response.data.trainers) {
             setTrainers(response.data.trainers);
         }
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberDetails = async (memberId: number) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/member-details/${memberId}`);
      if (response.data) {
        setDetailedMember(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch member details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredMembers = members;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/10';
      case 'expired':
        return 'text-red-500 bg-red-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <DashboardLayout title="Members Management">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filterTrainer}
            onChange={(e) => setFilterTrainer(e.target.value)}
            className="px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="all">All Trainers</option>
            {trainers.map(trainer => (
              <option key={trainer.user_id} value={trainer.user_id}>
                {trainer.first_name} {trainer.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reg No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Remaining Days</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trainer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'var(--color-muted)' }}
                    className="border-b border-border transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">{member.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{member.regNo}</td>
                    <td className="px-6 py-4 text-sm font-medium">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
                    <td className="px-6 py-4 text-sm">{member.joinDate}</td>
                    <td className="px-6 py-4 text-sm">{member.expiryDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={member.remainingDays < 0 ? 'text-red-500' : member.remainingDays < 30 ? 'text-yellow-500' : 'text-green-500'}>
                        {member.remainingDays} days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">${member.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={member.trainerId || ''}
                        onChange={async (e) => {
                          const newTrainerId = e.target.value;
                          try {
                            await api.post(`/update-member/${member.id}`, { trainer_id: newTrainerId });
                            fetchMembers();
                          } catch (err) {
                            console.error('Failed to assign trainer', err);
                          }
                        }}
                        className="px-2 py-1 rounded bg-input border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Unassigned</option>
                        {trainers.map(trainer => (
                          <option key={trainer.user_id} value={trainer.user_id}>
                            {trainer.first_name} {trainer.last_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => {
                            fetchMemberDetails(member.id);
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingMember(member)}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to permanently delete member ${member.name}?`)) {
                              try {
                                await api.delete(`/delete-member/${member.id}`);
                                fetchMembers();
                              } catch (err) {
                                console.error('Failed to delete member', err);
                              }
                            }
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Members</p>
            <p className="text-3xl font-bold">{members.length}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-3xl font-bold text-green-500">
              {members.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground mb-1">Expired</p>
            <p className="text-3xl font-bold text-red-500">
              {members.filter(m => m.status === 'expired').length}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      {detailedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card border border-border rounded-xl p-8 my-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{detailedMember.first_name} {detailedMember.last_name}</h2>
                <p className="text-muted-foreground">Reg No: {detailedMember.reg_no}</p>
              </div>
              <motion.button
                onClick={() => setDetailedMember(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Personal Information</h3>
                <DetailField label="Email" value={detailedMember.email} />
                <DetailField label="Date of Birth" value={detailedMember.dob || 'N/A'} />
                <DetailField label="Age" value={detailedMember.age?.toString() || 'N/A'} />
                <DetailField label="Address" value={detailedMember.address || 'N/A'} />
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Health Information</h3>
                <DetailField label="Height (cm)" value={detailedMember.height?.toString() || 'N/A'} />
                <DetailField label="Weight (kg)" value={detailedMember.weight?.toString() || 'N/A'} />
                <DetailField label="BMI" value={detailedMember.bmi?.toFixed(2) || 'N/A'} />
                <DetailField label="Goal" value={detailedMember.goal || 'N/A'} />
              </div>

              {/* Membership Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Membership</h3>
                <DetailField label="Join Date" value={detailedMember.join_date || 'N/A'} />
                <DetailField label="Expiry Date" value={detailedMember.expiry_date || 'N/A'} />
                <DetailField label="Remaining Days" value={detailedMember.remaining_days?.toString() || 'N/A'} />
                <DetailField label="Price" value={`$${detailedMember.price || 0}`} />
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Additional</h3>
                <DetailField label="Status" value={
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(detailedMember.membership_status)}`}>
                    {detailedMember.membership_status}
                  </span>
                } />
                <DetailField label="Trainer" value={detailedMember.trainer_first && detailedMember.trainer_last ? `${detailedMember.trainer_first} ${detailedMember.trainer_last}` : 'Unassigned'} />
                <DetailField label="Source" value={detailedMember.source || 'N/A'} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <motion.button
                onClick={() => setDetailedMember(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Adjust Member Details</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.post(`/update-member/${editingMember.id}`, {
                  price: editingMember.price,
                  membership_status: editingMember.status,
                  join_date: editingMember.joinDate,
                  expiry_date: editingMember.expiryDate,
                });
                setEditingMember(null);
                fetchMembers();
              } catch (err) {
                console.error(err);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Budget / Price ($)</label>
                <input type="number" value={editingMember.price} onChange={e => setEditingMember({...editingMember, price: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg bg-input border-border focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value as any})} className="w-full px-4 py-2 border rounded-lg bg-input border-border focus:outline-none">
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Join Date</label>
                  <input type="date" value={editingMember.joinDate} onChange={e => setEditingMember({...editingMember, joinDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-input border-border focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input type="date" value={editingMember.expiryDate} onChange={e => setEditingMember({...editingMember, expiryDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-input border-border focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Helper component for displaying details
function DetailField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
      <p className="text-sm font-medium">{typeof value === 'string' ? value : value}</p>
    </div>
  );
}
