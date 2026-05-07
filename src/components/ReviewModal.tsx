import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    review: '',
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;

    // Handle Image conversion to Base64
    if (formData.image) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        
        // Check file size (limit to 500KB for Firestore)
        if (formData.image.size > 512 * 1024) {
          throw new Error('Image size too large. Please upload an image smaller than 500KB.');
        }

        reader.readAsDataURL(formData.image);
        finalImageUrl = await base64Promise;
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error processing image');
        setIsSubmitting(false);
        return;
      }
    }

    const path = 'reviews';
    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, path), {
          name: formData.name,
          year: formData.year,
          review: formData.review,
          rating: rating,
          approved: false, // Default to false for admin approval
          createdAt: serverTimestamp(),
          imageUrl: finalImageUrl
        });
      } else {
        // Demo mode: just wait and succeed
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Demo mode: Review recorded locally", {
          name: formData.name,
          year: formData.year,
          review: formData.review,
          rating,
          imageUrl: finalImageUrl
        });
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({ name: '', year: '', review: '', image: null });
        setRating(5);
      }, 3000);
    } catch (error) {
      if (isFirebaseConfigured) {
        handleFirestoreError(error, OperationType.CREATE, path);
      } else {
        console.error("Local submission failed:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100 custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-20"
            >
              <X size={24} className="text-slate-400" />
            </button>

            {isSubmitted ? (
              <div className="p-12 text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 size={40} className="text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Review Submitted!</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Thank you for your valuable feedback. Your review has been sent to our team for approval and will appear on the website soon.
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Share Your Story</h3>
                  <p className="text-slate-500 text-sm font-medium">Your feedback helps thousands of aspirants choose the right path.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Join Year</label>
                      <input
                        required
                        type="text"
                        maxLength={4}
                        pattern="\d{4}"
                        value={formData.year}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 4) setFormData({ ...formData, year: val });
                        }}
                        placeholder="e.g. 2023"
                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoveredRating(s)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(s)}
                          className="transition-transform active:scale-90"
                        >
                          <Star
                            size={32}
                            fill={(hoveredRating || rating) >= s ? '#EAB308' : 'transparent'}
                            className={(hoveredRating || rating) >= s ? 'text-yellow-500' : 'text-slate-200'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Experience</label>
                    <textarea
                      required
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      placeholder="Write your review here..."
                      rows={4}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition text-sm font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Profile Picture (Compulsory)</label>
                    <label className="flex items-center justify-center gap-3 px-5 py-4 bg-brand-50 border-2 border-dashed border-brand-200 rounded-2xl cursor-pointer hover:bg-brand-100 transition-colors group">
                      <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                      <Upload size={18} className="text-brand-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-brand-600">
                        {formData.image ? formData.image.name : 'Upload your photo (required)'}
                      </span>
                    </label>
                    {formData.image && formData.image.size > 512 * 1024 && (
                      <p className="mt-2 text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                        Image too large. Max 500KB allowed.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (formData.image ? formData.image.size > 512 * 1024 : false)}
                    className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-900 transition-all shadow-xl shadow-brand-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
