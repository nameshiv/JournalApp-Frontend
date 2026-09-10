// import { SentimentBadge } from '@/components/journal/JournalCard';

// import { Smile, Meh, Frown, Angry } from 'lucide-react';

// import { Loading } from '@/components/common/Feedback';

// import { useAuth } from '@/hooks/useAuth';

// import type { JournalEntry } from '@/types/journal';

// interface SentimentCardProps {
//   entries: JournalEntry[];
//   loading: boolean;
// }

// export default function SentimentCard({
//   entries,
//   loading,
// }: SentimentCardProps) {
//   const { user } = useAuth();

//   const sentimentEnabled = !!user?.sentimentAnalysis;

//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);

//   const recent = entries.filter((e) => {
//     const d = new Date(
//       e.date || e.createdDate || ''
//     );

//     return !isNaN(d.getTime()) && d >= weekAgo;
//   });

//   const withSentiment = recent.filter(
//     (e) => e.sentiment
//   );

//   let dominant: string | null = null;

//   /*
//    * Find the most frequent sentiment.
//    *
//    * If two or more sentiments have the same count,
//    * choose the sentiment from the most recent entry.
//    */
//   if (
//     sentimentEnabled &&
//     withSentiment.length > 0
//   ) {
//     const counts: Record<string, number> = {};

//     withSentiment.forEach((e) => {
//       const key = (e.sentiment || '').toUpperCase();

//       counts[key] = (counts[key] || 0) + 1;
//     });

//     const maxCount = Math.max(
//       ...Object.values(counts)
//     );

//     /*
//      * Sort entries from newest to oldest.
//      */
//     const sortedRecent = [...withSentiment].sort(
//       (a, b) =>
//         new Date(
//           b.date || b.createdDate || ''
//         ).getTime() -
//         new Date(
//           a.date || a.createdDate || ''
//         ).getTime()
//     );

//     /*
//      * Find the most recent entry whose sentiment
//      * has the highest count.
//      */
//     const mostRecentTiedEntry =
//       sortedRecent.find((e) => {
//         const key = (
//           e.sentiment || ''
//         ).toUpperCase();

//         return counts[key] === maxCount;
//       });

//     dominant =
//       mostRecentTiedEntry?.sentiment?.toUpperCase() ||
//       null;
//   }

//   const moodIcons: Record<string, JSX.Element> = {
//     HAPPY: (
//       <Smile
//         size={18}
//         className="text-success"
//       />
//     ),

//     SAD: (
//       <Frown
//         size={18}
//         className="text-info"
//       />
//     ),

//     ANGRY: (
//       <Angry
//         size={18}
//         className="text-error"
//       />
//     ),

//     NEUTRAL: (
//       <Meh
//         size={18}
//         className="text-ink-secondary"
//       />
//     ),

//     ANXIOUS: (
//       <Frown
//         size={18}
//         className="text-warning"
//       />
//     ),
//   };

//   return (
//     <div className="card p-5">
//       <h2 className="text-sm font-semibold text-ink mb-3">
//         Your week
//       </h2>

//       {/* Sentiment analysis is disabled */}
//       {!sentimentEnabled && (
//         <div>
//           <p className="text-sm text-ink-secondary mb-2">
//             Sentiment analysis is disabled
//           </p>

//           <p className="text-xs text-ink-muted">
//             Enable it in Settings to see your weekly
//             mood.
//           </p>
//         </div>
//       )}

//       {/* Sentiment analysis is enabled */}
//       {sentimentEnabled && (
//         <>
//           {loading && (
//             <Loading
//               message="Analyzing your week..."
//               className="!py-4"
//             />
//           )}

