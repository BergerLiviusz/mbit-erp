import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';

interface ChatRoom {
  id: string;
  accountId: string;
  nev?: string | null;
  allapot: string;
  createdAt: string;
  updatedAt: string;
  account?: {
    id: string;
    nev: string;
    azonosito: string;
  };
  messages?: ChatMessage[];
  participants?: ChatParticipant[];
  _count?: {
    messages: number;
    participants: number;
  };
}

interface ChatMessage {
  id: string;
  chatRoomId: string;
  userId?: string | null;
  felhaszCsak?: string | null;
  szoveg: string;
  tipus: string;
  fajlUtvonal?: string | null;
  olvasva: boolean;
  olvasvaDatum?: string | null;
  createdAt: string;
  user?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

interface ChatParticipant {
  id: string;
  chatRoomId: string;
  userId?: string | null;
  felhaszCsak?: string | null;
  szerep: string;
  csatlakozott: string;
  elhagyott?: string | null;
  user?: {
    id: string;
    nev: string;
    email: string;
  } | null;
}

interface Account {
  id: string;
  nev: string;
  azonosito: string;
}

export default function Chat() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [roomFormData, setRoomFormData] = useState({
    accountId: '',
    nev: '',
    participantUserIds: [] as string[],
    externalParticipants: [] as string[],
  });

  const [filters, setFilters] = useState({
    accountId: '',
    allapot: '',
  });

  useEffect(() => {
    loadAccounts();
    loadRooms();
  }, [filters]);

