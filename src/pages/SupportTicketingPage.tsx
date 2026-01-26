import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Search,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.new';
import * as ticketsApi from '@/api/tickets';
import type { TicketWithDetails, TicketResponse as ApiTicketResponse } from '@/api/tickets';

interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  email: string;
}

const SupportTicketingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null);
  const [ticketResponses, setTicketResponses] = useState<ApiTicketResponse[]>([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [canCreateTicket, setCanCreateTicket] = useState(true);
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);

  // Form state
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    email: user?.email || '',
  });

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update email when user loads
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  // Fetch tickets on mount
  const fetchTickets = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingTickets(true);
    try {
      const response = await ticketsApi.getMyTickets();
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Gagal memuat daftar ticket');
    } finally {
      setIsLoadingTickets(false);
    }
  }, [isAuthenticated]);

  // Check cooldown on mount
  const checkCooldownStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await ticketsApi.checkCooldown();
      setCanCreateTicket(response.can_create);
      setCooldownRemaining(response.remaining_seconds);
    } catch (error) {
      console.error('Failed to check cooldown:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTickets();
    checkCooldownStatus();
  }, [fetchTickets, checkCooldownStatus]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining <= 0) {
      setCanCreateTicket(true);
      return;
    }

    const timer = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          setCanCreateTicket(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.title.trim()) {
      toast.error('Judul ticket diperlukan');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi diperlukan');
      return;
    }
    if (!formData.category) {
      toast.error('Kategori diperlukan');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email diperlukan');
      return;
    }

    setIsLoadingSubmit(true);

    try {
      const response = await ticketsApi.createTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority || 'medium',
        email: formData.email,
      });

      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        email: user?.email || '',
      });
      setActiveTab('view');
      
      // Refresh tickets and cooldown
      await fetchTickets();
      await checkCooldownStatus();

      toast.success(response.message || 'Ticket berhasil dibuat!');
    } catch (error: any) {
      toast.error(error?.message || 'Gagal membuat ticket');
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleSelectTicket = async (ticket: TicketWithDetails) => {
    setSelectedTicket(ticket);
    setIsLoadingDetail(true);
    
    try {
      const response = await ticketsApi.getTicketDetail(ticket.id);
      setTicketResponses(response.responses || []);
      setSelectedTicket(response.ticket);
    } catch (error) {
      console.error('Failed to fetch ticket detail:', error);
      toast.error('Gagal memuat detail ticket');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleAddResponse = async () => {
    if (!responseMessage.trim() || !selectedTicket) {
      toast.error('Pesan respons tidak boleh kosong');
      return;
    }

    setIsLoadingSubmit(true);

    try {
      const response = await ticketsApi.addTicketResponse(selectedTicket.id, {
        message: responseMessage,
      });

      // Add response to list
      setTicketResponses(prev => [...prev, response.response]);
      setResponseMessage('');
      
      // Refresh tickets list
      await fetchTickets();

      toast.success('Respons berhasil dikirim!');
    } catch (error: any) {
      toast.error(error?.message || 'Gagal mengirim respons');
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const getStatusBadge = (status: TicketWithDetails['status']) => {
    const badges: Record<TicketWithDetails['status'], { bg: string; text: string; icon: React.ReactNode }> = {
      open: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <AlertCircle className="w-4 h-4" />,
      },
      in_progress: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      pending_response: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <Clock className="w-4 h-4" />,
      },
      resolved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      closed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <XCircle className="w-4 h-4" />,
      },
    };

    const badge = badges[status];
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${badge.bg} ${badge.text} text-xs font-medium`}>
        {badge.icon}
        {ticketsApi.getStatusLabel(status)}
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
      urgent: 'text-red-700',
    };
    return colors[priority] || colors.medium;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      `TKT-${String(ticket.id).padStart(3, '0')}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Not authenticated view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container mx-auto px-4 py-16 mt-32">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-foreground/40 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Diperlukan</h2>
            <p className="text-foreground/60 mb-6">
              Anda harus login terlebih dahulu untuk mengakses fitur dukungan pelanggan.
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-12">
        <div className="container mx-auto px-4 mt-16">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="p-2 hover:bg-background/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Dukungan Pelanggan</h1>
          </div>
          <p className="text-background/80 text-lg">
            Hubungi tim support kami untuk bantuan, pertanyaan, atau laporan masalah
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-foreground/10">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'view'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            Ticket Saya ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-4 px-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'create'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            <Plus className="w-4 h-4" />
            Buat Ticket Baru
          </button>
        </div>

        {/* View Tickets Tab */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Cari Ticket</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                  <Input
                    placeholder="ID atau judul..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="open">Terbuka</SelectItem>
                    <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                    <SelectItem value="pending_response">Menunggu Respons</SelectItem>
                    <SelectItem value="resolved">Terselesaikan</SelectItem>
                    <SelectItem value="closed">Ditutup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Prioritas</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prioritas</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Mendesak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    fetchTickets();
                    checkCooldownStatus();
                  }}
                  disabled={isLoadingTickets}
                  className="w-full"
                >
                  {isLoadingTickets ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingTickets && tickets.length === 0 && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-foreground/60">Memuat ticket...</p>
              </div>
            )}

            {/* Tickets List */}
            {!isLoadingTickets && filteredTickets.length === 0 ? (
              <div className="text-center py-12 bg-foreground/5 rounded-xl border border-foreground/10">
                <MessageCircle className="w-12 h-12 mx-auto text-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground/60 mb-2">Tidak ada ticket</h3>
                <p className="text-foreground/50 mb-4">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Tidak ada ticket yang sesuai dengan filter.'
                    : 'Anda belum membuat ticket apapun.'}
                </p>
                <Button
                  onClick={() => setActiveTab('create')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Ticket Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                      selectedTicket?.id === ticket.id
                        ? 'border-primary bg-primary/5'
                        : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                            TKT-{String(ticket.id).padStart(3, '0')}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{ticket.title}</h3>
                        <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {ticket.response_count} respons
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticketsApi.getPriorityLabel(ticket.priority)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Ticket Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            {!canCreateTicket && cooldownRemaining > 0 ? (
              <div className="p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Cooldown Period Aktif</h3>
                    <p className="text-sm text-yellow-800 mb-2">
                      Untuk mencegah spam, Anda hanya bisa membuat 1 ticket per jam. 
                    </p>
                    <p className="text-sm font-semibold text-yellow-900">
                      Coba lagi dalam: {ticketsApi.formatCooldownTime(cooldownRemaining)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-6 bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold mb-2 block">
                    Judul Ticket *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ringkas masalah atau pertanyaan Anda..."
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    maxLength={100}
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    {formData.title.length}/100
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                    Deskripsi Detail *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan masalah secara detail agar kami bisa membantu lebih baik..."
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={5}
                    maxLength={1000}
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    {formData.description.length}/1000
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold mb-2 block">
                      Kategori *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={value =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Akun & Login</SelectItem>
                        <SelectItem value="cv-builder">CV Builder</SelectItem>
                        <SelectItem value="job-applications">Lamaran Kerja</SelectItem>
                        <SelectItem value="profile">Profil</SelectItem>
                        <SelectItem value="payment">Pembayaran</SelectItem>
                        <SelectItem value="search-filter">Pencarian & Filter</SelectItem>
                        <SelectItem value="notification">Notifikasi</SelectItem>
                        <SelectItem value="technical">Masalah Teknis</SelectItem>
                        <SelectItem value="feature-request">Permintaan Fitur</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-semibold mb-2 block">
                      Prioritas
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={value =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="urgent">Mendesak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
                    Email Kontak *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <p className="text-xs text-foreground/50 mt-1">
                    Kami akan menggunakan email ini untuk menghubungi Anda
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoadingSubmit}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoadingSubmit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Membuat Ticket...
                    </>
                  ) : (
                    'Buat Ticket'
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Ticket Detail Panel */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-background rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background p-6 flex-shrink-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-background/70 font-mono mb-1">
                      TKT-{String(selectedTicket.id).padStart(3, '0')}
                    </p>
                    <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTicket(null);
                      setTicketResponses([]);
                    }}
                    className="text-2xl hover:opacity-70 transition-opacity"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedTicket.status)}
                  <span className={`text-xs font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                    {ticketsApi.getPriorityLabel(selectedTicket.priority)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Ticket Info */}
                    <div className="p-6 border-b border-foreground/10">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-foreground/50 font-semibold mb-1">DESKRIPSI</p>
                          <p className="text-sm text-foreground">{selectedTicket.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-foreground/50 font-semibold mb-1">DIBUAT</p>
                            <p className="text-foreground">
                              {new Date(selectedTicket.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground/50 font-semibold mb-1">KATEGORI</p>
                            <p className="text-foreground">{ticketsApi.getCategoryLabel(selectedTicket.category)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Responses */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs font-semibold text-foreground/50 uppercase">
                        Percakapan ({ticketResponses.length})
                      </p>
                      <div className="space-y-3">
                        {ticketResponses.map(response => (
                          <div
                            key={response.id}
                            className={`p-3 rounded-lg ${
                              response.sender_type === 'user'
                                ? 'bg-primary/10 border border-primary/20'
                                : 'bg-foreground/5 border border-foreground/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-foreground/70">
                                {response.sender_type === 'user' ? 'Anda' : 'Tim Support'}
                              </p>
                              <p className="text-xs text-foreground/50">
                                {new Date(response.created_at).toLocaleDateString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <p className="text-sm text-foreground">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Add Response */}
              {selectedTicket.status !== 'closed' && (
                <div className="p-6 border-t border-foreground/10 flex-shrink-0">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Tambahkan respons Anda..."
                      value={responseMessage}
                      onChange={e => setResponseMessage(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-foreground/50">
                        {responseMessage.length}/500
                      </p>
                      <Button
                        onClick={handleAddResponse}
                        disabled={isLoadingSubmit || !responseMessage.trim()}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoadingSubmit ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Mengirim...
                          </>
                        ) : (
                          'Kirim'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketingPage;
