import { getRepositories } from '@/repositories'
import type { AllSettings, SettingsSection } from '@/features/settings/types'

export const settingsService = {
  async getAll(): Promise<AllSettings> {
    return getRepositories().settings.getAll()
  },

  async updateSection<K extends SettingsSection>(section: K, values: AllSettings[K]): Promise<AllSettings[K]> {
    return getRepositories().settings.updateSection(section, values)
  },
}
