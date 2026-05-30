import { PagedProfiles, ProfileListFilters, StoredAnalysis } from '../domain/profile';

export interface ProfileRepository {
  findByUsername(username: string): Promise<StoredAnalysis | null>;
  list(filters: ProfileListFilters): Promise<PagedProfiles>;
  save(profile: StoredAnalysis): Promise<void>;
  deleteByUsername(username: string): Promise<boolean>;
}