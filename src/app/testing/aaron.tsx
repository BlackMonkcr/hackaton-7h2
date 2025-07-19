"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function AaronTest() {
  // Estado para manejar autenticación
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Estados para formularios
  const [registerForm, setRegisterForm] = useState({
    email: "test@example.com",
    password: "password123",
    firstName: "Aaron",
    lastName: "Test",
    username: "aarontest",
    university: "UTEC",
    career: "Ingeniería de Sistemas",
    semester: 5
  });

  const [loginForm, setLoginForm] = useState({
    email: "test@example.com",
    password: "password123"
  });

  const [updateForm, setUpdateForm] = useState({
    firstName: "Aaron Updated",
    lastName: "Test Updated",
    university: "UTEC - Updated",
    career: "Computer Science"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "password123",
    newPassword: "newpassword456"
  });

  // Mutaciones de autenticación
  const registerMutation = api.auth.register.useMutation({
    onSuccess: (data) => {
      console.log("✅ Registro exitoso:", data);
      setToken(data.token);
      setIsLoggedIn(true);
      alert(`Usuario registrado: ${data.user.firstName} ${data.user.lastName}`);
    },
    onError: (error) => {
      console.error("❌ Error en registro:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      console.log("✅ Login exitoso:", data);
      setToken(data.token);
      setIsLoggedIn(true);
      alert(`Bienvenido: ${data.user.firstName} ${data.user.lastName}`);
    },
    onError: (error) => {
      console.error("❌ Error en login:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: (data) => {
      console.log("✅ Logout exitoso:", data);
      setToken(null);
      setIsLoggedIn(false);
      alert("Sesión cerrada exitosamente");
    },
    onError: (error) => {
      console.error("❌ Error en logout:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const updateProfileMutation = api.auth.updateProfile.useMutation({
    onSuccess: (data) => {
      console.log("✅ Perfil actualizado:", data);
      alert(`Perfil actualizado: ${data.user.firstName} ${data.user.lastName}`);
    },
    onError: (error) => {
      console.error("❌ Error actualizando perfil:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const changePasswordMutation = api.auth.changePassword.useMutation({
    onSuccess: (data) => {
      console.log("✅ Contraseña actualizada:", data);
      alert("Contraseña actualizada exitosamente");
    },
    onError: (error) => {
      console.error("❌ Error cambiando contraseña:", error);
      alert(`Error: ${error.message}`);
    }
  });

  const refreshTokenMutation = api.auth.refreshToken.useMutation({
    onSuccess: (data) => {
      console.log("✅ Token renovado:", data);
      setToken(data.token);
      alert("Token renovado exitosamente");
    },
    onError: (error) => {
      console.error("❌ Error renovando token:", error);
      alert(`Error: ${error.message}`);
    }
  });

  // Query para obtener información del usuario
  const { data: userData, isLoading: userLoading, refetch: refetchUser } = api.auth.me.useQuery(
    { token: token || "" },
    { enabled: !!token, retry: false }
  );

  // Funciones de manejo
  const handleRegister = () => {
    registerMutation.mutate(registerForm);
  };

  const handleLogin = () => {
    loginMutation.mutate(loginForm);
  };

  const handleLogout = () => {
    if (token) {
      logoutMutation.mutate({ token });
    }
  };

  const handleUpdateProfile = () => {
    if (token) {
      updateProfileMutation.mutate({ token, ...updateForm });
    }
  };

  const handleChangePassword = () => {
    if (token) {
      changePasswordMutation.mutate({ token, ...passwordForm });
    }
  };

  const handleRefreshToken = () => {
    if (token) {
      refreshTokenMutation.mutate({ token });
    }
  };

  const handleGetUserInfo = () => {
    refetchUser();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🧪 Pruebas de Autenticación tRPC</h1>

      {/* Estado de autenticación */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Estado Actual</h2>
        <p>Logueado: {isLoggedIn ? "✅ Sí" : "❌ No"}</p>
        <p>Token: {token ? "✅ Presente" : "❌ No disponible"}</p>
        {userData && (
          <div className="mt-2">
            <p>Usuario: {userData.user.firstName} {userData.user.lastName}</p>
            <p>Email: {userData.user.email}</p>
            <p>Universidad: {userData.user.university}</p>
          </div>
        )}
      </div>

      {/* Registro */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Registro</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={registerForm.firstName}
            onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={registerForm.lastName}
            onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Universidad"
            value={registerForm.university}
            onChange={(e) => setRegisterForm({...registerForm, university: e.target.value})}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={registerMutation.isPending}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {registerMutation.isPending ? "Registrando..." : "Registrar"}
        </button>
      </div>

      {/* Login */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔐 Login</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </div>

      {/* Acciones autenticadas */}
      {isLoggedIn && token && (
        <>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">👤 Información del Usuario</h2>
            <button
              onClick={handleGetUserInfo}
              disabled={userLoading}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 mr-2"
            >
              {userLoading ? "Cargando..." : "Obtener Info"}
            </button>
            <button
              onClick={handleRefreshToken}
              disabled={refreshTokenMutation.isPending}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {refreshTokenMutation.isPending ? "Renovando..." : "Renovar Token"}
            </button>
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">✏️ Actualizar Perfil</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nuevo Nombre"
                value={updateForm.firstName}
                onChange={(e) => setUpdateForm({...updateForm, firstName: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nuevo Apellido"
                value={updateForm.lastName}
                onChange={(e) => setUpdateForm({...updateForm, lastName: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nueva Universidad"
                value={updateForm.university}
                onChange={(e) => setUpdateForm({...updateForm, university: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nueva Carrera"
                value={updateForm.career}
                onChange={(e) => setUpdateForm({...updateForm, career: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Actualizando..." : "Actualizar Perfil"}
            </button>
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🔒 Cambiar Contraseña</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="password"
                placeholder="Contraseña Actual"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🚪 Logout</h2>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              {logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar Sesión"}
            </button>
          </div>
        </>
      )}

      {/* Información de debug */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">🐛 Debug Info</h2>
        <pre className="text-sm overflow-auto max-h-40">
          {JSON.stringify({
            isLoggedIn,
            hasToken: !!token,
            userData: userData?.user,
            tokenPreview: token?.substring(0, 20) + "..."
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AaronTest;