  useEffect(() => {
    if (selectedRoom) {
      // Auto-refresh messages every 3 seconds
      refreshIntervalRef.current = setInterval(() => {
        loadRoomDetails(selectedRoom.id);
      }, 3000);

      // Mark messages as read
      markAsRead(selectedRoom.id);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRoom?.messages]);

  const loadAccounts = async () => {
    try {
      const response = await apiFetch('/crm/accounts?skip=0&take=100');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || []);
      }
    } catch (err) {
      console.error('Hiba a ügyfelek betöltésekor:', err);
    }
  };

  const loadRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.accountId) queryParams.append('accountId', filters.accountId);
      if (filters.allapot) queryParams.append('allapot', filters.allapot);

      const response = await apiFetch(`/crm/chat/rooms?skip=0&take=100&${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data.items || []);
      } else {
        throw new Error('Hiba a chat szobák betöltésekor');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomDetails = async (roomId: string) => {
    try {
      const response = await apiFetch(`/crm/chat/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedRoom(data);
        
        // Update room in list
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === roomId ? { ...room, ...data } : room
          )
        );
      }
    } catch (err: any) {
      console.error('Hiba a chat szoba részleteinek betöltésekor:', err);
    }
  };

  const handleOpenRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadRoomDetails(room.id);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!roomFormData.accountId) {
      setError('Az ügyfél kiválasztása kötelező');
      return;
    }

    try {
      const response = await apiFetch('/crm/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: roomFormData.accountId,
          nev: roomFormData.nev || undefined,
          participantUserIds: roomFormData.participantUserIds.length > 0 ? roomFormData.participantUserIds : undefined,
          externalParticipants: roomFormData.externalParticipants.length > 0 ? roomFormData.externalParticipants : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba a chat szoba létrehozásakor');
      }

      const newRoom = await response.json();
      setSuccess('Chat szoba sikeresen létrehozva!');
      setTimeout(() => {
        setSuccess('');
        setIsRoomModalOpen(false);
        setRoomFormData({
          accountId: '',
          nev: '',
          participantUserIds: [],
          externalParticipants: [],
        });
        loadRooms();
        handleOpenRoom(newRoom);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    setSendingMessage(true);
    setError('');

    try {
      const response = await apiFetch(`/crm/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          szoveg: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba az üzenet küldésekor');
      }

      await response.json();
      setNewMessage('');
      
      // Reload room details to get updated messages
      loadRoomDetails(selectedRoom.id);
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    } finally {
      setSendingMessage(false);
    }
  };

  const markAsRead = async (roomId: string) => {
    try {
      await apiFetch(`/crm/chat/rooms/${roomId}/mark-read`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Hiba az olvasottként jelöléskor:', err);
    }
  };

  const handleCloseRoom = async (roomId: string) => {
    if (!confirm('Biztosan le szeretné zárni ezt a chat szobát?')) {
      return;
    }

    try {
      const response = await apiFetch(`/crm/chat/rooms/${roomId}/close`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Hiba a lezárás során');
      }

      setSuccess('Chat szoba lezárva!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      loadRooms();
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Most';
    if (minutes < 60) return `${minutes} perce`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} órája`;
    return date.toLocaleDateString('hu-HU');
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Chat szobák lista */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chat szobák</h2>
            <button
              onClick={() => setIsRoomModalOpen(true)}
              className="bg-mbit-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              + Új
            </button>
          </div>

          {/* Szűrők */}
          <div className="space-y-2">
            <select
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">Összes ügyfél</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nev}
                </option>
              ))}
            </select>
            <select
              value={filters.allapot}
              onChange={(e) => setFilters({ ...filters, allapot: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">Összes állapot</option>
              <option value="NYITOTT">Nyitott</option>
              <option value="LEZART">Lezárt</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Betöltés...</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Nincs chat szoba</div>
          ) : (
            <div>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleOpenRoom(room)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedRoom?.id === room.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-sm">
                    {room.nev || room.account?.nev || 'Névtelen chat'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {room.account?.nev}
                  </div>
                  {room.messages && room.messages.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {room.messages[0].user?.nev || room.messages[0].felhaszCsak || 'Ismeretlen'}: {room.messages[0].szoveg}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {formatTime(room.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat üzenetek */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedRoom ? (
          <>
            {/* Chat header */}
            <div className="bg-white border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {selectedRoom.nev || selectedRoom.account?.nev || 'Chat'}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {selectedRoom.account?.nev} ({selectedRoom.account?.azonosito})
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsParticipantModalOpen(true)}
                    className="text-sm text-mbit-blue hover:text-blue-600"
                  >
                    Résztvevők
                  </button>
                  {selectedRoom.allapot === 'NYITOTT' && (
                    <button
                      onClick={() => handleCloseRoom(selectedRoom.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Lezárás
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedRoom.messages && selectedRoom.messages.length > 0 ? (
                selectedRoom.messages.map((message) => {
                  const isOwnMessage = message.user !== null;
                  const senderName = message.user?.nev || message.felhaszCsak || 'Ismeretlen';

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-mbit-blue text-white'
                            : 'bg-white border'
                        }`}
                      >
                        <div className={`text-xs mb-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                          {senderName}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{message.szoveg}</div>
                        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Még nincsenek üzenetek. Küldjön első üzenetet!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            {selectedRoom.allapot === 'NYITOTT' && (
              <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Írjon üzenetet..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="px-6 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? 'Küldés...' : 'Küldés'}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Válasszon egy chat szobát a bal oldali listából
          </div>
        )}
      </div>

      {/* Új chat szoba modal */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Új chat szoba"
        size="md"
      >
        <form onSubmit={handleCreateRoom}>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ügyfél <span className="text-red-500">*</span>
              </label>
              <select
                value={roomFormData.accountId}
                onChange={(e) => setRoomFormData({ ...roomFormData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Válasszon ügyfelet...</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nev} ({a.azonosito})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Név (opcionális)</label>
              <input
                type="text"
                value={roomFormData.nev}
                onChange={(e) => setRoomFormData({ ...roomFormData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl. Projekt megbeszélés"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600"
              >
                Létrehozás
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Résztvevők modal */}
      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title={selectedRoom ? `Résztvevők: ${selectedRoom.nev || selectedRoom.account?.nev}` : 'Résztvevők'}
        size="md"
      >
        {selectedRoom && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Aktív résztvevők</h4>
              <div className="space-y-2">
                {selectedRoom.participants && selectedRoom.participants.length > 0 ? (
                  selectedRoom.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">
                          {participant.user?.nev || participant.felhaszCsak || 'Ismeretlen'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {participant.szerep === 'ADMIN' ? 'Admin' : 'Résztvevő'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Nincsenek résztvevők</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

