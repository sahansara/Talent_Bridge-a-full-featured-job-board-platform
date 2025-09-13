import { Play } from 'lucide-react';
import React from 'react';  
import thumbanail from '../assets/14.jpg';


export const VideoSection = ({ theme }) => {
  
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              See JobBoard in Action
            </span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={thumbanail}
              alt="Video thumbnail" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className={`w-20 h-20 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl`}>
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;