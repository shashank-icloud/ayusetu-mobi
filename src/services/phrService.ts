/**
 * PHR (Personal Health Records) Service
 * Manages patient health records, consent, and data sharing
 * ABDM Compliant - Patient-First Architecture
 */

export { phrService } from '../../backend/phr/phrService';
export type {
    HealthRecordType,
    HealthRecord,
    ConsentRequest,
    ConsentArtifact,
    HealthTimeline,
    TimelineEvent,
} from '../../backend/types/phr';
