"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface CalendarEvent {
  id: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

interface CalendarData {
  calendar: {
    id: string;
    summary: string;
    description: string;
    primary: boolean;
    accessRole: string;
    timeZone: string;
    backgroundColor?: string;
    foregroundColor?: string;
    selected?: boolean;
  };
  events: CalendarEvent[];
  eventCount: number;
  error?: string;
}

interface ExtractResponse {
  success: boolean;
  totalCalendars: number;
  extractedAt: string;
  timeRange: {
    min: string;
    max?: string | null;
  };
  calendars: CalendarData[];
}

export function CalendarExtractorTest() {
  const [token, setToken] = useState<string>("");
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractResponse | null>(null);
  const [specificCalendarData, setSpecificCalendarData] = useState<any | null>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("primary");
  const [extractMode, setExtractMode] = useState<"all" | "specific">("all");
  const [extractParams, setExtractParams] = useState({
    timeMin: new Date().toISOString().split('T')[0],
    timeMax: "",
    maxResults: 50,
    includeSecondary: true,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }

    const googleConnected = localStorage.getItem("google_connected");
    if (googleConnected === "true") {
      setIsGoogleConnected(true);
    }
  }, []);

  // Save token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }, [token]);

  // Query for extracting calendars
  const extractQuery = api.calendar.extractCalendarsWithEvents.useQuery(
    {
      token,
      timeMin: extractParams.timeMin ? new Date(extractParams.timeMin + 'T00:00:00').toISOString() : new Date().toISOString(),
      timeMax: extractParams.timeMax ? new Date(extractParams.timeMax + 'T23:59:59').toISOString() : undefined,
      maxResults: extractParams.maxResults,
      includeSecondary: extractParams.includeSecondary,
    },
    {
      enabled: false, // Manual trigger
      retry: false,
    }
  );

  // Query for getting available calendars (for dropdown)
  const { data: calendarsData } = api.calendar.getCalendars.useQuery(
    { token },
    { enabled: !!token && isGoogleConnected, retry: false }
  );

  // Query for extracting specific calendar
  const extractSpecificQuery = api.calendar.extractCalendarEvents.useQuery(
    {
      token,
      calendarId: selectedCalendarId,
      timeMin: extractParams.timeMin ? new Date(extractParams.timeMin + 'T00:00:00').toISOString() : new Date().toISOString(),
      timeMax: extractParams.timeMax ? new Date(extractParams.timeMax + 'T23:59:59').toISOString() : undefined,
      maxResults: extractParams.maxResults,
    },
    {
      enabled: false, // Manual trigger
      retry: false,
    }
  );

  // Handle query results
  useEffect(() => {
    if (extractQuery.data) {
      console.log("✅ Calendarios extraídos:", extractQuery.data);
      setExtractedData(extractQuery.data as ExtractResponse);
    }
  }, [extractQuery.data]);

  useEffect(() => {
    if (extractQuery.error) {
      console.error("❌ Error extrayendo calendarios:", extractQuery.error);
      alert(`Error: ${extractQuery.error.message}`);
    }
  }, [extractQuery.error]);

  // Handle specific calendar query results
  useEffect(() => {
    if (extractSpecificQuery.data) {
      console.log("✅ Calendario específico extraído:", extractSpecificQuery.data);
      setSpecificCalendarData(extractSpecificQuery.data);
      setExtractedData(null); // Clear all calendars data
    }
  }, [extractSpecificQuery.data]);

  useEffect(() => {
    if (extractSpecificQuery.error) {
      console.error("❌ Error extrayendo calendario específico:", extractSpecificQuery.error);
      alert(`Error: ${extractSpecificQuery.error.message}`);
    }
  }, [extractSpecificQuery.error]);

  const handleExtractCalendars = () => {
    if (!token) {
      alert("Primero ingresa tu token de autenticación");
      return;
    }

    if (!isGoogleConnected) {
      alert("Primero conecta tu cuenta de Google Calendar");
      return;
    }

    if (extractMode === "all") {
      extractQuery.refetch();
    } else {
      extractSpecificQuery.refetch();
    }
  };

  const downloadJson = () => {
    const dataToDownload = specificCalendarData || extractedData;
    if (!dataToDownload) return;

    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const fileName = specificCalendarData
      ? `calendar-${specificCalendarData.calendar.summary}-events-${new Date().toISOString().split('T')[0]}.json`
      : `all-calendars-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  };

  const copyToClipboard = async () => {
    const dataToDownload = specificCalendarData || extractedData;
    if (!dataToDownload) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(dataToDownload, null, 2));
      alert("JSON copiado al portapapeles!");
    } catch (error) {
      console.error("Error copiando al portapapeles:", error);
      alert("Error al copiar al portapapeles");
    }
  };

  const formatDateTime = (dateTime?: string, date?: string): string => {
    if (dateTime) {
      return new Date(dateTime).toLocaleString('es-ES');
    } else if (date) {
      return new Date(date).toLocaleDateString('es-ES');
    }
    return 'No especificado';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">� Extractor de Calendarios (Formato Simplificado)</h1>

      {/* Información del formato */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📋 Formato de Extracción</h2>
        <p className="text-sm text-gray-700 mb-2">
          Este extractor obtiene únicamente los datos esenciales de cada evento:
        </p>
        <div className="bg-white p-3 rounded border font-mono text-xs">
          <pre>{`{
  "id": "event_unique_id",
  "start": {
    "dateTime": "2025-07-19T10:00:00-05:00",
    "timeZone": "America/Lima"
  },
  "end": {
    "dateTime": "2025-07-19T11:00:00-05:00",
    "timeZone": "America/Lima"
  }
}`}</pre>
        </div>
      </div>

      {/* Estado de conexión */}
      <div className={`p-4 rounded-lg ${isGoogleConnected ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
        <h2 className="text-xl font-semibold mb-2">🔗 Estado de Conexión</h2>
        <div className="space-y-2">
          <p className={`font-medium ${isGoogleConnected ? 'text-green-700' : 'text-red-700'}`}>
            Google Calendar: {isGoogleConnected ? '✅ Conectado' : '❌ Desconectado'}
          </p>
          {!isGoogleConnected && (
            <p className="text-sm text-gray-600">
              Ve a la pestaña "Calendar - Google" para conectar tu cuenta de Google Calendar primero.
            </p>
          )}
        </div>
      </div>

      {/* Token de autenticación */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">🔑 Token de Autenticación</h2>
        <input
          type="text"
          placeholder="Ingresa tu token de autenticación JWT"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      </div>

      {/* Parámetros de extracción */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">⚙️ Configuración de Extracción</h2>

        {/* Modo de extracción */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">📂 Modo de Extracción</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                checked={extractMode === "all"}
                onChange={() => setExtractMode("all")}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Todos los calendarios</span>
                <p className="text-sm text-gray-600">Extraer eventos de todos los calendarios disponibles</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={extractMode === "specific"}
                onChange={() => setExtractMode("specific")}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Calendario específico</span>
                <p className="text-sm text-gray-600">Extraer eventos de un calendario seleccionado</p>
              </div>
            </label>
          </div>

          {/* Selector de calendario específico */}
          {extractMode === "specific" && (
            <div className="mt-4">
              <label htmlFor="calendar-select" className="block text-sm font-medium mb-2">
                Seleccionar calendario:
              </label>
              {calendarsData?.calendars ? (
                <select
                  id="calendar-select"
                  value={selectedCalendarId}
                  onChange={(e) => setSelectedCalendarId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {calendarsData.calendars.map((cal) => (
                    <option key={cal.id} value={cal.id || ""}>
                      {cal.summary} {cal.primary ? "(Principal)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    {isGoogleConnected ? "Cargando calendarios..." : "Conecta tu cuenta de Google Calendar para ver los calendarios disponibles"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Parámetros de tiempo y cantidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="timeMin" className="block text-sm font-medium mb-1">Fecha inicio:</label>
            <input
              id="timeMin"
              type="date"
              value={extractParams.timeMin}
              onChange={(e) => setExtractParams({...extractParams, timeMin: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="timeMax" className="block text-sm font-medium mb-1">Fecha fin (opcional):</label>
            <input
              id="timeMax"
              type="date"
              value={extractParams.timeMax}
              onChange={(e) => setExtractParams({...extractParams, timeMax: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="maxResults" className="block text-sm font-medium mb-1">Máximo eventos por calendario:</label>
            <input
              id="maxResults"
              type="number"
              min="1"
              max="500"
              value={extractParams.maxResults}
              onChange={(e) => setExtractParams({...extractParams, maxResults: parseInt(e.target.value) || 50})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSecondary"
              checked={extractParams.includeSecondary}
              onChange={(e) => setExtractParams({...extractParams, includeSecondary: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="includeSecondary" className="text-sm font-medium">
              Incluir calendarios secundarios
            </label>
          </div>
        </div>
      </div>

      {/* Botón de extracción */}
      <div className="text-center">
        <button
          onClick={handleExtractCalendars}
          disabled={(extractQuery.isFetching || extractSpecificQuery.isFetching) || !token || !isGoogleConnected}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-semibold"
        >
          {(extractQuery.isFetching || extractSpecificQuery.isFetching) ? "Extrayendo..." :
           extractMode === "all" ? "🔄 Extraer Todos los Calendarios" :
           "🔄 Extraer Calendario Seleccionado"}
        </button>
      </div>

      {/* Resultados */}
      {(extractedData || specificCalendarData) && (
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📊 Resultados de Extracción</h2>
            <div className="space-x-2">
              <button
                onClick={() => setShowJsonModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                👁️ Ver JSON
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                📋 Copiar JSON
              </button>
              <button
                onClick={downloadJson}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                💾 Descargar JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {extractedData ? (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{extractedData.totalCalendars}</div>
                  <div className="text-sm text-gray-600">Calendarios encontrados</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {extractedData.calendars.reduce((total, cal) => total + cal.eventCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Eventos totales</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-lg font-bold text-purple-600">
                    {new Date(extractedData.extractedAt).toLocaleString('es-ES')}
                  </div>
                  <div className="text-sm text-gray-600">Fecha de extracción</div>
                </div>
              </>
            ) : specificCalendarData ? (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-lg font-bold text-blue-600">{specificCalendarData.calendar.summary}</div>
                  <div className="text-sm text-gray-600">Calendario seleccionado</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">{specificCalendarData.eventCount}</div>
                  <div className="text-sm text-gray-600">Eventos encontrados</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-lg font-bold text-purple-600">
                    {new Date(specificCalendarData.extractedAt).toLocaleString('es-ES')}
                  </div>
                  <div className="text-sm text-gray-600">Fecha de extracción</div>
                </div>
              </>
            ) : null}
          </div>

          {/* Lista de calendarios */}
          <div className="space-y-4">
            {extractedData && extractedData.calendars.map((calendarData) => (
              <div key={calendarData.calendar.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {calendarData.calendar.primary && <span className="mr-2">👑</span>}
                      {calendarData.calendar.summary}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {calendarData.eventCount} eventos • {calendarData.calendar.accessRole}
                    </p>
                    {calendarData.calendar.description && (
                      <p className="text-sm text-gray-500 mt-1">{calendarData.calendar.description}</p>
                    )}
                  </div>
                  {calendarData.calendar.backgroundColor && (
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: calendarData.calendar.backgroundColor }}
                    />
                  )}
                </div>

                {calendarData.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <p className="text-red-600 text-sm">⚠️ {calendarData.error}</p>
                  </div>
                )}

                {/* Primeros eventos como preview */}
                {calendarData.events.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">📅 Próximos eventos (formato simplificado):</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {calendarData.events.slice(0, 3).map((event) => (
                        <div key={event.id} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium text-xs text-gray-600">ID: {event.id}</div>
                          <div className="text-green-600 text-xs">
                            <strong>Inicio:</strong> {formatDateTime(event.start.dateTime, event.start.date)}
                          </div>
                          <div className="text-red-600 text-xs">
                            <strong>Fin:</strong> {formatDateTime(event.end.dateTime, event.end.date)}
                          </div>
                        </div>
                      ))}
                      {calendarData.events.length > 3 && (
                        <div className="text-sm text-gray-500 text-center">
                          ... y {calendarData.events.length - 3} eventos más
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para mostrar JSON */}
      {showJsonModal && (extractedData || specificCalendarData) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {specificCalendarData ? `JSON - ${specificCalendarData.calendar.summary}` : 'JSON - Todos los Calendarios'}
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(specificCalendarData || extractedData, null, 2)}
              </pre>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                📋 Copiar
              </button>
              <button
                onClick={downloadJson}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                💾 Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarExtractorTest;
