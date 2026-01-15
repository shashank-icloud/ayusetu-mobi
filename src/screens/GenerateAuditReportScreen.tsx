import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { complianceService } from '../services/complianceService';
import type { AuditReport } from '../services/complianceService';

const GenerateAuditReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<AuditReport | null>(null);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [includeDataAccess, setIncludeDataAccess] = useState(true);
  const [includeConsents, setIncludeConsents] = useState(true);
  const [includeABDM, setIncludeABDM] = useState(true);
  const [includeUserActivity, setIncludeUserActivity] = useState(true);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');

  const getDateRange = () => {
    const now = new Date();
    const to = now.toISOString();
    let from: string;

    switch (dateRange) {
      case '7days':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30days':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '90days':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'all':
        from = new Date(2020, 0, 1).toISOString();
        break;
    }

    return { from, to };
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const range = getDateRange();
      const report = await complianceService.generateAuditReport({
        userId: 'user-001',
        dateRange: range,
        includeDataAccess,
        includeConsents,
        includeABDMTransactions: includeABDM,
        includeUserActivity,
        format,
      });
      setGeneratedReport(report);
      Alert.alert('Success', 'Audit report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate audit report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!generatedReport) return;

    try {
      Alert.alert('Download Started', 'Your report is being downloaded...');
      // In real app, this would trigger actual download
      const blob = await complianceService.downloadAuditReport(generatedReport.id);
      // Handle blob download based on platform
      console.log('Downloaded blob:', blob);
    } catch (error) {
      Alert.alert('Error', 'Failed to download report');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatExpiry = (expiresAt: string): string => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffHours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h`;
  };

  return (
    <ScrollView style={styles.container}>
      {!generatedReport ? (
        <>
          {/* Date Range Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date Range</Text>
            <View style={styles.optionsGrid}>
              {[
                { key: '7days', label: 'Last 7 Days' },
                { key: '30days', label: 'Last 30 Days' },
                { key: '90days', label: 'Last 90 Days' },
                { key: 'all', label: 'All Time' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionChip,
                    dateRange === option.key && styles.optionChipActive,
                  ]}
                  onPress={() => setDateRange(option.key as typeof dateRange)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      dateRange === option.key && styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Include Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Include in Report</Text>
            
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIncludeDataAccess(!includeDataAccess)}
            >
              <View style={styles.checkbox}>
                {includeDataAccess && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxInfo}>
                <Text style={styles.checkboxLabel}>Data Access Logs</Text>
                <Text style={styles.checkboxDescription}>
                  Who accessed your health records
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIncludeConsents(!includeConsents)}
            >
              <View style={styles.checkbox}>
                {includeConsents && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxInfo}>
                <Text style={styles.checkboxLabel}>Consent History</Text>
                <Text style={styles.checkboxDescription}>
                  All consent grants and revocations
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIncludeABDM(!includeABDM)}
            >
              <View style={styles.checkbox}>
                {includeABDM && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxInfo}>
                <Text style={styles.checkboxLabel}>ABDM Transactions</Text>
                <Text style={styles.checkboxDescription}>
                  Gateway interactions and data transfers
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIncludeUserActivity(!includeUserActivity)}
            >
              <View style={styles.checkbox}>
                {includeUserActivity && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxInfo}>
                <Text style={styles.checkboxLabel}>Your Activity</Text>
                <Text style={styles.checkboxDescription}>
                  Your own actions and changes
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Format Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Format</Text>
            <View style={styles.formatButtons}>
              {[
                { key: 'pdf', label: 'PDF', icon: '📄' },
                { key: 'csv', label: 'CSV', icon: '📊' },
                { key: 'json', label: 'JSON', icon: '{ }' },
              ].map((fmt) => (
                <TouchableOpacity
                  key={fmt.key}
                  style={[
                    styles.formatButton,
                    format === fmt.key && styles.formatButtonActive,
                  ]}
                  onPress={() => setFormat(fmt.key as typeof format)}
                >
                  <Text style={styles.formatIcon}>{fmt.icon}</Text>
                  <Text
                    style={[
                      styles.formatText,
                      format === fmt.key && styles.formatTextActive,
                    ]}
                  >
                    {fmt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerateReport}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.generateButtonText}>Generating...</Text>
              </>
            ) : (
              <Text style={styles.generateButtonText}>Generate Audit Report</Text>
            )}
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📋 About Audit Reports</Text>
            <Text style={styles.infoText}>
              Audit reports provide comprehensive logs of all activities related to your
              health data. Reports are generated on-demand and are available for download
              for 24 hours.
            </Text>
            <Text style={styles.infoText}>
              • Reports include timestamps and IP addresses{'\n'}
              • All data is ABDM compliant{'\n'}
              • Reports expire after 24 hours{'\n'}
              • Suitable for compliance and record-keeping
            </Text>
          </View>
        </>
      ) : (
        <>
          {/* Report Generated Success */}
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Report Generated!</Text>
            <Text style={styles.successSubtitle}>
              Your audit report is ready for download
            </Text>

            <View style={styles.reportDetails}>
              <View style={styles.reportDetailRow}>
                <Text style={styles.reportDetailLabel}>Report ID:</Text>
                <Text style={styles.reportDetailValue}>{generatedReport.id}</Text>
              </View>
              <View style={styles.reportDetailRow}>
                <Text style={styles.reportDetailLabel}>Format:</Text>
                <Text style={styles.reportDetailValue}>{generatedReport.format.toUpperCase()}</Text>
              </View>
              <View style={styles.reportDetailRow}>
                <Text style={styles.reportDetailLabel}>Size:</Text>
                <Text style={styles.reportDetailValue}>
                  {formatFileSize(generatedReport.sizeBytes)}
                </Text>
              </View>
              <View style={styles.reportDetailRow}>
                <Text style={styles.reportDetailLabel}>Total Logs:</Text>
                <Text style={styles.reportDetailValue}>{generatedReport.summary.totalLogs}</Text>
              </View>
              <View style={styles.reportDetailRow}>
                <Text style={styles.reportDetailLabel}>Expires in:</Text>
                <Text style={styles.reportDetailValue}>
                  {formatExpiry(generatedReport.expiresAt)}
                </Text>
              </View>
            </View>

            <View style={styles.reportSummary}>
              <Text style={styles.reportSummaryTitle}>Included in Report:</Text>
              <Text style={styles.reportSummaryItem}>
                ✓ {generatedReport.summary.dataAccessLogs} Data Access Logs
              </Text>
              <Text style={styles.reportSummaryItem}>
                ✓ {generatedReport.summary.consentLogs} Consent Logs
              </Text>
              <Text style={styles.reportSummaryItem}>
                ✓ {generatedReport.summary.abdmLogs} ABDM Transactions
              </Text>
              <Text style={styles.reportSummaryItem}>
                ✓ {generatedReport.summary.userActivityLogs} User Activity Logs
              </Text>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadReport}
            >
              <Text style={styles.downloadButtonText}>⬇️ Download Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.generateAnotherButton}
              onPress={() => setGeneratedReport(null)}
            >
              <Text style={styles.generateAnotherButtonText}>Generate Another Report</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  optionChipActive: {
    backgroundColor: '#3b82f6',
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  optionChipTextActive: {
    color: '#ffffff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '700',
  },
  checkboxInfo: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  formatButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  formatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  formatText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  formatTextActive: {
    color: '#3b82f6',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
    marginBottom: 8,
  },
  successCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  reportDetails: {
    width: '100%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  reportDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportDetailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  reportDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  reportSummary: {
    width: '100%',
    marginBottom: 20,
  },
  reportSummaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reportSummaryItem: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 6,
  },
  downloadButton: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  generateAnotherButton: {
    width: '100%',
    paddingVertical: 12,
  },
  generateAnotherButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default GenerateAuditReportScreen;
