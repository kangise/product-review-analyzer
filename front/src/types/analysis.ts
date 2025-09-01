// Analysis Types for Regen AI
export interface AnalysisResult {
  id: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  modules: AnalysisModules;
  metadata: AnalysisMetadata;
}

export interface AnalysisModules {
  product_type: ProductTypeResult;
  consumer_profile: ConsumerProfileResult;
  consumer_scenario: ConsumerScenarioResult;
  consumer_motivation: ConsumerMotivationResult;
  consumer_love: ConsumerLoveResult;
  unmet_needs: UnmetNeedsResult;
  opportunity: OpportunityResult;
  star_rating_root_cause: StarRatingResult;
  competitor: CompetitorResult;
}

export interface AnalysisMetadata {
  fileName: string;
  fileSize: number;
  reviewCount: number;
  language: 'en' | 'zh';
  processingTime?: number;
}

// Individual Module Results
export interface ProductTypeResult {
  category: string;
  subcategory: string;
  confidence: number;
  attributes: string[];
}

export interface ConsumerProfileResult {
  primary_personas: ConsumerPersona[];
  demographics: Demographics;
  behavior_patterns: BehaviorPattern[];
}

export interface ConsumerPersona {
  name: string;
  description: string;
  percentage: number;
  characteristics: string[];
  pain_points: string[];
}

export interface Demographics {
  age_groups: { range: string; percentage: number }[];
  usage_frequency: { type: string; percentage: number }[];
  experience_level: { level: string; percentage: number }[];
}

export interface BehaviorPattern {
  pattern: string;
  description: string;
  frequency: number;
  impact: 'high' | 'medium' | 'low';
}

export interface ConsumerScenarioResult {
  primary_scenarios: UsageScenario[];
  scenario_distribution: { scenario: string; percentage: number }[];
  context_factors: string[];
}

export interface UsageScenario {
  name: string;
  description: string;
  frequency: number;
  user_journey: string[];
  pain_points: string[];
  success_factors: string[];
}

export interface ConsumerMotivationResult {
  primary_motivations: Motivation[];
  decision_factors: DecisionFactor[];
  emotional_drivers: EmotionalDriver[];
}

export interface Motivation {
  type: string;
  description: string;
  strength: number;
  supporting_quotes: string[];
}

export interface DecisionFactor {
  factor: string;
  importance: number;
  influence_direction: 'positive' | 'negative' | 'neutral';
}

export interface EmotionalDriver {
  emotion: string;
  trigger: string;
  impact: number;
}

export interface ConsumerLoveResult {
  love_points: LovePoint[];
  satisfaction_drivers: SatisfactionDriver[];
  positive_sentiment_themes: string[];
}

export interface LovePoint {
  feature: string;
  description: string;
  mention_frequency: number;
  sentiment_score: number;
  representative_quotes: string[];
}

export interface SatisfactionDriver {
  driver: string;
  impact_score: number;
  correlation_strength: number;
}

export interface UnmetNeedsResult {
  critical_gaps: UnmetNeed[];
  improvement_areas: ImprovementArea[];
  market_opportunities: string[];
}

export interface UnmetNeed {
  need: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  market_size: number;
  supporting_evidence: string[];
}

export interface ImprovementArea {
  area: string;
  current_pain_points: string[];
  suggested_improvements: string[];
  priority: number;
}

export interface OpportunityResult {
  product_improvement: ProductImprovement[];
  product_innovation: ProductInnovation[];
  marketing_positioning: MarketingPositioning[];
}

export interface ProductImprovement {
  opportunity: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeline: string;
  success_metrics: string[];
}

export interface ProductInnovation {
  innovation: string;
  description: string;
  market_potential: number;
  technical_feasibility: number;
  competitive_advantage: string;
  target_segments: string[];
}

export interface MarketingPositioning {
  position: string;
  description: string;
  target_audience: string;
  key_messages: string[];
  differentiation: string;
  channels: string[];
}

export interface StarRatingResult {
  rating_distribution: { stars: number; percentage: number; count: number }[];
  rating_drivers: RatingDriver[];
  improvement_impact: ImprovementImpact[];
}

export interface RatingDriver {
  factor: string;
  correlation: number;
  impact_direction: 'positive' | 'negative';
  evidence: string[];
}

export interface ImprovementImpact {
  improvement: string;
  potential_rating_increase: number;
  affected_percentage: number;
}

export interface CompetitorResult {
  competitive_landscape: CompetitorAnalysis[];
  market_positioning: MarketPosition;
  competitive_advantages: string[];
  threats: string[];
}

export interface CompetitorAnalysis {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  market_share: number;
  user_sentiment: number;
}

export interface MarketPosition {
  current_position: string;
  recommended_position: string;
  positioning_strategy: string[];
}

// UI Component Props
export interface InsightTableProps {
  title: string;
  data: any[];
  columns: TableColumn[];
  expandable?: boolean;
  quotable?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'percentage' | 'badge' | 'progress';
  sortable?: boolean;
  width?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: string[];
  title: string;
}
