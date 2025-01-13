export const platformDomains = [
  'localhost', 
  'sokoby.com', 
  'www.sokoby.com', 
  'preview--sokoby-04.lovable.app',
  'sokoby-04.lovableproject.com',
  '16ad07cd-3490-4e7c-82b3-544f50ffc26d.lovableproject.com'
];

export const isPlatformDomain = (hostname: string): boolean => {
  return platformDomains.includes(hostname);
};