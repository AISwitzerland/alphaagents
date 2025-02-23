import { DocumentUpload } from '@/components/documents/DocumentUpload';

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dokument hochladen</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <DocumentUpload source="dashboard" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Hinweise</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unterstützte Formate</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• PDF-Dokumente (.pdf)</li>
                <li>• Bilder (.jpg, .jpeg, .png)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Maximale Dateigröße</h3>
              <p className="mt-2 text-sm text-gray-600">20 MB pro Datei</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Verarbeitung</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Automatische Dokumentenklassifizierung</li>
                <li>• Extraktion relevanter Informationen</li>
                <li>• OCR für eingescannte Dokumente</li>
                <li>• Qualitätsprüfung der Daten</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nach dem Upload</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Sie erhalten eine Bestätigung per E-Mail</li>
                <li>• Der Verarbeitungsfortschritt wird angezeigt</li>
                <li>• Das Dokument erscheint in der Dokumentenübersicht</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 