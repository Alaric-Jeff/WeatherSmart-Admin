import React from 'react';
import { ManualCard } from '../../components/website/ManualCard';
import { HelpCircle, ChevronDown } from 'lucide-react';
export function ManualsPage() {
  return <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Manuals & Guides
          </h1>
          <p className="text-xl text-gray-500">
            Everything you need to install, operate, and maintain your Smart
            Laundry System.
          </p>
        </div>

        {/* Downloads Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <ManualCard title="User Manual" description="Complete guide to using your system, including all features and settings." size="2.4 MB" delay={0.1} />
          <ManualCard title="Installation Guide" description="Step-by-step instructions for mounting and setting up the hardware." size="1.8 MB" delay={0.2} />
          <ManualCard title="Maintenance Guide" description="Tips and schedules to keep your system running smoothly for years." size="1.2 MB" delay={0.3} />
          <ManualCard title="Mobile App Guide" description="Learn how to pair your device and use the companion mobile application." size="3.1 MB" delay={0.4} />
          <ManualCard title="Troubleshooting" description="Common issues, error codes, and quick solutions." size="1.5 MB" delay={0.5} />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Quick Help</h2>
          </div>

          <div className="space-y-4">
            {[{
            q: 'How do I pair my device with the app?',
            a: 'Open the app, go to Settings > Device Pairing, and follow the on-screen instructions. Make sure Bluetooth is enabled on your phone.'
          }, {
            q: 'What happens when rain is detected?',
            a: 'The system immediately activates the retraction motor to pull the rod under cover. You will receive a notification on your phone.'
          }, {
            q: 'What is the maximum load weight?',
            a: 'The system is designed to handle up to 15kg of wet clothes. The load cell will trigger a warning if this limit is exceeded.'
          }, {
            q: 'Can I use the system manually?',
            a: 'Yes, you can use the manual override controls in the app or the physical buttons on the control unit to operate the rod and fans.'
          }].map((item, i) => <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                  {item.q}
                  <ChevronDown size={20} className="text-gray-400" />
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}