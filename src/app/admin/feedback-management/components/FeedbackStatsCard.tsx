import React from 'react';
import { FeedbackStatistics } from '../../../../types/feedback';

export interface FeedbackStatsCardProps {
  statistics: FeedbackStatistics;
}

/**
 * Komponente zur Darstellung von Feedback-Statistiken in Karten-Form
 */
const FeedbackStatsCard: React.FC<FeedbackStatsCardProps> = ({ statistics }) => {
  // Am häufigsten Feedback erhaltene Dokumenttypen (Top 3)
  const topDocumentTypes = Object.entries(statistics.feedback_by_document_type)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Trenddiagramm für die letzten 7 Tage
  const maxTrendValue = Math.max(...statistics.recent_trends.map(t => t.count));
  const trendHeight = 50; // Höhe des Trenddiagramms in Pixeln

  return (
    <>
      {/* Statistik-Karten in einem Grid */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center">
          <div className="rounded-md bg-blue-50 p-3 mr-4">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900">{statistics.total_feedback_count}</div>
            <div className="text-sm text-gray-500">Gesamt-Feedback</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center">
          <div className="rounded-md bg-yellow-50 p-3 mr-4">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900">{statistics.pending_feedback_count}</div>
            <div className="text-sm text-gray-500">Ausstehende Rückmeldungen</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center">
          <div className="rounded-md bg-green-50 p-3 mr-4">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900">{statistics.applied_feedback_count}</div>
            <div className="text-sm text-gray-500">Angewendetes Feedback</div>
          </div>
        </div>
      </div>

      {/* Zusätzliche Statistikkarten */}
      <div className="bg-white shadow rounded-lg p-4 col-span-3">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Feedback nach Dokumenttyp</h3>
        {topDocumentTypes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {topDocumentTypes.map(([docType, count]) => (
              <div key={docType} className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-medium text-gray-500">{docType}</div>
                <div className="mt-1 flex items-center">
                  <div className="text-lg font-semibold text-gray-900">{count}</div>
                  <div className="ml-2 text-xs text-gray-500">
                    ({Math.round((count / statistics.total_feedback_count) * 100)}%)
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(count / statistics.total_feedback_count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Keine Dokumenttypen mit Feedback gefunden.</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-2">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Feedback nach Typ</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-500">Falsche Klassifizierung</div>
            <div className="text-lg font-semibold text-gray-900">
              {statistics.feedback_by_type.wrong_classification}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ 
                  width: `${(statistics.feedback_by_type.wrong_classification / statistics.total_feedback_count) * 100}%` 
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-500">Korrekte Klassifizierung</div>
            <div className="text-lg font-semibold text-gray-900">
              {statistics.feedback_by_type.correct_classification}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${(statistics.feedback_by_type.correct_classification / statistics.total_feedback_count) * 100}%` 
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-500">Niedrige Konfidenz</div>
            <div className="text-lg font-semibold text-gray-900">
              {statistics.feedback_by_type.low_confidence}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ 
                  width: `${(statistics.feedback_by_type.low_confidence / statistics.total_feedback_count) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Durchschnittliche Konfidenz</h3>
        <div className="flex items-center">
          <div className="text-2xl font-semibold text-gray-900">
            {statistics.average_confidence_score.toFixed(2)}
          </div>
          <div className="ml-2 text-sm text-gray-500">/ 100</div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${
              statistics.average_confidence_score > 80 ? 'bg-green-500' : 
              statistics.average_confidence_score > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${statistics.average_confidence_score}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 col-span-3">
        <h3 className="text-base font-semibold text-gray-700 mb-2">Feedback-Trend (letzte 7 Tage)</h3>
        <div className="flex items-end h-16 space-x-2 mt-4">
          {statistics.recent_trends.map((trend, index) => {
            const barHeight = maxTrendValue > 0 
              ? Math.max((trend.count / maxTrendValue) * trendHeight, 4) 
              : 4;
            
            const day = new Date(trend.date).toLocaleDateString('de-DE', { weekday: 'short' });
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${barHeight}px` }}
                />
                <div className="text-xs text-gray-500 mt-1">{day}</div>
                <div className="text-xs font-medium text-gray-700">{trend.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FeedbackStatsCard; 