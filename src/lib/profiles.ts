/** Owner-supplied public business profiles. No account access or automated messaging. */
export const profiles = {
  google: 'https://share.google/0vZTRWXueTNG8861z',
  youtube: 'https://www.youtube.com/@DrVipulAhireOfficial',
  instagram: 'https://www.instagram.com/physiotherapist_shirur/',
  whatsapp: '918624860808',
};
export const channelPlaylists = [
  { id: 'PL2GdC5_xwrQLXxXpyLRABS8DSRnWVFBLB', label: 'Knee care', services: ['orthopaedic-physiotherapy','geriatric-physiotherapy'] },
  { id: 'PL2GdC5_xwrQK0Iy_0UKaKUpzv6XIlMTB5', label: 'Neurological rehabilitation', services: ['neurological-rehabilitation','geriatric-physiotherapy'] },
  { id: 'PL2GdC5_xwrQLPUuiG6SREuOdb7fCzGris', label: 'Post-operative rehabilitation', services: ['post-operative-rehabilitation','home-visit-physiotherapy'] },
  { id: 'PL2GdC5_xwrQI5YiAaupyWmSuAm-UOHIFg', label: 'Physiotherapy and exercise', services: ['online-consultation'] },
];
/** Verified against public channel/playlist listings on 2026-11-26.
 * Topic labels are editorial, not quotations of video titles or clinical claims.
 * No changing view counts or unverified "most popular" ranking are displayed.
 */
export const featuredVideos = [
  { id: 'PRCjF3vPDZI', label: 'Knee care: a video from our channel', playlist: channelPlaylists[0]!.id, services: ['orthopaedic-physiotherapy','geriatric-physiotherapy'] },
  { id: '18X9gQ7PZhw', label: 'Stroke rehabilitation and older adults', playlist: channelPlaylists[1]!.id, services: ['neurological-rehabilitation','geriatric-physiotherapy'] },
  { id: 'kx2Bwj2v9Bo', label: 'Physiotherapy after surgery', playlist: channelPlaylists[2]!.id, services: ['post-operative-rehabilitation'] },
  { id: 'RGcuTvMIjHg', label: 'Home physiotherapy in Shirur', playlist: channelPlaylists[2]!.id, services: ['home-visit-physiotherapy'] },
];
