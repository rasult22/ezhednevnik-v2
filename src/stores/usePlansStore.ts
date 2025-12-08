import { create } from 'zustand';
import { NinetyDayPlan, Project, STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';

interface PlansState {
  plans: NinetyDayPlan[];
  activePlan: NinetyDayPlan | null;
  isLoading: boolean;

  // Actions
  loadPlans: () => void;
  createPlan: (
    startDate: string,
    endDate: string,
    projects: string[]
  ) => NinetyDayPlan;
  updatePlan: (planId: string, updates: Partial<NinetyDayPlan>) => void;
  completePlan: (planId: string) => void;
  archivePlan: (planId: string) => void;
  updateProject: (
    planId: string,
    projectId: string,
    updates: Partial<Project>
  ) => void;
  toggleProjectCompletion: (planId: string, projectId: string) => void;
  transferProjects: (fromPlanId: string, projectIds: string[]) => Project[];
  getPlan: (planId: string) => NinetyDayPlan | undefined;
}

/**
 * Plans Store - Manages 90-day plans
 */
export const usePlansStore = create<PlansState>((set, get) => ({
  plans: [],
  activePlan: null,
  isLoading: true,

  /**
   * Load plans from LocalStorage
   */
  loadPlans: () => {
    const plans = storageService.load<NinetyDayPlan[]>(STORAGE_KEYS.PLANS_90DAY);

    if (!plans) {
      storageService.saveImmediate(STORAGE_KEYS.PLANS_90DAY, []);
      set({ plans: [], activePlan: null, isLoading: false });
    } else {
      const active = plans.find((p) => p.status === 'active') || null;
      set({ plans, activePlan: active, isLoading: false });
    }
  },

  /**
   * Create a new 90-day plan
   * Automatically completes any existing active plan
   */
  createPlan: (startDate: string, endDate: string, projectTitles: string[]) => {
    const { plans } = get();

    // Complete existing active plan
    const updatedPlans = plans.map((p) =>
      p.status === 'active' ? { ...p, status: 'completed' as const } : p
    );

    // Create new plan
    const projects: Project[] = projectTitles.map((title) => ({
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const newPlan: NinetyDayPlan = {
      id: crypto.randomUUID(),
      startDate,
      endDate,
      projects,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allPlans = [...updatedPlans, newPlan];

    storageService.saveImmediate(STORAGE_KEYS.PLANS_90DAY, allPlans);
    set({ plans: allPlans, activePlan: newPlan });

    return newPlan;
  },

  /**
   * Update a plan
   */
  updatePlan: (planId: string, updates: Partial<NinetyDayPlan>) => {
    const { plans } = get();

    const updatedPlans = plans.map((p) =>
      p.id === planId
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    );

    const active = updatedPlans.find((p) => p.status === 'active') || null;

    storageService.saveDebounced(STORAGE_KEYS.PLANS_90DAY, updatedPlans);
    set({ plans: updatedPlans, activePlan: active });
  },

  /**
   * Mark plan as completed
   */
  completePlan: (planId: string) => {
    get().updatePlan(planId, { status: 'completed' });
  },

  /**
   * Archive a plan
   */
  archivePlan: (planId: string) => {
    get().updatePlan(planId, { status: 'archived' });
  },

  /**
   * Update a project within a plan
   */
  updateProject: (
    planId: string,
    projectId: string,
    updates: Partial<Project>
  ) => {
    const { plans } = get();

    const updatedPlans = plans.map((plan) => {
      if (plan.id !== planId) return plan;

      return {
        ...plan,
        projects: plan.projects.map((proj) =>
          proj.id === projectId
            ? { ...proj, ...updates, updatedAt: new Date().toISOString() }
            : proj
        ),
        updatedAt: new Date().toISOString(),
      };
    });

    const active = updatedPlans.find((p) => p.status === 'active') || null;

    storageService.saveDebounced(STORAGE_KEYS.PLANS_90DAY, updatedPlans);
    set({ plans: updatedPlans, activePlan: active });
  },

  /**
   * Toggle project completion status
   */
  toggleProjectCompletion: (planId: string, projectId: string) => {
    const { plans } = get();
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const project = plan.projects.find((p) => p.id === projectId);
    if (!project) return;

    get().updateProject(planId, projectId, { completed: !project.completed });
  },

  /**
   * Transfer projects from one plan to another
   * Returns the transferred projects for use in new plan creation
   */
  transferProjects: (fromPlanId: string, projectIds: string[]): Project[] => {
    const { plans } = get();
    const fromPlan = plans.find((p) => p.id === fromPlanId);
    if (!fromPlan) return [];

    return fromPlan.projects
      .filter((p) => projectIds.includes(p.id))
      .map((p) => ({
        ...p,
        id: crypto.randomUUID(), // New ID for transferred project
        transferredFrom: fromPlanId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
  },

  /**
   * Get a specific plan by ID
   */
  getPlan: (planId: string) => {
    return get().plans.find((p) => p.id === planId);
  },
}));
