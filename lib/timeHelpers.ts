export function isOpenNow(openingHours: any): boolean {
  if (!openingHours) return false
  
  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDay = dayNames[now.getDay()]
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const todayHours = openingHours[currentDay]
  if (!todayHours || todayHours === 'Closed') return false
  
  const [openTime, closeTime] = todayHours.split(' - ')
  if (!openTime || !closeTime) return false
  
  const [openHour, openMin] = openTime.split(':').map(Number)
  const [closeHour, closeMin] = closeTime.split(':').map(Number)
  
  const openMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin
  
  return currentTime >= openMinutes && currentTime <= closeMinutes
}
