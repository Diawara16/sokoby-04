export const calculateTrend = (data: any[] | undefined, metric: string) => {
  if (!data || data.length < 2) return 0
  
  const current = data.at(-1)?.[metric]
  const previous = data.at(-2)?.[metric]
  
  if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) return 0
  
  return ((current - previous) / previous) * 100
}