"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";

export function CalendarTest() {
  const [token, setToken] = useState<string>("");
  const [calendarId, setCalendarId] = useState<string>("primary");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);

  // Estados para formularios
  const [eventForm, setEventForm] = useState({
    summary: "Reunión de proyecto",
    description: "Discutir avances del proyecto",
    location: "Oficina principal",
    startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString().slice(0, 16),
    timezone: "America/Lima",
    attendees: [""] as string[],
  });

  // Efecto para cargar datos desde localStorage y URL
  useEffect(() => {
    // Cargar token desde localStorage
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }

    // Cargar estado de conexión de Google
    const googleConnected = localStorage.getItem("google_connected");
    if (googleConnected === "true") {
      setIsGoogleConnected(true);
    }

    // Detectar código de autorización en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setAuthCode(code);
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Empty dependency array is correct here since we only want this to run once on mount

  // Efecto para guardar token en localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }, [token]);

  // Memoize query parameters to prevent infinite loops
  const eventsQueryParams = useMemo(() => ({
    token,
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 20
  }), [token, calendarId]); // Only recalculate when token or calendarId changes

  // Queries y mutations
  const { data: authUrl, refetch: getAuthUrl, isLoading: authUrlLoading } = api.calendar.getAuthUrl.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const { data: calendarsData, refetch: getCalendars, isLoading: calendarsLoading } = api.calendar.getCalendars.useQuery(
    { token },
    { enabled: !!token && isGoogleConnected, retry: false }
  );

  const { data: eventsData, refetch: getEvents, isLoading: eventsLoading } = api.calendar.getEvents.useQuery(
    eventsQueryParams,
    { enabled: !!token && isGoogleConnected, retry: false }
  );

  const exchangeCodeMutation = api.calendar.exchangeCodeForTokens.useMutation({
    onSuccess: (data) => {
      console.log("✅ Tokens intercambiados:", data);
      setIsGoogleConnected(true);
      localStorage.setItem("google_connected", "true");
      alert(data.message);
      // No need to manually refetch - queries will automatically refetch when isGoogleConnected becomes true
    },
    onError: (error) => {
      console.error("❌ Error intercambiando código:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const createEventMutation = api.calendar.createEvent.useMutation({
    onSuccess: (data) => {
      console.log("✅ Evento creado:", data);
      alert(data.message);
      getEvents();
      // Reset form
      setEventForm({
        summary: "",
        description: "",
        location: "",
        startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        endDateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString().slice(0, 16),
        timezone: "America/Lima",
        attendees: [""],
      });
    },
    onError: (error) => {
      console.error("❌ Error creando evento:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const updateEventMutation = api.calendar.updateEvent.useMutation({
    onSuccess: (data) => {
      console.log("✅ Evento actualizado:", data);
      alert(data.message);
      getEvents();
    },
    onError: (error) => {
      console.error("❌ Error actualizando evento:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const deleteEventMutation = api.calendar.deleteEvent.useMutation({
    onSuccess: (data) => {
      console.log("✅ Evento eliminado:", data);
      alert(data.message);
      getEvents();
      setSelectedEventId("");
    },
    onError: (error) => {
      console.error("❌ Error eliminando evento:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const disconnectMutation = api.calendar.disconnectGoogle.useMutation({
    onSuccess: (data) => {
      console.log("✅ Desconectado:", data);
      setIsGoogleConnected(false);
      localStorage.removeItem("google_connected");
      alert(data.message);
    },
    onError: (error) => {
      console.error("❌ Error desconectando:", error);
      alert(`Error: ${error.message}`);
    }
  });

  // Auto-exchange OAuth code when both token and authCode are available
  useEffect(() => {
    if (authCode && token && !isGoogleConnected) {
      console.log("Auto-exchanging OAuth code...");
      exchangeCodeMutation.mutate({ token, code: authCode });
    }
  }, [authCode, token, isGoogleConnected, exchangeCodeMutation]);

  // Handlers
  const handleGetAuthUrl = () => {
    if (!token) {
      alert("Primero ingresa tu token de autenticación");
      return;
    }
    getAuthUrl();
  };

  const handleExchangeCode = () => {
    if (authCode && token) {
      // Usar el código detectado automáticamente
      exchangeCodeMutation.mutate({ token, code: authCode });
    } else {
      // Pedir código manualmente si no se detectó
      const code = prompt("Ingresa el código de autorización de Google:");
      if (code && token) {
        exchangeCodeMutation.mutate({ token, code });
      }
    }
  };

  const handleCreateEvent = () => {
    if (!token) return;

    const cleanAttendees = eventForm.attendees.filter(email => email.trim() !== "");

    createEventMutation.mutate({
      token,
      calendarId,
      event: {
        ...eventForm,
        startDateTime: new Date(eventForm.startDateTime).toISOString(),
        endDateTime: new Date(eventForm.endDateTime).toISOString(),
        attendees: cleanAttendees.length > 0 ? cleanAttendees : undefined,
      }
    });
  };

  const handleUpdateEvent = () => {
    if (!selectedEventId || !token) return;

    const summary = prompt("Nuevo título del evento:", "Evento actualizado");
    if (summary) {
      updateEventMutation.mutate({
        token,
        calendarId,
        eventId: selectedEventId,
        event: { summary }
      });
    }
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId || !token) return;

    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      deleteEventMutation.mutate({
        token,
        calendarId,
        eventId: selectedEventId
      });
    }
  };

  const addAttendeeField = () => {
    setEventForm({
      ...eventForm,
      attendees: [...eventForm.attendees, ""]
    });
  };

  const updateAttendee = (index: number, email: string) => {
    const newAttendees = [...eventForm.attendees];
    newAttendees[index] = email;
    setEventForm({ ...eventForm, attendees: newAttendees });
  };

  const removeAttendee = (index: number) => {
    const newAttendees = eventForm.attendees.filter((_, i) => i !== index);
    setEventForm({ ...eventForm, attendees: newAttendees });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">📅 Pruebas de Google Calendar</h1>

      {/* Estado de conexión */}
      <div className={`p-4 rounded-lg ${isGoogleConnected ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}>
        <h2 className="text-xl font-semibold mb-2">🔗 Estado de Conexión</h2>
        <div className="space-y-2">
          <p>Token JWT: {token ? "✅ Presente" : "❌ No disponible"}</p>
          <p>Google Calendar: {isGoogleConnected ? "✅ Conectado" : "❌ No conectado"}</p>
          {authCode && (
            <p className="text-sm text-blue-600">
              📝 Código detectado automáticamente: {authCode.substring(0, 20)}...
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
        <p className="text-sm text-gray-600">
          Necesitas estar autenticado primero para usar Google Calendar
        </p>
        <button
          onClick={() => {
            const savedToken = localStorage.getItem("auth_token");
            if (savedToken) {
              setToken(savedToken);
              alert("Token cargado desde localStorage");
            } else {
              alert("No hay token guardado en localStorage");
            }
          }}
          className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          Cargar Token Guardado
        </button>
      </div>

      {/* Autorización de Google */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔐 Autorización de Google</h2>
        <div className="space-y-4">
          <button
            onClick={handleGetAuthUrl}
            disabled={authUrlLoading || !token || isGoogleConnected}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
          >
            {authUrlLoading ? "Generando..." : "1. Obtener URL de Autorización"}
          </button>

          {isGoogleConnected && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">✅ Ya estás conectado a Google Calendar</p>
            </div>
          )}

          {authUrl && !isGoogleConnected && (
            <div className="p-3 bg-blue-50 rounded">
              <p className="mb-2">URL de autorización generada:</p>
              <a
                href={authUrl.authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {authUrl.authUrl}
              </a>
              <p className="mt-2 text-sm text-gray-600">
                Haz clic en el enlace, autoriza la aplicación. El código se detectará automáticamente al regresar.
              </p>
            </div>
          )}

          <button
            onClick={handleExchangeCode}
            disabled={exchangeCodeMutation.isPending || !token || isGoogleConnected}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {exchangeCodeMutation.isPending ? "Intercambiando..." :
             authCode ? "2. Usar Código Detectado" : "2. Intercambiar Código"}
          </button>

          {authCode && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              ✨ Código detectado automáticamente. Haz clic arriba para conectar.
            </div>
          )}
        </div>
      </div>

      {/* Gestión de calendarios */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📋 Calendarios</h2>
        <div className="space-y-4">
          <button
            onClick={() => getCalendars()}
            disabled={calendarsLoading || !token}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {calendarsLoading ? "Cargando..." : "Obtener Calendarios"}
          </button>

          {calendarsData?.calendars && (
            <div>
              <label className="block text-sm font-medium mb-2">Seleccionar calendario:</label>
              <select
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                className="p-2 border rounded w-full max-w-md"
              >
                {calendarsData.calendars.map((cal) => (
                  <option key={cal.id} value={cal.id || ""}>
                    {cal.summary} {cal.primary ? "(Principal)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📅 Eventos</h2>
        <button
          onClick={() => getEvents()}
          disabled={eventsLoading || !token}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
        >
          {eventsLoading ? "Cargando..." : "Obtener Eventos"}
        </button>

        {eventsData?.events && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {eventsData.events.length === 0 ? (
              <p className="text-gray-500">No hay eventos en este calendario</p>
            ) : (
              eventsData.events.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedEventId === event.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedEventId(event.id || "")}
                >
                  <h4 className="font-semibold">{event.summary}</h4>
                  <p className="text-sm text-gray-600">
                    {event.start?.dateTime ?
                      new Date(event.start.dateTime).toLocaleString() :
                      event.start?.date
                    }
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-500 truncate">{event.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {selectedEventId && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm mb-2">Evento seleccionado: {selectedEventId}</p>
            <button
              onClick={handleUpdateEvent}
              disabled={updateEventMutation.isPending}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600 disabled:opacity-50"
            >
              {updateEventMutation.isPending ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleteEventMutation.isPending}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              {deleteEventMutation.isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        )}
      </div>

      {/* Crear evento */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">➕ Crear Evento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título:</label>
            <input
              type="text"
              value={eventForm.summary}
              onChange={(e) => setEventForm({...eventForm, summary: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación:</label>
            <input
              type="text"
              value={eventForm.location}
              onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha/Hora Inicio:</label>
            <input
              type="datetime-local"
              value={eventForm.startDateTime}
              onChange={(e) => setEventForm({...eventForm, startDateTime: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha/Hora Fin:</label>
            <input
              type="datetime-local"
              value={eventForm.endDateTime}
              onChange={(e) => setEventForm({...eventForm, endDateTime: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            value={eventForm.description}
            onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
            className="w-full p-2 border rounded h-20"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Invitados:</label>
          {eventForm.attendees.map((email, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => updateAttendee(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAttendeeField}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            + Agregar invitado
          </button>
        </div>

        <button
          onClick={handleCreateEvent}
          disabled={createEventMutation.isPending || !token}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {createEventMutation.isPending ? "Creando..." : "Crear Evento"}
        </button>
      </div>

      {/* Desconectar */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔌 Desconectar</h2>
        <button
          onClick={() => disconnectMutation.mutate({ token })}
          disabled={disconnectMutation.isPending || !token}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {disconnectMutation.isPending ? "Desconectando..." : "Desconectar Google Calendar"}
        </button>
      </div>
    </div>
  );
}

export default CalendarTest;
