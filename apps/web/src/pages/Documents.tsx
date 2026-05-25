import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import { apiFetch } from '../lib/api';
import { usePermissions } from '../hooks/usePermissions';

interface Document {
  id: string;
  iktatoSzam: string;
  nev: string;
  tipus: string;
  irany?: string | null;
  fajlNev: string;
  fajlMeret: number;
  mimeType?: string;
  allapot: string;
  tartalom?: string | null;
  ervenyessegKezdet?: string | null;
  ervenyessegVeg?: string | null;
  lejarat?: string | null;
  jelenlegiHely?: string | null;
  category?: {
    id: string;
    nev: string;
  } | null;
  account?: {
    id: string;
    nev: string;
  } | null;
  ocrJob?: {
    id: string;
    allapot: string;
    txtFajlUtvonal?: string | null;
  } | null;
  tags?: Array<{
    id: string;
    tag: {
      id: string;
      nev: string;
      szin?: string | null;
    };
  }>;
  versions?: Array<{
    id: string;
    verzioSzam: number;
    fajlUtvonal: string;
    valtoztatasLeiras?: string | null;
    createdAt: string;
    createdBy?: {
      id: string;
      nev: string;
      email: string;
    } | null;
  }>;
  workflowLogs?: Array<{
    id: string;
    regiAllapot: string;
    ujAllapot: string;
    megjegyzes?: string | null;
    createdAt: string;
  }>;
  createdBy?: {
    id: string;
    nev: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  nev: string;
}

interface Account {
  id: string;
  nev: string;
}

interface Tag {
  id: string;
  nev: string;
  szin?: string | null;
}

const TIPUSOK = [
  { kod: 'szerzodes', nev: 'Szerződés', szin: 'bg-blue-100 text-mbit-blue' },
  { kod: 'szamla', nev: 'Számla', szin: 'bg-green-100 text-green-800' },
  { kod: 'jelentes', nev: 'Jelentés', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'egyeb', nev: 'Egyéb', szin: 'bg-gray-100 text-gray-800' },
];

const ALLAPOTOK = [
  { kod: 'beerkezett', nev: 'Beérkezett', szin: 'bg-gray-100 text-gray-800' },
  { kod: 'iktatott', nev: 'Iktatott', szin: 'bg-blue-100 text-blue-800' },
  { kod: 'feldolgozas_alatt', nev: 'Feldolgozás alatt', szin: 'bg-yellow-100 text-yellow-800' },
  { kod: 'jovahagyasra_var', nev: 'Jóváhagyásra vár', szin: 'bg-orange-100 text-orange-800' },
  { kod: 'jovahagyott', nev: 'Jóváhagyott', szin: 'bg-green-100 text-green-800' },
  { kod: 'archivalva', nev: 'Archivált', szin: 'bg-purple-100 text-purple-800' },
  { kod: 'elutasitva', nev: 'Elutasítva / lezárt', szin: 'bg-red-100 text-red-800' },
  { kod: 'aktiv', nev: 'Aktív (legacy)', szin: 'bg-green-100 text-green-800' },
];

export default function Documents() {
  const { canExportDms, canCreateDms } = usePermissions();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllapot, setSelectedAllapot] = useState<string>('');
  const [selectedIrany, setSelectedIrany] = useState<string>('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<Array<{id: string; nev: string; email: string}>>([]);
  const [documentAccess, setDocumentAccess] = useState<Array<{id: string; userId: string; jogosultsag: string; user: {id: string; nev: string; email: string}}>>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [ocrLoading, setOcrLoading] = useState<Record<string, boolean>>({});
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [detailDocument, setDetailDocument] = useState<Document | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [workflowMegjegyzes, setWorkflowMegjegyzes] = useState('');
  const [iktatoSearch, setIktatoSearch] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    nev: '',
    tipus: 'ugyfél',
    adoszam: '',
    cim: '',
    email: '',
    telefon: '',
    megjegyzesek: '',
  });

  const [formData, setFormData] = useState({
    nev: '',
    tipus: 'szerzodes',
    irany: '',
    categoryId: '',
    accountId: '',
    opportunityId: '',
    quoteId: '',
    allapot: 'beerkezett',
    ervenyessegKezdet: '',
    ervenyessegVeg: '',
    lejarat: '',
    jelenlegiHely: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadDocuments();
  }, [selectedAllapot, selectedIrany, selectedTagId, debouncedSearchTerm]);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      loadCategories();
      loadAccounts();
    }
  }, [isModalOpen]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('skip', '0');
      params.append('take', '100');
      
      if (selectedAllapot) {
        params.append('allapot', selectedAllapot);
      }
      
      if (selectedIrany) {
        params.append('irany', selectedIrany);
      }
      
      if (selectedTagId) {
        params.append('tagId', selectedTagId);
      }
      
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      const response = await apiFetch(`/dms/documents?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a dokumentumok betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiFetch(`/dms/categories?skip=0&take=100`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Hiba a kategóriák betöltésekor:', error);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Kérem adja meg a kategória nevét!');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/dms/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nev: newCategoryName.trim(),
          leiras: '',
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setSuccess('Kategória sikeresen létrehozva!');
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
        await loadCategories();
        setFormData({ ...formData, categoryId: newCategory.id });
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága új kategória létrehozásához.');
      } else {
        setError('Hiba a kategória létrehozásakor.');
      }
    } catch (error) {
      setError('Hiba történt a kategória létrehozásakor.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.nev);
    setIsCategoryEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryName.trim() || !editingCategoryId) {
      setError('Kérem adja meg a kategória nevét!');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/dms/categories/${editingCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nev: editingCategoryName.trim(),
        }),
      });

      if (response.ok) {
        setSuccess('Kategória sikeresen frissítve!');
        setIsCategoryEditModalOpen(false);
        setEditingCategoryId(null);
        setEditingCategoryName('');
        await loadCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága a kategória szerkesztéséhez.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hiba a kategória frissítésekor.');
      }
    } catch (error) {
      setError('Hiba történt a kategória frissítésekor.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Biztosan törölni szeretné a kategóriát: ${categoryName}?`)) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/dms/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Kategória sikeresen törölve!');
        await loadCategories();
        // If deleted category was selected, clear it
        if (formData.categoryId === categoryId) {
          setFormData({ ...formData, categoryId: '' });
        }
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága a kategória törléséhez.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hiba a kategória törlésekor.');
      }
    } catch (error) {
      setError('Hiba történt a kategória törlésekor.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await apiFetch('/dms/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data || []);
      }
    } catch (error) {
      console.error('Hiba a tag-ek betöltésekor:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await apiFetch(`/crm/accounts?skip=0&take=100`, {
        
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.items || []);
      }
    } catch (error) {
      console.error('Hiba az ügyfelek betöltésekor:', error);
    }
  };

  const validateEmail = (email: string) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const createAccount = async () => {
    if (!accountFormData.nev.trim()) {
      setError('Kérem adja meg az ügyfél nevét!');
      return;
    }

    if (accountFormData.email && !validateEmail(accountFormData.email)) {
      setError('Kérem adjon meg érvényes email címet');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await apiFetch(`/crm/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountFormData),
      });

      if (response.ok) {
        const newAccount = await response.json();
        setSuccess('Ügyfél sikeresen létrehozva!');
        setAccountFormData({
          nev: '',
          tipus: 'ugyfél',
          adoszam: '',
          cim: '',
          email: '',
          telefon: '',
          megjegyzesek: '',
        });
        setIsAccountModalOpen(false);
        await loadAccounts();
        setFormData({ ...formData, accountId: newAccount.id });
        setTimeout(() => setSuccess(''), 3000);
      } else if (response.status === 401) {
        setError('Nincs hitelesítve. Kérem jelentkezzen be újra.');
      } else if (response.status === 403) {
        setError('Nincs jogosultsága új ügyfél létrehozásához.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hiba az ügyfél létrehozásakor.');
      }
    } catch (error) {
      setError('Hiba történt az ügyfél létrehozásakor.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };


  const handleOpenModal = async (doc?: Document) => {
    if (doc) {
      // Load full document details to get lejarat
      try {
        const response = await apiFetch(`/dms/documents/${doc.id}`);
        if (response.ok) {
          const fullDoc = await response.json();
          setEditingDocumentId(doc.id);
          setFormData({
            nev: fullDoc.nev,
            tipus: fullDoc.tipus,
            irany: fullDoc.irany || '',
            categoryId: fullDoc.categoryId || '',
            accountId: fullDoc.accountId || '',
            opportunityId: fullDoc.opportunityId || '',
            quoteId: fullDoc.quoteId || '',
            allapot: fullDoc.allapot,
            ervenyessegKezdet: fullDoc.ervenyessegKezdet ? new Date(fullDoc.ervenyessegKezdet).toISOString().split('T')[0] : '',
            ervenyessegVeg: fullDoc.ervenyessegVeg ? new Date(fullDoc.ervenyessegVeg).toISOString().split('T')[0] : '',
            lejarat: fullDoc.lejarat ? new Date(fullDoc.lejarat).toISOString().split('T')[0] : '',
            jelenlegiHely: fullDoc.jelenlegiHely || '',
          });
        } else {
          // Fallback to basic doc data
          setEditingDocumentId(doc.id);
          setFormData({
            nev: doc.nev,
            tipus: doc.tipus,
            irany: doc.irany || '',
            categoryId: doc.category?.id || '',
            accountId: doc.account?.id || '',
            opportunityId: (doc as any).opportunity?.id || '',
            quoteId: (doc as any).quote?.id || '',
            allapot: doc.allapot,
            ervenyessegKezdet: doc.ervenyessegKezdet ? doc.ervenyessegKezdet.split('T')[0] : '',
            ervenyessegVeg: doc.ervenyessegVeg ? doc.ervenyessegVeg.split('T')[0] : '',
            lejarat: doc.lejarat ? doc.lejarat.split('T')[0] : '',
            jelenlegiHely: doc.jelenlegiHely || '',
          });
        }
      } catch (error) {
        console.error('Error loading document details:', error);
        setEditingDocumentId(doc.id);
        setFormData({
          nev: doc.nev,
          tipus: doc.tipus,
          irany: doc.irany || '',
          categoryId: doc.category?.id || '',
          accountId: doc.account?.id || '',
          opportunityId: (doc as any).opportunity?.id || '',
          quoteId: (doc as any).quote?.id || '',
          allapot: doc.allapot,
          ervenyessegKezdet: doc.ervenyessegKezdet ? doc.ervenyessegKezdet.split('T')[0] : '',
          ervenyessegVeg: doc.ervenyessegVeg ? doc.ervenyessegVeg.split('T')[0] : '',
          lejarat: doc.lejarat ? doc.lejarat.split('T')[0] : '',
          jelenlegiHely: doc.jelenlegiHely || '',
        });
      }
    } else {
      setEditingDocumentId(null);
      setFormData({
        nev: '',
        tipus: 'szerzodes',
        irany: '',
        categoryId: '',
        accountId: '',
        opportunityId: '',
        quoteId: '',
        allapot: 'beerkezett',
        ervenyessegKezdet: '',
        ervenyessegVeg: '',
        lejarat: '',
        jelenlegiHely: '',
      });
    }
    setSelectedFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDocumentId(null);
    setFormData({
      nev: '',
      tipus: 'szerzodes',
      irany: '',
        categoryId: '',
        accountId: '',
        opportunityId: '',
        quoteId: '',
        allapot: 'beerkezett',
      ervenyessegKezdet: '',
      ervenyessegVeg: '',
      lejarat: '',
      jelenlegiHely: '',
    });
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nev.trim()) {
      setError('A név megadása kötelező');
      return;
    }

    // File only required for new documents
    if (!editingDocumentId && !selectedFile) {
      setError('Kérem válasszon ki egy fájlt');
      return;
    }

    setSaving(true);

    try {
      if (editingDocumentId) {
        // Update existing document
        const updateData = {
          nev: formData.nev,
          tipus: formData.tipus,
          irany: formData.irany || undefined,
          categoryId: formData.categoryId || undefined,
          accountId: formData.accountId || undefined,
          opportunityId: formData.opportunityId || undefined,
          quoteId: formData.quoteId || undefined,
          allapot: formData.allapot,
          ervenyessegKezdet: formData.ervenyessegKezdet || undefined,
          ervenyessegVeg: formData.ervenyessegVeg || undefined,
          lejarat: formData.lejarat || undefined,
          jelenlegiHely: formData.jelenlegiHely || undefined,
        };

        const updateResponse = await apiFetch(`/dms/documents/${editingDocumentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!updateResponse.ok) {
          if (updateResponse.status === 401) {
            throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
          } else if (updateResponse.status === 403) {
            throw new Error('Nincs jogosultsága ehhez a művelethez.');
          } else {
            const errorData = await updateResponse.json();
            throw new Error(errorData.message || 'Hiba a dokumentum frissítésekor');
          }
        }

        setSuccess('Dokumentum sikeresen frissítve!');
        await loadDocuments();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
        return;
      }

      // Create new document
      const documentData = {
        nev: formData.nev,
        tipus: formData.tipus,
        irany: formData.irany || undefined,
        categoryId: formData.categoryId || undefined,
        accountId: formData.accountId || undefined,
        opportunityId: formData.opportunityId || undefined,
        quoteId: formData.quoteId || undefined,
        allapot: formData.allapot,
        fajlNev: selectedFile!.name,
        fajlMeret: selectedFile!.size,
        mimeType: selectedFile!.type,
        ervenyessegKezdet: formData.ervenyessegKezdet || undefined,
        ervenyessegVeg: formData.ervenyessegVeg || undefined,
        lejarat: formData.lejarat || undefined,
      };

      const createResponse = await apiFetch(`/dms/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!createResponse.ok) {
        if (createResponse.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (createResponse.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (createResponse.status === 400) {
          const errorData = await createResponse.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (createResponse.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await createResponse.json();
          throw new Error(errorData.message || 'Hiba a dokumentum létrehozásakor');
        }
      }

      const createdDocument = await createResponse.json();

      if (!selectedFile) {
        throw new Error('Nincs kiválasztott fájl');
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadResponse = await apiFetch(`/dms/documents/${createdDocument.id}/upload`, {
        method: 'POST',
        headers: {
        },
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        if (uploadResponse.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (uploadResponse.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (uploadResponse.status === 400) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Hibás adatok.');
        } else if (uploadResponse.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Hiba a fájl feltöltésekor');
        }
      }

      setSuccess('Dokumentum sikeresen létrehozva!');
      setTimeout(() => {
        handleCloseModal();
        loadDocuments();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mentés során');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTipusBadge = (tipus: string) => {
    const t = TIPUSOK.find(t => t.kod === tipus);
    if (!t) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{tipus}</span>;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.szin}`}>
        {t.nev}
      </span>
    );
  };

  const getAllapotBadge = (allapot: string) => {
    const a = ALLAPOTOK.find(a => a.kod === allapot);
    if (!a) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{allapot}</span>;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.szin}`}>
        {a.nev}
      </span>
    );
  };

  const getAllapotNev = (allapot: string): string => {
    const a = ALLAPOTOK.find(a => a.kod === allapot);
    return a ? a.nev : allapot;
  };

  const countByAllapot = (allapot: string) => {
    return documents.filter(d => d.allapot === allapot).length;
  };

  const handleOcrTrigger = async (documentId: string) => {
    setOcrLoading(prev => ({ ...prev, [documentId]: true }));
    setError('');
    try {
      const response = await apiFetch(`/dms/documents/${documentId}/ocr`, {
        method: 'POST',
        headers: {
        },
      });

      if (!response.ok) {
        const errorMsg = response.status === 401 
          ? 'Nincs hitelesítve' 
          : response.status === 403 
            ? 'Nincs jogosultsága ehhez a művelethez'
            : 'OCR feldolgozás indítása sikertelen';
        setError(errorMsg);
        setOcrLoading(prev => ({ ...prev, [documentId]: false }));
        return;
      }

      setSuccess('OCR feldolgozás elindítva. Kérjük várjon...');
      setTimeout(() => setSuccess(''), 3000);

      // Poll for OCR completion
      const pollInterval = setInterval(async () => {
        try {
          const docResponse = await apiFetch(`/dms/documents/${documentId}`, {
            
          });
          
          if (docResponse.ok) {
            const updatedDoc = await docResponse.json();
            setDocuments(docs => 
              docs.map(d => d.id === documentId ? { 
                ...d, 
                tartalom: updatedDoc.tartalom,
                ocrJob: updatedDoc.ocrJob 
              } : d)
            );
            
            if (updatedDoc.ocrJob?.allapot === 'kesz') {
              clearInterval(pollInterval);
              setOcrLoading(prev => ({ ...prev, [documentId]: false }));
              setSuccess('OCR feldolgozás sikeresen befejeződött!');
              setTimeout(() => setSuccess(''), 5000);
              setExpandedDoc(documentId);
            } else if (updatedDoc.ocrJob?.allapot === 'hiba') {
              clearInterval(pollInterval);
              setOcrLoading(prev => ({ ...prev, [documentId]: false }));
              setError('OCR feldolgozás sikertelen volt.');
            }
          }
        } catch (err) {
          console.error('Error polling OCR status:', err);
        }
      }, 2000);

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        setOcrLoading(prev => ({ ...prev, [documentId]: false }));
      }, 60000);
    } catch (error) {
      console.error('OCR hiba:', error);
      setError('Hiba történt az OCR feldolgozás során');
      setOcrLoading(prev => ({ ...prev, [documentId]: false }));
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiFetch(`/system/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Hiba a felhasználók betöltésekor:', error);
    }
  };

  const handleViewDetails = async (documentId: string) => {
    try {
      const response = await apiFetch(`/dms/documents/${documentId}`);
      if (response.ok) {
        const doc = await response.json();
        setDetailDocument(doc);
        setDocumentAccess(doc.access || []);
        setIsDetailModalOpen(true);
        await loadUsers();
      }
    } catch (error) {
      console.error('Hiba a dokumentum részleteinek betöltésekor:', error);
      setError('Nem sikerült betölteni a dokumentum részleteit');
    }
  };

  const handleAddAccess = async (documentId: string, userId: string, jogosultsag: string) => {
    try {
      const response = await apiFetch(`/dms/documents/${documentId}/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, jogosultsag }),
      });

      if (response.ok) {
        const newAccess = await response.json();
        setDocumentAccess([...documentAccess, newAccess]);
        setSuccess('Jogosultság sikeresen hozzáadva!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Refresh document details
        const docResponse = await apiFetch(`/dms/documents/${documentId}`);
        if (docResponse.ok) {
          const doc = await docResponse.json();
          setDetailDocument(doc);
          setDocumentAccess(doc.access || []);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hiba a jogosultság hozzáadásakor');
      }
    } catch (error) {
      console.error('Hiba a jogosultság hozzáadásakor:', error);
      setError('Hiba történt a jogosultság hozzáadása során');
    }
  };

  const handleRemoveAccess = async (documentId: string, userId: string) => {
    try {
      const response = await apiFetch(`/dms/documents/${documentId}/access/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocumentAccess(documentAccess.filter(acc => acc.userId !== userId));
        setSuccess('Jogosultság sikeresen eltávolítva!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Refresh document details
        const docResponse = await apiFetch(`/dms/documents/${documentId}`);
        if (docResponse.ok) {
          const doc = await docResponse.json();
          setDetailDocument(doc);
          setDocumentAccess(doc.access || []);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hiba a jogosultság eltávolításakor');
      }
    } catch (error) {
      console.error('Hiba a jogosultság eltávolításakor:', error);
      setError('Hiba történt a jogosultság eltávolítása során');
    }
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (!confirm(`Biztosan törölni szeretné a dokumentumot: ${documentName}?`)) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/dms/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status >= 500) {
          throw new Error('Szerver hiba. Kérem próbálja újra később.');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Hiba történt a törlés során');
        }
      }

      setSuccess('Dokumentum sikeresen törölve!');
      setTimeout(() => {
        setSuccess('');
        loadDocuments();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a törlés során');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadOcrText = async (documentId: string, documentName: string) => {
    try {
      const response = await apiFetch(`/dms/documents/${documentId}/ocr/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 404) {
          throw new Error('OCR feldolgozás még nem készült el vagy nem található.');
        } else {
          throw new Error('Nem sikerült letölteni az OCR szövegfájlt.');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentName.replace(/\.[^/.]+$/, '')}_ocr.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a letöltés során');
    }
  };

  const handleOpenFolder = async (documentId: string) => {
    const isElectron = !!(window as any).electron;
    
    if (!isElectron) {
      setError('Ez a funkció csak az asztali alkalmazásban érhető el');
      return;
    }

    try {
      const response = await apiFetch(`/dms/documents/${documentId}/folder-path`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nincs hitelesítve. Kérem jelentkezzen be újra.');
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.');
        } else if (response.status === 404) {
          throw new Error('Dokumentum nem található vagy nincs fájl társítva.');
        } else {
          throw new Error('Nem sikerült lekérni a mappa elérési útját.');
        }
      }

      const data = await response.json();
      const result = await (window as any).electron.openFolder(data.folderPath);
      
      if (!result.success) {
        throw new Error(result.error || 'Nem sikerült megnyitni a mappát');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt a mappa megnyitása során');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Dokumentumok</h1>
        <div className="flex gap-2 flex-wrap">
          {canExportDms && (
          <>
          <button
            type="button"
            onClick={async () => {
              const res = await apiFetch('/dms/documents/export/csv');
              if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'dokumentumok.csv';
                a.click();
              }
            }}
            className="px-3 py-2 border rounded text-sm"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={async () => {
              const res = await apiFetch('/dms/documents/export/excel');
              if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'dokumentumok.xlsx';
                a.click();
              }
            }}
            className="px-3 py-2 border rounded text-sm"
          >
            Export XLSX
          </button>
          </>
          )}
          {canCreateDms && (
          <button 
            onClick={() => handleOpenModal()}
            className="bg-mbit-blue text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Új dokumentum / iktatás
          </button>
          )}
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1 max-w-md"
          placeholder="Iktatószám keresés..."
          value={iktatoSearch}
          onChange={(e) => setIktatoSearch(e.target.value)}
        />
        <button
          type="button"
          className="px-3 py-2 bg-gray-100 rounded"
          onClick={async () => {
            if (!iktatoSearch.trim()) return;
            const res = await apiFetch(`/dms/documents/lookup/iktato/${encodeURIComponent(iktatoSearch.trim())}`);
            if (res.ok) {
              const doc = await res.json();
              setDetailDocument(doc);
              setIsDetailModalOpen(true);
            } else setError('Nem található iktatószám');
          }}
        >
          Iktatószám kereső
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Összes dokumentum</div>
          <div className="text-2xl font-bold">{documents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Aktív dokumentumok</div>
          <div className="text-2xl font-bold text-green-600">
            {countByAllapot('aktiv')}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Archivált</div>
          <div className="text-2xl font-bold text-yellow-600">
            {countByAllapot('archivalva')}
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedAllapot('')}
            className={`px-4 py-2 rounded ${
              selectedAllapot === ''
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Összes állapot
          </button>
          {ALLAPOTOK.map(all => (
            <button
              key={all.kod}
              onClick={() => setSelectedAllapot(all.kod)}
              className={`px-4 py-2 rounded ${
                selectedAllapot === all.kod
                  ? 'bg-mbit-blue text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {all.nev}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm font-medium text-gray-700">Irány:</span>
          <button
            onClick={() => setSelectedIrany('')}
            className={`px-4 py-2 rounded text-sm ${
              selectedIrany === ''
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Összes
          </button>
          <button
            onClick={() => setSelectedIrany('bejovo')}
            className={`px-4 py-2 rounded text-sm ${
              selectedIrany === 'bejovo'
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Beérkező
          </button>
          <button
            onClick={() => setSelectedIrany('kimeno')}
            className={`px-4 py-2 rounded text-sm ${
              selectedIrany === 'kimeno'
                ? 'bg-mbit-blue text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Kimenő
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Címszó:</span>
          <select
            value={selectedTagId}
            onChange={(e) => setSelectedTagId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Összes címszó</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.nev}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Keresés (név, iktatószám, tartalom, címszó...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Betöltés...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nincs dokumentum</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Iktatószám</th>
                  <th className="text-left p-4 font-medium text-gray-700">Név</th>
                  <th className="text-left p-4 font-medium text-gray-700">Típus</th>
                  <th className="text-left p-4 font-medium text-gray-700">Irány</th>
                  <th className="text-left p-4 font-medium text-gray-700">Kategória</th>
                  <th className="text-left p-4 font-medium text-gray-700">Irat helye</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ügyfél</th>
                  <th className="text-left p-4 font-medium text-gray-700">Állapot</th>
                  <th className="text-left p-4 font-medium text-gray-700">Érvényesség</th>
                  <th className="text-left p-4 font-medium text-gray-700">Létrehozva</th>
                  <th className="text-left p-4 font-medium text-gray-700">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map(doc => (
                  <>
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-mbit-blue">{doc.iktatoSzam}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(doc.fajlMeret)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{doc.nev}</div>
                        <div className="text-xs text-gray-500">{doc.fajlNev}</div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doc.tags.map((dt) => (
                              <span
                                key={dt.id}
                                className="px-1.5 py-0.5 rounded text-xs"
                                style={{
                                  backgroundColor: dt.tag.szin ? `${dt.tag.szin}20` : '#e5e7eb',
                                  color: dt.tag.szin || '#6b7280',
                                }}
                              >
                                {dt.tag.nev}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4">{getTipusBadge(doc.tipus)}</td>
                      <td className="p-4">
                        {doc.irany ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            doc.irany === 'bejovo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {doc.irany === 'bejovo' ? 'Beérkező' : 'Kimenő'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {doc.category ? doc.category.nev : '-'}
                      </td>
                      <td className="p-4 text-sm">
                        {doc.jelenlegiHely ? (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {doc.jelenlegiHely}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {doc.account ? doc.account.nev : '-'}
                      </td>
                      <td className="p-4">{getAllapotBadge(doc.allapot)}</td>
                      <td className="p-4 text-sm">
                        {doc.ervenyessegKezdet || doc.ervenyessegVeg ? (
                          <div>
                            {formatDate(doc.ervenyessegKezdet)} - {formatDate(doc.ervenyessegVeg)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(doc.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          {doc.fajlNev && (
                            <>
                              <button
                                onClick={() => handleOcrTrigger(doc.id)}
                                disabled={ocrLoading[doc.id]}
                                className={`px-3 py-1 rounded text-sm ${
                                  ocrLoading[doc.id]
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-mbit-blue text-white hover:bg-blue-600'
                                }`}
                              >
                                {ocrLoading[doc.id] ? 'Feldolgozás...' : 'Szövegkinyerés'}
                              </button>
                              {!!(window as any).electron && (
                                <button
                                  onClick={() => handleOpenFolder(doc.id)}
                                  className="px-3 py-1 rounded text-sm bg-purple-600 text-white hover:bg-purple-700"
                                  title="Mappa megnyitása Windows Explorerben"
                                >
                                  📁 Mappa megnyitása
                                </button>
                              )}
                            </>
                          )}
                          {doc.ocrJob?.allapot === 'kesz' && doc.ocrJob?.txtFajlUtvonal && (
                            <button
                              onClick={() => handleDownloadOcrText(doc.id, doc.fajlNev)}
                              className="px-3 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                              title="OCR szöveg letöltése .txt fájlként"
                            >
                              📥 Letöltés
                            </button>
                          )}
                          <button
                            onClick={() => handleViewDetails(doc.id)}
                            className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                            title="Részletek"
                          >
                            Részletek
                          </button>
                          <button
                            onClick={() => handleOpenModal(doc)}
                            className="px-3 py-1 rounded text-sm bg-yellow-600 text-white hover:bg-yellow-700"
                            title="Szerkesztés"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id, doc.nev)}
                            className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            Törlés
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedDoc === doc.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={10} className="p-4">
                          <div className="border border-gray-200 rounded-lg bg-white p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-800">OCR Eredmény</h3>
                              <button
                                onClick={() => setExpandedDoc(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 border border-gray-300 rounded"
                              >
                                Bezárás
                              </button>
                            </div>
                            {doc.tartalom ? (
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">Kinyert szöveg</span>
                                  {doc.ocrJob?.allapot === 'kesz' && doc.ocrJob?.txtFajlUtvonal && (
                                    <button
                                      onClick={() => handleDownloadOcrText(doc.id, doc.fajlNev)}
                                      className="px-3 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                                    >
                                      📥 Letöltés .txt fájlként
                                    </button>
                                  )}
                                </div>
                                <div className="bg-gray-100 p-3 rounded border border-gray-200 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                                  {doc.tartalom}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 italic text-center py-4">
                                Még nincs OCR eredmény
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Új dokumentum" size="lg" zIndex={100}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4" style={{ position: 'relative', zIndex: 101 }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Név <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nev}
                onChange={(e) => setFormData({ ...formData, nev: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ position: 'relative', zIndex: 102 }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Típus <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipus}
                onChange={(e) => setFormData({ ...formData, tipus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {TIPUSOK.map(t => (
                  <option key={t.kod} value={t.kod}>{t.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Irány
              </label>
              <select
                value={formData.irany}
                onChange={(e) => setFormData({ ...formData, irany: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                <option value="bejovo">Beérkező</option>
                <option value="kimeno">Kimenő</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Kategória
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-sm text-mbit-blue hover:text-blue-800 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Új kategória
                </button>
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nev}</option>
                ))}
              </select>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map(c => (
                    <div key={c.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                      <span>{c.nev}</span>
                      <button
                        type="button"
                        onClick={() => handleEditCategory(c)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Szerkesztés"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.nev)}
                        className="text-red-600 hover:text-red-800"
                        title="Törlés"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Ügyfél
                </label>
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(true)}
                  className="text-sm text-mbit-blue hover:text-blue-800 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Új ügyfél
                </button>
              </div>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Válasszon --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.nev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Állapot <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.allapot}
                onChange={(e) => setFormData({ ...formData, allapot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="aktiv">Aktív</option>
                <option value="archivalva">Archivált</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érvényesség kezdete
                </label>
                <input
                  type="date"
                  value={formData.ervenyessegKezdet}
                  onChange={(e) => setFormData({ ...formData, ervenyessegKezdet: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Érvényesség vége
                </label>
                <input
                  type="date"
                  value={formData.ervenyessegVeg}
                  onChange={(e) => setFormData({ ...formData, ervenyessegVeg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lejárat
              </label>
              <input
                type="date"
                value={formData.lejarat}
                onChange={(e) => setFormData({ ...formData, lejarat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Irat helye
              </label>
              <input
                type="text"
                value={formData.jelenlegiHely}
                onChange={(e) => setFormData({ ...formData, jelenlegiHely: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pl. Irodaszekrény A, Polc 3, stb."
              />
            </div>

            {!editingDocumentId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fájl <span className="text-red-500">*</span>
                </label>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Creation Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setNewCategoryName('');
        }}
        title="Új kategória hozzáadása"
        zIndex={200}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategória neve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createCategory();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Számlák, Szerződések, stb."
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setNewCategoryName('');
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={createCategory}
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving || !newCategoryName.trim()}
            >
              {saving ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Account Creation Modal */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setAccountFormData({
            nev: '',
            tipus: 'ugyfél',
            adoszam: '',
            cim: '',
            email: '',
            telefon: '',
            megjegyzesek: '',
          });
        }}
        title="Új ügyfél hozzáadása"
        zIndex={200}
      >
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Név <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountFormData.nev}
              onChange={(e) => setAccountFormData({ ...accountFormData, nev: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  createAccount();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Kovács Kft."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Típus <span className="text-red-500">*</span>
            </label>
            <select
              value={accountFormData.tipus}
              onChange={(e) => setAccountFormData({ ...accountFormData, tipus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="partner">Partner</option>
              <option value="ugyfél">Ügyfél</option>
              <option value="szállító">Szállító</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adószám</label>
            <input
              type="text"
              value={accountFormData.adoszam}
              onChange={(e) => setAccountFormData({ ...accountFormData, adoszam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. 12345678-1-23"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cím</label>
            <input
              type="text"
              value={accountFormData.cim}
              onChange={(e) => setAccountFormData({ ...accountFormData, cim: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Budapest, Fő utca 1."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={accountFormData.email}
              onChange={(e) => setAccountFormData({ ...accountFormData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. info@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={accountFormData.telefon}
              onChange={(e) => setAccountFormData({ ...accountFormData, telefon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. +36 1 234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Megjegyzések</label>
            <textarea
              value={accountFormData.megjegyzesek}
              onChange={(e) => setAccountFormData({ ...accountFormData, megjegyzesek: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcionális megjegyzések..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAccountModalOpen(false);
                setAccountFormData({
                  nev: '',
                  tipus: 'ugyfél',
                  adoszam: '',
                  cim: '',
                  email: '',
                  telefon: '',
                  megjegyzesek: '',
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={createAccount}
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving || !accountFormData.nev.trim()}
            >
              {saving ? 'Létrehozás...' : 'Létrehozás'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Category Edit Modal */}
      <Modal
        isOpen={isCategoryEditModalOpen}
        onClose={() => {
          setIsCategoryEditModalOpen(false);
          setEditingCategoryId(null);
          setEditingCategoryName('');
        }}
        title="Kategória szerkesztése"
        zIndex={200}
      >
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategória neve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingCategoryName}
              onChange={(e) => setEditingCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateCategory();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. Számlák, Szerződések, stb."
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsCategoryEditModalOpen(false);
                setEditingCategoryId(null);
                setEditingCategoryName('');
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={handleUpdateCategory}
              className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={saving || !editingCategoryName.trim()}
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Részletes nézet modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailDocument(null);
        }} 
        title={detailDocument ? `Dokumentum részletei: ${detailDocument.nev}` : 'Részletek'} 
        size="xl" 
        zIndex={150}
      >
        {detailDocument && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b pb-4">
              <button
                type="button"
                className="text-sm px-3 py-1 border rounded"
                onClick={async () => {
                  const res = await apiFetch(`/dms/documents/${detailDocument.id}/download`);
                  if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setPreviewUrl(url);
                  } else if (res.status === 404) {
                    setError('A dokumentum fájlja nem található. Lehetséges régi tárolási útvonal – töltse fel újra a fájlt.');
                  } else {
                    const err = await res.json().catch(() => ({}));
                    setError((err as { message?: string }).message || 'A fájl letöltése sikertelen.');
                  }
                }}
              >
                Előnézet / megnyitás
              </button>
              <button
                type="button"
                className="text-sm px-3 py-1 border rounded"
                onClick={() => handleOcrTrigger(detailDocument.id)}
              >
                OCR indítása
              </button>
              <select
                className="text-sm border rounded px-2"
                defaultValue=""
                onChange={async (e) => {
                  if (!e.target.value) return;
                  await apiFetch(`/dms/documents/${detailDocument.id}/workflow`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ujAllapot: e.target.value, megjegyzes: workflowMegjegyzes }),
                  });
                  const refreshed = await apiFetch(`/dms/documents/${detailDocument.id}`);
                  if (refreshed.ok) setDetailDocument(await refreshed.json());
                }}
              >
                <option value="">Állapotváltás...</option>
                {ALLAPOTOK.map((a) => (
                  <option key={a.kod} value={a.kod}>{a.nev}</option>
                ))}
              </select>
              <input
                className="text-sm border rounded px-2 flex-1 min-w-[120px]"
                placeholder="Megjegyzés állapotváltáshoz"
                value={workflowMegjegyzes}
                onChange={(e) => setWorkflowMegjegyzes(e.target.value)}
              />
              <button
                type="button"
                className="text-sm px-3 py-1 bg-purple-100 rounded"
                onClick={async () => {
                  await apiFetch(`/dms/documents/${detailDocument.id}/archive`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ megjegyzes: 'Archiválás' }),
                  });
                  const refreshed = await apiFetch(`/dms/documents/${detailDocument.id}`);
                  if (refreshed.ok) setDetailDocument(await refreshed.json());
                }}
              >
                Archiválás
              </button>
              <label className="text-sm px-3 py-1 border rounded cursor-pointer">
                Új verzió
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const fd = new FormData();
                    fd.append('file', f);
                    fd.append('valtoztatasLeiras', 'Új verzió feltöltve');
                    await apiFetch(`/dms/documents/${detailDocument.id}/versions`, {
                      method: 'POST',
                      body: fd,
                    });
                    const refreshed = await apiFetch(`/dms/documents/${detailDocument.id}`);
                    if (refreshed.ok) setDetailDocument(await refreshed.json());
                  }}
                />
              </label>
            </div>
            {previewUrl && (
              <div className="border rounded p-2">
                {detailDocument.mimeType?.startsWith('image/') ? (
                  <img src={previewUrl} alt="preview" className="max-h-96 mx-auto" />
                ) : (
                  <iframe src={previewUrl} title="preview" className="w-full h-96" />
                )}
              </div>
            )}
            {detailDocument.tartalom && (
              <div className="border rounded p-3 bg-gray-50 text-sm max-h-32 overflow-y-auto">
                <strong>OCR szöveg:</strong> {detailDocument.tartalom.slice(0, 500)}
                {detailDocument.tartalom.length > 500 ? '…' : ''}
              </div>
            )}
            {/* Alap információk */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Iktatószám</div>
                <div className="font-medium">{detailDocument.iktatoSzam}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Név</div>
                <div className="font-medium">{detailDocument.nev}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Típus</div>
                <div>{getTipusBadge(detailDocument.tipus)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Irány</div>
                <div>
                  {detailDocument.irany ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      detailDocument.irany === 'bejovo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {detailDocument.irany === 'bejovo' ? 'Beérkező' : 'Kimenő'}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Kategória</div>
                <div>{detailDocument.category?.nev || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Ügyfél</div>
                <div>{detailDocument.account?.nev || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Irat helye</div>
                <div>
                  {detailDocument.jelenlegiHely ? (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {detailDocument.jelenlegiHely}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Állapot</div>
                <div>{getAllapotBadge(detailDocument.allapot)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Létrehozva</div>
                <div>{formatDate(detailDocument.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Módosítva</div>
                <div>{formatDate(detailDocument.updatedAt)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Létrehozta</div>
                <div>{detailDocument.createdBy?.nev || '-'}</div>
              </div>
            </div>

            {/* Érvényesség információk */}
            {(detailDocument.ervenyessegKezdet || detailDocument.ervenyessegVeg) && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Érvényesség</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Érvényesség kezdete</div>
                    <div>{formatDate(detailDocument.ervenyessegKezdet)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Érvényesség vége</div>
                    <div>{formatDate(detailDocument.ervenyessegVeg)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Verziók */}
            {detailDocument.versions && detailDocument.versions.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Verziók ({detailDocument.versions.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detailDocument.versions.map((version) => (
                    <div key={version.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Verzió {version.verzioSzam}</div>
                          {version.valtoztatasLeiras && (
                            <div className="text-sm text-gray-600 mt-1">{version.valtoztatasLeiras}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(version.createdAt)} {version.createdBy && `- ${version.createdBy.nev}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflow logok */}
            {detailDocument.workflowLogs && detailDocument.workflowLogs.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Állapot változások ({detailDocument.workflowLogs.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {detailDocument.workflowLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{getAllapotNev(log.regiAllapot)}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-medium">{getAllapotNev(log.ujAllapot)}</span>
                          </div>
                          {log.megjegyzes && (
                            <div className="text-sm text-gray-600 mt-1">{log.megjegyzes}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">{formatDate(log.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jogosultságok */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Jogosultságok</h3>
              </div>
              <div className="space-y-2 mb-4">
                {documentAccess.length > 0 ? (
                  documentAccess.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <div className="font-medium">{acc.user.nev}</div>
                        <div className="text-sm text-gray-600">{acc.user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          acc.jogosultsag === 'FULL_ACCESS' 
                            ? 'bg-green-100 text-green-800'
                            : acc.jogosultsag === 'EDIT' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {acc.jogosultsag === 'FULL_ACCESS' ? 'Teljes hozzáférés' : 
                           acc.jogosultsag === 'EDIT' ? 'Szerkesztés' : 'Olvasás'}
                        </span>
                        {detailDocument && (
                          <button
                            onClick={() => handleRemoveAccess(detailDocument.id, acc.userId)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            title="Jogosultság eltávolítása"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm italic">Nincs hozzárendelt jogosultság</div>
                )}
              </div>
              {detailDocument && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Jogosultság hozzáadása</h4>
                  <div className="flex gap-2">
                    <select
                      id="access-user-select"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Válasszon felhasználót --</option>
                      {users.filter(u => !documentAccess.some(acc => acc.userId === u.id)).map(u => (
                        <option key={u.id} value={u.id}>{u.nev} ({u.email})</option>
                      ))}
                    </select>
                    <select
                      id="access-permission-select"
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="READ">Olvasás</option>
                      <option value="EDIT">Szerkesztés</option>
                      <option value="FULL_ACCESS">Teljes hozzáférés</option>
                    </select>
                    <button
                      onClick={() => {
                        const userSelect = document.getElementById('access-user-select') as HTMLSelectElement;
                        const permissionSelect = document.getElementById('access-permission-select') as HTMLSelectElement;
                        if (userSelect.value && detailDocument) {
                          handleAddAccess(detailDocument.id, userSelect.value, permissionSelect.value);
                          userSelect.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-mbit-blue text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Hozzáadás
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Életciklus idővonal */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Dokumentum életciklus</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-4">
                  {/* Létrehozás */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-xs font-bold">
                      ✓
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-700">Dokumentum létrehozva</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {detailDocument.createdBy?.nev || 'Ismeretlen'} által
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(detailDocument.createdAt)}</div>
                        </div>
                        <div className="text-xs text-gray-400">{getAllapotBadge('aktiv')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Verziók időrendben */}
                  {detailDocument.versions && detailDocument.versions.length > 0 && detailDocument.versions.map((version) => (
                    <div key={version.id} className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-bold">
                        {version.verzioSzam}
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-blue-700">Verzió {version.verzioSzam} létrehozva</div>
                            {version.valtoztatasLeiras && (
                              <div className="text-sm text-gray-600 mt-1">{version.valtoztatasLeiras}</div>
                            )}
                            <div className="text-sm text-gray-600 mt-1">
                              {version.createdBy?.nev || 'Ismeretlen'} által
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{formatDate(version.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Állapot változások időrendben */}
                  {detailDocument.workflowLogs && detailDocument.workflowLogs.length > 0 && detailDocument.workflowLogs.map((log) => (
                    <div key={log.id} className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white text-xs font-bold">
                        ↻
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-yellow-700">Állapot változás</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm">{getAllapotNev(log.regiAllapot)}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-sm font-medium">{getAllapotNev(log.ujAllapot)}</span>
                            </div>
                            {log.megjegyzes && (
                              <div className="text-sm text-gray-600 mt-1">{log.megjegyzes}</div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">{formatDate(log.createdAt)}</div>
                          </div>
                          <div className="text-xs">{getAllapotBadge(log.ujAllapot)}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Módosítás */}
                  {detailDocument.updatedAt && detailDocument.updatedAt !== detailDocument.createdAt && (
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-bold">
                        ✎
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-purple-700">Dokumentum módosítva</div>
                            <div className="text-xs text-gray-500 mt-1">{formatDate(detailDocument.updatedAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
