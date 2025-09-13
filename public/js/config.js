export async function getFirebaseConfig() {
  const res = await fetch('/config');
  if (!res.ok) throw new Error('Failed to load Firebase config');
  return await res.json();
}