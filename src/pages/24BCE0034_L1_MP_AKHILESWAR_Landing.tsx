import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Clock, Zap, TreePine } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function Landing_24BCE0034_Akhileswar() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f5', color: '#1a1a1a' }}>
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-20">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ border: '1px solid #6c63ff55', backgroundColor: '#6c63ff22', color: '#a89fff' }}>
            <TreePine className="h-4 w-4" />
            Decision Tree Approach
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Smart Timetable Planner
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
            Creating a university timetable is like solving a puzzle — one wrong choice can lead to slot conflicts or make you miss out on the faculty you want.
This tool lets you visualize every possible schedule path, helping you avoid clashes and choose the timetable that fits you best.
          </p>
          <button
            className="clay-button px-6 py-3 font-semibold flex items-center gap-2 mx-auto"
            onClick={() => navigate('/planner')}
          >
            Start Planning <ArrowRight className="h-5 w-5" />
          </button>
        </motion.section>

        {/* The Problem */}
        <section className="space-y-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl font-bold text-center"
          >
            The Problem
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <AlertTriangle className="h-6 w-6" style={{ color: '#ff6b6b' }} />,
                title: 'Slot Clashes',
                desc: "Two subjects can share the same time slot. Picking one blocks the other — but you won't know until it's too late.",
              },
              {
                icon: <Clock className="h-6 w-6" style={{ color: '#ffd93d' }} />,
                title: 'Shift Lock',
                desc: 'Morning theory slots lock you out of afternoon labs, and vice versa.',
              },
              {
                icon: <Zap className="h-6 w-6" style={{ color: '#6c63ff' }} />,
                title: 'Combinatorial Explosion',
                desc: 'With 5 subjects and 4 faculty each, there are 1024 combinations. Manually checking each one is impossible.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }} className="p-6 space-y-3 h-full">
                  {item.icon}
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl font-bold text-center"
          >
            How It Works
          </motion.h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { step: '1', text: 'Enter your subjects, faculty options, and their time slots.' },
              { step: '2', text: 'The engine builds a decision tree — every branch is a possible schedule.' },
              { step: '3', text: 'Constraints are checked at each level: slot clashes, shift conflicts, and lab-theory splits.' },
              { step: '4', text: 'Invalid branches are marked red. You explore only the valid paths interactively.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm clay-button">
                  {item.step}
                </span>
                <p className="pt-1" style={{ color: '#6b7280' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center space-y-4 pb-10"
        >
          <h2 className="text-2xl font-bold">Ready to build your timetable?</h2>
          <button
            className="clay-button px-6 py-3 font-semibold flex items-center gap-2 mx-auto"
            onClick={() => navigate('/planner')}
          >
            Open the Planner <ArrowRight className="h-5 w-5" />
          </button>
        </motion.section>

      </div>
    </div>
  );
}