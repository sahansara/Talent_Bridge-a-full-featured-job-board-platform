import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import FeedbackForm from './feedback/form';
import FeedbackApiService from '../services/feedbacks/feedbacks';

export function Feedback() {
  const queryClient = useQueryClient();

  // Fetch feedbacks using React Query
  const { 
    data: feedbacks = [], 
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const data = await FeedbackApiService.getHighRatedFeedback();
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Mutation for submitting feedback
  const submitFeedbackMutation = useMutation({
    mutationFn: async (formData) => {
      return await FeedbackApiService.submitFeedback(formData);
    },
    onSuccess: () => {
      // Invalidate and refetch feedbacks after successful submission
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
    onError: (error) => {
      console.error('Error submitting feedback:', error);
    },
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index}
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-600'} text-sm`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="feedback">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/10 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="feedback">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Error loading feedback. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="feedback">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied job seekers and employers who've found success with Talent Bridge
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {feedbacks.length > 0 ? (
            feedbacks.slice(0, 3).map((feedback) => (
              <div key={feedback._id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {feedback.avatar || feedback.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{feedback.name}</h4>
                    <p className="text-gray-300 text-sm">{feedback.role}</p>
                    <p className="text-gray-400 text-xs">{feedback.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {renderStars(feedback.rating)}
                </div>
                
                <div className="relative">
                  <FaQuoteLeft className="text-blue-400 text-2xl mb-3 opacity-50" />
                  <p className="text-gray-200 leading-relaxed italic">
                    {feedback.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-3">No feedback available.</p>
          )}
        </div>

        <FeedbackForm 
          theme={{ primary: 'from-blue-500 to-blue-600', }} 
          onSubmit={submitFeedbackMutation.mutate}
          isSubmitting={submitFeedbackMutation.isPending}
        />
      </div>
    </section>
  );
};

export default Feedback;