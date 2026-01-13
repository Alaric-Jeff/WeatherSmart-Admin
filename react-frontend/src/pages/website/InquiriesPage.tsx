import React from 'react';
import { ContactForm } from '../../components/website/ContactForm';
import { MessageSquare } from 'lucide-react';
export function InquiriesPage() {
  return <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <MessageSquare size={16} />
              We'd love to hear from you
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Send us an Inquiry
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Have questions about the Smart Laundry System? Whether you're
              interested in purchasing, have technical questions, or want to
              partner with us, we're here to help.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Fill out the form
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Provide your details and select the type of inquiry.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    We review your request
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Our team will analyze your inquiry and route it to the right
                    department.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    Get a response
                  </h3>
                  <p className="text-gray-500 text-sm">
                    We typically respond within 24 business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>;
}