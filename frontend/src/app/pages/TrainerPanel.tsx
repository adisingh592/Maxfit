import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Apple, X } from 'lucide-react';
import { api } from '../services/api';

export default function TrainerPanel() {
  const [assignedMembers, setAssignedMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [workoutModal, setWorkoutModal] = useState<{ isOpen: boolean; member: any }>({ isOpen: false, member: null });
  const [mealModal, setMealModal] = useState<{ isOpen: boolean; member: any }>({ isOpen: false, member: null });
  
  const [workoutDetails, setWorkoutDetails] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [mealDetails, setMealDetails] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await api.get('/api/trainer/members');
      setAssignedMembers(res.data.members || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openWorkoutModal = (member: any) => {
    setWorkoutDetails(member.workout_details || '');
    setSuggestion(member.suggestion || '');
    setWorkoutModal({ isOpen: true, member });
  };

  const openMealModal = (member: any) => {
    setMealDetails(member.meal_details || '');
    setMealModal({ isOpen: true, member });
  };

  const saveWorkout = async () => {
    try {
      await api.post(`/api/trainer/workout/${workoutModal.member.id}`, {
        workout_details: workoutDetails,
        suggestion: suggestion,
      });
      setWorkoutModal({ isOpen: false, member: null });
      fetchMembers();
    } catch (e) {
      console.error('Error saving workout:', e);
    }
  };

  const saveMeal = async () => {
    try {
      await api.post(`/api/trainer/meal/${mealModal.member.id}`, {
        meal_details: mealDetails,
      });
      setMealModal({ isOpen: false, member: null });
      fetchMembers();
    } catch (e) {
      console.error('Error saving meal:', e);
    }
  };

  return (
    <DashboardLayout title="Trainer Panel">
      <div className="space-y-6">
        {loading ? (
          <div className="text-muted-foreground">Loading members...</div>
        ) : assignedMembers.length === 0 ? (
          <div className="text-muted-foreground">No members assigned to you yet.</div>
        ) : (
          <div className="grid gap-6">
            {assignedMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-card border border-border transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.regNo} • {member.goal || 'No goal set'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold text-primary">{member.progress}%</p>
                  </div>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => openWorkoutModal(member)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    <Dumbbell className="w-4 h-4" />
                    Update Workout
                  </motion.button>
                  <motion.button
                    onClick={() => openMealModal(member)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-card border border-border text-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent transition-all"
                  >
                    <Apple className="w-4 h-4" />
                    Update Meal
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Workout Modal */}
      <AnimatePresence>
        {workoutModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Update Workout - {workoutModal.member?.name}</h2>
                <button onClick={() => setWorkoutModal({ isOpen: false, member: null })} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Workout Details</label>
                  <textarea
                    value={workoutDetails}
                    onChange={(e) => setWorkoutDetails(e.target.value)}
                    className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={4}
                    placeholder="Enter workout instructions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Suggestion / Note</label>
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={2}
                    placeholder="Any suggestions..."
                  />
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-3">
                <button onClick={() => setWorkoutModal({ isOpen: false, member: null })} className="px-4 py-2 rounded-lg font-medium bg-muted text-foreground">Cancel</button>
                <button onClick={saveWorkout} className="px-4 py-2 rounded-lg font-medium bg-primary text-white">Save Workout</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Meal Modal */}
      <AnimatePresence>
        {mealModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Update Meal Plan - {mealModal.member?.name}</h2>
                <button onClick={() => setMealModal({ isOpen: false, member: null })} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <label className="block text-sm font-medium mb-1">Meal Details</label>
                <textarea
                  value={mealDetails}
                  onChange={(e) => setMealDetails(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={6}
                  placeholder="Enter meal instructions..."
                />
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-3">
                <button onClick={() => setMealModal({ isOpen: false, member: null })} className="px-4 py-2 rounded-lg font-medium bg-muted text-foreground">Cancel</button>
                <button onClick={saveMeal} className="px-4 py-2 rounded-lg font-medium bg-primary text-white">Save Meal Plan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
