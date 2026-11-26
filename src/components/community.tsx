import { useState } from 'react';
import { Link } from 'wouter';
import { ExternalLink, MessageCircle, Youtube, Instagram, MapPin, Play } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { translate } from '@/lib/translations';
import { profiles, channelPlaylists, featuredVideos } from '@/lib/profiles';
import { useSettings } from '@/components/site';
import { Localized } from '@/components/localized';

export function whatsappUrl(number: string, language: string) {
  const message = language === 'mr' ? 'नमस्कार, मला VIP MAGICAL PHYSIO येथे अपॉइंटमेंटची विनंती करायची आहे. कृपया उपलब्ध वेळ कळवा.'
    : language === 'hi' ? 'नमस्ते, मुझे VIP MAGICAL PHYSIO में अपॉइंटमेंट का अनुरोध करना है। कृपया उपलब्ध समय बताएं.'
    : 'Hello, I would like to request an appointment with VIP MAGICAL PHYSIO. Please let me know the available times.';
  return `https://wa.me/${number.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;
}
function safeProfile(value: string | undefined, hosts: string | string[], fallback: string) {
  try { const u = new URL(value || fallback); return u.protocol === 'https:' && [hosts].flat().some(host=>u.hostname === host || u.hostname.endsWith('.'+host)) ? u.href : fallback; }
  catch { return fallback; }
}
export function CommunityLinks({compact = false}: {compact?: boolean}) {
  const {data} = useSettings();
  return <Localized><section className={compact ? 'space-y-3' : 'mx-auto max-w-7xl px-5 py-16'} aria-label="Connect with us">
    {!compact && <><p className="text-sm uppercase tracking-widest text-accent">Stay connected</p><h2 className="font-display mt-3 text-4xl">Your feedback. Our community.</h2>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Visited us? Open our Google Business Profile to read or leave an honest review. All feedback is welcome; no rewards or rating requirements.</p></>}
    <div className={`mt-5 flex flex-wrap gap-3 ${compact ? 'text-sm' : ''}`}>
      <a href={safeProfile(data?.google,['share.google','google.com','g.page','maps.app.goo.gl'],profiles.google)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-current px-5 py-3" data-testid="link-google-business"><MapPin size={18}/>Google Business Profile<ExternalLink size={14}/></a>
      <a href={safeProfile(data?.youtube,'youtube.com',profiles.youtube)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-current px-5 py-3" data-testid="link-youtube"><Youtube size={18}/>YouTube</a>
      <a href={safeProfile(data?.instagram,'instagram.com',profiles.instagram)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-current px-5 py-3" data-testid="link-instagram"><Instagram size={18}/>Instagram</a>
    </div>
    {!compact && <p className="mt-3 text-sm text-muted-foreground">The Google link opens the business profile, not a prefilled review form. Choose the review option on Google.</p>}
  </section></Localized>;
}
export function WhatsAppAppointment() {
  const {lang} = useI18n(); const {data} = useSettings();
  const number = data?.whatsapp || profiles.whatsapp;
  return <Localized><div className="rounded-2xl border border-primary/30 bg-secondary p-5">
    <h2 className="font-display text-2xl">Prefer WhatsApp?</h2>
    <p className="mt-2 text-muted-foreground">Request a visit directly on WhatsApp Business. We will reply to confirm availability. Please do not send medical records.</p>
    <a href={whatsappUrl(number,lang)} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-appointment" className="mt-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground"><MessageCircle size={19}/><span>Request on WhatsApp</span><span>{number.replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'')}</span></a>
  </div></Localized>;
}
function VideoCard({video}: {video: typeof featuredVideos[number]}) {
  const [loaded,setLoaded] = useState(false); const {lang} = useI18n();
  return <Localized><article className="overflow-hidden rounded-2xl border border-border bg-card" data-testid={`video-${video.id}`}>
    <div className="aspect-video bg-primary/10">
      {loaded ? <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${video.id}?list=${video.playlist}`} title={translate(video.label,lang)} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>
        : <button type="button" onClick={()=>setLoaded(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-primary" aria-label={`${translate('Load YouTube video',lang)}: ${translate(video.label,lang)}`}><Play size={36}/><span>Load YouTube video</span></button>}
    </div>
    <div className="p-5"><h3 className="font-display text-2xl">{video.label}</h3>
      <a className="mt-3 inline-flex items-center gap-2 font-semibold text-accent underline" href={`https://www.youtube.com/watch?v=${video.id}&list=${video.playlist}`} target="_blank" rel="noopener noreferrer">Watch on YouTube<ExternalLink size={14}/></a></div>
  </article></Localized>;
}
export function ServiceVideos({service,limit}: {service?:string;limit?:number}) {
  const videos=featuredVideos.filter(v=>!service||v.services.includes(service)).slice(0,limit);
  const playlists=channelPlaylists.filter(p=>!service||p.services.includes(service));
  return <Localized><section className="mx-auto max-w-7xl px-5 py-14" aria-label="Videos and playlists">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-accent">From our YouTube channel</p><h2 className="font-display mt-3 text-4xl">Watch, learn, ask.</h2></div><Link href="/videos" className="text-accent underline">All videos and playlists</Link></div>
    <p className="mt-4 max-w-3xl text-muted-foreground">Selected from Dr. Vipul Ahire’s public playlists for relevance. Videos may describe individual experiences; they do not promise results or replace your assessment. Video language remains the creator’s original language.</p>
    {!videos.length && <p className="mt-5 rounded-xl bg-secondary p-4">A dedicated video for this service has not been verified. Explore the channel’s general exercise playlist instead.</p>}
    <div className="mt-7 grid gap-5 md:grid-cols-2">{videos.map(v=><VideoCard key={v.id} video={v}/>)}</div>
    <div className="mt-5 flex flex-wrap gap-3">{playlists.map(p=><a className="rounded-full border border-border px-4 py-2 text-primary underline" key={p.id} href={`https://www.youtube.com/playlist?list=${p.id}`} target="_blank" rel="noopener noreferrer">{p.label}</a>)}</div>
    <p className="mt-4 text-sm text-muted-foreground">YouTube is contacted only when you load a video or follow a link. YouTube’s privacy and cookie policies then apply.</p>
  </section></Localized>;
}
