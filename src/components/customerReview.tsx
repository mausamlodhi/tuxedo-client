'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Review {
    id: number;
    author: string;
    rating: number;
    title: string;
    date: string;
    content: string;
    avatar?: string;
}

interface RatingBreakdown {
    stars: number;
    percentage: number;
    count: number;
}

const CustomerReviewsSection: React.FC = () => {
    const [selectedFit, setSelectedFit] = useState<string>('');
    const fitOptions = ['Runs small', 'True to size', 'Runs large'];
    // Rating breakdown data
    const ratingBreakdown: RatingBreakdown[] = [
        { stars: 5, percentage: 67, count: 670 },
        { stars: 4, percentage: 20, count: 200 },
        { stars: 3, percentage: 7, count: 70 },
        { stars: 2, percentage: 4, count: 40 },
        { stars: 1, percentage: 2, count: 20 }
    ];

    // Sample reviews data
    const reviews: Review[] = [
        {
            id: 1,
            author: 'Steven M',
            rating: 5,
            title: 'Material/Quality good. Deceptive sales practice.',
            date: '2 July 2025',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam risus ligula, auctor vel orci eu, congue mattis ligula. Phasellus et magna erat. Nulla sed porta justo. Etiam elementum sem ante, quis cursus metus consequat nec.'
        },
        {
            id: 2,
            author: 'Steven M',
            rating: 5,
            title: 'Material/Quality good. Deceptive sales practice.',
            date: '2 July 2025',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam risus ligula, auctor vel orci eu, congue mattis ligula. Phasellus et magna erat. Nulla sed porta justo. Etiam elementum sem ante, quis cursus metus consequat nec.'
        },
        {
            id: 3,
            author: 'Steven M',
            rating: 5,
            title: 'Material/Quality good. Deceptive sales practice.',
            date: '2 July 2025',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam risus ligula, auctor vel orci eu, congue mattis ligula. Phasellus et magna erat. Nulla sed porta justo. Etiam elementum sem ante, quis cursus metus consequat nec.'
        }
    ];

    const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
        const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`${sizeClasses} ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                            } fill-current`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header */}
            <h2 className="font-advent text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
                Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column - Rating Summary */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Overall Rating */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            {renderStars(4)}
                            <span className="text-lg font-medium text-gray-900 ml-2">4.3 out of 5</span>
                        </div>
                        <p className="text-sm text-gray-600">1000 ratings</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-3">
                        {ratingBreakdown.map((item) => (
                            <div key={item.stars} className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600 w-12">{item.stars} Star</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gray-800 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Reviews */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Write Review & Fit Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                        {/* Write Review Button */}
                        <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="font-advent font-semibold text-[#000000]">Write a Product Review</span>
                        </button>

                        {/* Fit Filter */}
                        <div className="flex items-center space-x-6">
                            <span className="font-advent text-base font-semibold text-gray-900">How it fits:</span>
                            <div className="flex items-center space-x-6">
                                {fitOptions.map((option) => (
                                    <div key={option} className="flex flex-col items-center">
                                        {/* Top bar */}
                                        <div
                                            className={`h-1 w-20 mb-1 ${selectedFit === option ? 'bg-gray-800' : 'bg-[#D9D9D9]'
                                                }`}
                                        />
                                        {/* Label */}
                                        <button
                                            onClick={() => setSelectedFit(option)}
                                            className="text-sm text-gray-800"
                                        >
                                            {option}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        <h3 className="font-advent text-lg font-medium text-gray-900">Reviews</h3>

                        {reviews.map((review) => (
                            <div key={review.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-b-0">
                                {/* Review Header */}
                                <div className="flex items-start space-x-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-gray-600">
                                            {review.author.charAt(0)}
                                        </span>
                                    </div>

                                    {/* Review Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <h4 className="font-advent font-semibold text-gray-900">{review.author}</h4>
                                            <span className="text-sm text-gray-500">Reviewed on {review.date}</span>
                                        </div>

                                        {/* Rating */}
                                        <div className="mt-1">
                                            {renderStars(review.rating, 'sm')}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="ml-13">
                                    <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* See All Reviews Link */}
                        <div className="pt-4">
                            <button className="text-[#AC845D] hover:text-[#8d6b49] cursor-pointer text-sm font-medium transition-colors">
                                See all reviews →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReviewsSection;