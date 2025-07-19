"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface GoogleCalendarTestProps {
  readonly userToken: string;
}

export default function GoogleCalendarTest({ userToken }: GoogleCalendarTestProps) {
  const [authUrl, setAuthUrl] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>("primary");
  const [newEvent, setNewEvent] = useState({
    summary: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
  });

  // Get auth URL
  const getAuthUrlMutation = api.calendar.getAuthUrl.useQuery(
    { token: userToken },
    { enabled: false }
  );

  // Exchange code for tokens
  const exchangeCodeMutation = api.calendar.exchangeCodeForTokens.useMutation({
    onSuccess: (data) => {
      console.log("Auth successful:", data);
      alert(data.message);
    },
    onError: (error) => {
      console.error("Auth error:", error);
      alert(`Error: ${error.message}`);
    },
  });

  // Get events
  const getEventsMutation = api.calendar.getEvents.useQuery(
    {
      token: userToken,
      calendarId: selectedCalendar,
      maxResults: 10,
    },
    { enabled: false }
  );

  // Get calendars
  const getCalendarsMutation = api.calendar.getCalendars.useQuery(
    { token: userToken },
    { enabled: false }
  );

  // Create event
  const createEventMutation = api.calendar.createEvent.useMutation({
    onSuccess: (data) => {
      console.log("Event created:", data);
      alert("Evento creado exitosamente!");
      // Reset form
      setNewEvent({
        summary: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        location: "",
      });
      // Refresh events
      getEventsMutation.refetch();
    },
    onError: (error) => {
      console.error("Create event error:", error);
      alert(`Error: ${error.message}`);
    },
  });

  // Delete event
  const deleteEventMutation = api.calendar.deleteEvent.useMutation({
    onSuccess: (data) => {
      console.log("Event deleted:", data);
      alert("Evento eliminado exitosamente!");
      getEventsMutation.refetch();
    },
    onError: (error) => {
      console.error("Delete event error:", error);
      alert(`Error: ${error.message}`);
    },
  });

  // Disconnect Google
  const disconnectMutation = api.calendar.disconnectGoogle.useMutation({
    onSuccess: (data) => {
      console.log("Disconnected:", data);
      alert(data.message);
      setEvents([]);
      setCalendars([]);
    },
    onError: (error) => {
      console.error("Disconnect error:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleGetAuthUrl = async () => {
    try {
      const result = await getAuthUrlMutation.refetch();
      if (result.data) {
        setAuthUrl(result.data.authUrl);
        window.open(result.data.authUrl, "_blank");
      }
    } catch (error) {
      console.error("Get auth URL error:", error);
    }
  };

  const handleExchangeCode = () => {
    if (!authCode.trim()) {
      alert("Por favor ingresa el código de autorización");
      return;
    }
    exchangeCodeMutation.mutate({
      token: userToken,
      code: authCode.trim(),
    });
  };

  const handleGetEvents = async () => {
    try {
      const result = await getEventsMutation.refetch();
      if (result.data) {
        setEvents(result.data.events);
      }
    } catch (error) {
      console.error("Get events error:", error);
    }
  };

  const handleGetCalendars = async () => {
    try {
      const result = await getCalendarsMutation.refetch();
      if (result.data) {
        setCalendars(result.data.calendars);
      }
    } catch (error) {
      console.error("Get calendars error:", error);
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.summary || !newEvent.startDateTime || !newEvent.endDateTime) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    createEventMutation.mutate({
      token: userToken,
      calendarId: selectedCalendar,
      event: {
        summary: newEvent.summary,
        description: newEvent.description,
        startDateTime: newEvent.startDateTime,
        endDateTime: newEvent.endDateTime,
        location: newEvent.location,
        timezone: "America/Lima",
      },
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      deleteEventMutation.mutate({
        token: userToken,
        calendarId: selectedCalendar,
        eventId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Google Calendar Integration Test</h2>

        {/* Authentication Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">1. Autenticación</h3>
          <div className="space-y-3">
            <button
              onClick={handleGetAuthUrl}
              disabled={getAuthUrlMutation.isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {getAuthUrlMutation.isLoading ? "Cargando..." : "Obtener URL de Autorización"}
            </button>

            {authUrl && (
              <div className="text-sm text-gray-600">
                <p>URL de autorización generada. Se abrió en una nueva ventana.</p>
                <p>Copia el código de autorización aquí:</p>
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Código de autorización de Google"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleExchangeCode}
                disabled={exchangeCodeMutation.isPending}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {exchangeCodeMutation.isPending ? "Intercambiando..." : "Intercambiar Código"}
              </button>
            </div>

            <button
              onClick={() => disconnectMutation.mutate({ token: userToken })}
              disabled={disconnectMutation.isPending}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {disconnectMutation.isPending ? "Desconectando..." : "Desconectar Google"}
            </button>
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">2. Calendarios</h3>
          <div className="space-y-3">
            <button
              onClick={handleGetCalendars}
              disabled={getCalendarsMutation.isLoading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {getCalendarsMutation.isLoading ? "Cargando..." : "Obtener Calendarios"}
            </button>

            {calendars.length > 0 && (
              <select
                value={selectedCalendar}
                onChange={(e) => setSelectedCalendar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {calendars.map((cal) => (
                  <option key={cal.id} value={cal.id}>
                    {cal.summary} ({cal.id === "primary" ? "Principal" : "Secundario"})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">3. Eventos</h3>
          <button
            onClick={handleGetEvents}
            disabled={getEventsMutation.isLoading}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 mb-3"
          >
            {getEventsMutation.isLoading ? "Cargando..." : "Obtener Eventos"}
          </button>

          {events.length > 0 && (
            <div className="border border-gray-300 rounded max-h-64 overflow-y-auto">
              <h4 className="font-semibold p-3 bg-gray-50 border-b">Eventos del Calendario</h4>
              {events.map((event) => (
                <div key={event.id} className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{event.summary}</h5>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {event.start?.dateTime && new Date(event.start.dateTime).toLocaleString()}
                        {" - "}
                        {event.end?.dateTime && new Date(event.end.dateTime).toLocaleString()}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500">📍 {event.location}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteEventMutation.isPending}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Event Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">4. Crear Evento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newEvent.summary}
              onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
              placeholder="Título del evento *"
              className="px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="Ubicación"
              className="px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="datetime-local"
              value={newEvent.startDateTime}
              onChange={(e) => setNewEvent({ ...newEvent, startDateTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="datetime-local"
              value={newEvent.endDateTime}
              onChange={(e) => setNewEvent({ ...newEvent, endDateTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Descripción"
              className="px-3 py-2 border border-gray-300 rounded md:col-span-2"
              rows={3}
            />
          </div>
          <button
            onClick={handleCreateEvent}
            disabled={createEventMutation.isPending}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mt-3"
          >
            {createEventMutation.isPending ? "Creando..." : "Crear Evento"}
          </button>
        </div>

        {/* Results */}
        <div className="text-sm bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Estado de las Operaciones:</h4>
          <div className="space-y-1">
            <p>🔗 Auth URL: {getAuthUrlMutation.isSuccess ? "✅ Generada" : "❌ No generada"}</p>
            <p>🔑 Tokens: {exchangeCodeMutation.isSuccess ? "✅ Intercambiados" : "❌ Pendiente"}</p>
            <p>📅 Calendarios: {calendars.length > 0 ? `✅ ${calendars.length} cargados` : "❌ No cargados"}</p>
            <p>📋 Eventos: {events.length > 0 ? `✅ ${events.length} cargados` : "❌ No cargados"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
