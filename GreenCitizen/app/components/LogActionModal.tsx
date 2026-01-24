'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Notification } from '@/app/components/ui/notification';
import { X, Upload, Loader2, MapPin, Video, Image as ImageIcon, AlertCircle, Sprout, Droplets, Leaf, Recycle, Zap, Globe, Lock, Eye } from 'lucide-react';

const ACTION_TYPES = [
  { value: 'tree_planting', label: 'Tree Planting', icon: Sprout },
  { value: 'conservation_farming', label: 'Conservation Farming', icon: Leaf },
  { value: 'recycling', label: 'Recycling', icon: Recycle },
  { value: 'water_conservation', label: 'Water Conservation', icon: Droplets },
  { value: 'community_cleanup', label: 'Community Cleanup', icon: Zap },
  { value: 'other', label: 'Other', icon: Globe },
];

const PRIVACY_SETTINGS = [
  { value: 'private', label: 'Private (Only me)', icon: Lock },
  { value: 'anonymous', label: 'Anonymous (Community, no name)', icon: Eye },
  { value: 'public', label: 'Public (Community + my name)', icon: Globe },
];

interface LogActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onActionLogged: () => void;
}

export default function LogActionModal({
  isOpen,
  onClose,
  userId,
  onActionLogged,
}: LogActionModalProps) {
  const supabase = createClient();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    action_type: 'tree_planting',
    custom_action: '',
    description: '',
    recorded_at: new Date().toISOString().split('T')[0],
    recorded_time: new Date().toTimeString().slice(0, 5),
    privacy_setting: 'anonymous' as const,
    gps_lat: null as number | null,
    gps_lng: null as number | null,
  });

  const [files, setFiles] = useState({
    video: null as File | null,
    photos: [] as File[],
  });

  const [previews, setPreviews] = useState({
    video: null as string | null,
    photos: [] as string[],
  });

  // Get GPS location on mount
  React.useEffect(() => {
    if (isOpen && !formData.gps_lat) {
      captureGPS();
    }
  }, [isOpen]);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          gps_lat: position.coords.latitude,
          gps_lng: position.coords.longitude,
        }));
        setGeoLoading(false);
      },
      (err) => {
        setError(`Could not get location: ${err.message}`);
        setGeoLoading(false);
      }
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be smaller than 100MB');
      return;
    }

    setFiles((prev) => ({ ...prev, video: file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({ ...prev, video: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handlePhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.photos.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('All files must be images');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each photo must be smaller than 10MB');
        return false;
      }
      return true;
    });

    setFiles((prev) => ({ ...prev, photos: [...prev.photos, ...validFiles] }));

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          photos: [...prev.photos, e.target?.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!files.video) {
      setError('Video is required');
      return;
    }

    if (!formData.gps_lat || !formData.gps_lng) {
      setError('Location is required. Please enable geolocation.');
      return;
    }

    if (formData.action_type === 'other' && !formData.custom_action.trim()) {
      setError('Please describe what you did');
      return;
    }

    setLoading(true);

    try {
      // Upload video
      const videoFileName = `${userId}/${Date.now()}_${files.video.name}`;
      const { error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, files.video);

      if (videoUploadError) throw videoUploadError;

      const { data: videoData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      const video_url = videoData.publicUrl;

      // Upload photos
      const photo_urls: string[] = [];
      for (const photo of files.photos) {
        const photoFileName = `${userId}/${Date.now()}_${Math.random()}_${photo.name}`;
        const { error: photoUploadError } = await supabase.storage
          .from('photos')
          .upload(photoFileName, photo);

        if (photoUploadError) throw photoUploadError;

        const { data: photoData } = supabase.storage
          .from('photos')
          .getPublicUrl(photoFileName);

        photo_urls.push(photoData.publicUrl);
      }

      // Combine date and time
      const recorded_at = new Date(
        `${formData.recorded_at}T${formData.recorded_time}:00Z`
      ).toISOString();

      // Determine final action type
      const finalActionType = formData.action_type === 'other' ? formData.custom_action : formData.action_type;

      // Insert action
      const { error: insertError } = await supabase.from('actions').insert([
        {
          user_id: userId,
          action_type: finalActionType,
          description: formData.description || null,
          video_url,
          photo_urls: photo_urls.length > 0 ? photo_urls : null,
          gps_lat: formData.gps_lat,
          gps_lng: formData.gps_lng,
          recorded_at,
          privacy_setting: formData.privacy_setting,
          verification_level: 'pending',
          points: 2,
        },
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onActionLogged();
        onClose();
        // Reset form
        setFormData({
          action_type: 'tree_planting',
          custom_action: '',
          description: '',
          recorded_at: new Date().toISOString().split('T')[0],
          recorded_time: new Date().toTimeString().slice(0, 5),
          privacy_setting: 'anonymous',
          gps_lat: null,
          gps_lng: null,
        });
        setFiles({ video: null, photos: [] });
        setPreviews({ video: null, photos: [] });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log action');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-bg-primary border border-border-primary">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between border-b border-border-primary p-4 sm:p-6 bg-bg-primary">
            <h2 className="text-lg font-bold text-primary sm:text-xl">
              Log Environmental Action
            </h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors p-1 hover:bg-bg-secondary rounded"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
          >
            <CardContent className="space-y-4 p-4 sm:p-6 bg-bg-primary">
              {error && (
                <div className="flex gap-2 notification notification-error p-3 rounded-lg border border-red-300">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex gap-2 notification notification-success p-3 rounded-lg border border-green-300">
                  <div className="text-sm">Action logged successfully! Pending verification.</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Action Type */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    What did you do? *
                  </label>
                  <select
                    name="action_type"
                    value={formData.action_type}
                    onChange={handleInputChange}
                    className="input bg-bg-secondary text-primary border border-border-secondary"
                    required
                  >
                    {ACTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Action Input */}
                {formData.action_type === 'other' && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Describe your action *
                    </label>
                    <Input
                      type="text"
                      name="custom_action"
                      value={formData.custom_action}
                      onChange={handleInputChange}
                      placeholder="e.g., Solar panel installation, Waste reduction initiative"
                      maxLength={50}
                      required
                      className="bg-bg-secondary text-primary border border-border-secondary"
                    />
                    <p className="text-xs text-tertiary mt-1">
                      {formData.custom_action.length}/50
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Description (Max 200 characters)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What did you do? Why does it matter? Who did you help?"
                    maxLength={200}
                    className="input bg-bg-secondary text-primary border border-border-secondary resize-none min-h-24"
                  />
                  <p className="text-xs text-tertiary mt-1">
                    {formData.description.length}/200
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      name="recorded_at"
                      value={formData.recorded_at}
                      onChange={handleInputChange}
                      className="bg-bg-secondary text-primary border border-border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Time *
                    </label>
                    <Input
                      type="time"
                      name="recorded_time"
                      value={formData.recorded_time}
                      onChange={handleInputChange}
                      className="bg-bg-secondary text-primary border border-border-secondary"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-primary">
                      Location (GPS) *
                    </label>
                    <button
                      type="button"
                      onClick={captureGPS}
                      disabled={geoLoading}
                      className="text-xs text-primary hover:underline disabled:opacity-50"
                    >
                      {geoLoading ? 'Capturing...' : 'Recapture'}
                    </button>
                  </div>
                  {formData.gps_lat && formData.gps_lng ? (
                    <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg text-xs sm:text-sm border border-primary/20">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-secondary">
                        {formData.gps_lat.toFixed(4)}, {formData.gps_lng.toFixed(4)}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-xs border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200">
                      Enable location to continue
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <Video className="inline h-4 w-4 mr-1" />
                    Video Evidence *
                  </label>
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-border-secondary rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-bg-secondary"
                  >
                    {files.video ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-primary">
                          {files.video.name}
                        </p>
                        <p className="text-xs text-tertiary">
                          {(files.video.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-6 w-6 mx-auto text-tertiary" />
                        <p className="text-sm font-semibold text-primary">Click to upload video</p>
                        <p className="text-xs text-tertiary">MP4, MOV, WebM • Max 100MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </div>

                {/* Photos Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <ImageIcon className="inline h-4 w-4 mr-1" />
                    Photos (Optional, Max 5)
                  </label>
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="border-2 border-dashed border-border-secondary rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-bg-secondary"
                  >
                    {files.photos.length > 0 ? (
                      <p className="text-sm font-semibold text-primary">
                        {files.photos.length} photo(s) selected
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-6 w-6 mx-auto text-tertiary" />
                        <p className="text-sm font-semibold text-primary">Click to add photos</p>
                        <p className="text-xs text-tertiary">JPG, PNG, WebP • Max 10MB each</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosSelect}
                    className="hidden"
                  />

                  {/* Photo previews */}
                  {previews.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {previews.photos.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx}`}
                            className="w-full h-24 object-cover rounded-lg border border-border-secondary"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Privacy Setting
                  </label>
                  <select
                    name="privacy_setting"
                    value={formData.privacy_setting}
                    onChange={handleInputChange}
                    className="input bg-bg-secondary text-primary border border-border-secondary"
                  >
                    {PRIVACY_SETTINGS.map((setting) => (
                      <option key={setting.value} value={setting.value}>
                        {setting.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-tertiary mt-2">
                    Your privacy preference determines who can see this action on community features.
                  </p>
                </div>
              </form>
            </CardContent>
          </div>

          {/* Footer - Fixed */}
          <div className="border-t border-border-primary p-4 sm:p-6 bg-bg-primary flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border-secondary text-primary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 bg-primary text-white hover:bg-primary-dark"
              disabled={loading || !files.video || !formData.gps_lat}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Log Action'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}