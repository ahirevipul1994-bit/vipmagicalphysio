import { login, logout, requestPasswordRecovery, updateUser } from '@netlify/identity';
import { toCsv } from './csv';
import { profiles } from './profiles';
export { toCsv } from './csv';

export type Language = 'en' | 'hi' | 'mr';
export type EnquiryKind = 'GENERAL' | 'CLINIC' | 'HOME_VISIT' | 'ONLINE';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'APPOINTMENT_REQUESTED' | 'CLOSED';
export type AppointmentStatus = 'REQUESTED' | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export interface BusinessSettings {
  name: string; founder: string; location: string; phone: string; whatsapp: string; email: string;
  hours: string; announcement: string; languages: string[]; address: string;
  google?: string; youtube?: string; instagram?: string;
}
export const defaultSettings: BusinessSettings = {
  name: 'VIP MAGICAL PHYSIO', founder: 'Dr. Vipul Ahire (Physio)', location: 'Shirur, Pune District, Maharashtra',
  phone: '+91 8624860808', whatsapp: profiles.whatsapp, email: '', hours: 'By appointment', announcement: '',
  languages: ['English', 'हिन्दी', 'मराठी'], address: '',
  google: profiles.google, youtube: profiles.youtube, instagram: profiles.instagram,
};
export interface EnquiryInput {
  name: string; phone: string; email?: string; kind: EnquiryKind; service: string;
  preferred_date?: string; locality?: string; message?: string; consent: boolean; language: Language;
  idempotency_key: string; website?: string; source?: string;
}
export interface Enquiry extends EnquiryInput {
  id: string; created_at: string; status: EnquiryStatus; next_action: string; follow_up_at: string | null;
}
export interface Appointment {
  id: string; enquiry_id: string; starts_at: string; ends_at: string; kind: EnquiryKind;
  status: AppointmentStatus; created_at: string; notes: string;
}
export interface ContentPage { slug: string; language: Language; title: string; body: string; published: boolean; }
export interface FinanceRecord { id: string; kind: 'PAYMENT' | 'EXPENSE'; amount_paise: number; description: string; occurred_at: string; created_at: string; }
export interface AuditRecord { id: string; action: string; entity: string; created_at: string; }
export const services = [
  { slug: 'orthopaedic-physiotherapy', name: 'Orthopaedic physiotherapy', description: 'Individual assessment and movement-focused support for joint, muscle and back concerns.' },
  { slug: 'neurological-rehabilitation', name: 'Neurological rehabilitation', description: 'Goal-led rehabilitation for movement, balance and everyday independence.' },
  { slug: 'post-operative-rehabilitation', name: 'Post-operative rehabilitation', description: 'A gradual return to everyday movement, in coordination with your surgical advice.' },
  { slug: 'geriatric-physiotherapy', name: 'Geriatric physiotherapy', description: 'Support for strength, balance and confident movement as you age.' },
  { slug: 'home-visit-physiotherapy', name: 'Home visit physiotherapy', description: 'Request physiotherapy in the comfort of your home in Shirur. Availability is confirmed personally.' },
  { slug: 'online-consultation', name: 'Online consultation', description: 'Discuss your goals and receive professional guidance remotely, where clinically appropriate.' },
];

async function api<Result>(path: string, method = 'GET', value?: object): Promise<Result> {
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: 'same-origin',
    headers: value ? { 'Content-Type': 'application/json' } : undefined,
    body: value ? JSON.stringify(value) : undefined,
  });
  if (response.status === 204) return undefined as Result;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) throw new Error(data?.error || 'This service is temporarily unavailable. Please try again.');
  return data as Result;
}
export async function getSettings(): Promise<BusinessSettings> {
  return { ...defaultSettings, ...await api<Partial<BusinessSettings>>('settings') };
}
export async function saveSettings(value: BusinessSettings) {
  await api('settings', 'PUT', value);
}
export async function submitEnquiry(input: EnquiryInput): Promise<string> {
  const { reference } = await api<{ reference: string }>('enquiries', 'POST', input);
  return reference;
}
export const signIn = login;
export const signOut = logout;
export async function isOwner(): Promise<boolean> {
  const { owner } = await api<{ owner: boolean }>('owner');
  return owner;
}
export const requestPasswordReset = requestPasswordRecovery;
export async function changePassword(password: string) {
  if (password.length < 12) throw new Error('Use at least 12 characters.');
  await updateUser({ password });
}
export async function listEnquiries(): Promise<Enquiry[]> {
  return api('enquiries');
}
export async function updateEnquiry(id: string, patch: Partial<Pick<Enquiry, 'status' | 'next_action' | 'follow_up_at'>>) {
  await api('enquiries', 'PATCH', { ...patch, id });
}
export async function listAppointments(): Promise<Appointment[]> {
  return api('appointments');
}
export async function saveAppointment(input: Omit<Appointment, 'id' | 'created_at'>, id?: string) {
  await api('appointments', 'PUT', { ...input, id });
}
export async function listContent(language?: Language): Promise<ContentPage[]> {
  return api(language ? `content?language=${encodeURIComponent(language)}` : 'content');
}
export async function saveContent(page: ContentPage) {
  await api('content', 'PUT', page);
}
export async function listFinance(): Promise<FinanceRecord[]> {
  return api('finance');
}
export async function addFinance(input: Omit<FinanceRecord, 'id' | 'created_at'>) {
  await api('finance', 'POST', input);
}
export async function listAudit(): Promise<AuditRecord[]> {
  return api('audit');
}
export function downloadCsv(rows: object[], filename: string) {
  const url = URL.createObjectURL(new Blob([toCsv(rows as Record<string, unknown>[])], {type:'text/csv;charset=utf-8;'}));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
