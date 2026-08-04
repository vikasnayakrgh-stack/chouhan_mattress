import type { AllSettings, SettingsSection } from '@/features/settings/types'
import { mockSettings } from '@/data/admin/settings.mock'

let settings: AllSettings = JSON.parse(JSON.stringify(mockSettings)) as AllSettings

export class MockSettingsRepository {
  async getAll(): Promise<AllSettings> {
    return JSON.parse(JSON.stringify(settings)) as AllSettings
  }

  async updateSection<K extends SettingsSection>(section: K, values: AllSettings[K]): Promise<AllSettings[K]> {
    settings = { ...settings, [section]: values }
    return JSON.parse(JSON.stringify(settings[section])) as AllSettings[K]
  }
}

export const settingsRepository = new MockSettingsRepository()
