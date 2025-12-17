import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

interface User {
  id: string;
  email: string;
  nev: string;
  aktiv: boolean;
  roles: Array<{ role: { nev: string } }>;
}

interface UsersTabProps {
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function UsersTab({ currentUserId, isAdmin = false }: UsersTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [changingPasswordUserId, setChangingPasswordUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nev: '',
    password: '',
    aktiv: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isAdminPasswordChange, setIsAdminPasswordChange] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/system/users?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.items || data.data || []);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága a felhasználók megtekintéséhez.');
      }
    } catch (err: any) {
      setError('Hiba a felhasználók betöltésekor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      setFormData({
        email: user.email,
        nev: user.nev,
        password: '',
        aktiv: user.aktiv,
      });
    } else {
      setEditingUserId(null);
      setFormData({
        email: '',
        nev: '',
        password: '',
        aktiv: true,
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData({
      email: '',
      nev: '',
      password: '',
      aktiv: true,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingUserId) {
        // Update existing user
        const updateData: any = {
          email: formData.email,
          nev: formData.nev,
          aktiv: formData.aktiv,
        };

        // Check if this is an admin user before update
        const userBeingEdited = users.find(u => u.id === editingUserId);
        const isAdminUser = userBeingEdited?.roles?.some((ur: any) => ur.role?.nev === 'Admin');
        const oldEmail = userBeingEdited?.email;

        const response = await apiFetch(`/system/users/${editingUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Hiba a felhasználó módosításakor');
        }

        // If admin user's email was changed, update localStorage
        if (isAdminUser && formData.email !== oldEmail) {
          const lastLoginEmail = localStorage.getItem('lastLoginEmail');
          if (lastLoginEmail === oldEmail) {
            localStorage.setItem('lastLoginEmail', formData.email);
          }
        }

        setSuccess('Felhasználó sikeresen módosítva!');
      } else {
        // Create new user
        if (!formData.password) {
          throw new Error('A jelszó megadása kötelező');
        }

        const response = await apiFetch('/system/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            nev: formData.nev,
            password: formData.password,
            aktiv: formData.aktiv,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Hiba a felhasználó létrehozásakor');
        }

        setSuccess('Felhasználó sikeresen létrehozva!');
      }

      setTimeout(() => {
        setSuccess('');
        handleCloseModal();
        loadUsers();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Biztosan törölni szeretné a felhasználót: ${userName}?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/system/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Hiba a törlés során');
      }

      setSuccess('Felhasználó sikeresen törölve!');
      setTimeout(() => {
        setSuccess('');
        loadUsers();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordChange = (userId: string, adminMode: boolean = false) => {
    setChangingPasswordUserId(userId);
    setIsAdminPasswordChange(adminMode);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleClosePasswordChange = () => {
    setChangingPasswordUserId(null);
    setIsAdminPasswordChange(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('A jelszavak nem egyeznek');
      return;
    }

    if (passwordData.newPassword.length < 4) {
      setError('A jelszónak legalább 4 karakternek kell lennie');
      return;
    }

    if (!isAdminPasswordChange && !passwordData.currentPassword) {
      setError('A jelenlegi jelszó megadása kötelező');
      return;
    }

    setLoading(true);

    try {
      // Check if this is an admin user before password change
      const userBeingChanged = users.find(u => u.id === changingPasswordUserId);
      const isAdminUser = userBeingChanged?.roles?.some((ur: any) => ur.role?.nev === 'Admin');
      const adminEmail = userBeingChanged?.email;

      const endpoint = isAdminPasswordChange
        ? `/system/users/${changingPasswordUserId}/admin-password`
        : `/system/users/${changingPasswordUserId}/password`;
      
      const body = isAdminPasswordChange
        ? { newPassword: passwordData.newPassword }
        : {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          };

      const response = await apiFetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Hiba a jelszó módosításakor');
      }

      // If admin user's password was changed, ensure localStorage has the correct email
      // (Note: We don't store password, but we ensure the email is correct)
      if (isAdminUser && adminEmail) {
        const lastLoginEmail = localStorage.getItem('lastLoginEmail');
        if (!lastLoginEmail || lastLoginEmail !== adminEmail) {
          localStorage.setItem('lastLoginEmail', adminEmail);
        }
      }

      setSuccess('Jelszó sikeresen módosítva!');
      setTimeout(() => {
        setSuccess('');
        handleClosePasswordChange();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          Csak adminisztrátorok számára elérhető funkció.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Felhasználók kezelése</h3>
        <button
          onClick={() => handleOpenModal()}
          className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Új felhasználó
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {loading && !users.length ? (
        <div className="text-center py-8 text-gray-500">Betöltés...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nincs felhasználó</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Név</th>
                <th className="text-left p-4 font-medium text-gray-700">Email</th>
                <th className="text-left p-4 font-medium text-gray-700">Szerepkör</th>
                <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                <th className="text-left p-4 font-medium text-gray-700">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4">{user.nev}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {user.roles.map((ur) => ur.role.nev).join(', ') || 'Nincs szerepkör'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.aktiv
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.aktiv ? 'Aktív' : 'Inaktív'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Szerkesztés
                      </button>
                      {user.id === currentUserId && (
                        <button
                          onClick={() => handleOpenPasswordChange(user.id, false)}
                          className="px-3 py-1 rounded text-sm bg-yellow-600 text-white hover:bg-yellow-700"
                        >
                          Jelszó
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenPasswordChange(user.id, true)}
                          className="px-3 py-1 rounded text-sm bg-purple-600 text-white hover:bg-purple-700"
                          title="Admin jelszó módosítás"
                        >
                          Admin Jelszó
                        </button>
                      )}
                      {user.email !== 'admin@mbit.hu' && (
                        <button
                          onClick={() => handleDelete(user.id, user.nev)}
                          className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          Törlés
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUserId ? 'Felhasználó szerkesztése' : 'Új felhasználó'}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nev}
                onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {!editingUserId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jelszó <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  minLength={4}
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.aktiv}
                  onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Aktív</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Mentés...' : 'Mentés'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={changingPasswordUserId !== null}
        onClose={handleClosePasswordChange}
        title={isAdminPasswordChange ? 'Admin jelszó módosítása' : 'Jelszó módosítása'}
      >
        <form onSubmit={handleChangePassword}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isAdminPasswordChange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jelenlegi jelszó <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            )}
            {isAdminPasswordChange && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                Admin módban nem szükséges a jelenlegi jelszó megadása.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Új jelszó <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                minLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Új jelszó megerősítése <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                minLength={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={handleClosePasswordChange}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Módosítás...' : 'Módosítás'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

