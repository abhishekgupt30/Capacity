const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = {
  '\\bweeklyCapacity\\b': 'weekly_capacity',
  '\\ballocatedHours\\b': 'allocated_hours',
  '\\bcompletedHours\\b': 'completed_hours',
  '\\bovertimeHours\\b': 'overtime_hours',
  '\\befficiencyIndex\\b': 'efficiency_index',
  '\\bblockersCount\\b': 'blockers_count',
  '\\bactiveTaskCount\\b': 'active_task_count',
  '\\bteamId\\b': 'team_id',
  '\\bteamName\\b': 'team_name',
  '\\bleadName\\b': 'lead_name',
  '\\bleadId\\b': 'lead_id',
  '\\bmembersCount\\b': 'members_count',
  '\\bprimaryFocus\\b': 'primary_focus',
  '\\bestimatedHours\\b': 'estimated_hours',
  '\\bassigneeId\\b': 'assignee_id',
  '\\bassigneeName\\b': 'assignee_name',
  '\\bassigneeAvatar\\b': 'assignee_avatar',
  '\\bprojectKey\\b': 'project_key',
  '\\bblockerRisk\\b': 'blocker_risk',
  '\\bcreatedAt\\b': 'created_at',
  '\\bemployeeId\\b': 'employee_id',
  '\\bemployeeName\\b': 'employee_name',
  '\\bemployeeTitle\\b': 'employee_title',
  '\\bemployeeAvatar\\b': 'employee_avatar',
  '\\brequestedHours\\b': 'requested_hours',
  '\\bcurrentCapacityHours\\b': 'current_capacity_hours',
  '\\bcurrentAllocatedHours\\b': 'current_allocated_hours',
  '\\bprojectName\\b': 'project_name',
  '\\breviewedBy\\b': 'reviewed_by',
  '\\breviewedAt\\b': 'reviewed_at',
  '\\bmanagerNotes\\b': 'manager_notes',
  '\\bavatarUrl\\b': 'avatar_url',
  '\\bcurrentHours\\b': 'current_hours',
  '\\bactiveResources\\b': 'active_resources',
  '\\btotalCapacityHours\\b': 'total_capacity_hours',
  '\\btotalAllocatedHours\\b': 'total_allocated_hours',
  '\\butilizationRate\\b': 'utilization_rate',
  '\\bblockersIdentified\\b': 'blockers_identified',
  '\\bavgCycleTimeDays\\b': 'avg_cycle_time_days',
  '\\bcriticalDependencies\\b': 'critical_dependencies',
  '\\boverloadedMembersCount\\b': 'overloaded_members_count',
  '\\btaskId\\b': 'task_id',
  '\\btaskTitle\\b': 'task_title',
  '\\bfromMemberId\\b': 'from_member_id',
  '\\bfromMemberName\\b': 'from_member_name',
  '\\btoMemberId\\b': 'to_member_id',
  '\\btoMemberName\\b': 'to_member_name',
  '\\bconfidenceScore\\b': 'confidence_score',
  '\\bbeforeHours\\b': 'before_hours',
  '\\bproposedHours\\b': 'proposed_hours',
  '\\bcapacityHours\\b': 'capacity_hours',
  '\\bbeforeStatus\\b': 'before_status',
  '\\bproposedStatus\\b': 'proposed_status',
  '\\bbeforeUtilization\\b': 'before_utilization',
  '\\bproposedUtilization\\b': 'proposed_utilization',
  '\\bgeneratedAt\\b': 'generated_at',
  '\\bmemberComparisons\\b': 'member_comparisons',
  '\\bexpectedImpact\\b': 'expected_impact',
  '\\boverloadReductionPercent\\b': 'overload_reduction_percent',
  '\\bburnoutRiskReductionPercent\\b': 'burnout_risk_reduction_percent',
  '\\bvelocityGainMultiplier\\b': 'velocity_gain_multiplier',
  '\\bpredictedCycleTimeSavingsDays\\b': 'predicted_cycle_time_savings_days',
  '\\bbalancedRatio\\b': 'balanced_ratio',
  '\\bpodName\\b': 'pod_name',
  '\\bmetricImpact\\b': 'metric_impact',
  '\\bsuggestedAction\\b': 'suggested_action',
  // Fix minor typo cases
  'memberId:': 'member_id:',
  'memberName:': 'member_name:'
};

let modifiedFiles = 0;

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const origContent = content;
      
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
      }
      
      if (content !== origContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        modifiedFiles++;
        console.log(`Refactored: ${fullPath}`);
      }
    }
  }
}

walkDir(srcDir);
console.log(`Total files refactored: ${modifiedFiles}`);
