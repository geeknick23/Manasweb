import { User } from '@/services/api';

// extractUniqueValues: get unique, non-empty, sorted values from an array using a getter
export function extractUniqueValues<T, V>(arr: T[], getter: (item: T) => V | undefined | null): string[] {
  const set = new Set<string>();
  arr.forEach(item => {
    const value = getter(item);
    if (typeof value === 'string' && value.trim()) {
      set.add(value.trim());
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// filterProfiles: filter profiles by search query (name, profession, location fields)
export function filterProfiles(profiles: User[], query: string): User[] {
  const q = query.trim().toLowerCase();
  if (!q) return profiles;
  return profiles.filter(profile => {
    const name = profile.full_name?.toLowerCase() || '';
    const profession = profile.profession?.toLowerCase() || '';
    const location = [
      profile.location?.village,
      profile.location?.tehsil,
      profile.location?.district,
      profile.location?.state
    ].filter(Boolean).join(' ').toLowerCase();
    return (
      name.includes(q) ||
      profession.includes(q) ||
      location.includes(q)
    );
  });
} 