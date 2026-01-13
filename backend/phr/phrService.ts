import axios from 'axios';
import { Config } from '../../src/config/env';
import type {
  ConsentArtifact,
  ConsentRequest,
  HealthRecord,
  HealthRecordType,
  HealthTimeline,
  TimelineEvent,
} from '../types/phr';

/**
 * PHR (Personal Health Records) Service
 * Backend/service-layer version of the in-app implementation.
 */

const phrApi = axios.create({
  baseURL: Config.getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mapRecordToTimelineEventType = (recordType: HealthRecordType): TimelineEvent['type'] => {
  switch (recordType) {
    case 'opd_prescription':
      return 'prescription';
    case 'lab_report':
      return 'test';
    case 'ipd_discharge_summary':
      return 'admission';
    case 'vaccination':
      return 'vaccination';
    case 'imaging':
      return 'test';
    case 'surgery_note':
      return 'admission';
    case 'emergency_visit':
      return 'admission';
    case 'dental_record':
      return 'consultation';
    case 'mental_health_record':
      return 'consultation';
    default:
      return 'consultation';
  }
};

const buildTimelineFromRecords = (records: HealthRecord[]): HealthTimeline[] => {
  const byDate = new Map<string, TimelineEvent[]>();

  for (const r of records) {
    const date = r.date;
    const events = byDate.get(date) ?? [];

    const evt: TimelineEvent = {
      id: `evt-${r.id}`,
      type: mapRecordToTimelineEventType(r.type),
      title:
        r.type === 'opd_prescription'
          ? 'OPD Prescription'
          : r.type === 'ipd_discharge_summary'
            ? 'IPD Discharge'
            : r.type === 'lab_report'
              ? 'Lab Report'
              : r.type === 'imaging'
                ? 'Imaging'
                : r.type === 'vaccination'
                  ? 'Vaccination'
                  : r.type === 'surgery_note'
                    ? 'Surgery Note'
                    : r.type === 'emergency_visit'
                      ? 'Emergency Visit'
                      : r.type === 'dental_record'
                        ? 'Dental Record'
                        : r.type === 'mental_health_record'
                          ? 'Mental Health'
                          : 'Health Record',
      description: r.title,
      location: r.providerName || r.hospitalName,
      recordId: r.id,
    };

    events.push(evt);
    byDate.set(date, events);
  }

  return Array.from(byDate.entries())
    .map(([date, events]) => ({
      date,
      events: events.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

// Keep mock records local to backend folder as the single source of truth in DEV mode.
const mockHealthRecords: HealthRecord[] = [
  {
    id: 'rec-001',
    type: 'lab_report',
    title: 'Complete Blood Count (CBC)',
    date: '2026-01-10',
    hospitalName: 'Apollo Hospital',
    doctorName: 'Dr. Sarah Johnson',
    providerId: 'hfr-apollo-001',
    providerName: 'Apollo Hospital',
    visitId: 'visit-2026-01-10-apollo-opd-1',
    episodeId: 'episode-viral-fever-2026-01',
    episodeTitle: 'Viral Fever (Jan 2026)',
    conditionName: 'Fever',
    category: 'Pathology',
    tags: ['blood test', 'routine'],
    isLocal: false,
  },
  // ... keep remaining mock dataset in src/services/phrService.ts for now ...
];

export const phrService = {
  async getHealthRecords(): Promise<HealthRecord[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockHealthRecords;
    }

    const response = await phrApi.get('/v1/phr/records');
    return response.data;
  },

  async getHealthTimeline(): Promise<HealthTimeline[]> {
    const records = await this.getHealthRecords();
    return buildTimelineFromRecords(records);
  },

  async getConsentRequests(): Promise<ConsentRequest[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return [];
    }

    const response = await phrApi.get('/v1/phr/consent/requests');
    return response.data;
  },

  async getConsentArtifacts(): Promise<ConsentArtifact[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return [];
    }

    const response = await phrApi.get('/v1/phr/consent/artifacts');
    return response.data;
  },
};
