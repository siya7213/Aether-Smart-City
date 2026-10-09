import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  ThumbsUp, 
  PlusCircle, 
  CheckCircle2, 
  Hotel, 
  UtensilsCrossed, 
  Car, 
  Landmark as LandmarkIcon,
  BadgeCheck,
  Sparkles
} from 'lucide-react';
import { CityInfo, LanguageCode, ReviewItem } from '../types';
import { t } from '../utils/i18n';

interface ModuleExploreProps {
  currentCity: CityInfo;
  currentLang: LanguageCode;
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
}

export const ModuleExplore: React.FC<ModuleExploreProps> = ({
  currentCity,
  currentLang,
  reviews,
  onAddReview,
}) => {
  // Budget Estimator State
  const [dailyBudget, setDailyBudget] = useState<number>(3500);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<'backpacker' | 'smart' | 'heritage' | 'luxury'>('smart');

  // Resident Status State
  const [isResidentVerified, setIsResidentVerified] = useState<boolean>(false);
  const [residentName, setResidentName] = useState<string>('');

  // Review Feed State
  const [activeTab, setActiveTab] = useState<'tourist' | 'residential'>('tourist');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newCategory, setNewCategory] = useState('Urban Experience');

  const totalSpend = dailyBudget * durationDays;

  // Breakdown formulas
  const accommodation = Math.round(totalSpend * 0.4);
  const dining = Math.round(totalSpend * 0.25);
  const mobility = Math.round(totalSpend * 0.2);
  const sightseeing = Math.round(totalSpend * 0.15);

  const handleVerifyCitizen = () => {
    setIsResidentVerified(true);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const review: ReviewItem = {
      id: `${currentCity.id}-rev-${Date.now()}`,
      cityId: currentCity.id,
      author: newAuthor.trim() || (isResidentVerified ? `${currentCity.name} Resident` : 'City Visitor'),
      isVerifiedResident: isResidentVerified,
      residentBadgeId: isResidentVerified ? `${currentCity.name.slice(0, 3).toUpperCase()}-RESIDENT` : undefined,
      type: isResidentVerified ? 'residential' : activeTab,
      title: newTitle.trim(),
      content: newContent.trim(),
      rating: newRating,
      timestamp: 'Just now',
      upvotes: 1,
      categoryTag: newCategory,
    };

    onAddReview(review);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
  };

  const filteredReviews = reviews.filter((r) => r.type === activeTab);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                City Guide & Reviews
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('budget_estimator_title', currentLang)} & Reviews
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Plan your travel spend, estimate costs, and read real experiences from both visitors and local residents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-black shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('submit_review', currentLang)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Grid: Budget Estimator & Resident Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Budget Estimator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span>{t('budget_estimator_title', currentLang)}</span>
              </h3>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Estimated Costs (₹)
              </span>
            </div>

            {/* Travel Style Selector */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { id: 'backpacker', label: 'Budget', budget: 1500 },
                { id: 'smart', label: 'Comfort', budget: 3500 },
                { id: 'heritage', label: 'Premium', budget: 7500 },
                { id: 'luxury', label: 'Luxury', budget: 14000 },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setTravelStyle(style.id as any);
                    setDailyBudget(style.budget);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    travelStyle === style.id
                      ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">{t('daily_budget', currentLang)}</span>
                  <span className="text-cyan-300 font-bold">₹{dailyBudget.toLocaleString()} / day</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="25000"
                  step="500"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">{t('stay_duration', currentLang)}</span>
                  <span className="text-cyan-300 font-bold">{durationDays} {t('days', currentLang)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Allocation Breakdown Cards */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {t('est_total', currentLang)}
              </span>
              <span className="text-xl font-extrabold text-cyan-300">
                ₹{totalSpend.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Hotel className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('accommodation', currentLang)}</span>
                </div>
                <div className="text-sm font-bold text-white">₹{accommodation.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">40% share</div>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('dining', currentLang)}</span>
                </div>
                <div className="text-sm font-bold text-white">₹{dining.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">25% share</div>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('mobility', currentLang)}</span>
                </div>
                <div className="text-sm font-bold text-white">₹{mobility.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">20% share</div>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <LandmarkIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('sightseeing', currentLang)}</span>
                </div>
                <div className="text-sm font-bold text-white">₹{sightseeing.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">15% share</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resident Verification Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>{t('resident_badge_title', currentLang)}</span>
              </h3>
              <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Local Perspective
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you a resident of <b>{currentCity.name}</b>? Verify your local status to post genuine residential insights about water, traffic, and neighborhood safety.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Your Area / Locality in {currentCity.name}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kothrud, Bandra, Indiranagar, Mansarovar..."
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleVerifyCitizen}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isResidentVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-black shadow-md'
                }`}
              >
                {isResidentVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified as {currentCity.name} Resident</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Verify as Resident</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {isResidentVerified ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>You can now post verified local reviews with the official Resident Badge.</span>
            </div>
          ) : (
            <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-slate-400 text-center">
              Tap verify to unlock resident feedback badges for {currentCity.name}.
            </div>
          )}
        </div>
      </div>

      {/* Dual-Tab Review Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tourist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tourist'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              🌟 {t('tourist_pulse', currentLang)} ({reviews.filter((r) => r.type === 'tourist').length})
            </button>
            <button
              onClick={() => setActiveTab('residential')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'residential'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              🏡 {t('residential_pulse', currentLang)} ({reviews.filter((r) => r.type === 'residential').length})
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Community feedback for <span className="text-white font-bold">{currentCity.name}</span>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl border transition-all ${
                rev.isVerifiedResident
                  ? 'bg-slate-900/80 border-amber-500/30 hover:border-amber-400/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{rev.author}</span>
                    {rev.isVerifiedResident ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <BadgeCheck className="w-3 h-3 text-amber-400" />
                        Verified Resident
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        Visitor
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{rev.timestamp} • {rev.categoryTag}</span>
                </div>

                <div className="text-amber-400 text-xs font-bold">
                  {'⭐'.repeat(rev.rating)}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1.5">{rev.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rev.content}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span className="text-slate-500">
                  {rev.isVerifiedResident ? `${currentCity.name} Local` : 'Verified Travel Review'}
                </span>
                <button
                  onClick={() => rev.upvotes++}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Helpful ({rev.upvotes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                {t('submit_review', currentLang)} for {currentCity.name}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostReview} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Deshmukh"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great public transport, peaceful evening walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details on food, local transport, family safety, or neighborhood tips..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
                    <option value={3}>⭐⭐⭐ (3 / 5)</option>
                    <option value={2}>⭐⭐ (2 / 5)</option>
                    <option value={1}>⭐ (1 / 5)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Topic</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Sightseeing & Culture">Sightseeing & Culture</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Public Transit">Public Transit</option>
                    <option value="Neighborhood Safety">Neighborhood Safety</option>
                    <option value="General Living">General Living</option>
                  </select>
                </div>
              </div>

              {isResidentVerified && (
                <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Will be published with the <b>Verified Local Resident</b> badge.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
