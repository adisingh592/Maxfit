import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, AlertTriangle, ListChecks, X } from 'lucide-react';

const WORKOUT_DATA: Record<string, any> = {
  'upper-body-strength': {
    name: 'Upper Body Strength',
    duration: '45 min',
    difficulty: 'Advanced',
    description: 'A comprehensive upper body routine focusing on chest, back, and arms to build raw strength and muscle mass.',
    exercises: [
      {
        id: 'e1',
        name: 'Barbell Bench Press',
        sets: '4 sets of 8-10 reps',
        videoUrl: 'https://www.youtube.com/embed/hWbUlkb5Ms4',
        steps: [
          'Lie flat on the bench with your feet firmly planted on the ground.',
          'Grip the barbell slightly wider than shoulder-width apart.',
          'Unrack the bar and slowly lower it to your mid-chest.',
          'Press the bar explosively back up to the starting position.'
        ],
        caution: 'Do not bounce the bar off your chest. If lifting heavy, ensure you have a spotter.'
      },
      {
        id: 'e2',
        name: 'Overhead Shoulder Press',
        sets: '3 sets of 10-12 reps',
        videoUrl: 'https://www.youtube.com/embed/zoN5EH50Dro',
        steps: [
          'Stand with feet shoulder-width apart, holding the barbell or dumbbells at shoulder level.',
          'Brace your core and press the weight straight up overhead.',
          'Lock out your arms at the top without shrugging your shoulders.',
          'Lower the weight back down with control.'
        ],
        caution: 'Avoid arching your lower back excessively. Keep your core tight.'
      },
      {
        id: 'e3',
        name: 'Pull-Ups',
        sets: '3 sets to failure',
        videoUrl: 'https://www.youtube.com/embed/RhNyvtK-IaA',
        steps: [
          'Grab the pull-up bar with an overhand grip slightly wider than shoulder-width.',
          'Hang freely with your arms fully extended.',
          'Pull yourself up until your chin clears the bar.',
          'Lower yourself back down slowly and under control.'
        ],
        caution: 'Do not swing or use momentum (kipping). Focus on a strict, controlled pull.'
      }
    ]
  },
  'cardio-blast': {
    name: 'Cardio Blast',
    duration: '30 min',
    difficulty: 'Intermediate',
    description: 'High-energy cardiovascular workout designed to burn calories and improve stamina.',
    exercises: [
      {
        id: 'c1',
        name: 'Jump Rope',
        sets: '5 rounds of 3 mins',
        videoUrl: 'https://www.youtube.com/embed/VLC6YO9w5iU',
        steps: [
          'Hold the handles firmly and keep your elbows tucked in close to your ribs.',
          'Use your wrists to swing the rope, not your whole arms.',
          'Jump lightly on the balls of your feet.',
          'Keep your jumps short and quick.'
        ],
        caution: 'Ensure you are jumping on a flat surface. Wear supportive shoes.'
      }
    ]
  },
  'core-abs': {
    name: 'Core & Abs',
    duration: '20 min',
    difficulty: 'Beginner',
    description: 'Strengthen your midsection with this intense core-focused routine.',
    exercises: [
      {
        id: 'a1',
        name: 'Plank',
        sets: '3 sets of 60 seconds',
        videoUrl: 'https://www.youtube.com/embed/v25dawSzRTM',
        steps: [
          'Start in a push-up position but rest your weight on your forearms.',
          'Keep your body in a straight line from your head to your heels.',
          'Engage your core and squeeze your glutes.',
          'Hold the position without letting your hips sag.'
        ],
        caution: 'Do not let your lower back droop. If you feel pain in your lower back, stop immediately.'
      }
    ]
  },
  'full-body-hiit': {
    name: 'Full Body HIIT',
    duration: '40 min',
    difficulty: 'Advanced',
    description: 'High Intensity Interval Training hitting every major muscle group.',
    exercises: [
      {
        id: 'h1',
        name: 'Burpees',
        sets: '4 sets of 15 reps',
        videoUrl: 'https://www.youtube.com/embed/NCqbpkoiyXE',
        steps: [
          'Start from a standing position.',
          'Drop into a squat position and place your hands on the ground.',
          'Kick your feet back to a plank position.',
          'Do a push-up, then immediately return your feet to the squat position.',
          'Stand up and explosively jump into the air.'
        ],
        caution: 'Maintain a strong plank form during the push-up phase to protect your lower back.'
      }
    ]
  }
};

export default function WorkoutDetails() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const workout = WORKOUT_DATA[workoutId as string];

  if (!workout) {
    return (
      <DashboardLayout title="Workout Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-4">Workout program not found.</h2>
          <button 
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
          >
            Back to Workouts
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Workout Details">
      <div className="space-y-6">
        {/* Header / Hero */}
        <button 
          onClick={() => navigate('/workouts')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl bg-card border border-border"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold">{workout.name}</h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {workout.difficulty}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {workout.duration}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            {workout.description}
          </p>
        </motion.div>

        {/* Exercises List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Exercises ({workout.exercises.length})</h2>
          <div className="grid gap-4">
            {workout.exercises.map((exercise: any, index: number) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedExercise(exercise)}
                className="p-4 rounded-xl bg-card border border-border flex items-center justify-between cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">{exercise.sets}</p>
                  </div>
                </div>
                <Play className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-border bg-card">
                <div>
                  <h2 className="text-xl font-bold">{selectedExercise.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedExercise.sets}</p>
                </div>
                <button 
                  onClick={() => setSelectedExercise(null)} 
                  className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto p-6 space-y-6">
                
                {/* Video Embed */}
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black shadow-inner">
                  <iframe 
                    src={selectedExercise.videoUrl} 
                    title={selectedExercise.name} 
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>

                {/* Steps */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">How to Execute</h3>
                  </div>
                  <ol className="space-y-3 pl-2">
                    {selectedExercise.steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground bg-muted w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Caution Box */}
                {selectedExercise.caution && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">Safety Caution</h4>
                      <p className="text-sm text-destructive/90 leading-relaxed">
                        {selectedExercise.caution}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
