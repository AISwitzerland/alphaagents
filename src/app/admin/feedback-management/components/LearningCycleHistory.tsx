import React from 'react';
import { LearningCycle } from '../../../../types/feedback';

export interface LearningCycleHistoryProps {
  cycles: LearningCycle[];
  onViewDetails: (cycleId: string) => void;
}

/**
 * Komponente zur Darstellung des Verlaufs von Lernzyklen
 */
const LearningCycleHistory: React.FC<LearningCycleHistoryProps> = ({ cycles, onViewDetails }) => {
  // Nach Datum sortieren (neueste zuerst)
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.cycle_timestamp).getTime() - new Date(a.cycle_timestamp).getTime()
  );

  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status-Badge anzeigen
  const renderStatusBadge = (status: LearningCycle['status']) => {
    let bgColor = '';
    let textColor = '';
    let label = '';

    switch (status) {
      case 'in_progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'In Bearbeitung';
        break;
      case 'completed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = 'Abgeschlossen';
        break;
      case 'applied':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Angewendet';
        break;
      case 'failed':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Fehlgeschlagen';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        label = status;
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };

  // Zusammenfassung der betroffenen Dokumenttypen aus den letzten 5 Zyklen
  const getAffectedDocumentTypesSummary = () => {
    const documentTypeCounts: Record<string, number> = {};
    
    sortedCycles.slice(0, 5).forEach(cycle => {
      if (cycle.changes_summary && cycle.changes_summary.affected_document_types) {
        cycle.changes_summary.affected_document_types.forEach(docType => {
          documentTypeCounts[docType] = (documentTypeCounts[docType] || 0) + 1;
        });
      }
    });
    
    return Object.entries(documentTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {cycles.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Lernzyklen</h3>
          <p className="mt-1 text-sm text-gray-500">
            Es wurden noch keine Lernzyklen durchgeführt.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Änderungen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notizen
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cycle.cycle_timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cycle.applied_feedback_count}</div>
                      <div className="text-xs text-gray-500">Feedback-Einträge</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cycle.changes_summary ? (
                        <div className="text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              +{cycle.changes_summary.keywords_added}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              -{cycle.changes_summary.keywords_removed}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              ~{cycle.changes_summary.keywords_adjusted}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {cycle.changes_summary.affected_document_types.slice(0, 3).join(', ')}
                            {cycle.changes_summary.affected_document_types.length > 3 && 
                              ` +${cycle.changes_summary.affected_document_types.length - 3} weitere`}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Keine Änderungen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(cycle.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {cycle.cycle_notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onViewDetails(cycle.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Zusammenfassung der betroffenen Dokumenttypen */}
          {sortedCycles.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Häufig betroffene Dokumenttypen (letzte 5 Zyklen)
              </h4>
              <div className="flex flex-wrap gap-2">
                {getAffectedDocumentTypesSummary().map(([docType, count]) => (
                  <span 
                    key={docType}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {docType} <span className="ml-1 text-gray-500">({count})</span>
                  </span>
                ))}
                {getAffectedDocumentTypesSummary().length === 0 && (
                  <span className="text-sm text-gray-500">Keine Dokumenttypen gefunden</span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LearningCycleHistory; 