//           {!loading && dominant && (
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 {moodIcons[dominant] || (
//                   <Meh
//                     size={18}
//                     className="text-ink-secondary"
//                   />
//                 )}

//                 <SentimentBadge
//                   sentiment={dominant}
//                 />
//               </div>

//               <p className="text-xs text-ink-muted">
//                 Based on {withSentiment.length}{' '}
//                 {withSentiment.length === 1
//                   ? 'entry'
//                   : 'entries'}{' '}
//                 this week
//               </p>
//             </div>
//           )}

//           {!loading &&
//             !dominant &&
//             withSentiment.length === 0 && (
//               <div>
//                 <p className="text-sm text-ink-secondary mb-2">
//                   Not enough data yet
//                 </p>

//                 <p className="text-xs text-ink-muted">
//                   Write entries with a sentiment to
//                   see your weekly mood.
//                 </p>
//               </div>
//             )}
//         </>
//       )}
//     </div>
//   );
// }


// import { SentimentBadge } from '@/components/journal/JournalCard';

// import { Smile, Meh, Frown, Angry } from 'lucide-react';

// import { Loading } from '@/components/common/Feedback';

// import { useAuth } from '@/hooks/useAuth';

// import type { JournalEntry } from '@/types/journal';

// interface SentimentCardProps {
//   entries: JournalEntry[];
//   loading: boolean;
// }

// export default function SentimentCard({
//   entries,
//   loading,
// }: SentimentCardProps) {
//   const { user } = useAuth();
//   const sentimentEnabled = !!user?.sentimentAnalysis;

//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);

//   const recent = entries.filter((e) => {
//     const d = new Date(e.date || e.createdDate || '');
//     return !isNaN(d.getTime()) && d >= weekAgo;
//   });

//   const withSentiment = recent.filter((e) => e.sentiment);

//   let dominant: string | null = null;

//   /**
//    * Find the most frequent sentiment.
//    *
//    * If two or more sentiments have the same count,
//    * choose the sentiment from the most recent entry.
//    */
//   if (sentimentEnabled && withSentiment.length > 0) {
//     const counts: Record<string, number> = {};

//     withSentiment.forEach((e) => {
//       const key = (e.sentiment || '').toUpperCase();
//       counts[key] = (counts[key] || 0) + 1;
//     });

//     const maxCount = Math.max(...Object.values(counts));

//     /**
//      * Sort entries from newest to oldest.
//      */
//     const sortedRecent = [...withSentiment].sort(
//       (a, b) =>
//         new Date(
//           b.date || b.createdDate || ''
//         ).getTime() -
//         new Date(
//           a.date || a.createdDate || ''
//         ).getTime()
//     );

//     /**
//      * Find the most recent entry whose sentiment
//      * has the highest count.
//      */
//     const mostRecentTiedEntry = sortedRecent.find((e) => {
//       const key = (e.sentiment || '').toUpperCase();
//       return counts[key] === maxCount;
//     });

//     dominant =
//       mostRecentTiedEntry?.sentiment?.toUpperCase() || null;
//   }

//   /**
//    * Count sentiments for the visual bar graph.
//    */
//   const sentimentCounts: Record<string, number> = {};

//   if (sentimentEnabled) {
//     withSentiment.forEach((e) => {
//       const key = (e.sentiment || '').toUpperCase();

//       if (key) {
//         sentimentCounts[key] =
//           (sentimentCounts[key] || 0) + 1;
//       }
//     });
//   }

//   const maxSentimentCount =
//     Math.max(
//       ...Object.values(sentimentCounts),
//       1
//     );

//   const moodIcons: Record<string, JSX.Element> = {
//     HAPPY: (
//       <Smile
//         size={18}
//         className="text-success"
//       />
//     ),

//     SAD: (
//       <Frown
//         size={18}
//         className="text-info"
//       />
//     ),

//     ANGRY: (
//       <Angry
//         size={18}
//         className="text-error"
//       />
//     ),

//     NEUTRAL: (
//       <Meh
//         size={18}
//         className="text-ink-secondary"
//       />
//     ),

//     ANXIOUS: (
//       <Frown
//         size={18}
//         className="text-warning"
//       />
//     ),
//   };

//   /**
//    * Styling for the sentiment bars.
//    */
//   const moodBarStyles: Record<string, string> = {
//     HAPPY:
//       'bg-success/80 hover:bg-success',

//     SAD:
//       'bg-info/80 hover:bg-info',

//     ANGRY:
//       'bg-error/80 hover:bg-error',

//     NEUTRAL:
//       'bg-ink-secondary/60 hover:bg-ink-secondary',

//     ANXIOUS:
//       'bg-warning/80 hover:bg-warning',
//   };

//   /**
//    * Friendly labels for the graph.
//    */
//   const moodLabels: Record<string, string> = {
//     HAPPY: 'Happy',
//     SAD: 'Sad',
//     ANGRY: 'Angry',
//     NEUTRAL: 'Neutral',
//     ANXIOUS: 'Anxious',
//   };

//   /**
//    * Keep known sentiments in a consistent order,
//    * then add any additional sentiments returned by
//    * the backend.
//    */
//   const knownSentiments = [
//     'HAPPY',
//     'NEUTRAL',
//     'ANXIOUS',
//     'SAD',
//     'ANGRY',
//   ];

//   const graphSentiments = [
//     ...knownSentiments.filter(
//       (sentiment) =>
//         sentimentCounts[sentiment] !== undefined
//     ),
//     ...Object.keys(sentimentCounts).filter(
//       (sentiment) =>
//         !knownSentiments.includes(sentiment)
//     ),
//   ];

//   return (
//     <div className="card p-5">
//       <h2 className="text-sm font-semibold text-ink mb-3">
//         Your week
//       </h2>

//       {/* Sentiment analysis is disabled */}
//       {!sentimentEnabled && (
//         <div className="min-h-[150px] flex flex-col justify-center">
//           <p className="text-sm text-ink-secondary mb-2">
//             Sentiment analysis is disabled
//           </p>

//           <p className="text-xs text-ink-muted">
//             Enable it in Settings to see your weekly
//             mood.
//           </p>
//         </div>
//       )}

//       {/* Sentiment analysis is enabled */}
//       {sentimentEnabled && (
//         <>
//           {loading && (
//             <Loading
//               message="Analyzing your week..."
//               className="!py-4"
//             />
//           )}

//           {!loading && dominant && (
//             <div>
//               {/* Dominant sentiment */}
//               <div className="flex items-center gap-2 mb-4">
//                 {moodIcons[dominant] || (
//                   <Meh
//                     size={18}
//                     className="text-ink-secondary"
//                   />
//                 )}

//                 <SentimentBadge sentiment={dominant} />
//               </div>

//               {/* Sentiment bar graph */}
//               {/* Sentiment bar graph */}
// {graphSentiments.length > 0 && (
//   <div className="mt-2">
//     <div
//       className="
//         rounded-2xl
//         border
//         border-ink/10
//         bg-ink/[0.025]
//         px-3
//         pt-3
//         pb-3
//       "
//     >
//       <div className="flex items-end justify-between gap-2 h-[130px]">
//         {graphSentiments.map((sentiment) => {
//           const count =
//             sentimentCounts[sentiment] || 0;

//           const height = Math.max(
//             12,
//             (count / maxSentimentCount) * 100
//           );

//           const barClass =
//             moodBarStyles[sentiment] ||
//             'bg-primary/70 hover:bg-primary';

//           const label =
//             moodLabels[sentiment] ||
//             sentiment
//               .toLowerCase()
//               .replace(
//                 /\b\w/g,
//                 (char) => char.toUpperCase()
//               );

//           return (
//             <div
//               key={sentiment}
//               className="
//                 flex-1
//                 h-full
//                 flex
//                 flex-col
//                 items-center
//                 justify-end
//                 group
//               "
//             >
//               {/* Count */}
//               <span
//                 className="
//                   text-[10px]
//                   font-medium
//                   text-ink-muted
//                   mb-1
//                   opacity-0
//                   group-hover:opacity-100
//                   transition-opacity
//                 "
//               >
//                 {count}
//               </span>

//               {/* Bar */}
//               <div
//                 className={`
//                   w-full
//                   max-w-[34px]
//                   rounded-t-xl
//                   transition-all
//                   duration-500
//                   ease-out
//                   ${barClass}
//                 `}
//                 style={{
//                   height: `${height}%`,
//                 }}
//                 title={`${label}: ${count} ${
//                   count === 1 ? 'entry' : 'entries'
//                 }`}
//               />
//             </div>
//           );
//         })}
//       </div>

//       {/* Labels */}
//       <div className="flex items-start justify-between gap-2 mt-2">
//         {graphSentiments.map((sentiment) => {
//           const label =
//             moodLabels[sentiment] ||
//             sentiment
//               .toLowerCase()
//               .replace(
//                 /\b\w/g,
//                 (char) => char.toUpperCase()
//               );

//           return (
//             <div
//               key={sentiment}
//               className="
//                 flex-1
//                 flex
//                 flex-col
//                 items-center
//                 gap-1
//                 min-w-0
//               "
//             >
//               <div className="text-ink-muted">
//                 {moodIcons[sentiment] || (
//                   <Meh
//                     size={14}
//                     className="text-ink-secondary"
//                   />
//                 )}
//               </div>

//               <span className="text-[9px] text-ink-muted truncate max-w-full">
//                 {label}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </div>
// )}

//               <p className="text-xs text-ink-muted mt-4">
//                 Based on {withSentiment.length}{' '}
//                 {withSentiment.length === 1
//                   ? 'entry'
//                   : 'entries'}{' '}
//                 this week
//               </p>
//             </div>
//           )}

//           {/* No sentiment yet */}
//           {!loading &&
//             !dominant &&
//             withSentiment.length === 0 && (
//               <div className="min-h-[150px] flex flex-col justify-center">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-9 h-9 rounded-xl bg-surface-muted flex items-center justify-center">
//                     <Meh
//                       size={20}
//                       className="text-ink-muted"
//                     />
//                   </div>

//                   <p className="text-sm font-medium text-ink-secondary">
//                     Not enough data yet
//                   </p>
//                 </div>

//                 <p className="text-xs text-ink-muted">
//                   Write entries with a sentiment to
//                   see your weekly mood.
//                 </p>
//               </div>
//             )}
//         </>
//       )}
//     </div>
//   );
// }



import { SentimentBadge } from '@/components/journal/JournalCard';

import {
  Smile,
  Meh,
  Frown,
  Angry,
} from 'lucide-react';

import { Loading } from '@/components/common/Feedback';

import { useAuth } from '@/hooks/useAuth';

interface SentimentCardProps {
  loading: boolean;
}

export default function SentimentCard({
  loading,
}: SentimentCardProps) {

  const { user } = useAuth();

  /*
   * Sentiment analysis setting.
   */
  const sentimentEnabled =
    !!user?.sentimentAnalysis;

  /*
   * IMPORTANT:
   *
   * React does NOT calculate the dominant sentiment.
   *
   * It simply reads the value calculated by the
   * backend scheduler.
   *
   */
  const dominant =
    user?.weeklySentiment?.toUpperCase() || null;

  const sentimentCounts =
    user?.weeklySentimentCounts ?? {};

  /*
   * Find the largest count.
   *
   * This is NOT used to determine the dominant sentiment.
   *
   * The backend already did that.
   *
   * This is only used to make the graph bars proportional.
   */
  const maxSentimentCount = Math.max(
    ...Object.values(sentimentCounts),
    1
  );

  /*
   * Icons for each sentiment.
   */
  const moodIcons: Record<string, JSX.Element> = {
    HAPPY: (
      <Smile
        size={18}
        className="text-success"
      />
    ),

    SAD: (
      <Frown
        size={18}
        className="text-info"
      />
    ),

    ANGRY: (
      <Angry
        size={18}
        className="text-error"
      />
    ),

    NEUTRAL: (
      <Meh
        size={18}
        className="text-ink-secondary"
      />
    ),

    ANXIOUS: (
      <Frown
        size={18}
        className="text-warning"
      />
    ),

    CALM: (
      <Smile
        size={18}
        className="text-success"
      />
    ),
  };

  /*
   * Bar styles.
   */
  const moodBarStyles: Record<string, string> = {
    HAPPY:
      'bg-success',

    SAD:
      'bg-info',

    ANGRY:
      'bg-error',

    NEUTRAL:
      'bg-ink-secondary',

    ANXIOUS:
      'bg-warning',

    CALM:
      'bg-success',
  };

  /*
   * Display names.
   */
  const moodLabels: Record<string, string> = {
    HAPPY: 'Happy',
    SAD: 'Sad',
    ANGRY: 'Angry',
    NEUTRAL: 'Neutral',
    ANXIOUS: 'Anxious',
    CALM: 'Calm',
  };

 
  const knownSentiments = [
    'HAPPY',
    'CALM',
    'NEUTRAL',
    'ANXIOUS',
    'SAD',
    'ANGRY',
  ];

  /*
   * Known sentiments that exist in the backend counts.
   */
  const graphSentiments = knownSentiments.filter(
    (sentiment) =>
      sentimentCounts[sentiment] !== undefined
  );

  /*
   * Also support any unexpected/new sentiment
   * returned by the backend.
   */
  const unknownSentiments = Object.keys(
    sentimentCounts
  ).filter(
    (sentiment) =>
      !knownSentiments.includes(
        sentiment.toUpperCase()
      )
  );

  const allGraphSentiments = [
    ...graphSentiments,
    ...unknownSentiments,
  ];

  return (
    <div className="card p-5">

      {/* Header */}
      <h2 className="text-sm font-semibold text-ink mb-3">
        Your week
      </h2>

      {/* Sentiment analysis disabled */}
      {!sentimentEnabled && (
        <div className="min-h-[180px] flex flex-col justify-center">

          <p className="text-sm text-ink-secondary mb-2">
            Sentiment analysis is disabled
          </p>

          <p className="text-xs text-ink-muted">
            Enable it in Settings to see your weekly mood.
          </p>

        </div>
      )}

      {/* Sentiment analysis enabled */}
      {sentimentEnabled && (
        <>

          {/* Loading */}
          {loading && (
            <Loading
              message="Analyzing your week..."
              className="!py-4"
            />
          )}

          {/* Weekly sentiment */}
          {!loading && dominant && (
            <div>

              <div className="flex items-center gap-2 mb-3">

                {moodIcons[dominant] || (
                  <Meh
                    size={18}
                    className="text-ink-secondary"
                  />
                )}

                <SentimentBadge
                  sentiment={dominant}
                />

              </div>

              <p className="text-xs text-ink-muted mb-4">
                Your most frequent mood this week
              </p>

              {/* Sentiment graph */}
              {allGraphSentiments.length > 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-ink/10
                    bg-ink/[0.025]
                    px-3
                    pt-4
                    pb-3
                  "
                >

                  <div
                    className="
                      h-32
                      flex
                      items-end
                      justify-center
                      gap-4
                    "
                  >

                    {allGraphSentiments.map(
                      (sentiment) => {

                        const key =
                          sentiment.toUpperCase();

                        const count =
                          sentimentCounts[sentiment] ??
                          sentimentCounts[key] ??
                          0;

                        /*
                         * Height is based on the count
                         * received from the backend.
                         *
                         * Example:
                         *
                         * HAPPY = 2 → 100%
                         * SAD = 1   → 50%
                         * ANXIOUS = 1 → 50%
                         */
                        const height =
                          Math.max(
                            12,
                            (count /
                              maxSentimentCount) *
                              100
                          );

                        return (
                          <div
                            key={sentiment}
                            className="
                              flex
                              flex-col
                              items-center
                              justify-end
                              h-full
                              min-w-[34px]
                            "
                          >

                            {/* Count */}
                            <span
                              className="
                                text-[10px]
                                font-medium
                                text-ink-muted
                                mb-1
                              "
                            >
                              {count}
                            </span>

                            {/* Bar */}
                            <div
                              className={`
                                w-7
                                rounded-t-xl
                                transition-all
                                duration-500
                                ${moodBarStyles[key] ||
                                'bg-ink-secondary'}
                              `}
                              style={{
                                height: `${height}%`,
                              }}
                              title={`${moodLabels[key] || key}: ${count}`}
                            />

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* Labels */}
                  <div
                    className="
                      flex
                      justify-center
                      gap-4
                      mt-2
                    "
                  >

                    {allGraphSentiments.map(
                      (sentiment) => {

                        const key =
                          sentiment.toUpperCase();

                        return (
                          <div
                            key={sentiment}
                            className="
                              flex
                              flex-col
                              items-center
                              min-w-[34px]
                            "
                          >

                            <div className="mb-1">
                              {moodIcons[key] || (
                                <Meh
                                  size={16}
                                  className="text-ink-secondary"
                                />
                              )}
                            </div>

                            <span
                              className="
                                text-[9px]
                                text-ink-muted
                                text-center
                              "
                            >
                              {moodLabels[key] ||
                                key}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

          {/* No weekly sentiment */}
          {!loading &&
            !dominant &&
            allGraphSentiments.length === 0 && (
              <div
                className="
                  min-h-[180px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-ink/[0.04]
                    flex
                    items-center
                    justify-center
                    mb-3
                  "
                >
                  <Meh
                    size={20}
                    className="text-ink-muted"
                  />
                </div>

                <p className="text-sm text-ink-secondary mb-2">
                  Not enough data yet
                </p>

                <p className="text-xs text-ink-muted">
                  Write entries with a sentiment to see
                  your weekly mood.
                </p>

              </div>
            )}

        </>
      )}

    </div>
  );
}