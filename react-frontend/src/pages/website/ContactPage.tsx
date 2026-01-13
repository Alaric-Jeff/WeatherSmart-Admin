import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
export function ContactPage() {
  return <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-500">
            Reach out to our team directly through any of the channels below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500 mb-4">
              For general support and questions
            </p>
            <a href="mailto:support@smartlaundry.com" className="text-blue-600 font-medium hover:underline">
              support@smartlaundry.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm</p>
            <a href="tel:+631231234567" className="text-blue-600 font-medium hover:underline">
              +63 123 123-4567
            </a>
          </div>

          {/* Location */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-500 mb-4">Comlab 303</p>
            <p className="text-gray-900 font-medium">
              University of Caloocan City
              <br />
              Congressional Campus
            </p>
          </div>
        </div>

        {/* Social & Map */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <Github size={24} className="text-gray-700" />
                  <span className="font-medium text-gray-900">
                    GitHub Repository
                  </span>
                </div>
                <ExternalLink size={20} className="text-gray-400 group-hover:text-blue-600" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <Linkedin size={24} className="text-blue-700" />
                  <span className="font-medium text-gray-900">
                    LinkedIn Page
                  </span>
                </div>
                <ExternalLink size={20} className="text-gray-400 group-hover:text-blue-600" />
              </a>
            </div>
          </div>

          <div className="bg-gray-200 rounded-3xl min-h-[300px] relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">
                  Map View Placeholder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}